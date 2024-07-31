// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Livechat Converse does not include plugins/profile,
 * so the default profile modal is broken.
 * Moreover this modal includes some features that we do not want (password change, ...).
 * So we simply define the converse-profile-modal to be converse-muc-occupant-modal!
 * @param plugin The plugin object
 */
export function customizeProfileModal (plugin: any): void {
  const _converse = plugin._converse
  const OccupantModal = _converse.api.elements.registry['converse-muc-occupant-modal']
  if (!OccupantModal) { return }
  class ProfileModal extends OccupantModal {
    initialize (): any {
      // We just need to change the modal for the occupant:
      if (this.model?.getOccupant) {
        this.model = this.model.getOccupant()
      }
      return super.initialize()
    }
  }
  _converse.api.elements.define('converse-profile-modal', ProfileModal)
}
