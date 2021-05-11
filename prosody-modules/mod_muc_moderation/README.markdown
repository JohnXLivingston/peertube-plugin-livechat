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
