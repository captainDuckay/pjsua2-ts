/** Constant to identify invalid ID for all sorts of IDs. */
import { pjsip_rx_data } from "../pjsip/sip_transport";
import { pjmedia_type } from "../pjsua2/types";
import { pj_pool_t } from "../pjsip/c_types_to_ts";

enum pjsua_invalid_id_const_ {
  PJSUA_INVALID_ID = -1
}

/** Call identification */
export type pjsua_call_id = number;

/** Account identification */
export type pjsua_acc_id = number;

/** Buddy identification */
export type pjsua_buddy_id = number;

/** File player identification */
export type pjsua_player_id = number;

/** File recorder identification */
export type pjsua_recorder_id = number;

/** Conference port identification */
export type pjsua_conf_port_id = number;

/**
 * This enumeration represents pjsua state.
 */
enum pjsua_state {
  /**
   * The library has not been initialized.
   */
  PJSUA_STATE_NULL,

  /**
   * After pjsua_create() is called but before pjsua_init() is called.
   */
  PJSUA_STATE_CREATED,

  /**
   * After pjsua_init() is called but before pjsua_start() is called.
   */
  PJSUA_STATE_INIT,

  /**
   * After pjsua_start() is called but before everything is running.
   */
  PJSUA_STATE_STARTING,

  /**
   * After pjsua_start() is called and before pjsua_destroy() is called.
   */
  PJSUA_STATE_RUNNING,

  /**
   * After pjsua_destroy() is called but before the function returns.
   */
  PJSUA_STATE_CLOSING

}

/**
 * Logging configuration, which can be (optionally) specified when calling
 * #pjsua_init(). Application must call #pjsua_logging_config_default() to
 * initialize this structure with the default values.
 */
export interface pjsua_logging_config {
  /**
   * Log incoming and outgoing SIP message? Yes!
   */
  msg_logging: boolean;

  /**
   * Input verbosity level. Value 5 is reasonable.
   */
  evel: number;

  /**
   * Verbosity level for console. Value 4 is reasonable.
   */
  onsole_level: number;

  /**
   * Log decoration.
   */
  ecor: number;

  /**
   * Optional log filename.
   */
  log_filename: string;

  /**
   * Additional flags to be given to #pj_file_open() when opening
   * the log file. By default, the flag is PJ_O_WRONLY. Application
   * may set PJ_O_APPEND here so that logs are appended to existing
   * file instead of overwriting it.
   *
   * Default is 0.
   */
  og_file_flags: number;

}

/**
 * Structure to be passed on MWI callback.
 */
export interface pjsua_mwi_info {
  evsub: pjsip_evsub;
  /** < Event subscription session, for reference.  */
  rdata: pjsip_rx_data;	/**< The received NOTIFY request.  */
}

/**
 * Structure to be passed on registration callback.
 */
export interface pjsua_reg_info {
  cbparam: pjsip_regc_cbparam;
  /**< Parameters returned by registration callback.  */
  regc: pjsip_regc;
  /**< Client registration structure. */
  renew: boolean;     /**< Non-zero for registration and zero for unregistration. */
}

/**
 * Media stream info.
 */
export interface pjsua_stream_info {
  /** Media type of this stream. */
  type: pjmedia_type;

  /** Stream info (union). */
  pjsua_stream_info: {
    /** Audio stream info */
    aud: pjmedia_stream_info;

    /** Video stream info */
    vid: pjmedia_vid_stream_info;
  };

}

/**
 * Media stream statistic.
 */
export interface pjsua_stream_stat {
  /** RTCP statistic. */
  rtcp: pjmedia_rtcp_stat;

  /** Jitter buffer statistic. */
  jbuf: pjmedia_jb_state;

}

/**
 * Structure to be passed to on stream precreate callback.
 * See #on_stream_precreate().
 */
export interface pjsua_on_stream_precreate_param {
  /**
   * Stream index in the media session, read-only.
   */
  stream_idx: number;

  /**
   * Parameters that the stream will be created from.
   */
  stream_info: pjsua_stream_info;
}

/**
 * Structure to be passed to on stream created callback.
 * See #on_stream_created2().
 */
export interface pjsua_on_stream_created_param {
  /**
   * The audio media stream, read-only.
   */
  stream: pjmedia_stream;

  /**
   * Stream index in the audio media session, read-only.
   */
  stream_idx: number;

  /**
   * Specify if PJSUA should take ownership of the port returned in
   * the port parameter below. If set to PJ_TRUE,
   * pjmedia_port_destroy() will be called on the port when it is
   * no longer needed.
   *
   * Default: PJ_FALSE
   */
  destroy_port: boolean;

  /**
   * On input, it specifies the audio media port of the stream. Application
   * may modify this pointer to point to different media port to be
   * registered to the conference bridge.
   */
  port: pjmedia_port;

}

/**
 * Enumeration of media transport state types.
 */
export enum pjsua_med_tp_st {
  /** Null, this is the state before media transport is created. */
  PJSUA_MED_TP_NULL,

  /**
   * Just before media transport is created, which can finish
   * asynchronously later.
   */
  PJSUA_MED_TP_CREATING,

  /** Media transport creation is completed, but not initialized yet. */
  PJSUA_MED_TP_IDLE,

  /** Initialized (media_create() has been called). */
  PJSUA_MED_TP_INIT,

  /** Running (media_start() has been called). */
  PJSUA_MED_TP_RUNNING,

  /** Disabled (transport is initialized, but media is being disabled). */
  PJSUA_MED_TP_DISABLED

}

/**
 * Structure to be passed on media transport state callback.
 */
export interface pjsua_med_tp_state_info {
  /**
   * The media index.
   */
  med_idx: number;

  /**
   * The media transport state
   */
  state: pjsua_med_tp_st;

  /**
   * The last error code related to the media transport state.
   */
  status: pj_status_t;

  /**
   * Optional SIP error code.
   */
  sip_err_code: number;

  /**
   * Optional extended info, the content is specific for each transport type.
   */
  ext_info: void;

}

/**
 * Type of callback to be called when media transport state is changed.
 *
 * @param call_id  The call ID.
 * @param info         The media transport state info.
 *
 * @return    The callback must return PJ_SUCCESS at the moment.
 */
export type pjsua_med_tp_state_cb = (call_id: pjsua_call_id, info: pjsua_med_tp_state_info) => pj_status_t;

/**
 * Typedef of callback to be registered to #pjsua_resolve_stun_servers()
 * and to be called when STUN resolution completes.
 */
export type pj_stun_resolve_cb = (result: pj_stun_resolve_result) => void;

/**
 * This enumeration specifies the options for custom media transport creation.
 */
export enum pjsua_create_media_transport_flag {
  /**
   * This flag indicates that the media transport must also close its
   * "member" or "child" transport when pjmedia_transport_close() is
   * called. If this flag is not specified, then the media transport
   * must not call pjmedia_transport_close() of its member transport.
   */
  PJSUA_MED_TP_CLOSE_MEMBER = 1

}

/**
 * Specify SRTP media transport settings.
 */
export interface pjsua_srtp_opt {
  /**
   * Specify the number of crypto suite settings. If set to zero, all
   * available cryptos will be enabled. Note that available crypto names
   * can be enumerated using pjmedia_srtp_enum_crypto().
   *
   * Default is zero.
   */
  crypto_count: number;

  /**
   * Specify individual crypto suite setting and its priority order.
   *
   * Notes for DTLS-SRTP keying:
   *  - Currently only supports these cryptos: AES_CM_128_HMAC_SHA1_80,
   *    AES_CM_128_HMAC_SHA1_32, AEAD_AES_256_GCM, and AEAD_AES_128_GCM.
   *  - SRTP key is not configurable.
   */
  crypto: string[];

  /**
   * Specify the number of enabled keying methods. If set to zero, all
   * keyings will be enabled. Maximum value is PJMEDIA_SRTP_MAX_KEYINGS.
   * Note that available keying methods can be enumerated using
   * pjmedia_srtp_enum_keying().
   *
   * Default is zero (all keyings are enabled with priority order:
   * SDES, DTLS-SRTP).
   */
  keying_count: number;

  /**
   * Specify enabled keying methods and its priority order. Keying method
   * with higher priority will be given earlier chance to process the SDP,
   * for example as currently only one keying is supported in the SDP offer,
   * keying with first priority will be likely used in the SDP offer.
   */
  keying: string[];

}

/**
 * This enumeration specifies the contact rewrite method.
 */
export enum pjsua_contact_rewrite_method {
  /**
   * The Contact update will be done by sending unregistration
   * to the currently registered Contact, while simultaneously sending new
   * registration (with different Call-ID) for the updated Contact.
   */
  PJSUA_CONTACT_REWRITE_UNREGISTER = 1,

  /**
   * The Contact update will be done in a single, current
   * registration session, by removing the current binding (by setting its
   * Contact's expires parameter to zero) and adding a new Contact binding,
   * all done in a single request.
   */
  PJSUA_CONTACT_REWRITE_NO_UNREG = 2,

  /**
   * The Contact update will be done when receiving any registration final
   * response. If this flag is not specified, contact update will only be
   * done upon receiving 2xx response. This flag MUST be used with
   * PJSUA_CONTACT_REWRITE_UNREGISTER or PJSUA_CONTACT_REWRITE_NO_UNREG
   * above to specify how the Contact update should be performed when
   * receiving 2xx response.
   */
  PJSUA_CONTACT_REWRITE_ALWAYS_UPDATE = 4

}

/**
 * This enumeration specifies the operation when handling IP change.
 */
enum pjsua_ip_change_op {
  /**
   * Hasn't start ip change process.
   */
  PJSUA_IP_CHANGE_OP_NULL,

  /**
   * The restart listener process.
   */
  PJSUA_IP_CHANGE_OP_RESTART_LIS,

  /**
   * The shutdown transport process.
   */
  PJSUA_IP_CHANGE_OP_ACC_SHUTDOWN_TP,

  /**
   * The update contact process.
   */
  PJSUA_IP_CHANGE_OP_ACC_UPDATE_CONTACT,

  /**
   * The hanging up call process.
   */
  PJSUA_IP_CHANGE_OP_ACC_HANGUP_CALLS,

  /**
   * The re-INVITE call process.
   */
  PJSUA_IP_CHANGE_OP_ACC_REINVITE_CALLS,

  /**
   * The ip change process has completed.
   */
  PJSUA_IP_CHANGE_OP_COMPLETED

}

/**
 * This will contain the information of the callback \a on_ip_change_progress.
 */
export interface pjsua_ip_change_op_info {

  /**
   * The information from listener restart operation.
   */
  lis_restart: {
    transport_id: number
  };

  /**
   * The information from shutdown transport.
   */
  acc_shutdown_tp: {
    acc_id: number;
  };

  /**
   * The information from updating contact.
   */
  acc_update_contact: {
    acc_id: pjsua_acc_id;
    is_register: boolean; /**< SIP Register if PJ_TRUE.      */
    code: number;		/**< SIP status code received.      */
  };

  /**
   * The information from hanging up call operation.
   */
  acc_hangup_calls: {
    acc_id: pjsua_acc_id;
    call_id: pjsua_call_id;
  };

  /**
   * The information from re-Invite call operation.
   */
  acc_reinvite_calls: {
    acc_id: pjsua_acc_id;
    call_id: pjsua_call_id;
  };
}

/**
 * This enumeration specifies DTMF method.
 */
enum pjsua_dtmf_method {
  /**
   * Send DTMF using RFC2833.
   */
  PJSUA_DTMF_METHOD_RFC2833,

  /**
   * Send DTMF using SIP INFO.
   * Notes:
   * - This method is not finalized in any standard/rfc, however it is
   *   commonly used.
   * - Warning: in case the remote doesn't support SIP INFO, response might
   *   not be sent and the sender will deal this as timeout and disconnect
   *   the call.
   */
  PJSUA_DTMF_METHOD_SIP_INFO

}

/**
 * This will contain the information of the callback \a on_dtmf_digit2.
 */
export interface pjsua_dtmf_info {
  /**
   * The method used to send DTMF.
   */
  method: pjsua_dtmf_method;

  /**
   * DTMF ASCII digit.
   */
  igit: number;

  /**
   * DTMF signal duration. If the duration is unknown, this value is set to
   * PJSUA_UNKNOWN_DTMF_DURATION.
   */
  uration: number;

}

/**
 * This will contain the information of the callback \a on_dtmf_event.
 */
export interface pjsua_dtmf_event {
  /**
   * The method used to send DTMF.
   */
  method: pjsua_dtmf_method;

  /**
   * The timestamp identifying the begin of the event. Timestamp units are
   * expressed in milliseconds.
   * Note that this value should only be used to compare multiple events
   * received via the same method relatively to each other, as the time-base
   * is randomized.
   */
  imestamp: number;

  /**
   * DTMF ASCII digit.
   */
  igit: number;

  /**
   * DTMF signal duration in milliseconds. Interpretation of the duration
   * depends on the flag PJMEDIA_STREAM_DTMF_IS_END.
   * If PJMEDIA_STREAM_DTMF_IS_END is set, this contains the total duration
   * of the DTMF signal or PJSUA_UNKNOWN_DTMF_DURATION if the duration is
   * unknown.
   * If PJMEDIA_STREAM_DTMF_IS_END is not set, this contains the duration
   * of the DTMF signal received up to this point in time.
   * A duration of "0" indicates an infinitely long duration.
   */
  uration: number;

  /**
   * Flags indicating additional information about the DTMF event.
   * If PJMEDIA_STREAM_DTMF_IS_UPDATE is set, the event was already
   * indicated earlier. The new indication contains an updated event
   * duration.
   * If PJMEDIA_STREAM_DTMF_IS_END is set, the event has ended and this
   * indication contains the final event duration. Note that end
   * indications might get lost. Hence it is not guaranteed to receive
   * an event with PJMEDIA_STREAM_DTMF_IS_END for every event.
   */
  lags: number;
}

/**
 * Call settings.
 */
export interface pjsua_call_setting {
  /**
   * Bitmask of #pjsua_call_flag constants.
   *
   * Default: PJSUA_CALL_INCLUDE_DISABLED_MEDIA
   */
  flag: number;

  /**
   * This flag controls what methods to request keyframe are allowed on
   * the call. Value is bitmask of #pjsua_vid_req_keyframe_method.
   *
   * Default: (PJSUA_VID_REQ_KEYFRAME_SIP_INFO |
   *     PJSUA_VID_REQ_KEYFRAME_RTCP_PLI)
   */
  req_keyframe_method: number;

  /**
   * Number of simultaneous active audio streams for this call. Setting
   * this to zero will disable audio in this call.
   *
   * Default: 1
   */
  aud_cnt: number;

  /**
   * Number of simultaneous active video streams for this call. Setting
   * this to zero will disable video in this call.
   *
   * Default: 1 (if video feature is enabled, otherwise it is zero)
   */
  vid_cnt: number;

}

/**
 * This structure describes application callback to receive various event
 * notification from PJSUA-API. All of these callbacks are OPTIONAL,
 * although definitely application would want to implement some of
 * the important callbacks (such as \a on_incoming_call).
 */
export interface pjsua_callback {
  /**
   * Notify application when call state has changed.
   * Application may then query the call info to get the
   * detail call states by calling  pjsua_call_get_info() function.
   *
   * @param call_id  The call index.
   * @param e    Event which causes the call state to change.
   */
  on_call_state (call_id: pjsua_call_id, e: pjsip_event): void;

  /**
   * Notify application on incoming call.
   *
   * @param acc_id  The account which match the incoming call.
   * @param call_id  The call id that has just been created for
   *      the call.
   * @param rdata  The incoming INVITE request.
   */
  on_incoming_call (acc_id: pjsua_acc_id, call_id: pjsua_call_id, rdata: pjsip_rx_data);

