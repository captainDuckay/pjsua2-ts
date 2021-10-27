/** Type of data in the credential information in #pjsip_cred_info. */
import { int, pj_bool_t, pj_pool_t, pj_str_t, pj_uint32_t, unsigned } from "./c_types_to_ts";
import {
  pjsip_authorization_hdr,
  pjsip_www_authenticate_hdr
} from "./sip_auth_msg";
import { pjsip_method } from "./sip_msg";
import { pjsip_rx_data } from "./sip_transport";

export enum pjsip_cred_data_type {
  PJSIP_CRED_DATA_PLAIN_PASSWD = 0, /**< Plain text password.    */
  PJSIP_CRED_DATA_DIGEST = 1, /**< Hashed digest.      */

  PJSIP_CRED_DATA_EXT_AKA = 16 /**< Extended AKA info is available */

}

/** Authentication's quality of protection (qop) type. */
export enum pjsip_auth_qop_type {
  PJSIP_AUTH_QOP_NONE, /**< No quality of protection. */
  PJSIP_AUTH_QOP_AUTH, /**< Authentication. */
  PJSIP_AUTH_QOP_AUTH_INT, /**< Authentication with integrity protection. */
  PJSIP_AUTH_QOP_UNKNOWN	    /**< Unknown protection. */
}

/**
 * This structure describes credential information.
 * A credential information is a static, persistent information that identifies
 * username and password required to authorize to a specific realm.
 *
 * Note that since PJSIP 0.7.0.1, it is possible to make a credential that is
 * valid for any realms, by setting the realm to star/wildcard character,
 * i.e. realm = pj_str("*");.
 */
export interface pjsip_cred_info {
  realm: pj_str_t;
  /**< Realm. Use "*" to make a credential that
   can be used to authenticate against any
   challenges.          */
  scheme: pj_str_t;
  /**< Scheme (e.g. "digest").        */
  username: pj_str_t;
  /**< User name.            */
  data_type: int;
  /**< Type of data (0 for plaintext passwd). */
  data: pj_str_t;		/**< The data, which can be a plaintext
   password or a hashed digest.      */

  /** Extended data */
  ext: {
    /** Digest AKA credential information. Note that when AKA credential
     *  is being used, the \a data field of this #pjsip_cred_info is
     *  not used, but it still must be initialized to an empty string.
     * Please see \ref PJSIP_AUTH_AKA_API for more information.
     */
    aka: {
      k: pj_str_t; /**< Permanent subscriber key.    */
      op: pj_str_t; /**< Operator variant key.    */
      amf: pj_str_t; /**< Authentication Management Field  */
      cb: pjsip_cred_cb;	/**< Callback to create AKA digest.  */
    };

  };
}

/**
 * This structure describes cached value of previously sent Authorization
 * or Proxy-Authorization header. The authentication framework keeps a list
 * of this structure and will resend the same header to the same server
 * as long as the method, uri, and nonce stays the same.
 */
export interface pjsip_cached_auth_hdr {

  method: pjsip_method;
  /**< To quickly see the method. */
  hdr: pjsip_authorization_hdr;	/**< The cached header.    */

}

/**
 * This structure describes authentication information for the specified
 * realm. Each instance of this structure describes authentication "session"
 * between this endpoint and remote server. This "session" information is
 * usefull to keep information that persists for more than one challenge,
 * such as nonce-count and cnonce value.
 *
 * Other than that, this structure also keeps the last authorization headers
 * that have been sent in the cache list.
 */
export interface pjsip_cached_auth {

  pool: pj_pool_t;
  /**< Pool for cached auth      */
  realm: pj_str_t;
  /**< Realm.          */
  is_proxy: pj_bool_t;
  /**< Server type (401/407)      */
  qop_value: pjsip_auth_qop_type;
  /**< qop required by server.    */
  stale_cnt: unsigned;
  /**< Number of stale retry.      */
  nc: pj_uint32_t;
  /**< Nonce count.        */
  cnonce: pj_str_t;
  /**< Cnonce value.        */
  last_chal: pjsip_www_authenticate_hdr;
  /**< Last challenge seen.      */
  cached_hdr: pjsip_cached_auth_hdr;/**< List of cached header for
   each method.        */

}

/**
 * This structure describes client authentication session preference.
 * The preference can be set by calling #pjsip_auth_clt_set_prefs().
 */
export interface pjsip_auth_clt_pref {
  /**
   * If this flag is set, the authentication client framework will
   * send an empty Authorization header in each initial request.
   * Default is no.
   */
  initial_auth: pj_bool_t;

  /**
   * Specify the algorithm to use when empty Authorization header
   * is to be sent for each initial request (see above)
   */
  algorithm: pj_str_t;

}

/**
 * This structure describes client authentication sessions. It keeps
 * all the information needed to authorize the client against all downstream
 * servers.
 */
export interface pjsip_auth_clt_sess {
  pool: pj_pool_t;
  /**< Pool to use.        */
  endpt: pjsip_endpoint;
  /**< Endpoint where this belongs.   */
  pref: pjsip_auth_clt_pref;
  /**< Preference/options.      */
  cred_cnt: unsigned;
  /**< Number of credentials.      */
  cred_info: pjsip_cred_info;
  /**< Array of credential information*/
  cached_auth: pjsip_cached_auth;	/**< Cached authorization info.      */

}

/**
 * This structure describes input param for credential lookup.
 */
export interface pjsip_auth_lookup_cred_param {
  realm: pj_str_t;
  /**< Realm to find the account.    */
  acc_name: pj_str_t;
  /**< Account name to look for.    */
  rdata: pjsip_rx_data;   /**< Incoming request to be authenticated.  */

}

/**
 * This structure describes server authentication information.
 */
export interface pjsip_auth_srv {
  realm: pj_str_t;
  /**< Realm to serve.        */
  is_proxy: pj_bool_t;
  /**< Will issue 407 instead of 401  */
  lookup: pjsip_auth_lookup_cred;
  /**< Lookup function.        */
  lookup2: pjsip_auth_lookup_cred2;	/**< Lookup function with additional
   info in its input param.      */
}

/**
 * This structure describes initialization settings of server authorization
 * session.
 */
export interface pjsip_auth_srv_init_param {
  /**
   * Realm to be served by the server.
   */
  realm: pj_str_t;

  /**
   * Account lookup function.
   */
  lookup2: pjsip_auth_lookup_cred2;

  /**
   * Options, bitmask of:
   * - PJSIP_AUTH_SRV_IS_PROXY: to specify that the server will authorize
   *   clients as a proxy server (instead of as UAS), which means that
   *   Proxy-Authenticate will be used instead of WWW-Authenticate.
   */
  options: unsigned;

}
