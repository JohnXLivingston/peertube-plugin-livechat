/** Localization keys to inject in ConverseJS:
 *  these keys are used to:
 *  - inject needed localization strings in ConverseJS language files
 *  - defined global variable using Webpack, to retrieve the english key to pass to the ConverseJS localization function
*/
const locKeys = [
  'slow_mode_info',
  'login_using_external_account',
  'login_remote_peertube',
  'login_remote_peertube_searching',
  'login_remote_peertube_url',
  'login_remote_peertube_url_invalid',
  'login_remote_peertube_no_livechat',
  'login_remote_peertube_video_not_found',
  'login_remote_peertube_video_not_found_try_anyway',
  'login_remote_peertube_video_not_found_try_anyway_button',
  'login_remote_peertube_video_open_failed',
  'login_external_auth_alert_message'
]

module.exports = locKeys