  /**
   * This is a general notification callback which is called whenever
   * a transaction within the call has changed state. Application can
   * implement this callback for example to monitor the state of
   * outgoing requests, or to answer unhandled incoming requests
   * (such as INFO) with a final response.
   *
   * @param call_id  Call identification.
   * @param tsx  The transaction which has changed state.
   * @param e    Transaction event that caused the state change.
   */
  on_call_tsx_state (call_id: pjsua_call_id, tsx: pjsip_transaction, e: pjsip_event);

  /**
   * Notify application when media state in the call has changed.
   * Normal application would need to implement this callback, e.g.
   * to connect the call's media to sound device. When ICE is used,
   * this callback will also be called to report ICE negotiation
   * failure. When DTLS-SRTP is used, this callback will also be called
   * to report DTLS negotiation failure.
   *
   * @param call_id  The call index.
   */
  on_call_media_state (call_id: pjsua_call_id);

  /**
   * Notify application when a call has just created a local SDP (for
   * initial or subsequent SDP offer/answer). Application can implement
   * this callback to modify the SDP, before it is being sent and/or
   * negotiated with remote SDP, for example to apply per account/call
   * basis codecs priority or to add custom/proprietary SDP attributes.
   *
   * @param call_id  The call index.
   * @param sdp  The SDP has just been created.
   * @param pool  The pool instance, application should use this pool
   *      to modify the SDP.
   * @param rem_sdp  The remote SDP, will be NULL if local is SDP offerer.
   */
  on_call_sdp_created (call_id: pjsua_call_id, sdp: pjmedia_sdp_session, pool: pj_pool_t, rem_sdp: pjmedia_sdp_session);

  /**
   * Notify application when an audio media session is about to be created
   * (as opposed to #on_stream_created() and #on_stream_created2() which are
   * called *after* the session has been created). The application may change
   * some stream info parameter values, i.e: jb_init, jb_min_pre, jb_max_pre,
   * jb_max, use_ka, rtcp_sdes_bye_disabled, jb_discard_algo (audio),
   * codec_param->enc_fmt (video).
   *
   * @param call_id       Call identification.
   * @param param         The on stream precreate callback parameter.
   */
  on_stream_precreate (call_id: pjsua_call_id, param: pjsua_on_stream_precreate_param);

  /**
   * Notify application when audio media session is created and before it is
   * registered to the conference bridge. Application may return different
   * audio media port if it has added media processing port to the stream.
   * This media port then will be added to the conference bridge instead.
   *
   * Note: if implemented, #on_stream_created2() callback will be called
   * instead of this one.
   *
   * @param call_id      Call identification.
   * @param strm      Audio media stream.
   * @param stream_idx    Stream index in the audio media session.
   * @param p_port      On input, it specifies the audio media port of the
   *          stream. Application may modify this pointer to
   *          point to different media port to be registered
   *          to the conference bridge.
   */
  on_stream_created (call_id: pjsua_call_id, strm: pjmedia_stream, stream_idx: number, p_port: pjmedia_port);

  /**
   * Notify application when audio media session is created and before it is
   * registered to the conference bridge. Application may return different
   * audio media port if it has added media processing port to the stream.
   * This media port then will be added to the conference bridge instead.
   *
   * @param call_id      Call identification.
   * @param param      The on stream created callback parameter.
   */
  on_stream_created2 (call_id: pjsua_call_id, param: pjsua_on_stream_created_param);

  /**
   * Notify application when audio media session has been unregistered from
   * the conference bridge and about to be destroyed.
   *
   * @param call_id      Call identification.
   * @param strm      Audio media stream.
   * @param stream_idx    Stream index in the audio media session.
   */
  on_stream_destroyed (call_id: pjsua_call_id, strm: pjmedia_stream, tream_idx: number): number;

  /**
   * Notify application upon incoming DTMF digits using RFC 2833 payload
   * formats. This callback will not be called if app implements \a
   * on_dtmf_digit2() or \a on_dtmf_event().
   *
   * @param call_id  The call index.
   * @param digit  DTMF ASCII digit.
   */
  on_dtmf_digit (call_id: pjsua_call_id, digit: number);

  /**
   * Notify application upon incoming DTMF digits using the method specified
   * in \a pjsua_dtmf_method. This callback will not be called if app
   * implements \a on_dtmf_event().
   *
   * @param call_id  The call index.
   * @param info  The DTMF info.
   */
  on_dtmf_digit2 (call_id: pjsua_call_id, info: pjsua_dtmf_info);

  /**
   * Notify application upon incoming DTMF digits using the method specified
   * in \a pjsua_dtmf_method. Includes additional information about events
   * received via RTP.
   *
   * @param call_id  The call index.
   * @param event  The DTMF event.
   */
  on_dtmf_event (call_id: pjsua_call_id, event: pjsua_dtmf_event);

  /**
   * Notify application on call being transferred (i.e. REFER is received).
   * Application can decide to accept/reject transfer request
   * by setting the code (default is 202). When this callback
   * is not defined, the default behavior is to accept the
   * transfer. See also on_call_transfer_request2() callback for
   * the version with \a pjsua_call_setting in the argument list.
   *
   * @param call_id  The call index.
   * @param dst  The destination where the call will be
   *      transferred to.
   * @param code  Status code to be returned for the call transfer
   *      request. On input, it contains status code 202.
   */
  on_call_transfer_request (call_id: pjsua_call_id, dst: string, code: pjsip_status_code);

  /**
   * Notify application on call being transferred (i.e. REFER is received).
   * Application can decide to accept/reject transfer request
   * by setting the code (default is 202). When this callback
   * is not defined, the default behavior is to accept the
   * transfer.
   *
   * @param call_id  The call index.
   * @param dst  The destination where the call will be
   *      transferred to.
   * @param code  Status code to be returned for the call transfer
   *      request. On input, it contains status code 202.
   * @param opt  The current call setting, application can update
   *      this setting for the call being transferred.
   */
  on_call_transfer_request2 (call_id: pjsua_call_id, dst: string, code: pjsip_status_code, opt: pjsua_call_setting);

  /**
   * Notify application of the status of previously sent call
   * transfer request. Application can monitor the status of the
   * call transfer request, for example to decide whether to
   * terminate existing call.
   *
   * @param call_id      Call ID.
   * @param st_code      Status progress of the transfer request.
   * @param st_text      Status progress text.
   * @param final      If non-zero, no further notification will
   *          be reported. The st_code specified in
   *          this callback is the final status.
   * @param p_cont      Initially will be set to non-zero, application
   *          can set this to FALSE if it no longer wants
   *          to receie further notification (for example,
   *          after it hangs up the call).
   */
  on_call_transfer_status (call_id: pjsua_call_id, st_code: number, st_text: string, final: boolean, p_cont: boolean);

  /**
   * Notify application about incoming INVITE with Replaces header.
   * Application may reject the request by setting non-2xx code.
   * See also on_call_replace_request2() callback for the version
   * with \a pjsua_call_setting in the argument list.
   *
   * @param call_id      The call ID to be replaced.
   * @param rdata      The incoming INVITE request to replace the call.
   * @param st_code      Status code to be set by application. Application
   *          should only return a final status (200-699).
   * @param st_text      Optional status text to be set by application.
   */
  on_call_replace_request (call_id: pjsua_call_id, rdata: pjsip_rx_data, st_code: number, st_text: string);

  /**
   * Notify application about incoming INVITE with Replaces header.
   * Application may reject the request by setting non-2xx code.
   *
   * @param call_id      The call ID to be replaced.
   * @param rdata      The incoming INVITE request to replace the call.
   * @param st_code      Status code to be set by application. Application
   *          should only return a final status (200-699).
   * @param st_text      Optional status text to be set by application.
   * @param opt      The current call setting, application can update
   *          this setting for the call being replaced.
   */
  on_call_replace_request2 (call_id: pjsua_call_id, rdata: pjsip_rx_data, st_code: number, st_text: string, opt: pjsua_call_setting);

  /**
   * Notify application that an existing call has been replaced with
   * a new call. This happens when PJSUA-API receives incoming INVITE
   * request with Replaces header.
   *
   * After this callback is called, normally PJSUA-API will disconnect
   * \a old_call_id and establish \a new_call_id.
   *
   * @param old_call_id   Existing call which to be replaced with the
   *          new call.
   * @param new_call_id   The new call.
   * @param rdata      The incoming INVITE with Replaces request.
   */
  on_call_replaced (old_call_id: pjsua_call_id, new_call_id: pjsua_call_id);

  /**
   * Notify application when call has received new offer from remote
   * (i.e. re-INVITE/UPDATE with SDP is received, or from the
   * INVITE response in the case that the initial outgoing INVITE
   * has no SDP). Application can
   * decide to accept/reject the offer by setting the code (default
   * is 200). If the offer is accepted, application can update the
   * call setting to be applied in the answer. When this callback is
   * not defined, the default behavior is to accept the offer using
   * current call setting.
   *
   * Note: this callback may not be called if \a on_call_rx_reinvite()
   * is implemented.
   *
   * @param call_id  The call index.
   * @param offer  The new offer received.
   * @param reserved  Reserved param, currently not used.
   * @param code  Status code to be returned for answering the
   *      offer. On input, it contains status code 200.
   *      Currently, valid values are only 200 and 488.
   * @param opt  The current call setting, application can update
   *      this setting for answering the offer.
   */
  on_call_rx_offer (call_id: pjsua_call_id, offer: pjmedia_sdp_session, reserved: void, code: pjsip_status_code, opt: pjsua_call_setting);

  /**
   * Notify application when call has received a re-INVITE with offer
   * from the peer. It allows more fine-grained control over the response
   * to a re-INVITE. If application sets async to PJ_TRUE, it can send
   * the reply manually using the function #pjsua_call_answer_with_sdp().
   * Otherwise, by default the re-INVITE will be answered automatically
   * after the callback returns.
   *
   * Currently, this callback is only called for re-INVITE with
   * SDP, but app should be prepared to handle the case of re-INVITE
   * without SDP.
   *
   * Remarks: If manually answering at a later timing, application may
   * need to monitor on_call_tsx_state() callback to check whether
   * the re-INVITE is already answered automatically with 487 due to
   * being cancelled.
   *
   * Note: on_call_rx_offer() will still be called after this callback,
   * but only if async is PJ_FALSE and code is 200.
   *
   * @param call_id  The call index.
   * @param offer  Remote offer.
   * @param rdata     The received re-INVITE request.
   * @param reserved  Reserved param, currently not used.
   * @param async  On input, it is PJ_FALSE. Set to PJ_TRUE if
   *      app wants to manually answer the re-INVITE.
   * @param code  Status code to be returned for answering the
   *      offer. On input, it contains status code 200.
   *      Currently, valid values are only 200 and 488.
   * @param opt  The current call setting, application can update
   *      this setting for answering the offer.
   */
  on_call_rx_reinvite (call_id: pjsua_call_id, offer: pjmedia_sdp_session, rdata: pjsip_rx_data, reserved: void, async: boolean, code: pjsip_status_code, opt: pjsua_call_setting);

  /**
   * Notify application when call has received INVITE with no SDP offer.
   * Application can update the call setting (e.g: add audio/video), or
   * enable/disable codecs, or update other media session settings from
   * within the callback, however, as mandated by the standard (RFC3261
   * section 14.2), it must ensure that the update overlaps with the
   * existing media session (in codecs, transports, or other parameters)
   * that require support from the peer, this is to avoid the need for
   * the peer to reject the offer.
   *
   * When this callback is not defined, the default behavior is to send
   * SDP offer using current active media session (with all enabled codecs
   * on each media type).
   *
   * @param call_id  The call index.
   * @param reserved  Reserved param, currently not used.
   * @param opt  The current call setting, application can update
   *      this setting for generating the offer.
   */
  on_call_tx_offer (call_id: pjsua_call_id, reserved: void, opt: pjsua_call_setting);

  /**
   * Notify application when registration or unregistration has been
   * initiated. Note that this only notifies the initial registration
   * and unregistration. Once registration session is active, subsequent
   * refresh will not cause this callback to be called.
   *
   * @param acc_id      The account ID.
   * @param renew      Non-zero for registration and zero for
   *          unregistration.
   */
  on_reg_started (acc_id: pjsua_acc_id, renew: boolean);

  /**
   * This is the alternative version of the \a on_reg_started() callback with
   * \a pjsua_reg_info argument.
   *
   * @param acc_id      The account ID.
   * @param info      The registration info.
   */
  on_reg_started2 (acc_id: pjsua_acc_id, info: pjsua_reg_info);

  /**
   * Notify application when registration status has changed.
   * Application may then query the account info to get the
   * registration details.
   *
   * @param acc_id      The account ID.
   */
  on_reg_state (acc_id: pjsua_acc_id);

  /**
   * Notify application when registration status has changed.
   * Application may inspect the registration info to get the
   * registration status details.
   *
   * @param acc_id      The account ID.
   * @param info      The registration info.
   */
  on_reg_state2 (acc_id: pjsua_acc_id, info: pjsua_reg_info);

  /**
   * Notification when incoming SUBSCRIBE request is received. Application
   * may use this callback to authorize the incoming subscribe request
   * (e.g. ask user permission if the request should be granted).
   *
   * If this callback is not implemented, all incoming presence subscription
   * requests will be accepted.
   *
   * If this callback is implemented, application has several choices on
   * what to do with the incoming request:
   *  - it may reject the request immediately by specifying non-200 class
   *    final response in the \a code argument.
   *  - it may immediately accept the request by specifying 200 as the
   *    \a code argument. This is the default value if application doesn't
   *    set any value to the \a code argument. In this case, the library
   *    will automatically send NOTIFY request upon returning from this
   *    callback.
   *  - it may delay the processing of the request, for example to request
   *    user permission whether to accept or reject the request. In this
   *    case, the application MUST set the \a code argument to 202, then
   *    IMMEDIATELY calls #pjsua_pres_notify() with state
   *    PJSIP_EVSUB_STATE_PENDING and later calls #pjsua_pres_notify()
   *    again to accept or reject the subscription request.
   *
   * Any \a code other than 200 and 202 will be treated as 200.
   *
   * Application MUST return from this callback immediately (e.g. it must
   * not block in this callback while waiting for user confirmation).
   *
   * @param srv_pres      Server presence subscription instance. If
   *          application delays the acceptance of the request,
   *          it will need to specify this object when calling
   *          #pjsua_pres_notify().
   * @param acc_id      Account ID most appropriate for this request.
   * @param buddy_id      ID of the buddy matching the sender of the
   *          request, if any, or PJSUA_INVALID_ID if no
   *          matching buddy is found.
   * @param from      The From URI of the request.
   * @param rdata      The incoming request.
   * @param code      The status code to respond to the request. The
   *          default value is 200. Application may set this
   *          to other final status code to accept or reject
   *          the request.
   * @param reason      The reason phrase to respond to the request.
   * @param msg_data      If the application wants to send additional
   *          headers in the response, it can put it in this
   *          parameter.
   */
  on_incoming_subscribe (acc_id: pjsua_acc_id, srv_pres: pjsua_srv_pres, buddy_id: pjsua_buddy_id, from: string, rdata: pjsip_rx_data, code: pjsip_status_code, reason: string, msg_data: pjsua_msg_data);

  /**
   * Notification when server side subscription state has changed.
   * This callback is optional as application normally does not need
   * to do anything to maintain server side presence subscription.
   *
   * @param acc_id      The account ID.
   * @param srv_pres      Server presence subscription object.
   * @param remote_uri    Remote URI string.
   * @param state      New subscription state.
   * @param event      PJSIP event that triggers the state change.
   */
  on_srv_subscribe_state (acc_id: pjsua_acc_id, srv_pres: pjsua_srv_pres, remote_uri: string, state: pjsip_evsub_state, e: pjsip_eventvent);

  /**
   * Notify application when the buddy state has changed.
   * Application may then query the buddy into to get the details.
   *
   * @param buddy_id      The buddy id.
   */
  on_buddy_state (buddy_id: pjsua_buddy_id);

