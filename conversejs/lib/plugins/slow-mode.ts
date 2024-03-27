/**
 * Slow Mode plugin definition.
 * This code should be published to ConverseJS upstream once the XEP for the slow mode feature is proposed.
 * Note: part of the code is also in the custom muc-bottom-panel template.
 */
export const slowModePlugin = {
  dependencies: ['converse-muc', 'converse-muc-views'],
  async initialize (this: any) {
    const _converse = this._converse
    _converse.api.listen.on('sendMessage', function (this: any, options: any): void {
      // disabling the message form/textarea after each new message, for X seconds.
      const { chatbox } = options

      // bypass for moderators.
      const self = chatbox.getOwnOccupant()
      if (self.isModerator()) {
        return
      }

      const slowModeDuration = parseInt(chatbox?.config?.get('slow_mode_duration'))
      if (!(slowModeDuration > 0)) { // undefined, NaN, ...  are not considered > 0.
        return
      }

      console.log(`Slow mode is enabled, disabling the message field for ${slowModeDuration} seconds.`)
      // FIXME: we should search the chat-textarea related to chatbox.
      // I did not find how to get it. As for now there is only one chatbox, we can ignore.
      // FIXME: we disable the field after 100ms, because otherwise ConverseJS will re-enable it before.
      setTimeout(() => {
        document.querySelectorAll('.chat-textarea').forEach((textarea) => {
          // FIXME: field could be enabled by something else (another event in ConverseJS).
          // This is not very important: the server will reject messages anyway.

          textarea.classList.add('disabled')
          textarea.setAttribute('disabled', 'disabled')
          // Note: we are adding a 100ms delay.
          // To minimize the risk that user can send a message before the server will accept it
          // (if the first message lagged for example)
          setTimeout(() => {
            textarea.classList.remove('disabled')
            textarea.removeAttribute('disabled');
            (textarea as HTMLTextAreaElement).focus()
          }, slowModeDuration * 1000 + 100)
        })
      }, 100)
    })
  }
}
