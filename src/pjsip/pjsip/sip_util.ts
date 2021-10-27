/**
 * This structure describes a target, which can be chained together to form
 * a target set. Each target contains an URI, priority (as q-value), and
 * the last status code and reason phrase received from the target, if the
 * target has been contacted. If the target has not been contacted, the
 * status code field will be zero.
 */
import { pjsip_status_code } from "./sip_msg";

export interface pjsip_target {
  PJ_DECL_LIST_MEMBER (pjsip_target);

  /**< Standard list element */
  uri: pjsip_uri;
  /**< The target URI        */
  q1000: number;
  /**< q-value multiplied by 1000      */
  code: pjsip_status_code;
  /**< Last status code received      */
  reason: string;	/**< Last reason phrase received    */
}

/**
 * This describes a target set. A target set contains a linked-list of
 * pjsip_target.
 */
export interface pjsip_target_set {
  head: pjsip_target;
  /**< Target linked-list head    */
  current: pjsip_target;	    /**< Current target.      */
};

/**
 * These enumerations specify the action to be performed to a redirect
 * response.
 */
export enum pjsip_redirect_op {
  /**
   * Reject the redirection to the current target. The UAC will
   * select the next target from the target set if exists.
   */
  PJSIP_REDIRECT_REJECT,

  /**
   * Accept the redirection to the current target. The INVITE request
   * will be resent to the current target.
   */
  PJSIP_REDIRECT_ACCEPT,

  /**
   * Accept the redirection to the current target and replace the To
   * header in the INVITE request with the current target. The INVITE
   * request will be resent to the current target.
   */
  PJSIP_REDIRECT_ACCEPT_REPLACE,

  /**
   * Defer the redirection decision, for example to request permission
   * from the end user.
   */
  PJSIP_REDIRECT_PENDING,

  /**
   * Stop the whole redirection process altogether. This will cause
   * the invite session to be disconnected.
   */
  PJSIP_REDIRECT_STOP

}

/**
 * This structure holds the state of outgoing stateless request.
 */
export interface pjsip_send_state {
  /** Application token, which was specified when the function
   *  #pjsip_endpt_send_request_stateless() is called.
   */
  token;

  /** Endpoint instance.
   */
  endpt: pjsip_endpoint;

  /** Transmit data buffer being sent.
   */
  tdata: pjsip_tx_data;

  /** Current transport being used.
   */
  cur_transport: pjsip_transport;

  /** The application callback which was specified when the function
   *  #pjsip_endpt_send_request_stateless() was called.
   */
  app_cb (pjsip_send_state, sent: pj_ssize_t, cont: boolean);
}

/**
 * This structure describes destination information to send response.
 * It is initialized by calling #pjsip_get_response_addr().
 *
 * If the response message should be sent using transport from which
 * the request was received, then transport, addr, and addr_len fields
 * are initialized.
 *
 * The dst_host field is also initialized. It should be used when server
 * fails to send the response using the transport from which the request
 * was received, or when the transport is NULL, which means server
 * must send the response to this address (this situation occurs when
 * maddr parameter is set, or when rport param is not set in the request).
 */
export interface pjsip_response_addr {
  transport: pjsip_transport;
  /**< Immediate transport to be used. */
  addr: pj_sockaddr;
  /**< Immediate address to send to.   */
  addr_len: number;
  /**< Address length.         */
  dst_host: pjsip_host_info;	/**< Destination host to contact.    */
}
