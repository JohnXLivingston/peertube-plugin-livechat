// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { ConverseJSTheme } from '../../shared/lib/types'
import { ensureProsodyRunning } from './prosody/ctl'
import { RoomChannel } from './room-channel'
import { BotsCtl } from './bots/ctl'
import { ExternalAuthOIDC, ExternalAuthOIDCType } from './external-auth/oidc'
import { Emojis } from './emojis'
import { LivechatProsodyAuth } from './prosody/auth'
import { loc } from './loc'
import { canEditFirewallConfig } from './firewall/config'
const escapeHTML = require('escape-html')

type AvatarSet = 'sepia' | 'cat' | 'bird' | 'fenec' | 'abstract' | 'legacy' | 'none'

async function initSettings (options: RegisterServerOptions): Promise<void> {
  const { peertubeHelpers, settingsManager } = options
  const logger = peertubeHelpers.logger

  initImportantNotesSettings(options)
  initChatSettings(options)
  initFederationSettings(options)
  initAuth(options)
  initExternalAuth(options)
  initAdvancedChannelCustomizationSettings(options)
  initChatBehaviourSettings(options)
  initThemingSettings(options)
  await initChatServerAdvancedSettings(options)

  await ExternalAuthOIDC.initSingletons(options)
  const loadOidcs = (): void => {
    const oidcs = ExternalAuthOIDC.allSingletons()
    for (const oidc of oidcs) {
      try {
        const type = oidc.type
        oidc.isOk().then(
          () => {
            logger.info(`Loading External Auth OIDC ${type}...`)
            oidc.load().then(
              () => {
                logger.info(`External Auth OIDC ${type} loaded`)
              },
              () => {
                logger.error(`Loading the External Auth OIDC ${type} failed`)
              }
            )
          },
          () => {
            logger.info(`No valid External Auth OIDC ${type}, nothing loaded`)
          }
        )
      } catch (err) {
        logger.error(err as string)
        continue
      }
    }
  }
  loadOidcs() // we don't have to wait (can take time, it will do external http requests)

  let currentProsodyRoomtype = (await settingsManager.getSettings(['prosody-room-type']))['prosody-room-type']

  // ********** settings changes management
  settingsManager.onSettingsChange(async (settings: any) => {
    // In case the Prosody port has changed, we must rewrite the Bot configuration file.
    // To avoid race condition, we will just stop and start the bots at every settings saving.
    await BotsCtl.destroySingleton()
    await BotsCtl.initSingleton(options)
    loadOidcs() // we don't have to wait (can take time, it will do external http requests)

    await ExternalAuthOIDC.initSingletons(options)

    // recreating a Emojis singleton
    await Emojis.destroySingleton()
    await Emojis.initSingleton(options)

    LivechatProsodyAuth.singleton().setUserTokensEnabled(!settings['livechat-token-disabled'])

    peertubeHelpers.logger.info('Saving settings, ensuring prosody is running')
    await ensureProsodyRunning(options)

    await BotsCtl.singleton().start()

    // In case prosody-room-type changed, we must rebuild room-channel links.
    if (settings['prosody-room-type'] !== currentProsodyRoomtype) {
      peertubeHelpers.logger.info('Setting prosody-room-type has changed value, must rebuild room-channel infos')
      // doing it without waiting, could be long!
      RoomChannel.singleton().rebuildData().then(
        () => peertubeHelpers.logger.info('Room-channel info rebuild ok.'),
        (err) => peertubeHelpers.logger.error(err)
      )
    }
    currentProsodyRoomtype = settings['prosody-room-type']
  })
}

/**
 * Registers settings related to the "Important Notes" section.
 * @param param0 server options
 */
