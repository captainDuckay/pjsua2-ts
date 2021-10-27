/**
 * This enumeration describes basic subscription state as described in the
 * RFC 3265. The standard specifies that extensions may define additional
 * states. In the case where the state is not known, the subscription state
 * will be set to PJSIP_EVSUB_STATE_UNKNOWN, and the token will be kept
 * in state_str member of the susbcription structure.
 */
import { pjsip_event } from '../pjsip/sip_event'
import { pjsip_transaction } from '../pjsip/sip_transaction'
import { pjsip_rx_data } from '../pjsip/sip_transport'
import { int } from '../pjsip/c_types_to_ts'
import { pj_str_t } from '../../pjlib/pj/types'
import { pjsip_hdr, pjsip_msg_body } from '../pjsip/sip_msg'

export enum pjsip_evsub_state {
  PJSIP_EVSUB_STATE_NULL, /**< State is NULL.          */
  PJSIP_EVSUB_STATE_SENT, /**< Client has sent SUBSCRIBE request.    */
  PJSIP_EVSUB_STATE_ACCEPTED, /**< 2xx response to SUBSCRIBE has been
   sent/received.          */
  PJSIP_EVSUB_STATE_PENDING, /**< Subscription is pending.        */
  PJSIP_EVSUB_STATE_ACTIVE, /**< Subscription is active.        */
  PJSIP_EVSUB_STATE_TERMINATED, /**< Subscription is terminated.      */
  PJSIP_EVSUB_STATE_UNKNOWN,	 /**< Subscription state can not be determined.
   Application can query the state by
   calling #pjsip_evsub_get_state_name().*/
}

/**
 * This structure describes callback that is registered by application or
 * package to receive notifications about subscription events.
 */
export interface pjsip_evsub_user {
  /**
   * This callback is called when subscription state has changed.
   * Application MUST be prepared to receive NULL event and events with
   * type other than PJSIP_EVENT_TSX_STATE
   *
   * This callback is OPTIONAL.
   *
   * @param sub  The subscription instance.
   * @param event  The event that has caused the state to change,
   *      which may be NULL or may have type other than
   *      PJSIP_EVENT_TSX_STATE.
   */
  on_evsub_state (sub: pjsip_evsub, event: pjsip_event);

  /**
   * This callback is called when transaction state has changed.
   *
   * @param sub  The subscription instance.
   * @param tsx  Transaction.
   * @param event  The event.
   */
  on_tsx_state (sub: pjsip_evsub, tsx: pjsip_transaction, event: pjsip_event);

  /**
   * This callback is called when incoming SUBSCRIBE (or any method that
   * establishes the subscription in the first place) is received. It
   * allows application to specify what response should be sent to
   * remote, along with additional headers and message body to be put
   * in the response.
   *
   * This callback is OPTIONAL.
   *
   * However, implementation MUST send NOTIFY request upon receiving this
   * callback. The suggested behavior is to call
   * #pjsip_evsub_current_notify(), since this function takes care
   * about unsubscription request and calculates the appropriate expiration
   * interval.
   */
  on_rx_refresh (sub: pjsip_evsub,
    rdata: pjsip_rx_data,
    p_st_code: int,
    p_st_text: pj_str_t,
    res_hdr: pjsip_hdr,
    p_body: pjsip_msg_body);

  /**
   * This callback is called when client/subscriber received incoming
   * NOTIFY request. It allows the application to specify what response
   * should be sent to remote, along with additional headers and message
   * body to be put in the response.
   *
   * This callback is OPTIONAL. When it is not implemented, the default
   * behavior is to respond incoming NOTIFY request with 200 (OK).
   *
   * @param sub  The subscription instance.
   * @param rdata  The received NOTIFY request.
   * @param p_st_code  Application MUST set the value of this argument with
   *      final status code (200-699) upon returning from the
   *      callback.
   * @param p_st_text  Custom status text, if any.
   * @param res_hdr  Upon return, application can put additional headers
   *      to be sent in the response in this list.
   * @param p_body  Application MAY specify message body to be sent in
   *      the response.
   */
  on_rx_notify (sub: pjsip_evsub,
    rdata: pjsip_rx_data,
    p_st_code: int,
    p_st_text: pj_str_t,
    res_hdr: pjsip_hdr,
    p_body: pjsip_msg_body);

  /**
   * This callback is called when it is time for the client to refresh
   * the subscription.
   *
   * This callback is OPTIONAL when PJSIP package such as presence or
   * refer is used; the event package will refresh subscription by sending
   * SUBSCRIBE with the interval set to current/last interval.
   *
   * @param sub  The subscription instance.
   */
  on_client_refresh (sub: pjsip_evsub);

  /**
   * This callback is called when server doesn't receive subscription
   * refresh after the specified subscription interval.
   *
   * This callback is OPTIONAL when PJSIP package such as presence or
   * refer is used; the event package send NOTIFY to terminate the
   * subscription.
   */
  on_server_timeout (sub: pjsip_evsub);

}
