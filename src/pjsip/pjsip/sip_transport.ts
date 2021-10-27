/**
 * Flags for SIP transports.
 */
import {
  pjsip_cid_hdr, pjsip_clen_hdr,
  pjsip_cseq_hdr, pjsip_ctype_hdr,
  pjsip_from_hdr,
  pjsip_max_fwd_hdr,
  pjsip_msg, pjsip_require_hdr, pjsip_route_hdr, pjsip_rr_hdr, pjsip_supported_hdr,
  pjsip_to_hdr,
  pjsip_via_hdr
} from "./sip_msg";
import { pjsip_buffer, pjsip_host_port, pjsip_transport_type_e } from "./sip_types";
import { pjsip_server_addresses } from "./sip_resolve";
import {
  long,
  pj_bool_t,
  pj_size_t,
  pj_sockaddr_t,
  pj_timestamp,
  unsigned,
  pj_status_t,
  pj_str_t, pj_uint16_t, pj_pool_t
} from "./c_types_to_ts";

export enum pjsip_transport_flags_e {
  /**< Transport is reliable.      */
  PJSIP_TRANSPORT_RELIABLE = 1,
  /**< Transport is secure.      */
  PJSIP_TRANSPORT_SECURE = 2,
  /**< Datagram based transport.
   (it's also assumed to be
   connectionless)      */
  PJSIP_TRANSPORT_DATAGRAM = 4
}

/*****************************************************************************
 *
 * TRANSPORT SELECTOR.
 *
 *****************************************************************************/

/**
 * This structure describes the type of data in pjsip_tpselector.
 */
export enum pjsip_tpselector_type {
  /** Transport is not specified. */
  PJSIP_TPSELECTOR_NONE,

  /** Use the specific transport to send request. */
  PJSIP_TPSELECTOR_TRANSPORT,

  /** Use the specific listener to send request. */
  PJSIP_TPSELECTOR_LISTENER,

}

/**
 * This structure describes the transport/listener preference to be used
 * when sending outgoing requests.
 *
 * Normally transport will be selected automatically according to rules about
 * sending requests. But some applications (such as proxies or B2BUAs) may
 * want to explicitly use specific transport to send requests, for example
 * when they want to make sure that outgoing request should go from a specific
 * network interface.
 *
 * The pjsip_tpselector structure is used for that purpose, i.e. to allow
 * application specificly request that a particular transport/listener
 * should be used to send request. This structure is used when calling
 * pjsip_tsx_set_transport() and pjsip_dlg_set_transport().
 *
 * If application disables connection reuse and wants to force creating
 * a new transport, it needs to consider the following couple of things:
 * - If it still wants to reuse an existing transport (if any), it
 *   needs to keep a reference to that transport and specifically set
 *   the transport to be used for sending requests.
 * - Delete those existing transports manually when no longer needed.
 */
export interface pjsip_tpselector {
  /** The type of data in the union */
  type: pjsip_tpselector_type;

  /**
   * Whether to disable reuse of an existing connection.
   * This setting will be ignored if (type == PJSIP_TPSELECTOR_TRANSPORT)
   * and transport in the union below is set.
   */
  disable_connection_reuse: pj_bool_t;

  /** Union representing the transport/listener criteria to be used. */
  u: {
    transport: pjsip_transport;
    listener: pjsip_tpfactory;
    ptr;
  };

}

/*****************************************************************************
 *
 * RECEIVE DATA BUFFER.
 *
 *****************************************************************************/

/**
 * A customized ioqueue async operation key which is used by transport
 * to locate rdata when a pending read operation completes.
 */
export interface pjsip_rx_data_op_key {
  op_key: pj_ioqueue_op_key_t;
  /**< ioqueue op_key.    */
  rdata: pjsip_rx_data;	/**< rdata associated with this */
}

/**
 * Incoming message buffer.
 * This structure keep all the information regarding the received message. This
 * buffer lifetime is only very short, normally after the transaction has been
 * called, this buffer will be deleted/recycled. So care must be taken when
 * allocating storage from the pool of this buffer.
 */
export interface pjsip_rx_data {

