/**
 * This structure describes PJSIP run-time configurations/settings.
 * Application may use #pjsip_cfg() function to modify the settings
 * before creating the stack.
 */
import { long, pj_bool_t, unsigned } from "./c_types_to_ts";

export interface pjsip_cfg_t {
  /** Global settings. */
  endpt: {
    /**
     * Specify port number should be allowed to appear in To and From
     * header. Note that RFC 3261 disallow this, see Table 1 in section
     * 19.1.1 of the RFC.
     *
     * Default is PJSIP_ALLOW_PORT_IN_FROMTO_HDR.
     */
    allow_port_in_fromto_hdr: pj_bool_t;

    /**
     * Accept call replace in early state when invite is not initiated
     * by the user agent. RFC 3891 Section 3 disallows this, however,
     * for better interoperability reason, this might be ignored.
     *
     * Default is PJSIP_ACCEPT_REPLACE_IN_EARLY_STATE.
     */
    accept_replace_in_early_state: pj_bool_t;

    /**
     * Allow hash character ('#') to appear in outgoing URIs. See
     * https://trac.pjsip.org/repos/ticket/1569.
     *
     * Default is PJ_FALSE.
     */
    allow_tx_hash_in_uri: pj_bool_t;

    /**
     * Disable rport in request.
     *
     * Default is PJ_FALSE.
     */
    disable_rport: pj_bool_t;

    /**
     * Disable automatic switching from UDP to TCP if outgoing request
     * is greater than 1300 bytes.
     *
     * Default is PJSIP_DONT_SWITCH_TO_TCP.
     */
    disable_tcp_switch: pj_bool_t;

    /**
     * Disable automatic switching to TLS if target-URI does not use
     * "sips" scheme nor TLS transport, even when request-URI uses
     * "sips" scheme.
     *
     * Default is PJSIP_DONT_SWITCH_TO_TLS.
     */
    disable_tls_switch: pj_bool_t;

    /**
     * Enable call media session to always be updated to the latest
     * received early media SDP when receiving forked early media
     * (multiple 183 responses with different To tag).
     *
     * Default is PJSIP_FOLLOW_EARLY_MEDIA_FORK.
     */
    follow_early_media_fork: pj_bool_t;

    /**
     * Specify whether "alias" param should be added to the Via header
     * in any outgoing request with connection oriented transport.
     *
     * Default is PJSIP_REQ_HAS_VIA_ALIAS.
     */
    req_has_via_alias: pj_bool_t;

    /**
     * Resolve hostname when trying to get the network interface to be put
     * in Via or Contact header.
     *
     * Default is PJSIP_RESOLVE_HOSTNAME_TO_GET_INTERFACE.
     */
    resolve_hostname_to_get_interface: pj_bool_t;

    /**
     * Disable security check on incoming messages in a secure dialog.
     * A secure dialog is created when the request that creates the dialog
     * uses "sips" scheme in its request URI. Contact URI should use "sips"
     * scheme and the top-most Record-Route URI, if any, should use either
     * "sips" scheme or "transport=tls" param. See also
     * https://trac.pjsip.org/repos/ticket/1735.
     *
     * Default is PJ_FALSE.
     */
    disable_secure_dlg_check: pj_bool_t;

    /**
     * Encode SIP headers in their short forms to reduce size. By default,
     * SIP headers in outgoing messages will be encoded in their full names.
     * If this option is enabled, then SIP headers for outgoing messages
     * will be encoded in their short forms, to reduce message size.
     * Note that this does not affect the ability of PJSIP to parse incoming
     * SIP messages, as the parser always supports parsing both the long
     * and short version of the headers.
     *
     * Default is PJSIP_ENCODE_SHORT_HNAME
     */
    use_compact_form: pj_bool_t;

    /**
     * Accept multiple SDP answers on non-reliable 18X responses and the 2XX
     * response when they are all received from the same source (same To tag).
     *
     * See also:
     * https://tools.ietf.org/html/rfc6337#section-3.1.1
     *
     * Default is PJSIP_ACCEPT_MULTIPLE_SDP_ANSWERS.
     */
    accept_multiple_sdp_answers: pj_bool_t;

    /**
     * Don't disconnect the INVITE session after an outgoing request
     * gets timed out or responded with 408 (request timeout).
     *
     * Default is PJ_FALSE.
     */
    keep_inv_after_tsx_timeout: pj_bool_t;

  };

  /** Transaction layer settings. */
  tsx: {

    /** Maximum number of transactions. The value is initialized with
     *  PJSIP_MAX_TSX_COUNT
     */
    max_count: unsigned;

    /* Timeout values: */

    /** Transaction T1 timeout, in msec. Default value is PJSIP_T1_TIMEOUT
     */
    t1: unsigned;

    /** Transaction T2 timeout, in msec. Default value is PJSIP_T2_TIMEOUT
     */
    t2: unsigned;

    /** Transaction completed timer for non-INVITE, in msec. Default value
     *  is PJSIP_T4_TIMEOUT
     */
    t4: unsigned;

    /** Transaction completed timer for INVITE, in msec. Default value is
     *  PJSIP_TD_TIMEOUT.
     *
     *  This setting is also used for transaction timeout timer for both
     *  INVITE and non-INVITE.
     */
    td: unsigned;

  };

  /* Dialog layer settings .. TODO */

  /** Client registration settings. */
  regc: {
    /**
     * Specify whether client registration should check for its
     * registered contact in Contact header of successful REGISTER
     * response to determine whether registration has been successful.
     * This setting may be disabled if non-compliant registrar is unable
     * to return correct Contact header.
     *
     * Default is PJSIP_REGISTER_CLIENT_CHECK_CONTACT
     */
    check_contact: pj_bool_t;

    /**
     * Specify whether client registration should add "x-uid" extension
     * parameter in all Contact URIs that it registers to assist the
     * matching of Contact URIs in the 200/OK REGISTER response, in
     * case the registrar is unable to return exact Contact URI in the
     * 200/OK response.
     *
     * Default is PJSIP_REGISTER_CLIENT_ADD_XUID_PARAM.
     */
    add_xuid_param: pj_bool_t;

  };

  /** TCP transport settings */
  tcp: {
    /**
     * Set the interval to send keep-alive packet for TCP transports.
     * If the value is zero, keep-alive will be disabled for TCP.
     *
     * Default is PJSIP_TCP_KEEP_ALIVE_INTERVAL.
     */
    keep_alive_interval: long;

  };

  /** TLS transport settings */
  tls: {
    /**
     * Set the interval to send keep-alive packet for TLS transports.
     * If the value is zero, keep-alive will be disabled for TLS.
     *
     * Default is PJSIP_TLS_KEEP_ALIVE_INTERVAL.
     */
    keep_alive_interval: long;

  };

}

