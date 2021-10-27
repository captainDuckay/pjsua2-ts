/**
 * URI Parsing options.
 */
import { int, pj_pool_t, pj_str_t } from "./c_types_to_ts";
import { pjsip_rx_data } from "./sip_transport";

/**
 * Parser syntax error exception value.
 */
export type  PJSIP_SYN_ERR_EXCEPTION = int;

/**
 * Invalid value error exception value.
 */
export type  PJSIP_EINVAL_ERR_EXCEPTION = int;

/**
 * This structure is used to get error reporting from parser.
 */
export interface pjsip_parser_err_report {
  except_code: int;
  /**< Error exception (e.g. PJSIP_SYN_ERR_EXCEPTION) */
  line: int;
  /**< Line number. */
  col: int;
  /**< Column number. */
  hname: pj_str_t;		/**< Header name, if any. */
}

/**
 * Parsing context, the default argument for parsing functions.
 */
export interface pjsip_parse_ctx {
  scanner: pj_scanner;
  /**< The scanner.       */
  pool: pj_pool_t;
  /**< The pool.          */
  rdata: pjsip_rx_data;     /**< Optional rdata.    */
}

/**
 * Parser constants. @see pjsip_parser_const()
 */
export interface pjsip_parser_const_t {
  pjsip_USER_STR: pj_str_t;
  /**< "user" string constant.    */
  pjsip_METHOD_STR: pj_str_t;
  /**< "method" string constant   */
  pjsip_TRANSPORT_STR: pj_str_t;
  /**< "transport" string const.  */
  pjsip_MADDR_STR: pj_str_t;
  /**< "maddr" string const.  */
  pjsip_LR_STR: pj_str_t;
  /**< "lr" string const.    */
  pjsip_SIP_STR: pj_str_t;
  /**< "sip" string constant.  */
  pjsip_SIPS_STR: pj_str_t;
  /**< "sips" string constant.    */
  pjsip_TEL_STR: pj_str_t;
  /**< "tel" string constant.  */
  pjsip_BRANCH_STR: pj_str_t;
  /**< "branch" string constant.  */
  pjsip_TTL_STR: pj_str_t;
  /**< "ttl" string constant.  */
  pjsip_RECEIVED_STR: pj_str_t;
  /**< "received" string const.   */
  pjsip_Q_STR: pj_str_t;
  /**< "q" string constant.  */
  pjsip_EXPIRES_STR: pj_str_t;
  /**< "expires" string constant. */
  pjsip_TAG_STR: pj_str_t;
  /**< "tag" string constant.  */
  pjsip_RPORT_STR: pj_str_t;
  /**< "rport" string const.  */

  pjsip_HOST_SPEC: pj_cis_t;
  /**< For scanning host part.  */
  pjsip_DIGIT_SPEC: pj_cis_t;
  /**< Decimal digits    */
  pjsip_ALPHA_SPEC: pj_cis_t;
  /**< Alpha (A-Z, a-z)    */
  pjsip_ALNUM_SPEC: pj_cis_t;
  /**< Decimal + Alpha.    */
  pjsip_TOKEN_SPEC: pj_cis_t;
  /**< Token.      */
  pjsip_TOKEN_SPEC_ESC: pj_cis_t;
  /**< Token without '%' character */
  pjsip_VIA_PARAM_SPEC: pj_cis_t;
  /**< Via param is token + ":" for
   IPv6.      */
  pjsip_VIA_PARAM_SPEC_ESC: pj_cis_t;
  /**< .. as above without '%'  */
  pjsip_HEX_SPEC: pj_cis_t;
  /**< Hexadecimal digits.  */
  pjsip_PARAM_CHAR_SPEC: pj_cis_t;
  /**< For scanning pname (or pvalue
   when it's  not quoted.) in URI */
  pjsip_PARAM_CHAR_SPEC_ESC: pj_cis_t;
  /**< Variant without the escape ('%')
   char      */
  pjsip_HDR_CHAR_SPEC: pj_cis_t;
  /**< Chars in hname/havalue in URL. */
  pjsip_HDR_CHAR_SPEC_ESC: pj_cis_t;
  /**< Variant without the escape ('%')
   char      */
  pjsip_PROBE_USER_HOST_SPEC: pj_cis_t;
  /**< Hostname characters.  */
  pjsip_PASSWD_SPEC: pj_cis_t;
  /**< Password.      */
  pjsip_PASSWD_SPEC_ESC: pj_cis_t;
  /**< Variant without the escape ('%')
   char      */
  pjsip_USER_SPEC: pj_cis_t;
  /**< User */
  pjsip_USER_SPEC_ESC: pj_cis_t;
  /**< Variant without the escape ('%')
   char      */
  pjsip_USER_SPEC_LENIENT: pj_cis_t;
  /**< User, with additional '#' char */
  pjsip_USER_SPEC_LENIENT_ESC: pj_cis_t;
  /**< pjsip_USER_SPEC_ESC with '#' */
  pjsip_NOT_NEWLINE: pj_cis_t;
  /**< For eating up header, basically
   any chars except newlines or
   zero.      */
  pjsip_NOT_COMMA_OR_NEWLINE: pj_cis_t;
  /**< Array elements.    */
  pjsip_DISPLAY_SPEC: pj_cis_t;
  /**< Used when searching for display
   name.      */
  pjsip_OTHER_URI_CONTENT: pj_cis_t;	/**< Generic URI content.  */

}
