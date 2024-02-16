/**
 * Slow Mode plugin definition.
 * This code should be published to ConverseJS upstream once the XEP for the slow mode feature is proposed.
 * Note: part of the code is also in the custom muc-bottom-panel template.
 */
export const slowModePlugin = {
  dependencies: ['converse-muc', 'converse-muc-views'],
  async initialize (this: any) {
    const _converse = this._converse
    _converse.api.listen.on('chatRoomInitialized', function (this: any, _model: any): void {
      // TODO: disable the textarea after each new message, for X seconds.
    })
  }
}
