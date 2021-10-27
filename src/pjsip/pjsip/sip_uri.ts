/**
 * Generic parameter, normally used in other_param or header_param.
 */
export interface pjsip_param {
  PJ_DECL_LIST_MEMBER (pjsip_param);

  /**< Generic list member.   */
  name: string;
  /**< Param/header name.      */
  value: string;
}

/**
 * URI context.
 */
export enum pjsip_uri_context_e {
  /**< The URI is in Request URI. */
  PJSIP_URI_IN_REQ_URI,
  /**< The URI is in From/To header. */
  PJSIP_URI_IN_FROMTO_HDR,
  /**< The URI is in Contact header. */
  PJSIP_URI_IN_CONTACT_HDR,
  /**< The URI is in Route/Record-Route header. */
  PJSIP_URI_IN_ROUTING_HDR,
  /**< Other context (web page, business card, etc.) */
  PJSIP_URI_IN_OTHER
}

/**
 * URI 'virtual' function table.
 * All types of URI in this library (such as sip:, sips:, tel:, and name-addr)
 * will have pointer to this table as their first struct member. This table
 * provides polimorphic behaviour to the URI.
 */
export interface pjsip_uri_vptr {
  /**
   * Get URI scheme.
   * @param uri the URI (self).
   * @return the URI scheme.
   */
  p_get_scheme (uri: string): string;

  /**
   * Get the URI object contained by this URI, or the URI itself if
   * it doesn't contain another URI.
   * @param uri the URI (self).
   */
  p_get_uri (uri: string);

  /**
   * Print URI components to the buffer, following the rule of which
   * components are allowed for the context.
   * @param context the context where the URI will be placed.
   * @param uri the URI (self).
   * @param buf the buffer.
   * @param size the size of the buffer.
   * @return the length printed.
   */
  p_print (context: pjsip_uri_context_e, uri: string, buf: string, size: number): pj_ssize_t;

  /**
   * Compare two URIs according to the context.
   * @param context the context.
   * @param uri1 the first URI (self).
   * @param uri2 the second URI.
   * @return PJ_SUCCESS if equal, or otherwise the error status which
   *        should point to the mismatch part.
   */
  p_compare (context: pjsip_uri_context_e, uri1: string, uri2: string): pj_status_t;

  /**
   * Clone URI.
   * @param pool the pool.
   * @param uri URI to clone (self).
   * @return new URI.
   */
  p_clone (pool, uri: string);

}

/**
 * The declaration of 'base class' for all URI scheme.
 */
interface pjsip_uri {
  /** All URIs must have URI virtual function table as their first member. */
  vptr: pjsip_uri_vptr;
}

/**
 * SIP and SIPS URL scheme.
 */
export interface pjsip_sip_uri {
  vptr: pjsip_uri_vptr;
  /**< Pointer to virtual function table.*/
  user: string;
  /**< Optional user part. */
  passwd: string;
  /**< Optional password part. */
  host: string;
  /**< Host part, always exists. */
  port: number;
  /**< Optional port number, or zero. */
  user_param: string;
  /**< Optional user parameter */
  method_param: string;
  /**< Optional method parameter. */
  transport_param: string;
  /**< Optional transport parameter. */
  ttl_param: number;
  /**< Optional TTL param, or -1. */
  lr_param: number;
  /**< Optional loose routing param, or zero */
  maddr_param: string;
  /**< Optional maddr param */
  other_param: pjsip_param;
  /**< Other parameters grouped together. */
  header_param: pjsip_param;	/**< Optional header parameter. */
}

/**
 * SIP name-addr, which typically appear in From, To, and Contact header.
 * The SIP name-addr contains a generic URI and a display name.
 */
export interface pjsip_name_addr {
  /** Pointer to virtual function table. */
  vptr: pjsip_uri_vptr;

  /** Optional display name. */
  display: string;

  /** URI part. */
  uri: pjsip_uri;

}

/**
 * @defgroup PJSIP_OTHER_URI Other URI schemes
 * @ingroup PJSIP_URI
 * @brief Container for non SIP/tel URI scheme (e.g. "http:", "mailto:")
 * @{
 */

/**
 * Generic URI container for non SIP/tel URI scheme.
 */
export interface pjsip_other_uri {
  vptr: pjsip_uri_vptr;
  /**< Pointer to virtual function table.  */
  scheme: string;
  /**< The URI scheme (e.g. "mailto")  */
  content: string;		/**< The whole URI content    */
}
