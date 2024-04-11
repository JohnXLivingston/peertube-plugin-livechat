/**
 * Plugin to add buttons (help, close, open in another window) in the muc menu,
 * when we are embedded in Peertube.
 */
export const livechatMiniMucHeadPlugin = {
  dependencies: ['converse-muc', 'converse-muc-views'],
  initialize: function (this: any) {
    const _converse = this._converse
    _converse.api.settings.extend({
      // tells the overloaded template to render differently.
      livechat_mini_muc_head: false
    })

    _converse.api.listen.on('getHeadingButtons', (view: any, buttons: any[]) => {
      if (view.model.get('type') !== _converse.CHATROOMS_TYPE) {
        // only on MUC.
        return
      }

      // removing the 'show/hide topic' buttons
      buttons = buttons.filter(b => b.name !== 'toggle-topic')
      return buttons
    })
  }
}
