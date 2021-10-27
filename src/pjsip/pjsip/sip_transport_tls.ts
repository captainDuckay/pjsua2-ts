/** SSL protocol method constants. */
export enum pjsip_ssl_method {
  /**< Default protocol method.  */
  PJSIP_SSL_UNSPECIFIED_METHOD = 0,
  /**< Use SSLv2 method.    */
  PJSIP_SSLV2_METHOD = 20,
  /**< Use SSLv3 method.    */
  PJSIP_SSLV3_METHOD = 30,
  /**< Use TLSv1 method.    */
  PJSIP_TLSV1_METHOD = 31,
  /**< Use TLSv1_1 method.  */
  PJSIP_TLSV1_1_METHOD = 32,
  /**< Use TLSv1_2 method.  */
  PJSIP_TLSV1_2_METHOD = 33,
  /**< Use TLSv1_3 method.  */
  PJSIP_TLSV1_3_METHOD = 34,
  /**< Use SSLv23 method.    */
  PJSIP_SSLV23_METHOD = 23,
}

/**
 * This structure describe the parameter passed from #on_accept_fail_cb().
 */
export interface pjsip_tls_on_accept_fail_param {
  /**
   * Local address of the fail accept operation of the TLS listener.
   */
  local_addr: pj_sockaddr_t;

  /**
   * Remote address of the fail accept operation of the TLS listener.
   */
  remote_addr: pj_sockaddr_t;

  /**
   * Error status of the fail accept operation of the TLS listener.
   */
  status: pj_status_t;

  /**
   * Last error code returned by native SSL backend. Note that this may be
   * zero, if the failure is not SSL related (e.g: accept rejection).
   */
  last_native_err: pj_status_t;

}

/**
 * TLS transport settings.
 */
export interface pjsip_tls_setting {
  /**
   * Certificate of Authority (CA) list file.
   */
  ca_list_file: string;

  /**
   * Certificate of Authority (CA) list directory path.
   */
  ca_list_path: string;

  /**
   * Public endpoint certificate file, which will be used as client-
   * side  certificate for outgoing TLS connection, and server-side
   * certificate for incoming TLS connection.
   */
  cert_file: string;

  /**
   * Optional private key of the endpoint certificate to be used.
   */
  privkey_file: string;

  /**
   * Certificate of Authority (CA) buffer. If ca_list_file, ca_list_path,
   * cert_file or privkey_file are set, this setting will be ignored.
   */
  ca_buf: pj_ssl_cert_buffer;

  /**
   * Public endpoint certificate buffer, which will be used as client-
   * side  certificate for outgoing TLS connection, and server-side
   * certificate for incoming TLS connection. If ca_list_file, ca_list_path,
   * cert_file or privkey_file are set, this setting will be ignored.
   */
  cert_buf: pj_ssl_cert_buffer;

  /**
   * Optional private key buffer of the endpoint certificate to be used.
   * If ca_list_file, ca_list_path, cert_file or privkey_file are set,
   * this setting will be ignored.
   */
  privkey_buf: pj_ssl_cert_buffer;

  /**
   * Password to open private key.
   */
  password: string;

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
   * Number of ciphers contained in the specified cipher preference.
   * If this is set to zero, then default cipher list of the backend
   * will be used.
   *
   * Default: 0 (zero).
   */
  ciphers_num: number;

  /**
   * Ciphers and order preference. The #pj_ssl_cipher_get_availables()
   * can be used to check the available ciphers supported by backend.
   */
  ciphers: pj_ssl_cipher;

  /**
   * Number of curves contained in the specified curve preference.
   * If this is set to zero, then default curve list of the backend
   * will be used.
   *
   * Default: 0 (zero).
   */
  curves_num: number;

  /**
   * Curves and order preference. The #pj_ssl_curve_get_availables()
   * can be used to check the available curves supported by backend.
   */
  curves: pj_ssl_curve;

  /**
   * The supported signature algorithms. Set the sigalgs string
   * using this form:
   * "<DIGEST>+<ALGORITHM>:<DIGEST>+<ALGORITHM>"
   * Digests are: "RSA", "DSA" or "ECDSA"
   * Algorithms are: "MD5", "SHA1", "SHA224", "SHA256", "SHA384", "SHA512"
   * Example: "ECDSA+SHA256:RSA+SHA256"
   */
  sigalgs: string;

