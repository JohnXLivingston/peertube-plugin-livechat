<!--
SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
SPDX-License-Identifier: AGPL-3.0-only
-->
# mod_pubsub_peertubelivechat

This module is a custom module that provide some pubsub services associated to a MUC room.
This module is entended to be used in the peertube-plugin-livechat project.

For each MUC room, there will be a associated pubsub nodes.
These nodes are only accessible by the ROOM admins/owners.

Here are a description of existing nodes, and objects they can contain:

* livechat-tasks:
  * task lists
  * tasks
* livechat-notes:
  * notes
* ... (more to come)

These objects are meant te be shared between admin/owner.

This module is part of peertube-plugin-livechat, and is under the same LICENSE.

The module code is inspired by mod_pep in Prosody source code (MIT/X11 licensed).
