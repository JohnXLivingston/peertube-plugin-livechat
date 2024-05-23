import { createContext } from "@lit/context";
import type { RegisterClientOptions } from "@peertube/peertube-types/client/types";
import type { ChannelConfiguration } from "shared/lib/types";
import { ChannelDetailsService } from "../services/channel-details";

export const registerClientOptionsContext = createContext<RegisterClientOptions | undefined>(Symbol('register-client-options'));
export const channelConfigurationContext = createContext<ChannelConfiguration | undefined>(Symbol('channel-configuration'));
export const channelDetailsServiceContext = createContext<ChannelDetailsService | undefined>(Symbol('channel-configuration-service'));