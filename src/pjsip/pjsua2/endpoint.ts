/**
 * Argument to Endpoint::onNatDetectionComplete() callback.
 */
import {
  pjsua_acc_id,
  pjsua_buddy_id,
  pjsua_call_id,
  pjsua_call_setting,
  pjsua_codec_info,
  pjsua_config,
  pjsua_dtmf_event,
  pjsua_dtmf_info,
  pjsua_ip_change_op_info,
  pjsua_ip_change_param,
  pjsua_logging_config,
  pjsua_med_tp_state_info, pjsua_media_config,
  pjsua_mwi_info,
  pjsua_on_stream_created_param,
  pjsua_on_stream_precreate_param,
  pjsua_reg_info
} from "../pjsua-lib/pjsua";
import {
  AudDevManager,
  AudioMedia, AudioMediaVector,
  AudioMediaVector2,
  CodecInfoVector,
  CodecInfoVector2, CodecOpusConfig,
  CodecParam, MediaEvent, VidCodecParam, VidDevManager,
  VideoMediaVector
} from "./media";
import { Account } from "./account";
import { SipRxData, TransportConfig, TransportInfo } from './SIPTypes'
import { pj_status_t, StringVector } from '../pjsip/c_types_to_ts'
import { pjsip_tls_state_info } from '../pjsip/sip_transport_tls'
import { pjsip_transport_state } from '../pjsip/sip_transport'
import { pjsip_transport_type_e } from '../pjsip/sip_types'

export interface OnNatDetectionCompleteParam {
  /**
   * Status of the detection process. If this value is not PJ_SUCCESS,
   * the detection has failed and \a nat_type field will contain
   * PJ_STUN_NAT_TYPE_UNKNOWN.
   */
  status: pj_status_t;

  /**
   * The text describing the status, if the status is not PJ_SUCCESS.
   */
  reason: string;

  /**
   * This contains the NAT type as detected by the detection procedure.
   * This value is only valid when the \a status is PJ_SUCCESS.
   */
  natType: pj_stun_nat_type;

  /**
   * Text describing that NAT type.
   */
  natTypeName: string;

}

/**
 * Argument to Endpoint::onNatCheckStunServersComplete() callback.
 */
export interface OnNatCheckStunServersCompleteParam {
  /**
   * Arbitrary user data that was passed to Endpoint::natCheckStunServers()
   * function.
   */
  userData: Token;

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
   * The server IP address and port in "IP:port" format. This will only
   * contain value if status is successful.
   */
  addr: SocketAddress;
}

/**
 * Parameter of Endpoint::onTimer() callback.
 */
export interface OnTimerParam {
  /**
   * Arbitrary user data that was passed to Endpoint::utilTimerSchedule()
   * function.
   */
  userData: Token;

  /**
   * The interval of this timer, in miliseconds.
   */
  msecDelay: number;
}

/**
 * SSL certificate type and name structure.
 */
export interface SslCertName {
  /**< Name type    */
  type: pj_ssl_cert_name_type;
  /**< The name    */
  name: string;

}

/** Array of SSL certificate type and name. */
export type SslCertNameVector = SslCertName[];

/**
 * SSL certificate information.
 */
export interface SslCertInfo {
  /**< Certificate version  */
  version: number;
  /**< Serial number, array
   of octets, first index
   is MSB      */
  serialNo: number[];
  /**< Subject common name  */
  subjectCn: string;
  /**< One line subject, fields
   are separated by slash, e.g:
   "CN=sample.org/OU=HRD" */
  subjectInfo: string;
  /**< Issuer common name  */
  issuerCn: string;
  /**< One line subject, fields
   are separated by slash */
  issuerInfo: string;
  /**< Validity start    */
  validityStart: TimeVal;
  /**< Validity end    */
  validityEnd: TimeVal;
  /**< Flag if validity
   date/time use GMT  */
  validityGmt: boolean;
  /**< Subject alternative
   name extension    */
  subjectAltName: SslCertNameVector;
  /**< Raw certificate in PEM
   format, only available
   for remote certificate */
  raw: string;

  /**
   * Constructor.
   */
  SslCertInfo ();

  /**
   * Check if the info is set with empty values.
   *
   * @return        True if the info is empty.
   */
  isEmpty (): boolean;

  /**
   * Convert from pjsip
   */
  fromPj (info: pj_ssl_cert_info);

  empty: boolean;
}

/**
 * TLS transport information.
 */
export interface TlsInfo {
  /**
   * Describes whether secure socket connection is established, i.e: TLS/SSL
   * handshaking has been done successfully.
   */
  established: boolean;

  /**
   * Describes secure socket protocol being used, see #pj_ssl_sock_proto.
   * Use bitwise OR operation to combine the protocol type.
   */
  protocol: number;

  /**
   * Describes cipher suite being used, this will only be set when connection
   * is established.
   */
  cipher: pj_ssl_cipher;

  /**
   * Describes cipher name being used, this will only be set when connection
   * is established.
   */
  cipherName: string;

  /**
   * Describes local address.
   */
  localAddr: SocketAddress;

  /**
   * Describes remote address.
   */
  remoteAddr: SocketAddress;

  /**
   * Describes active local certificate info. Use SslCertInfo.isEmpty()
   * to check if the local cert info is available.
   */
  localCertInfo: SslCertInfo;

  /**
   * Describes active remote certificate info. Use SslCertInfo.isEmpty()
   * to check if the remote cert info is available.
   */
  remoteCertInfo: SslCertInfo;

  /**
   * Status of peer certificate verification.
   */
  verifyStatus: number;

