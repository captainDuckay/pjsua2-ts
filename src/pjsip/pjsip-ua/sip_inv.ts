/**
 * This enumeration describes invite session state.
 */
import { pjsip_rx_data, pjsip_tx_data } from "../pjsip/sip_transport";
import { char, pj_bool_t, pj_int32_t, pj_pool_t, pj_status_t, pj_str_t, unsigned } from "../pjsip/c_types_to_ts";
import { pjsip_event } from "../pjsip/sip_event";
import { pjsip_redirect_op } from "../pjsip/sip_util";
import { pjsip_transaction } from "../pjsip/sip_transaction";
import { pjsip_role_e } from "../pjsip/sip_types";
import { pjsip_dialog } from "../pjsip/sip_dialog";
import { pjsip_status_code } from "../pjsip/sip_msg";

export enum pjsip_inv_state {
  PJSIP_INV_STATE_NULL, /**< Before INVITE is sent or received  */
  PJSIP_INV_STATE_CALLING, /**< After INVITE is sent        */
  PJSIP_INV_STATE_INCOMING, /**< After INVITE is received.      */
  PJSIP_INV_STATE_EARLY, /**< After response with To tag.      */
  PJSIP_INV_STATE_CONNECTING, /**< After 2xx is sent/received.      */
  PJSIP_INV_STATE_CONFIRMED, /**< After ACK is sent/received.      */
  PJSIP_INV_STATE_DISCONNECTED,   /**< Session is terminated.        */
}

/**
 * Structure to hold parameters when calling the callback
 * #on_rx_offer2().
 */
export interface pjsip_inv_on_rx_offer_cb_param {
  offer: pjmedia_sdp_session;
  /** Remote offer.        */
  rdata: pjsip_rx_data;	    /** The received request.       */
}

/**
 * This structure contains callbacks to be registered by application to
 * receieve notifications from the framework about various events in
 * the invite session.
 */
export interface pjsip_inv_callback {
  /**
   * This callback is called when the invite sesion state has changed.
   * Application should inspect the session state (inv_sess->state) to get
   * the current state of the session.
   *
   * This callback is mandatory.
   *
   * @param inv  The invite session.
   * @param e    The event which has caused the invite session's
   *      state to change.
   */
  on_state_changed (inv: pjsip_inv_session, e: pjsip_event);

  /**
   * This callback is called when the invite usage module has created
   * a new dialog and invite because of forked outgoing request.
   *
   * Currently the invite session does not create a new dialog in
   * forking scenario, so this callback will never be invoked.
   *
   * @param inv  The new invite session.
   * @param e    The event which has caused the dialog to fork.
   *      The type of this event can be either
   *      PJSIP_EVENT_RX_MSG or PJSIP_EVENT_RX_200_MSG.
   */
  on_new_session (inv: pjsip_inv_session, e: pjsip_event);

  /**
   * This callback is called whenever any transactions within the session
   * has changed their state. Application MAY implement this callback,
   * e.g. to monitor the progress of an outgoing request, or to send
   * response to unhandled incoming request (such as INFO).
   *
   * This callback is optional.
   *
   * @param inv  The invite session.
   * @param tsx  The transaction, which state has changed.
   * @param e    The event which has caused the transation state's
   *      to change.
   */
  on_tsx_state_changed (inv: pjsip_inv_session,
    tsx: pjsip_transaction,
    e: pjsip_event);

  /**
   * This callback is called when the invite session has received
   * new offer from peer. Application can inspect the remote offer
   * in "offer", and set the SDP answer with #pjsip_inv_set_sdp_answer().
   * When the application sends a SIP message to send the answer,
   * this SDP answer will be negotiated with the offer, and the result
   * will be sent with the SIP message.
   *
   * Note: if callback #on_rx_offer2() is implemented, this callback will
   * not be called.
   *
   * @param inv  The invite session.
   * @param offer  Remote offer.
   */
  on_rx_offer (inv: pjsip_inv_session, offer: pjmedia_sdp_session);

