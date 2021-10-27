/* **************************************************************************/
/**
 * @defgroup PJSIP_MSG_METHOD Methods
 * @brief Method names and manipulation.
 * @ingroup PJSIP_MSG
 * @{
 */

/**
 * This enumeration declares SIP methods as described by RFC3261. Additional
 * methods do exist, and they are described by corresponding RFCs for the SIP
 * extentensions. Since they won't alter the characteristic of the processing
 * of the message, they don't need to be explicitly mentioned here.
 */
export enum pjsip_method_e {
  /**< INVITE method, for establishing dialogs.   */
  PJSIP_INVITE_METHOD,
  /**< CANCEL method, for cancelling request.      */
  PJSIP_CANCEL_METHOD,
  /**< ACK method.            */
  PJSIP_ACK_METHOD,
  /**< BYE method, for terminating dialog.      */
  PJSIP_BYE_METHOD,
  /**< REGISTER method.          */
  PJSIP_REGISTER_METHOD,
  /**< OPTIONS method.          */
  PJSIP_OPTIONS_METHOD,
  /**< Other method.            */
  PJSIP_OTHER_METHOD
}

/**
 * This structure represents a SIP method.
 * Application must always use either #pjsip_method_init or #pjsip_method_set
 * to make sure that method name is initialized correctly. This way, the name
 * member will always contain a valid method string regardless whether the ID
 * is recognized or not.
 */
export interface pjsip_method {
  /**< Method ID, from \a pjsip_method_e. */
  id: pjsip_method_e;
  /**< Method name, which will always contain the
   method string. */
  name: string;
};

/* **************************************************************************/
/**
 * @defgroup PJSIP_MSG_HDR Header Fields
 * @brief Declarations for various SIP header fields.
 * @ingroup PJSIP_MSG
 * @{
 */

/**
 * Header types, as defined by RFC3261.
 */
export enum pjsip_hdr_e {
  /*
   * These are the headers documented in RFC3261. Headers not documented
   * there must have type PJSIP_H_OTHER, and the header type itself is
   * recorded in the header name string.
   *
   * DO NOT CHANGE THE VALUE/ORDER OF THE HEADER IDs!!!.
   */
  PJSIP_H_ACCEPT,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_ACCEPT_ENCODING_UNIMP,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_ACCEPT_LANGUAGE_UNIMP,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_ALERT_INFO_UNIMP,

  PJSIP_H_ALLOW,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_AUTHENTICATION_INFO_UNIMP,

  PJSIP_H_AUTHORIZATION,

  PJSIP_H_CALL_ID,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_CALL_INFO_UNIMP,

  PJSIP_H_CONTACT,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_CONTENT_DISPOSITION_UNIMP,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_CONTENT_ENCODING_UNIMP,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_CONTENT_LANGUAGE_UNIMP,

  PJSIP_H_CONTENT_LENGTH,

  PJSIP_H_CONTENT_TYPE,

  PJSIP_H_CSEQ,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_DATE_UNIMP,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_ERROR_INFO_UNIMP,

  PJSIP_H_EXPIRES,

  PJSIP_H_FROM,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_IN_REPLY_TO_UNIMP,

  PJSIP_H_MAX_FORWARDS,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_MIME_VERSION_UNIMP,

  PJSIP_H_MIN_EXPIRES,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_ORGANIZATION_UNIMP,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_PRIORITY_UNIMP,

  PJSIP_H_PROXY_AUTHENTICATE,

  PJSIP_H_PROXY_AUTHORIZATION,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_PROXY_REQUIRE_UNIMP,

  PJSIP_H_RECORD_ROUTE,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_REPLY_TO_UNIMP,

  PJSIP_H_REQUIRE,

  PJSIP_H_RETRY_AFTER,

  PJSIP_H_ROUTE,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_SERVER_UNIMP,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_SUBJECT_UNIMP,

  PJSIP_H_SUPPORTED,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_TIMESTAMP_UNIMP,

  PJSIP_H_TO,

  PJSIP_H_UNSUPPORTED,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_USER_AGENT_UNIMP,

  PJSIP_H_VIA,
  /** N/A, use pjsip_generic_string_hdr */
  PJSIP_H_WARNING_UNIMP,

  PJSIP_H_WWW_AUTHENTICATE,

  PJSIP_H_OTHER

}