  /**
   * Error messages (if any) of peer certificate verification, based on
   * the field verifyStatus above.
   */
  verifyMsgs: StringVector;

  /**
   * Constructor.
   */
  TlsInfo ();

  /**
   * Check if the info is set with empty values.
   *
   * @return        True if the info is empty.
   */
  isEmpty (): boolean;

  /**
   * Convert from pjsip
   */
  fromPj (info: pjsip_tls_state_info);

  empty: boolean;
}

/**
 * Parameter of Endpoint::onTransportState() callback.
 */
export interface OnTransportStateParam {
  /**
   * The transport handle.
   */
  hnd: TransportHandle;

  /**
   * The transport type.
   */
  type: string;

  /**
   * Transport current state.
   */
  state: pjsip_transport_state;

  /**
   * The last error code related to the transport state.
   */
  lastError: pj_status_t;

  /**
   * TLS transport info, only used if transport type is TLS. Use
   * TlsInfo.isEmpty() to check if this info is available.
   */
  tlsInfo: TlsInfo;
}

/**
 * Parameter of Endpoint::onSelectAccount() callback.
 */
export interface OnSelectAccountParam {
  /**
   * The incoming request.
   */
  rdata: SipRxData;

  /**
   * The account index to be used to handle the request.
   * Upon entry, this will be filled by the account index
   * chosen by the library. Application may change it to
   * another value to use another account.
   */
  accountIndex: number;
}

/**
 * Parameter of Endpoint::handleIpChange().
 */
export interface IpChangeParam {
  /**
   * If set to PJ_TRUE, this will restart the transport listener.
   *
   * Default : PJ_TRUE
   */
  restartListener: boolean;

  /**
   * If \a restartListener is set to PJ_TRUE, some delay might be needed
   * for the listener to be restarted. Use this to set the delay.
   *
   * Default : PJSUA_TRANSPORT_RESTART_DELAY_TIME
   */
  restartLisDelay: number;

  /**
   * Constructor.
   */
  IpChangeParam ();

  /**
   * Export to pjsua_ip_change_param.
   */
  toPj (): pjsua_ip_change_param;

  /**
   * Convert from pjsip
   */
  fromPj (param: pjsua_ip_change_param);
}

/**
 * Information of Update contact on IP change progress.
 */
export interface RegProgressParam {
  /**
   * Indicate if this is a Register or Un-Register message.
   */
  isRegister: boolean;

  /**
   * SIP status code received.
   */
  code: number;
}

/**
 * Parameter of Endpoint::onIpChangeProgress().
 */
export interface OnIpChangeProgressParam {
  /**
   * The IP change progress operation.
   */
  op: pjsua_ip_change_op;

  /**
   * The operation progress status.
   */
  status: pj_status_t;

  /**
   * Information of the transport id. This is only available when the
   * operation is PJSUA_IP_CHANGE_OP_RESTART_LIS.
   */
  transportId: TransportId;

  /**
   * Information of the account id. This is only available when the
   * operation is:
   * - PJSUA_IP_CHANGE_OP_ACC_SHUTDOWN_TP
   * - PJSUA_IP_CHANGE_OP_ACC_UPDATE_CONTACT
   * - PJSUA_IP_CHANGE_OP_ACC_HANGUP_CALLS
   * - PJSUA_IP_CHANGE_OP_ACC_REINVITE_CALLS
   */
  accId: number;

  /**
   * Information of the call id. This is only available when the operation is
   * PJSUA_IP_CHANGE_OP_ACC_HANGUP_CALLS or
   * PJSUA_IP_CHANGE_OP_ACC_REINVITE_CALLS
   */
  callId: number;

  /**
   * Registration information. This is only available when the operation is
   * PJSUA_IP_CHANGE_OP_ACC_UPDATE_CONTACT
   */
  regInfo: RegProgressParam;
}

/**
 * Parameter of Endpoint::onCallMediaEvent() callback.
 */
export interface OnMediaEventParam {
  /**
   * The media event.
   */
  ev: MediaEvent;
}

//////////////////////////////////////////////////////////////////////////////
/**
 * SIP User Agent related settings.
 */
export interface UaConfig {
  /**
   * Maximum calls to support (default: 4). The value specified here
   * must be smaller than the compile time maximum settings
   * PJSUA_MAX_CALLS, which by default is 32. To increase this
   * limit, the library must be recompiled with new PJSUA_MAX_CALLS
   * value.
   */
  maxCalls: number;

  /**
   * Number of worker threads. Normally application will want to have at
   * least one worker thread, unless when it wants to poll the library
   * periodically, which in this case the worker thread can be set to
   * zero.
   */
  threadCnt: number;

  /**
   * When this flag is non-zero, all callbacks that come from thread
   * other than main thread will be posted to the main thread and
   * to be executed by Endpoint::libHandleEvents() function. This
   * includes the logging callback. Note that this will only work if
   * threadCnt is set to zero and Endpoint::libHandleEvents() is
   * performed by main thread. By default, the main thread is set
   * from the thread that invoke Endpoint::libCreate()
   *
   * Default: false
   */
  mainThreadOnly: boolean;

  /**
   * Array of nameservers to be used by the SIP resolver subsystem.
   * The order of the name server specifies the priority (first name
   * server will be used first, unless it is not reachable).
   */
  nameserver: StringVector;

  /**
   * Specify the URL of outbound proxies to visit for all outgoing requests.
   * The outbound proxies will be used for all accounts, and it will
   * be used to build the route set for outgoing requests. The final
   * route set for outgoing requests will consists of the outbound proxies
   * and the proxy configured in the account.
   */
  outboundProxies: StringVector;

