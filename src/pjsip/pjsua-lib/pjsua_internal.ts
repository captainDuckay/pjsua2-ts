/**
 * Call's media stream.
 */
import {
  char,
  int,
  pj_bool_t, pj_oshandle_t, pj_pool_t, pj_status_t,
  pj_str_t,
  pj_timestamp,
  pj_uint16_t,
  pj_uint32_t,
  pj_uint8_t,
  unsigned
} from "../pjsip/c_types_to_ts";
import {
  pj_stun_resolve_cb,
  pjsua_acc_config,
  pjsua_acc_id, pjsua_call_hold_type,
  pjsua_call_id, pjsua_call_setting,
  pjsua_conf_port_id, pjsua_config, pjsua_logging_config,
  pjsua_med_tp_st,
  pjsua_med_tp_state_cb, pjsua_med_tp_state_info, pjsua_media_config,
  pjsua_vid_win_id
} from "./pjsua";
import { pjmedia_dir, pjmedia_type } from "../pjsua2/types";
import { pjsip_route_hdr, pjsip_status_code } from "../pjsip/sip_msg";
import { pjsip_dialog } from "../pjsip/sip_dialog";
import { pjsip_rx_data, pjsip_tpfactory, pjsip_transport } from "../pjsip/sip_transport";
import { pjsip_host_port, pjsip_transport_type_e } from "../pjsip/sip_types";
import { pjsip_cred_info } from "../pjsip/sip_auth";
import { pjsip_module } from "../pjsip/sip_module";

export interface pjsua_call_media {
  call: pjsua_call;
  /**< Parent call.          */
  type: pjmedia_type;
  /**< Media type.          */
  idx: unsigned;
  /**< This media index in parent call.   */
  rem_mid: pj_str_t;
  /**< Remote SDP "a=mid" attribute.      */
  state: pjsua_call_media_status;
  /**< Media state.          */
  prev_state: pjsua_call_media_status;
  /**< Previous media state.           */
  def_dir: pjmedia_dir;
  /**< Default media direction.      */
  dir: pjmedia_dir;       /**< Current media direction.      */

  /** The stream */
  strm: {
    /** Audio stream */
    a: {
      stream: pjmedia_stream; /**< The audio stream.        */
      media_port: pjmedia_port; /**< The media port.                 */
      destroy_port: pj_bool_t; /**< Destroy the media port?      */
      conf_slot: int; /**< Slot # in conference bridge.    */
    };

    /** Video stream */
    v: {
      stream: pjmedia_vid_stream; /**< The video stream.      */
      strm_enc_slot: pjsua_conf_port_id; /**< Stream encode slot      */
      strm_dec_slot: pjsua_conf_port_id; /**< Stream decode slot      */
      cap_win_id: pjsua_vid_win_id; /**< The video capture window   */
      rdr_win_id: pjsua_vid_win_id; /**< The video render window    */
      cap_dev: pjmedia_vid_dev_index; /**< The video capture device   */
      rdr_dev: pjmedia_vid_dev_index;  /**< The video-in render device */
    };

  };

  ssrc: pj_uint32_t;
  /**< RTP SSRC          */
  rtp_tx_ts: pj_uint32_t;
  /**< Initial RTP timestamp for sender.  */
  rtp_tx_seq: pj_uint16_t;
  /**< Initial RTP sequence for sender.   */
  rtp_tx_seq_ts_set: pj_uint8_t;
  /**< Bitmask flags if initial RTP sequence
   and/or timestamp for sender are set.
   bit 0/LSB : sequence flag
   bit 1     : timestamp flag      */

  tp: pjmedia_transport;
  /**< Current media transport (can be 0) */
  tp_ready: pj_status_t;
  /**< Media transport status.      */
  tp_result: pj_status_t;
  /**< Media transport creation result.   */
  tp_orig: pjmedia_transport;
  /**< Original media transport      */
  tp_auto_del: pj_bool_t;
  /**< May delete media transport       */
  tp_st: pjsua_med_tp_st;
  /**< Media transport state        */
  use_custom_med_tp: pj_bool_t;
  /**< Use custom media transport? */
  enable_rtcp_mux: pj_bool_t;
  /**< Enable RTP& RTCP multiplexing?*/
  rtp_addr: pj_sockaddr;
  /**< Current RTP source address
   (used to update ICE default
   address)          */
  rem_srtp_use: pjmedia_srtp_use;
  /**< Remote's SRTP usage policy.      */
  last_req_keyframe: pj_timestamp;
  /**< Last TX keyframe request.   */