  /**
   * tp_info is part of rdata that remains static for the duration of the
   * buffer. It is initialized when the buffer was created by transport.
   */
  tp_info: {
    /** Memory pool for this buffer. */
    pool: pj_pool_t;

    /** The transport object which received this packet. */
    transport: pjsip_transport;

    /** Other transport specific data to be attached to this buffer. */
    tp_data;

    /** Ioqueue key. */
    op_key: pjsip_rx_data_op_key;

  };

  /**
   * pkt_info is initialized by transport when it receives an incoming
   * packet.
   */
  pkt_info:
    {
      /** Time when the message was received. */
      timestamp: pj_time_val;

      /** Pointer to the original packet. */
      packet;

      /** Zero termination for the packet. */
      zero: number;

      /** The length of the packet received. */
      len: number;

      /** The source address from which the packet was received. */
      src_addr: pj_sockaddr;

      /** The length of the source address. */
      src_addr_len: number;

      /** The IP source address string (NULL terminated). */
      src_name: string;

      /** The IP source port number. */
      src_port: string;

    };

  /**
   * msg_info is initialized by transport mgr (tpmgr) before this buffer
   * is passed to endpoint.
   */
  msg_info:
    {
      /** Start of msg buffer. */
      msg_buf: string;

      /** Length fo message. */
      len: number;

      /** The parsed message, if any. */
      msg: pjsip_msg;

      /** Short description about the message.
       *  Application should use #pjsip_rx_data_get_info() instead.
       */
      info: string;

      /** The Call-ID header as found in the message. */
      cid: pjsip_cid_hdr;

      /** The From header as found in the message. */
      from: pjsip_from_hdr;

      /** The To header as found in the message. */
      to: pjsip_to_hdr;

      /** The topmost Via header as found in the message. */
      via: pjsip_via_hdr;

      /** The CSeq header as found in the message. */
      cseq: pjsip_cseq_hdr;

      /** Max forwards header. */
      max_fwd: pjsip_max_fwd_hdr;

      /** The first route header. */
      route: pjsip_route_hdr;

      /** The first record-route header. */
      record_route: pjsip_rr_hdr;

      /** Content-type header. */
      ctype: pjsip_ctype_hdr;

      /** Content-length header. */
      clen: pjsip_clen_hdr;

      /** "Require" header containing aggregates of all Require
       *  headers found in the message, or NULL.
       */
      require: pjsip_require_hdr;

      /** "Supported" header containing aggregates of all Supported
       *  headers found in the message, or NULL.
       */
      supported: pjsip_supported_hdr;

      /** The list of error generated by the parser when parsing
       this message.
       */
      parse_err: pjsip_parser_err_report;

    };

  /**
   * endpt_info is initialized by endpoint after this buffer reaches
   * endpoint.
   */
  endpt_info:
    {
      /**
       * Data attached by modules to this message.
       */
      mod_data;

    };

}

/*****************************************************************************
 *
 * TRANSMIT DATA BUFFER MANIPULATION.
 *
 *****************************************************************************/

/** Customized ioqueue async operation key, used by transport to keep
 *  callback parameters.
 */
export interface pjsip_tx_data_op_key {
  /** ioqueue pending operation key. */
  key: pj_ioqueue_op_key_t;

  /** Transmit data associated with this key. */
  tdata: pjsip_tx_data;

  /** Arbitrary token (attached by transport) */
  token;

}

/**
 * Data structure for sending outgoing message. Application normally creates
 * this buffer by calling #pjsip_endpt_create_tdata.
 *
 * The lifetime of this buffer is controlled by the reference counter in this
 * structure, which is manipulated by calling #pjsip_tx_data_add_ref and
 * #pjsip_tx_data_dec_ref. When the reference counter has reached zero, then
 * this buffer will be destroyed.
 *
 * A transaction object normally will add reference counter to this buffer
 * when application calls #pjsip_tsx_send_msg, because it needs to keep the
 * message for retransmission. The transaction will release the reference
 * counter once its state has reached final state.
 */
export interface pjsip_tx_data {
  /** Memory pool for this buffer. */
  pool: pj_pool_t;

  /** A name to identify this buffer. */
  obj_name: string;

  /** Short information describing this buffer and the message in it.
   *  Application should use #pjsip_tx_data_get_info() instead of
   *  directly accessing this member.
   */
  info: string;

  /** For response message, this contains the reference to timestamp when
   *  the original request message was received. The value of this field
   *  is set when application creates response message to a request by
   *  calling #pjsip_endpt_create_response.
   */
  rx_timestamp: pj_time_val;

