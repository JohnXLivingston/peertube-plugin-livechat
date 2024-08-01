// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

/** Localization keys to inject in ConverseJS:
 *  these keys are used to:
 *  - inject needed localization strings in ConverseJS language files
 *  - defined global variable using Webpack, to retrieve the english key to pass to the ConverseJS localization function
*/
const locKeys = [
  'slow_mode_info',
  'login_using_external_account',
  'login_remote_peertube',
  'login_remote_peertube_searching',
  'login_remote_peertube_url',
  'login_remote_peertube_url_invalid',
  'login_remote_peertube_no_livechat',
  'login_remote_peertube_video_not_found',
  'login_remote_peertube_video_not_found_try_anyway',
  'login_remote_peertube_video_not_found_try_anyway_button',
  'login_remote_peertube_video_open_failed',
  'login_external_auth_alert_message',
  'online_help',
  'tasks',
  'task_list_create',
  'task_list_create_error',
  'task_list_name',
  'task_list_delete',
  'task_list_delete_confirm',
  'task_create',
  'task_name',
  'task_description',
  'task_delete',
  'task_delete_confirm',
  'task_list_pick_title',
  'task_list_pick_empty',
  'task_list_pick_message',
  'muted_anonymous_message',
  'new_poll',
  'poll_question',
  'poll_duration',
  'poll_anonymous_results',
  'poll_choice_n',
  'poll_title',
  'poll_instructions',
  'poll_end',
  'poll',
  'poll_vote_instructions',
  'poll_vote_instructions_xmpp',
  'poll_is_over',
  'poll_choice_invalid',
  'poll_anonymous_vote_ok',
  'moderator_notes',
  'moderator_notes_create_error',
  'moderator_note_create',
  'moderator_note_description',
  'moderator_note_delete',
  'moderator_note_delete_confirm',
  'moderator_note_create_for_participant',
  'moderator_note_search_for_participant',
  'moderator_note_filters',
  'moderator_note_original_nick',
  'search_occupant_message'
]

module.exports = locKeys
