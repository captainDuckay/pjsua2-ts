/**
 * This structure is used to describe dialog's participants, which in this
 * case is local party (i.e. us) and remote party.
 */
import { pjsip_cid_hdr, pjsip_contact_hdr, pjsip_fromto_hdr, pjsip_hdr, pjsip_route_hdr } from "./sip_msg";
import { char, int, pj_bool_t, pj_int32_t, pj_pool_t, pj_str_t, pj_uint32_t, unsigned } from "./c_types_to_ts";
import { pjsip_target_set } from "./sip_util";
import { pjsip_host_port, pjsip_role_e } from "./sip_types";
import { pjsip_tpselector } from "./sip_transport";
import { pjsip_module } from "./sip_module";

export interface pjsip_dlg_party {
  info: pjsip_fromto_hdr;
  /**< From/To header, inc tag.  */
  info_str: pj_str_t;
  /**< String rep of info header.  */
  tag_hval: pj_uint32_t;
  /**< Hashed value of the tag.  */
  contact: pjsip_contact_hdr;
  /**< Contact header.    */
  first_cseq: pj_int32_t;
  /**< First CSeq seen.    */
  cseq: pj_int32_t;	    /**< Next sequence number.    */
}

/**
 * Dialog state.
 */
export enum pjsip_dialog_state {
  /** Dialog is not established. */
  PJSIP_DIALOG_STATE_NULL,

  /** Dialog has been established (probably early) */
  PJSIP_DIALOG_STATE_ESTABLISHED
}

/**
 * Dialog capability status.
 */
export enum pjsip_dialog_cap_status {
  /** Capability is unsupported. */
  PJSIP_DIALOG_CAP_UNSUPPORTED = 0,

  /** Capability is supported */
  PJSIP_DIALOG_CAP_SUPPORTED = 1,

  /**
   *  Unknown capability status. This is usually because we lack the
   *  capability info which is retrieved from capability header specified
   *  in the dialog messages.
   */
  PJSIP_DIALOG_CAP_UNKNOWN = 2
}

/**
 * This structure describes the dialog structure. Application MUST NOT
 * try to SET the values here directly, but instead it MUST use the
 * appropriate dialog API. The dialog declaration only needs to be made
 * visible because other PJSIP modules need to see it (e.g. INVITE session,
 * the event framework, etc.).
 *
 * Application MAY READ the dialog contents directly after it acquires
 * dialog lock.
 *
 * To acquire dialog lock, use #pjsip_dlg_inc_lock(), and to release it,
 * use #pjsip_dlg_dec_lock(). DO NOT USE pj_mutex_lock()/pj_mutex_unlock()
 * on the dialog's mutex directly, because this will not protect against
 * dialog being destroyed.
 */
export interface pjsip_dialog {

  /* Dialog's system properties. */
  /**< Standard id.      */
  obj_name: char;
  /**< Dialog's pool.          */
  pool: pj_pool_t;
  /**< User agent instance.        */
  ua: pjsip_user_agent;
  /**< Endpoint instance.        */
  endpt: pjsip_endpoint;
  /**< Dialog's grp lock. Do not call!!
   Use pjsip_dlg_inc_lock() instead!  */
  grp_lock_: pj_grp_lock_t;

  /** The dialog set which this dialog belongs (opaque type). */
  dlg_set;

  /* Dialog's session properties. */
  /**< Dialog state.          */
  state: pjsip_dialog_state;
  /**< Current target.        */
  target: pjsip_uri;
  /**< Target set, for UAC only.      */
  target_set: pjsip_target_set;
  /**< Headers from hparam in dest URL    */
  inv_hdr: pjsip_hdr;
  /**< Local party info.        */
  local: pjsip_dlg_party;
  /**< Remote party info.        */
  remote: pjsip_dlg_party;
  /**< List of remote capability header.  */
  rem_cap_hdr: pjsip_hdr;
  /**< Initial role.          */
  role: pjsip_role_e;
  /**< UAC has received 2xx response?      */
  uac_has_2xx: pj_bool_t;
  /**< Use secure transport?        */
  secure: pj_bool_t;
  /**< Add Allow header in requests?      */
  add_allow: pj_bool_t;
  /**< Call-ID header.        */
  call_id: pjsip_cid_hdr;
  /**< Route set.          */
  route_set: pjsip_route_hdr;
  /**< Route set has been set.      */
  route_set_frozen: pj_bool_t;
  /**< Client authentication session.      */
  auth_sess: pjsip_auth_clt_sess;
  /**< Initial destination host.        */
  initial_dest: pj_str_t;

  /** Session counter. */
  sess_count: int;
  /**< Number of pending transactions.    */
  tsx_count: int;

  /** Transport selector. */
  tp_sel: pjsip_tpselector;

  /* Dialog usages. */
  /**< Number of registered usages.      */
  usage_cnt: unsigned;
  /**< Array of usages,
   priority sorted        */
  usage: pjsip_module;

  /** Module specific data. */
  mod_data;

  /**
   * If via_addr is set, it will be used as the "sent-by" field of the
   * Via header for outgoing requests as long as the request uses via_tp
   * transport. Normally application should not use or access these fields.
   */
  via_addr: pjsip_host_port;
  /**< Via transport.                      */
  via_tp;
}

/**
 * The parameter for \a pjsip_dlg_create_uac2().
 */
export interface pjsip_dlg_create_uac_param {
  /**
   * The user agent module instance.
   */
  ua: pjsip_user_agent;

  /**
   * Dialog local URI (i.e. From header).
   */
  local_uri: pj_str_t;

  /**
   * Optional dialog local Contact to be put as Contact header value,
   * hence the format must follow RFC 3261 Section 20.10:
   * When the header field value contains a display name, the URI including
   * all URI parameters is enclosed in "<" and ">".  If no "<" and ">" are
   * present, all parameters after the URI are header parameters, not
   * URI parameters.  The display name can be tokens, or a quoted string,
   * if a larger character set is desired. If this argument is NULL,
   * the Contact will be taken from the local URI.
   */
  local_contact: pj_str_t;

  /**
   * Dialog remote URI (i.e. To header).
   */
  remote_uri: pj_str_t;

  /**
   * Optional initial remote target. If this argument is NULL, the initial
   * target will be set to remote URI.
   */
  target: pj_str_t;

  /**
   * Optional group lock to use by this dialog. If the value is NULL,
   * the dialog will create its own group lock.
   */
  grp_lock: pj_grp_lock_t;

}