  /**
   * Notify application when the state of client subscription session
   * associated with a buddy has changed. Application may use this
   * callback to retrieve more detailed information about the state
   * changed event.
   *
   * @param buddy_id      The buddy id.
   * @param sub      Event subscription session.
   * @param event      The event which triggers state change event.
   */
  on_buddy_evsub_state (buddy_id: pjsua_buddy_id, sub: pjsip_evsub, e: pjsip_eventvent);

  /**
   * Notify application on incoming pager (i.e. MESSAGE request).
   * Argument call_id will be -1 if MESSAGE request is not related to an
   * existing call.
   *
   * See also \a on_pager2() callback for the version with \a pjsip_rx_data
   * passed as one of the argument.
   *
   * @param call_id      Containts the ID of the call where the IM was
   *          sent, or PJSUA_INVALID_ID if the IM was sent
   *          outside call context.
   * @param from      URI of the sender.
   * @param to      URI of the destination message.
   * @param contact      The Contact URI of the sender, if present.
   * @param mime_type      MIME type of the message.
   * @param body      The message content.
   */
  on_pager (call_id: pjsua_call_id, from: string, to: string, contact: string, mime_type: string, body: string);

  /**
   * This is the alternative version of the \a on_pager() callback with
   * \a pjsip_rx_data argument.
   *
   * @param call_id      Containts the ID of the call where the IM was
   *          sent, or PJSUA_INVALID_ID if the IM was sent
   *          outside call context.
   * @param from      URI of the sender.
   * @param to      URI of the destination message.
   * @param contact      The Contact URI of the sender, if present.
   * @param mime_type      MIME type of the message.
   * @param body      The message content.
   * @param rdata      The incoming MESSAGE request.
   * @param acc_id      Account ID most suitable for this message.
   */
  on_pager2 (call_id: pjsua_call_id, from: string, to: string, contact: string, mime_type: string, body: string, rdata: pjsip_rx_data, acc_id: pjsua_acc_id);

  /**
   * Notify application about the delivery status of outgoing pager
   * request. See also on_pager_status2() callback for the version with
   * \a pjsip_rx_data in the argument list.
   *
   * @param call_id      Containts the ID of the call where the IM was
   *          sent, or PJSUA_INVALID_ID if the IM was sent
   *          outside call context.
   * @param to      Destination URI.
   * @param body      Message body.
   * @param user_data      Arbitrary data that was specified when sending
   *          IM message.
   * @param status      Delivery status.
   * @param reason      Delivery status reason.
   */
  on_pager_status (call_id: pjsua_call_id, to: string, body: string, user_data: void, status: pjsip_status_code, reason: string);

  /**
   * Notify application about the delivery status of outgoing pager
   * request.
   *
   * @param call_id      Containts the ID of the call where the IM was
   *          sent, or PJSUA_INVALID_ID if the IM was sent
   *          outside call context.
   * @param to      Destination URI.
   * @param body      Message body.
   * @param user_data      Arbitrary data that was specified when sending
   *          IM message.
   * @param status      Delivery status.
   * @param reason      Delivery status reason.
   * @param tdata      The original MESSAGE request.
   * @param rdata      The incoming MESSAGE response, or NULL if the
   *          message transaction fails because of time out
   *          or transport error.
   * @param acc_id      Account ID from this the instant message was
   *          send.
   */
  on_pager_status2 (call_id: pjsua_call_id, to: string, body: string, user_data: void, status: pjsip_status_code, reason: string, tdata: pjsip_tx_data, rdata: pjsip_rx_data, acc_id: pjsua_acc_id);

  /**
   * Notify application about typing indication.
   *
   * @param call_id      Containts the ID of the call where the IM was
   *          sent, or PJSUA_INVALID_ID if the IM was sent
   *          outside call context.
   * @param from      URI of the sender.
   * @param to      URI of the destination message.
   * @param contact      The Contact URI of the sender, if present.
   * @param is_typing      Non-zero if peer is typing, or zero if peer
   *          has stopped typing a message.
   */
  on_typing (call_id: pjsua_call_id, from: string, to: string, contact: string, is_typing: bolean);

  /**
   * Notify application about typing indication.
   *
   * @param call_id      Containts the ID of the call where the IM was
   *          sent, or PJSUA_INVALID_ID if the IM was sent
   *          outside call context.
   * @param from      URI of the sender.
   * @param to      URI of the destination message.
   * @param contact      The Contact URI of the sender, if present.
   * @param is_typing      Non-zero if peer is typing, or zero if peer
   *          has stopped typing a message.
   * @param rdata      The received request.
   * @param acc_id      Account ID most suitable for this message.
   */
  on_typing2 (call_id: pjsua_call_id, from: string, to: string, contact: string, is_typing: bolean, rdata: pjsip_rx_data, acc_id: pjsua_acc_id);

  /**
   * Callback when the library has finished performing NAT type
   * detection.
   *
   * @param res      NAT detection result.
   */
  on_nat_detect (res: pj_stun_nat_detect_result);

  /**
   * This callback is called when the call is about to resend the
   * INVITE request to the specified target, following the previously
   * received redirection response.
   *
   * Application may accept the redirection to the specified target,
   * reject this target only and make the session continue to try the next
   * target in the list if such target exists, stop the whole
   * redirection process altogether and cause the session to be
   * disconnected, or defer the decision to ask for user confirmation.
   *
   * This callback is optional. If this callback is not implemented,
   * the default behavior is to NOT follow the redirection response.
   *
   * @param call_id  The call ID.
   * @param target  The current target to be tried.
   * @param e    The event that caused this callback to be called.
   *      This could be the receipt of 3xx response, or
   *      4xx/5xx response received for the INVITE sent to
   *      subsequent targets, or NULL if this callback is
   *      called from within #pjsua_call_process_redirect()
   *      context.
   *
   * @return    Action to be performed for the target. Set this
   *      parameter to one of the value below:
   *      - PJSIP_REDIRECT_ACCEPT: immediately accept the
   *        redirection. When set, the call will immediately
   *        resend INVITE request to the target.
   *      - PJSIP_REDIRECT_ACCEPT_REPLACE: immediately accept
   *        the redirection and replace the To header with the
   *        current target. When set, the call will immediately
   *        resend INVITE request to the target.
   *      - PJSIP_REDIRECT_REJECT: immediately reject this
   *        target. The call will continue retrying with
   *        next target if present, or disconnect the call
   *        if there is no more target to try.
   *      - PJSIP_REDIRECT_STOP: stop the whole redirection
   *        process and immediately disconnect the call. The
   *        on_call_state() callback will be called with
   *        PJSIP_INV_STATE_DISCONNECTED state immediately
   *        after this callback returns.
   *      - PJSIP_REDIRECT_PENDING: set to this value if
   *        no decision can be made immediately (for example
   *        to request confirmation from user). Application
   *        then MUST call #pjsua_call_process_redirect()
   *        to either accept or reject the redirection upon
   *        getting user decision.
   */
  on_call_redirected (call_id: pjsua_call_id, target: pjsip_uri, e: pjsip_event): pjsip_redirect_op;

  /**
   * This callback is called when message waiting indication subscription
   * state has changed. Application can then query the subscription state
   * by calling #pjsip_evsub_get_state().
   *
   * @param acc_id  The account ID.
   * @param evsub  The subscription instance.
   */
  on_mwi_state (acc_id: pjsua_acc_id, evsub: pjsip_evsub): void;

  /**
   * This callback is called when a NOTIFY request for message summary /
   * message waiting indication is received.
   *
   * @param acc_id  The account ID.
   * @param mwi_info  Structure containing details of the event,
   *      including the received NOTIFY request in the
   *      \a rdata field.
   */
  on_mwi_info (acc_id: pjsua_acc_id, mwi_info: pjsua_mwi_info);

  /**
   * This callback is called when transport state is changed. See also
   * #pjsip_tp_state_callback.
   */
  on_transport_state (): pjsip_tp_state_callback;

  /**
   * This callback is called when media transport state is changed. See
   * also #pjsua_med_tp_state_cb.
   */
  on_call_media_transport_state (): pjsua_med_tp_state_cb;

  /**
   * This callback is called to report error in ICE media transport.
   * Currently it is used to report TURN Refresh error.
   *
   * @param index  Transport index.
   * @param op  Operation which trigger the failure.
   * @param status  Error status.
   * @param param  Additional info about the event. Currently this will
   *      always be set to NULL.
   */
  on_ice_transport_error (index: number, op: pj_ice_strans_op, status: pj_status_t, param: void);

  /**
   * Callback when the sound device is about to be opened or closed.
   * This callback will be called even when null sound device or no
   * sound device is configured by the application (i.e. the
   * #pjsua_set_null_snd_dev() and #pjsua_set_no_snd_dev() APIs).
   * Application can use the API #pjsua_get_snd_dev() to get the info
   * about which sound device is going to be opened/closed.
   *
   * This callback is mostly useful when the application wants to manage
   * the sound device by itself (i.e. with #pjsua_set_no_snd_dev()),
   * to get notified when it should open or close the sound device.
   *
   * @param operation  The value will be set to 0 to signal that sound
   *      device is about to be closed, and 1 to be opened.
   *
   * @return    The callback must return PJ_SUCCESS at the moment.
   */
  on_snd_dev_operation (operation: number): pj_status_t;

  /**
   * Notification about media events such as video notifications. This
   * callback will most likely be called from media threads, thus
   * application must not perform heavy processing in this callback.
   * Especially, application must not destroy the call or media in this
   * callback. If application needs to perform more complex tasks to
   * handle the event, it should post the task to another thread.
   *
   * @param call_id  The call id.
   * @param med_idx  The media stream index.
   * @param event  The media event.
   */
  on_call_media_event (call_id: pjsua_call_id, med_idx: number, event: pjmedia_event);

  /**
   * This callback can be used by application to implement custom media
   * transport adapter for the call, or to replace the media transport
   * with something completely new altogether.
   *
   * This callback is called when a new call is created. The library has
   * created a media transport for the call, and it is provided as the
   * \a base_tp argument of this callback. Upon returning, the callback
   * must return an instance of media transport to be used by the call.
   *
   * @param call_id       Call ID
   * @param media_idx     The media index in the SDP for which this media
   *                      transport will be used.
   * @param base_tp       The media transport which otherwise will be
   *                      used by the call has this callback not been
   *                      implemented.
   * @param flags         Bitmask from pjsua_create_media_transport_flag.
   *
   * @return              The callback must return an instance of media
   *                      transport to be used by the call.
   */
  on_create_media_transport (call_id: pjsua_call_id, media_idx: number, base_tp: pjmedia_transport, flags: number): pjmedia_transport;

  /**
   * Warning: deprecated and may be removed in future release. Application
   * can set SRTP crypto settings (including keys) and keying methods
   * via pjsua_srtp_opt in pjsua_config and pjsua_acc_config.
   * See also ticket #2100.
   *
   * This callback is called before SRTP media transport is created.
   * Application can modify the SRTP setting \a srtp_opt to specify
   * the cryptos & keys and keying methods which are going to be used.
   * Note that only some fields of pjmedia_srtp_setting can be overriden
   * from this callback, i.e: "crypto_count", "crypto", "keying_count",
   * "keying", and "use" (only for initial INVITE), any modification in
   * other fields will be ignored.
   *
   * @param call_id       Call ID
   * @param media_idx     The media index in the SDP for which this SRTP
   *          media transport will be used.
   * @param srtp_opt      The SRTP setting. Application can modify this.
   */
  on_create_media_transport_srtp (call_id: pjsua_call_id, media_idx: number, srtp_opt: pjmedia_srtp_setting);

  /**
   * This callback can be used by application to override the account
   * to be used to handle an incoming message. Initially, the account to
   * be used will be calculated automatically by the library. This initial
   * account will be used if application does not implement this callback,
   * or application sets an invalid account upon returning from this
   * callback.
   *
   * Note that currently the incoming messages requiring account assignment
   * are INVITE, MESSAGE, SUBSCRIBE, and unsolicited NOTIFY. This callback
   * may be called before the callback of the SIP event itself, i.e:
   * incoming call, pager, subscription, or unsolicited-event.
   *
   * @param rdata  The incoming message.
   * @param acc_id  On input, initial account ID calculated automatically
   *      by the library. On output, the account ID prefered
   *      by application to handle the incoming message.
   */
  on_acc_find_for_incoming (rdata: pjsip_rx_data, acc_id: pjsua_acc_id);

  /**
   * Calling #pjsua_init() will initiate an async process to resolve and
   * contact each of the STUN server entries to find which is usable.
   * This callback is called when the process is complete, and can be
   * used by the application to start creating and registering accounts.
   * This way, the accounts can avoid call setup delay caused by pending
   * STUN resolution.
   *
   * See also #pj_stun_resolve_cb.
   */
  on_stun_resolution_complete (): pj_stun_resolve_cb;

  /**
   * Calling #pjsua_handle_ip_change() may involve different operation. This
   * callback is called to report the progress of each enabled operation.
   *
   * @param op  The operation.
   * @param status  The status of operation.
   * @param info  The info from the operation
   *
   */
  on_ip_change_progress (op: pjsua_ip_change_op, status: pj_status_t, info: pjsua_ip_change_op_info);

  /**
   * Notification about media events such as video notifications. This
   * callback will most likely be called from media threads, thus
   * application must not perform heavy processing in this callback.
   * If application needs to perform more complex tasks to handle
   * the event, it should post the task to another thread.
   *
   * @param event  The media event.
   */
  on_media_event (event: pjmedia_event);

}

/**
 * This enumeration specifies the usage of SIP Session Timers extension.
 */
export enum pjsua_sip_timer_use {
  /**
   * When this flag is specified, Session Timers will not be used in any
   * session, except it is explicitly required in the remote request.
   */
  PJSUA_SIP_TIMER_INACTIVE,

  /**
   * When this flag is specified, Session Timers will be used in all
   * sessions whenever remote supports and uses it.
   */
  PJSUA_SIP_TIMER_OPTIONAL,

  /**
   * When this flag is specified, Session Timers support will be
   * a requirement for the remote to be able to establish a session.
   */
  PJSUA_SIP_TIMER_REQUIRED,

  /**
   * When this flag is specified, Session Timers will always be used
   * in all sessions, regardless whether remote supports/uses it or not.
   */
  PJSUA_SIP_TIMER_ALWAYS

}

/**
 * This constants controls the use of 100rel extension.
 */
export enum pjsua_100rel_use {
  /**
   * Not used. For UAC, support for 100rel will be indicated in Supported
   * header so that peer can opt to use it if it wants to. As UAS, this
   * option will NOT cause 100rel to be used even if UAC indicates that
   * it supports this feature.
   */
  PJSUA_100REL_NOT_USED,

  /**
   * Mandatory. UAC will place 100rel in Require header, and UAS will
   * reject incoming calls unless it has 100rel in Supported header.
   */
  PJSUA_100REL_MANDATORY,

  /**
   * Optional. Similar to PJSUA_100REL_NOT_USED, except that as UAS, this
   * option will cause 100rel to be used if UAC indicates that it supports it.
   */
  PJSUA_100REL_OPTIONAL

}

/**
 * This structure describes the settings to control the API and
 * user agent behavior, and can be specified when calling #pjsua_init().
 * Before setting the values, application must call #pjsua_config_default()
 * to initialize this structure with the default values.
 */
export interface pjsua_config {

  /**
   * Maximum calls to support (default: 4). The value specified here
   * must be smaller than or equal to the compile time maximum settings
   * PJSUA_MAX_CALLS. To increase this limit, the library must be
   * recompiled with new PJSUA_MAX_CALLS value.
   */
  max_calls: number;

  /**
   * Number of worker threads. Normally application will want to have at
   * least one worker thread, unless when it wants to poll the library
   * periodically, which in this case the worker thread can be set to
   * zero.
   */
  thread_cnt: number;

  /**
   * Number of nameservers. If no name server is configured, the SIP SRV
   * resolution would be disabled, and domain will be resolved with
   * standard pj_gethostbyname() function.
   */
  nameserver_count: number;

