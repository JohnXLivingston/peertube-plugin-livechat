import type { RegisterServerOptions } from '@peertube/peertube-types'
import { ensureProsodyRunning } from './prosody/ctl'
import type { ConverseJSTheme } from '../../shared/lib/types'
import { existsSync, promises as fsPromises } from 'fs'
import { resolve } from 'path'

const locContent: Map<string, string> = new Map<string, string>()

/**
 * Currently, the Peertube plugin system assumes that settings strings
 * are localized in english, and will be translated on front-end.
 * This system make it hard to have complex strings (with html, newlines, ...).
 * See https://github.com/Chocobozzz/PeerTube/issues/4523
 *
 * Waiting for a better solution, we implemented a custom solution:
 * - We are using keys to identify setting strings
 * - the `loc` function gets the english segment for the key
 * - the build-languages.js script builds all needed files.
 * @param key The key to translate
 */
function loc (key: string): string {
  return locContent.get(key) ?? key
}

async function loadLoc (): Promise<void> {
  const filePath = resolve(__dirname, '..', '..', 'languages', 'settings.reference.json')
  if (!existsSync(filePath)) {
    throw new Error(`File ${filePath} missing, can't load plugin settings`)
  }
  const content = await fsPromises.readFile(filePath, 'utf8')
  const json = JSON.parse(content ?? '{}')
  if (typeof json !== 'object') {
    throw new Error(`File ${filePath} invalid, can't load plugin settings`)
  }
  for (const k in json) {
    const v = json[k]
    if (typeof v === 'string') {
      locContent.set(k, v)
    }
  }
}

