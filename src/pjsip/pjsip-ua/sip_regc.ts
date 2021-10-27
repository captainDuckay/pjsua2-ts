/** Structure to hold parameters when calling application's callback.
 *  The application's callback is called when the client registration process
 *  has finished.
 */
import { int, pj_bool_t, pj_status_t, pj_str_t, unsigned } from "../pjsip/c_types_to_ts";
import { pjsip_rx_data, pjsip_transport } from "../pjsip/sip_transport";
import { pjsip_contact_hdr } from "../pjsip/sip_msg";

export interface pjsip_regc_cbparam {
  regc: pjsip_regc;
  /**< Client registration structure.      */
  token: void;	    /**< Arbitrary token set by application */

  /** Error status. If this value is non-PJ_SUCCESS, some error has occured.
   *  Note that even when this contains PJ_SUCCESS the registration might
   *  have failed; in this case the \a code field will contain non
   *  successful (non-2xx status class) code
   */
  status: pj_status_t;
  code: int;
  /**< SIP status code received.      */
  reason: pj_str_t;
  /**< SIP reason phrase received.      */
  rdata: pjsip_rx_data;
  /**< The complete received response.    */
  expiration: unsigned;
  /**< Next expiration interval,
   PJSIP_REGC_EXPIRATION_NOT_SPECIFIED
   if not specified.            */
  contact_cnt: int;
  /**<Number of contacts in response.    */
  contact: pjsip_contact_hdr[];
  /**< Contacts.    */
  is_unreg: pj_bool_t;  /**< Expire header, if any, set to zero?*/
}

/**
 * Structure to hold parameters when calling application's callback
 * specified in #pjsip_regc_set_reg_tsx_cb().
 * To update contact address, application can set the field contact_cnt
 * and contact inside the callback.
 */
export interface pjsip_regc_tsx_cb_param {
  cbparam: pjsip_regc_cbparam;
  contact_cnt: int;
  contact: pj_str_t[];
}

/**
 * Client registration information.
 */
export interface pjsip_regc_info {
  server_uri: pj_str_t;
  /**< Server URI,            */
  client_uri: pj_str_t;
  /**< Client URI (From header).        */
  is_busy: pj_bool_t;
  /**< Have pending transaction?        */
  auto_reg: pj_bool_t;
  /**< Will register automatically?        */
  interval: unsigned;
  /**< Registration interval (seconds).      */
  next_reg: unsigned;
  /**< Time until next registration (seconds).    */
  transport: pjsip_transport; /**< Last transport used.        */
}

