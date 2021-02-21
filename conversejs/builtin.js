function inIframe () {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

window.initConverse = function initConverse ({
  jid,
  assetsPath,
  room,
  boshServiceUrl,
  websocketServiceUrl
}) {
  window.converse.initialize({
    assets_path: assetsPath,

    authentication: 'anonymous',
    auto_login: true,
    auto_join_rooms: [
      room
    ],
    discover_connection_methods: false, // this parameter seems buggy with converseJS 7.0.4
    bosh_service_url: boshServiceUrl === '' ? undefined : boshServiceUrl,
    websocket_url: websocketServiceUrl === '' ? undefined : websocketServiceUrl,
    jid: jid,
    notify_all_room_messages: [
      room
    ],
    singleton: true,
    auto_focus: false,
    hide_muc_participants: inIframe,
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