  /** The transport manager for this buffer. */
  mgr: pjsip_tpmgr;

  /** Ioqueue asynchronous operation key. */
  op_key: pjsip_tx_data_op_key;

  /** Lock object. */
  lock: pj_lock_t;

  /** The message in this buffer. */
  msg: pjsip_msg;

  /** Strict route header saved by #pjsip_process_route_set(), to be
   *  restored by #pjsip_restore_strict_route_set().
   */
  saved_strict_route: pjsip_route_hdr;

  /** Buffer to the printed text representation of the message. When the
   *  content of this buffer is set, then the transport will send the content
   *  of this buffer instead of re-printing the message structure. If the
   *  message structure has changed, then application must invalidate this
   *  buffer by calling #pjsip_tx_data_invalidate_msg.
   */
  buf: pjsip_buffer;

  /** Reference counter. */
  ref_cnt: pj_atomic_t;

  /** Being processed by transport? */
  is_pending: number;

  /** Transport manager internal. */
  token;

  /** Destination information, to be used to determine the network address
   *  of the message. For a request, this information is  initialized when
   *  the request is sent with #pjsip_endpt_send_request_stateless() and
   *  network address is resolved. For CANCEL request, this information
   *  will be copied from the original INVITE to make sure that the CANCEL
   *  request goes to the same physical network address as the INVITE
   *  request.
   */
  dest_info:
    {
      /** Server name.
       */
      name: pj_str_t;

      /** Server addresses resolved.
       */
      addr: pjsip_server_addresses;

      /** Current server address being tried.
       */
      cur_addr: number;

    };

  /** Transport information, only valid during on_tx_request() and
   *  on_tx_response() callback.
   */
  tp_info:
    {
      transport: pjsip_transport; /**< Transport being used.  */
      dst_addr: pj_sockaddr_t; /**< Destination address.  */
      dst_addr_len: number; /**< Length of address.  */
      dst_name: string; /**< Destination address.  */
      dst_port: number;	    /**< Destination port.  */
    };

  /**
   * Transport selector, to specify which transport to be used.
   * The value here must be set with pjsip_tx_data_set_transport(),
   * to allow reference counter to be set properly.
   */
  tp_sel: pjsip_tpselector;

  /**
   * Special flag to indicate that this transmit data is a request that has
   * been updated with proper authentication response and is ready to be
   * sent for retry.
   */
  auth_retry: pj_bool_t;

  /**
   * Arbitrary data attached by PJSIP modules.
   */
  mod_data;

  /**
   * If via_addr is set, it will be used as the "sent-by" field of the
   * Via header for outgoing requests as long as the request uses via_tp
   * transport. Normally application should not use or access these fields.
   */
  via_addr: pjsip_host_port;
  /**< Via address.          */
  via_tp;        /**< Via transport.          */
}

/*****************************************************************************
 *
 * TRANSPORT
 *
 *****************************************************************************/

/**
 * This structure describes transport key to be registered to hash table.
 */
export interface pjsip_transport_key {
  /**
   * Transport type.
   */
  type: long;

  /**
   * Destination address.
   */
  rem_addr: pj_sockaddr;

}

/**
 * Enumeration of transport direction types.
 */
export enum pjsip_transport_dir {
  PJSIP_TP_DIR_NONE, /**< Direction not set, normally used by
   connectionless transports such as
   UDP transport.          */
  PJSIP_TP_DIR_OUTGOING, /**< Outgoing connection or client mode,
   this is only for connection-oriented
   transports.          */
  PJSIP_TP_DIR_INCOMING,	    /**< Incoming connection or server mode,
   this is only for connection-oriented
   transports.          */
}

/**
 * This structure represent the "public" interface of a SIP transport.
 * Applications normally extend this structure to include transport
 * specific members.
 */
export interface pjsip_transport {
  obj_name: string;
  /**< Name. */

  pool: pj_pool_t;
  /**< Pool used by transport.    */
  ref_cnt: pj_atomic_t;
  /**< Reference counter.      */
  lock: pj_lock_t;
  /**< Lock object.        */
  grp_lock: pj_grp_lock_t;
  /**< Group lock for sync with
   ioqueue and timer.      */
  tracing: pj_bool_t;
  /**< Tracing enabled?      */
  is_shutdown: pj_bool_t;
  /**< Being shutdown?      */
  is_destroying: pj_bool_t;  /**< Destroy in progress?      */

