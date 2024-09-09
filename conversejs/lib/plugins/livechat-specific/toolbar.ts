// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// FIXME: @stylistic/indent is buggy with strings literrals.
/* eslint-disable @stylistic/indent */

/**
 * Do some customization on the toolbar:
 * * change the appearance of the toggle occupants button
 *
 * @param plugin The plugin object
 */
export function customizeToolbar (plugin: any): void {
  const _converse = plugin._converse
  _converse.api.listen.on('getToolbarButtons', getToolbarButtons.bind(plugin))
}

function getToolbarButtons (this: any, toolbarEl: any, buttons: any[]): any {
  const _converse = this._converse

  // Adding a toggle_occupants button.
  // Note: we don't need to test conditions, we know the button was here.
  const i18nHideOccupants = _converse.__('Hide participants')
  const i18nShowOccupants = _converse.__('Show participants')
  const html = window.converse.env.html
  const icon = toolbarEl.hidden_occupants
    ? html`<converse-icon
            color="var(--muc-toolbar-btn-color)"
            class="fa fa-angle-double-left"
            size="1em">
        </converse-icon>
        <converse-icon
            color="var(--muc-toolbar-btn-color)"
            class="fa users"
            size="1em">
        </converse-icon>`
    : html`<converse-icon
            color="var(--muc-toolbar-btn-color)"
            class="fa users"
            size="1em">
        </converse-icon>
        <converse-icon
            color="var(--muc-toolbar-btn-color)"
            class="fa fa-angle-double-right"
            size="1em">
        </converse-icon>`
  buttons.push(html`
      <button class="toggle-occupants btn" type="button"
              title="${toolbarEl.hidden_occupants ? i18nShowOccupants : i18nHideOccupants}"
              @click=${(ev?: Event) => {
                ev?.preventDefault()
                toolbarEl.model.save({
                  hidden_occupants: !toolbarEl.model.get('hidden_occupants')
                })
              }}>
              ${icon}
      </button>`
  )
  return buttons
}