async function initSettings (options: RegisterServerOptions): Promise<void> {
  const { peertubeHelpers, registerSetting, settingsManager } = options

  await loadLoc()

  // ********** IMPORTANT NOTES
  registerSetting({
    type: 'html',
    private: true,
    descriptionHTML: loc('important_note_title')
  })
  registerSetting({
    type: 'html',
    private: true,
    descriptionHTML: loc('important_note_text')
  })
  registerSetting({
    type: 'html',
    private: true,
    descriptionHTML: loc('diagnostic')
  })

  if (process.arch !== 'x64' && process.arch !== 'x86_64' && process.arch !== 'arm64') {
    registerSetting({
      name: 'prosody-arch-warning',
      type: 'html',
      private: true,
      // Note: the following text as a variable in it.
      //   Not translating it: it should be very rare.
      descriptionHTML: `<span class="peertube-plugin-livechat-warning">
It seems that your are using a ${process.arch} CPU, 
which is not compatible with the plugin.
Please read
<a
  href="https://johnxlivingston.github.io/peertube-plugin-livechat/fr/documentation/installation/cpu_compatibility/"
  target="_blank"
>
  this page
</a> for a workaround.
</span>`
    })
  }

  // ********** Chat
  registerSetting({
    type: 'html',
    private: true,
    descriptionHTML: loc('chat_title')
  })
  registerSetting({
    name: 'prosody-list-rooms',
    label: loc('list_rooms_label'),
    type: 'html',
    descriptionHTML: loc('list_rooms_description'),
    private: true
  })

  // ********** Federation
  registerSetting({
    type: 'html',
    private: true,
    descriptionHTML: loc('federation_description')
  })
  registerSetting({
    name: 'federation-no-remote-chat',
    label: loc('federation_no_remote_chat_label'),
    descriptionHTML: loc('federation_no_remote_chat_description'),
    type: 'input-checkbox',
    default: false,
    private: false
  })
  registerSetting({
    name: 'federation-dont-publish-remotely',
    label: loc('federation_dont_publish_remotely_label'),
    descriptionHTML: loc('federation_dont_publish_remotely_description'),
    type: 'input-checkbox',
    default: false,
    private: true
  })

  // ********** Chat behaviour
  registerSetting({
    type: 'html',
    private: true,
    descriptionHTML: loc('chat_behaviour_description')
  })
  registerSetting({
    name: 'prosody-room-type',
    label: loc('room_type_label'),
    type: 'select',
    descriptionHTML: loc('room_type_description'),
    private: false,
    default: 'video',
    options: [
      { value: 'video', label: loc('room_type_option_video') },
      { value: 'channel', label: loc('room_type_option_channel') }
    ]
  })
  registerSetting({
    name: 'chat-auto-display',
    label: loc('auto_display_label'),
    descriptionHTML: loc('auto_display_description'),
    type: 'input-checkbox',
    default: true,
    private: false
  })
  registerSetting({
    name: 'chat-open-blank',
    label: loc('open_blank_label'),
    descriptionHTML: loc('open_blank_description'),
    private: false,
    type: 'input-checkbox',
    default: true
  })
  registerSetting({
    name: 'chat-share-url',
    label: loc('share_url_label'),
    descriptionHTML: loc('share_url_description'),
    private: false,
    type: 'select',
    default: 'owner',
    options: [
      { value: 'nobody', label: loc('share_url_option_nobody') },
      { value: 'everyone', label: loc('share_url_option_everyone') },
      { value: 'owner', label: loc('share_url_option_owner') },
      { value: 'owner+moderators', label: loc('share_url_option_owner_moderators') }
    ]
  })
  registerSetting({
    name: 'chat-per-live-video',
    label: loc('per_live_video_label'),
    type: 'input-checkbox',
    default: true,
    descriptionHTML: loc('per_live_video_description'),
    private: false
  })
  registerSetting({
    name: 'chat-per-live-video-warning',
    type: 'html',
    private: true,
    descriptionHTML: loc('per_live_video_warning_description')
  })
  registerSetting({
    name: 'chat-all-lives',
    label: loc('all_lives_label'),
    type: 'input-checkbox',
    default: false,
    descriptionHTML: loc('all_lives_description'),
    private: false
  })
  registerSetting({
    name: 'chat-all-non-lives',
    label: loc('all_non_lives_label'),
    type: 'input-checkbox',
    default: false,
    descriptionHTML: loc('all_non_lives_description'),
    private: false
  })
  registerSetting({
    name: 'chat-videos-list',
    label: loc('videos_list_label'),
    type: 'input-textarea',
    default: '',
    descriptionHTML: loc('videos_list_description'),
    private: false
  })
  registerSetting({
    name: 'chat-no-anonymous',
    label: loc('no_anonymous_label'),
    type: 'input-checkbox',
    default: false,
    descriptionHTML: loc('no_anonymous_description'),
    private: false
  })

  // ********** Theming
  registerSetting({
    name: 'theming-advanced',
    type: 'html',
    private: true,
    descriptionHTML: loc('theming_advanced_description')
  })

  registerSetting({
    name: 'converse-theme',
    label: loc('converse_theme_label'),
    type: 'select',
    default: 'peertube' as ConverseJSTheme,
    private: false,
    options: [
      { value: 'peertube', label: loc('peertube') },
      { value: 'default', label: loc('default') },
      { value: 'concord', label: loc('concord') }
    ] as Array<{value: ConverseJSTheme, label: string}>,
    descriptionHTML: loc('converse_theme_description')
  })

  registerSetting({
    name: 'converse-autocolors',
    label: loc('autocolors_label'),
    type: 'input-checkbox',
    default: true,
    private: false,
    descriptionHTML: loc('autocolors_description')
  })

  registerSetting({
    name: 'chat-style',
    label: loc('chat_style_label'),
    type: 'input-textarea',
    default: '',
    descriptionHTML: loc('chat_style_description'),
    private: false
  })

  // ********** Chat server advanced settings
  registerSetting({
    name: 'prosody-advanced',
    type: 'html',
    private: true,
    descriptionHTML: loc('prosody_advanced_description')
  })

  registerSetting({
    name: 'chat-help-builtin-prosody',
    type: 'html',
    label: loc('help_builtin_prosody_label'),
    descriptionHTML: loc('help_builtin_prosody_description'),
    private: true
  })

  registerSetting({
    name: 'use-system-prosody',
    type: 'input-checkbox',
    label: loc('system_prosody_label'),
    descriptionHTML: loc('system_prosody_description'),
    private: true,
    default: false
  })

  registerSetting({
    name: 'disable-websocket',
    type: 'input-checkbox',
    label: loc('disable_websocket_label'),
    descriptionHTML: loc('disable_websocket_description'),
    private: true,
    default: false
  })

  registerSetting({
    name: 'prosody-port',
    label: loc('prosody_port_label'),
    type: 'input',
    default: '52800',
    private: true,
    descriptionHTML: loc('prosody_port_description')
  })

  registerSetting({
    name: 'prosody-peertube-uri',
    label: loc('prosody_peertube_uri_label'),
    type: 'input',
    default: '',
    private: true,
    descriptionHTML: loc('prosody_peertube_uri_description')
  })

  registerSetting({
    name: 'prosody-muc-log-by-default',
    label: loc('prosody_muc_log_by_default_label'),
    type: 'input-checkbox',
    default: true,
    private: true,
    descriptionHTML: loc('prosody_muc_log_by_default_description')
  })

  registerSetting({
    name: 'prosody-muc-expiration',
    label: loc('prosody_muc_expiration_label'),
    type: 'input',
    default: '1w',
    private: true,
    descriptionHTML: loc('prosody_muc_expiration_description')
  })

  registerSetting({
    name: 'prosody-room-allow-s2s',
    label: loc('prosody_room_allow_s2s_label'),
    type: 'input-checkbox',
    default: false,
    private: false,
    descriptionHTML: loc('prosody_room_allow_s2s_description')
  })

  registerSetting({
    name: 'prosody-s2s-port',
    label: loc('prosody_s2s_port_label'),
    type: 'input',
    default: '5269',
    private: true,
    descriptionHTML: loc('prosody_s2s_port_description')
  })

  registerSetting({
    name: 'prosody-s2s-interfaces',
    label: loc('prosody_s2s_interfaces_label'),
    type: 'input',
    default: '*, ::',
    private: true,
    descriptionHTML: loc('prosody_s2s_interfaces_description')
  })

  registerSetting({
    name: 'prosody-certificates-dir',
    label: loc('prosody_certificates_dir_label'),
    type: 'input',
    default: '',
    private: true,
    descriptionHTML: loc('prosody_certificates_dir_description')
  })

  registerSetting({
    name: 'prosody-c2s',
    label: loc('prosody_c2s_label'),
    type: 'input-checkbox',
    default: false,
    private: true,
    descriptionHTML: loc('prosody_c2s_description')
  })

  registerSetting({
    name: 'prosody-c2s-port',
    label: loc('prosody_c2s_port_label'),
    type: 'input',
    default: '52822',
    private: true,
    descriptionHTML: loc('prosody_c2s_port_description')
  })

  registerSetting({
    name: 'prosody-components',
    label: loc('prosody_components_label'),
    type: 'input-checkbox',
    default: false,
    private: true,
    descriptionHTML: loc('prosody_components_description')
  })

  registerSetting({
    name: 'prosody-components-port',
    label: loc('prosody_components_port_label'),
    type: 'input',
    default: '53470',
    private: true,
    descriptionHTML: loc('prosody_components_port_description')
  })

  registerSetting({
    name: 'prosody-components-list',
    label: loc('prosody_components_list_label'),
    type: 'input-textarea',
    default: '',
    private: true,
    descriptionHTML: loc('prosody_components_list_description')
  })

  // ********** settings changes management
  settingsManager.onSettingsChange(async (_settings: any) => {
    peertubeHelpers.logger.info('Saving settings, ensuring prosody is running')
    await ensureProsodyRunning(options)
  })
}

export {
  initSettings
}
