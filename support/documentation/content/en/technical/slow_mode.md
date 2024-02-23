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

This specification propose a new option to MUC rooms, allowing room owners to fix a duration that users MUST wait between two messages.
We will also specify how the server MUST reject messages send too quickly, and how clients SHOULD handle this feature (by preventing users to send messages without waiting the delay to be over).

## 2. Terminology

Clients: the client software used by end-users to join MUC rooms.

Moderator: A room role that is usually associated with room admins but that can be granted to non-admins.

MUC: The [multi-user chat protocol for text-based conferencing](https://xmpp.org/extensions/xep-0045.html).

Participant: An occupant who does not have admin status; in a moderated room, a participant is further defined as having voice (in contrast to a visitor). A participant has a role of "participant".

Role: A temporary position or privilege level within a room, distinct from a user's long-lived affiliation with the room; the possible roles are "moderator", "participant", and "visitor" (it is also possible to have no defined role). A role lasts only for the duration of an occupant's visit to a room. See [XEP-0045](https://xmpp.org/extensions/xep-0045.html).

Room administrator: A user empowered by the room owner to perform administrative functions such as banning users; however, a room administrator is not allowed to change the room configuration or to destroy the room. An admin has an affiliation of "admin". See [XEP-0045](https://xmpp.org/extensions/xep-0045.html).

Room owner: users that have special access to a room, and that can edit room configuration. See [XEP-0045 - Owner Use Cases](https://xmpp.org/extensions/xep-0045.html#owner).

Service Discovery Extensions: [XEP-0128: Service Discovery Extensions](https://xmpp.org/extensions/xep-0128.html).

Slow Mode: feature allowing to rate limit user messages in a MUC room.

Slow Mode duration: when the Slow Mode feature is active, specifies the duration, in seconds, users must wait between two text messages.

## 3. Requirements

This document addresses the following requirements:

* How to allow room owners to enable and configure the feature by editing the MUC room discovery information.
* How to enable and configure the feature without allowing room owners to change the configuration.
* How the server MUST reject messages that does not respect the parameters.
* How clients SHOULD handle rooms with such feature enabled.

## 4. MUC configuration

### 4.1 Activating Slow Mode in the MUC Room configuration

Your implementation MAY allow the Slow Mode feature to be set room by room, by its owners.

If room owners can configure the Slow Mode feature, the server MUST add a `muc#roomconfig_slow_mode_duration` field in the [room configuration form](https://xmpp.org/extensions/xep-0045.html#owner).

This field MUST have its type equal to `text-single`.

This field SHOULD use [Data Forms Validation](https://xmpp.org/extensions/xep-0122.html), having its datatype equal to `xs:integer`.

The `value` of the field MUST be a positive integer, so you MUST add a `range` validation, as described in [RFC-0122](https://xmpp.org/extensions/xep-0122.html).

`0` value means that the slow mode is disabled for this room.
Any positive value is the duration, in seconds, users must wait between two messages.

Here is an example of response the server could send when a client is querying [room configuration form](https://xmpp.org/extensions/xep-0045.html#roomconfig):

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
        <validate xmlns='http://jabber.org/protocol/xdata-validate' datatype='xs:integer'>
          <range min='0'/>
        </validate>
        <value>20</value>
      </field>
      <!-- and any other field... -->
    </x>
  </query>
</iq>
```

If the configuration is changed, the server SHOULD send a status code 104, as specified in [XEP-0045 - Notification of configuration changes](https://xmpp.org/extensions/xep-0045.html#roomconfig-notify).

### 4.2 Client discovering

The feature can be enabled on a room:

* by the room owner, if your implementation allow them to set this option
* by a server-wide parameter

In other words: you can enable this feature, without adding the field in the room configuration form.
This allows for example server admins to apply a rate limit server-wide, or to set the slow mode programmatically on any wanted criteria (number of users in the room, current server load, room context, ...).

In any case, to allow clients to discover that the feature is active, the server MUST respond on [room information queries](https://xmpp.org/extensions/xep-0045.html#disco-roominfo) by adding a `muc#roominfo_slow_mode_duration` field. This field type MUST be `text-single`, and its value MUST be a positive integer.

`0` value means that the slow mode is disabled for this room.
Any positive value is the duration, in seconds, users must wait between two messages.
Any invalid (non-positive integer) value sent by the server MUST be considered as equal to `0` (in case of a bad implementation).

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

If the slow mode duration has changed (either because the room configuration was modified, or because a server parameter has changed), the server SHOULD send a status code 104, as specified in [XEP-0045 - Notification of configuration changes](https://xmpp.org/extensions/xep-0045.html#roomconfig-notify).

## 5. Server-side rate limiting

When the Slow Mode is enabled, server MUST NOT accept two consecutive messages from the same user, to the same room, until the slow mode duration has elapsed.
Only messages containing at least one `body` tag must be taking into account (to avoid counting `chatstate` messages for example).

Room administrators and owners MUST NOT be rate limited.

If a user bypass the limit, the server MUST reply an error stanza, that respects [RFC 6120](https://xmpp.org/rfcs/rfc6120.html#stanzas-error), especially:

* `error_type` MUST be `wait`, as described in [RFC 6120 - Stanzas error - Syntax](https://xmpp.org/rfcs/rfc6120.html#stanzas-error-syntax),
* `error_condition` MUST be `policy-violation`, as described in [RFC 6120 - Stanzas error - Defined Stream Error Conditions](https://xmpp.org/rfcs/rfc6120.html#stanzas-error-conditions),
* the stanza SHOULD contain a `text` tag explaining why the message was rejected, and this message SHOULD mention the slow mode duration so that user can understand why they can't post their message.

Here is an example or error stanza:

```xml
<message
  xmlns="jabber:client"
  type="error"
  to="crone1@shakespeare.lit/desktop" id="528df978-aa6b-422a-b987-056a810c4733" from="coven@chat.shakespeare.lit"
>
  <error type="wait">
    <policy-violation xmlns="urn:ietf:params:xml:ns:xmpp-stanzas" />
    <text xmlns="urn:ietf:params:xml:ns:xmpp-stanzas">
      You have exceeded the limit imposed by the slow mode in this room. You have to wait 2 seconds between messages. Please try again later
    </text>
  </error>
</message>
```

## 6. Client handling

When a participant joins a room, the client SHOULD request room information as described in section "4.2 Client discovering", and look for the `muc#roominfo_slow_mode_duration` field.

If this field is present, and contains a valid strictly positive integer value, the client SHOULD display an information somewhere, to tell users that there is a slow mode limitation that applies to this room.
This information MAY also be displayed to users for which the rate limit does not apply (administrators, owners, ...).

Moreover, each time a participant sends a text message, the client SHOULD prevent the user to send another message before the timeout is passed. This MAY be done either by disabling the input field, or the submit button.
If the user has at least the administrator acces level, the client SHOULD NOT disable the input field or the submit button.

To avoid some frustrating behaviour, in case there is some lag on the server for example, the client MAY start counting time after receiving the message echo.
Indeed, if the first message is processed with some delay by the server, it could consider that the duration is not passed yet when receiving the next one.

## 7. Security Considerations

As a same user can join a room with multiple sessions and/or nicknames, the server MUST use the appropriate key to identify the account, and apply the same limits to all user's sessions.

## Appendices

### Appendix A: Document information

TO BE DONE

### Appendix B: Author Information

John Livingston

Website: https://www.john-livingston.fr

### Appendix C: Legal Notices

TO BE DONE

### Appendix D: Relation to XMPP

The Extensible Messaging and Presence Protocol (XMPP) is defined in the XMPP Core (RFC 6120) and XMPP IM (RFC 6121) specifications contributed by the XMPP Standards Foundation to the Internet Standards Process, which is managed by the Internet Engineering Task Force in accordance with RFC 2026. Any protocol defined in this document has been developed outside the Internet Standards Process and is to be understood as an extension to XMPP rather than as an evolution, development, or modification of XMPP itself.

### Appendix E: Discussion Venue

TO BE DONE

### Appendix F: Requirements Conformance

The following requirements keywords as used in this document are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt): "MUST", "SHALL", "REQUIRED"; "MUST NOT", "SHALL NOT"; "SHOULD", "RECOMMENDED"; "SHOULD NOT", "NOT RECOMMENDED"; "MAY", "OPTIONAL".
