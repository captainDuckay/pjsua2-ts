/**
 * Account registration config. This will be specified in AccountConfig.
 */
import { AuthCredInfo, SipHeaderVector, SipRxData, SipTxOption, TransportConfig } from "./SIPTypes";
import {
  pjsua_100rel_use,
  pjsua_acc_config,
  pjsua_acc_id,
  pjsua_acc_info, pjsua_call_hold_type,
  pjsua_ipv6_use,
  pjsua_media_config, pjsua_nat64_opt, pjsua_sip_timer_use,
  pjsua_srtp_opt, pjsua_stun_use
} from "../pjsua-lib/pjsua";
import { Buddy, BuddyVector, BuddyVector2, PresenceStatus } from "./presence";
import { pjsip_status_code } from "../pjsip/sip_msg";
import { ContainerNode } from "./persistant";
import { Token, TransportId } from './types'
import { pjsip_evsub_state } from '../pjsip-simple/evsub'
import { pj_status_t } from '../pjsip/c_types_to_ts'

export interface AccountRegConfig {
  /**
   * This is the URL to be put in the request URI for the registration,
   * and will look something like "sip:serviceprovider".
   *
   * This field should be specified if registration is desired. If the
   * value is empty, no account registration will be performed.
   */
  registrarUri: string;

  /**
   * Specify whether the account should register as soon as it is
   * added to the UA. Application can set this to PJ_FALSE and control
   * the registration manually with pjsua_acc_set_registration().
   *
   * Default: True
   */
  registerOnAdd: boolean;

  /**
   * The optional custom SIP headers to be put in the registration
   * request.
   */
  headers: SipHeaderVector;

  /**
   * Additional parameters that will be appended in the Contact header
   * of the registration requests. This will be appended after
   * \a AccountSipConfig.contactParams;
   *
   * The parameters should be preceeded by semicolon, and all strings must
   * be properly escaped. Example:
   *   ";my-param=X;another-param=Hi%20there"
   */
  contactParams: string;

  /**
   * Additional parameters that will be appended in the Contact URI
   * of the registration requests. This will be appended after
   * \a AccountSipConfig.contactUriParams;
   *
   * The parameters should be preceeded by semicolon, and all strings must
   * be properly escaped. Example:
   *   ";my-param=X;another-param=Hi%20there"
   */
  contactUriParams: string;

  /**
   * Optional interval for registration, in seconds. If the value is zero,
   * default interval will be used (PJSUA_REG_INTERVAL, 300 seconds).
   */
  timeoutSec: number;

  /**
   * Specify interval of auto registration retry upon registration failure
   * (including caused by transport problem), in second. Set to 0 to
   * disable auto re-registration. Note that if the registration retry
   * occurs because of transport failure, the first retry will be done
   * after \a firstRetryIntervalSec seconds instead. Also note that
   * the interval will be randomized slightly by some seconds (specified
   * in \a reg_retry_random_interval) to avoid all clients re-registering
   * at the same time.
   *
   * See also \a firstRetryIntervalSec and \a randomRetryIntervalSec
   * settings.
   *
   * Default: PJSUA_REG_RETRY_INTERVAL
   */
  retryIntervalSec: number;

  /**
   * This specifies the interval for the first registration retry. The
   * registration retry is explained in \a retryIntervalSec. Note that
   * the value here will also be randomized by some seconds (specified
   * in \a reg_retry_random_interval) to avoid all clients re-registering
   * at the same time.
   *
   * See also \a retryIntervalSec and \a randomRetryIntervalSec settings.
   *
   * Default: 0
   */
  firstRetryIntervalSec: number;

  /**
   * This specifies maximum randomized value to be added/substracted
   * to/from the registration retry interval specified in \a
   * reg_retry_interval and \a reg_first_retry_interval, in second.
   * This is useful to avoid all clients re-registering at the same time.
   * For example, if the registration retry interval is set to 100 seconds
   * and this is set to 10 seconds, the actual registration retry interval
   * will be in the range of 90 to 110 seconds.
   *
   * See also \a retryIntervalSec and \a firstRetryIntervalSec settings.
   *
   * Default: 10
   */
  randomRetryIntervalSec: number;

  /**
   * Specify the number of seconds to refresh the client registration
   * before the registration expires.
   *
   * Default: PJSIP_REGISTER_CLIENT_DELAY_BEFORE_REFRESH, 5 seconds
   */
  delayBeforeRefreshSec: number;

  /**
   * Specify whether calls of the configured account should be dropped
   * after registration failure and an attempt of re-registration has
   * also failed.
   *
   * Default: FALSE (disabled)
   */
  dropCallsOnFail: boolean;

  /**
   * Specify the maximum time to wait for unregistration requests to
   * complete during library shutdown sequence.
   *
   * Default: PJSUA_UNREG_TIMEOUT
   */
  unregWaitMsec: number;

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
  proxyUse: number;

}

/** Array of SIP credentials */
export type AuthCredInfoVector = AuthCredInfo[];

/**
 * Various SIP settings for the account. This will be specified in
 * AccountConfig.
 */
