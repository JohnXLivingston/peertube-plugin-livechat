// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { ChannelConfiguration } from 'shared/lib/types'
import { createContext } from '@lit/context'
import { ChannelDetailsService } from '../services/channel-details'

export const channelConfigurationContext =
  createContext<ChannelConfiguration | undefined>(Symbol('channel-configuration'))
export const channelDetailsServiceContext =
  createContext<ChannelDetailsService | undefined>(Symbol('channel-configuration-service'))