/**
 * This structure provides the pointer to basic functions that are needed
 * for generic header operations. All header fields will have pointer to
 * this structure, so that they can be manipulated uniformly.
 */
export interface pjsip_hdr_vptr {
  /**
   * Function to clone the header.
   *
   * @param pool  Memory pool to allocate the new header.
   * @param hdr   Header to clone.
   *
   * @return A new instance of the header.
   */
  clone (pool, hdr);

  /**
   * Pointer to function to shallow clone the header.
   * Shallow cloning will just make a memory copy of the original header,
   * thus all pointers in original header will be kept intact. Because the
   * function does not need to perform deep copy, the operation should be
   * faster, but the application must make sure that the original header
   * is still valid throughout the lifetime of new header.
   *
   * @param pool  Memory pool to allocate the new header.
   * @param hdr   The header to clone.
   */
  shallow_clone (pool, hdr);

  /** Pointer to function to print the header to the specified buffer.
   *  Returns the length of string written, or -1 if the remaining buffer
   *  is not enough to hold the header.
   *
   *  @param hdr  The header to print.
   *  @param buf  The buffer.
   *  @param len  The size of the buffer.
   *
   *  @return      The size copied to buffer, or -1 if there's not enough space.
   */
  print_on (hdr, buf: string, len: number): number;

}

/**
 * Generic SIP header structure, for generic manipulation for headers in the
 * message. All header fields can be typecasted to this type.
 */
export interface pjsip_hdr {
  PJSIP_DECL_HDR_MEMBER (pjsip_hdr);
};

/* **************************************************************************/

/**
 * @defgroup PJSIP_MSG_LINE Request and Status Line.
 * @brief Request and status line structures and manipulation.
 * @ingroup PJSIP_MSG
 * @{
 */

/**
 * This structure describes SIP request line.
 */
export interface pjsip_request_line {
  /**< Method for this request line. */
  method: pjsip_method;
  /**< URI for this request line. */
  uri: pjsip_uri;
}

/**
 * This structure describes SIP status line.
 */
export interface pjsip_status_line {
  /**< Status code. */
  code: number;
  /**< Reason string. */
  reason: string;

}

/**
 * This enumeration lists standard SIP status codes according to RFC 3261.
 * In addition, it also declares new status class 7xx for errors generated
 * by the stack. This status class however should not get transmitted on the
 * wire.
 */
export enum pjsip_status_code {
  PJSIP_SC_NULL = 0,

  PJSIP_SC_TRYING = 100,
  PJSIP_SC_RINGING = 180,
  PJSIP_SC_CALL_BEING_FORWARDED = 181,
  PJSIP_SC_QUEUED = 182,
  PJSIP_SC_PROGRESS = 183,
  PJSIP_SC_EARLY_DIALOG_TERMINATED = 199,

  PJSIP_SC_OK = 200,
  PJSIP_SC_ACCEPTED = 202,
  PJSIP_SC_NO_NOTIFICATION = 204,

  PJSIP_SC_MULTIPLE_CHOICES = 300,
  PJSIP_SC_MOVED_PERMANENTLY = 301,
  PJSIP_SC_MOVED_TEMPORARILY = 302,
  PJSIP_SC_USE_PROXY = 305,
  PJSIP_SC_ALTERNATIVE_SERVICE = 380,

