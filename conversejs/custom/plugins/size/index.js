// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { _converse, converse, api } from '../../../src/headless/core.js'

/**
 * This plugin computes the available width of converse-root, and adds classes
 * and events so we can adapt the display of some elements to the current
 * width/height.
 * We can't rely on things such as @media, because in certain cases (for
 * example when the chat is beside the video), the chat position and size
 * depends on many other elements (video in large mode, ...).
 */
converse.plugins.add('livechat-converse-size', {
  dependencies: [],

  initialize () {
    _converse.api.listen.on('connected', start)
    _converse.api.listen.on('reconnected', start)
    _converse.api.listen.on('disconnected', stop)
  }
})

const rootResizeObserver = new ResizeObserver(entries => {
  for (const entry of entries) {
    handle(entry.target)
  }
})

function start () {
  const root = document.querySelector('converse-root')
  if (!root) { return }
  if (root.hasAttribute('livechat-converse-root-width')) {
    stop()
  }

  root.style.display = 'block' // this is needed, otherwise it won't have any width.

  rootResizeObserver.observe(root)
  handle(root)
}

function stop () {
  rootResizeObserver.disconnect()
  document.querySelector('converse-root')?.removeAttribute('livechat-converse-root-width')
}

function handle (el) {
  const rect = el.getBoundingClientRect()
  const width = rect.width > 576 ? 'large' : (rect.width > 250 ? 'medium' : 'small')
  const previous = el.getAttribute('livechat-converse-root-width')
  if (width === previous) { return }

  el.setAttribute('livechat-converse-root-width', width)
  api.trigger('livechatSizeChanged', {
    width: width
  })
}