  med_init_cb: pjsua_med_tp_state_cb;/**< Media transport
   initialization callback.    */

  /** Media transport creation callback. */
  med_create_cb (call_med: pjsua_call_media, status: pj_status_t, security_level: int, sip_err_code: int): pj_status_t;
}

/* Call answer's list. */
export interface call_answer {
  msg_data: pjsua_msg_data;
  /**< Answer's headers list.       */
  reason: pj_str_t;
  /**< Answer's reason phrase.      */
  code: unsigned;
  /**< Answer's status code.        */
  opt: pjsua_call_setting;	    /**< Answer's call setting.        */
}

/* Generic states */
export enum pjsua_op_state {
  PJSUA_OP_STATE_NULL,
  PJSUA_OP_STATE_READY,
  PJSUA_OP_STATE_RUNNING,
  PJSUA_OP_STATE_DONE,
}

/**
 * Structure to be attached to invite dialog.
 * Given a dialog "dlg", application can retrieve this structure
 * by accessing dlg->mod_data[pjsua.mod.id].
 */
export interface pjsua_call {
  index: unsigned;
  /**< Index in pjsua array.        */
  opt: pjsua_call_setting;
  /**< Call setting.          */
  opt_inited: pj_bool_t;
  /**< Initial call setting has been set,
   to avoid different opt in answer.  */
  inv: pjsip_inv_session;
  /**< The invite session.        */
  user_data;
  /**< User/application data.        */
  last_code: pjsip_status_code;
  /**< Last status code seen.        */
  last_text: pj_str_t;
  /**< Last status text seen.        */
  start_time: pj_time_val;
  /**< First INVITE sent/received.      */
  res_time: pj_time_val;
  /**< First response sent/received.      */
  conn_time: pj_time_val;
  /**< Connected/confirmed time.      */
  dis_time: pj_time_val;
  /**< Disconnect time.        */
  acc_id: pjsua_acc_id;
  /**< Account index being used.      */
  secure_level: int;
  /**< Signaling security level.      */
  call_hold_type: pjsua_call_hold_type;
  /**< How to do call hold.      */
  local_hold: pj_bool_t;
  /**< Flag for call-hold by local.      */
  hold_msg;
  /**< Outgoing hold tx_data.        */
  cname: pj_str_t;
  /**< RTCP CNAME.          */
  cname_buf: char;
  /**< cname buffer.        */

  med_cnt: unsigned;
  /**< Number of media in SDP.      */
  media: pjsua_call_media[];
  /**< Array of media   */
  med_prov_cnt: unsigned;
  /**< Number of provisional media.      */
  media_prov: pjsua_call_media[];
  /**< Array of provisional media.      */
  med_update_success: pj_bool_t;
  /**< Is media update successful?      */
  hanging_up: pj_bool_t;
  /**< Is call in the process of hangup?  */

  audio_idx: int;
  /**< First active audio media.      */
  med_ch_mutex: pj_mutex_t;
  /**< Media channel callback's mutex.  */
  med_ch_cb: pjsua_med_tp_state_cb;
  /**< Media channel callback.      */
  med_ch_info: pjsua_med_tp_state_info;
  /**< Media channel info.            */

  xfer_sub: pjsip_evsub;
  /**< Xfer server subscription, if this
   call was triggered by xfer.      */
  rem_nat_type: pj_stun_nat_type;
  /**< NAT type of remote endpoint.    */

  last_text_buf: char;
  /**< Buffer for last_text.        */

  lock_codec: {
    retry_cnt: int;  /**< Retry count.          */
  };
  /**< Data for codec locking when answer
   contains multiple codecs.      */