  PJSIP_SC_BAD_REQUEST = 400,
  PJSIP_SC_UNAUTHORIZED = 401,
  PJSIP_SC_PAYMENT_REQUIRED = 402,
  PJSIP_SC_FORBIDDEN = 403,
  PJSIP_SC_NOT_FOUND = 404,
  PJSIP_SC_METHOD_NOT_ALLOWED = 405,
  PJSIP_SC_NOT_ACCEPTABLE = 406,
  PJSIP_SC_PROXY_AUTHENTICATION_REQUIRED = 407,
  PJSIP_SC_REQUEST_TIMEOUT = 408,
  PJSIP_SC_CONFLICT = 409,
  PJSIP_SC_GONE = 410,
  PJSIP_SC_LENGTH_REQUIRED = 411,
  PJSIP_SC_CONDITIONAL_REQUEST_FAILED = 412,
  PJSIP_SC_REQUEST_ENTITY_TOO_LARGE = 413,
  PJSIP_SC_REQUEST_URI_TOO_LONG = 414,
  PJSIP_SC_UNSUPPORTED_MEDIA_TYPE = 415,
  PJSIP_SC_UNSUPPORTED_URI_SCHEME = 416,
  PJSIP_SC_UNKNOWN_RESOURCE_PRIORITY = 417,
  PJSIP_SC_BAD_EXTENSION = 420,
  PJSIP_SC_EXTENSION_REQUIRED = 421,
  PJSIP_SC_SESSION_TIMER_TOO_SMALL = 422,
  PJSIP_SC_INTERVAL_TOO_BRIEF = 423,
  PJSIP_SC_BAD_LOCATION_INFORMATION = 424,
  PJSIP_SC_USE_IDENTITY_HEADER = 428,
  PJSIP_SC_PROVIDE_REFERRER_HEADER = 429,
  PJSIP_SC_FLOW_FAILED = 430,
  PJSIP_SC_ANONIMITY_DISALLOWED = 433,
  PJSIP_SC_BAD_IDENTITY_INFO = 436,
  PJSIP_SC_UNSUPPORTED_CERTIFICATE = 437,
  PJSIP_SC_INVALID_IDENTITY_HEADER = 438,
  PJSIP_SC_FIRST_HOP_LACKS_OUTBOUND_SUPPORT = 439,
  PJSIP_SC_MAX_BREADTH_EXCEEDED = 440,
  PJSIP_SC_BAD_INFO_PACKAGE = 469,
  PJSIP_SC_CONSENT_NEEDED = 470,
  PJSIP_SC_TEMPORARILY_UNAVAILABLE = 480,
  PJSIP_SC_CALL_TSX_DOES_NOT_EXIST = 481,
  PJSIP_SC_LOOP_DETECTED = 482,
  PJSIP_SC_TOO_MANY_HOPS = 483,
  PJSIP_SC_ADDRESS_INCOMPLETE = 484,
  PJSIP_AC_AMBIGUOUS = 485,
  PJSIP_SC_BUSY_HERE = 486,
  PJSIP_SC_REQUEST_TERMINATED = 487,
  PJSIP_SC_NOT_ACCEPTABLE_HERE = 488,
  PJSIP_SC_BAD_EVENT = 489,
  PJSIP_SC_REQUEST_UPDATED = 490,
  PJSIP_SC_REQUEST_PENDING = 491,
  PJSIP_SC_UNDECIPHERABLE = 493,
  PJSIP_SC_SECURITY_AGREEMENT_NEEDED = 494,

  PJSIP_SC_INTERNAL_SERVER_ERROR = 500,
  PJSIP_SC_NOT_IMPLEMENTED = 501,
  PJSIP_SC_BAD_GATEWAY = 502,
  PJSIP_SC_SERVICE_UNAVAILABLE = 503,
  PJSIP_SC_SERVER_TIMEOUT = 504,
  PJSIP_SC_VERSION_NOT_SUPPORTED = 505,
  PJSIP_SC_MESSAGE_TOO_LARGE = 513,
  PJSIP_SC_PUSH_NOTIFICATION_SERVICE_NOT_SUPPORTED = 555,
  PJSIP_SC_PRECONDITION_FAILURE = 580,

  PJSIP_SC_BUSY_EVERYWHERE = 600,
  PJSIP_SC_DECLINE = 603,
  PJSIP_SC_DOES_NOT_EXIST_ANYWHERE = 604,
  PJSIP_SC_NOT_ACCEPTABLE_ANYWHERE = 606,
  PJSIP_SC_UNWANTED = 607,
  PJSIP_SC_REJECTED = 608,

  PJSIP_SC_TSX_TIMEOUT = PJSIP_SC_REQUEST_TIMEOUT,
  /*PJSIP_SC_TSX_RESOLVE_ERROR = 702,*/
  PJSIP_SC_TSX_TRANSPORT_ERROR = PJSIP_SC_SERVICE_UNAVAILABLE,

  /* This is not an actual status code, but rather a constant
   * to force GCC to use 32bit to represent this enum, since
   * we have a code in PJSUA-LIB that assigns an integer
   * to this enum (see pjsua_acc_get_info() function).
   */
  PJSIP_SC__force_32bit = 0x7FFFFFFF

}

/* **************************************************************************/

/**
 * @addtogroup PJSIP_MSG_MEDIA Media/MIME Type
 * @brief Media/MIME type declaration and manipulations.
 * @ingroup PJSIP_MSG
 * @{
 */