  /** Key for indexing this transport in hash table. */
  key: pjsip_transport_key;

  type_name: string;
  /**< Type name.        */
  flag: unsigned;
  /**< #pjsip_transport_flags_e   */
  info: string;
  /**< Transport info/description.*/

  addr_len: number;
  /**< Length of addresses.      */
  local_addr: pj_sockaddr;
  /**< Bound address.        */
  local_name: pjsip_host_port;
  /**< Published name (eg. STUN). */
  remote_name: pjsip_host_port;
  /**< Remote address name.      */
  dir: pjsip_transport_dir;
  /**< Connection direction.      */

  endpt: pjsip_endpoint;
  /**< Endpoint instance.      */
  tpmgr: pjsip_tpmgr;
  /**< Transport manager.      */
  factory: pjsip_tpfactory;
  /**< Factory instance. Note: it
   may be invalid/shutdown.   */
  idle_timer: pj_timer_entry;
  /**< Timer when ref cnt is zero.*/

  last_recv_ts: pj_timestamp;
  /**< Last time receiving data.  */
  last_recv_len: pj_size_t;
  /**< Last received data length. */

  data;	    /**< Internal transport data.   */

  /**
   * Function to be called by transport manager to send SIP message.
   *
   * @param transport      The transport to send the message.
   * @param packet      The buffer to send.
   * @param length      The length of the buffer to send.
   * @param op_key      Completion token, which will be supplied to
   *          caller when pending send operation completes.
   * @param rem_addr      The remote destination address.
   * @param addr_len      Size of remote address.
   * @param callback      If supplied, the callback will be called
   *          once a pending transmission has completed. If
   *          the function completes immediately (i.e. return
   *          code is not PJ_EPENDING), the callback will not
   *          be called.
   *
   * @return        Should return PJ_SUCCESS only if data has been
   *          succesfully queued to operating system for
   *          transmission. Otherwise it may return PJ_EPENDING
   *          if the underlying transport can not send the
   *          data immediately and will send it later, which in
   *          this case caller doesn't have to do anything
   *          except wait the calback to be called, if it
   *          supplies one.
   *          Other return values indicate the error code.
   */
  send_msg (transport: pjsip_transport, tdata: pjsip_tx_data, rem_addr: pj_sockaddr_t, addr_len: number, token, callback: pjsip_transport_callback): pj_status_t;

  /**
   * Instruct the transport to initiate graceful shutdown procedure.
   * After all objects release their reference to this transport,
   * the transport will be deleted.
   *
   * Note that application MUST use #pjsip_transport_shutdown() instead.
   *
   * @param transport      The transport.
   *
   * @return        PJ_SUCCESS on success.
   */
  do_shutdown (transport: pjsip_transport): pj_status_t;

  /**
   * Forcefully destroy this transport regardless whether there are
   * objects that currently use this transport. This function should only
   * be called by transport manager or other internal objects (such as the
   * transport itself) who know what they're doing. Application should use
   * #pjsip_transport_shutdown() instead.
   *
   * @param transport      The transport.
   *
   * @return        PJ_SUCCESS on success.
   */
  destroy (transport: pjsip_transport): pj_status_t;

}

/*****************************************************************************
 *
 * TRANSPORT FACTORY
 *
 *****************************************************************************/

/**
 * A transport factory is normally used for connection oriented transports
 * (such as TCP or TLS) to create instances of transports. It registers
 * a new transport type to the transport manager, and the transport manager
 * would ask the factory to create a transport instance when it received
 * command from application to send a SIP message using the specified
 * transport type.
 */
export interface pjsip_tpfactory {

  obj_name: string;
  /**< Name.  */

  pool: pj_pool_t;
  /**< Owned memory pool.  */
  lock: pj_lock_t;
  /**< Lock object.    */

  type: pjsip_transport_type_e;
  /**< Transport type.  */
  type_name: string;
  /**< Type string name.  */
  flag: unsigned;
  /**< Transport flag.  */
  info: string;
  /**< Transport info/description.*/

  local_addr: pj_sockaddr;
  /**< Bound address.    */
  addr_name: pjsip_host_port;	    /**< Published name.  */