  async_call: {
    dlg: pjsip_dialog; /**< Call dialog.                      */
    rem_sdp: pjmedia_sdp_session; /**< Remote SDP.                       */
    pool_prov: pj_pool_t; /**< Provisional pool.               */
    med_ch_deinit: pj_bool_t; /**< Media channel de-init-ed?   */
    call_var: {
      out_call: {
        msg_data: pjsua_msg_data; /**< Headers for outgoing INVITE. */
        hangup: pj_bool_t;  /**< Call is hangup?              */
      };
      inc_call: {
        answers: call_answer; /**< A list of call answers.       */
        hangup: pj_bool_t; /**< Call is hangup?        */
        replaced_dlg: pjsip_dialog; /**< Replaced dialog.      */
      };
    };
  };
  /**< Temporary storage for async
   outgoing/incoming call.         */

  rem_offerer: pj_bool_t;
  /**< Was remote SDP offerer?      */
  rem_aud_cnt: unsigned;
  /**< No of active audio in last remote
   offer.          */
  rem_vid_cnt: unsigned;
  /**< No of active video in last remote
   offer.          */

  rx_reinv_async: pj_bool_t;
  /**< on_call_rx_reinvite() async.   */
  reinv_timer: pj_timer_entry;
  /**< Reinvite retry timer.      */
  reinv_pending: pj_bool_t;
  /**< Pending until CONFIRMED state.  */
  reinv_ice_sent: pj_bool_t;
  /**< Has reinvite for ICE upd sent? */
  incoming_data: pjsip_rx_data;
  /**< Cloned incoming call rdata.
   On pjsua2, when handling incoming
   call, onCreateMediaTransport() will
   not be called since the call isn't
   created yet. This temporary
   variable is used to handle such
   case, see ticket #1916.      */

  trickle_ice: {
    enabled: pj_bool_t;
    remote_sup: pj_bool_t;
    remote_dlg_est: pj_bool_t;
    trickling: pjsua_op_state;
    retrans18x_count: int;
    pending_info: pj_bool_t
    timer: pj_timer_entry;
  };

  hangup_timer: pj_timer_entry;
  /**< Hangup retry timer.      */
  hangup_retry: unsigned;
  /**< Number of hangup retries.      */
  hangup_code: unsigned;
  /**< Hangup code.            */
  hangup_reason: pj_str_t;
  /**< Hangup reason.            */
  hangup_msg_data: pjsua_msg_data;/**< Hangup message data.      */
};

/**
 * Server presence subscription list head.
 */
export interface pjsua_srv_pres {
  sub: pjsip_evsub;
  /**< The evsub.          */
  remote: char;
  /**< Remote URI.          */
  acc_id: int;
  /**< Account ID.          */
  dlg: pjsip_dialog;
  /**< Dialog.          */
  expires: unsigned;	    /**< "expires" value in the request,
   PJSIP_EXPIRES_NOT_SPECIFIED
   if not present.            */
};

/**
 * Account
 */
export interface pjsua_acc {
  pool: pj_pool_t;
  /**< Pool for this account.    */
  cfg: pjsua_acc_config;
  /**< Account configuration.    */
  valid: pj_bool_t;
  /**< Is this account valid?    */

  index: int;
  /**< Index in accounts array.  */
  display: pj_str_t;
  /**< Display name, if any.    */
  user_part: pj_str_t;
  /**< User part of local URI.  */
  is_sips: pj_bool_t;
  /**< Local URI uses "sips"?    */
  contact: pj_str_t;
  /**< Our Contact header.    */
  reg_contact: pj_str_t;
  /**< Contact header for REGISTER.
   It may be different than acc
   contact if outbound is used    */
  contact_rewritten: pj_bool_t;
  /**< Contact rewrite has been done? */
  via_addr: pjsip_host_port;
  /**< Address for Via header         */
  via_tp: pjsip_transport;
  /**< Transport associated with
   the Via address                */

  srv_domain: pj_str_t;
  /**< Host part of reg server.  */
  srv_port: int;
  /**< Port number of reg server.  */

  regc: pjsip_regc;
  /**< Client registration session.   */
  reg_last_err: pj_status_t;
  /**< Last registration error.  */
  reg_last_code: int;
  /**< Last status last register.  */