/**
 * This structure describes SIP media type, as used for example in
 * Accept and Content-Type header..
 */
export interface pjsip_media_type {
  /**< Media type. */
  type: string;
  /**< Media subtype. */
  subtype: string;
  /**< Media type parameters */
  param: pjsip_param;
}

/* **************************************************************************/

/**
 * @addtogroup PJSIP_MSG_BODY Message Body
 * @brief SIP message body structures and manipulation.
 * @ingroup PJSIP_MSG
 * @{
 */

/**
 * Generic abstraction to message body.
 * When an incoming message is parsed (pjsip_parse_msg()), the parser fills in
 * all members with the appropriate value. The 'data' and 'len' member will
 * describe portion of incoming packet which denotes the message body.
 * When application needs to attach message body to outgoing SIP message, it
 * must fill in all members of this structure.
 */
export interface pjsip_msg_body {
  /** MIME content type.
   *  For incoming messages, the parser will fill in this member with the
   *  content type found in Content-Type header.
   *
   *  For outgoing messages, application may fill in this member with
   *  appropriate value, because the stack will generate Content-Type header
   *  based on the value specified here.
   *
   *  If the content_type is empty, no Content-Type AND Content-Length header
   *  will be added to the message. The stack assumes that application adds
   *  these headers themselves.
   */
  content_type: pjsip_media_type;

  /** Pointer to buffer which holds the message body data.
   *  For incoming messages, the parser will fill in this member with the
   *  pointer to the body string.
   *
   *  When sending outgoing message, this member doesn't need to point to the
   *  actual message body string. It can be assigned with arbitrary pointer,
   *  because the value will only need to be understood by the print_body()
   *  function. The stack itself will not try to interpret this value, but
   *  instead will always call the print_body() whenever it needs to get the
   *  actual body string.
   */
  data;

  /** The length of the data.
   *  For incoming messages, the parser will fill in this member with the
   *  actual length of message body.
   *
   *  When sending outgoing message, again just like the "data" member, the
   *  "len" member doesn't need to point to the actual length of the body
   *  string.
   */
  len: number;

  /** Pointer to function to print this message body.
   *  Application must set a proper function here when sending outgoing
   *  message.
   *
   *  @param msg_body      This structure itself.
   *  @param buf      The buffer.
   *  @param size      The buffer size.
   *
   *  @return        The length of the string printed, or -1 if there is
   *          not enough space in the buffer to print the whole
   *          message body.
   */
  print_body (msg_body: pjsip_msg_body, buf: string, size: number): number;

  /** Clone the data part only of this message body. Note that this only
   *  duplicates the data part of the body instead of the whole message
   *  body. If application wants to duplicate the entire message body
   *  structure, it must call #pjsip_msg_body_clone().
   *
   *  @param pool      Pool used to clone the data.
   *  @param data      The data inside message body, to be cloned.
   *  @param len      The length of the data.
   *
   *  @return        New data duplicated from the original data.
   */
  clone_data (pool, data, len: number);

}

/* **************************************************************************/
/**
 * @defgroup PJSIP_MSG_MSG Message Structure
 * @brief SIP message (request and response) structure and operations.
 * @ingroup PJSIP_MSG
 * @{
 */

/**
 * Message type (request or response).
 */
export enum pjsip_msg_type_e {
  /**< Indicates request message. */
  PJSIP_REQUEST_MSG,
  /**< Indicates response message. */
  PJSIP_RESPONSE_MSG
}

/**
 * This structure describes a SIP message.
 */
export interface pjsip_msg {
  /** Message type (ie request or response). */
  type: pjsip_msg_type_e;

  /** The first line of the message can be either request line for request
   *  messages, or status line for response messages. It is represented here
   *  as a union.
   */
  line: {
    /** Request Line. */
    req: pjsip_request_line;

    /** Status Line. */
    status: pjsip_status_line;
  };

  /** List of message headers. */
  hdr: pjsip_hdr;

  /** Pointer to message body, or NULL if no message body is attached to
   *  this mesage.
   */
  body: pjsip_msg_body;
};

/* **************************************************************************/

/**
 * @addtogroup PJSIP_MSG_HDR
 * @{
 */

/**
 * Generic SIP header, which contains hname and a string hvalue.
 * Note that this header is not supposed to be used as 'base' class for headers.
 */
export interface pjsip_generic_string_hdr {
  /** Standard header field. */
  PJSIP_DECL_HDR_MEMBER (pjsip_generic_string_hdr);