  /**
   * Create new outbound connection suitable for sending SIP message
   * to specified remote address.
   * Note that the factory is responsible for both creating the
   * transport and registering it to the transport manager.
   */
  create_transport (factory: pjsip_tpfactory, mgr: pjsip_tpmgr, endpt: pjsip_endpoint, rem_addr: pj_sockaddr, addr_len: number, transport: pjsip_transport): pj_status_t;

  /**
   * Create new outbound connection suitable for sending SIP message
   * to specified remote address by also considering outgoing SIP
   * message data.
   * Note that the factory is responsible for both creating the
   * transport and registering it to the transport manager.
   */
  create_transport2 (factory: pjsip_tpfactory, mgr: pjsip_tpmgr, endpt: pjsip_endpoint, rem_addr: pj_sockaddr, addr_len: number, tdata: pjsip_tx_data, transport: pjsip_transport): pj_status_t;

  /**
   * Destroy the listener.
   */
  destroy (factory: pjsip_tpfactory): pj_status_t;

  /*
   * Application may extend this structure..
   */
};

/*****************************************************************************
 *
 * TRANSPORT MANAGER
 *
 *****************************************************************************/

/**
 * Parameter for pjsip_tpmgr_find_local_addr2() function.
 */
export interface pjsip_tpmgr_fla2_param {
  /**
   * Specify transport type to use. This must be set.
   */
  tp_type: pjsip_transport_type_e;

  /**
   * Optional pointer to preferred transport, if any.
   */
  tp_sel: pjsip_tpselector;

  /**
   * Destination host, if known. The destination host is needed
   * if \a local_if field below is set.
   */
  dst_host: pj_str_t;

  /**
   * Specify if the function should return which local interface
   * to use for the specified destination in \a dst_host. By definition,
   * the returned address will always be local interface address.
   */
  local_if: pj_bool_t;

  /**
   * The returned address.
   */
  ret_addr: pj_str_t;

  /**
   * The returned port.
   */
  ret_port: pj_uint16_t;

  /**
   * Returned pointer to the transport. Only set if local_if is set.
   */
  ret_tp;

}

/*****************************************************************************
 *
 * PUBLIC API
 *
 *****************************************************************************/

/**
 * Enumeration of transport state types.
 */
export enum pjsip_transport_state {
  /**< Transport connected, applicable only
   to connection-oriented transports
   such as TCP and TLS.        */
  PJSIP_TP_STATE_CONNECTED,
  /**< Transport disconnected, applicable
   only to connection-oriented
   transports such as TCP and TLS.    */
  PJSIP_TP_STATE_DISCONNECTED,
  /**< Transport shutdown, either
   due to TCP/TLS disconnect error
   from the network, or when shutdown
   is initiated by PJSIP itself.      */
  PJSIP_TP_STATE_SHUTDOWN,
  /**< Transport destroy, when transport
   is about to be destroyed.          */
  PJSIP_TP_STATE_DESTROY,
}

/**
 * Structure of transport state info passed by #pjsip_tp_state_callback.
 */
export interface pjsip_transport_state_info {
  /**
   * The last error code related to the transport state.
   */
  status: pj_status_t;

  /**
   * Optional extended info, the content is specific for each transport type.
   */
  ext_info;

  /**
   * Optional user data. In global transport state notification, this will
   * always be NULL.
   */
  user_data;

}

/**
 * Structure of dropped received data.
 */
export interface pjsip_tp_dropped_data {
  /**
   * The transport receiving the data.
   */
  tp: pjsip_transport;

  /**
   * The data.
   */
  data;

  /**
   * The data length.
   * If the status field below indicates an invalid SIP message
   * (PJSIP_EINVALIDMSG) and application detects a SIP message
   * at position p, it can pass the data back to PJSIP to be processed
   * by setting the len to p. This can be useful for apps which
   * wishes to use the same transport for SIP signalling and non-SIP
   * purposes (such as SIP outbound using STUN message).
   */
  len: pj_size_t;

  /**
   * The status or reason of drop. For example, a leading newlines (common
   * keep-alive packet) will be dropped with status PJ_EIGNORED, an invalid
   * SIP message will have status PJSIP_EINVALIDMSG, a SIP message overflow
   * will have status PJSIP_ERXOVERFLOW.
   */
  status: pj_status_t;

}

