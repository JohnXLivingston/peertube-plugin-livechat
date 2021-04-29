---
summary: Seed MUC configuration from JSON REST API
---

# Introduction

This module fetches configuration for MUC rooms from an API when rooms
are created.

# Requirements

Should work with Prosody 0.11.

# Configuration

`muc_create_api_url`
:   URL template for the API endpoint to get settings. `{room.jid}` is
    replaced by the address of the room in question.

`muc_create_api_auth`
:   The value of the Authorization header to authenticate against the
    API. E.g. `"Bearer /rXU4tkQTYQMgdHfMLH6"`{.lua}

In the URL template variable, the room JID is available as `{room.jid}`,
which would be turned into `room@muc.host`. To only get the room
localpart, `{room.jid|jid_node}` can be used, and `{room.jid|jid_host}`
splits out the `muc.host` part.

## Example

``` {.lua}
Component "channels.example.net" "muc"
modules_enabled = { "muc_http_defaults" }
muc_create_api_url = "https://api.example.net/muc/config?jid={room.jid}"
```

# API

A RESTful JSON API is used. Any error causes the room to be destroyed.

The returned JSON consists of two main parts, the room configuration and
the affiliations (member list).

## Room Configuration

The top level `config` field contains a map of properties corresponding
to the fields in the room configuration dialog, named similarly to the
[room configuration default][doc:modules:mod_muc#room-configuration-defaults] in
Prosodys config file.

| Property               | Type    | Description                                                               |
|------------------------|---------|---------------------------------------------------------------------------|
| `name`                 | string  | Name of the chat                                                          |
| `description`          | string  | Longer description of the chat                                            |
| `language`             | string  | Language code                                                             |
| `persistent`           | boolean | Whether the room should keep existing if it becomes empty                 |
| `public`               | boolean | `true` to include in public listing                                       |
| `members_only`         | boolean | Membership or open                                                        |
| `allow_member_invites` | boolean | If members can invite others into members-only rooms                      |
| `public_jids`          | boolean | If everyone or only moderators should see real identities                 |
| `subject`              | string  | In-room subject or topic message                                          |
| `changesubject`        | boolean | If `true` then everyone can change the subject, otherwise only moderators |
| `historylength`        | integer | Number of messages to keep in memory (legacy method)                      |
| `moderated`            | boolean | New participants start without voice privileges if set to `true`          |
| `archiving`            | boolean | Whether [archiving][doc:modules:mod_muc_mam] is enabled                   |

## Affiliations

The list of members go in `affiliations` which is either an object
mapping addresses to affiliations (e.g. `{"user@host":"admin"}`{.json}),
or it can be an array of address, affiliation and optionally a reserved
nickname (e.g.
`[{"jid":"user@host","affiliation":"member","nick":"joe"}]`{.json}).

## Schema

Here's a JSON Schema in YAML format describing the expected JSON
response data:

``` {.yaml}
---
type: object
properties:
  config:
    type: object
    properties:
      name:
        type: string
      description:
        type: string
      language:
        type: string
      persistent:
        type: boolean
      public:
        type: boolean
      members_only:
        type: boolean
      allow_member_invites:
        type: boolean
      public_jids:
        type: boolean
      subject:
        type: string
      changesubject:
        type: boolean
      historylength:
        type: integer
      moderated:
        type: boolean
      archiving:
        type: boolean
  affiliations:
    oneOf:
    - type: array
      items:
        type: object
        required:
        - jid
        - affiliation
        properties:
          jid:
            type: string
            pattern: ^[^@/]+@[^/]+$
          affiliation:
            $ref: '#/definitions/affiliation'
          nick:
            type: string
    - type: object
      additionalProperties:
        $ref: '#/definitions/affiliation'
definitions:
  affiliation:
    type: string
    enum:
    - owner
    - admin
    - member
    - none
    - outcast
...
```

## Example

A basic example with some config settings and a few affiliations:

``` {.json}
GET /muc/config?jid=place@channels.example.net
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json

{
   "affiliations" : [
      {
         "affiliation" : "owner",
         "jid" : "bosmang@example.net",
         "nick" : "bosmang"
      },
      {
         "affiliation" : "admin",
         "jid" : "xo@example.net",
         "nick" : "xo"
      },
      {
         "affiliation" : "member",
         "jid" : "john@example.net"
      }
   ],
   "config" : {
      "archiving" : true,
      "description" : "This is the place",
      "members_only" : true,
      "moderated" : false,
      "name" : "The Place",
      "persistent" : true,
      "public" : false,
      "subject" : "Discussions regarding The Place"
   }
}
```

To allow the creation without making any changes, letting whoever
created it be the owner, just return an empty JSON object:

    HTTP/1.1 200 OK
    Content-Type: application/json

    {}