  /** hvalue */
  hvalue: string;
}

/* **************************************************************************/

/**
 * Generic SIP header, which contains hname and an integer ivalue.
 */
export interface pjsip_generic_int_hdr {
  /** Standard header field. */
  PJSIP_DECL_HDR_MEMBER (pjsip_generic_int_hdr);

  /** ivalue */
  ivalue: number;
}

/* **************************************************************************/

/** Maximum elements in the header array. */

/**
 * Generic array of string header.
 */
export interface pjsip_generic_array_hdr {
  /** Standard header fields. */
  PJSIP_DECL_HDR_MEMBER (pjsip_generic_array_hdr);

  /** Number of tags/elements. */
  count: number;

  /** Tags/elements. */
  values: string[];

}

/* **************************************************************************/

/** Accept header. */
export type  pjsip_accept_hdr = pjsip_generic_array_hdr;

/* **************************************************************************/

/**
 * Allow header.
 */
export type  pjsip_allow_hdr = pjsip_generic_array_hdr;

/* **************************************************************************/

/**
 * Call-ID header.
 */
export interface pjsip_cid_hdr {
  PJSIP_DECL_HDR_MEMBER (pjsip_cid_hdr);

  /**< Call-ID string. */
  id: string;
}

/* **************************************************************************/
/**
 * Content-Length header.
 */
export interface pjsip_clen_hdr {
  PJSIP_DECL_HDR_MEMBER (pjsip_clen_hdr);

  /**< Content length. */
  len: number;
}

/* **************************************************************************/
/**
 * CSeq header.
 */
export interface pjsip_cseq_hdr {
  PJSIP_DECL_HDR_MEMBER (pjsip_cseq_hdr);

  cseq: number;
  /**< CSeq number. */
  method: pjsip_method;	/**< CSeq method. */
}

/* **************************************************************************/

/** Expires not specified. */

/**
 * Contact header.
 * In this library, contact header only contains single URI. If a message has
 * multiple URI in the Contact header, the URI will be put in separate Contact
 * headers.
 */
export interface pjsip_contact_hdr {
  PJSIP_DECL_HDR_MEMBER (pjsip_contact_hdr);

  /**< The contact contains only a '*'
   character          */
  star: number;
  /**< URI in the contact.        */
  uri: pjsip_uri;
  /**< The "q" value times 1000
   (to avoid float)        */
  q1000: number;
  /**< Expires parameter, otherwise
   PJSIP_EXPIRES_NOT_SPECIFIED
   if not present.        */
  expires: number;
  /**< Other parameters, concatenated in
   a single string.        */
  other_param: pjsip_param;
}

/* **************************************************************************/
/**
 * Content-Type.
 */
export interface pjsip_ctype_hdr {
  PJSIP_DECL_HDR_MEMBER (pjsip_ctype_hdr);

  media: pjsip_media_type; /**< Media type. */
}

/* **************************************************************************/
/** Expires header. */
export type  pjsip_expires_hdr = pjsip_generic_int_hdr;

/* **************************************************************************/
/**
 * To or From header.
 */
export interface pjsip_fromto_hdr {
  PJSIP_DECL_HDR_MEMBER (pjsip_fromto_hdr);

  uri: pjsip_uri;
  /**< URI in From/To header. */
  tag: string;
  /**< Header "tag" parameter. */
  other_param: pjsip_param;   /**< Other params, concatenated as a single string. */
}

/** Alias for From header. */
export type  pjsip_from_hdr = pjsip_fromto_hdr;

/** Alias for To header. */
export type  pjsip_to_hdr = pjsip_fromto_hdr;

/* **************************************************************************/
/**
 * Max-Forwards header.
 */
export type  pjsip_max_fwd_hdr = pjsip_generic_int_hdr;

/* **************************************************************************/
/**
 * Min-Expires header.
 */
export type  pjsip_min_expires_hdr = pjsip_generic_int_hdr;

/* **************************************************************************/
/**
 * Record-Route and Route headers.
 */
export interface pjsip_routing_hdr {
  /**< Generic header fields. */
  PJSIP_DECL_HDR_MEMBER (pjsip_routing_hdr);

  /**< The URL in the Route/Record-Route header. */
  name_addr: pjsip_name_addr;
  /**< Other parameter. */
  other_param: pjsip_param;
}