  /**
   * This callback is called when the invite session has received
   * new offer from peer. Variant of #on_rx_offer() callback.
   *
   * @param inv  The invite session.
   * @param param  The callback parameters.
   */
  on_rx_offer2 (inv: pjsip_inv_session, param: pjsip_inv_on_rx_offer_cb_param);

  /**
   * This callback is optional, and is called when the invite session has
   * received a re-INVITE from the peer. It will be called after
   * on_rx_offer() callback and works only for re-INVITEs. It allows more
   * fine-grained control over the response to a re-INVITE, e.g. sending
   * a provisional response first. Application can return PJ_SUCCESS and
   * send a reply using the function #pjsip_inv_initial_answer() or
   * #pjsip_inv_answer(), as with the initial INVITE. If application
   * returns non-PJ_SUCCESS, it needs to set the SDP answer with
   * #pjsip_inv_set_sdp_answer() and the re-INVITE will be answered
   * automatically.
   *
   * Remarks: Application may need to monitor on_tsx_state_changed()
   * callback to check whether the re-INVITE is already answered
   * automatically with 487 due to being cancelled.
   *
   * @param inv  The invite session.
   * @param offer  Remote offer.
   * @param rdata     The received re-INVITE request.
   *
   * @return    - PJ_SUCCESS: application will answer the re-INVITE
   *                    manually
   *                  - non-PJ_SUCCESS: answer the re-INVITE automatically
   *                    using the SDP set via #pjsip_inv_set_sdp_answer()
   */
  on_rx_reinvite (inv: pjsip_inv_session, offer: pjmedia_sdp_session, rdata: pjsip_rx_data): pj_status_t;

  /**
   * This callback is optional, and it is used to ask the application
   * to create a fresh offer, when the invite session has received
   * re-INVITE without offer. This offer then will be sent in the
   * 200/OK response to the re-INVITE request.
   *
   * If application doesn't implement this callback, the invite session
   * will send the currently active SDP as the offer.
   *
   * @param inv  The invite session.
   * @param p_offer  Pointer to receive the SDP offer created by
   *      application.
   */
  on_create_offer (inv: pjsip_inv_session, p_offer: pjmedia_sdp_session);

  /**
   * This callback is called after SDP offer/answer session has completed.
   * The status argument specifies the status of the offer/answer,
   * as returned by pjmedia_sdp_neg_negotiate().
   *
   * This callback is optional (from the point of view of the framework),
   * but all useful applications normally need to implement this callback.
   *
   * @param inv  The invite session.
   * @param status  The negotiation status.
   */
  on_media_update (inv_ses: pjsip_inv_session, status: pj_status_t);

  /**
   * This callback is called when the framework needs to send
   * ACK request after it receives incoming  2xx response for
   * INVITE. It allows application to manually handle the
   * transmission of ACK request, which is required by some 3PCC
   * scenarios. If this callback is not implemented, the framework
   * will handle the ACK transmission automatically.
   *
   * When this callback is overridden, application may delay the
   * sending of the ACK request (for example, when it needs to
   * wait for answer from the other call leg, in 3PCC scenarios).
   *
   * Application MUST create the ACK request using pjsip_inv_create_ack()
   * and send it using pjsip_inv_send_msg().
   *
   * Once it has sent the ACK request, the framework will keep
   * this ACK request in the cache. Subsequent receipt of 2xx response
   * will not cause this callback to be called (but see exception below),
   * and instead automatic retransmission of this ACK request from
   * the cache will be done by the framework.
   * Exception: if app has created the ACK but has not sent it,
   * while it receives a retransmission of 2xx response, this callback
   * will be called again.
   *
   * This callback is optional.
   */
  on_send_ack (inv: pjsip_inv_session, rdata: pjsip_rx_data);