export interface AccountSipConfig {
  /**
   * Array of credentials. If registration is desired, normally there should
   * be at least one credential specified, to successfully authenticate
   * against the service provider. More credentials can be specified, for
   * example when the requests are expected to be challenged by the
   * proxies in the route set.
   */
  authCreds: AuthCredInfoVector;

  /**
   * Array of proxy servers to visit for outgoing requests. Each of the
   * entry is translated into one Route URI.
   */
  proxies: string[];

  /**
   * Optional URI to be put as Contact for this account. It is recommended
   * that this field is left empty, so that the value will be calculated
   * automatically based on the transport address.
   */
  contactForced: string;

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
  contactParams: string;

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
  contactUriParams: string;

  /**
   * If this flag is set, the authentication client framework will
   * send an empty Authorization header in each initial request.
   * Default is no.
   */
  authInitialEmpty: boolean;

  /**
   * Specify the algorithm to use when empty Authorization header
   * is to be sent for each initial request (see above)
   */
  authInitialAlgorithm: string;

  /**
   * Optionally bind this account to specific transport. This normally is
   * not a good idea, as account should be able to send requests using
   * any available transports according to the destination. But some
   * application may want to have explicit control over the transport to
   * use, so in that case it can set this field.
   *
   * Default: -1 (PJSUA_INVALID_ID)
   *
   * @see Account::setTransport()
   */
  transportId: TransportId;

}

/**
 * Account's call settings. This will be specified in AccountConfig.
 */
export interface AccountCallConfig {
  /**
   * Specify how to offer call hold to remote peer. Please see the
   * documentation on pjsua_call_hold_type for more info.
   *
   * Default: PJSUA_CALL_HOLD_TYPE_DEFAULT
   */
  holdType: pjsua_call_hold_type;

  /**
   * Specify how support for reliable provisional response (100rel/
   * PRACK) should be used for all sessions in this account. See the
   * documentation of pjsua_100rel_use enumeration for more info.
   *
   * Default: PJSUA_100REL_NOT_USED
   */
  prackUse: pjsua_100rel_use;

  /**
   * Specify the usage of Session Timers for all sessions. See the
   * pjsua_sip_timer_use for possible values.
   *
   * Default: PJSUA_SIP_TIMER_OPTIONAL
   */
  timerUse: pjsua_sip_timer_use;

  /**
   * Specify minimum Session Timer expiration period, in seconds.
   * Must not be lower than 90. Default is 90.
   */
  timerMinSESec: number;

  /**
   * Specify Session Timer expiration period, in seconds.
   * Must not be lower than timerMinSE. Default is 1800.
   */
  timerSessExpiresSec: number;

}

/**
 * Account presence config. This will be specified in AccountConfig.
 */
export interface AccountPresConfig {
  /**
   * The optional custom SIP headers to be put in the presence
   * subscription request.
   */
  headers: SipHeaderVector;

  /**
   * If this flag is set, the presence information of this account will
   * be PUBLISH-ed to the server where the account belongs.
   *
   * Default: PJ_FALSE
   */
  publishEnabled: boolean;

  /**
   * Specify whether the client publication session should queue the
   * PUBLISH request should there be another PUBLISH transaction still
   * pending. If this is set to false, the client will return error
   * on the PUBLISH request if there is another PUBLISH transaction still
   * in progress.
   *
   * Default: PJSIP_PUBLISHC_QUEUE_REQUEST (TRUE)
   */
  publishQueue: boolean;

  /**
   * Maximum time to wait for unpublication transaction(s) to complete
   * during shutdown process, before sending unregistration. The library
   * tries to wait for the unpublication (un-PUBLISH) to complete before
   * sending REGISTER request to unregister the account, during library
   * shutdown process. If the value is set too short, it is possible that
   * the unregistration is sent before unpublication completes, causing
   * unpublication request to fail.
   *
   * Value is in milliseconds.
   *
   * Default: PJSUA_UNPUBLISH_MAX_WAIT_TIME_MSEC (2000)
   */
  publishShutdownWaitMsec: number;

  /**
   * Optional PIDF tuple ID for outgoing PUBLISH and NOTIFY. If this value
   * is not specified, a random string will be used.
   */
  pidfTupleId: string;

}

/**
 * Account MWI (Message Waiting Indication) settings. This will be specified
 * in AccountConfig.
 */
export interface AccountMwiConfig {
  /**
   * Subscribe to message waiting indication events (RFC 3842).
   *
   * See also UaConfig.mwiUnsolicitedEnabled setting.
   *
   * Default: FALSE
   */
  enabled: boolean;

  /**
   * Specify the default expiration time (in seconds) for Message
   * Waiting Indication (RFC 3842) event subscription. This must not
   * be zero.
   *
   * Default: PJSIP_MWI_DEFAULT_EXPIRES (3600)
   */
  expirationSec: number;

}

/**
 * Account's NAT (Network Address Translation) settings. This will be
 * specified in AccountConfig.
 */
export interface AccountNatConfig {
  /**
   * Control the use of STUN for the SIP signaling.
   *
   * Default: PJSUA_STUN_USE_DEFAULT
   */
  sipStunUse: pjsua_stun_use;

  /**
   * Control the use of STUN for the media transports.
   *
   * Default: PJSUA_STUN_USE_DEFAULT
   */
  mediaStunUse: pjsua_stun_use;

