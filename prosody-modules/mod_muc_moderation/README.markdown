---
SPDX-FileCopyrightText: 2015-2021 Kim Alvefur
SPDX-License-Identifier: MIT
summary: Let moderators remove spam and abuse messages
---

# Introduction

This module implements [XEP-0425: Message Moderation].

# Usage

Moderation is done via a supporting client and requires a `moderator`
role in the channel / group chat.

# Configuration

Example [MUC component][doc:chatrooms] configuration:

``` {.lua}
Component "channels.example.com" "muc"
modules_enabled = {
    "muc_mam",
    "muc_moderation",
}
```

# Compatibility

-   Basic functionality with Prosody 0.11.x and later
-   Full functionality with Prosody 0.12.x and `internal` or `sql`
    storage^[Replacing moderated messages with tombstones requires new storage API methods.]
-   Works with [mod_storage_xmlarchive]

## Clients

-   [Converse.js](https://conversejs.org/)
-   [Gajim](https://dev.gajim.org/gajim/gajim/-/issues/10107)
-   [clix](https://code.zash.se/clix/rev/6c1953fbe0fa)

### Feature requests

-   [Conversations](https://codeberg.org/iNPUTmice/Conversations/issues/20)
-   [Dino](https://github.com/dino/dino/issues/1133)
-   [Profanity](https://github.com/profanity-im/profanity/issues/1336)
