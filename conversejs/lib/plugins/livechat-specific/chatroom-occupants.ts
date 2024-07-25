// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

export function chatRoomOccupantsOverrides (): {[key: string]: Function} {
  return {
    comparator: function (this: any, occupant1: any, occupant2: any): Number {
      // Overriding Occupants comparators, to display anonymous users at the end of the list.
      const nick1: string = occupant1.getDisplayName()
      const nick2: string = occupant2.getDisplayName()
      const b1 = nick1.startsWith('Anonymous ')
      const b2 = nick2.startsWith('Anonymous ')
      if (b1 === b2) {
        // Both startswith anonymous, or non of it: fallback to the standard comparator.
        return this.__super__.comparator(occupant1, occupant2)
      }
      // Else: Anonymous always last.
      return b1 ? 1 : -1
    }
  }
}
