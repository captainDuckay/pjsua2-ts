/**
 * Settings to be specified when creating the TCP transport. Application
 * should initialize this structure with its default values by calling
 * pjsip_tcp_transport_cfg_default().
 */
import { pjsip_host_port } from "./sip_types";

export interface pjsip_tcp_transport_cfg {
  /**
   * Address family to use. Valid values are pj_AF_INET() and
   * pj_AF_INET6(). Default is pj_AF_INET().
   */
  af: number;

  /**
   * Optional address to bind the socket to. Default is to bind to
   * PJ_INADDR_ANY and to any available port.
   */
  bind_addr: pj_sockaddr;

  /**
   * Should SO_REUSEADDR be used for the listener socket.
   * Default value is PJSIP_TCP_TRANSPORT_REUSEADDR.
   */
  reuse_addr: boolean;

  /**
   * Optional published address, which is the address to be
   * advertised as the address of this SIP transport.
   * By default the bound address will be used as the published address.
   */
  addr_name: pjsip_host_port;

  /**
   * Number of simultaneous asynchronous accept() operations to be
   * supported. It is recommended that the number here corresponds to
   * the number of processors in the system (or the number of SIP
   * worker threads).
   *
   * Default: 1
   */
  async_cnt: number;

  /**
   * QoS traffic type to be set on this transport. When application wants
   * to apply QoS tagging to the transport, it's preferable to set this
   * field rather than \a qos_param fields since this is more portable.
   *
   * Default is QoS not set.
   */
  qos_type: pj_qos_type;

  /**
   * Set the low level QoS parameters to the transport. This is a lower
   * level operation than setting the \a qos_type field and may not be
   * supported on all platforms.
   *
   * Default is QoS not set.
   */
  qos_params: pj_qos_params;

  /**
   * Specify options to be set on the transport.
   *
   * By default there is no options.
   *
   */
  sockopt_params: pj_sockopt_params;

  /**
   * Intial timeout interval to be applied to incoming transports
   * (i.e. server side) when no data received after a successful connection.
   *
   * Default: PJSIP_TCP_INITIAL_TIMEOUT
   */
  initial_timeout: number;

}
