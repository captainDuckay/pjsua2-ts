/**
 * Credential information. Credential contains information to authenticate
 * against a service.
 */
export interface AuthCredInfo {
  /**
   * The authentication scheme (e.g. "digest").
   */
  cheme: string;

  /**
   * Realm on which this credential is to be used. Use "*" to make
   * a credential that can be used to authenticate against any challenges.
   */
  ealm: string;

  /**
   * Authentication user name.
   */
  sername: string;

  /**
   * Type of data that is contained in the "data" field. Use 0 if the data
   * contains plain text password.
   */
  dataType: number;

  /**
   * The data, which can be a plain text password or a hashed digest.
   */
  ata: string;

  /*
   * Digest AKA credential information. Note that when AKA credential
   * is being used, the \a data field of this pjsip_cred_info is
   * not used, but it still must be initialized to an empty string.
   * Please see PJSIP_AUTH_AKA_API for more information.
   */

  /** Permanent subscriber key. */
  kaK: string;

  /** Operator variant key. */
  kaOp: string;

  /** Authentication Management Field  */
  kaAmf: string;

  /** Default constructor */
  AuthCredInfo (): void;

  /** Construct a credential with the specified parameters */
  AuthCredInfo (scheme: string, realm: string, user_name: string, data_type: number, data: string): void;

}

//////////////////////////////////////////////////////////////////////////////

/**
 * TLS transport settings, to be specified in TransportConfig.
 */
export interface TlsConfig {
  /**
   * Certificate of Authority (CA) list file.
   */
  CaListFile: string;

  /**
   * Public endpoint certificate file, which will be used as client-
   * side  certificate for outgoing TLS connection, and server-side
   * certificate for incoming TLS connection.
   */
  certFile: string;

  /**
   * Optional private key of the endpoint certificate to be used.
   */
  privKeyFile: string;

  /**
   * Password to open private key.
   */
  password: string;

  /**
   * Certificate of Authority (CA) buffer. If CaListFile, certFile or
   * privKeyFile are set, this setting will be ignored.
   */
  CaBuf: string;

  /**
   * Public endpoint certificate buffer, which will be used as client-
   * side  certificate for outgoing TLS connection, and server-side
   * certificate for incoming TLS connection. If CaListFile, certFile or
   * privKeyFile are set, this setting will be ignored.
   */
  certBuf: string;

  /**
   * Optional private key buffer of the endpoint certificate to be used.
   * If CaListFile, certFile or privKeyFile are set, this setting will
   * be ignored.
   */
  privKeyBuf: string;

  /**
   * TLS protocol method from #pjsip_ssl_method. In the future, this field
   * might be deprecated in favor of <b>proto</b> field. For now, this field
   * is only applicable only when <b>proto</b> field is set to zero.
   *
   * Default is PJSIP_SSL_UNSPECIFIED_METHOD (0), which in turn will
   * use PJSIP_SSL_DEFAULT_METHOD, which default value is PJSIP_TLSV1_METHOD.
   */
  method: pjsip_ssl_method;

  /**
   * TLS protocol type from #pj_ssl_sock_proto. Use this field to enable
   * specific protocol type. Use bitwise OR operation to combine the protocol
   * type.
   *
   * Default is PJSIP_SSL_DEFAULT_PROTO.
   */
  proto: number;

  /**
   * Ciphers and order preference. The Endpoint::utilSslGetAvailableCiphers()
   * can be used to check the available ciphers supported by backend.
   * If the array is empty, then default cipher list of the backend
   * will be used.
   */
  ciphers: number[];

  /**
   * Specifies TLS transport behavior on the server TLS certificate
   * verification result:
   * - If \a verifyServer is disabled, TLS transport will just notify
   *   the application via pjsip_tp_state_callback with state
   *   PJSIP_TP_STATE_CONNECTED regardless TLS verification result.
   * - If \a verifyServer is enabled, TLS transport will be shutdown
   *   and application will be notified with state
   *   PJSIP_TP_STATE_DISCONNECTED whenever there is any TLS verification
   *   error, otherwise PJSIP_TP_STATE_CONNECTED will be notified.
   *
   * In any cases, application can inspect pjsip_tls_state_info in the
   * callback to see the verification detail.
   *
   * Default value is false.
   */
  verifyServer: boolean;

