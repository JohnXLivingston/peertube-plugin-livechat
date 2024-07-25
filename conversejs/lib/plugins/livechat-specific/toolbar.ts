// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

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

  // We will replace the toggle occupant button, to change its appearance.
  // First, we must find it. We search from the end, because usually it is the last one.
  let toggleOccupantButton: any
  for (const button of buttons.reverse()) {
    if (button.strings?.find((s: string) => s.includes('toggle_occupants'))) { // searching the classname
      console.debug('[livechatSpecificsPlugin] found the toggle occupants button', button)
      toggleOccupantButton = button
      break
    }
  }
  if (!toggleOccupantButton) {
    console.debug('[livechatSpecificsPlugin] Did not found the toggle occupants button')
    return buttons
  }

  buttons = buttons.filter(b => b !== toggleOccupantButton)
  // Replacing by the new button...
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
      <button class="toggle_occupants right"
              title="${toolbarEl.hidden_occupants ? i18nShowOccupants : i18nHideOccupants}"
              @click=${toolbarEl.toggleOccupants}>
              ${icon}
      </button>`
  )
  return buttons
}