  /**
   * Optional user agent string (default empty). If it's empty, no
   * User-Agent header will be sent with outgoing requests.
   */
  userAgent: string;

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
   * pj_gethostbyname() if it's not an IP address. Port number may be
   * specified if the server is not listening in standard STUN port.
   */
  stunServer: StringVector;

  /**
   * This specifies if the library should try to do an IPv6 resolution of
   * the STUN servers if the IPv4 resolution fails. It can be useful
   * in an IPv6-only environment, including on NAT64.
   *
   * Default: FALSE
   */
  stunTryIpv6: boolean;

  /**
   * This specifies if the library startup should ignore failure with the
   * STUN servers. If this is set to PJ_FALSE, the library will refuse to
   * start if it fails to resolve or contact any of the STUN servers.
   *
   * Default: TRUE
   */
  stunIgnoreFailure: boolean;

  /**
   * Support for adding and parsing NAT type in the SDP to assist
   * troubleshooting. The valid values are:
   *  - 0: no information will be added in SDP, and parsing is disabled.
   *  - 1: only the NAT type number is added.
   *  - 2: add both NAT type number and name.
   *
   * Default: 1
   */
  natTypeInSdp: number;

  /**
   * Handle unsolicited NOTIFY requests containing message waiting
   * indication (MWI) info. Unsolicited MWI is incoming NOTIFY requests
   * which are not requested by client with SUBSCRIBE request.
   *
   * If this is enabled, the library will respond 200/OK to the NOTIFY
   * request and forward the request to Endpoint::onMwiInfo() callback.
   *
   * See also AccountMwiConfig.enabled.
   *
   * Default: PJ_TRUE
   */
  mwiUnsolicitedEnabled: boolean;

  /**
   * Default constructor to initialize with default values.
   */
  UaConfig ();

  /**
   * Construct from pjsua_config.
   */
  fromPj (ua_cfg: pjsua_config);

  /**
   * Export to pjsua_config
   */
  pjsua_config;

  toPj ();

}

/**
 * Data containing log entry to be written by the LogWriter.
 */
export interface LogEntry {
  /** Log verbosity level of this message */
  level: number;

  /** The log message */
  msg: string;

  /** ID of current thread */
  threadId: number;

  /** The name of the thread that writes this log */
  threadName: string;
}

/**
 * Logging configuration, which can be (optionally) specified when calling
 * Lib::init().
 */
export interface LogConfig {
  /** Log incoming and outgoing SIP message? Yes!  */
  msgLogging: number;

  /** Input verbosity level. Value 5 is reasonable. */
  level: number;

  /** Verbosity level for console. Value 4 is reasonable. */
  consoleLevel: number;

  /** Log decoration. */
  decor: number;

  /** Optional log filename if app wishes the library to write to log file.
   */
  filename: string;

  /**
   * Additional flags to be given to pj_file_open() when opening
   * the log file. By default, the flag is PJ_O_WRONLY. Application
   * may set PJ_O_APPEND here so that logs are appended to existing
   * file instead of overwriting it.
   *
   * Default is 0.
   */
  fileFlags: number;

  /**
   * Custom log writer, if required. This instance will be destroyed
   * by the endpoint when the endpoint is destroyed.
   */
  writer: LogWriter;

  /** Default constructor initialises with default values */
  LogConfig ();

  /** Construct from pjsua_logging_config */
  fromPj (lc: pjsua_logging_config);

  /** Generate pjsua_logging_config. */
  toPj (): pjsua_logging_config;

}

/**
 * This structure describes media configuration, which will be specified
 * when calling Lib::init().
 */
export interface MediaConfig {

  /**
   * Clock rate to be applied to the conference bridge.
   * If value is zero, default clock rate will be used
   * (PJSUA_DEFAULT_CLOCK_RATE, which by default is 16KHz).
   */
  clockRate: number;

  /**
   * Clock rate to be applied when opening the sound device.
   * If value is zero, conference bridge clock rate will be used.
   */
  sndClockRate: number;

  /**
   * Channel count be applied when opening the sound device and
   * conference bridge.
   */
  channelCount: number;

  /**
   * Specify audio frame ptime. The value here will affect the
   * samples per frame of both the sound device and the conference
   * bridge. Specifying lower ptime will normally reduce the
   * latency.
   *
   * Default value: PJSUA_DEFAULT_AUDIO_FRAME_PTIME
   */
  audioFramePtime: number;

  /**
   * Specify maximum number of media ports to be created in the
   * conference bridge. Since all media terminate in the bridge
   * (calls, file player, file recorder, etc), the value must be
   * large enough to support all of them. However, the larger
   * the value, the more computations are performed.
   *
   * Default value: PJSUA_MAX_CONF_PORTS
   */
  maxMediaPorts: number;

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
  hasIoqueue: boolean;

  /**
   * Specify the number of worker threads to handle incoming RTP
   * packets. A value of one is recommended for most applications.
   */
  threadCnt: number;

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
  noVad: boolean;

  /**
   * iLBC mode (20 or 30).
   *
   * Default: 30 (PJSUA_DEFAULT_ILBC_MODE)
   */
  ilbcMode: number;

  /**
   * Percentage of RTP packet to drop in TX direction
   * (to simulate packet lost).
   *
   * Default: 0
   */
  txDropPct: number;

  /**
   * Percentage of RTP packet to drop in RX direction
   * (to simulate packet lost).
   *
   * Default: 0
   */
  rxDropPct: number;

