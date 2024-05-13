import { RegisterClientOptions } from '@peertube/peertube-types/client'
import { html, LitElement } from 'lit'
import { repeat } from 'lit-html/directives/repeat.js'
import { customElement, property } from 'lit/decorators.js'
import { ptTr } from './TranslationDirective'
import { localizedHelpUrl } from '../../../utils/help'
import './DynamicTableFormElement'
import './PluginConfigurationRow'
import { until } from 'async'
import { Task } from '@lit/task';


@customElement('channel-configuration')
export class ChannelConfigurationElement extends LitElement {

  @property({ attribute: false })
  public registerClientOptions: RegisterClientOptions | undefined

  createRenderRoot = () => {
    return this
  }

  private _asyncTaskRender = new Task(this, {

    task: async ([registerClientOptions], {signal}) => {
      let link = registerClientOptions ? await localizedHelpUrl(registerClientOptions, { page: 'documentation/user/streamers/bot/forbidden_words' }) : '';

      return {
        url : new URL(link),
        title: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_DESC)
      }
    },

    args: () => [this.registerClientOptions]

  });

  render = () => {
    let tableHeader = {
      words: {
        colName: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_LABEL),
        description: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_DESC2)
      },
      regex: {
        colName: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_REGEXP_LABEL),
        description: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_REGEXP_DESC)
      },
      applyToModerators: {
        colName: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_APPLYTOMODERATORS_LABEL),
        description: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_APPLYTOMODERATORS_DESC)
      },
      label: {
        colName: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_LABEL_LABEL),
        description: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_LABEL_DESC)
      },
      reason: {
        colName: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_REASON_LABEL),
        description: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_REASON_DESC)
      },
      comments: {
        colName: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_COMMENTS_LABEL),
        description: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_COMMENTS_DESC)
      }
    }
    let tableSchema = {
      words: {
        inputType: 'text',
        default: 'helloqwesad'
      },
      regex: {
        inputType: 'text',
        default: 'helloaxzca'
      },
      applyToModerators: {
        inputType: 'checkbox',
        default: true
      },
      label: {
        inputType: 'text',
        default: 'helloasx'
      },
      reason: {
        inputType: 'select',
        default: 'transphobia',
        label: 'choose your poison',
        options: {'racism': 'Racism', 'sexism': 'Sexism', 'transphobia': 'Transphobia', 'bigotry': 'Bigotry'}
      },
      comments: {
        inputType: 'textarea',
        default: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
        culpa qui officia deserunt mollit anim id est laborum.`
      },
    }
    let tableRows = [
      {
        words: 'teweqwst',
        regex: 'tesdgst',
        applyToModerators: false,
        label: 'teswet',
        reason: 'sexism',
        comments: 'tsdaswest',
      },
      {
        words: 'tedsadst',
        regex: 'tezxccst',
        applyToModerators: true,
        label: 'tewest',
        reason: 'racism',
        comments: 'tesxzct',
      },
      {
        words: 'tesadsdxst',
        regex: 'dsfsdf',
        applyToModerators: false,
        label: 'tesdadst',
        reason: 'bigotry',
        comments: 'tsadest',
      },
    ]

    return this._asyncTaskRender.render({
      complete: (helpLink) => html`
        <div class="container">
          <channel-configuration></channel-configuration>
          <plugin-configuration-row
            .title=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_LABEL)}
            .description=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_DESC)}
            .helpLink=${helpLink}
          >
            <dynamic-table-form
              .header=${tableHeader}
              .schema=${tableSchema}
              .rows=${tableRows}
              .formName=${'forbidden-words'}
            >
            </dynamic-table-form>
          </plugin-configuration-row>
        </div>`
    })
  }
}
