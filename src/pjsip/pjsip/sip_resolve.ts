/**
 * The server addresses returned by the resolver.
 */
export interface pjsip_server_addresses {
  /** Number of address records. */
  count: number;

  /** Address records. */
  entry: {
    /** Preferable transport to be used to contact this address. */
    type: pjsip_transport_type_e;

    /** Server priority (the lower the higher the priority). */
    priority: number;

    /** Server weight (the higher the more load it can handle). */
    weight: number;

    /** The server's address. */
    addr: pj_sockaddr;

    /** Address length. */
    addr_len: number;

  };

}

/**
 * The type of callback function to be called when resolver finishes the job.
 *
 * @param status    The status of the operation, which is zero on success.
 * @param token      The token that was associated with the job when application
 *        call the resolve function.
 * @param addr      The addresses resolved by the operation.
 */
export type pjsip_resolver_callback = (status: pj_status_t, token, addr: pjsip_server_addresses);

/**
 * This structure describes application callback to receive various event from
 * the SIP resolver engine. Application can use this for its own resolver
 * implementation.
 */
export interface pjsip_ext_resolver {
  /**
   * Notify application when the resolution should begin.
   *
   * @param resolver      The resolver engine.
   * @param pool          The pool to allocate resolver job.
   * @param target        The target specification to be resolved.
   * @param token         A user defined token to be passed back to callback
   *                      function.
   * @param cb            The callback function.
   */
  resolve (resolver: pjsip_resolver_t, pool, target: pjsip_host_info, token, cb: pjsip_resolver_callback);

}
