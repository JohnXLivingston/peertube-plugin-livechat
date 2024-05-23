import type { ChannelConfiguration } from 'shared/lib/types'
import { createContext } from '@lit/context'
import { ChannelDetailsService } from '../services/channel-details'

export const channelConfigurationContext = createContext<ChannelConfiguration | undefined>(Symbol('channel-configuration'))
export const channelDetailsServiceContext = createContext<ChannelDetailsService | undefined>(Symbol('channel-configuration-service'))