  /**
   * This callback is called when the session is about to resend the
   * INVITE request to the specified target, following the previously
   * received redirection response.
   *
   * Application may accept the redirection to the specified target
   * (the default behavior if this callback is implemented), reject
   * this target only and make the session continue to try the next
   * target in the list if such target exists, stop the whole
   * redirection process altogether and cause the session to be
   * disconnected, or defer the decision to ask for user confirmation.
   *
   * This callback is optional. If this callback is not implemented,
   * the default behavior is to NOT follow the redirection response.
   *
   * @param inv  The invite session.
   * @param target  The current target to be tried.
   * @param e    The event that caused this callback to be called.
   *      This could be the receipt of 3xx response, or
   *      4xx/5xx response received for the INVITE sent to
   *      subsequent targets, or NULL if this callback is
   *      called from within #pjsip_inv_process_redirect()
   *      context.
   *
   * @return    Action to be performed for the target. Set this
   *      parameter to one of the value below:
   *      - PJSIP_REDIRECT_ACCEPT: immediately accept the
   *        redirection to this target. When set, the
   *        session will immediately resend INVITE request
   *        to the target after this callback returns.
   *      - PJSIP_REDIRECT_REJECT: immediately reject this
   *        target. The session will continue retrying with
   *        next target if present, or disconnect the call
   *        if there is no more target to try.
   *      - PJSIP_REDIRECT_STOP: stop the whole redirection
   *        process and immediately disconnect the call. The
   *        on_state_changed() callback will be called with
   *        PJSIP_INV_STATE_DISCONNECTED state immediately
   *        after this callback returns.
   *      - PJSIP_REDIRECT_PENDING: set to this value if
   *        no decision can be made immediately (for example
   *        to request confirmation from user). Application
   *        then MUST call #pjsip_inv_process_redirect()
   *        to either accept or reject the redirection upon
   *        getting user decision.
   */
  on_redirected (inv: pjsip_inv_session,
    target: pjsip_uri,
    e: pjsip_event): pjsip_redirect_op;

}

/**
 * This enumeration shows various options that can be applied to a session.
 * The bitmask combination of these options need to be specified when
 * creating a session. After the dialog is established (including early),
 * the options member of #pjsip_inv_session shows which capabilities are
 * common in both endpoints.
 */
enum pjsip_inv_option {
  /**
   * Indicate support for reliable provisional response extension
   */
  PJSIP_INV_SUPPORT_100REL = 1,

  /**
   * Indicate support for session timer extension.
   */
  PJSIP_INV_SUPPORT_TIMER = 2,

  /**
   * Indicate support for UPDATE method. This is automatically implied
   * when creating outgoing dialog. After the dialog is established,
   * the options member of #pjsip_inv_session shows whether peer supports
   * this method as well.
   */
  PJSIP_INV_SUPPORT_UPDATE = 4,

  /**
   * Indicate support for ICE
   */
  PJSIP_INV_SUPPORT_ICE = 8,

  /**
   * Require ICE support.
   */
  PJSIP_INV_REQUIRE_ICE = 16,

  /**
   * Require reliable provisional response extension.
   */
  PJSIP_INV_REQUIRE_100REL = 32,

  /**
   * Require session timer extension.
   */
  PJSIP_INV_REQUIRE_TIMER = 64,

  /**
   * Session timer extension will always be used even when peer doesn't
   * support/want session timer.
   */
  PJSIP_INV_ALWAYS_USE_TIMER = 128,

  /**
   * Indicate support for trickle ICE
   */
  PJSIP_INV_SUPPORT_TRICKLE_ICE = 256,

  /**
   * Require trickle ICE support.
   */
  PJSIP_INV_REQUIRE_TRICKLE_ICE = 512,

};

