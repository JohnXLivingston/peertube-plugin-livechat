// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { converse, _converse, api } from '../../../src/headless/index.js'
const { $build, Strophe, $iq, sizzle } = converse.env

/**
 * This class helps to manage some objects that are stored on pubsub nodes.
 * This if for example used for livechat-taskslists and livechat-tasks,
 * but could be used for other object types that would be added one day.
 */
export class PubSubManager {
  roomJID
  node
  types
  stanzaHandler

  /**
   * Created a new pubsub manager.
   * @param {string} roomJID the room JID
   * @param {string} node the node name to which subscribe
   * @param {Array} types an array with object describing the object type, and how to handle them. Here is its format:
   *   {
   *     itemTag: 'task',
   *     xmlns: XMLNS_TASK,
   *     collection: mucModel.tasks,
   *     fields: { // these are item child nodes (tag names)
   *       name: String,
   *     },
   *     attributes: { // these are attribute on the node
   *       order: Number
   *       done: Boolean,
   *       list: String,
   *     }
   *   }
   */
  constructor (roomJID, node, types) {
    this.roomJID = roomJID
    this.node = node
    this.types = types

    this.stanzaHandler = undefined
  }

  /**
   * Starts the manager.
   * This will subscribe to the node, and retrieve all existing objects.
   */
  async start () {
    // FIXME: handle errors. Find a way to display to user that this failed.

    this.stanzaHandler = api.connection.get().addHandler(
      (message) => {
        try {
          this._handleMessage(message)
        } catch (err) {
          console.log(err)
        }
        return true // if returning anything else, the handler will not be called again!
      },
      null, // The namespace to match.
      'message', // The stanza name to match.
      'headline', // The stanza type attribute to match.
      null, // The stanza id attribute to match.
      this.roomJID, // The stanza from attribute to match.
      {
        matchBareFromJid: true
      } // The handler options
    )
    await this._subscribe()
    await this._retrieveAllItems()
  }

  /**
   * Stops the manager
   */
  async stop () {
    // Note: no need to unsubscribe from the pubsub node, the backend will do when users leave the room.

    if (this.stanzaHandler) {
      api.connection.get().deleteHandler(this.stanzaHandler)
      this.stanzaHandler = undefined
    }
  }

  /**
   * Created a new item
   * @param collection The collection handling this object.
   * @param data Object data
   */
  async createItem (collection, data) {
    const type = this._typeFromCollection(collection)
    if (!type) {
      throw new Error('Collection not found in manager')
    }

    console.log('Creating item...')
    await this._save(type, data)
    console.log(`Node ${this.node} created on ${this.roomJID}.`)
  }

  async saveItem (item) {
    const id = item.get('id')
    if (!id) {
      throw new Error('Can\'t delete an empty without ID')
    }

    const type = this._typeFromCollection(item.collection)
    if (!type) {
      throw new Error('Collection not found in manager')
    }

    const data = {}
    for (const attr in (type.attributes ?? [])) {
      const v = item.get(attr)
      if (v === undefined) { continue }
      if (type.attributes[attr] === Boolean && !v) { continue }
      data[attr] = v
    }
    for (const field in (type.fields ?? [])) {
      const v = item.get(field)
      if (v === undefined) { continue }
      data[field] = v
    }
    this._additionalModelToData(item, data)

    console.log('Saving item...')
    await this._save(type, data, id)
    console.log(`Node ${this.node} created on ${this.roomJID}.`)
  }

  async deleteItems (items) {
    await Promise.all[items.map(item => this.deleteItem(item))]
  }

  async deleteItem (item) {
    const id = item.get('id')
    if (!id) {
      throw new Error('Can\'t delete an empty without ID')
    }

    const type = this._typeFromCollection(item.collection)
    if (!type) {
      throw new Error('Can\'t get type definition from item collection')
    }

    console.log('Deleting item ' + id + ' on node ' + this.node + ' for room ' + this.roomJID + '...')

    const stanza = $iq({
      from: _converse.bare_jid,
      type: 'set',
      to: this.roomJID
    }).c('pubsub', { xmlns: Strophe.NS.PUBSUB })
      .c('retract', { node: this.node, notify: '1' })
      .c('item', { id })

    await api.sendIQ(stanza)
    console.log('Item deleted.')
  }

  async _save (type, data, id) {
    const itemAttributes = {}
    if (id) {
      itemAttributes.id = id
    }

    const attributes = { xmlns: type.xmlns }

    for (const attrName in type.attributes ?? []) {
      if (!(attrName in data)) { continue }
      attributes[attrName] = data[attrName]
    }

    const item = $build('item', itemAttributes).c(type.itemTag, attributes)

    for (const fieldName in type.fields ?? []) {
      if (!(fieldName in data)) { continue }
      item.c(fieldName).t(data[fieldName]).up()
    }

    this._additionalDataToItemNode(data, item)

    await api.pubsub.publish(this.roomJID, this.node, item)
  }

