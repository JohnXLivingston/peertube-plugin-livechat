// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'

/**
 * Livechat v13.0.0: now using xmppjs-chat-bot 0.6.0, which replaced RegExp by RE2.
 *  we must change the forbidspecialchar regexp configuration, to be compatible.
 * Livechat v14.0.0: we removed RE2 because of some incompatibility issues.
 *  So this update is no more necessary.
 *  We won't do any update script to remove the `regexp_engine` attribute we added,
 *  the bot will just ignore it. But we keep this function, so that dev can understand
 *  the history, and understand why some files have the `regexp_engine` attribute.
 *
 * This script will only be launched one time.
 */
async function updateForbidSpecialCharsHandler (_options: RegisterServerOptions): Promise<void> {
  // deprecated (see comments)
}

export {
  updateForbidSpecialCharsHandler
}