  /**
   * Specifies TLS transport behavior on the client TLS certificate
   * verification result:
   * - If \a verifyClient is disabled, TLS transport will just notify
   *   the application via pjsip_tp_state_callback with state
   *   PJSIP_TP_STATE_CONNECTED regardless TLS verification result.
   * - If \a verifyClient is enabled, TLS transport will be shutdown
   *   and application will be notified with state
   *   PJSIP_TP_STATE_DISCONNECTED whenever there is any TLS verification
   *   error, otherwise PJSIP_TP_STATE_CONNECTED will be notified.
   *
   * In any cases, application can inspect pjsip_tls_state_info in the
   * callback to see the verification detail.
   *
   * Default value is PJ_FALSE.
   */
  verifyClient: boolean;

  /**
   * When acting as server (incoming TLS connections), reject incoming
   * connection if client doesn't supply a TLS certificate.
   *
   * This setting corresponds to SSL_VERIFY_FAIL_IF_NO_PEER_CERT flag.
   * Default value is PJ_FALSE.
   */
  requireClientCert: boolean;

  /**
   * TLS negotiation timeout to be applied for both outgoing and incoming
   * connection, in milliseconds. If zero, the SSL negotiation doesn't
   * have a timeout.
   *
   * Default: zero
   */
  msecTimeout: number;

  /**
   * QoS traffic type to be set on this transport. When application wants
   * to apply QoS tagging to the transport, it's preferable to set this
   * field rather than \a qosParam fields since this is more portable.
   *
   * Default value is PJ_QOS_TYPE_BEST_EFFORT.
   */
  qosType: pj_qos_type;

  /**
   * Set the low level QoS parameters to the transport. This is a lower
   * level operation than setting the \a qosType field and may not be
   * supported on all platforms.
   *
   * By default all settings in this interfaceure are disabled.
   */
  qosParams: pj_qos_params;

  /**
   * Specify if the transport should ignore any errors when setting the QoS
   * traffic type/parameters.
   *
   * Default: PJ_TRUE
   */
  qosIgnoreError: boolean;

  /** Default constructor initialises with default values */
  TlsConfig ();

  /** Convert to pjsip */
  toPj (): pjsip_tls_setting;

  /** Convert from pjsip */
  fromPj (prm: pjsip_tls_setting): void;

};

/**
 * Parameters to create a transport instance.
 */
export interface TransportConfig {
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
  portRange: number;

  /**
   * Optional address to advertise as the address of this transport.
   * Application can specify any address or hostname for this field,
   * for example it can point to one of the export interface address in the
   * system, or it can point to the public address of a NAT router
   * where port mappings have been configured for the application.
   *
   * Note: this option can be used for both UDP and TCP as well!
   */
  publicAddress: string;

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
  boundAddress: string;

  /**
   * This specifies TLS settings for TLS transport. It is only be used
   * when this transport config is being used to create a SIP TLS
   * transport.
   */
  tlsConfig: TlsConfig;

  /**
   * QoS traffic type to be set on this transport. When application wants
   * to apply QoS tagging to the transport, it's preferable to set this
   * field rather than \a qosParam fields since this is more portable.
   *
   * Default is QoS not set.
   */
  qosType: pj_qos_type;

  /**
   * Set the low level QoS parameters to the transport. This is a lower
   * level operation than setting the \a qosType field and may not be
   * supported on all platforms.
   *
   * Default is QoS not set.
   */
  qosParams: pj_qos_params;

  /** Default constructor initialises with default values */
  TransportConfig ();

  /** Convert from pjsip */
  fromPj (prm: pjsua_transport_config): void;

