/**
 * @defgroup PJSIP_TRANSPORT_UDP UDP Transport
 * @ingroup PJSIP_TRANSPORT
 * @brief API to create and register UDP transport.
 * @{
 * The functions below are used to create UDP transport and register
 * the transport to the framework.
 */

/**
 * Flag that can be specified when calling #pjsip_udp_transport_pause() or
 * #pjsip_udp_transport_restart().
 */
import { pjsip_host_port } from "./sip_types";

export enum flags {
  /**
   * This flag tells the transport to keep the existing/internal socket
   * handle.
   */
  PJSIP_UDP_TRANSPORT_KEEP_SOCKET = 1,

  /**
   * This flag tells the transport to destroy the existing/internal socket
   * handle. Naturally this flag and PJSIP_UDP_TRANSPORT_KEEP_SOCKET are
   * mutually exclusive.
   */
  PJSIP_UDP_TRANSPORT_DESTROY_SOCKET = 2
}

/**
 * Settings to be specified when creating the UDP transport. Application
 * should initialize this structure with its default values by calling
 * pjsip_udp_transport_cfg_default().
 */
export interface pjsip_udp_transport_cfg {
  /**
   * Address family to use. Valid values are pj_AF_INET() and
   * pj_AF_INET6(). Default is pj_AF_INET().
   */
  af: number;

  /**
   * Address to bind the socket to.
   */
  bind_addr: pj_sockaddr;

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

}