  /**
   * Array of nameservers to be used by the SIP resolver subsystem.
   * The order of the name server specifies the priority (first name
   * server will be used first, unless it is not reachable).
   */
  nameserver: string[];

  /**
   * Force loose-route to be used in all route/proxy URIs (outbound_proxy
   * and account's proxy settings). When this setting is enabled, the
   * library will check all the route/proxy URIs specified in the settings
   * and append ";lr" parameter to the URI if the parameter is not present.
   *
   * Default: 1
   */
  force_lr: boolean;

  /**
   * Number of outbound proxies in the \a outbound_proxy array.
   */
  outbound_proxy_cnt: number;

  /**
   * Specify the URL of outbound proxies to visit for all outgoing requests.
   * The outbound proxies will be used for all accounts, and it will
   * be used to build the route set for outgoing requests. The final
   * route set for outgoing requests will consists of the outbound proxies
   * and the proxy configured in the account.
   */
  outbound_proxy: [];

  /**
   * Warning: deprecated, please use \a stun_srv field instead. To maintain
   * backward compatibility, if \a stun_srv_cnt is zero then the value of
   * this field will be copied to \a stun_srv field, if present.
   *
   * Specify domain name to be resolved with DNS SRV resolution to get the
   * address of the STUN server. Alternatively application may specify
   * \a stun_host instead.
   *
   * If DNS SRV resolution failed for this domain, then DNS A resolution
   * will be performed only if \a stun_host is specified.
   */
  stun_domain: string;

  /**
   * Warning: deprecated, please use \a stun_srv field instead. To maintain
   * backward compatibility, if \a stun_srv_cnt is zero then the value of
   * this field will be copied to \a stun_srv field, if present.
   *
   * Specify STUN server to be used, in "HOST[:PORT]" format. If port is
   * not specified, default port 3478 will be used.
   */
  stun_host: string;

  /**
   * Number of STUN server entries in \a stun_srv array.
   */
  stun_srv_cnt: number;

  /**
   * Array of STUN servers to try. The library will try to resolve and
   * contact each of the STUN server entry until it finds one that is
   * usable. Each entry may be a domain name, host name, IP address, and
   * it may contain an optional port number. For example:
   *  - "pjsip.org" (domain name)
   *  - "sip.pjsip.org" (host name)
   *  - "pjsip.org:33478" (domain name and a non-standard port number)
   *  - "10.0.0.1:3478" (IP address and port number)
   *
   * When nameserver is configured in the \a pjsua_config.nameserver field,
   * if entry is not an IP address, it will be resolved with DNS SRV
   * resolution first, and it will fallback to use DNS A resolution if this
   * fails. Port number may be specified even if the entry is a domain name,
   * in case the DNS SRV resolution should fallback to a non-standard port.
   *
   * When nameserver is not configured, entries will be resolved with
   * #pj_gethostbyname() if it's not an IP address. Port number may be
   * specified if the server is not listening in standard STUN port.
   */
  stun_srv: string[];

  /**
   * This specifies if the library should try to do an IPv6 resolution of
   * the STUN servers if the IPv4 resolution fails. It can be useful
   * in an IPv6-only environment, including on NAT64.
   *
   * Default: PJ_FALSE
   */
  stun_try_ipv6: boolean;

  /**
   * This specifies if the library should ignore failure with the
   * STUN servers. If this is set to PJ_FALSE, the library will refuse to
   * start if it fails to resolve or contact any of the STUN servers.
   *
   * This setting will also determine what happens if STUN servers are
   * unavailable during runtime (if set to PJ_FALSE, calls will
   * directly fail, otherwise (if PJ_TRUE) call medias will
   * fallback to proceed as though not using STUN servers.
   *
   * Default: PJ_TRUE
   */
  stun_ignore_failure: boolean;

  /**
   * This specifies whether STUN requests for resolving socket mapped
   * address should use the new format, i.e: having STUN magic cookie
   * in its transaction ID.
   *
   * Default: PJ_FALSE
   */
  stun_map_use_stun2: boolean;

  /**
   * Support for adding and parsing NAT type in the SDP to assist
   * troubleshooting. The valid values are:
   *  - 0: no information will be added in SDP, and parsing is disabled.
   *  - 1: only the NAT type number is added.
   *  - 2: add both NAT type number and name.
   *
   * Default: 1
   */
  nat_type_in_sdp: number;

  /**
   * Specify how the support for reliable provisional response (100rel/
   * PRACK) should be used by default. Note that this setting can be
   * further customized in account configuration (#pjsua_acc_config).
   *
   * Default: PJSUA_100REL_NOT_USED
   */
  require_100rel: pjsua_100rel_use;

  /**
   * Specify the usage of Session Timers for all sessions. See the
   * #pjsua_sip_timer_use for possible values. Note that this setting can be
   * further customized in account configuration (#pjsua_acc_config).
   *
   * Default: PJSUA_SIP_TIMER_OPTIONAL
   */
  use_timer: pjsua_sip_timer_use;

  /**
   * Handle unsolicited NOTIFY requests containing message waiting
   * indication (MWI) info. Unsolicited MWI is incoming NOTIFY requests
   * which are not requested by client with SUBSCRIBE request.
   *
   * If this is enabled, the library will respond 200/OK to the NOTIFY
   * request and forward the request to \a on_mwi_info() callback.
   *
   * See also \a mwi_enabled field #on pjsua_acc_config.
   *
   * Default: PJ_TRUE
   *
   */
  enable_unsolicited_mwi: boolean;

  /**
   * Specify Session Timer settings, see #pjsip_timer_setting.
   * Note that this setting can be further customized in account
   * configuration (#pjsua_acc_config).
   */
  timer_setting: pjsip_timer_setting;

  /**
   * Number of credentials in the credential array.
   */
  cred_count: number;

  /**
   * Array of credentials. These credentials will be used by all accounts,
   * and can be used to authenticate against outbound proxies. If the
   * credential is specific to the account, then application should set
   * the credential in the pjsua_acc_config rather than the credential
   * here.
   */
  cred_info: pjsip_cred_info[];

  /**
   * Application callback to receive various event notifications from
   * the library.
   */
  cb: pjsua_callback;

  /**
   * Optional user agent string (default empty). If it's empty, no
   * User-Agent header will be sent with outgoing requests.
   */
  user_agent: string;

  /**
   * Specify default value of secure media transport usage.
   * Valid values are PJMEDIA_SRTP_DISABLED, PJMEDIA_SRTP_OPTIONAL, and
   * PJMEDIA_SRTP_MANDATORY.
   *
   * Note that this setting can be further customized in account
   * configuration (#pjsua_acc_config).
   *
   * Default: #PJSUA_DEFAULT_USE_SRTP
   */
  use_srtp: pjmedia_srtp_use;

  /**
   * Specify whether SRTP requires secure signaling to be used. This option
   * is only used when \a use_srtp option above is non-zero.
   *
   * Valid values are:
   *  0: SRTP does not require secure signaling
   *  1: SRTP requires secure transport such as TLS
   *  2: SRTP requires secure end-to-end transport (SIPS)
   *
   * Note that this setting can be further customized in account
   * configuration (#pjsua_acc_config).
   *
   * Default: #PJSUA_DEFAULT_SRTP_SECURE_SIGNALING
   */
  srtp_secure_signaling: number;

  /**
   * This setting has been deprecated and will be ignored.
   */
  srtp_optional_dup_offer: boolean;

  /**
   * Specify SRTP transport setting. Application can initialize it with
   * default values using pjsua_srtp_opt_default().
   */
  srtp_opt: pjsua_srtp_opt;

  /**
   * Disconnect other call legs when more than one 2xx responses for
   * outgoing INVITE are received due to forking. Currently the library
   * is not able to handle simultaneous forked media, so disconnecting
   * the other call legs is necessary.
   *
   * With this setting enabled, the library will handle only one of the
   * connected call leg, and the other connected call legs will be
   * disconnected.
   *
   * Default: PJ_TRUE (only disable this setting for testing purposes).
   */
  hangup_forked_call: boolean;

}

/**
 * Flags to be given to pjsua_destroy2()
 */
export enum pjsua_destroy_flag {
  /**
   * Allow sending outgoing messages (such as unregistration, event
   * unpublication, BYEs, unsubscription, etc.), but do not wait for
   * responses. This is useful to perform "best effort" clean up
   * without delaying the shutdown process waiting for responses.
   */
  PJSUA_DESTROY_NO_RX_MSG = 1,

  /**
   * If this flag is set, do not send any outgoing messages at all.
   * This flag is useful if application knows that the network which
   * the messages are to be sent on is currently down.
   */
  PJSUA_DESTROY_NO_TX_MSG = 2,

  /**
   * Do not send or receive messages during destroy. This flag is
   * shorthand for  PJSUA_DESTROY_NO_RX_MSG + PJSUA_DESTROY_NO_TX_MSG.
   */
  PJSUA_DESTROY_NO_NETWORK = PJSUA_DESTROY_NO_RX_MSG |
    PJSUA_DESTROY_NO_TX_MSG

}

/**
 * This structure describes additional information to be sent with
 * outgoing SIP message. It can (optionally) be specified for example
 * with #pjsua_call_make_call(), #pjsua_call_answer(), #pjsua_call_hangup(),
 * #pjsua_call_set_hold(), #pjsua_call_send_im(), and many more.
 *
 * Application MUST call #pjsua_msg_data_init() to initialize this
 * structure before setting its values.
 */
interface pjsua_msg_data {
  /**
   * Optional remote target URI (i.e. Target header). If NULL, the target
   * will be set to the remote URI (To header). This field is used by
   * pjsua_call_make_call(), pjsua_im_send(), pjsua_call_reinvite(),
   * pjsua_call_set_hold(), and pjsua_call_update().
   */
  target_uri: string;

  /**
   * Additional message headers as linked list. Application can add
   * headers to the list by creating the header, either from the heap/pool
   * or from temporary local variable, and add the header using
   * linked list operation. See pjsua_app.c for some sample codes.
   */
  hdr_list: pjsip_hdr;

  /**
   * MIME type of optional message body.
   */
  content_type: string;

  /**
   * Optional message body to be added to the message, only when the
   * message doesn't have a body.
   */
  msg_body: string;

  /**
   * Content type of the multipart body. If application wants to send
   * multipart message bodies, it puts the parts in \a parts and set
   * the content type in \a multipart_ctype. If the message already
   * contains a body, the body will be added to the multipart bodies.
   */
  multipart_ctype: pjsip_media_type;

  /**
   * List of multipart parts. If application wants to send multipart
   * message bodies, it puts the parts in \a parts and set the content
   * type in \a multipart_ctype. If the message already contains a body,
   * the body will be added to the multipart bodies.
   */
  multipart_parts: pjsip_multipart_part;
}

/*****************************************************************************
 * Utilities.
 *
 */

/**
 * This structure is used to represent the result of the STUN server
 * resolution and testing, the #pjsua_resolve_stun_servers() function.
 * This structure will be passed in #pj_stun_resolve_cb callback.
 */
interface pj_stun_resolve_result {
  /**
   * Arbitrary data that was passed to #pjsua_resolve_stun_servers()
   * function.
   */
  token: void;

  /**
   * This will contain PJ_SUCCESS if at least one usable STUN server
   * is found, otherwise it will contain the last error code during
   * the operation.
   */
  status: pj_status_t;

  /**
   * The server name that yields successful result. This will only
   * contain value if status is successful.
   */
  name: string;

  /**
   * The server IP address. This will only contain value if status
   * is successful.
   */
  addr: pj_sockaddr;

  /**
   * The index of the usable STUN server.
   */
  index: number;
}

/**
 * This structure describe the parameter passed to #pjsua_handle_ip_change().
 */
export interface pjsua_ip_change_param {
  /**
   * If set to PJ_TRUE, this will restart the transport listener.
   *
   * Default : PJ_TRUE
   */
  restart_listener: boolean;

  /**
   * If \a restart listener is set to PJ_TRUE, some delay might be needed
   * for the listener to be restarted. Use this to set the delay.
   *
   * Default : PJSUA_TRANSPORT_RESTART_DELAY_TIME
   */
  restart_lis_delay: number;

}

/**
 * This structure describe the account config specific to IP address change.
 */
export interface pjsua_ip_change_acc_cfg {
  /**
   * Shutdown the transport used for account registration. If this is set to
   * PJ_TRUE, the transport will be shutdown altough it's used by multiple
   * account. Shutdown transport will be followed by re-Registration if
   * pjsua_acc_config.allow_contact_rewrite is enabled.
   *
   * Default: PJ_TRUE
   */
  shutdown_tp: boolean;

  /**
   * Hangup active calls associated with the account. If this is set to
   * PJ_TRUE, then the calls will be hang up.
   *
   * Default: PJ_FALSE
   */
  hangup_calls: boolean;

  /**
   * Specify the call flags used in the re-INVITE when \a hangup_calls is set
   * to PJ_FALSE. If this is set to 0, no re-INVITE will be sent. The
   * re-INVITE will be sent after re-Registration is finished.
   *
   * Default: PJSUA_CALL_REINIT_MEDIA | PJSUA_CALL_UPDATE_CONTACT |
   *          PJSUA_CALL_UPDATE_VIA
   */
  reinvite_flags: number;

}

/*****************************************************************************
 * TRANSPORT API
 */

/**
 * @defgroup PJSUA_LIB_TRANSPORT PJSUA-API Signaling Transport
 * @ingroup PJSUA_LIB
 * @brief API for managing SIP transports
 * @{
 *
 * PJSUA-API supports creating multiple transport instances, for example UDP,
 * TCP, and TLS transport. SIP transport must be created before adding an
 * account.
 */

/** SIP transport identification.
 */
export type pjsua_transport_id = number;

/**
 * Transport configuration for creating transports for both SIP
 * and media. Before setting some values to this structure, application
 * MUST call #pjsua_transport_config_default() to initialize its
 * values with default settings.
 */
export interface pjsua_transport_config {
  /**
   * UDP port number to bind locally. This setting MUST be specified
   * even when default port is desired. If the value is zero, the
   * transport will be bound to any available port, and application
   * can query the port by querying the transport info.
   */
  port: number;

  /**
   * Specify the port range for socket binding, relative to the start
   * port number specified in \a port. Note that this setting is only
   * applicable when the start port number is non zero.
   *
   * Default value is zero.
   */
  port_range: number;

  /**
   * Optional address to advertise as the address of this transport.
   * Application can specify any address or hostname for this field,
   * for example it can point to one of the export interface address in the
   * system, or it can point to the public address of a NAT router
   * where port mappings have been configured for the application.
   *
   * Note: this option can be used for both UDP and TCP as well!
   */
  public_addr: string;

  /**
   * Optional address where the socket should be bound to. This option
   * SHOULD only be used to selectively bind the socket to particular
   * export interface (instead of 0.0.0.0), and SHOULD NOT be used to set the
   * published address of a transport (the public_addr field should be
   * used for that purpose).
   *
   * Note that unlike public_addr field, the address (or hostname) here
   * MUST correspond to the actual export interface address in the host, since
   * this address will be specified as bind() argument.
   */
  bound_addr: string;

  /**
   * This specifies TLS settings for TLS transport. It is only be used
   * when this transport config is being used to create a SIP TLS
   * transport.
   */
  tls_setting: pjsip_tls_setting;

  /**
   * QoS traffic type to be set on this transport. When application wants
   * to apply QoS tagging to the transport, it's preferable to set this
   * field rather than \a qos_param fields since this is more portable.
   *
   * Default is QoS not set.
   */
  qos_type: pj_qos_type;

  /**
   * Set the low level QoS parameters to the transport. This is a lower
   * level operation than setting the \a qos_type field and may not be
   * supported on all platforms.
   *
   * Default is QoS not set.
   */
  qos_params: pj_qos_params;

  /**
   * Specify options to be set on the transport.
   *
   * By default there is no options.
   *
   */
  sockopt_params: pj_sockopt_params;

}