  /**
   * Specify NAT64 options.
   *
   * Default: PJSUA_NAT64_DISABLED
   */
  nat64Opt: pjsua_nat64_opt;

  /**
   * Enable ICE for the media transport.
   *
   * Default: False
   */
  iceEnabled: boolean;

  /**
   * Set trickle ICE mode for ICE media transport.
   *
   * Default: PJ_ICE_SESS_TRICKLE_DISABLED
   */
  iceTrickle: pj_ice_sess_trickle;

  /**
   * Set the maximum number of ICE host candidates.
   *
   * Default: -1 (maximum not set)
   */
  iceMaxHostCands: number;

  /**
   * Specify whether to use aggressive nomination.
   *
   * Default: True
   */
  iceAggressiveNomination: boolean;

  /**
   * For controlling agent if it uses regular nomination, specify the delay
   * to perform nominated check (connectivity check with USE-CANDIDATE
   * attribute) after all components have a valid pair.
   *
   * Default value is PJ_ICE_NOMINATED_CHECK_DELAY.
   */
  iceNominatedCheckDelayMsec: number;

  /**
   * For a controlled agent, specify how long it wants to wait (in
   * milliseconds) for the controlling agent to complete sending
   * connectivity check with nominated flag set to true for all components
   * after the controlled agent has found that all connectivity checks in
   * its checklist have been completed and there is at least one successful
   * (but not nominated) check for every component.
   *
   * Default value for this option is
   * ICE_CONTROLLED_AGENT_WAIT_NOMINATION_TIMEOUT. Specify -1 to disable
   * this timer.
   */
  iceWaitNominationTimeoutMsec: number;

  /**
   * Disable RTCP component.
   *
   * Default: False
   */
  iceNoRtcp: boolean;

  /**
   * Always send re-INVITE/UPDATE after ICE negotiation regardless of whether
   * the default ICE transport address is changed or not. When this is set
   * to False, re-INVITE/UPDATE will be sent only when the default ICE
   * transport address is changed.
   *
   * Default: yes
   */
  iceAlwaysUpdate: boolean;

  /**
   * Enable TURN candidate in ICE.
   */
  turnEnabled: boolean;

  /**
   * Specify TURN domain name or host name, in in "DOMAIN:PORT" or
   * "HOST:PORT" format.
   */
  turnServer: string;

  /**
   * Specify the connection type to be used to the TURN server. Valid
   * values are PJ_TURN_TP_UDP or PJ_TURN_TP_TCP.
   *
   * Default: PJ_TURN_TP_UDP
   */
  turnConnType: pj_turn_tp_type;

  /**
   * Specify the username to authenticate with the TURN server.
   */
  turnUserName: string;

  /**
   * Specify the type of password. Currently this must be zero to
   * indicate plain-text password will be used in the password.
   */
  turnPasswordType: number;

  /**
   * Specify the password to authenticate with the TURN server.
   */
  turnPassword: string;

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
   * See also contactRewriteMethod field.
   *
   * Default: 1 (PJ_TRUE / yes)
   */
  contactRewriteUse: number;

  /**
   * Specify how Contact update will be done with the registration, if
   * \a contactRewriteEnabled is enabled. The value is bitmask combination of
   * \a pjsua_contact_rewrite_method. See also pjsua_contact_rewrite_method.
   *
   * Value PJSUA_CONTACT_REWRITE_UNREGISTER(1) is the legacy behavior.
   *
   * Default value: PJSUA_CONTACT_REWRITE_METHOD
   *   (PJSUA_CONTACT_REWRITE_NO_UNREG | PJSUA_CONTACT_REWRITE_ALWAYS_UPDATE)
   */
  contactRewriteMethod: number;

  /**
   * Specify if source TCP port should be used as the initial Contact
   * address if TCP/TLS transport is used. Note that this feature will
   * be automatically turned off when nameserver is configured because
   * it may yield different destination address due to DNS SRV resolution.
   * Also some platforms are unable to report the local address of the
   * TCP socket when it is still connecting. In these cases, this
   * feature will also be turned off.
   *
   * Default: 1 (PJ_TRUE / yes).
   */
  contactUseSrcPort: number;

  /**
   * This option is used to overwrite the "sent-by" field of the Via header
   * for outgoing messages with the same interface address as the one in
   * the REGISTER request, as long as the request uses the same transport
   * instance as the previous REGISTER request.
   *
   * Default: 1 (PJ_TRUE / yes)
   */
  viaRewriteUse: number;

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
  sdpNatRewriteUse: number;

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
   * Default: 1 (PJ_TRUE / yes)
   */
  sipOutboundUse: number;

  /**
   * Specify SIP outbound (RFC 5626) instance ID to be used by this
   * account. If empty, an instance ID will be generated based on
   * the hostname of this agent. If application specifies this parameter, the
   * value will look like "<urn:uuid:00000000-0000-1000-8000-AABBCCDDEEFF>"
   * without the double-quotes.
   *
   * Default: empty
   */
  sipOutboundInstanceId: string;

  /**
   * Specify SIP outbound (RFC 5626) registration ID. The default value
   * is empty, which would cause the library to automatically generate
   * a suitable value.
   *
   * Default: empty
   */
  sipOutboundRegId: string;

