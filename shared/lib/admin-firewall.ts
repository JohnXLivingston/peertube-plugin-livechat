// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// Note: API request body size is limited to 100Kb (expressjs body-parser defaut limit, and Peertube nginx config).
// So we must be sure to never send more than 100Kb.
// All files are sent in one JSON object.
export const maxFirewallFileSize: number = 3 * 1024
export const maxFirewallFiles = 20

export const maxFirewallNameLength = 20
export const firewallNameRegexp = /^[a-zA-Z0-9_-]+$/