/**
 * This structure describes transport information returned by
 * #pjsua_transport_get_info() function.
 */
export interface pjsua_transport_info {
  /**
   * PJSUA transport identification.
   */
  id: pjsua_transport_id;

  /**
   * Transport type.
   */
  type: pjsip_transport_type_e;

  /**
   * Transport type name.
   */
  type_name: string;

  /**
   * Transport string info/description.
   */
  info: string;

  /**
   * Transport flag (see ##pjsip_transport_flags_e).
   */
  flag: number;

  /**
   * Local address length.
   */
  addr_len: number;

  /**
   * Local/bound address.
   */
  local_addr: pj_sockaddr;

  /**
   * Published address (or transport address name).
   */
  local_name: pjsip_host_port;

  /**
   * Current number of objects currently referencing this transport.
   */
  usage_count: number;

}

/*****************************************************************************
 * ACCOUNT API
 */

/**
 * @defgroup PJSUA_LIB_ACC PJSUA-API Accounts Management
 * @ingroup PJSUA_LIB
 * @brief PJSUA Accounts management
 * @{
 *
 * PJSUA accounts provide identity (or identities) of the user who is currently
 * using the application. In SIP terms, the identity is used as the <b>From</b>
 * header in outgoing requests.
 *
 * PJSUA-API supports creating and managing multiple accounts. The maximum
 * number of accounts is limited by a compile time constant
 * <tt>PJSUA_MAX_ACC</tt>.
 *
 * Account may or may not have client registration associated with it.
 * An account is also associated with <b>route set</b> and some <b>authentication
 * credentials</b>, which are used when sending SIP request messages using the
 * account. An account also has presence's <b>online status</b>, which
 * will be reported to remote peer when they subscribe to the account's
 * presence, or which is published to a presence server if presence
 * publication is enabled for the account.
 *
 * At least one account MUST be created in the application. If no user
 * association is required, application can create a userless account by
 * calling #pjsua_acc_add_local(). A userless account identifies local endpoint
 * instead of a particular user, and it correspond with a particular
 * transport instance.
 *
 * Also one account must be set as the <b>default account</b>, which is used as
 * the account to use when PJSUA fails to match a request with any other
 * accounts.
 *
 * When sending outgoing SIP requests (such as making calls or sending
 * instant messages), normally PJSUA requires the application to specify
 * which account to use for the request. If no account is specified,
 * PJSUA may be able to select the account by matching the destination
 * domain name, and fall back to default account when no match is found.
 */

/**
 * This enumeration specifies how we should offer call hold request to
 * remote peer. The default value is set by compile time constant
 * PJSUA_CALL_HOLD_TYPE_DEFAULT, and application may control the setting
 * on per-account basis by manipulating \a call_hold_type field in
 * #pjsua_acc_config.
 */
export enum pjsua_call_hold_type {
  /**
   * This will follow RFC 3264 recommendation to use a=sendonly,
   * a=recvonly, and a=inactive attribute as means to signal call
   * hold status. This is the correct value to use.
   */
  PJSUA_CALL_HOLD_TYPE_RFC3264,

  /**
   * This will use the old and deprecated method as specified in RFC 2543,
   * and will offer c=0.0.0.0 in the SDP instead. Using this has many
   * drawbacks such as inability to keep the media transport alive while
   * the call is being put on hold, and should only be used if remote
   * does not understand RFC 3264 style call hold offer.
   */
  PJSUA_CALL_HOLD_TYPE_RFC2543

}

/**
 * This enumeration controls the use of STUN in the account.
 */
export enum pjsua_stun_use {
  /**
   * Follow the default setting in the global \a pjsua_config.
   */
  PJSUA_STUN_USE_DEFAULT,

  /**
   * Disable STUN. If STUN is not enabled in the global \a pjsua_config,
   * this setting has no effect.
   */
  PJSUA_STUN_USE_DISABLED,

  /**
   * Retry other STUN servers if the STUN server selected during
   * startup (#pjsua_init()) or after calling #pjsua_update_stun_servers()
   * is unavailable during runtime. This setting is valid only for
   * account's media STUN setting and if the call is using UDP media
   * transport.
   */
  PJSUA_STUN_RETRY_ON_FAILURE

}

/**
 * This enumeration controls the use of ICE settings in the account.
 */
export enum pjsua_ice_config_use {
  /**
   * Use the default settings in the global \a pjsua_media_config.
   */
  PJSUA_ICE_CONFIG_USE_DEFAULT,

  /**
   * Use the custom \a pjsua_ice_config setting in the account.
   */
  PJSUA_ICE_CONFIG_USE_CUSTOM

}

/**
 * This enumeration controls the use of TURN settings in the account.
 */
export enum pjsua_turn_config_use {
  /**
   * Use the default setting in the global \a pjsua_media_config.
   */
  PJSUA_TURN_CONFIG_USE_DEFAULT,

  /**
   * Use the custom \a pjsua_turn_config setting in the account.
   */
  PJSUA_TURN_CONFIG_USE_CUSTOM

}

/**
 * ICE setting. This setting is used in the pjsua_acc_config.
 */
export interface pjsua_ice_config {
  /**
   * Enable ICE.
   */
  enable_ice: boolean;

  /**
   * Set the maximum number of host candidates.
   *
   * Default: -1 (maximum not set)
   */
  ice_max_host_cands: number;

  /**
   * ICE session options.
   */
  ice_opt: pj_ice_sess_options;

  /**
   * Disable RTCP component.
   *
   * Default: no
   */
  ice_no_rtcp: boolean;

  /**
   * Send re-INVITE/UPDATE every after ICE connectivity check regardless
   * the default ICE transport address is changed or not. When this is set
   * to PJ_FALSE, re-INVITE/UPDATE will be sent only when the default ICE
   * transport address is changed.
   *
   * Default: yes
   */
  ice_always_update: boolean;

}

/**
 * TURN setting. This setting is used in the pjsua_acc_config.
 */
export interface pjsua_turn_config {
  /**
   * Enable TURN candidate in ICE.
   */
  enable_turn: boolean;

  /**
   * Specify TURN domain name or host name, in in "DOMAIN:PORT" or
   * "HOST:PORT" format.
   */
  turn_server: string;

  /**
   * Specify the connection type to be used to the TURN server. Valid
   * values are PJ_TURN_TP_UDP, PJ_TURN_TP_TCP or PJ_TURN_TP_TLS.
   *
   * Default: PJ_TURN_TP_UDP
   */
  turn_conn_type: pj_turn_tp_type;

  /**
   * Specify the credential to authenticate with the TURN server.
   */
  turn_auth_cred: pj_stun_auth_cred;

  /**
   * This specifies TLS settings for TURN TLS. It is only be used
   * when this TLS is used to connect to the TURN server.
   */
  turn_tls_setting: pj_turn_sock_tls_cfg;

}

/**
 * Specify how IPv6 transport should be used in account config.
 */
export enum pjsua_ipv6_use {
  /**
   * IPv6 is not used.
   */
  PJSUA_IPV6_DISABLED,

  /**
   * IPv6 is enabled.
   */
  PJSUA_IPV6_ENABLED

}

/**
 * Specify NAT64 options to be used in account config.
 */
export enum pjsua_nat64_opt {
  /**
   * NAT64 is not used.
   */
  PJSUA_NAT64_DISABLED,

  /**
   * NAT64 is enabled.
   */
  PJSUA_NAT64_ENABLED

}

/**
 * This structure describes account configuration to be specified when
 * adding a new account with #pjsua_acc_add(). Application MUST initialize
 * this structure first by calling #pjsua_acc_config_default().
 */
export interface pjsua_acc_config {
  /**
   * Arbitrary user data to be associated with the newly created account.
   * Application may set this later with #pjsua_acc_set_user_data() and
   * retrieve it with #pjsua_acc_get_user_data().
   */
  user_data: void;

  /**
   * Account priority, which is used to control the order of matching
   * incoming/outgoing requests. The higher the number means the higher
   * the priority is, and the account will be matched first.
   */
  priority: number;

  /**
   * The full SIP URL for the account. The value can take name address or
   * URL format, and will look something like "sip:account@serviceprovider"
   * or "\"Display Name\" <sip:account@provider>".
   *
   * This field is mandatory.
   */
  id: string;

  /**
   * This is the URL to be put in the request URI for the registration,
   * and will look something like "sip:serviceprovider".
   *
   * This field should be specified if registration is desired. If the
   * value is empty, no account registration will be performed.
   */
  reg_uri: string;

  /**
   * The optional custom SIP headers to be put in the registration
   * request.
   */
  reg_hdr_list: pjsip_hdr;

  /**
   * Additional parameters that will be appended in the Contact header
   * for this account. This will only affect REGISTER requests and
   * will be appended after \a contact_params;
   *
   * The parameters should be preceeded by semicolon, and all strings must
   * be properly escaped. Example:
   *   ";my-param=X;another-param=Hi%20there"
   */
  reg_contact_params: string;

  /**
   * Additional URI parameters that will be appended in the Contact URI
   * for this account. This will only affect REGISTER requests and
   * will be appended after \a contact_uri_params;
   *
   * The parameters should be preceeded by semicolon, and all strings must
   * be properly escaped. Example:
   *   ";my-param=X;another-param=Hi%20there"
   */
  reg_contact_uri_params: string;

  /**
   * The optional custom SIP headers to be put in the presence
   * subscription request.
   */
  sub_hdr_list: pjsip_hdr;

  /**
   * Subscribe to message waiting indication events (RFC 3842).
   *
   * See also \a enable_unsolicited_mwi field on #pjsua_config.
   *
   * Default: no
   */
  mwi_enabled: boolean;

  /**
   * Specify the default expiration time for Message Waiting Indication
   * (RFC 3842) event subscription. This must not be zero.
   *
   * Default: PJSIP_MWI_DEFAULT_EXPIRES
   */
  mwi_expires: number;

  /**
   * If this flag is set, the presence information of this account will
   * be PUBLISH-ed to the server where the account belongs.
   *
   * Default: PJ_FALSE
   */
  publish_enabled: boolean;

  /**
   * Event publication options.
   */
  publish_opt: pjsip_publishc_opt;

  /**
   * Maximum time to wait for unpublication transaction(s) to complete
   * during shutdown process, before sending unregistration. The library
   * tries to wait for the unpublication (un-PUBLISH) to complete before
   * sending REGISTER request to unregister the account, during library
   * shutdown process. If the value is set too short, it is possible that
   * the unregistration is sent before unpublication completes, causing
   * unpublication request to fail.
   *
   * Default: PJSUA_UNPUBLISH_MAX_WAIT_TIME_MSEC
   */
  unpublish_max_wait_time_msec: number;

  /**
   * Authentication preference.
   */
  auth_pref: pjsip_auth_clt_pref;

  /**
   * Optional PIDF tuple ID for outgoing PUBLISH and NOTIFY. If this value
   * is not specified, a random string will be used.
   */
  pidf_tuple_id: string;

  /**
   * Optional URI to be put as Contact for this account. It is recommended
   * that this field is left empty, so that the value will be calculated
   * automatically based on the transport address.
   */
  force_contact: string;

  /**
   * Additional parameters that will be appended in the Contact header
   * for this account. This will affect the Contact header in all SIP
   * messages sent on behalf of this account, including but not limited to
   * REGISTER, INVITE, and SUBCRIBE requests or responses.
   *
   * The parameters should be preceeded by semicolon, and all strings must
   * be properly escaped. Example:
   *   ";my-param=X;another-param=Hi%20there"
   */
  contact_params: string;

  /**
   * Additional URI parameters that will be appended in the Contact URI
   * for this account. This will affect the Contact URI in all SIP
   * messages sent on behalf of this account, including but not limited to
   * REGISTER, INVITE, and SUBCRIBE requests or responses.
   *
   * The parameters should be preceeded by semicolon, and all strings must
   * be properly escaped. Example:
   *   ";my-param=X;another-param=Hi%20there"
   */
  contact_uri_params: string;

  /**
   * Specify how support for reliable provisional response (100rel/
   * PRACK) should be used for all sessions in this account. See the
   * documentation of pjsua_100rel_use enumeration for more info.
   *
   * Default: The default value is taken from the value of
   *          require_100rel in pjsua_config.
   */
  require_100rel: pjsua_100rel_use;

  /**
   * Specify the usage of Session Timers for all sessions. See the
   * #pjsua_sip_timer_use for possible values.
   *
   * Default: PJSUA_SIP_TIMER_OPTIONAL
   */
  use_timer: pjsua_sip_timer_use;

  /**
   * Specify Session Timer settings, see #pjsip_timer_setting.
   */
  timer_setting: pjsip_timer_setting;

  /**
   * Number of proxies in the proxy array below.
   */
  proxy_cnt: number;

  /**
   * Optional URI of the proxies to be visited for all outgoing requests
   * that are using this account (REGISTER, INVITE, etc). Application need
   * to specify these proxies if the service provider requires that requests
   * destined towards its network should go through certain proxies first
   * (for example, border controllers).
   *
   * These proxies will be put in the route set for this account, with
   * maintaining the orders (the first proxy in the array will be visited
   * first). If global outbound proxies are configured in pjsua_config,
   * then these account proxies will be placed after the global outbound
   * proxies in the routeset.
   */
  proxy: string[];

  /**
   * If remote sends SDP answer containing more than one format or codec in
   * the media line, send re-INVITE or UPDATE with just one codec to lock
   * which codec to use.
   *
   * Default: 1 (Yes). Set to zero to disable.
   */
  lock_codec: number;

  /**
   * Optional interval for registration, in seconds. If the value is zero,
   * default interval will be used (PJSUA_REG_INTERVAL, 300 seconds).
   */
  reg_timeout: number;

  /**
   * Specify the number of seconds to refresh the client registration
   * before the registration expires.
   *
   * Default: PJSIP_REGISTER_CLIENT_DELAY_BEFORE_REFRESH, 5 seconds
   */
  reg_delay_before_refresh: number;

  /**
   * Specify the maximum time to wait for unregistration requests to
   * complete during library shutdown sequence.
   *
   * Default: PJSUA_UNREG_TIMEOUT
   */
  unreg_timeout: number;

  /**
   * Number of credentials in the credential array.
   */
  cred_count: number;

  /**
   * Array of credentials. If registration is desired, normally there should
   * be at least one credential specified, to successfully authenticate
   * against the service provider. More credentials can be specified, for
   * example when the requests are expected to be challenged by the
   * proxies in the route set.
   */
  cred_info: pjsip_cred_info[];

  /**
   * Optionally bind this account to specific transport. This normally is
   * not a good idea, as account should be able to send requests using
   * any available transports according to the destination. But some
   * application may want to have explicit control over the transport to
   * use, so in that case it can set this field.
   *
   * Default: -1 (PJSUA_INVALID_ID)
   *
   * @see pjsua_acc_set_transport()
   */
  transport_id: pjsua_transport_id;

  /**
   * This option is used to update the transport address and the Contact
   * header of REGISTER request. When this option is  enabled, the library
   * will keep track of the public IP address from the response of REGISTER
   * request. Once it detects that the address has changed, it will
   * unregister current Contact, update the Contact with transport address
   * learned from Via header, and register a new Contact to the registrar.
   * This will also update the public name of UDP transport if STUN is
   * configured.
   *
   * See also contact_rewrite_method field.
   *
   * Default: 1 (yes)
   */
  allow_contact_rewrite: boolean;

  /**
   * Specify how Contact update will be done with the registration, if
   * \a allow_contact_rewrite is enabled. The value is bitmask combination of
   * \a pjsua_contact_rewrite_method. See also pjsua_contact_rewrite_method.
   *
   * Value PJSUA_CONTACT_REWRITE_UNREGISTER(1) is the legacy behavior.
   *
   * Default value: PJSUA_CONTACT_REWRITE_METHOD
   * (PJSUA_CONTACT_REWRITE_NO_UNREG | PJSUA_CONTACT_REWRITE_ALWAYS_UPDATE)
   */
  contact_rewrite_method: number;

