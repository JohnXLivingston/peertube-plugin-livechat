---
title: "MUC Slow mode"
description: "MUC Slow mode XEP"
weight: 60
chapter: false
livechatnotranslation: true
---

The livechat plugin includes a "slow mode" feature, to rate limit the number of messages that a user can send to a given MUC room.
At time of writing, there were no [XEP](https://xmpp.org/extensions/) to describe such feature.
Please find below a XEP draft, that will be submitted for review.

{{% notice warning %}}
Work In Progress, this page is not done yet.
{{% /notice %}}

## XEP: MUC Slow Mode

Abstract: This specification describes a way to rate limit messages a single user can send to a MUC room, from the room configuration to the server and client handling of such a feature.

Author: John Livingston

## 1. Introduction

There are some contexts in which you want to be able to rate limit [MUC](https://xmpp.org/extensions/xep-0045.html) messages.
This could have multiple motivations: avoid flooding, garantee a better readability of the room when there are hundreds of active users, ...

This specification will propose to add an option to MUC rooms, allowing room owners to fix a time that users MUST wait between two messages.
We will also specify how the server MUST reject messages send too quickly, and how clients SHOULD handle this feature (by preventing users to send messages without waiting the delay to be over).

## 2. Terminology

Bare JID: The <user@host> by which a user is identified outside the context of any existing session or resource; contrast with Full JID and Occupant JID.

Clients: the client software used by end-users to join MUC rooms.

Full JID: The <user@host/resource> by which an online user is identified outside the context of a room; contrast with Bare JID and Occupant JID.

Moderator: A room role that is usually associated with room admins but that can be granted to non-admins. Is allowed to edit [room information](https://xmpp.org/extensions/xep-0045.html#disco-roominfo). A moderator has a role of "moderator".

MUC: The [multi-user chat protocol for text-based conferencing](https://xmpp.org/extensions/xep-0045.html).

Occupant JID: The <room@service/nick> by which an occupant is identified within the context of a room; contrast with Bare JID and Full JID.

Role: A temporary position or privilege level within a room, distinct from a user's long-lived affiliation with the room; the possible roles are "moderator", "participant", and "visitor" (it is also possible to have no defined role). A role lasts only for the duration of an occupant's visit to a room.

Room JID: The <room@service> address of a room.

Room owner: users that have special access to a room, and that can edit room configuration. See [XEP-0045 - Owner Use Cases](https://xmpp.org/extensions/xep-0045.html#owner).

Service Discovery Extensions: [XEP-0128: Service Discovery Extensions](https://xmpp.org/extensions/xep-0128.html).

Slow Mode: feature allowing to rate limit user messages in a MUC room.

Slow Mode duration: when the Slow Mode feature is active, specifies the time, in seconds, users must wait between two text messages.

## 3. Requirements

This document addresses the following requirements:

* Enable and configure the feature by editing the MUC room discovery information.
* How the server MUST reject messages that does not respect the parameters.
* How clients SHOULD handle rooms with such feature enabled.

## 4. MUC configuration

### 4.1 Activating Slow Mode in the MUC Room configuration

Your implementation CAN allow the Slow Mode feature to be set room by room, by its owners.

If room owners can configure the Slow Mode feature, the server MUST add a `muc#roomconfig_slow_mode_duration` field in the [room configuration form](https://xmpp.org/extensions/xep-0045.html#owner).

This field MUST have its type equal to `text-single`.

This field SHOULD use [Data Forms Validation](https://xmpp.org/extensions/xep-0122.html), having its datatype equal to `xs:integer`.

The `value` of the field MUST be a positive integer. Any invalid value MUST be considered as equal to `0`.

`0` value means that the slow mode is disabled for this room.
Any positive value is the time, in seconds, users must wait between two messages.

Here is an example of response the server could send when a client is querying `muc#owner`(https://xmpp.org/extensions/xep-0045.html#roomconfig):

```xml
<iq from='coven@chat.shakespeare.lit'
    id='config1'
    to='crone1@shakespeare.lit/desktop'
    type='result'>
  <query xmlns='http://jabber.org/protocol/muc#owner'>
    <x xmlns='jabber:x:data' type='form'>
      <title>Configuration for "coven" Room</title>
      <instructions>
        Complete this form to modify the
        configuration of your room.
      </instructions>
      <field
          type='hidden'
          var='FORM_TYPE'>
        <value>http://jabber.org/protocol/muc#roomconfig</value>
      </field>
      <field
        var='muc#roomconfig_slow_mode_duration'
        type='text-single'
        label='Slow Mode (0=disabled, any positive integer= users can send a message every X seconds.)'
      >
        <validate xmlns='http://jabber.org/protocol/xdata-validate' datatype='xs:integer'/>
        <value>20</value>
      </field>
      <!-- and any other field... -->
    </x>
  </query>
</iq>
```

### 4.2 Client discovering

The feature can be enabled on a room:

* by the room owner, if your implementation allow them to set this option
* by a server-wide parameter

In any case, to allow clients to discover that the feature is active, the server MUST respond on [room information queries](https://xmpp.org/extensions/xep-0045.html#disco-roominfo) by adding a `muc#roominfo_slow_mode_duration` field. This field type MUST be `text-single`, and its value MUST be a positive integer.

`0` value means that the slow mode is disabled for this room.
Any positive value is the time, in seconds, users must wait between two messages.

Here is an example of response the server could send when a client is [querying room information](https://xmpp.org/extensions/xep-0045.html#disco-roominfo):

```xml
<iq from='coven@chat.shakespeare.lit'
    id='ik3vs715'
    to='hag66@shakespeare.lit/pda'
    type='result'>
  <query xmlns='http://jabber.org/protocol/disco#info'>
    <identity
        category='conference'
        name='The place to be'
        type='text'/>
    <feature var='http://jabber.org/protocol/muc'/>
    <x xmlns='jabber:x:data' type='result'>
      <field var='FORM_TYPE' type='hidden'>
        <value>http://jabber.org/protocol/muc#roominfo</value>
      </field>
      <field var='muc#roominfo_slow_mode_duration' type='text-single'>
        <value>2</value>
      </field>

      <!-- and any other field... -->
    </x>
  </query>
</iq>
```