  /**
   * Echo canceller options (see pjmedia_echo_create()).
   * Specify PJMEDIA_ECHO_USE_SW_ECHO here if application wishes
   * to use software echo canceller instead of device EC.
   *
   * Default: 0.
   */
  ecOptions: number;

  /**
   * Echo canceller tail length, in miliseconds. Setting this to zero
   * will disable echo cancellation.
   *
   * Default: PJSUA_DEFAULT_EC_TAIL_LEN
   */
  ecTailLen: number;

  /**
   * Audio capture buffer length, in milliseconds.
   *
   * Default: PJMEDIA_SND_DEFAULT_REC_LATENCY
   */
  sndRecLatency: number;

  /**
   * Audio playback buffer length, in milliseconds.
   *
   * Default: PJMEDIA_SND_DEFAULT_PLAY_LATENCY
   */
  sndPlayLatency: number;

  /**
   * Jitter buffer initial prefetch delay in msec. The value must be
   * between jb_min_pre and jb_max_pre below.
   *
   * Default: -1 (to use default stream settings, currently 150 msec)
   */
  jbInit: number;

  /**
   * Jitter buffer minimum prefetch delay in msec.
   *
   * Default: -1 (to use default stream settings, currently 60 msec)
   */
  jbMinPre: number;

  /**
   * Jitter buffer maximum prefetch delay in msec.
   *
   * Default: -1 (to use default stream settings, currently 240 msec)
   */
  jbMaxPre: number;

  /**
   * Set maximum delay that can be accomodated by the jitter buffer msec.
   *
   * Default: -1 (to use default stream settings, currently 360 msec)
   */
  jbMax: number;

  /**
   * Set the algorithm the jitter buffer uses to discard frames in order to
   * adjust the latency.
   *
   * Default: PJMEDIA_JB_DISCARD_PROGRESSIVE
   */
  jbDiscardAlgo: pjmedia_jb_discard_algo;

  /**
   * Specify idle time of sound device before it is automatically closed,
   * in seconds. Use value -1 to disable the auto-close feature of sound
   * device
   *
   * Default : 1
   */
  sndAutoCloseTime: number;

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
  vidPreviewEnableNative: boolean;

  /** Default constructor initialises with default values */
  MediaConfig ();

  /** Construct from pjsua_media_config. */
  fromPj (mc: pjsua_media_config)

  /** Export */
  toPj (): pjsua_media_config;

}

/**
 * Endpoint configuration
 */
export interface EpConfig
{
  /** UA config */
  uaConfig:UaConfig;

  /** Logging config */
  logConfig:LogConfig;

  /** Media config */
  medConfig:MediaConfig;

}

/* This represents posted job */
export interface PendingJob {
  /** Perform the job */
  execute (is_pending: boolean);

}

//////////////////////////////////////////////////////////////////////////////

/**
 * Endpoint represents an instance of pjsua library. There can only be
 * one instance of pjsua library in an application, hence this class
 * is a singleton.
 */
export interface Endpoint {

  /*************************************************************************
   * Base library operations
   */

  /**
   * Get library version.
   */
  libVersion (): Version;

  /**
   * Instantiate pjsua application. Application must call this function before
   * calling any other functions, to make sure that the underlying libraries
   * are properly initialized. Once this function has returned success,
   * application must call libDestroy() before quitting.
   */
  libCreate ();

  /**
   * Get library state.
   *
   * @return      library state.
   */
  libGetState (): pjsua_state;

  /**
   * Initialize pjsua with the specified settings. All the settings are
   * optional, and the default values will be used when the config is not
   * specified.
   *
   * Note that create() MUST be called before calling this function.
   *
   * @param prmEpConfig  Endpoint configurations
   */
  libInit (prmEpConfig: EpConfig);

  /**
   * Call this function after all initialization is done, so that the
   * library can do additional checking set up. Application may call this
   * function any time after init().
   */
  libStart ();

  /**
   * Register a thread that was created by external or native API to the
   * library. Note that each time this function is called, it will allocate
   * some memory to store the thread description, which will only be freed
   * when the library is destroyed.
   *
   * @param name  The optional name to be assigned to the thread.
   */
  libRegisterThread (name: string);

  /**
   * Check if this thread has been registered to the library. Note that
   * this function is only applicable for library main & worker threads and
   * external/native threads registered using libRegisterThread().
   */
  libIsThreadRegistered (): boolean;

  /**
   * Stop all worker threads.
   */
  libStopWorkerThreads ();

  /**
   * Poll pjsua for events, and if necessary block the caller thread for
   * the specified maximum interval (in miliseconds).
   *
   * Application doesn't normally need to call this function if it has
   * configured worker thread (\a thread_cnt field) in pjsua_config
   * structure, because polling then will be done by these worker threads
   * instead.
   *
   * If EpConfig::UaConfig::mainThreadOnly is enabled and this function
   * is called from the main thread (by default the main thread is thread
   * that calls libCreate()), this function will also scan and run any
   * pending jobs in the list.
   *
   * @param msec_timeout Maximum time to wait, in miliseconds.
   *
   * @return    The number of events that have been handled during the
   *          poll. Negative value indicates error, and application
   *          can retrieve the error as (status = -return_value).
   */
  libHandleEvents (msec_timeout: number): number;

  /**
   * Destroy pjsua. Application is recommended to perform graceful shutdown
   * before calling this function (such as unregister the account from the
   * SIP server, terminate presense subscription, and hangup active calls),
   * however, this function will do all of these if it finds there are
   * active sessions that need to be terminated. This function will
   * block for few seconds to wait for replies from remote.
   *
   * Application.may safely call this function more than once if it doesn't
   * keep track of it's state.
   *
   * @param prmFlags  Combination of pjsua_destroy_flag enumeration.
   */
  libDestroy (prmFlags: number);