  /**
   * Set the interval for periodic keep-alive transmission for this account.
   * If this value is zero, keep-alive will be disabled for this account.
   * The keep-alive transmission will be sent to the registrar's address,
   * after successful registration.
   *
   * Default: 15 (seconds)
   */
  udpKaIntervalSec: number;

  /**
   * Specify the data to be transmitted as keep-alive packets.
   *
   * Default: CR-LF
   */
  udpKaData: string;

}

/**
 * SRTP crypto.
 */
export interface SrtpCrypto {
  /**
   * Optional key. If empty, a random key will be autogenerated.
   */
  key: string;

  /**
   * Crypto name.
   */
  name: string;

  /**
   * Flags, bitmask from #pjmedia_srtp_crypto_option
   */
  flags: number;

  /**
   * Convert from pjsip
   */
  fromPj (prm: pjmedia_srtp_crypto);

  /**
   * Convert to pjsip
   */
  toPj (): pjmedia_srtp_crypto;
}

/* Array of SRTP cryptos. */
export type SrtpCryptoVector = SrtpCrypto[];

/**
 * SRTP settings.
 */
export interface SrtpOpt {
  /**
   * Specify SRTP cryptos. If empty, all crypto will be enabled.
   * Available crypto can be enumerated using Endpoint::srtpCryptoEnum().
   *
   * Default: empty.
   */
  cryptos: SrtpCryptoVector;

  /**
   * Specify SRTP keying methods, valid keying method is defined in
   * pjmedia_srtp_keying_method. If empty, all keying methods will be
   * enabled with priority order: SDES, DTLS-SRTP.
   *
   * Default: empty.
   */
  keyings: number[];

  /**
   * Convert from pjsip
   */
  fromPj (prm: pjsua_srtp_opt);

  /**
   * Convert to pjsip
   */
  toPj (): pjsua_srtp_opt;

}

/**
 * RTCP Feedback capability.
 */
export interface RtcpFbCap {
  /**
   * Specify the codecs to which the capability is applicable. Codec ID is
   * using the same format as in pjmedia_codec_mgr_find_codecs_by_id() and
   * pjmedia_vid_codec_mgr_find_codecs_by_id(), e.g: "L16/8000/1", "PCMU",
   * "H264". This can also be an asterisk ("*") to represent all codecs.
   */
  codecId: string;

  /**
   * Specify the RTCP Feedback type.
   */
  type: pjmedia_rtcp_fb_type;

  /**
   * Specify the type name if RTCP Feedback type is PJMEDIA_RTCP_FB_OTHER.
   */
  typeName: string;

  /**
   * Specify the RTCP Feedback parameters.
   */
  param: string;

  /**
   * Convert from pjsip
   */
  fromPj (prm: pjmedia_rtcp_fb_cap);

  /**
   * Convert to pjsip
   */
  toPj (): pjmedia_rtcp_fb_cap;
}

/* Array of RTCP Feedback capabilities. */
export type RtcpFbCapVector = RtcpFbCap[];

/**
 * RTCP Feedback settings.
 */
export interface RtcpFbConfig {
  /**
   * Specify whether transport protocol in SDP media description uses
   * RTP/AVP instead of RTP/AVPF. Note that the standard mandates to signal
   * AVPF profile, but it may cause SDP negotiation failure when negotiating
   * with endpoints that does not support RTCP Feedback (including older
   * version of PJSIP).
   *
   * Default: false.
   */
  dontUseAvpf: boolean;

  /**
   * RTCP Feedback capabilities.
   */
  caps: RtcpFbCapVector;

  public:
  /**
   * Constructor.
   */
    RtcpFbConfig;

  ();

  /**
   * Convert from pjsip
   */
  fromPj (prm: pjmedia_rtcp_fb_setting);

  /**
   * Convert to pjsip
   */
  toPj (): pjmedia_rtcp_fb_setting;

}

/**
 * Account media config (applicable for both audio and video). This will be
 * specified in AccountConfig.
 */
export interface AccountMediaConfig {
  /**
   * Media transport (RTP) configuration.
   */
  transportConfig: TransportConfig;

  /**
   * If remote sends SDP answer containing more than one format or codec in
   * the media line, send re-INVITE or UPDATE with just one codec to lock
   * which codec to use.
   *
   * Default: True (Yes).
   */
  lockCodecEnabled: boolean;

  /**
   * Specify whether stream keep-alive and NAT hole punching with
   * non-codec-VAD mechanism (see PJMEDIA_STREAM_ENABLE_KA) is enabled
   * for this account.
   *
   * Default: False
   */
  streamKaEnabled: boolean;

  /**
   * Specify whether secure media transport should be used for this account.
   * Valid values are PJMEDIA_SRTP_DISABLED, PJMEDIA_SRTP_OPTIONAL, and
   * PJMEDIA_SRTP_MANDATORY.
   *
   * Default: PJSUA_DEFAULT_USE_SRTP
   */
  srtpUse: pjmedia_srtp_use;