/**
 * This structure describes the invite session.
 *
 * Note regarding the invite session's pools. The inv_sess used to have
 * only one pool, which is just a pointer to the dialog's pool. Ticket
 * http://trac.pjsip.org/repos/ticket/877 has found that the memory
 * usage will grow considerably everytime re-INVITE or UPDATE is
 * performed.
 *
 * Ticket #877 then created two more memory pools for the inv_sess, so
 * now we have three memory pools:
 *  - pool: to be used to allocate long term data for the session
 *  - pool_prov and pool_active: this is a flip-flop pools to be used
 *     interchangably during re-INVITE and UPDATE. pool_prov is
 *     "provisional" pool, used to allocate SDP offer or answer for
 *     the re-INVITE and UPDATE. Once SDP negotiation is done, the
 *     provisional pool will be made as the active pool, then the
 *     existing active pool will be reset, to release the memory
 *     back to the OS. So these pool's lifetime is synchronized to
 *     the SDP offer-answer negotiation.
 *
 * Higher level application such as PJSUA-LIB has been modified to
 * make use of these flip-flop pools, i.e. by creating media objects
 * from the provisional pool rather than from the long term pool.
 *
 * Other applications that want to use these pools must understand
 * that the flip-flop pool's lifetimes are synchronized to the
 * SDP offer-answer negotiation.
 *
 * The lifetime of this session is controlled by the reference counter in this
 * structure, which is manipulated by calling #pjsip_inv_add_ref and
 * #pjsip_inv_dec_ref. When the reference counter has reached zero, then
 * this session will be destroyed.
 */
export interface pjsip_inv_session {
  obj_name: char;
  /**< Log identification */
  pool: pj_pool_t;
  /**< Long term pool.    */
  pool_prov: pj_pool_t;
  /**< Provisional pool   */
  pool_active: pj_pool_t;
  /**< Active/current pool*/
  state: pjsip_inv_state;
  /**< Invite sess state. */
  cancelling: pj_bool_t;
  /**< CANCEL requested   */
  pending_cancel: pj_bool_t;
  /**< Wait to send CANCEL*/
  pending_bye: pjsip_tx_data;
  /**< BYE to send later  */
  cause: pjsip_status_code;
  /**< Disconnect cause.  */
  cause_text: pj_str_t;
  /**< Cause text.      */
  notify: pj_bool_t;
  /**< Internal.      */
  cb_called: unsigned;
  /**< Cb has been called */
  dlg: pjsip_dialog;
  /**< Underlying dialog. */
  role: pjsip_role_e;
  /**< Invite role.      */
  options: unsigned;
  /**< Options in use.    */
  neg: pjmedia_sdp_neg;
  /**< Negotiator.      */
  sdp_neg_flags: unsigned;
  /**< SDP neg flags.     */
  invite_tsx: pjsip_transaction;
  /**< 1st invite tsx.    */
  invite_req: pjsip_tx_data;
  /**< Saved invite req   */
  last_answer: pjsip_tx_data;
  /**< Last INVITE resp.  */
  last_ack: pjsip_tx_data;
  /**< Last ACK request   */
  last_ack_cseq: pj_int32_t;
  /**< CSeq of last ACK   */
  mod_data;
  /**< Modules data.      */
  timer: pjsip_timer;
  /**< Session Timers.    */
  following_fork: pj_bool_t;
  /**< Internal, following
   forked media?      */
  ref_cnt: pj_atomic_t;
  /**< Reference counter. */
  updated_sdp_answer: pj_bool_t;        /**< SDP answer just been
   updated?      */
};

/**
 * This structure represents SDP information in a pjsip_rx_data. Application
 * retrieve this information by calling #pjsip_rdata_get_sdp_info(). This
 * mechanism supports multipart message body.
 */
export interface pjsip_rdata_sdp_info {
  /**
   * Pointer and length of the text body in the incoming message. If
   * the pointer is NULL, it means the message does not contain SDP
   * body.
   */
  body: pj_str_t;

  /**
   * This will contain non-zero if an invalid SDP body is found in the
   * message.
   */
  sdp_err: pj_status_t;

  /**
   * A parsed and validated SDP body.
   */
  sdp: pjmedia_sdp_session;

}