  /**
   * Specify if source TCP port should be used as the initial Contact
   * address if TCP/TLS transport is used. Note that this feature will
   * be automatically turned off when nameserver is configured because
   * it may yield different destination address due to DNS SRV resolution.
   * Also some platforms are unable to report the local address of the
   * TCP socket when it is still connecting. In these cases, this
   * feature will also be turned off.
   *
   * Default: PJ_TRUE (yes).
   */
  contact_use_src_port: boolean;

  /**
   * This option is used to overwrite the "sent-by" field of the Via header
   * for outgoing messages with the same export interface address as the one in
   * the REGISTER request, as long as the request uses the same transport
   * instance as the previous REGISTER request.
   *
   * Default: 1 (yes)
   */
  allow_via_rewrite: boolean;

  /**
   * This option controls whether the IP address in SDP should be replaced
   * with the IP address found in Via header of the REGISTER response, ONLY
   * when STUN and ICE are not used. If the value is FALSE (the original
   * behavior), then the local IP address will be used. If TRUE, and when
   * STUN and ICE are disabled, then the IP address found in registration
   * response will be used.
   *
   * Default: PJ_FALSE (no)
   */
  allow_sdp_nat_rewrite: boolean;

  /**
   * Control the use of SIP outbound feature. SIP outbound is described in
   * RFC 5626 to enable proxies or registrar to send inbound requests back
   * to UA using the same connection initiated by the UA for its
   * registration. This feature is highly useful in NAT-ed deployemtns,
   * hence it is enabled by default.
   *
   * Note: currently SIP outbound can only be used with TCP and TLS
   * transports. If UDP is used for the registration, the SIP outbound
   * feature will be silently ignored for the account.
   *
   * Default: PJ_TRUE
   */
  use_rfc5626: number;

  /**
   * Specify SIP outbound (RFC 5626) instance ID to be used by this
   * application. If empty, an instance ID will be generated based on
   * the hostname of this agent. If application specifies this parameter, the
   * value will look like "<urn:uuid:00000000-0000-1000-8000-AABBCCDDEEFF>"
   * without the doublequote.
   *
   * Default: empty
   */
  rfc5626_instance_id: string;

  /**
   * Specify SIP outbound (RFC 5626) registration ID. The default value
   * is empty, which would cause the library to automatically generate
   * a suitable value.
   *
   * Default: empty
   */
  rfc5626_reg_id: string;

  /**
   * Set the interval for periodic keep-alive transmission for this account.
   * If this value is zero, keep-alive will be disabled for this account.
   * The keep-alive transmission will be sent to the registrar's address,
   * after successful registration.
   *
   * Default: 15 (seconds)
   */
  ka_interval: number;

  /**
   * Specify the data to be transmitted as keep-alive packets.
   *
   * Default: CR-LF
   */
  ka_data: string;

  /**
   * Specify whether incoming video should be shown to screen by default.
   * This applies to incoming call (INVITE), incoming re-INVITE, and
   * incoming UPDATE requests.
   *
   * Regardless of this setting, application can detect incoming video
   * by implementing \a on_call_media_state() callback and enumerating
   * the media stream(s) with #pjsua_call_get_info(). Once incoming
   * video is recognised, application may retrieve the window associated
   * with the incoming video and show or hide it with
   * #pjsua_vid_win_set_show().
   *
   * Default: PJ_FALSE
   */
  vid_in_auto_show: boolean;

  /**
   * Specify whether outgoing video should be activated by default when
   * making outgoing calls and/or when incoming video is detected. This
   * applies to incoming and outgoing calls, incoming re-INVITE, and
   * incoming UPDATE. If the setting is non-zero, outgoing video
   * transmission will be started as soon as response to these requests
   * is sent (or received).
   *
   * Regardless of the value of this setting, application can start and
   * stop outgoing video transmission with #pjsua_call_set_vid_strm().
   *
   * Default: PJ_FALSE
   */
  vid_out_auto_transmit: boolean;

  /**
   * Specify video window's flags. The value is a bitmask combination of
   * #pjmedia_vid_dev_wnd_flag.
   *
   * Default: 0
   */
  vid_wnd_flags: number;

  /**
   * Specify the default capture device to be used by this account. If
   * \a vid_out_auto_transmit is enabled, this device will be used for
   * capturing video.
   *
   * Default: PJMEDIA_VID_DEFAULT_CAPTURE_DEV
   */
  vid_cap_dev: pjmedia_vid_dev_index;

  /**
   * Specify the default rendering device to be used by this account.
   *
   * Default: PJMEDIA_VID_DEFAULT_RENDER_DEV
   */
  vid_rend_dev: pjmedia_vid_dev_index;

  /**
   * Specify the send rate control for video stream.
   *
   * Default: see #pjmedia_vid_stream_rc_config
   */
  vid_stream_rc_cfg: pjmedia_vid_stream_rc_config;

  /**
   * Specify the send keyframe config for video stream.
   *
   * Default: see #pjmedia_vid_stream_sk_config
   */
  vid_stream_sk_cfg: pjmedia_vid_stream_sk_config;

  /**
   * Media transport config.
   */
  rtp_cfg: pjsua_transport_config;

  /**
   * Specify NAT64 options.
   *
   * Default: PJSUA_NAT64_DISABLED
   */
  nat64_opt: pjsua_nat64_opt;

  /**
   * Specify whether IPv6 should be used on media.
   */
  ipv6_media_use: pjsua_ipv6_use;

  /**
   * Control the use of STUN for the SIP signaling.
   *
   * Default: PJSUA_STUN_USE_DEFAULT
   */
  sip_stun_use: pjsua_stun_use;

  /**
   * Control the use of STUN for the media transports.
   *
   * Default: PJSUA_STUN_RETRY_ON_FAILURE
   */
  media_stun_use: pjsua_stun_use;

  /**
   * Use loopback media transport. This may be useful if application
   * doesn't want PJSIP to create real media transports/sockets, such as
   * when using third party media.
   *
   * Default: PJ_FALSE
   */
  use_loop_med_tp: boolean;

  /**
   * Enable local loopback when loop_med_tp_use is set to PJ_TRUE.
   * If enabled, packets sent to the transport will be sent back to
   * the streams attached to the transport.
   *
   * Default: PJ_FALSE
   */
  enable_loopback: boolean;

  /**
   * Control the use of ICE in the account. By default, the settings in the
   * \a pjsua_media_config will be used.
   *
   * Default: PJSUA_ICE_CONFIG_USE_DEFAULT
   */
  ice_cfg_use: pjsua_ice_config_use;

  /**
   * The custom ICE setting for this account. This setting will only be
   * used if \a ice_cfg_use is set to PJSUA_ICE_CONFIG_USE_CUSTOM
   */
  ice_cfg: pjsua_ice_config;

  /**
   * Control the use of TURN in the account. By default, the settings in the
   * \a pjsua_media_config will be used
   *
   * Default: PJSUA_TURN_CONFIG_USE_DEFAULT
   */
  turn_cfg_use: pjsua_turn_config_use;

  /**
   * The custom TURN setting for this account. This setting will only be
   * used if \a turn_cfg_use is set to PJSUA_TURN_CONFIG_USE_CUSTOM
   */
  turn_cfg: pjsua_turn_config;

  /**
   * Specify whether secure media transport should be used for this account.
   * Valid values are PJMEDIA_SRTP_DISABLED, PJMEDIA_SRTP_OPTIONAL, and
   * PJMEDIA_SRTP_MANDATORY.
   *
   * Default: #PJSUA_DEFAULT_USE_SRTP
   */
  use_srtp: pjmedia_srtp_use;

  /**
   * Specify whether SRTP requires secure signaling to be used. This option
   * is only used when \a use_srtp option above is non-zero.
   *
   * Valid values are:
   *  0: SRTP does not require secure signaling
   *  1: SRTP requires secure transport such as TLS
   *  2: SRTP requires secure end-to-end transport (SIPS)
   *
   * Default: #PJSUA_DEFAULT_SRTP_SECURE_SIGNALING
   */
  srtp_secure_signaling: number;

  /**
   * This setting has been deprecated and will be ignored.
   */
  srtp_optional_dup_offer: boolean;

  /**
   * Specify SRTP transport setting. Application can initialize it with
   * default values using pjsua_srtp_opt_default().
   */
  srtp_opt: pjsua_srtp_opt;

  /**
   * Specify interval of auto registration retry upon registration failure,
   * in seconds. Set to 0 to disable auto re-registration. Note that
   * registration will only be automatically retried for temporal failures
   * considered to be recoverable in relatively short term, such as:
   * 408 (Request Timeout), 480 (Temporarily Unavailable),
   * 500 (Internal Server Error), 502 (Bad Gateway),
   * 503 (Service Unavailable), 504 (Server Timeout),
   * 6xx (global failure), and failure caused by transport problem.
   * For registration retry caused by transport failure, the first retry
   * will be done after \a reg_first_retry_interval seconds instead.
   * Note that the interval will be randomized slightly by some seconds
   * (specified in \a reg_retry_random_interval) to avoid all clients
   * re-registering at the same time.
   *
   * See also \a reg_first_retry_interval setting.
   *
   * Default: #PJSUA_REG_RETRY_INTERVAL
   */
  reg_retry_interval: number;

  /**
   * This specifies the interval for the first registration retry. The
   * registration retry is explained in \a reg_retry_interval. Note that
   * the value here will also be randomized by some seconds (specified
   * in \a reg_retry_random_interval) to avoid all clients re-registering
   * at the same time.
   *
   * Default: 0
   */
  reg_first_retry_interval: number;

  /**
   * This specifies maximum randomized value to be added/substracted
   * to/from the registration retry interval specified in \a
   * reg_retry_interval and \a reg_first_retry_interval, in second.
   * This is useful to avoid all clients re-registering at the same time.
   * For example, if the registration retry interval is set to 100 seconds
   * and this is set to 10 seconds, the actual registration retry interval
   * will be in the range of 90 to 110 seconds.
   *
   * Default: 10
   */
  reg_retry_random_interval: number;

  /**
   * Specify whether calls of the configured account should be dropped
   * after registration failure and an attempt of re-registration has
   * also failed.
   *
   * Default: PJ_FALSE (disabled)
   */
  drop_calls_on_reg_fail: boolean;

  /**
   * Specify how the registration uses the outbound and account proxy
   * settings. This controls if and what Route headers will appear in
   * the REGISTER request of this account. The value is bitmask combination
   * of PJSUA_REG_USE_OUTBOUND_PROXY and PJSUA_REG_USE_ACC_PROXY bits.
   * If the value is set to 0, the REGISTER request will not use any proxy
   * (i.e. it will not have any Route headers).
   *
   * Default: 3 (PJSUA_REG_USE_OUTBOUND_PROXY | PJSUA_REG_USE_ACC_PROXY)
   */
  reg_use_proxy: number;

  /**
   * Specify whether stream keep-alive and NAT hole punching with
   * non-codec-VAD mechanism (see @ref PJMEDIA_STREAM_ENABLE_KA) is enabled
   * for this account.
   *
   * Default: PJ_FALSE (disabled)
   */
  use_stream_ka: boolean;

  /**
   * Specify the keepalive configuration for stream.
   *
   * Default: see #pjmedia_stream_ka_config
   */
  stream_ka_cfg: pjmedia_stream_ka_config;

  /**
   * Specify how to offer call hold to remote peer. Please see the
   * documentation on #pjsua_call_hold_type for more info.
   *
   * Default: PJSUA_CALL_HOLD_TYPE_DEFAULT
   */
  call_hold_type: pjsua_call_hold_type;

  /**
   * Specify whether the account should register as soon as it is
   * added to the UA. Application can set this to PJ_FALSE and control
   * the registration manually with pjsua_acc_set_registration().
   *
   * Default: PJ_TRUE
   */
  register_on_acc_add: boolean;

  /**
   * Specify account configuration specific to IP address change used when
   * calling #pjsua_handle_ip_change().
   */
  ip_change_cfg: pjsua_ip_change_acc_cfg;

  /**
   * Enable RTP and RTCP multiplexing.
   */
  enable_rtcp_mux: boolean;

  /**
   * RTCP Feedback configuration.
   */
  rtcp_fb_cfg: pjmedia_rtcp_fb_setting;

}

/**
 * Account info. Application can query account info by calling
 * #pjsua_acc_get_info().
 */
export interface pjsua_acc_info {
  /**
   * The account ID.
   */
  id: pjsua_acc_id;

  /**
   * Flag to indicate whether this is the default account.
   */
  is_default: boolean;

  /**
   * Account URI
   */
  acc_uri: string;

  /**
   * Flag to tell whether this account has registration setting
   * (reg_uri is not empty).
   */
  has_registration: boolean;

  /**
   * An up to date expiration interval for account registration session,
   * PJSIP_EXPIRES_NOT_SPECIFIED if the account doesn't have reg session.
   */
  expires: number;

  /**
   * Last registration status code. If status code is zero, the account
   * is currently not registered. Any other value indicates the SIP
   * status code of the registration.
   */
  status: pjsip_status_code;

  /**
   * Last registration error code. When the status field contains a SIP
   * status code that indicates a registration failure, last registration
   * error code contains the error code that causes the failure. In any
   * other case, its value is zero.
   */
  reg_last_err: pj_status_t;

  /**
   * String describing the registration status.
   */
  status_text: string;

  /**
   * Presence online status for this account.
   */
  online_status: boolean;

  /**
   * Presence online status text.
   */
  online_status_text: string;

  /**
   * Extended RPID online status information.
   */
  rpid: pjrpid_element;

  /**
   * Buffer that is used internally to store the status text.
   */
  buf_: string[];

}

/*****************************************************************************
 * CALLS API
 */

/**
 * Video window ID.
 */
export type pjsua_vid_win_id = number;

/**
 * This enumeration specifies the media status of a call, and it's part
 * of pjsua_call_info structure.
 */
enum pjsua_call_media_status {
  /**
   * Call currently has no media, or the media is not used.
   */
  PJSUA_CALL_MEDIA_NONE,

  /**
   * The media is active
   */
  PJSUA_CALL_MEDIA_ACTIVE,

  /**
   * The media is currently put on hold by local endpoint
   */
  PJSUA_CALL_MEDIA_LOCAL_HOLD,

  /**
   * The media is currently put on hold by remote endpoint
   */
  PJSUA_CALL_MEDIA_REMOTE_HOLD,

  /**
   * The media has reported error (e.g. ICE negotiation)
   */
  PJSUA_CALL_MEDIA_ERROR

};

/**
 * Enumeration of video keyframe request methods. Keyframe request is
 * triggered by decoder, usually when the incoming video stream cannot
 * be decoded properly due to missing video keyframe.
 */
export enum pjsua_vid_req_keyframe_method {
  /**
   * Requesting keyframe via SIP INFO message. Note that incoming keyframe
   * request via SIP INFO will always be handled even if this flag is unset.
   */
  PJSUA_VID_REQ_KEYFRAME_SIP_INFO = 1,

  /**
   * Requesting keyframe via Picture Loss Indication of RTCP feedback.
   */
  PJSUA_VID_REQ_KEYFRAME_RTCP_PLI = 2

}

/**
 * Call media information.
 */
export interface pjsua_call_media_info {
  /** Media index in SDP. */
  index: number;

  /** Media type. */
  type: pjmedia_type;

  /** Media direction. */
  dir: pjmedia_dir;

  /** Call media status. */
  status: pjsua_call_media_status;

  /** The specific media stream info. */
  stream: {
    /** Audio stream */
    struct: {
      /** The conference port number for the call.  */
      conf_slot: pjsua_conf_port_id;
    };

    /** Video stream */
    vid: {
      /**
       * The window id for incoming video, if any, or
       * PJSUA_INVALID_ID.
       */
      win_in: pjsua_vid_win_id;

      /**
       * The video conference port number for the call in decoding
       * direction.
       */
      dec_slot: pjsua_conf_port_id;

      /**
       * The video conference port number for the call in encoding
       * direction.
       */
      enc_slot: pjsua_conf_port_id;

      /**
       * The video capture device for outgoing transmission,
       * if any, or PJMEDIA_VID_INVALID_DEV
       */
      cap_dev: pjmedia_vid_dev_index;

    }
  };

}

