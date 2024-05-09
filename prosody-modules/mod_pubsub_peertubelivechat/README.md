# mod_pubsub_peertubelivechat

This module is a custom module that provide some pubsub services associated to a MUC room.
This module is entended to be used in the peertube-plugin-livechat project.

For each MUC room, there will be an associated pubsub node.
This node in only accessible by the ROOM admin/owner.

This node can contains various objects:

* task lists
* tasks
* ... (more to come)

These objects are meant te be shared between admin/owner.

This module is part of peertube-plugin-livechat, and is under the same LICENSE.

The module code is inspired by mod_pep in Prosody source code (MIT/X11 licensed).
