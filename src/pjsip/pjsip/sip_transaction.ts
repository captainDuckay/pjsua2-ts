/**
 * This enumeration represents transaction state.
 */
import {
  char,
  int,
  pj_bool_t,
  pj_int32_t,
  pj_pool_t,
  pj_status_t,
  pj_str_t,
  pj_uint32_t,
  unsigned
} from "./c_types_to_ts";
import { pjsip_module } from "./sip_module";
import { pjsip_role_e } from "./sip_types";
import { pjsip_method } from "./sip_msg";
import { pjsip_tpselector, pjsip_transport, pjsip_tx_data } from "./sip_transport";
import { pjsip_response_addr } from "./sip_util";

export enum pjsip_tsx_state_e {
  PJSIP_TSX_STATE_NULL, /**< For UAC, before any message is sent.   */
  PJSIP_TSX_STATE_CALLING, /**< For UAC, just after request is sent.   */
  PJSIP_TSX_STATE_TRYING, /**< For UAS, just after request is received.*/
  PJSIP_TSX_STATE_PROCEEDING, /**< For UAS/UAC, after provisional response.*/
  PJSIP_TSX_STATE_COMPLETED, /**< For UAS/UAC, after final response.      */
  PJSIP_TSX_STATE_CONFIRMED, /**< For UAS, after ACK is received.      */
  PJSIP_TSX_STATE_TERMINATED, /**< For UAS/UAC, before it's destroyed.    */
  PJSIP_TSX_STATE_DESTROYED, /**< For UAS/UAC, will be destroyed now.    */
  PJSIP_TSX_STATE_MAX		/**< Number of states.          */
}

/**
 * This structure describes SIP transaction object. The transaction object
 * is used to handle both UAS and UAC transaction.
 */
export interface pjsip_transaction {
  /*
   * Administrivia
   */
  /**< Pool owned by the tsx. */
  pool: pj_pool_t;
  /**< Transaction user.      */
  tsx_user: pjsip_module;
  /**< Endpoint instance.     */
  endpt: pjsip_endpoint;
  /**< terminate() was called */
  terminating: pj_bool_t;
  /**< Transaction grp lock.  */
  grp_lock: pj_grp_lock_t;
  /**< Second mutex to avoid
   deadlock. It is used to
   protect timer.      */
  mutex_b: pj_mutex_t;

  /*
   * Transaction identification.
   */
  /**< Log info.  */
  obj_name: char;
  /**< Role (UAS or UAC)      */
  role: pjsip_role_e;
  /**< The method.            */
  method: pjsip_method;
  /**< The CSeq               */
  cseq: pj_int32_t;
  /**< Hash table key.        */
  transaction_key: pj_str_t;
  /**< Key's hashed value.    */
  hashed_key: pj_uint32_t;
  /**< The branch Id.         */
  branch: pj_str_t;

  /*
   * State and status.
   */
  /**< Last status code seen. */
  status_code: int;
  /**< Last reason phrase.    */
  status_text: pj_str_t;
  /**< State.                 */
  state: pjsip_tsx_state_e;
  /**< UAS 200/INVITE  retrsm.*/
  handle_200resp: int;
  /**< Tracing enabled?       */
  tracing: int;

  /** Handler according to current state. */
  state_handler (pjsip_transaction, pjsip_event): pj_status_t;

  /*
   * Transport.
   */
  /**< Transport to use.      */
  transport: pjsip_transport;
  /**< Transport is reliable. */
  is_reliable: pj_bool_t;
  /**< Destination address.   */
  addr: pj_sockaddr;
  /**< Address length.      */
  addr_len: int;
  /**< Response address.      */
  res_addr: pjsip_response_addr;
  /**< Miscelaneous flag.      */
  transport_flag: unsigned;
  /**< Internal error code.   */
  transport_err: pj_status_t;
  /**< Transport selector.    */
  tp_sel: pjsip_tpselector;
  /**< Tdata which caused
   pending transport flag
   to be set on tsx.      */
  pending_tx: pjsip_tx_data;
  /**< Transport state listener key.        */
  tp_st_key: pjsip_tp_state_listener_key;

  /*
   * Messages and timer.
   */
  /**< Msg kept for retrans.  */
  last_tx: pjsip_tx_data;
  /**< Retransmission count. */
  retransmit_count: int;
  /**< Retransmit timer.     */
  retransmit_timer: pj_timer_entry;
  /**< Timeout timer.         */
  timeout_timer: pj_timer_entry;

  /** Module specific data. */
  mod_data;
}
