/**
 * Common credential structure represents common credential fields
 * present in Authorization/Proxy-Authorization header.
 */
import { int, pj_str_t } from "./c_types_to_ts";
import { pjsip_param } from "./sip_uri";

export interface pjsip_common_credential {
  realm: pj_str_t;
  /**< Credential's realm.    */
  other_param: pjsip_param;	/**< Other parameters.      */
}

/**
 * This structure describe credential used in Authorization and
 * Proxy-Authorization header for digest authentication scheme.
 */
export interface pjsip_digest_credential {
  realm: pj_str_t;
  /**< Realm of the credential  */
  other_param: pjsip_param;
  /**< Other parameters.    */
  username: pj_str_t;
  /**< Username parameter.  */
  nonce: pj_str_t;
  /**< Nonce parameter.    */
  uri: pj_str_t;
  /**< URI parameter.    */
  response: pj_str_t;
  /**< Response digest.    */
  algorithm: pj_str_t;
  /**< Algorithm.      */
  cnonce: pj_str_t;
  /**< Cnonce.      */
  opaque: pj_str_t;
  /**< Opaque value.    */
  qop: pj_str_t;
  /**< Quality of protection.  */
  nc: pj_str_t;		/**< Nonce count.    */
}

/**
 * This structure describe credential used in Authorization and
 * Proxy-Authorization header for PGP authentication scheme.
 */
export interface pjsip_pgp_credential {
  realm: pj_str_t;
  /**< Realm.      */
  other_param: pjsip_param;
  /**< Other parameters.    */
  version: pj_str_t;
  /**< Version parameter.    */
  signature: pj_str_t;
  /**< Signature parameter.  */
  signed_by: pj_str_t;
  /**< Signed by parameter.  */
  nonce: pj_str_t;		/**< Nonce parameter.    */
}

/**
 * This structure describe credential used in Authorization and
 * Proxy-Authorization header for OAuth authentication scheme.
 */
export interface pjsip_oauth_credential {
  realm: pj_str_t;
  /**< Realm of the credential    */
  other_param: pjsip_param;
  /**< Other parameters.          */
  username: pj_str_t;
  /**< Username parameter.        */
  token: pj_str_t;          /**< Token parameter.           */
}

/**
 * This structure describes SIP Authorization header (and also SIP
 * Proxy-Authorization header).
 */
export interface pjsip_authorization_hdr {

  /** Authorization scheme.  */
  scheme: pj_str_t;

  /** Type of credentials, depending on the scheme. */
  credential:
    {
      common: pjsip_common_credential; /**< Common fields.      */
      digest: pjsip_digest_credential; /**< Digest credentials.    */
      pgp: pjsip_pgp_credential; /**< PGP credentials.      */
      oauth: pjsip_oauth_credential;  /**< OAuth credentials.     */
    };
}

/**
 * This structure describes common fields in authentication challenge
 * headers (WWW-Authenticate and Proxy-Authenticate).
 */
export interface pjsip_common_challenge {
  realm: pj_str_t;
  /**< Realm for the challenge.  */
  other_param: pjsip_param;	/**< Other parameters.    */
}

/**
 * This structure describes authentication challenge used in Proxy-Authenticate
 * or WWW-Authenticate for digest authentication scheme.
 */
export interface pjsip_digest_challenge {
  realm: pj_str_t;
  /**< Realm for the challenge.  */
  other_param: pjsip_param;
  /**< Other parameters.    */
  domain: pj_str_t;
  /**< Domain.      */
  nonce: pj_str_t;
  /**< Nonce challenge.    */
  opaque: pj_str_t;
  /**< Opaque value.    */
  stale: int;
  /**< Stale parameter.    */
  algorithm: pj_str_t;
  /**< Algorithm parameter.  */
  qop: pj_str_t;		/**< Quality of protection.  */
}

/**
 * This structure describes authentication challenge used in Proxy-Authenticate
 * or WWW-Authenticate for PGP authentication scheme.
 */
export interface pjsip_pgp_challenge {
  realm: pj_str_t;
  /**< Realm for the challenge.  */
  other_param: pjsip_param;
  /**< Other parameters.    */
  version: pj_str_t;
  /**< PGP version.    */
  micalgorithm: pj_str_t;
  /**< micalgorithm parameter.  */
  pubalgorithm: pj_str_t;
  /**< pubalgorithm parameter.  */
  nonce: pj_str_t;		/**< Nonce challenge.    */
}

/**
 * This structure describe SIP WWW-Authenticate header (Proxy-Authenticate
 * header also uses the same structure).
 */
export interface pjsip_www_authenticate_hdr {
  /** Authentication scheme  */
  scheme: pj_str_t;

  /** This union contains structures that are only relevant
   depending on the value of the scheme being used.
   */
  challenge:
    {
      common: pjsip_common_challenge; /**< Common fields.  */
      digest: pjsip_digest_challenge; /**< Digest challenge.  */
      pgp: pjsip_pgp_challenge;	/**< PGP challenge.  */
    };
}