  /*************************************************************************
   * Utilities
   */

  /**
   * Retrieve the error string for the specified status code.
   *
   * @param prmErr    The error code.
   */
  utilStrError (prmErr: pj_status_t): string;

  /**
   * Write a log message.
   *
   * @param prmLevel    Log verbosity level (1-5)
   * @param prmSender    The log sender.
   * @param prmMsg    The log message.
   */
  utilLogWrite (prmLevel: number, prmSender: string, prmMsg: string);

  /**
   * Write a log entry.
   * Application must implement its own custom LogWriter and
   * this function will then call the LogWriter::write() method.
   * Note that this function does not call PJSIP's internal
   * logging functionality. For that, you should use
   * utilLogWrite(prmLevel, prmSender, prmMsg) above.
   *
   * @param e      The log entry.
   */
  utilLogWrite (e: LogEntry);

  /**
   * This is a utility function to verify that valid SIP url is given. If the
   * URL is a valid SIP/SIPS scheme, PJ_SUCCESS will be returned.
   *
   * @param prmUri    The URL string.
   *
   * @return      PJ_SUCCESS on success, or the appropriate error
   *        code.
   *
   * @see utilVerifyUri()
   */
  utilVerifySipUri (prmUri: string): pj_status_t;

  /**
   * This is a utility function to verify that valid URI is given. Unlike
   * utilVerifySipUri(), this function will return PJ_SUCCESS if tel: URI
   * is given.
   *
   * @param prmUri    The URL string.
   *
   * @return      PJ_SUCCESS on success, or the appropriate error
   *        code.
   *
   * @see pjsua_verify_sip_url()
   */
  utilVerifyUri (prmUri: string): pj_status_t;

  /**
   * Schedule a timer with the specified interval and user data. When the
   * interval elapsed, onTimer() callback will be
   * called. Note that the callback may be executed by different thread,
   * depending on whether worker thread is enabled or not.
   *
   * @param prmMsecDelay  The time interval in msec.
   * @param prmUserData  Arbitrary user data, to be given back to
   *        application in the callback.
   *
   * @return      Token to identify the timer, which could be
   *        given to utilTimerCancel().
   */
  utilTimerSchedule (prmMsecDelay: number, prmUserData: Token): Token;

  /**
   * Cancel previously scheduled timer with the specified timer token.
   *
   * @param prmToken    The timer token, which was returned from
   *        previous utilTimerSchedule() call.
   */
  utilTimerCancel (prmToken: Token);

  /**
   * Utility to register a pending job to be executed by main thread.
   * If EpConfig::UaConfig::mainThreadOnly is false, the job will be
   * executed immediately.
   *
   * @param job    The job class.
   */
  utilAddPendingJob (job: PendingJob);

  /**
   * Get cipher list supported by SSL/TLS backend.
   */
  utilSslGetAvailableCiphers (): number[];

  /*************************************************************************
   * NAT operations
   */
  /**
   * This is a utility function to detect NAT type in front of this endpoint.
   * Once invoked successfully, this function will complete asynchronously
   * and report the result in onNatDetectionComplete().
   *
   * After NAT has been detected and the callback is called, application can
   * get the detected NAT type by calling natGetType(). Application
   * can also perform NAT detection by calling natDetectType()
   * again at later time.
   *
   * Note that STUN must be enabled to run this function successfully.
   */
  natDetectType ();

  /**
   * Get the NAT type as detected by natDetectType() function. This
   * function will only return useful NAT type after natDetectType()
   * has completed successfully and onNatDetectionComplete()
   * callback has been called.
   *
   * Exception: if this function is called while detection is in progress,
   * PJ_EPENDING exception will be raised.
   */
  natGetType (): pj_stun_nat_type;

  /**
   * Update the STUN servers list. The libInit() must have been called
   * before calling this function.
   *
   * @param prmServers  Array of STUN servers to try. The endpoint
   *        will try to resolve and contact each of the
   *        STUN server entry until it finds one that is
   *        usable. Each entry may be a domain name, host
   *        name, IP address, and it may contain an
   *        optional port number. For example:
   *        - "pjsip.org" (domain name)
   *        - "sip.pjsip.org" (host name)
   *        - "pjsip.org:33478" (domain name and a non-
   *           standard port number)
   *        - "10.0.0.1:3478" (IP address and port number)
   * @param prmWait    Specify if the function should block until
   *        it gets the result. In this case, the
   *        function will block while the resolution
   *        is being done, and the callback
   *        onNatCheckStunServersComplete() will be called
   *        before this function returns.
   *
   */
  natUpdateStunServers (prmServers: string[], prmWait: boolean);

  /**
   * Auxiliary function to resolve and contact each of the STUN server
   * entries (sequentially) to find which is usable. The libInit() must
   * have been called before calling this function.
   *
   * @param prmServers  Array of STUN servers to try. The endpoint
   *        will try to resolve and contact each of the
   *        STUN server entry until it finds one that is
   *        usable. Each entry may be a domain name, host
   *        name, IP address, and it may contain an
   *        optional port number. For example:
   *        - "pjsip.org" (domain name)
   *        - "sip.pjsip.org" (host name)
   *        - "pjsip.org:33478" (domain name and a non-
   *           standard port number)
   *        - "10.0.0.1:3478" (IP address and port number)
   * @param prmWait    Specify if the function should block until
   *        it gets the result. In this case, the function
   *        will block while the resolution is being done,
   *        and the callback will be called before this
   *        function returns.
   * @param prmUserData  Arbitrary user data to be passed back to
   *        application in the callback.
   *
   * @see natCancelCheckStunServers()
   */
  natCheckStunServers (prmServers: string[], prmWait: boolean, prmUserData: Token);

