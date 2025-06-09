// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import { html, render } from 'lit'
import './elements' // Import all needed elements.

/**
 * Registers stuff related to mod_firewall configuration.
 * @param clientOptions Peertube client options
 */
async function registerAdminFirewall (clientOptions: RegisterClientOptions): Promise<void> {
  const { registerClientRoute } = clientOptions

  registerClientRoute({
    route: 'livechat/admin/firewall',
    onMount: async ({ rootEl }) => {
      render(html`<livechat-admin-firewall .registerClientOptions=${clientOptions}></livechat-admin-firewall>`, rootEl)
    }
  })
}

export {
  registerAdminFirewall
}