  /**
   * Subscribed to the pubsub node.
   */
  async _subscribe () {
    const stanza = $iq({
      type: 'set',
      from: _converse.jid,
      to: this.roomJID
    }).c('pubsub', { xmlns: Strophe.NS.PUBSUB })
      .c('subscribe', { node: this.node, jid: _converse.bare_jid })

    try {
      const iq = await api.sendIQ(stanza)

      console.debug('subscribtion ok: ', iq)
    } catch (iq) {
      console.error('Failed to subscribe to ' + this.node, iq)
      throw iq
    }
  }

  /**
   * Retrieves all items
   *
   * TODO: handle pagination if results are not all sent.
   * See https://xmpp.org/extensions/xep-0060.html#subscriber-retrieve-returnsome
   * (seems Prosody does not handle pagination for now)
   */
  async _retrieveAllItems () {
    // Requesting all items.
    const stanza = $iq({
      type: 'get',
      from: _converse.jid,
      to: this.roomJID
    }).c('pubsub', { xmlns: Strophe.NS.PUBSUB })
      .c('items', { node: this.node })

    try {
      const iq = await api.sendIQ(stanza)
      this._handleIQ(iq)
    } catch (iq) {
      if (iq === null || !iq?.querySelector) {
        console.error('Failed to retrieve objects from ' + this.node, iq)
        throw iq
      }
      if (!iq.querySelector('error[type="cancel"] item-not-found')) {
        console.error('Failed to retrieve objects from ' + this.node + ':', iq)
        throw iq
      }
      // This is totally normal when you open an empty node.
      console.log('Not ' + this.node + ' node for now')
    }
  }

  /**
   * Check if an incomming message contains data to dispatch.
   * @param message The incoming stanza
   */
  _handleMessage (message) {
    const itemsNodes = sizzle(`event[xmlns="${Strophe.NS.PUBSUB}#event"] items[node="${this.node}"]`, message)
    if (!itemsNodes.length) {
      return
    }
    for (const itemsNode of itemsNodes) {
      this._dispatchStanza(itemsNode)
    }
  }

  /**
   * As _handleMessage, but for IQ.
   * @param iq stanza
   */
  _handleIQ (iq) {
    const itemsNodes = sizzle(`pubsub items[node="${this.node}"]`, iq)
    if (!itemsNodes.length) { return }
    for (const itemsNode of itemsNodes) {
      this._dispatchStanza(itemsNode)
    }
  }

  /**
   * Parse items in a stanza response, and dispatch them to collections.
   * @param {stanza} itemsNode the 'items' part of the incomming stanza.
   */
  _dispatchStanza (itemsNode) {
    console.debug('Dispatching items for node ' + this.node + ' from stanza items: ', itemsNode)

    for (const key in this.types) {
      const type = this.types[key]

      const selector = `item ${type.itemTag}[xmlns="${type.xmlns}"]`
      const items = sizzle(selector, itemsNode)
      if (!items.length) { continue }

      console.log('Found ' + items.length + ' ' + type.itemTag + ' in stanza, dispatching...')
      for (const item of items) {
        // Note: we consider that there is only one object in an item.
        const id = item.parentNode?.getAttribute('id')
        if (!id) {
          console.error('Missing id for this item', item)
          continue
        }

        const data = this._parseItem(item, type)
        if (data === null) { continue }

        const existing = type.collection.get(id)
        if (existing) {
          existing.save(data)
        } else {
          type.collection.create(Object.assign(data, { id }))
        }
      }
    }

    this._handleRetractations(itemsNode)
  }

  /**
   * Parse retractations in IQ or Message stanza, and process them.
   * @param stanza IQ response
   */
  _handleRetractations (stanza) {
    // Note: here we don't know the object type. We must try on each collection.
    const ids = sizzle('retract', stanza).map(i => i.getAttribute('id'))
    for (const id of ids) {
      for (const key in this.types) {
        const type = this.types[key]
        const item = type.collection.get(id)
        if (!item) { continue }
        console.log('Removing Item ' + id + ' that was found in collection ' + key)
        type.collection.remove(item)
      }
    }
  }

  _parseItem (itemNode, type) {
    const data = {}
    if (type.fields) {
      for (const child of itemNode.children ?? []) {
        const fieldName = child.tagName
        if (!(fieldName in type.fields)) {
          continue
        }
        data[fieldName] = this._readValue(child.textContent, type.fields[fieldName])
      }
    }
    if (type.attributes) {
      for (const attr in type.attributes) {
        const value = itemNode.getAttribute(attr)
        if (attr !== undefined) {
          data[attr] = this._readValue(value, type.attributes[attr])
        }
      }
    }
    this._additionalParseItemNode(itemNode, type, data)
    return data
  }

  _readValue (v, t) {
    switch (t) {
      case String: return (v ?? '').toString()
      case Number: return parseInt(v) // only integers?
      case Boolean: return !!v
      default: return v // dont know what to do
    }
  }

  _typeFromCollection (collection) {
    return Object.values(this.types).find(type => type.collection === collection)
  }

  /**
   * Overload to add some custom code for model to data conversion.
   */
  _additionalModelToData (_item, _data) {}

  /**
   * Overload to add some custom code for data to stanza conversion.
   */
  _additionalDataToItemNode (_data, _item) {}

  /**
   * Overload to add some custom code item parsing.
   */
  _additionalParseItemNode (_itemNode, _type, _data) {}
}