/**
 * This structure describes the information and current status of a call.
 */
export interface pjsua_call_info {
  /** Call identification. */
  id: pjsua_call_id;

  /** Initial call role (UAC == caller) */
  role: pjsip_role_e;

  /** The account ID where this call belongs. */
  acc_id: pjsua_acc_id;

  /** Local URI */
  local_info: string;

  /** Local Contact */
  local_contact: string;

  /** Remote URI */
  remote_info: string;

  /** Remote contact */
  remote_contact: string;

  /** Dialog Call-ID string. */
  call_id: string;

  /** Call setting */
  setting: pjsua_call_setting;

  /** Call state */
  state: pjsip_inv_state;

  /** Text describing the state */
  state_text: string;

  /** Last status code heard, which can be used as cause code */
  last_status: pjsip_status_code;

  /** The reason phrase describing the status. */
  last_status_text: string;

  /** Media status of the default audio stream. Default audio stream
   *  is chosen according to this priority:
   *  1. enabled, i.e: SDP media port not zero
   *  2. transport protocol in the SDP matching account config's
   *     secure media transport usage (\a use_srtp field).
   *  3. active, i.e: SDP media direction is not "inactive"
   *  4. media order (according to the SDP).
   */
  media_status: pjsua_call_media_status;

  /** Media direction of the default audio stream.
   *  See \a media_status above on how the default is chosen.
   */
  media_dir: pjmedia_dir;

  /** The conference port number for the default audio stream.
   *  See \a media_status above on how the default is chosen.
   */
  conf_slot: pjsua_conf_port_id;

  /** Number of active media info in this call. */
  media_cnt: number;

  /** Array of active media information. */
  media: pjsua_call_media_info[];

  /** Number of provisional media info in this call. */
  prov_media_cnt: number;

  /** Array of provisional media information. This contains the media info
   *  in the provisioning state, that is when the media session is being
   *  created/updated (SDP offer/answer is on progress).
   */
  prov_media: pjsua_call_media_info[];

  /** Up-to-date call connected duration (zero when call is not
   *  established)
   */
  connect_duration: pj_time_val;

  /** Total call duration, including set-up time */
  total_duration: pj_time_val;

  /** Flag if remote was SDP offerer */
  rem_offerer: boolean;

  /** Number of audio streams offered by remote */
  rem_aud_cnt: number;

  /** Number of video streams offered by remote */
  rem_vid_cnt: number;

  /** Internal */
  buf_: {
    local_info: string[];
    local_contact: string[];
    remote_info: string[];
    remote_contact: string[];
    call_id: string[];
    last_status_text: string[];
  };

}

/**
 * Flags to be given to various call APIs. More than one flags may be
 * specified by bitmasking them.
 */
export enum pjsua_call_flag {
  /**
   * When the call is being put on hold, specify this flag to unhold it.
   * This flag is only valid for #pjsua_call_reinvite() and
   * #pjsua_call_update(). Note: for compatibility reason, this flag must
   * have value of 1 because previously the unhold option is specified as
   * boolean value.
   */
  PJSUA_CALL_UNHOLD = 1,

  /**
   * Update the local invite session's contact with the contact URI from
   * the account. This flag is only valid for #pjsua_call_set_hold2(),
   * #pjsua_call_reinvite() and #pjsua_call_update(). This flag is useful
   * in IP address change situation, after the local account's Contact has
   * been updated (typically with re-registration) use this flag to update
   * the invite session with the new Contact and to inform this new Contact
   * to the remote peer with the outgoing re-INVITE or UPDATE.
   */
  PJSUA_CALL_UPDATE_CONTACT = 2,

  /**
   * Include SDP "m=" line with port set to zero for each disabled media
   * (i.e when aud_cnt or vid_cnt is set to zero). This flag is only valid
   * for #pjsua_call_make_call(), #pjsua_call_reinvite(), and
   * #pjsua_call_update(). Note that even this flag is applicable in
   * #pjsua_call_reinvite() and #pjsua_call_update(), it will only take
   * effect when the re-INVITE/UPDATE operation regenerates SDP offer,
   * such as changing audio or video count in the call setting.
   */
  PJSUA_CALL_INCLUDE_DISABLED_MEDIA = 4,

  /**
   * Do not send SDP when sending INVITE or UPDATE. This flag is only valid
   * for #pjsua_call_make_call(), #pjsua_call_reinvite()/reinvite2(), or
   * #pjsua_call_update()/update2(). For re-invite/update, specifying
   * PJSUA_CALL_UNHOLD will take precedence over this flag.
   */
  PJSUA_CALL_NO_SDP_OFFER = 8,

  /**
   * Deinitialize and recreate media, including media transport. This flag
   * is useful in IP address change situation, if the media transport
   * address (or address family) changes, for example during IPv4/IPv6
   * network handover.
   * This flag is only valid for #pjsua_call_reinvite()/reinvite2(), or
   * #pjsua_call_update()/update2().
   *
   * Warning: If the re-INVITE/UPDATE fails, the old media will not be
   * reverted.
   */
  PJSUA_CALL_REINIT_MEDIA = 16,

  /**
   * Update the local invite session's Via with the via address from
   * the account. This flag is only valid for #pjsua_call_set_hold2(),
   * #pjsua_call_reinvite() and #pjsua_call_update(). Similar to
   * the flag PJSUA_CALL_UPDATE_CONTACT above, this flag is useful
   * in IP address change situation, after the local account's Via has
   * been updated (typically with re-registration).
   */
  PJSUA_CALL_UPDATE_VIA = 32,

  /**
   * Update dialog target to URI specified in pjsua_msg_data.target_uri.
   * This flag is only valid for pjsua_call_set_hold(),
   * pjsua_call_reinvite(), and pjsua_call_update(). This flag can be
   * useful in IP address change scenario where IP version has been changed
   * and application needs to update target IP address.
   */
  PJSUA_CALL_UPDATE_TARGET = 64,

  /**
   * Set media direction as specified in pjsua_call_setting.media_dir.
   */
  PJSUA_CALL_SET_MEDIA_DIR = 128

}

/**
 * This enumeration represents video stream operation on a call.
 * See also #pjsua_call_vid_strm_op_param for further info.
 */
export enum pjsua_call_vid_strm_op {
  /**
   * No operation
   */
  PJSUA_CALL_VID_STRM_NO_OP,

  /**
   * Add a new video stream. This will add a new m=video line to
   * the media, regardless of whether existing video is/are present
   * or not.  This will cause re-INVITE or UPDATE to be sent to remote
   * party.
   */
  PJSUA_CALL_VID_STRM_ADD,

  /**
   * Remove/disable an existing video stream. This will
   * cause re-INVITE or UPDATE to be sent to remote party.
   */
  PJSUA_CALL_VID_STRM_REMOVE,

  /**
   * Change direction of a video stream. This operation can be used
   * to activate or deactivate an existing video media. This will
   * cause re-INVITE or UPDATE to be sent to remote party.
   */
  PJSUA_CALL_VID_STRM_CHANGE_DIR,

  /**
   * Change capture device of a video stream.  This will not send
   * re-INVITE or UPDATE to remote party.
   */
  PJSUA_CALL_VID_STRM_CHANGE_CAP_DEV,

  /**
   * Start transmitting video stream. This will cause previously
   * stopped stream to start transmitting again. Note that no
   * re-INVITE/UPDATE is to be transmitted to remote since this
   * operation only operates on local stream.
   */
  PJSUA_CALL_VID_STRM_START_TRANSMIT,

  /**
   * Stop transmitting video stream. This will cause the stream to
   * be paused in TX direction, causing it to stop sending any video
   * packets. No re-INVITE/UPDATE is to be transmitted to remote
   * with this operation.
   */
  PJSUA_CALL_VID_STRM_STOP_TRANSMIT,

  /**
   * Send keyframe in the video stream. This will force the stream to
   * generate and send video keyframe as soon as possible. No
   * re-INVITE/UPDATE is to be transmitted to remote with this operation.
   */
  PJSUA_CALL_VID_STRM_SEND_KEYFRAME

}

/**
 * Parameters for video stream operation on a call. Application should
 * use #pjsua_call_vid_strm_op_param_default() to initialize this structure
 * with its default values.
 */
export interface pjsua_call_vid_strm_op_param {
  /**
   * Specify the media stream index. This can be set to -1 to denote
   * the default video stream in the call, which is the first active
   * video stream or any first video stream if none is active.
   *
   * This field is valid for all video stream operations, except
   * PJSUA_CALL_VID_STRM_ADD.
   *
   * Default: -1 (first active video stream, or any first video stream
   *              if none is active)
   */
  med_idx: number;

  /**
   * Specify the media stream direction.
   *
   * This field is valid for the following video stream operations:
   * PJSUA_CALL_VID_STRM_ADD and PJSUA_CALL_VID_STRM_CHANGE_DIR.
   *
   * Default: PJMEDIA_DIR_ENCODING_DECODING
   */
  dir: pjmedia_dir;

  /**
   * Specify the video capture device ID. This can be set to
   * PJMEDIA_VID_DEFAULT_CAPTURE_DEV to specify the default capture
   * device as configured in the account.
   *
   * This field is valid for the following video stream operations:
   * PJSUA_CALL_VID_STRM_ADD and PJSUA_CALL_VID_STRM_CHANGE_CAP_DEV.
   *
   * Default: PJMEDIA_VID_DEFAULT_CAPTURE_DEV.
   */
  cap_dev: pjmedia_vid_dev_index;

}

/**
 * Parameters for sending DTMF. Application should use
 * #pjsua_call_send_dtmf_param_default() to initialize this structure
 * with its default values.
 */
export interface pjsua_call_send_dtmf_param {
  /**
   * The method used to send DTMF.
   *
   * Default: PJSUA_DTMF_METHOD_RFC2833
   */
  method: pjsua_dtmf_method;

  /**
   * The signal duration used for the DTMF.
   *
   * Default: PJSUA_CALL_SEND_DTMF_DURATION_DEFAULT
   */
  uration: number;

  /**
   * The DTMF digits to be sent.
   */
  digits: string;

}

/*****************************************************************************
 * BUDDY API
 */

/**
 * @defgroup PJSUA_LIB_BUDDY PJSUA-API Buddy, Presence, and Instant Messaging
 * @ingroup PJSUA_LIB
 * @brief Buddy management, buddy's presence, and instant messaging.
 * @{
 *
 * This section describes PJSUA-APIs related to buddies management,
 * presence management, and instant messaging.
 */

/**
 * This structure describes buddy configuration when adding a buddy to
 * the buddy list with #pjsua_buddy_add(). Application MUST initialize
 * the structure with #pjsua_buddy_config_default() to initialize this
 * structure with default configuration.
 */
export interface pjsua_buddy_config {
  /**
   * Buddy URL or name address.
   */
  uri: string;

  /**
   * Specify whether presence subscription should start immediately.
   */
  subscribe: boolean;

  /**
   * Specify arbitrary application data to be associated with with
   * the buddy object.
   */
  user_data: void;

}

/**
 * This enumeration describes basic buddy's online status.
 */
export enum pjsua_buddy_status {
  /**
   * Online status is unknown (possibly because no presence subscription
   * has been established).
   */
  PJSUA_BUDDY_STATUS_UNKNOWN,

  /**
   * Buddy is known to be online.
   */
  PJSUA_BUDDY_STATUS_ONLINE,

  /**
   * Buddy is offline.
   */
  PJSUA_BUDDY_STATUS_OFFLINE,

}

/**
 * This structure describes buddy info, which can be retrieved by calling
 * #pjsua_buddy_get_info().
 */
export interface pjsua_buddy_info {
  /**
   * The buddy ID.
   */
  id: pjsua_buddy_id;

  /**
   * The full URI of the buddy, as specified in the configuration.
   */
  uri: string;

  /**
   * Buddy's Contact, only available when presence subscription has
   * been established to the buddy.
   */
  contact: string;

  /**
   * Buddy's online status.
   */
  status: pjsua_buddy_status;

  /**
   * Text to describe buddy's online status.
   */
  status_text: string;

  /**
   * Flag to indicate that we should monitor the presence information for
   * this buddy (normally yes, unless explicitly disabled).
   */
  monitor_pres: boolean;

  /**
   * If \a monitor_pres is enabled, this specifies the last state of the
   * presence subscription. If presence subscription session is currently
   * active, the value will be PJSIP_EVSUB_STATE_ACTIVE. If presence
   * subscription request has been rejected, the value will be
   * PJSIP_EVSUB_STATE_TERMINATED, and the termination reason will be
   * specified in \a sub_term_reason.
   */
  sub_state: pjsip_evsub_state;

  /**
   * String representation of subscription state.
   */
  sub_state_name: string;

  /**
   * Specifies the last presence subscription termination code. This would
   * return the last status of the SUBSCRIBE request. If the subscription
   * is terminated with NOTIFY by the server, this value will be set to
   * 200, and subscription termination reason will be given in the
   * \a sub_term_reason field.
   */
  sub_term_code: number;

  /**
   * Specifies the last presence subscription termination reason. If
   * presence subscription is currently active, the value will be empty.
   */
  sub_term_reason: string;

  /**
   * Extended RPID information about the person.
   */
  rpid: pjrpid_element;

  /**
   * Extended presence info.
   */
  pres_status: pjsip_pres_status;

  /**
   * Internal buffer.
   */
  buf_: string[];

}

/*****************************************************************************
 * MEDIA API
 */

/**
 * @defgroup PJSUA_LIB_MEDIA PJSUA-API Media Manipulation
 * @ingroup PJSUA_LIB
 * @brief Media manipulation.
 * @{
 *
 * PJSUA has rather powerful media features, which are built around the
 * PJMEDIA conference bridge. Basically, all media "ports" (such as calls, WAV
 * players, WAV playlist, file recorders, sound device, tone generators, etc)
 * are terminated in the conference bridge, and application can manipulate
 * the interconnection between these terminations freely.
 *
 * The conference bridge provides powerful switching and mixing functionality
 * for application. With the conference bridge, each conference slot (e.g.
 * a call) can transmit to multiple destinations, and one destination can
 * receive from multiple sources. If more than one media terminations are
 * terminated in the same slot, the conference bridge will mix the signal
 * automatically.
 *
 * Application connects one media termination/slot to another by calling
 * #pjsua_conf_connect() function. This will establish <b>unidirectional</b>
 * media flow from the source termination to the sink termination. To
 * establish bidirectional media flow, application wound need to make another
 * call to #pjsua_conf_connect(), this time inverting the source and
 * destination slots in the parameter.
 *
 * For example, to stream a WAV file to remote call, application may use
 * the following steps:
 *
 \code

  pj_status_t stream_to_call( call_id:pjsua_call_id )
  {
     pjsua_player_id player_id;

     status = pjsua_player_create("mysong.wav", 0, &player_id);
     if (status != PJ_SUCCESS)
        return status;

     status = pjsua_conf_connect( pjsua_player_get_conf_port(),
				  pjsua_call_get_conf_port() );
  }
 \endcode
 *
 *
 * Other features of PJSUA media:
 *  - efficient N to M interconnections between media terminations.
 *  - media termination can be connected to itself to create loopback
 *    media.
 *  - the media termination may have different clock rates, and resampling
 *    will be done automatically by conference bridge.
 *  - media terminations may also have different frame time; the
 *    conference bridge will perform the necessary bufferring to adjust
 *    the difference between terminations.
 *  - interconnections are removed automatically when media termination
 *    is removed from the bridge.
 *  - sound device may be changed even when there are active media
 *    interconnections.
 *  - correctly report call's media quality (in #pjsua_call_dump()) from
 *    RTCP packet exchange.
 */