  /**
   * Specify whether SRTP requires secure signaling to be used. This option
   * is only used when \a use_srtp option above is non-zero.
   *
   * Valid values are:
   *  0: SRTP does not require secure signaling
   *  1: SRTP requires secure transport such as TLS
   *  2: SRTP requires secure end-to-end transport (SIPS)
   *
   * Default: PJSUA_DEFAULT_SRTP_SECURE_SIGNALING
   */
  srtpSecureSignaling: number;

  /**
   * Specify SRTP settings, like cryptos and keying methods.
   */
  srtpOpt: SrtpOpt;

  /**
   * Specify whether IPv6 should be used on media. Default is not used.
   */
  ipv6Use: pjsua_ipv6_use;

  /**
   * Enable RTP and RTCP multiplexing.
   */
  rtcpMuxEnabled: boolean;

  /**
   * RTCP Feedback settings.
   */
  rtcpFbConfig: RtcpFbConfig;

}

/**
 * Account video config. This will be specified in AccountConfig.
 */
export interface AccountVideoConfig {
  /**
   * Specify whether incoming video should be shown to screen by default.
   * This applies to incoming call (INVITE), incoming re-INVITE, and
   * incoming UPDATE requests.
   *
   * Regardless of this setting, application can detect incoming video
   * by implementing \a on_call_media_state() callback and enumerating
   * the media stream(s) with pjsua_call_get_info(). Once incoming
   * video is recognised, application may retrieve the window associated
   * with the incoming video and show or hide it with
   * pjsua_vid_win_set_show().
   *
   * Default: False
   */
  autoShowIncoming: boolean;

  /**
   * Specify whether outgoing video should be activated by default when
   * making outgoing calls and/or when incoming video is detected. This
   * applies to incoming and outgoing calls, incoming re-INVITE, and
   * incoming UPDATE. If the setting is non-zero, outgoing video
   * transmission will be started as soon as response to these requests
   * is sent (or received).
   *
   * Regardless of the value of this setting, application can start and
   * stop outgoing video transmission with pjsua_call_set_vid_strm().
   *
   * Default: False
   */
  autoTransmitOutgoing: boolean;

  /**
   * Specify video window's flags. The value is a bitmask combination of
   * pjmedia_vid_dev_wnd_flag.
   *
   * Default: 0
   */
  windowFlags: number;

  /**
   * Specify the default capture device to be used by this account. If
   * vidOutAutoTransmit is enabled, this device will be used for
   * capturing video.
   *
   * Default: PJMEDIA_VID_DEFAULT_CAPTURE_DEV
   */
  defaultCaptureDevice: pjmedia_vid_dev_index;

  /**
   * Specify the default rendering device to be used by this account.
   *
   * Default: PJMEDIA_VID_DEFAULT_RENDER_DEV
   */
  defaultRenderDevice: pjmedia_vid_dev_index;

  /**
   * Rate control method.
   *
   * Default: PJMEDIA_VID_STREAM_RC_SIMPLE_BLOCKING.
   */
  rateControlMethod: pjmedia_vid_stream_rc_method;

  /**
   * Upstream/outgoing bandwidth. If this is set to zero, the video stream
   * will use codec maximum bitrate setting.
   *
   * Default: 0 (follow codec maximum bitrate).
   */
  rateControlBandwidth: number;

  /**
   * The number of keyframe to be sent after the stream is created.
   *
   * Default: PJMEDIA_VID_STREAM_START_KEYFRAME_CNT
   */
  startKeyframeCount: number;

  /**
   * The keyframe sending interval after the stream is created.
   *
   * Default: PJMEDIA_VID_STREAM_START_KEYFRAME_INTERVAL_MSEC
   */
  startKeyframeInterval: number;

}

/**
 * Account config specific to IP address change.
 */
export interface AccountIpChangeConfig {
  /**
   * Shutdown the transport used for account registration. If this is set to
   * PJ_TRUE, the transport will be shutdown altough it's used by multiple
   * account. Shutdown transport will be followed by re-Registration if
   * AccountConfig.natConfig.contactRewriteUse is enabled.
   *
   * Default: true
   */
  shutdownTp: boolean;

  /**
   * Hangup active calls associated with the acount. If this is set to true,
   * then the calls will be hang up.
   *
   * Default: false
   */
  hangupCalls: boolean;

  /**
   * Specify the call flags used in the re-INVITE when \a hangupCalls is set
   * to false. If this is set to 0, no re-INVITE will be sent. The
   * re-INVITE will be sent after re-Registration is finished.
   *
   * Default: PJSUA_CALL_REINIT_MEDIA | PJSUA_CALL_UPDATE_CONTACT |
   *          PJSUA_CALL_UPDATE_VIA
   */
  reinviteFlags: number;

}

/**
 * Account configuration.
 */
export interface AccountConfig {
  /**
   * Account priority, which is used to control the order of matching
   * incoming/outgoing requests. The higher the number means the higher
   * the priority is, and the account will be matched first.
   */
  priority: number;

  /**
   * The Address of Record or AOR, that is full SIP URL that identifies the
   * account. The value can take name address or URL format, and will look
   * something like "sip:account@serviceprovider".
   *
   * This field is mandatory.
   */
  idUri: string;

  /**
   * Registration settings.
   */
  regConfig: AccountRegConfig;