  reg_mapped_addr: pj_str_t;
  /**< Our addr as seen by reg srv.
   Only if allow_sdp_nat_rewrite
   is set                        */

  auto_rereg: {
    active: pj_bool_t; /**< Flag of reregister status.  */
    timer: pj_timer_entry; /**< Timer for reregistration.  */
    reg_tp; /**< Transport for registration.  */
    attempt_cnt: unsigned; /**< Attempt counter.    */
  };
  /**< Reregister/reconnect data.  */

  ka_timer: pj_timer_entry;
  /**< Keep-alive timer for UDP.  */
  ka_transport: pjsip_transport;
  /**< Transport for keep-alive.  */
  ka_target: pj_sockaddr;
  /**< Destination address for K-A  */
  ka_target_len: unsigned;
  /**< Length of ka_target.    */

  route_set: pjsip_route_hdr;
  /**< Complete route set inc. outbnd.*/
  global_route_crc: pj_uint32_t;
  /** CRC of global route setting. */
  local_route_crc: pj_uint32_t;
  /** CRC of account route setting.*/

  rfc5626_status: unsigned;
  /**< SIP outbound status:
   0: not used
   1: requested
   2: acknowledged by servers   */
  rfc5626_instprm: pj_str_t;
  /**< SIP outbound instance param.  */
  rfc5626_regprm: pj_str_t;
  /**< SIP outbound reg param.        */

  cred_cnt: unsigned;
  /**< Number of credentials.    */
  cred: pjsip_cred_info[];
  /**< Complete creds.  */

  online_status: pj_bool_t;
  /**< Our online status.    */
  rpid: pjrpid_element;
  /**< RPID element information.  */
  pres_srv_list: pjsua_srv_pres;
  /**< Server subscription list.  */
  publish_sess: pjsip_publishc;
  /**< Client publication session.  */
  publish_state: pj_bool_t;
  /**< Last published online status  */

  mwi_sub: pjsip_evsub;
  /**< MWI client subscription  */
  mwi_dlg: pjsip_dialog;
  /**< Dialog for MWI sub.    */

  next_rtp_port: pj_uint16_t;
  /**< Next RTP port to be used.      */
  tp_type: pjsip_transport_type_e;
  /**< Transport type (for local acc or
   transport binding)    */
  ip_change_op: pjsua_ip_change_op;/**< IP change process progress.  */
}

/**
 *Transport.
 */
export interface pjsua_transport_data {
  index: int;
  type: pjsip_transport_type_e;
  local_name: pjsip_host_port;

  data: {
    tp: pjsip_transport;
    factory: pjsip_tpfactory;
    ptr;
  };

  is_restarting: pj_bool_t;
  restart_status: pj_status_t;
  has_bound_addr: pj_bool_t;
}

/**
 * Buddy data.
 */
export interface pjsua_buddy {
  pool: pj_pool_t;
  /**< Pool for this buddy.    */
  index: unsigned;
  /**< Buddy index.      */
  user_data;
  /**< Application data.    */
  uri: pj_str_t;
  /**< Buddy URI.      */
  contact: pj_str_t;
  /**< Contact learned from subscrp.  */
  name: pj_str_t;
  /**< Buddy name.      */
  display: pj_str_t;
  /**< Buddy display name.    */
  host: pj_str_t;
  /**< Buddy host.      */
  port: unsigned;
  /**< Buddy port.      */
  monitor: pj_bool_t;
  /**< Should we monitor?    */
  dlg: pjsip_dialog;
  /**< The underlying dialog.    */
  sub: pjsip_evsub;
  /**< Buddy presence subscription  */
  term_code: unsigned;
  /**< Subscription termination code  */
  term_reason: pj_str_t;
  /**< Subscription termination reason */
  status: pjsip_pres_status;
  /**< Buddy presence status.    */
  timer: pj_timer_entry;	    /**< Resubscription timer    */
}

/**
 * File player/recorder data.
 */
export interface pjsua_file_data {
  type: pj_bool_t;  /* 0=player, 1=playlist */
  port: pjmedia_port;
  pool: pj_pool_t;
  slot: unsigned;
}

/**
 * Additional parameters for conference bridge.
 */
