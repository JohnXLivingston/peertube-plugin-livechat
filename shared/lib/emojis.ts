// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// Note: API request body size is limited to 100Kb (expressjs body-parser defaut limit, and Peertube nginx config).
// So we must be sure to never send more than 100Kb. The front end sends new emojis by batch, but maxSize must remain
// as little as possible, so that we never reach 100Kb in JSON/base64 format.
export const maxSize: number = 30 * 1024
export const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif']
export const inputFileAccept = ['image/jpg', 'image/png', 'image/gif']
export const allowedMimeTypes = ['image/jpg', 'image/png', 'image/gif']
export const maxEmojisPerChannel = 200
