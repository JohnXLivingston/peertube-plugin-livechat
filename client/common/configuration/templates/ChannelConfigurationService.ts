import { RegisterClientOptions } from "@peertube/peertube-types/client"
import { ChannelConfiguration, ChannelConfigurationOptions } from "shared/lib/types"
import { getBaseRoute } from "../../../utils/uri"


export class ChannelConfigurationService {

  public _registerClientOptions: RegisterClientOptions

  private _headers : any = {}

  constructor(registerClientOptions: RegisterClientOptions) {
    this._registerClientOptions = registerClientOptions

    this._headers = this._registerClientOptions.peertubeHelpers.getAuthHeader() ?? {}
    this._headers['content-type'] = 'application/json;charset=UTF-8'
  }

  validateOptions = (channelConfigurationOptions: ChannelConfigurationOptions) => {
    return true
  }

  saveOptions = async (channelId: number, channelConfigurationOptions: ChannelConfigurationOptions) => {
    if (!await this.validateOptions(channelConfigurationOptions)) {
      throw new Error('Invalid form data')
    }


    const response = await fetch(
      getBaseRoute(this._registerClientOptions) + '/api/configuration/channel/' + encodeURIComponent(channelId),
      {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify(channelConfigurationOptions)
      }
    )

    if (!response.ok) {
      throw new Error('Failed to save configuration options.')
    }

    return await response.json()
  }

  fetchConfiguration = async (channelId: number): Promise<ChannelConfiguration> => {
    const response = await fetch(
      getBaseRoute(this._registerClientOptions) + '/api/configuration/channel/' + encodeURIComponent(channelId),
      {
        method: 'GET',
        headers: this._headers
      }
    )

    if (!response.ok) {
      throw new Error('Can\'t get channel configuration options.')
    }

    return await response.json()
  }
}