---
labels:
- 'Stage-Alpha'
summary: Ban users from chatrooms by their IP address
...

Note: this is a slightly modified version: the log level for IP bans is
set to info, instead of debug.
So we can use external tools (fail2ban for example) to block IPs more widely.

Introduction
============

One frequent complaint about XMPP chatrooms (MUCs) compared to IRC is
the inability for a room admin to ban a user based on their IP address.
This is because an XMPP user is not identified on the network by their
IP address, only their JID.

This means that it is possible to create a new account (usually quite
easily), and rejoin the room that you were banned from.

This module allows the **user's** server to enforce bans by IP address,
which is very desirable for server admins who want to prevent their
server being used for spamming and abusive behaviour.

Details
=======

An important point to note is that this module enforces the IP ban on
the banned user's server, not on the MUC server. This means that:

-   The user's server MUST have this module loaded, however -
-   The module works even when the MUC is on a different server to the
    user
-   The MUC server does not need this module (it only needs to support
    the [standard ban
    protocol](http://xmpp.org/extensions/xep-0045.html#ban))
-   The module works for effectively banning [anonymous
    users](http://prosody.im/doc/anonymous_logins)

Also note that IP bans are not saved permanently, and are reset upon a
server restart.

Configuration
=============

There is no extra configuration for this module except for loading it.
Remember... do not load it on the MUC host, simply add it to your global
`modules_enabled` list, or under a specific host like:

``` lua
VirtualHost "anon.example.com"
  authentication = "anonymous"
  modules_enabled = { "muc_ban_ip" }
```

Compatibility
=============

  ----- --------------
  0.9   Works
  0.8   Doesn't work
  ----- --------------
