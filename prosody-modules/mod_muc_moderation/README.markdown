# Introduction

This module implements [XEP-0425: Message Moderation].

# Usage

Moderation is done via a supporting client and requires a `moderator`
role in the channel / group chat.

# Configuration

Example [MUC component][doc:chatrooms] configuration:

``` {.lua}
VirtualHost "channels.example.com" "muc"
modules_enabled = {
    "muc_mam",
    "muc_moderation",
}
```

# Compatibility

-   Should work with Prosody 0.11.x and later.
-   Tested with trunk rev `52c6dfa04dba`.
-   Message tombstones requires a compatible storage module implementing
    a new message replacement API.

## Clients

-   Tested with [Converse.js](https://conversejs.org/)
    [v6.0.1](https://github.com/conversejs/converse.js/releases/tag/v6.0.1)

### Feature requests

- [Conv](https://github.com/iNPUTmice/Conversations/issues/3722)[ersa](https://github.com/iNPUTmice/Conversations/issues/3920)[tions](https://github.com/iNPUTmice/Conversations/issues/4227)
- [Dino](https://github.com/dino/dino/issues/1133)
- [Gajim](https://dev.gajim.org/gajim/gajim/-/issues/10107)
- [Poezio](https://lab.louiz.org/poezio/poezio/-/issues/3543)
- [Profanity](https://github.com/profanity-im/profanity/issues/1336)