  /** Convert to pjsip */
  toPj (): pjsua_transport_config;

};

/**
 * This interfaceure describes transport information returned by
 * Endpoint::transportGetInfo() function.
 */
export interface TransportInfo {
  /** PJSUA transport identification. */
  id: TransportId;

  /** Transport type. */
  type: pjsip_transport_type_e;

  /** Transport type name. */
  typeName: string;

  /** Transport string info/description. */
  info: string;

  /** Transport flags (see pjsip_transport_flags_e). */
  flags: number;

  /** Local/bound address. */
  localAddress: SocketAddress;

  /** Published address (or transport address name). */
  localName: SocketAddress;

  /** Current number of objects currently referencing this transport. */
  usageCount: number;

  /**
   * Default constructor.
   */
  TransportInfo ();

  /** Construct from pjsua_transport_info */
  fromPj (info: pjsua_transport_info): void;

};

//////////////////////////////////////////////////////////////////////////////

/**
 * This interfaceure describes an incoming SIP message. It corresponds to the
 * pjsip_rx_data interfaceure in PJSIP library.
 */
export interface SipRxData {
  /**
   * A short info string describing the request, which normally contains
   * the request method and its CSeq.
   */
  info: string;

  /**
   * The whole message data as a string, containing both the header section
   * and message body section.
   */
  wholeMsg: string;

  /**
   * Source address of the message.
   */
  srcAddress: SocketAddress;

  /**
   * Pointer to original pjsip_rx_data. Only valid when the export interface
   * is coninterfaceed from PJSIP's pjsip_rx_data.
   */
  pjRxData: void;

  /**
   * Default constructor.
   */
  SipRxData (): void;

  /**
   * Construct from PJSIP's pjsip_rx_data
   */
  fromPj (rdata: pjsip_rx_data): void;

};

/**
 * This interfaceure describes an outgoing SIP message. It corresponds to the
 * pjsip_tx_data interfaceure in PJSIP library.
 */
export interface SipTxData {
  /**
   * A short info string describing the request, which normally contains
   * the request method and its CSeq.
   */
  info: string;

  /**
   * The whole message data as a string, containing both the header section
   * and message body section.
   */
  wholeMsg: string;

  /**
   * Destination address of the message.
   */
  dstAddress: SocketAddress;

  /**
   * Pointer to original pjsip_tx_data. Only valid when the export interface
   * is coninterfaceed from PJSIP's pjsip_tx_data.
   */
  pjTxData: void;

  /**
   * Default constructor.
   */
  SipTxData ();

  /**
   * Construct from PJSIP's pjsip_tx_data
   */
  fromPj (tdata: pjsip_tx_data): void;

};

/**
 * This interfaceure describes SIP transaction object. It corresponds to the
 * pjsip_transaction interfaceure in PJSIP library.
 */
export interface SipTransaction {
  /* Transaction identification. */
  role: pjsip_role_e;
  /**< Role (UAS or UAC)      */
  method: string;         /**< The method.            */

  /* State and status. */
  statusCode: number;
  /**< Last status code seen. */
  statusText: string;
  /**< Last reason phrase.    */
  state: pjsip_tsx_state_e;          /**< State.                 */

  /* Messages and timer. */
  lastTx: SipTxData;         /**< Msg kept for retrans.  */

  /* Original pjsip_transaction. */
  pjTransaction: void;  /**< pjsip_transaction.     */

  /**
   * Default constructor.
   */
  SipTransaction ();

  /**
   * Construct from PJSIP's pjsip_transaction
   */
  fromPj (tsx: pjsip_transaction): void;

};

/**
 * This interfaceure describes timer event.
 */
export interface TimerEvent {
  entry: TimerEntry;          /**< The timer entry.           */
};

/**
 * This interfaceure describes transaction state event source.
 */
