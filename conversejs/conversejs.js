require('converse.js')

window.initConverse = function initConverse ({
  baseStaticUrl,
  room,
  boshServiceUrl
}) {
  window.converse.initialize({
    assets_path: baseStaticUrl,

    authentication: 'anonymous',
    auto_login: true,
    auto_join_rooms: [
      room
    ],
    bosh_service_url: boshServiceUrl,
    jid: 'peertube.im.your_domain',
    notify_all_room_messages: [
      room
    ],
    singleton: true,
    auto_focus: false,
    hide_muc_participants: false,
    keepalive: true,
    play_sounds: false,
    muc_mention_autocomplete_min_chars: 3,
    muc_mention_autocomplete_filter: 'contains',
    modtools_disable_assign: true,
    muc_disable_slash_commands: [
      'admin', 'ban', 'clear', 'deop', 'destroy', 'kick',
      'member', 'modtools', 'mute', 'op', 'owner', 'register',
      'revoke', 'subject', 'topic', 'voice'
    ],
    muc_instant_rooms: true,
    show_client_info: false,
    allow_adhoc_commands: false,
    allow_contact_requests: false,
    show_controlbox_by_default: false,
    view_mode: 'fullscreen'
  })
}
