// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// FIXME: this function is copied from @converse. Should not do so.
export function getOpenPromise (): any {
  const wrapper: any = {
    isResolved: false,
    isPending: true,
    isRejected: false
  }
  const promise: any = new Promise((resolve, reject) => {
    wrapper.resolve = resolve
    wrapper.reject = reject
  })
  Object.assign(promise, wrapper)
  promise.then(
    function (v: any) {
      promise.isResolved = true
      promise.isPending = false
      promise.isRejected = false
      return v
    },
    function (e: any) {
      promise.isResolved = false
      promise.isPending = false
      promise.isRejected = true
      throw (e as Error)
    }
  )
  return promise
}

export async function destroyMUC (_converse: any, model: any): Promise<void> {
  const __ = _converse.__
  const messages = [__('Are you sure you want to destroy this groupchat?')]
  // Note: challenge and newjid make no sens for peertube-plugin-livechat,
  // we remove them comparing to the original function.
  let fields = [
    {
      name: 'reason',
      label: __('Optional reason for destroying this groupchat'),
      placeholder: __('Reason'),
      value: undefined
    }
  ]
  try {
    fields = await _converse.api.confirm(__('Confirm'), messages, fields)
    const reason = fields.filter(f => f.name === 'reason').pop()?.value
    const newjid = undefined
    return model.sendDestroyIQ(reason, newjid).then(() => model.close())
  } catch (e) {
    console.error(e)
  }
}
