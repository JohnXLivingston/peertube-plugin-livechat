-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only

-- FIXME: create a XEP to standardize this, and remove the "x-".
local xmlns_poll = "http://jabber.org/protocol/muc#x-poll";
local xmlns_poll_message = "http://jabber.org/protocol/muc#x-poll-message";
local poll_message_tag = "x-poll";
local poll_question_tag = "x-poll-question";
local poll_choice_tag = "x-poll-choice";

return {
  xmlns_poll = xmlns_poll;
  xmlns_poll_message = xmlns_poll_message;
  poll_message_tag = poll_message_tag;
  poll_question_tag = poll_question_tag;
  poll_choice_tag = poll_choice_tag;
};