  /**
   * Cancel pending STUN resolution which match the specified token.
   *
   * @param token    The token to match. This token was given to
   *        natCheckStunServers()
   * @param notify_cb    Boolean to control whether the callback should
   *        be called for cancelled resolutions. When the
   *        callback is called, the status in the result
   *        will be set as PJ_ECANCELLED.
   *
   * Exception: PJ_ENOTFOUND if there is no matching one, or other error.
   */
  natCancelCheckStunServers (token: Token, notify_cb: boolean);

  /*************************************************************************
   * Transport operations
   */

  /**
   * Create and start a new SIP transport according to the specified
   * settings.
   *
   * @param type    Transport type.
   * @param cfg    Transport configuration.
   *
   * @return      The transport ID.
   */
  transportCreate (type: pjsip_transport_type_e, cfg: TransportConfig): TransportId;

  /**
   * Enumerate all transports currently created in the system. This
   * function will return all transport IDs, and application may then
   * call transportGetInfo() function to retrieve detailed information
   * about the transport.
   *
   * @return      Array of transport IDs.
   */
  transportEnum (): number[];

  /**
   * Get information about transport.
   *
   * @param id    Transport ID.
   *
   * @return      Transport info.
   */
  transportGetInfo (id: TransportId): TransportInfo;

  /**
   * Disable a transport or re-enable it. By default transport is always
   * enabled after it is created. Disabling a transport does not necessarily
   * close the socket, it will only discard incoming messages and prevent
   * the transport from being used to send outgoing messages.
   *
   * @param id    Transport ID.
   * @param enabled    Enable or disable the transport.
   *
   */
  transportSetEnable (id: TransportId, enabled: boolean);

  /**
   * Close the transport. The system will wait until all transactions are
   * closed while preventing new users from using the transport, and will
   * close the transport when its usage count reaches zero.
   *
   * @param id    Transport ID.
   */
  transportClose (id: TransportId);

  /**
   * Start graceful shutdown procedure for this transport handle. After
   * graceful shutdown has been initiated, no new reference can be
   * obtained for the transport. However, existing objects that currently
   * uses the transport may still use this transport to send and receive
   * packets. After all objects release their reference to this transport,
   * the transport will be destroyed immediately.
   *
   * Note: application normally uses this API after obtaining the handle
   * from onTransportState() callback.
   *
   * @param tp    The transport.
   */
  transportShutdown (tp: TransportHandle);

  /*************************************************************************
   * Call operations
   */

  /**
   * Terminate all calls. This will initiate call hangup for all
   * currently active calls.
   */
  hangupAllCalls ();

  /*************************************************************************
   * Media operations
   */

  /**
   * Add media to the media list.
   *
   * @param media  media to be added.
   */
  mediaAdd (media: AudioMedia);

  /**
   * Remove media from the media list.
   *
   * @param media  media to be removed.
   */
  mediaRemove (media: AudioMedia);

  /**
   * Check if media has been added to the media list.
   *
   * @param media  media to be check.
   *
   * @return    True if media has been added, false otherwise.
   */
  mediaExists (media: AudioMedia): boolean;

  /**
   * Get maximum number of media port.
   *
   * @return    Maximum number of media port in the conference bridge.
   */
  mediaMaxPorts (): number;

  /**
   * Get current number of active media port in the bridge.
   *
   * @return    The number of active media port.
   */
  mediaActivePorts (): number;

  /**
   * Warning: deprecated, use mediaEnumPorts2() instead. This function is
   * not safe in multithreaded environment.
   *
   * Enumerate all media port.
   *
   * @return    The list of media port.
   */
  mediaEnumPorts (): AudioMediaVector;

  /**
   * Enumerate all audio media port.
   *
   * @return    The list of audio media port.
   */
  mediaEnumPorts2 (): AudioMediaVector2;

  /**
   * Enumerate all video media port.
   *
   * @return    The list of video media port.
   */
  mediaEnumVidPorts (): VideoMediaVector;

  /**
   * Get the instance of Audio Device Manager.
   *
   * @return    The Audio Device Manager.
   */
  audDevManager (): AudDevManager;

  /**
   * Get the instance of Video Device Manager.
   *
   * @return    The Video Device Manager.
   */
  vidDevManager (): VidDevManager;

  /*************************************************************************
   * Codec management operations
   */

  /**
   * Warning: deprecated, use codecEnum2() instead. This function is not
   * safe in multithreaded environment.
   *
   * Enum all supported codecs in the system.
   *
   * @return    Array of codec info.
   */
  codecEnum (): CodecInfoVector;

  /**
   * Enum all supported codecs in the system.
   *
   * @return    Array of codec info.
   */
  codecEnum2 (): CodecInfoVector2;

  /**
   * Change codec priority.
   *
   * @param codec_id  Codec ID, which is a string that uniquely identify
   *      the codec (such as "speex/8000").
   * @param priority  Codec priority, 0-255, where zero means to disable
   *      the codec.
   *
   */
  codecSetPriority (codec_id: string, priority: number);

  /**
   * Get codec parameters.
   *
   * @param codec_id  Codec ID.
   *
   * @return    Codec parameters. If codec is not found, Error
   *      will be thrown.
   *
   */
  codecGetParam (codec_id: string): CodecParam;

  /**
   * Set codec parameters.
   *
   * @param codec_id  Codec ID.
   * @param param  Codec parameter to set. Set to NULL to reset
   *      codec parameter to library default settings.
   *
   */
  codecSetParam (codec_id: string, param: CodecParam);

