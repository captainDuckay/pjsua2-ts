/** User agent initialization parameter. */
export interface pjsip_ua_init_param {
  /** Callback to be called when the UA layer detects that outgoing
   *  dialog has forked.
   */
  on_dlg_forked (first_set: pjsip_dialog, res: pjsip_rx_data): pjsip_dialog;
}