export interface TsxStateEventSrc {
  rdata: SipRxData;
  /**< The incoming message.      */
  tdata: SipTxData;
  /**< The outgoing message.      */
  timer: TimerEntry;
  /**< The timer.                 */
  status: pj_status_t;
  /**< Transport error status.    */
  data: GenericData;           /**< Generic data.              */

};

/**
 * This interfaceure describes transaction state changed event.
 */
export interface TsxStateEvent {
  src: TsxStateEventSrc;
  /**< Event source.              */
  tsx: SipTransaction;
  /**< The transaction.           */
  prevState: pjsip_tsx_state_e;
  /**< Previous state.            */
  type: pjsip_event_id_e;           /**< Type of event source:
   *     - PJSIP_EVENT_TX_MSG
   *     - PJSIP_EVENT_RX_MSG,
   *     - PJSIP_EVENT_TRANSPORT_ERROR
   *     - PJSIP_EVENT_TIMER
   *     - PJSIP_EVENT_USER
   */

};

/**
 * This interfaceure describes message transmission event.
 */
export interface TxMsgEvent {
  tdata: SipTxData;          /**< The transmit data buffer.  */
};

/**
 * This interfaceure describes transmission error event.
 */
export interface TxErrorEvent {
  tdata: SipTxData;
  /**< The transmit data.         */
  tsx: SipTransaction;            /**< The transaction.           */
};

/**
 * This interfaceure describes message arrival event.
 */
export interface RxMsgEvent {
  rdata: SipRxData;          /**< The receive data buffer.   */
};

/**
 * This interfaceure describes user event.
 */
export interface UserEvent {
  user1: GenericData;
  /**< User data 1.               */
  user2: GenericData;
  /**< User data 2.               */
  user3: GenericData;
  /**< User data 3.               */
  user4: GenericData;          /**< User data 4.               */
};

/**
 * The event body.
 */
export interface SipEventBody {
  /**
   * Timer event.
   */
  timer: TimerEvent;

  /**
   * Transaction state has changed event.
   */
  tsxState: TsxStateEvent;

  /**
   * Message transmission event.
   */
  txMsg: TxMsgEvent;

  /**
   * Transmission error event.
   */
  txError: TxErrorEvent;

  /**
   * Message arrival event.
   */
  rxMsg: RxMsgEvent;

  /**
   * User event.
   */
  user: UserEvent;

};

/**
 * This interfaceure describe event descriptor to fully identify a SIP event. It
 * corresponds to the pjsip_event interfaceure in PJSIP library.
 */
export interface SipEvent {
  /**
   * The event type, can be any value of \b pjsip_event_id_e.
   */
  type: pjsip_event_id_e;

  /**
   * The event body, which fields depends on the event type.
   */
  body: SipEventBody;

  /**
   * Pointer to its original pjsip_event. Only valid when the export interface is
   * coninterfaceed from PJSIP's pjsip_event.
   */
  pjEvent: void;

  /**
   * Default constructor.
   */
  SipEvent ();

  /**
   * Construct from PJSIP's pjsip_event
   */
  fromPj (ev: pjsip_event): void;

};

//////////////////////////////////////////////////////////////////////////////

/**
 * SIP media type containing type and subtype. For example, for
 * "application/sdp", the type is "application" and the subtype is "sdp".
 */
export interface SipMediaType {
  /** Media type. */
  type: string;

  /** Media subtype. */
  subType: string;

  /**
   * Construct from PJSIP's pjsip_media_type
   */
  fromPj (prm: pjsip_media_type): void;

  /**
   * Convert to PJSIP's pjsip_media_type.
   */
  toPj (): pjsip_media_type;

};

/**
 * Simple SIP header.
 */
export interface SipHeader {
  /**
   * Header name.
   */
  hName: string;

  /**
   * Header value.
   */
  hValue: string;

  /** Interal buffer for conversion to PJSIP header */
  pjHdr: pjsip_generic_string_hdr;

  /**
   * Initiaize from PJSIP header.
   */
  fromPj (hdr: pjsip_hdr): void;