function initImportantNotesSettings ({ registerSetting }: RegisterServerOptions): void {
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
  href="https://livingston.frama.io/peertube-plugin-livechat/documentation/installation/cpu_compatibility/"
  target="_blank"
>
  this page
</a> for a workaround.
</span>`
    })
  }
}

/**
 * Register settings related to the "Chat" section.
 * @param param0 server options
 */
function initChatSettings ({ registerSetting }: RegisterServerOptions): void {
  registerSetting({
    type: 'html',
    private: true,
    descriptionHTML: loc('chat_title')
  })
  registerSetting({
    name: 'chat-terms',
    private: true,
    label: loc('chat_terms_label'),
    type: 'input-textarea',
    default: '',
    descriptionHTML: loc('chat_terms_description')
  })
  registerSetting({
    name: 'prosody-list-rooms',
    label: loc('list_rooms_label'),
    type: 'html',
    descriptionHTML: loc('list_rooms_description'),
    private: true
  })
}

/**
 * Registers settings related to the "Federation" section.
 * @param param0 server options
 */
function initFederationSettings ({ registerSetting }: RegisterServerOptions): void {
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
}

/**
 * Initialize settings related to authentication.
 * @param options peertube server options
 */
function initAuth (options: RegisterServerOptions): void {
  const registerSetting = options.registerSetting

  registerSetting({
    type: 'html',
    private: true,
    descriptionHTML: loc('auth_description')
  })

  registerSetting({
    type: 'html',
    private: true,
    descriptionHTML: loc('experimental_warning')
  })

  registerSetting({
    name: 'livechat-token-disabled',
    label: loc('livechat_token_disabled_label'),
    descriptionHTML: loc('livechat_token_disabled_description'),
    type: 'input-checkbox',
    default: false,
    private: false
  })
}

/**
 * Registers settings related to the "External Authentication" section.
 * @param param0 server options
 */
function initExternalAuth (options: RegisterServerOptions): void {
  const registerSetting = options.registerSetting

  registerSetting({
    type: 'html',
    private: true,
    descriptionHTML: loc('external_auth_description')
  })

  registerSetting({
    type: 'html',
    private: true,
    descriptionHTML: loc('external_auth_custom_oidc_title')
  })

  registerSetting({
    type: 'html',
    private: true,
    descriptionHTML: loc('experimental_warning')
  })

  registerSetting({
    name: 'external-auth-custom-oidc',
    label: loc('external_auth_custom_oidc_label'),
    descriptionHTML: loc('external_auth_custom_oidc_description'),
    type: 'input-checkbox',
    default: false,
    private: true
  })

  registerSetting({
    type: 'html',
    name: 'external-auth-custom-oidc-redirect-uris-info',
    private: true,
    descriptionHTML: loc('external_auth_oidc_redirect_uris_info_description')
  })
  registerSetting({
    type: 'html',
    name: 'external-auth-custom-oidc-redirect-uris',
    private: true,
    descriptionHTML: `<ul><li>${escapeHTML(ExternalAuthOIDC.redirectUrl(options, 'custom')) as string}</li></ul>`
  })

  registerSetting({
    name: 'external-auth-custom-oidc-button-label',
    label: loc('external_auth_custom_oidc_button_label_label'),
    descriptionHTML: loc('external_auth_custom_oidc_button_label_description'),
    type: 'input',
    default: '',
    private: true
  })
  registerSetting({
    name: 'external-auth-custom-oidc-discovery-url',
    label: loc('external_auth_custom_oidc_discovery_url_label'),
    // descriptionHTML: loc('external_auth_custom_oidc_discovery_url_description'),
    type: 'input',
    private: true
  })
  registerSetting({
    name: 'external-auth-custom-oidc-client-id',
    label: loc('external_auth_oidc_client_id_label'),
    // descriptionHTML: loc('external_auth_oidc_client_id_description'),
    type: 'input',
    private: true
  })
  registerSetting({
    name: 'external-auth-custom-oidc-client-secret',
    label: loc('external_auth_oidc_client_secret_label'),
    // descriptionHTML: loc('external_auth_oidc_client_secret_description'),
    type: 'input-password',
    private: true
  })

  // FIXME: adding settings for these?
  // - scope (default: 'openid profile')
  // - user-name property
  // - display-name property
  // - picture property

  // Standard providers....
  for (const provider of ['google', 'facebook']) {
    let redirectUrl
    try {
      redirectUrl = ExternalAuthOIDC.redirectUrl(options, provider as ExternalAuthOIDCType)
    } catch (err) {
      options.peertubeHelpers.logger.error('Cant load redirect url for provider ' + provider)
      options.peertubeHelpers.logger.error(err)
      continue
    }
    registerSetting({
      name: 'external-auth-' + provider + '-oidc',
      label: loc('external_auth_' + provider + '_oidc_label'),
      descriptionHTML: loc('external_auth_' + provider + '_oidc_description'),
      type: 'input-checkbox',
      default: false,
      private: true
    })
    registerSetting({
      type: 'html',
      name: 'external-auth-' + provider + '-oidc-redirect-uris-info',
      private: true,
      descriptionHTML: loc('external_auth_oidc_redirect_uris_info_description')
    })
    registerSetting({
      type: 'html',
      name: 'external-auth-' + provider + '-oidc-redirect-uris',
      private: true,
      descriptionHTML: `<ul><li>${escapeHTML(redirectUrl) as string}</li></ul>`
    })
    registerSetting({
      name: 'external-auth-' + provider + '-oidc-client-id',
      label: loc('external_auth_oidc_client_id_label'),
      // descriptionHTML: loc('external_auth_' + provider + '_oidc_client_id_description'),
      type: 'input',
      private: true
    })
    registerSetting({
      name: 'external-auth-' + provider + '-oidc-client-secret',
      label: loc('external_auth_oidc_client_secret_label'),
      // descriptionHTML: loc('external_auth_' + provider + '_oidc_client_secret_description'),
      type: 'input-password',
      private: true
    })
  }
}

/**
 * Registers settings related to the "Advanced channel customization" section.
 * @param param0 server options
 */
function initAdvancedChannelCustomizationSettings ({ registerSetting }: RegisterServerOptions): void {
  registerSetting({
    type: 'html',
    private: true,
    descriptionHTML: loc('configuration_description')
  })
  registerSetting({
    type: 'html',
    private: true,
    descriptionHTML: loc('experimental_warning')
  })
  registerSetting({
    name: 'disable-channel-configuration',
    label: loc('disable_channel_configuration_label'),
    // descriptionHTML: loc('disable_channel_configuration_description'),
    type: 'input-checkbox',
    default: false,
    private: false
  })
}

/**
 * Registers settings related to the "Chat behaviour" section.
 * @param param0 server options
 */
function initChatBehaviourSettings ({ registerSetting }: RegisterServerOptions): void {
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
  registerSetting({
    name: 'auto-ban-anonymous-ip',
    label: loc('auto_ban_anonymous_ip_label'),
    type: 'input-checkbox',
    default: false,
    descriptionHTML: loc('auto_ban_anonymous_ip_description'),
    private: true
  })
}

/**
 * Registers settings related to the "Theming" section.
 * @param param0 server options
 */
function initThemingSettings ({ registerSetting }: RegisterServerOptions): void {
  registerSetting({
    name: 'theming-advanced',
    type: 'html',
    private: true,
    descriptionHTML: loc('theming_advanced_description')
  })

  registerSetting({
    name: 'avatar-set',
    label: loc('avatar_set_label'),
    descriptionHTML: loc('avatar_set_description'),
    type: 'select',
    default: 'sepia' as AvatarSet,
    private: true,
    options: [
      { value: 'sepia', label: loc('avatar_set_option_sepia') },
      { value: 'cat', label: loc('avatar_set_option_cat') },
      { value: 'bird', label: loc('avatar_set_option_bird') },
      { value: 'fenec', label: loc('avatar_set_option_fenec') },
      { value: 'abstract', label: loc('avatar_set_option_abstract') },
      { value: 'legacy', label: loc('avatar_set_option_legacy') },
      { value: 'none', label: loc('avatar_set_option_none') }
    ] as Array<{
      value: AvatarSet
      label: string
    }>
  })

  registerSetting({
    name: 'converse-theme',
    label: loc('converse_theme_label'),
    type: 'select',
    default: 'peertube' as ConverseJSTheme,
    private: false,
    options: [
      { value: 'peertube', label: loc('converse_theme_option_peertube') },
      { value: 'default', label: loc('converse_theme_option_default') },
      { value: 'cyberpunk', label: loc('converse_theme_option_cyberpunk') }
    ] as Array<{ value: ConverseJSTheme, label: string }>,
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
    name: 'converse-theme-warning',
    type: 'html',
    private: true,
    descriptionHTML: loc('converse_theme_warning_description')
  })

  registerSetting({
    name: 'chat-style',
    label: loc('chat_style_label'),
    type: 'input-textarea',
    default: '',
    descriptionHTML: loc('chat_style_description'),
    private: false
  })
}

/**
 * Registers settings related to the "Chat server advanded settings" section.
 * @param param0 server options
 */
async function initChatServerAdvancedSettings (options: RegisterServerOptions): Promise<void> {
  const { registerSetting } = options

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
    name: 'prosody-c2s-interfaces',
    label: loc('prosody_c2s_interfaces_label'),
    type: 'input',
    default: '127.0.0.1, ::1',
    private: true,
    descriptionHTML: loc('prosody_c2s_interfaces_description')
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
    name: 'prosody-components-interfaces',
    label: loc('prosody_components_interfaces_label'),
    type: 'input',
    default: '127.0.0.1, ::1',
    private: true,
    descriptionHTML: loc('prosody_components_interfaces_description')
  })

  registerSetting({
    name: 'prosody-components-list',
    label: loc('prosody_components_list_label'),
    type: 'input-textarea',
    default: '',
    private: true,
    descriptionHTML: loc('prosody_components_list_description')
  })

  registerSetting({
    name: 'prosody-firewall-enabled',
    label: loc('prosody_firewall_label'),
    type: 'input-checkbox',
    default: false,
    private: true,
    descriptionHTML: loc('prosody_firewall_description')
  })
  if (await canEditFirewallConfig(options)) {
    registerSetting({
      type: 'html',
      name: 'prosody-firewall-configure-button',
      private: true,
      descriptionHTML: loc('prosody_firewall_configure_button')
    })
  }
}

export {
  initSettings,
  AvatarSet
}