  /**
   * Reseed random number generator.
   * For type #PJ_SSL_ENTROPY_FILE, parameter \a entropy_path
   * must be set to a file.
   * For type #PJ_SSL_ENTROPY_EGD, parameter \a entropy_path
   * must be set to a socket.
   *
   * Default value is PJ_SSL_ENTROPY_NONE.
   */
  entropy_type: pj_ssl_entropy_t;

  /**
   * When using a file/socket for entropy #PJ_SSL_ENTROPY_EGD or
   * #PJ_SSL_ENTROPY_FILE, \a entropy_path must contain the path
   * to entropy socket/file.
   *
   * Default value is an empty string.
   */
  entropy_path: string;

  /**
   * Specifies TLS transport behavior on the server TLS certificate
   * verification result:
   * - If \a verify_server is disabled (set to PJ_FALSE), TLS transport
   *   will just notify the application via #pjsip_tp_state_callback with
   *   state PJSIP_TP_STATE_CONNECTED regardless TLS verification result.
   * - If \a verify_server is enabled (set to PJ_TRUE), TLS transport
   *   will be shutdown and application will be notified with state
   *   PJSIP_TP_STATE_DISCONNECTED whenever there is any TLS verification
   *   error, otherwise PJSIP_TP_STATE_CONNECTED will be notified.
   *
   * In any cases, application can inspect #pjsip_tls_state_info in the
   * callback to see the verification detail.
   *
   * Default value is PJ_FALSE.
   */
  verify_server: boolean;

  /**
   * Specifies TLS transport behavior on the client TLS certificate
   * verification result:
   * - If \a verify_client is disabled (set to PJ_FALSE), TLS transport
   *   will just notify the application via #pjsip_tp_state_callback with
   *   state PJSIP_TP_STATE_CONNECTED regardless TLS verification result.
   * - If \a verify_client is enabled (set to PJ_TRUE), TLS transport
   *   will be shutdown and application will be notified with state
   *   PJSIP_TP_STATE_DISCONNECTED whenever there is any TLS verification
   *   error, otherwise PJSIP_TP_STATE_CONNECTED will be notified.
   *
   * In any cases, application can inspect #pjsip_tls_state_info in the
   * callback to see the verification detail.
   *
   * Default value is PJ_FALSE.
   */
  verify_client: boolean;

  /**
   * When acting as server (incoming TLS connections), reject inocming
   * connection if client doesn't supply a TLS certificate.
   *
   * This setting corresponds to SSL_VERIFY_FAIL_IF_NO_PEER_CERT flag.
   * Default value is PJ_FALSE.
   */
  require_client_cert: boolean;

  /**
   * TLS negotiation timeout to be applied for both outgoing and
   * incoming connection. If both sec and msec member is set to zero,
   * the SSL negotiation doesn't have a timeout.
   */
  timeout: pj_time_val;

  /**
   * Should SO_REUSEADDR be used for the listener socket.
   * Default value is PJSIP_TLS_TRANSPORT_REUSEADDR.
   */
  reuse_addr: boolean;

  /**
   * QoS traffic type to be set on this transport. When application wants
   * to apply QoS tagging to the transport, it's preferable to set this
   * field rather than \a qos_param fields since this is more portable.
   *
   * Default value is PJ_QOS_TYPE_BEST_EFFORT.
   */
  qos_type: pj_qos_type;

  /**
   * Set the low level QoS parameters to the transport. This is a lower
   * level operation than setting the \a qos_type field and may not be
   * supported on all platforms.
   *
   * By default all settings in this structure are disabled.
   */
  qos_params: pj_qos_params;

  /**
   * Specify if the transport should ignore any errors when setting the QoS
   * traffic type/parameters.
   *
   * Default: PJ_TRUE
   */
  qos_ignore_error: boolean;

  /**
   * Specify options to be set on the transport.
   *
   * By default there is no options.
   *
   */
  sockopt_params: pj_sockopt_params;

  /**
   * Specify if the transport should ignore any errors when setting the
   * sockopt parameters.
   *
   * Default: PJ_TRUE
   *
   */
  sockopt_ignore_error: boolean;

  /**
   * Callback to be called when a accept operation of the TLS listener fails.
   *
   * @param param         The parameter to the callback.
   */
  on_accept_fail_cb (param: pjsip_tls_on_accept_fail_param);

}

/**
 * This structure defines TLS transport extended info in <tt>ext_info</tt>
 * field of #pjsip_transport_state_info for the transport state notification
 * callback #pjsip_tp_state_callback.
 */
export interface pjsip_tls_state_info {
  /**
   * SSL socket info.
   */
  ssl_sock_info: pj_ssl_sock_info;

}