  /**
   * SIP settings.
   */
  sipConfig: AccountSipConfig;

  /**
   * Call settings.
   */
  callConfig: AccountCallConfig;

  /**
   * Presence settings.
   */
  presConfig: AccountPresConfig;

  /**
   * MWI (Message Waiting Indication) settings.
   */
  mwiConfig: AccountMwiConfig;

  /**
   * NAT settings.
   */
  natConfig: AccountNatConfig;

  /**
   * Media settings (applicable for both audio and video).
   */
  mediaConfig: AccountMediaConfig;

  /**
   * Video settings.
   */
  videoConfig: AccountVideoConfig;

  /**
   * IP Change settings.
   */
  ipChangeConfig: AccountIpChangeConfig;

  /**
   * This will return a temporary pjsua_acc_config instance, which contents
   * are only valid as long as this AccountConfig structure remains valid
   * AND no modifications are done to it AND no further toPj() function call
   * is made. Any call to toPj() function will invalidate the content of
   * temporary pjsua_acc_config that was returned by the previous call.
   */
  toPj (cfg: pjsua_acc_config);

  /**
   * Initialize from pjsip.
   */
  fromPj (prm: pjsua_acc_config, mcfg: pjsua_media_config);

  /**
   * Read this object from a container node.
   *
   * @param node    Container to read values from.
   */
  readObject (node: ContainerNode);

  /**
   * Write this object to a container node.
   *
   * @param node    Container to write values to.
   */
  writeObject (node: ContainerNode);
}

/**
 * Account information. Application can query the account information
 * by calling Account::getInfo().
 */
export interface AccountInfo {
  /**
   * The account ID.
   */
  id: pjsua_acc_id;

  /**
   * Flag to indicate whether this is the default account.
   */
  isDefault: boolean;

  /**
   * Account URI
   */
  uri: string;

  /**
   * Flag to tell whether this account has registration setting
   * (reg_uri is not empty).
   */
  regIsConfigured: boolean;

  /**
   * Flag to tell whether this account is currently registered
   * (has active registration session).
   */
  regIsActive: boolean;

  /**
   * An up to date expiration interval for account registration session.
   */
  regExpiresSec: number;

  /**
   * Last registration status code. If status code is zero, the account
   * is currently not registered. Any other value indicates the SIP
   * status code of the registration.
   */
  regStatus: pjsip_status_code;

  /**
   * String describing the registration status.
   */
  regStatusText: string;

  /**
   * Last registration error code. When the status field contains a SIP
   * status code that indicates a registration failure, last registration
   * error code contains the error code that causes the failure. In any
   * other case, its value is zero.
   */
  regLastErr: pj_status_t;

  /**
   * Presence online status for this account.
   */
  onlineStatus: boolean;

  /**
   * Presence online status text.
   */
  onlineStatusText: string;

  /** Import from pjsip data */
  fromPj (pai: pjsua_acc_info);
}

/**
 * This structure contains parameters for onIncomingCall() account callback.
 */
export interface OnIncomingCallParam {
  /**
   * The library call ID allocated for the new call.
   */
  callId: number;

  /**
   * The incoming INVITE request.
   */
  rdata: SipRxData;
}

/**
 * This structure contains parameters for onRegStarted() account callback.
 */
export interface OnRegStartedParam {
  /**
   * True for registration and False for unregistration.
   */
  renew: boolean;
}

/**
 * This structure contains parameters for onRegState() account callback.
 */
export interface OnRegStateParam {
  /**
   * Registration operation status.
   */
  status: pj_status_t;

  /**
   * SIP status code received.
   */
  code: pjsip_status_code;

  /**
   * SIP reason phrase received.
   */
  reason: string;

  /**
   * The incoming message.
   */
  rdata: SipRxData;

  /**
   * Next expiration interval.
   */
  expiration: number;
}

/**
 * This structure contains parameters for onIncomingSubscribe() callback.
 */
export interface OnIncomingSubscribeParam {
  /**
   * Server presence subscription instance. If application delays
   * the acceptance of the request, it will need to specify this object
   * when calling Account::presNotify().
   */
  srvPres;

  /**
   *  Sender URI.
   */
  fromUri: string;

  /**
   * The incoming message.
   */
  rdata: SipRxData;

  /**
   * The status code to respond to the request. The default value is 200.
   * Application may set this to other final status code to accept or
   * reject the request.
   */
  code: pjsip_status_code;

  /**
   * The reason phrase to respond to the request.
   */
  reason: string;

  /**
   * Additional data to be sent with the response, if any.
   */
  txOption: SipTxOption;
}

/**
 * Parameters for onInstantMessage() account callback.
 */
export interface OnInstantMessageParam {
  /**
   * Sender From URI.
   */
  fromUri: string;

  /**
   * To URI of the request.
   */
  toUri: string;

  /**
   * Contact URI of the sender.
   */
  contactUri: string;

  /**
   * MIME type of the message body.
   */
  contentType: string;

  /**
   * The message body.
   */
  msgBody: string;

  /**
   * The whole message.
   */
  rdata: SipRxData;
}

/**
 * Parameters for onInstantMessageStatus() account callback.
 */