/**
 * This structure describes media configuration, which will be specified
 * when calling #pjsua_init(). Application MUST initialize this structure
 * by calling #pjsua_media_config_default().
 */
export interface pjsua_media_config {
  /**
   * Clock rate to be applied to the conference bridge.
   * If value is zero, default clock rate will be used
   * (PJSUA_DEFAULT_CLOCK_RATE, which by default is 16KHz).
   */
  clock_rate: number;

  /**
   * Clock rate to be applied when opening the sound device.
   * If value is zero, conference bridge clock rate will be used.
   */
  snd_clock_rate: number;

  /**
   * Channel count be applied when opening the sound device and
   * conference bridge.
   */
  channel_count: number;

  /**
   * Specify audio frame ptime. The value here will affect the
   * samples per frame of both the sound device and the conference
   * bridge. Specifying lower ptime will normally reduce the
   * latency.
   *
   * Default value: PJSUA_DEFAULT_AUDIO_FRAME_PTIME
   */
  audio_frame_ptime: number;

  /**
   * Specify maximum number of media ports to be created in the
   * conference bridge. Since all media terminate in the bridge
   * (calls, file player, file recorder, etc), the value must be
   * large enough to support all of them. However, the larger
   * the value, the more computations are performed.
   *
   * Default value: PJSUA_MAX_CONF_PORTS
   */
  max_media_ports: number;

  /**
   * Specify whether the media manager should manage its own
   * ioqueue for the RTP/RTCP sockets. If yes, ioqueue will be created
   * and at least one worker thread will be created too. If no,
   * the RTP/RTCP sockets will share the same ioqueue as SIP sockets,
   * and no worker thread is needed.
   *
   * Normally application would say yes here, unless it wants to
   * run everything from a single thread.
   */
  has_ioqueue: boolean;

  /**
   * Specify the number of worker threads to handle incoming RTP
   * packets. A value of one is recommended for most applications.
   */
  thread_cnt: number;

  /**
   * Media quality, 0-10, according to this table:
   *   5-10: resampling use large filter,
   *   3-4:  resampling use small filter,
   *   1-2:  resampling use linear.
   * The media quality also sets speex codec quality/complexity to the
   * number.
   *
   * Default: 5 (PJSUA_DEFAULT_CODEC_QUALITY).
   */
  quality: number;

  /**
   * Specify default codec ptime.
   *
   * Default: 0 (codec specific)
   */
  ptime: number;

  /**
   * Disable VAD?
   *
   * Default: 0 (no (meaning VAD is enabled))
   */
  no_vad: boolean;

  /**
   * iLBC mode (20 or 30).
   *
   * Default: 30 (PJSUA_DEFAULT_ILBC_MODE)
   */
  ilbc_mode: number;

  /**
   * Percentage of RTP packet to drop in TX direction
   * (to simulate packet lost).
   *
   * Default: 0
   */
  tx_drop_pct: number;

  /**
   * Percentage of RTP packet to drop in RX direction
   * (to simulate packet lost).
   *
   * Default: 0
   */
  rx_drop_pct: number;

  /**
   * Echo canceller options (see #pjmedia_echo_create()).
   * Specify PJMEDIA_ECHO_USE_SW_ECHO here if application wishes
   * to use software echo canceller instead of device EC.
   *
   * Default: 0.
   */
  ec_options: number;

  /**
   * Echo canceller tail length, in miliseconds.
   *
   * Default: PJSUA_DEFAULT_EC_TAIL_LEN
   */
  ec_tail_len: number;

  /**
   * Audio capture buffer length, in milliseconds.
   *
   * Default: PJMEDIA_SND_DEFAULT_REC_LATENCY
   */
  snd_rec_latency: number;

  /**
   * Audio playback buffer length, in milliseconds.
   *
   * Default: PJMEDIA_SND_DEFAULT_PLAY_LATENCY
   */
  snd_play_latency: number;

  /**
   * Jitter buffer initial prefetch delay in msec. The value must be
   * between jb_min_pre and jb_max_pre below. If the value is 0,
   * prefetching will be disabled.
   *
   * Default: -1 (to use default stream settings, currently 0)
   */
  jb_init: number;

  /**
   * Jitter buffer minimum prefetch delay in msec.
   *
   * Default: -1 (to use default stream settings, currently 60 msec)
   */
  jb_min_pre: number;

  /**
   * Jitter buffer maximum prefetch delay in msec.
   *
   * Default: -1 (to use default stream settings, currently 240 msec)
   */
  jb_max_pre: number;

  /**
   * Set maximum delay that can be accomodated by the jitter buffer msec.
   *
   * Default: -1 (to use default stream settings, currently 360 msec)
   */
  jb_max: number;

  /**
   * Set the algorithm the jitter buffer uses to discard frames in order to
   * adjust the latency.
   *
   * Default: PJMEDIA_JB_DISCARD_PROGRESSIVE
   */
  jb_discard_algo: pjmedia_jb_discard_algo;

  /**
   * Enable ICE
   */
  enable_ice: boolean;

  /**
   * Set the maximum number of host candidates.
   *
   * Default: -1 (maximum not set)
   */
  ice_max_host_cands: number;

  /**
   * ICE session options.
   */
  ice_opt: pj_ice_sess_options;

  /**
   * Disable RTCP component.
   *
   * Default: no
   */
  ice_no_rtcp: boolean;

  /**
   * Send re-INVITE/UPDATE every after ICE connectivity check regardless
   * the default ICE transport address is changed or not. When this is set
   * to PJ_FALSE, re-INVITE/UPDATE will be sent only when the default ICE
   * transport address is changed.
   *
   * Default: yes
   */
  ice_always_update: boolean;

  /**
   * Enable TURN relay candidate in ICE.
   */
  enable_turn: boolean;

  /**
   * Specify TURN domain name or host name, in in "DOMAIN:PORT" or
   * "HOST:PORT" format.
   */
  turn_server: string;

  /**
   * Specify the connection type to be used to the TURN server. Valid
   * values are PJ_TURN_TP_UDP, PJ_TURN_TP_TCP or PJ_TURN_TP_TLS.
   *
   * Default: PJ_TURN_TP_UDP
   */
  turn_conn_type: pj_turn_tp_type;

  /**
   * Specify the credential to authenticate with the TURN server.
   */
  turn_auth_cred: pj_stun_auth_cred;

  /**
   * This specifies TLS settings for TLS transport. It is only be used
   * when this TLS is used to connect to the TURN server.
   */
  turn_tls_setting: pj_turn_sock_tls_cfg;

  /**
   * Specify idle time of sound device before it is automatically closed,
   * in seconds. Use value -1 to disable the auto-close feature of sound
   * device
   *
   * Default : 1
   */
  snd_auto_close_time: number;

  /**
   * Specify whether built-in/native preview should be used if available.
   * In some systems, video input devices have built-in capability to show
   * preview window of the device. Using this built-in preview is preferable
   * as it consumes less CPU power. If built-in preview is not available,
   * the library will perform software rendering of the input. If this
   * field is set to PJ_FALSE, software preview will always be used.
   *
   * Default: PJ_TRUE
   */
  vid_preview_enable_native: boolean;

  /**
   * Disable smart media update (ticket #1568). The smart media update
   * will check for any changes in the media properties after a successful
   * SDP negotiation and the media will only be reinitialized when any
   * change is found. When it is disabled, media streams will always be
   * reinitialized after a successful SDP negotiation.
   *
   * Note for third party media, the smart media update requires stream info
   * retrieval capability, see #PJSUA_THIRD_PARTY_STREAM_HAS_GET_INFO.
   *
   * Default: PJ_FALSE
   */
  no_smart_media_update: boolean;

  /**
   * Omit RTCP SDES and BYE in outgoing RTCP packet, this setting will be
   * applied for both audio and video streams. Note that, when RTCP SDES
   * and BYE are set to be omitted, RTCP SDES will still be sent once when
   * the stream starts/stops and RTCP BYE will be sent once when the stream
   * stops.
   *
   * Default: PJ_FALSE
   */
  no_rtcp_sdes_bye: boolean;

  /**
   * Optional callback for audio frame preview right before queued to
   * the speaker.
   * Notes:
   * - application MUST NOT block or perform long operation in the callback
   *   as the callback may be executed in sound device thread
   * - when using software echo cancellation, application MUST NOT modify
   *   the audio data from within the callback, otherwise the echo canceller
   *   will not work properly.
   */
  on_aud_prev_play_frame (frame: pjmedia_frame): void;

  /**
   * Optional callback for audio frame preview recorded from the microphone
   * before being processed by any media component such as software echo
   * canceller.
   * Notes:
   * - application MUST NOT block or perform long operation in the callback
   *   as the callback may be executed in sound device thread
   * - when using software echo cancellation, application MUST NOT modify
   *   the audio data from within the callback, otherwise the echo canceller
   *   will not work properly.
   */
  on_aud_prev_rec_frame (frame: pjmedia_frame): void;
}

/**
 * This structure describes codec information, which can be retrieved by
 * calling #pjsua_enum_codecs().
 */
export interface pjsua_codec_info {
  /**
   * Codec unique identification.
   */
  codec_id: string;

  /**
   * Codec priority (integer 0-255).
   */
  priority: pj_uint8_t;

  /**
   * Codec description.
   */
  desc: string;

  /**
   * Internal buffer.
   */
  buf_: string[];

};

/**
 * This structure describes information about a particular media port that
 * has been registered into the conference bridge. Application can query
 * this info by calling #pjsua_conf_get_port_info().
 */
export interface pjsua_conf_port_info {
  /** Conference port number. */
  slot_id: pjsua_conf_port_id;

  /** Port name. */
  name: string;

  /** Format. */
  format: pjmedia_format;

  /** Clock rate. */
  clock_rate: number;

  /** Number of channels. */
  channel_count: number;

  /** Samples per frame */
  samples_per_frame: number;

  /** Bits per sample */
  bits_per_sample: number;

  /** Tx level adjustment. */
  tx_level_adj: number;

  /** Rx level adjustment. */
  rx_level_adj: number;

  /** Number of listeners in the array. */
  listener_cnt: number;

  /** Array of listeners (in other words, ports where this port is
   *  transmitting to).
   */
  listeners: pjsua_conf_port_id[];

}

/**
 * This structure holds information about custom media transport to
 * be registered to pjsua.
 */
export interface pjsua_media_transport {
  /**
   * Media socket information containing the address information
   * of the RTP and RTCP socket.
   */
  skinfo: pjmedia_sock_info;

  /**
   * The media transport instance.
   */
  transport: pjmedia_transport;

}

/**
 * Sound device index constants.
 */
export enum pjsua_snd_dev_id {
  /**
   * Constant to denote default capture device.
   */
  PJSUA_SND_DEFAULT_CAPTURE_DEV = "PJMEDIA_AUD_DEFAULT_CAPTURE_DEV",

  /**
   * Constant to denote default playback device.
   */
  PJSUA_SND_DEFAULT_PLAYBACK_DEV = "PJMEDIA_AUD_DEFAULT_PLAYBACK_DEV",

  /**
   * Constant to denote that no sound device is being used.
   */
  PJSUA_SND_NO_DEV = "PJMEDIA_AUD_INVALID_DEV",

  /**
   * Constant to denote null sound device.
   */
  PJSUA_SND_NULL_DEV = -99

}

/**
 * This enumeration specifies the sound device mode.
 */
export enum pjsua_snd_dev_mode {
  /**
   * Open sound device without mic (speaker only).
   */
  PJSUA_SND_DEV_SPEAKER_ONLY = 1,

  /**
   * Do not open sound device, after setting the sound device.
   */
  PJSUA_SND_DEV_NO_IMMEDIATE_OPEN = 2

}

/**
 * This structure specifies the parameters to set the sound device.
 * Use pjsua_snd_dev_param_default() to initialize this structure with
 * default values.
 */
export interface pjsua_snd_dev_param {
  /*
     * Capture dev id.
     *
     * Default: PJMEDIA_AUD_DEFAULT_CAPTURE_DEV
     */
  capture_dev: number;

  /*
     * Playback dev id.
     *
     * Default: PJMEDIA_AUD_DEFAULT_PLAYBACK_DEV
     */
  playback_dev: number;

  /*
     * Sound device mode, refer to #pjsua_snd_dev_mode.
     *
     * Default: 0
     */
  mode: number;

}

/**
 * This structure specifies the parameters for conference ports connection.
 * Use pjsua_conf_connect_param_default() to initialize this structure with
 * default values.
 */
export interface pjsua_conf_connect_param {
  /*
     * Signal level adjustment from the source to the sink to make it
     * louder or quieter. Value 1.0 means no level adjustment,
     * while value 0 means to mute the port.
     *
     * Default: 1.0
     */
  level: float;

}

/*****************************************************************************
 * VIDEO API
 */

/**
 * @defgroup PJSUA_LIB_VIDEO PJSUA-API Video
 * @ingroup PJSUA_LIB
 * @brief Video support
 * @{
 */

/*
 * Video preview API
 */

/**
 * Parameters for starting video preview with pjsua_vid_preview_start().
 * Application should initialize this structure with
 * pjsua_vid_preview_param_default().
 */
export interface pjsua_vid_preview_param {
  /**
   * Device ID for the video renderer to be used for rendering the
   * capture stream for preview. This parameter is ignored if native
   * preview is being used.
   *
   * Default: PJMEDIA_VID_DEFAULT_RENDER_DEV
   */
  rend_id: pjmedia_vid_dev_index;

  /**
   * Show window initially.
   *
   * Default: PJ_TRUE.
   */
  show: boolean;

  /**
   * Window flags.  The value is a bitmask combination of
   * #pjmedia_vid_dev_wnd_flag.
   *
   * Default: 0.
   */
  wnd_flags: number;

  /**
   * Media format. Initialize this with #pjmedia_format_init_video().
   * If left unitialized, this parameter will not be used.
   */
  format: pjmedia_format;

  /**
   * Optional output window to be used to display the video preview.
   * This parameter will only be used if the video device supports
   * PJMEDIA_VID_DEV_CAP_OUTPUT_WINDOW capability and the capability
   * is not read-only.
   */
  wnd: pjmedia_vid_dev_hwnd;

}

/*
 * Video window manipulation API.
 */

/**
 * This structure describes video window info.
 */
export interface pjsua_vid_win_info {
  /**
   * Flag to indicate whether this window is a native window,
   * such as created by built-in preview device. If this field is
   * PJ_TRUE, only the native window handle field of this
   * structure is valid.
   */
  is_native: boolean;

  /**
   * Native window handle.
   */
  hwnd: pjmedia_vid_dev_hwnd;

  /**
   * Renderer device ID.
   */
  rdr_dev: pjmedia_vid_dev_index;

  /**
   * Renderer port ID in the video conference bridge.
   */
  slot_id: pjsua_conf_port_id;

  /**
   * Window show status. The window is hidden if false.
   */
  show: boolean;

  /**
   * Window position.
   */
  pos: pjmedia_coord;

  /**
   * Window size.
   */
  size: pjmedia_rect_size;

}

/*
 * Video conference API
 */

/**
 * This structure describes information about a particular video media port
 * that has been registered into the video conference bridge. Application
 * can query this info by calling #pjsua_vid_conf_get_port_info().
 */
export interface pjsua_vid_conf_port_info {
  /** Conference port number. */
  slot_id: pjsua_conf_port_id;

  /** Port name. */
  name: string;

  /** Format. */
  format: pjmedia_format;

  /** Number of listeners in the array. */
  listener_cnt: number;

  /** Array of listeners (in other words, ports where this port is
   *  transmitting to).
   */
  listeners: pjsua_conf_port_id[];

  /** Number of transmitters in the array. */
  transmitter_cnt: number;

  /** Array of transmitters (in other words, ports where this port is
   *  receiving from).
   */
  transmitters: pjsua_conf_port_id[];

}
