// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { LitElement } from 'lit'

/**
 * Base class for all Custom Elements.
 */
export class LivechatElement extends LitElement {
  protected createRenderRoot = () => {
    return this
  }
}