export interface OnInstantMessageStatusParam {
  /**
   * Token or a user data that was associated with the pager
   * transmission.
   */
  userData: Token;

  /**
   * Destination URI.
   */
  toUri: string;

  /**
   * The message body.
   */
  msgBody: string;

  /**
   * The SIP status code of the transaction.
   */
  code: pjsip_status_code;

  /**
   * The reason phrase of the transaction.
   */
  reason: string;

  /**
   * The incoming response that causes this callback to be called.
   * If the transaction fails because of time out or transport error,
   * the content will be empty.
   */
  rdata: SipRxData;
}

/**
 * Parameters for onTypingIndication() account callback.
 */
export interface OnTypingIndicationParam {
  /**
   * Sender/From URI.
   */
  fromUri: string;

  /**
   * To URI.
   */
  toUri: string;

  /**
   * The Contact URI.
   */
  contactUri: string;

  /**
   * Boolean to indicate if sender is typing.
   */
  isTyping: boolean;

  /**
   * The whole message buffer.
   */
  rdata: SipRxData;
}

/**
 * Parameters for onMwiInfo() account callback.
 */
export interface OnMwiInfoParam {
  /**
   * MWI subscription state.
   */
  state: pjsip_evsub_state;

  /**
   * The whole message buffer.
   */
  rdata: SipRxData;
}

/**
 * Parameters for presNotify() account method.
 */
export interface PresNotifyParam {
  /**
   * Server presence subscription instance.
   */
  srvPres;

  /**
   * Server presence subscription state to set.
   */
  state: pjsip_evsub_state;

  /**
   * Optionally specify the state string name, if state is not "active",
   * "pending", or "terminated".
   */
  stateStr: string;

  /**
   * If the new state is PJSIP_EVSUB_STATE_TERMINATED, optionally specify
   * the termination reason.
   */
  reason: string;

  /**
   * If the new state is PJSIP_EVSUB_STATE_TERMINATED, this specifies
   * whether the NOTIFY request should contain message body containing
   * account's presence information.
   */
  withBody: boolean;

  /**
   * Optional list of headers to be sent with the NOTIFY request.
   */
  txOption: SipTxOption;
}

/**
 * Wrapper class for Buddy matching algo.
 *
 * Default algo is a simple substring lookup of search-token in the
 * Buddy URIs, with case sensitive. Application can implement its own
 * matching algo by overriding this class and specifying its instance
 * in Account::findBuddy().
 */
export interface FindBuddyMatch {
  match (token: string, buddy: Buddy): boolean;

}

/**
 * Account.
 */
export interface Account {

  /**
   * Create the account.
   *
   * If application implements a derived class, the derived class should
   * call shutdown() in the beginning stage in its destructor, or
   * alternatively application should call shutdown() before deleting
   * the derived class instance. This is to avoid race condition between
   * the derived class destructor and Account callbacks.
   *
   * @param cfg    The account config.
   * @param make_default  Make this the default account.
   */
  create (cfg: AccountConfig, make_default: boolean);

  /**
   * Shutdown the account. This will initiate unregistration if needed,
   * and delete the corresponding account in the PJSUA-LIB.
   *
   * Note that application must delete all Buddy instances belong to this
   * account before shutting down the account.
   *
   * If application implements a derived class, the derived class should
   * call this method in the beginning stage in its destructor, or
   * alternatively application should call this method before deleting
   * the derived class instance. This is to avoid race condition between
   * the derived class destructor and Account callbacks.
   */
  shutdown ();

  /**
   * Modify the account to use the specified account configuration.
   * Depending on the changes, this may cause unregistration or
   * reregistration on the account.
   *
   * @param cfg    New account config to be applied to the
   *        account.
   */
  modify (cfg: AccountConfig);

  /**
   * Check if this account is still valid.
   *
   * @return      True if it is.
   */
  isValid (): boolean;

  /**
   * Set this as default account to be used when incoming and outgoing
   * requests don't match any accounts.
   */
  setDefault ();

  /**
   * Check if this account is the default account. Default account will be
   * used for incoming and outgoing requests that don't match any other
   * accounts.
   *
   * @return      True if this is the default account.
   */
  isDefault (): boolean;

  /**
   * Get PJSUA-LIB account ID or index associated with this account.
   *
   * @return      Integer greater than or equal to zero.
   */
  getId (): number;

  /**
   * Get the Account class for the specified account Id.
   *
   * @param acc_id    The account ID to lookup
   *
   * @return      The Account instance or NULL if not found.
   */
  lookup (acc_id: number): Account;

  /**
   * Get account info.
   *
   * @return      Account info.
   */
  getInfo (): AccountInfo;

  /**
   * Update registration or perform unregistration. Application normally
   * only needs to call this function if it wants to manually update the
   * registration or to unregister from the server.
   *
   * @param renew    If False, this will start unregistration
   *        process.
   */
  setRegistration (renew: boolean);

  /**
   * Set or modify account's presence online status to be advertised to
   * remote/presence subscribers. This would trigger the sending of
   * outgoing NOTIFY request if there are server side presence subscription
   * for this account, and/or outgoing PUBLISH if presence publication is
   * enabled for this account.
   *
   * @param pres_st    Presence online status.
   */
  setOnlineStatus (pres_st: PresenceStatus);

