export const windowTitlePlugin = {
  dependencies: ['converse-muc-views'],
  overrides: {
    ChatRoomView: {
      requestUpdate: function (this: any): any {
        console.log('[livechatWindowTitlePlugin] updating the document title.')
        try {
          if (this.model?.getDisplayName) {
            const title = this.model.getDisplayName()
            if (document.title !== title) {
              document.title = title
            }
          }
        } catch (err) {
          console.error('[livechatWindowTitlePlugin] Failed updating the window title', err)
        }
        return this.__super__.requestUpdate.apply(this)
      }
    }
  }
}
