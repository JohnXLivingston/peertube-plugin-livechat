import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { Video } from '@peertube/peertube-types'
import type { ProsodyListRoomsResult } from 'shared/lib/types'

interface ActionPluginSettingsParams {
  npmName: string
}

function register ({ registerHook, registerSettingsScript, peertubeHelpers }: RegisterClientOptions): void {
  function getBaseRoute (): string {
    // NB: this will come with Peertube > 3.2.1 (3.3.0?)
    if (peertubeHelpers.getBaseRouterRoute) {
      return peertubeHelpers.getBaseRouterRoute()
    }
    // We are guessing the route with the correct plugin version with this trick:
    const staticBase = peertubeHelpers.getBaseStaticRoute()
    // we can't use '/plugins/livechat/router', because the loaded html page needs correct relative paths.
    return staticBase.replace(/\/static.*$/, '/router')
  }

  registerHook({
    target: 'action:admin-plugin-settings.init',
    handler: ({ npmName }: ActionPluginSettingsParams) => {
      if (npmName !== PLUGIN_CHAT_PACKAGE_NAME) {
        console.log(`[peertube-plugin-livechat] Settings for ${npmName}, not ${PLUGIN_CHAT_PACKAGE_NAME}. Returning.`)
        return
      }
      console.log('[peertube-plugin-livechat] Initializing diagnostic button')
      const diagButtons = document.querySelectorAll('.peertube-plugin-livechat-launch-diagnostic')
      diagButtons.forEach(diagButton => {
        if (diagButton.hasAttribute('href')) { return }
        // TODO: use a modal instead of a target=_blank
        diagButton.setAttribute('href', getBaseRoute() + '/settings/diagnostic')
        diagButton.setAttribute('target', '_blank')
      })
      console.log('[peertube-plugin-livechat] Initializing prosody-list-rooms button')
      const listRoomsButtons: NodeListOf<HTMLAnchorElement> =
        document.querySelectorAll('.peertube-plugin-livechat-prosody-list-rooms-btn')

      try {
        // Trying to copy Computed CSS for an input[type=submit] to the list rooms button
        const tmpButton = document.querySelector('#content input[type=submit]')
        if (window.getComputedStyle && tmpButton) {
          const styles = window.getComputedStyle(tmpButton)
          // Firerox has a bug: styles.cssText always returns "". https://bugzilla.mozilla.org/show_bug.cgi?id=137687
          if (styles.cssText !== '') {
            listRoomsButtons.forEach(listRoomsButton => { listRoomsButton.style.cssText = styles.cssText })
          } else {
            const cssText = Object.values(styles).reduce(
              (css, propertyName) => `${css}${propertyName}:${styles.getPropertyValue(propertyName)};`
            )
            listRoomsButtons.forEach(listRoomsButton => { listRoomsButton.style.cssText = cssText })
          }
        }
      } catch (err) {
        console.error('[peertube-plugin-livechat] Failed applying styles on the «list rooms» button.', err)
      }

      listRoomsButtons.forEach(listRoomsButton => {
        if (listRoomsButton.classList.contains('peertube-plugin-livechat-prosody-list-rooms-btn-binded')) { return }
        listRoomsButton.classList.add('peertube-plugin-livechat-prosody-list-rooms-btn-binded')
        listRoomsButton.onclick = async (): Promise<void> => {
          console.log('[peertube-plugin-livechat] Opening the room list...')
          // TODO: use showModal (seems buggy with Peertube 3.2.1)

          try {
            document.querySelectorAll('.peertube-plugin-livechat-prosody-list-rooms-content')
              .forEach(dom => dom.remove())
            const container = document.createElement('div')
            container.classList.add('peertube-plugin-livechat-prosody-list-rooms-content')
            container.textContent = '...'
            listRoomsButton.after(container)

            const response = await fetch(getBaseRoute() + '/webchat/prosody-list-rooms', {
              method: 'GET',
              headers: peertubeHelpers.getAuthHeader()
            })
            if (!response.ok) {
              throw new Error('Response is not ok')
            }
            const json: ProsodyListRoomsResult = await response.json()
            if (!json.ok) {
              container.textContent = json.error
              container.classList.add('peertube-plugin-livechat-error')
            } else {
              const rooms = json.rooms.sort((a, b) => {
                const timestampA = a.lasttimestamp ?? 0
                const timestampB = b.lasttimestamp ?? 0
                if (timestampA === timestampB) {
                  return a.name.localeCompare(b.name)
                } else if (timestampA < timestampB) {
                  return 1
                } else {
                  return -1
                }
              })

              container.textContent = ''
              const table = document.createElement('table')
              table.classList.add('peertube-plugin-livechat-prosody-list-rooms')
              container.append(table)
              const labels: any = {
                RoomName: await peertubeHelpers.translate('Room name'),
                RoomDescription: await peertubeHelpers.translate('Room description'),
                NotFound: await peertubeHelpers.translate('Not found'),
                Video: await peertubeHelpers.translate('Video'),
                Channel: await peertubeHelpers.translate('Channel'),
                LastActivity: await peertubeHelpers.translate('Last activity')
              }

              const titleLineEl = document.createElement('tr')
              const titleNameEl = document.createElement('th')
              titleNameEl.textContent = labels.RoomName
              const titleDescriptionEl = document.createElement('th')
              titleDescriptionEl.textContent = labels.RoomDescription
              const titleVideoEl = document.createElement('th')
              titleVideoEl.textContent = `${labels.Video as string} / ${labels.Channel as string}`
              const titleLastActivityEl = document.createElement('th')
              titleLastActivityEl.textContent = labels.LastActivity
              titleLineEl.append(titleNameEl)
              titleLineEl.append(titleDescriptionEl)
              titleLineEl.append(titleVideoEl)
              titleLineEl.append(titleLastActivityEl)
              table.append(titleLineEl)
              rooms.forEach(room => {
                const localpart = room.localpart
                const lineEl = document.createElement('tr')
                const nameEl = document.createElement('td')
                const aEl = document.createElement('a')
                aEl.textContent = room.name
                aEl.target = '_blank'
                const descriptionEl = document.createElement('td')
                descriptionEl.textContent = room.description
                const videoEl = document.createElement('td')
                const lastActivityEl = document.createElement('td')
                if (room.lasttimestamp && (typeof room.lasttimestamp === 'number')) {
                  const date = new Date(room.lasttimestamp * 1000)
                  lastActivityEl.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
                }
                nameEl.append(aEl)
                lineEl.append(nameEl)
                lineEl.append(descriptionEl)
                lineEl.append(videoEl)
                lineEl.append(lastActivityEl)
                table.append(lineEl)

                const channelMatches = localpart.match(/^channel\.(\d+)$/)
                if (channelMatches) {
                  // Here we have a channel chat room
                  // The backend should have added informations here
                  // (because the Peertube API can't work with channelId...)
                  const href = getBaseRoute() + '/webchat/room/' + encodeURIComponent(localpart) + '?forcetype=1'
                  if (room.channel?.name) {
                    aEl.href = href // here we know that the channel still exists, so we can open the webchat.
                    const aVideoEl = document.createElement('a')
                    aVideoEl.textContent = room.channel?.displayName ?? '-'
                    aVideoEl.target = '_blank'
                    aVideoEl.href = '/video-channels/' + room.channel.name
                    videoEl.append(aVideoEl)
                  }
                } else if (/^[a-zA-A0-9-]+$/.test(localpart)) {
                  // localpart must be a video uuid.
                  const uuid = localpart
                  const href = getBaseRoute() + '/webchat/room/' + encodeURIComponent(uuid) + '?forcetype=1'
                  const p = fetch('/api/v1/videos/' + uuid, {
                    method: 'GET',
                    headers: peertubeHelpers.getAuthHeader()
                  })
                  p.then(async res => {
                    if (!res.ok) {
                      videoEl.textContent = labels.NotFound
                      return
                    }
                    const video: Video | undefined = await res.json()
                    if (!video) {
                      videoEl.textContent = labels.NotFound
                      return
                    }

                    aEl.href = href
                    const aVideoEl = document.createElement('a')
                    aVideoEl.textContent = video.name
                    aVideoEl.target = '_blank'
                    aVideoEl.href = '/videos/watch/' + uuid
                    videoEl.append(aVideoEl)
                  }, () => {
                    console.error('[peertube-plugin-livechat] Failed to retrieve video ' + uuid)
                  })
                }
              })
            }
          } catch (error) {
            console.error(error)
            peertubeHelpers.notifier.error('Room list failed')
          }
        }
      })
    }
  })
  registerSettingsScript({
    isSettingHidden: options => {
      const name = options.setting.name
      switch (name) {
        case 'prosody-c2s-port':
          return options.formValues['prosody-c2s'] !== true
        case 'prosody-components-port':
        case 'prosody-components-list':
          return options.formValues['prosody-components'] !== true
        case 'converse-autocolors':
          return options.formValues['converse-theme'] !== 'peertube'
        case 'chat-per-live-video-warning':
          return !(options.formValues['chat-all-lives'] === true && options.formValues['chat-per-live-video'] === true)
      }

      return false
    }
  })
}

export {
  register
}
