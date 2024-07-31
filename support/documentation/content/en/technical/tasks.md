---
title: "Tasks overview"
description: "Task Application technical overview"
weight: 70
chapter: false
livechatnotranslation: true
---

The livechat plugin includes a [Task Application](/peertube-plugin-livechat/documentation/user/streamers/tasks).
The present document describes how this is implemented.

## Basics

This features relies on [XEP-0060: Publish-Subscribe](https://xmpp.org/extensions/xep-0060.html).
This XEP provide a way to store and retrieve items, and to receive push notifications when an item is created/deleted/modified.

There is a Prosody Module, [mod_pubsub_peertubelivechat](https://github.com/JohnXLivingston/peertube-plugin-livechat/tree/main/prosody-modules/mod_pubsub_peertubelivechat), to implement some specific use of the pubsub mechanism.

This module is also used for [Moderator Notes](/peertube-plugin-livechat/technical/moderation_notes/).

We use the [JID+NodeID addressing](https://xmpp.org/extensions/xep-0060.html#addressing-jidnode) to specify some nodes related to each MUC room.
The JID is the MUC room JID, the NodeID is functionnality we want to address.

This modules implement the "livechat-tasks" node, to handle tasks and task lists.

The "livechat-tasks" node contains two type of objects: Task and TaskList (XML Namespaces: `urn:peertube-plugin-livechat:tasklist` and `urn:peertube-plugin-livechat:task`). Tasks have an attribute containing their task list id.

On the front-end, we have the [livechat-converse-tasks](https://github.com/JohnXLivingston/peertube-plugin-livechat/tree/main/conversejs/custom/plugins/tasks) plugin for ConverseJS.

## Workflow

Here is the basic workflow used to subscribe to tasks/task-lists, and receive existing items.

* the browsers connect to the chat, and ConverseJS uses the [XMPP discovery](https://xmpp.org/extensions/xep-0045.html#disco-roominfo) to get the room features.
* mod_pubsub_peertubelivechat declares two features: `urn:peertube-plugin-livechat:tasklist` and `urn:peertube-plugin-livechat:task`.
* the browsers detect these feature, and checks that the user has admin or owner affiliation on the MUC component.
* if not, won't display the Task Application, and stops here.
* if yes, we will continue:
* display the Task Application.
* Create a new [PubSubManager](https://github.com/JohnXLivingston/peertube-plugin-livechat/tree/main/conversejs/custom/shared/lib/pubsub-manager.js) object, that will subscribe to the pubsub node.
* The backend receives the subscription request, test user rights (must be owner/admin on the MUC), and adds the user to the subscribers.
* Note: a user with multiple browsers tabs will send multiple subscription requests, but this is not an issue.
* If the node did not exist, the backend automatically created it, and use the MUC name to create a first task-list with that name.
* Once subscribed, the frontend will request all current entries.
* The backend tests rights, and send all node entries.
* On the frontend, the PubSubManager handles the response by dispatching received items to the correct frontend component.

Note: on the backend side, we subscribe all users with the "publisher" affiliation level.
This allows them to publish items, but not change the node configuration.

Here is the worflow to create/modify/delete items:

* the frontend send a publish request.
* backend checks rights.
* backend sends notifications to all subscribers, including the current users.
* On the front-end PubSubManager receives the notification, and dispatch it to the relevant component.

## Unsubscribing

When users leaves a MUC room, they are automatically unsubscribed from the "livechat-tasks" node related to this room.

When users lose the owner/admin affiliation, they are removed from the "livechat-tasks" node subscriptions.

## Items

Here we describes the content of node items.

### Task lists

* Item tag: `tasklist`
* XML Namespace: `urn:peertube-plugin-livechat:tasklist`
* item childs:
  * `name`: the text content is the task list name

Example: here is an example of IQ stanza to create a task-list item.

```xml
<iq
  from="user@example.com"
  id="45cf7543-67bf-4d03-bb5d-a55038a0512a:sendIQ"
  to="035fcc4b-072f-4827-b296-6998b04e3456@room.example.com"
  type="set"
  xmlns="jabber:client"
>
  <pubsub xmlns="http://jabber.org/protocol/pubsub">
    <publish node="livechat-tasks">
      <item>
        <tasklist xmlns="urn:peertube-plugin-livechat:tasklist">
          <name>Task List Name</name>
        </tasklist>
      </item>
    </publish>
  </pubsub>
</iq>
```

### Tasks

* Item tag: `task`
* XML Namespace: `urn:peertube-plugin-livechat:task`
* item attributes:
  * `done`: if present and equal to "true", means that the task is done
  * `list`: the list id
  * `order`: the order of the task in the task list
* item childs:
  * `name`: the text content is the task name
  * `description`: the text content is the task description

Example: here is an example of IQ stanza to create a task-list item.

```xml
<iq
  from="user@example.com"
  id="9fd9a162-1b6c-4b38-a2a1-2485b34f0d8d:sendIQ"
  to="035fcc4b-072f-4827-b296-6998b04e3456@room.example.com"
  type="set"
  xmlns="jabber:client"
>
  <pubsub xmlns="http://jabber.org/protocol/pubsub">
    <publish node="livechat-tasks">
      <item>
        <task
          list="8302c024-c16e-4fbd-aca7-c94cdb2025de"
          order="0"
          done="true"
          xmlns="urn:peertube-plugin-livechat:task"
        >
          <name>The task name</name>
          <description>here is the description</description>
        </task>
      </item>
    </publish>
  </pubsub>
</iq>
```

Note: in the above example, we added `done="true"` just for the example.
Don't add the attribute if you want not the task to be marked as done (or if you want to undone the task).