export interface pjsua_conf_setting {
  channel_count: unsigned;
  samples_per_frame: unsigned;
  bits_per_sample: unsigned;
}

export interface pjsua_stun_resolve {

  pool: pj_pool_t;
  /**< Pool        */
  ref_cnt: int;
  /**< Reference count    */
  destroy_flag: pj_bool_t;
  /**< To be destroyed */
  has_result: pj_bool_t;
  count: unsigned;
  /**< # of entries      */
  srv: pj_str_t;
  /**< Array of entries   */
  idx: unsigned;
  /**< Current index      */
  token;
  /**< App token      */
  cb: pj_stun_resolve_cb;
  /**< App callback      */
  blocking: pj_bool_t;
  /**< Blocking?      */
  waiter: pj_thread_t;
  /**< Waiting thread      */
  timer: pj_timer_entry;
  /**< Destroy timer      */
  status: pj_status_t;
  /**< Session status      */
  addr: pj_sockaddr;
  /**< Result        */
  stun_sock: pj_stun_sock;
  /**< Testing STUN sock  */
  af: int;
  /**< Address family      */
  async_wait: pj_bool_t;/**< Async resolution
   of STUN entry      */
}

/* See also pjsua_vid_win_type_name() */
export enum pjsua_vid_win_type {
  PJSUA_WND_TYPE_NONE,
  PJSUA_WND_TYPE_PREVIEW,
  PJSUA_WND_TYPE_STREAM
}

pjsua_vid_win_type;

export interface pjsua_vid_win {
  type: pjsua_vid_win_type;
  /**< Type.    */
  pool: pj_pool_t;
  /**< Own pool.    */
  ref_cnt: unsigned;
  /**< Reference counter.  */
  vp_cap: pjmedia_vid_port;
  /**< Capture vidport.  */
  vp_rend: pjmedia_vid_port;
  /**< Renderer vidport  */
  cap_slot: pjsua_conf_port_id;
  /**< Capturer conf slot */
  rend_slot: pjsua_conf_port_id;
  /**< Renderer conf slot */
  preview_cap_id: pjmedia_vid_dev_index;
  /**< Capture dev id  */
  preview_running: pj_bool_t;
  /**< Preview is started*/
  is_native: pj_bool_t; 	/**< Preview is by dev  */
}

export interface pjsua_timer_list {
  entry: pj_timer_entry;

  cb (user_data);

  user_data;
}

export interface pjsua_event_list {
  event: pjmedia_event;
  call_id: pjsua_call_id;
  med_idx: unsigned;
}

/**
 * Global pjsua application data.
 */
export interface pjsua_data {

  /* Control: */
  cp: pj_caching_pool;
  /**< Global pool factory.    */
  pool: pj_pool_t;
  /**< pjsua's private pool.    */
  timer_pool: pj_pool_t;
  /**< pjsua's timer pool.    */
  mutex: pj_mutex_t;
  /**< Mutex protection for this data  */
  mutex_nesting_level: unsigned;
  /**< Mutex nesting level.  */
  mutex_owner: pj_thread_t;
  /**< Mutex owner.      */
  state: pjsua_state;	    /**< Library state.      */

  /* Logging: */
  log_cfg: pjsua_logging_config;
  /**< Current logging config.  */
  log_file: pj_oshandle_t;  /**<Output log file handle    */

  /* SIP: */
  endpt: pjsip_endpoint;
  /**< Global endpoint.    */
  mod: pjsip_module;
  /**< pjsua's PJSIP module.    */
  tpdata: pjsua_transport_data[];
  /**< Array of transports.    */
  old_tp_cb: pjsip_tp_state_callback; /**< Old transport callback.  */

  /* Threading: */
  thread_quit_flag: pj_bool_t;
  /**< Thread quit flag.  */
  thread: pj_thread_t[];	    /**< Array of threads.  */

  /* STUN and resolver */
  stun_cfg: pj_stun_config;
  /**< Global STUN settings.    */
  stun_srv: pj_sockaddr;
  /**< Resolved STUN server address  */
  stun_status: pj_status_t;
  /**< STUN server status.    */
  stun_res: pjsua_stun_resolve;
  /**< List of pending STUN resolution*/
  stun_srv_idx: unsigned;
  /**< Resolved STUN server index  */
  stun_opt: unsigned;
  /**< STUN resolution option.  */
  resolver: pj_dns_resolver;  /**< DNS resolver.      */

