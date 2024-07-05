---
title: "Polls"
description: "Polls technical documentation"
weight: 65
chapter: false
livechatnotranslation: true
---

The poll system relies on two thinks:

* mod_muc_polls Prosody module on the backend
* polls Converse plugin on the frontend

## Backend

mod_muc_polls is a Prosody modules that implements polls in MUC.
This module could be used on any Prosody server, and has no code specific to the livechat plugin.

The way this module works could be standardized one day, by writing a XEP.

### Poll creation

This module adds the `http://jabber.org/protocol/muc#x-poll` disco features on `muc-disco#info`.

Room's owner and admin can retrieve a `http://jabber.org/protocol/muc#x-poll` form by sending the relevant iq query.
This forms contains relevant fields (the poll question, the duration, choices, ...).
Once the form submitted, a new poll is created.
Any previous existing poll will end (if not already ended).

The current poll is stored in `room._data.current_poll`.

For now, any ended poll is not kept.

### Poll starts

When a poll is started, a `groupchat` message is broadcasted in the MUC room.
This message is sent in the name of the poll creator (same `from`, same `occupant-id`).
This message contains the question, the different choices, and some instructions (in english).

This message also contains some specific XML tags.
These tags could be use by any compatible client to display the poll as they want.

Here an Example of this start message:

```xml
<message id='25Plgjj2TdemFuomNuKZ9bxRQFLbiVHwc8_4'
  to='root@p1.localhost/converse.js-117702469' xmlns='jabber:client' from='5dd144b2-3c24-4cbc-a34e-143e951ecf50@room.p1.localhost/Root' type='groupchat'>
<body>The poll question
1: Choice 1 label
2: Choice 2 label
Send a message with an exclamation mark followed by your choice number to vote. Example: !1
</body>
<occupant-id id='yoXY0/DaHd03MpGsc+ayjEFZ5UIWt6JmrxC+6HPz4qM=' xmlns='urn:xmpp:occupant-id:0'/>
<x-poll id='_eZQ4j4YLHTK' xmlns='http://jabber.org/protocol/muc#x-poll-message' end='1720177157' votes='0'>
  <x-poll-question>The poll question</x-poll-question>
  <x-poll-choice choice='1' votes='0'>Choice 1 label</x-poll-choice>
  <x-poll-choice choice='2' votes='0'>Choice 2 label</x-poll-choice>
</x-poll>
<stanza-id xmlns='urn:xmpp:sid:0' id='dOASuopT9kW5OgAKvhZo0Irm' by='5dd144b2-3c24-4cbc-a34e-143e951ecf50@room.p1.localhost'/>
</message>
```

Note: the `end` attribute is the poll end date timestamp. The `votes` attributes are the number of votes (total on `x-poll` and per choice on each `x-poll-choice` tag). The `choice` attribute is the key to use to vote for this choice (`choice='1'` can by voted by sending `!1`).

### Poll votes

Users can then vote by sending messages in the room, using the format "!1".

These groupchat messages will be intercepted by the module, and counted as votes.

If the "anonymous votes" feature is enabled, vote will be taken into account, but the message will be bounced with an error saying: "Your vote is taken into account. Votes are anonymous, they will not be shown to other participants."

This means that you can vote with any XMPP clients!

If an occupant votes multiple times, their vote will be updated.

If an occupant is muted (has visitor role), votes won't be counted.

When there are new votes, messages are broadcated so that compatible clients can update the current vote progress.
These messages are debounced: the module waits 5 seconds after a vote to send the update message, and only send one for all votes that were done in those 5 seconds.
These messages are `groupchat` message without `body`, and with some specific `urn:xmpp:hints`.
They contains the `x-poll` tag with same meta data as above.
The message is also sent as the poll creator (`from` and `occupant-id`).

Here is an example:

```xml
<message id='jm9dsXD73eXxlAP2M4dOhay7oXBlQb91LVBf' 
  to='root@p1.localhost/converse.js-117702469' xmlns='jabber:client'
  from='5dd144b2-3c24-4cbc-a34e-143e951ecf50@room.p1.localhost/Root'
  type='groupchat'>
  <occupant-id id='yoXY0/DaHd03MpGsc+ayjEFZ5UIWt6JmrxC+6HPz4qM=' xmlns='urn:xmpp:occupant-id:0'/>
  <no-copy xmlns='urn:xmpp:hints'/>
  <no-store xmlns='urn:xmpp:hints'/>
  <no-permanent-store xmlns='urn:xmpp:hints'/>
  <x-poll id='06yCKW_hoZSx' xmlns='http://jabber.org/protocol/muc#x-poll-message' end='1720177925' votes='1'>
    <x-poll-question>The poll question</x-poll-question>
    <x-poll-choice choice='1' votes='1'>Choice 1 label</x-poll-choice>
    <x-poll-choice choice='2' votes='0'>Choice 2 label</x-poll-choice>
  </x-poll>
</message>
```

Note: Standards XMPP clients won't be able to show the progress.

When a user joins the MUC, a similar message will be sent to this user (and this user only, to the new occupant session to be more specific).
This is done so that any compatible client can immediatly show the poll.

Note: clients should ignored `x-poll` data from archived messages, and only consider data comming from unarchived messages.
Otherwise they could show some outdated data.

### Poll end

When the poll ends, a new groupchat message is broadcasted in the room.

Here is an example:

```xml
<message id='GVqv1YcwI0GZb0myKhmtEqRa9fvWlCbDdF7R'
  to='root@p1.localhost/converse.js-117702469' xmlns='jabber:client'
  from='5dd144b2-3c24-4cbc-a34e-143e951ecf50@room.p1.localhost/Root'
  type='groupchat'>
<body>The poll question
This poll is now over.
1: Choice 1 label
2: Choice 2 label
</body>
<occupant-id id='yoXY0/DaHd03MpGsc+ayjEFZ5UIWt6JmrxC+6HPz4qM=' xmlns='urn:xmpp:occupant-id:0'/>
<x-poll id='_eZQ4j4YLHTK'
  votes='5' xmlns='http://jabber.org/protocol/muc#x-poll-message'
  end='1720177157'
  over=''
>
  <x-poll-question>The poll question</x-poll-question>
  <x-poll-choice choice='1' votes='3'>Choice 1 label</x-poll-choice>
  <x-poll-choice choice='2' votes='2'>Choice 2 label</x-poll-choice>
</x-poll>
<stanza-id xmlns='urn:xmpp:sid:0' id='CwiijSxawB8QOP4NN-Li6jP0' by='5dd144b2-3c24-4cbc-a34e-143e951ecf50@room.p1.localhost'/>
</message>
```

Please note the `over` attributes that indicated that the poll is over.

If users are voting just after the poll ends (less than 30 seconds after the poll end), and the vote is anonymous, their votes will be bounced, to avoid leaking votes for late users.

### Security

Following tags will be stripped of any incoming groupchat message: `x-poll`, `x-poll-question`, `x-poll-choice`.
This is to avoid any poll spoofing.

## Fronted

The poll Converse plugin does multiple things.

It checks for the `http://jabber.org/protocol/muc#x-poll` disco feature to show the "create poll" button.

It uses standards XMPP forms to get the poll creation form and submit it.

It uses the `parseMUCMessage` hook to check if messages have `x-poll` data.

If so, and if message are not archived, it creates or updates the poll banner.

When clicking on a choice in the banner, it just sends a message in the chat ("!1" for example).

As the backend does no localization, it also translate on the fly the english sentences comming from the backend (in the form definition, in poll start/end message, and in bounce/error messages).