  /**
   * Convert to PJSIP header.
   */
  toPj (): pjsip_generic_string_hdr;

};

/** Array of strings */
export type SipHeaderVector = SipHeader[];

/**
 * This describes each multipart part.
 */
export interface SipMultipartPart {
  /**
   * Optional headers to be put in this multipart part.
   */
  headers: SipHeaderVector;

  /**
   * The MIME type of the body part of this multipart part.
   */
  contentType: SipMediaType;

  /**
   * The body part of tthis multipart part.
   */
  body: string;

  /**
   * Initiaize from PJSIP's pjsip_multipart_part.
   */
  fromPj (prm: pjsip_multipart_part): void;

  /**
   * Convert to PJSIP's pjsip_multipart_part.
   */
  toPj (): pjsip_multipart_part;

  /** Interal buffer for conversion to PJSIP pjsip_multipart_part */
  readonly  pjMpp: pjsip_multipart_part;
  readonly  pjMsgBody: pjsip_msg_body;
};

/** Array of multipart parts */
export type SipMultipartPartVector = SipMultipartPart[];

/**
 * Additional options when sending outgoing SIP message. This corresponds to
 * pjsua_msg_data interfaceure in PJSIP library.
 */
export interface SipTxOption {
  /**
   * Optional remote target URI (i.e. Target header). If empty (""), the
   * target will be set to the remote URI (To header). At the moment this
   * field is only used when sending initial INVITE and MESSAGE requests.
   */
  targetUri: string;

  /**
   * Additional message headers to be included in the outgoing message.
   */
  headers: SipHeaderVector;

  /**
   * MIME type of the message body, if application specifies the messageBody
   * in this interfaceure.
   */
  contentType: string;

  /**
   * Optional message body to be added to the message, only when the
   * message doesn't have a body.
   */
  msgBody: string;

  /**
   * Content type of the multipart body. If application wants to send
   * multipart message bodies, it puts the parts in multipartParts and set
   * the content type in multipartContentType. If the message already
   * contains a body, the body will be added to the multipart bodies.
   */
  multipartContentType: SipMediaType;

  /**
   * Array of multipart parts. If application wants to send multipart
   * message bodies, it puts the parts in \a parts and set the content
   * type in \a multipart_ctype. If the message already contains a body,
   * the body will be added to the multipart bodies.
   */
  multipartParts: SipMultipartPartVector;

  /**
   * Check if the options are empty. If the options are set with empty
   * values, there will be no additional information sent with outgoing
   * SIP message.
   *
   * @return              True if the options are empty.
   */
  isEmpty (): boolean;

  /**
   * Initiaize from PJSUA's pjsua_msg_data.
   */
  fromPj (prm: pjsua_msg_data): void;

  /**
   * Convert to PJSUA's pjsua_msg_data.
   */
  toPj (msg_data: pjsua_msg_data): void;
};

//////////////////////////////////////////////////////////////////////////////

/**
 * This interfaceure contains parameters for sending instance message methods,
 * e.g: Buddy::sendInstantMessage(), Call:sendInstantMessage().
 */
export interface SendInstantMessageParam {
  /**
   * MIME type. Default is "text/plain".
   */
  contentType: string;

  /**
   * The message content.
   */
  content: string;

  /**
   * List of headers etc to be included in outgoing request.
   */
  txOption: SipTxOption;

  /**
   * User data, which will be given back when the IM callback is called.
   */
  userData: Token;

  SendInstantMessageParam (): void;
};

/**
 * This interfaceure contains parameters for sending typing indication methods,
 * e.g: Buddy::sendTypingIndication(), Call:sendTypingIndication().
 */
export interface SendTypingIndicationParam {
  /**
   * True to indicate to remote that local person is currently typing an IM.
   */
  isTyping: boolean;

  /**
   * List of headers etc to be included in outgoing request.
   */
  txOption: SipTxOption;

  SendTypingIndicationParam (): void;
};