  /**
   * Lock/bind this account to a specific transport/listener. Normally
   * application shouldn't need to do this, as transports will be selected
   * automatically by the library according to the destination.
   *
   * When account is locked/bound to a specific transport, all outgoing
   * requests from this account will use the specified transport (this
   * includes SIP registration, dialog (call and event subscription), and
   * out-of-dialog requests such as MESSAGE).
   *
   * Note that transport id may be specified in AccountConfig too.
   *
   * @param tp_id    The transport ID.
   */
  setTransport (tp_id: TransportId);

  /**
   * Send NOTIFY to inform account presence status or to terminate server
   * side presence subscription. If application wants to reject the incoming
   * request, it should set the param \a PresNotifyParam.state to
   * PJSIP_EVSUB_STATE_TERMINATED.
   *
   * @param prm    The sending NOTIFY parameter.
   */
  presNotify (prm: PresNotifyParam);

  /**
   * Warning: deprecated, use enumBuddies2() instead. This function is not
   * safe in multithreaded environment.
   *
   * Enumerate all buddies of the account.
   *
   * @return      The buddy list.
   */
  enumBuddies (): BuddyVector;

  /**
   * Enumerate all buddies of the account.
   *
   * @return      The buddy list.
   */
  enumBuddies2 (): BuddyVector2;

  /**
   * Warning: deprecated, use findBuddy2 instead. This function is not
   * safe in multithreaded environment.
   *
   * Find a buddy in the buddy list with the specified URI.
   *
   * Exception: if buddy is not found, PJ_ENOTFOUND will be thrown.
   *
   * @param uri    The buddy URI.
   * @param buddy_match  The buddy match algo.
   *
   * @return      The pointer to buddy.
   */
  findBuddy (uri: string, buddy_match: FindBuddyMatch): Buddy;

  /**
   * Find a buddy in the buddy list with the specified URI.
   *
   * Exception: if buddy is not found, PJ_ENOTFOUND will be thrown.
   *
   * @param uri    The buddy URI.
   *
   * @return      The pointer to buddy.
   */
  findBuddy2 (uri: string): Buddy;

  onIncomingCall (prm: OnIncomingCallParam);

  /**
   * Notify application when registration or unregistration has been
   * initiated. Note that this only notifies the initial registration
   * and unregistration. Once registration session is active, subsequent
   * refresh will not cause this callback to be called.
   *
   * @param prm      Callback parameter.
   */
  onRegStarted (prm: OnRegStartedParam);

  /**
   * Notify application when registration status has changed.
   * Application may then query the account info to get the
   * registration details.
   *
   * @param prm      Callback parameter.
   */
  onRegState (prm: OnRegStateParam);

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
   *    final response in the IncomingSubscribeParam.code parameter.
   *  - it may immediately accept the request by specifying 200 as the
   *    IncomingSubscribeParam.code parameter. This is the default value if
   *    application doesn't set any value to the IncomingSubscribeParam.code
   *    parameter. In this case, the library will automatically send NOTIFY
   *    request upon returning from this callback.
   *  - it may delay the processing of the request, for example to request
   *    user permission whether to accept or reject the request. In this
   *    case, the application MUST set the IncomingSubscribeParam.code
   *    argument to 202, then IMMEDIATELY calls presNotify() with
   *    state PJSIP_EVSUB_STATE_PENDING and later calls presNotify()
   *    again to accept or reject the subscription request.
   *
   * Any IncomingSubscribeParam.code other than 200 and 202 will be treated
   * as 200.
   *
   * Application MUST return from this callback immediately (e.g. it must
   * not block in this callback while waiting for user confirmation).
   *
   * @param prm      Callback parameter.
   */
  onIncomingSubscribe (prm: OnIncomingSubscribeParam);

  /**
   * Notify application on incoming instant message or pager (i.e. MESSAGE
   * request) that was received outside call context.
   *
   * @param prm      Callback parameter.
   */
  onInstantMessage (prm: OnInstantMessageParam);

  /**
   * Notify application about the delivery status of outgoing pager/instant
   * message (i.e. MESSAGE) request.
   *
   * @param prm      Callback parameter.
   */
  onInstantMessageStatus (prm: OnInstantMessageStatusParam);

  /**
   * Notify application about typing indication.
   *
   * @param prm      Callback parameter.
   */
  onTypingIndication (prm: OnTypingIndicationParam);

  /**
   * Notification about MWI (Message Waiting Indication) status change.
   * This callback can be called upon the status change of the
   * SUBSCRIBE request (for example, 202/Accepted to SUBSCRIBE is received)
   * or when a NOTIFY reqeust is received.
   *
   * @param prm      Callback parameter.
   */
  onMwiInfo (prm: OnMwiInfoParam);

  /**
   * An internal function to add a Buddy to Account buddy list.
   * This method is used by Buddy::create().
   */
  addBuddy (buddy: Buddy);

  /**
   * An internal function to remove a Buddy from Account buddy list.
   * This method is used by Buddy::~Buddy().
   */
  removeBuddy (buddy: Buddy);

  id: pjsua_acc_id;
  tmpReason: string;	// for saving response's reason
  buddyList: BuddyVector;
}