  /**
   * Warning: deprecated, use videoCodecEnum2() instead. This function is
   * not safe in multithreaded environment.
   *
   * Enum all supported video codecs in the system.
   *
   * @return    Array of video codec info.
   */
  videoCodecEnum (): CodecInfoVector;

  /**
   * Enum all supported video codecs in the system.
   *
   * @return    Array of video codec info.
   */
  videoCodecEnum2 (): CodecInfoVector2;

  /**
   * Change video codec priority.
   *
   * @param codec_id  Codec ID, which is a string that uniquely identify
   *      the codec (such as "H263/90000"). Please see pjsua
   *      manual or pjmedia codec reference for details.
   * @param priority  Codec priority, 0-255, where zero means to disable
   *      the codec.
   *
   */
  videoCodecSetPriority (codec_id: string, priority: number);

  /**
   * Get video codec parameters.
   *
   * @param codec_id  Codec ID.
   *
   * @return    Codec parameters. If codec is not found, Error
   *      will be thrown.
   *
   */
  getVideoCodecParam (codec_id: string): VidCodecParam;

  /**
   * Set video codec parameters.
   *
   * @param codec_id  Codec ID.
   * @param param  Codec parameter to set.
   *
   */
  setVideoCodecParam (codec_id: string, param: VidCodecParam);

  /**
   * Reset video codec parameters to library default settings.
   *
   * @param codec_id  Codec ID.
   *
   */
  resetVideoCodecParam (codec_id: string);

  /**
   * Get codec Opus config.
   *
   */
  getCodecOpusConfig (): CodecOpusConfig;

  /**
   * Set codec Opus config.
   *
   * @param opus_cfg  Codec Opus configuration.
   *
   */
  setCodecOpusConfig (opus_cfg: CodecOpusConfig);

  /**
   * Enumerate all SRTP crypto-suite names.
   *
   * @return    The list of SRTP crypto-suite name.
   */
  srtpCryptoEnum (): string[];

  /*************************************************************************
   * IP Change
   */

  /**
   * Inform the stack that IP address change event was detected.
   * The stack will:
   * 1. Restart the listener (this step is configurable via
   *    \a IpChangeParam.restartListener).
   * 2. Shutdown the transport used by account registration (this step is
   *    configurable via \a AccountConfig.ipChangeConfig.shutdownTp).
   * 3. Update contact URI by sending re-Registration (this step is
   *    configurable via a\ AccountConfig.natConfig.contactRewriteUse and
   *    a\ AccountConfig.natConfig.contactRewriteMethod)
   * 4. Hangup active calls (this step is configurable via
   *    a\ AccountConfig.ipChangeConfig.hangupCalls) or
   *    continue the call by sending re-INVITE
   *    (configurable via \a AccountConfig.ipChangeConfig.reinviteFlags).
   *
   * @param param  The IP change parameter, have a look at #IpChangeParam.
   *
   * @return    PJ_SUCCESS on success, other on error.
   */
  handleIpChange (param: IpChangeParam);

  /*
   * Overrideables callbacks
   */

  /**
   * Callback when the Endpoint has finished performing NAT type
   * detection that is initiated with natDetectType().
   *
   * @param prm  Callback parameters containing the detection
   *      result.
   */
  onNatDetectionComplete (prm: OnNatDetectionCompleteParam);

  /**
   * Callback when the Endpoint has finished performing STUN server
   * checking that is initiated when calling libInit(), or by
   * calling natCheckStunServers() or natUpdateStunServers().
   *
   * @param prm  Callback parameters.
   */
  onNatCheckStunServersComplete (prm: OnNatCheckStunServersCompleteParam);

  /**
   * This callback is called when transport state has changed.
   *
   * @param prm  Callback parameters.
   */
  onTransportState (prm: OnTransportStateParam);

  /**
   * Callback when a timer has fired. The timer was scheduled by
   * utilTimerSchedule().
   *
   * @param prm  Callback parameters.
   */
  onTimer (prm: OnTimerParam);

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
   * @param prm  Callback parameters.
   */
  onSelectAccount (prm: OnSelectAccountParam);

  /**
   * Calling #handleIpChange() may involve different operation. This
   * callback is called to report the progress of each enabled operation.
   *
   * @param prm  Callback parameters.
   *
   */
  onIpChangeProgress (prm: OnIpChangeProgressParam);

  /**
   * Notification about media events such as video notifications. This
   * callback will most likely be called from media threads, thus
   * application must not perform heavy processing in this callback.
   * If application needs to perform more complex tasks to handle the
   * event, it should post the task to another thread.
   *
   * @param prm  Callback parameter.
   */
  onMediaEvent (prm: OnMediaEventParam);

  instance_: Endpoint;	// static instance
  writer: LogWriter;	// Custom writer, if any
  audioDevMgr: AudDevManager;
  videoDevMgr: VidDevManager;

  codecInfoList: CodecInfoVector;
  videoCodecInfoList: CodecInfoVector;

  threadDescMutex: pj_mutex_t;

  mediaList: AudioMediaVector;
  mediaListMutex: pj_mutex_t;

  /* Pending logging */
  mainThreadOnly: boolean;
  mainThread;
  pendingJobSize: number;
  pendingJobs;

  performPendingJobs ();

  /* Endpoint static callbacks */
  logFunc (level: number, data: string, len: number);

  stun_resolve_cb (result: pj_stun_resolve_result);

  on_timer (timer_heap: pj_timer_heap_t, entry: pj_timer_entry);

