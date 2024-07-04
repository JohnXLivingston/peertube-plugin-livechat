<!--
SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
SPDX-License-Identifier: AGPL-3.0-only
-->
# mod_muc_slow_pool

This module provide a way to create polls in MUC rooms.

This module is part of peertube-plugin-livechat, and is under the same LICENSE.

There will probably be a XEP proposal for this module behaviour. When done, this module will be published in the prosody-modules repository.

## Configuration

Just enable the module on your MUC component.
All above configurations are optional.

## poll_groupchat_votes_priority

The priority for the hook that will take into account votes.
You can change this, if you have some specific hook that should be done after/before counting votes (slow mode, firewall, ...).

Default: 500

## Strings

You can change some defaults strings, if you want for example to localize the poll messages.
Here are the existing strings and default values:

* poll_string_over: This poll is now over.
* poll_string_vote_instructions: Send a message with an exclamation mark followed by your choice number to vote. Example: !1
* poll_string_invalid_choice: This choice is not valid.
* poll_string_anonymous_vote_ok: You vote is taken into account. Votes are anonymous, it will not be shown to other participants.
