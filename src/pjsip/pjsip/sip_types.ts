/**
 * Transport types.
 */
export enum pjsip_transport_type_e {
  /** Unspecified. */
  PJSIP_TRANSPORT_UNSPECIFIED,

  /** UDP. */
  PJSIP_TRANSPORT_UDP,

  /** TCP. */
  PJSIP_TRANSPORT_TCP,

  /** TLS. */
  PJSIP_TRANSPORT_TLS,

  /** DTLS, not implemented yet. */
  PJSIP_TRANSPORT_DTLS,

  /** SCTP, not implemented yet. */
  PJSIP_TRANSPORT_SCTP,

  /** Loopback (stream, reliable) */
  PJSIP_TRANSPORT_LOOP,

  /** Loopback (datagram, unreliable) */
  PJSIP_TRANSPORT_LOOP_DGRAM,

  /** Start of user defined transport */
  PJSIP_TRANSPORT_START_OTHER,

  /** Start of IPv6 transports */
  PJSIP_TRANSPORT_IPV6 = 128,

  /** UDP over IPv6 */
  PJSIP_TRANSPORT_UDP6 = PJSIP_TRANSPORT_UDP + PJSIP_TRANSPORT_IPV6,

  /** TCP over IPv6 */
  PJSIP_TRANSPORT_TCP6 = PJSIP_TRANSPORT_TCP + PJSIP_TRANSPORT_IPV6,

  /** TLS over IPv6 */
  PJSIP_TRANSPORT_TLS6 = PJSIP_TRANSPORT_TLS + PJSIP_TRANSPORT_IPV6,

  /** DTLS over IPv6, not implemented yet */
  PJSIP_TRANSPORT_DTLS6 = PJSIP_TRANSPORT_DTLS + PJSIP_TRANSPORT_IPV6

}

/**
 * Transaction role.
 */
export enum pjsip_role_e {
  /**< Role is UAC. */
  PJSIP_ROLE_UAC,
  /**< Role is UAS. */
  PJSIP_ROLE_UAS,

  /* Alias: */
  /**< Role is UAC. */
  PJSIP_UAC_ROLE = PJSIP_ROLE_UAC,
  /**< Role is UAS. */
  PJSIP_UAS_ROLE = PJSIP_ROLE_UAS
}

/**
 * General purpose buffer.
 */
export interface pjsip_buffer {
  /** The start of the buffer. */
  start;

  /** Pointer to current end of the buffer, which also indicates the position
   of subsequent buffer write.
   */
  cur;

  /** The absolute end of the buffer. */
  end;

}

/**
 * General host:port pair, used for example as Via sent-by.
 */
export interface pjsip_host_port {
  /**< Host part or IP address. */
  host: string;
  /**< Port number. */
  port: number;
}

/**
 * Host information.
 */
export interface pjsip_host_info {
  /**< Flags of pjsip_transport_flags_e. */
  flag: number;
  /**< Transport type. */
  type: pjsip_transport_type_e;
  /**< Address information. */
  addr: pjsip_host_port;
}