  on_nat_detect (res: pj_stun_nat_detect_result);

  on_transport_state (tp: pjsip_transport, state: pjsip_transport_state, info: pjsip_transport_state_info);

  /*
   * Account & Call lookups
   */
  lookupAcc (acc_id: pjsua_acc_id, op: string): Account;

  lookupCall (call_id: pjsua_call_id, op: string): Call;

  /* static callbacks */
  on_incoming_call (acc_id: pjsua_acc_id, call_id: pjsua_call_id, rdata: pjsip_rx_data);

  on_reg_started (acc_id: pjsua_acc_id, renew: pj_bool_t);

  on_reg_state2 (acc_id: pjsua_acc_id, info: pjsua_reg_info);

  on_incoming_subscribe (acc_id: pjsua_acc_id, srv_pres: pjsua_srv_pres, buddy_id: pjsua_buddy_id, from: pj_str_t, rdata: pjsip_rx_data, code: pjsip_status_code, reason: pj_str_t, msg_data: pjsua_msg_data);

  on_pager2 (call_id: pjsua_call_id, from: pj_str_t, to: pj_str_t, contact: pj_str_t, mime_type: pj_str_t, body: pj_str_t, rdata: pjsip_rx_data, acc_id: pjsua_acc_id);

  on_pager_status2 (call_id: pjsua_call_id, to: pj_str_t, body: pj_str_t, user_data, status: pjsip_status_code, reason: pj_str_t, tdata: pjsip_tx_data, rdata: pjsip_rx_data, acc_id: pjsua_acc_id);

  on_typing2 (call_id: pjsua_call_id, from: pj_str_t, to: pj_str_t, contact: pj_str_t, is_typing: pj_bool_t, rdata: pjsip_rx_data, acc_id: pjsua_acc_id);

  on_mwi_info (acc_id: pjsua_acc_id, mwi_info: pjsua_mwi_info);

  on_acc_find_for_incoming (rdata: pjsip_rx_data, acc_id: pjsua_acc_id);

  on_buddy_state (buddy_id: pjsua_buddy_id);

  on_buddy_evsub_state (buddy_id: pjsua_buddy_id, sub: pjsip_evsub, event: pjsip_event);

  // Call callbacks
  on_call_state (call_id: pjsua_call_id, e: pjsip_event);

  on_call_tsx_state (call_id: pjsua_call_id, tsx: pjsip_transaction, e: pjsip_event);

  on_call_media_state (call_id: pjsua_call_id);

  on_call_sdp_created (call_id: pjsua_call_id, sdp: pjmedia_sdp_session, pool: pj_pool_t, rem_sdp: pjmedia_sdp_session);

  on_stream_precreate (call_id: pjsua_call_id, param: pjsua_on_stream_precreate_param);

  on_stream_created2 (call_id: pjsua_call_id, param: pjsua_on_stream_created_param);

  on_stream_destroyed (call_id: pjsua_call_id, strm: pjmedia_stream, stream_idx: number);

  on_dtmf_digit (call_id: pjsua_call_id, digit: number);

  on_dtmf_digit2 (call_id: pjsua_call_id, info: pjsua_dtmf_info);

  on_dtmf_event (call_id: pjsua_call_id, event: pjsua_dtmf_event);

  on_call_transfer_request (call_id: pjsua_call_id, dst: pj_str_t, code: pjsip_status_code);

  on_call_transfer_request2 (call_id: pjsua_call_id, dst: pj_str_t, code: pjsip_status_code, opt: pjsua_call_setting);

  on_call_transfer_status (call_id: pjsua_call_id, st_code: number, st_text: pj_str_t, final: pj_bool_t, p_cont: pj_bool_t);

  on_call_replace_request (call_id: pjsua_call_id, rdata: pjsip_rx_data, st_code: number, st_text: pj_str_t);

  on_call_replace_request2 (call_id: pjsua_call_id, rdata: pjsip_rx_data, st_code: number, st_text: pj_str_t, opt: pjsua_call_setting);

  on_call_replaced (old_call_id: pjsua_call_id, new_call_id: pjsua_call_id);

  on_call_rx_offer (call_id: pjsua_call_id, offer: pjmedia_sdp_session, reserved, code: pjsip_status_code, opt: pjsua_call_setting);

  on_call_rx_reinvite (call_id: pjsua_call_id, offer: pjmedia_sdp_session, rdata: pjsip_rx_data, reserved, async: pj_bool_t, code: pjsip_status_code, opt: pjsua_call_setting);

  on_call_tx_offer (call_id: pjsua_call_id, reserved, opt: pjsua_call_setting);

  on_call_redirected (call_id: pjsua_call_id, target: pjsip_uri, e: pjsip_event): pjsip_redirect_op;

  on_call_media_transport_state (call_id: pjsua_call_id, info: pjsua_med_tp_state_info): pj_status_t;

  on_media_event (event: pjmedia_event);

  on_call_media_event (call_id: pjsua_call_id, med_idx: number, event: pjmedia_event);

  on_create_media_transport (call_id: pjsua_call_id, media_idx: number, base_tp: pjmedia_transport, flags: number): pjmedia_transport;

  on_create_media_transport_srtp (call_id: pjsua_call_id, media_idx: number, srtp_opt: pjmedia_srtp_setting);

  on_ip_change_progress (op: pjsua_ip_change_op, status: pj_status_t, info: pjsua_ip_change_op_info);

  clearCodecInfoList (codec_list: CodecInfoVector);

  updateCodecInfoList (pj_codec: pjsua_codec_info[], count: number, codec_list: CodecInfoVector);

}