  /* Detected NAT type */
  nat_type: pj_stun_nat_type;
  /**< NAT type.      */
  nat_status: pj_status_t;
  /**< Detection status.    */
  nat_in_progress: pj_bool_t; /**< Detection in progress  */

  /* List of outbound proxies: */
  outbound_proxy: pjsip_route_hdr;

  /* Account: */
  acc_cnt: unsigned;
  /**< Number of accounts.  */
  default_acc: pjsua_acc_id;
  /**< Default account ID  */
  acc: pjsua_acc[];
  /**< Account array.  */
  acc_ids: pjsua_acc_id[]; /**< Acc sorted by prio*/

  /* Calls: */
  ua_cfg: pjsua_config;
  /**< UA config.    */
  call_cnt: unsigned;
  /**< Call counter.  */
  calls: pjsua_call[];
  /**< Calls array.  */
  next_call_id: pjsua_call_id;		/**< Next call id to use*/

  /* Buddy; */
  buddy_cnt: unsigned;
  /**< Buddy count.  */
  buddy: pjsua_buddy[];  /**< Buddy array.  */

  /* Presence: */
  pres_timer: pj_timer_entry;/**< Presence refresh timer.  */

  /* Media: */
  media_cfg: pjsua_media_config;
  /**< Media config.      */
  med_endpt: pjmedia_endpt;
  /**< Media endpoint.    */
  mconf_cfg: pjsua_conf_setting;
  /**< Additionan conf. bridge. param */
  mconf: pjmedia_conf;
  /**< Conference bridge.    */
  is_mswitch: pj_bool_t;/**< Are we using audio switchboard
   (a.k.a APS-Direct)    */

  /* Sound device */
  cap_dev: pjmedia_aud_dev_index;
  /**< Capture device ID.    */
  play_dev: pjmedia_aud_dev_index;
  /**< Playback device ID.    */
  aud_svmask: pj_uint32_t;
  /**< Which settings to save    */
  aud_param: pjmedia_aud_param;
  /**< User settings to sound dev  */
  aud_open_cnt: pj_bool_t;
  /**< How many # device is opened  */
  no_snd: pj_bool_t;
  /**< No sound (app will manage it)  */
  snd_pool: pj_pool_t;
  /**< Sound's private pool.    */
  snd_port: pjmedia_snd_port;
  /**< Sound port.      */
  snd_idle_timer: pj_timer_entry;
  /**< Sound device idle timer.  */
  null_snd: pjmedia_master_port;
  /**< Master port for null sound.  */
  null_port: pjmedia_port;
  /**< Null port.      */
  snd_is_on: pj_bool_t;
  /**< Media flow is currently active */
  snd_mode: unsigned;  /**< Sound device mode.    */

  /* Video device */
  vcap_dev: pjmedia_vid_dev_index;
  /**< Capture device ID.    */
  vrdr_dev: pjmedia_vid_dev_index;  /**< Playback device ID.    */

  /* For keeping video device settings */
  vid_conf: pjmedia_vid_conf;
  vid_caps: pj_uint32_t[];
  vid_param: pjmedia_vid_dev_param[];

  /* File players: */
  player_cnt: unsigned;
  /**< Number of file players.  */
  player: pjsua_file_data[];/**< Array of players.*/

  /* File recorders: */
  rec_cnt: unsigned;
  /**< Number of file recorders.  */
  recorder: pjsua_file_data[];/**< Array of recs.*/

  /* Video windows */
  win: pjsua_vid_win[]; /**< Array of windows  */

  /* Timer entry and event list */
  active_timer_list: pjsua_timer_list;
  timer_list: pjsua_timer_list;
  event_list: pjsua_event_list;
  timer_mutex: pj_mutex_t;
}

/**
 * IM callback data.
 */
export interface pjsua_im_data {
  acc_id: pjsua_acc_id;
  call_id: pjsua_call_id;
  to: pj_str_t;
  body: pj_str_t;
  user_data:;
}
