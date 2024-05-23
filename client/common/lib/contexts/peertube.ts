// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client/types'
import { createContext } from '@lit/context'

export const registerClientOptionsContext =
  createContext<RegisterClientOptions | undefined>(Symbol('register-client-options'))