/** Alias for Record-Route header. */
export type  pjsip_rr_hdr = pjsip_routing_hdr;

/** Alias for Route header. */
export type  pjsip_route_hdr = pjsip_routing_hdr;

/* **************************************************************************/
/**
 * Require header.
 */
export type  pjsip_require_hdr = pjsip_generic_array_hdr;

/* **************************************************************************/
/**
 * Retry-After header.
 */
export interface pjsip_retry_after_hdr {
  /** Standard header field. */
  PJSIP_DECL_HDR_MEMBER (pjsip_retry_after_hdr);

  ivalue: number;
  /**< Retry-After value      */
  param: pjsip_param;
  /**< Optional parameters    */
  comment: string;	/**< Optional comments.      */
}

/* **************************************************************************/
/**
 * Supported header.
 */
export type  pjsip_supported_hdr = pjsip_generic_array_hdr;

/* **************************************************************************/
/**
 * Unsupported header.
 */
export type  pjsip_unsupported_hdr = pjsip_generic_array_hdr;

/* **************************************************************************/
/**
 * SIP Via header.
 * In this implementation, Via header can only have one element in each header.
 * If a message arrives with multiple elements in a single Via, then they will
 * be split up into multiple Via headers.
 */
export interface pjsip_via_hdr {
  PJSIP_DECL_HDR_MEMBER (pjsip_via_hdr);

  /**< Transport type. */
  transport: string;
  /**< Host and optional port */
  sent_by: pjsip_host_port;
  /**< TTL parameter, or -1 if it's not specified. */
  ttl_param: number;
  /**< "rport" parameter, 0 to specify without port number, -1 means doesn't exist. */
  rport_param: number;
  /**< "maddr" parameter. */
  maddr_param: string;
  /**< "received" parameter. */
  recvd_param: string;
  /**< "branch" parameter. */
  branch_param: string;
  /**< Other parameters, concatenated as single string. */
  other_param: pjsip_param;
  /**< Comment. */
  comment: string;
}

/* **************************************************************************/
/**
 * SIP Warning header.
 * In this version, Warning header is just a typedef for generic string
 * header.
 */
export type  pjsip_warning_hdr = pjsip_generic_string_hdr;

/* **************************************************************************/
/** Accept-Encoding header. */
export type  pjsip_accept_encoding_hdr = pjsip_generic_string_hdr;

/** Accept-Language header. */
export type  pjsip_accept_lang_hdr = pjsip_generic_string_hdr;

/** Alert-Info header. */
export type  pjsip_alert_info_hdr = pjsip_generic_string_hdr;

/** Authentication-Info header. */
export type  pjsip_auth_info_hdr = pjsip_generic_string_hdr;

/** Call-Info header. */
export type  pjsip_call_info_hdr = pjsip_generic_string_hdr;

/** Content-Disposition header. */
export type  pjsip_content_disposition_hdr = pjsip_generic_string_hdr;

/** Content-Encoding header. */
export type  pjsip_content_encoding_hdr = pjsip_generic_string_hdr;

/** Content-Language header. */
export type  pjsip_content_lang_hdr = pjsip_generic_string_hdr;

/** Date header. */
export type  pjsip_date_hdr = pjsip_generic_string_hdr;

/** Error-Info header. */
export type  pjsip_err_info_hdr = pjsip_generic_string_hdr;

/** In-Reply-To header. */
export type  pjsip_in_reply_to_hdr = pjsip_generic_string_hdr;

/** MIME-Version header. */
export type  pjsip_mime_version_hdr = pjsip_generic_string_hdr;

/** Organization header. */
export type  pjsip_organization_hdr = pjsip_generic_string_hdr;

/** Priority header. */
export type  pjsip_priority_hdr = pjsip_generic_string_hdr;

/** Proxy-Require header. */
export type  pjsip_proxy_require_hdr = pjsip_generic_string_hdr;

/** Reply-To header. */
export type  pjsip_reply_to_hdr = pjsip_generic_string_hdr;

/** Server header. */
export type  pjsip_server_hdr = pjsip_generic_string_hdr;

/** Subject header. */
export type  pjsip_subject_hdr = pjsip_generic_string_hdr;

/** Timestamp header. */
export type  pjsip_timestamp_hdr = pjsip_generic_string_hdr;

/** User-Agent header. */
export type  pjsip_user_agent_hdr = pjsip_generic_string_hdr;
