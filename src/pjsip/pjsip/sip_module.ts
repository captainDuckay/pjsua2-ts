/**
 * The declaration for SIP module. This structure would be passed to
 * #pjsip_endpt_register_module() to register the module to PJSIP.
 */
export interface pjsip_module {
  /** To allow chaining of modules in the endpoint. */
  PJ_DECL_LIST_MEMBER (pjsip_module);

  /**
   * Module name to identify the module.
   *
   * This field MUST be initialized before registering the module.
   */
  name: string;

  /**
   * Module ID. Application must initialize this field with -1 before
   * registering the module to PJSIP. After the module is registered,
   * this field will contain a unique ID to identify the module.
   */
  id: number;

  /**
   * Integer number to identify module initialization and start order with
   * regard to other modules. Higher number will make the module gets
   * initialized later.
   *
   * This field MUST be initialized before registering the module.
   */
  priority: number;

  /**
   * Optional function to be called to initialize the module. This function
   * will be called by endpoint during module registration. If the value
   * is NULL, then it's equal to returning PJ_SUCCESS.
   *
   * @param endpt  The endpoint instance.
   * @return    Module should return PJ_SUCCESS to indicate success.
   */
  load (endpt: pjsip_endpoint): pj_status_t;

  /**
   * Optional function to be called to start the module. This function
   * will be called by endpoint during module registration. If the value
   * is NULL, then it's equal to returning PJ_SUCCESS.
   *
   * @return    Module should return zero to indicate success.
   */
  start (): pj_status_t;

  /**
   * Optional function to be called to deinitialize the module before
   * it is unloaded. This function will be called by endpoint during
   * module unregistration. If the value is NULL, then it's equal to
   * returning PJ_SUCCESS.
   *
   * @return    Module should return PJ_SUCCESS to indicate success.
   */
  stop (): pj_status_t;

  /**
   * Optional function to be called to deinitialize the module before
   * it is unloaded. This function will be called by endpoint during
   * module unregistration. If the value is NULL, then it's equal to
   * returning PJ_SUCCESS.
   *
   * @param mod  The module.
   *
   * @return    Module should return PJ_SUCCESS to indicate success.
   */
  unload (mod?): pj_status_t;

  /**
   * Optional function to be called to process incoming request message.
   *
   * @param rdata  The incoming message.
   *
   * @return    Module should return PJ_TRUE if it handles the request,
   *      or otherwise it should return PJ_FALSE to allow other
   *      modules to handle the request.
   */
  on_rx_request (rdata: pjsip_rx_data): boolean;

  /**
   * Optional function to be called to process incoming response message.
   *
   * @param rdata  The incoming message.
   *
   * @return    Module should return PJ_TRUE if it handles the
   *      response, or otherwise it should return PJ_FALSE to
   *      allow other modules to handle the response.
   */
  on_rx_response (rdata: pjsip_rx_data): boolean;

  /**
   * Optional function to be called when transport layer is about to
   * transmit outgoing request message.
   *
   * @param tdata  The outgoing request message.
   *
   * @return    Module should return PJ_SUCCESS in all cases.
   *      If non-zero (or PJ_FALSE) is returned, the message
   *      will not be sent.
   */
  on_tx_request (tdata: pjsip_tx_data): pj_status_t;

  /**
   * Optional function to be called when transport layer is about to
   * transmit outgoing response message.
   *
   * @param tdata  The outgoing response message.
   *
   * @return    Module should return PJ_SUCCESS in all cases.
   *      If non-zero (or PJ_FALSE) is returned, the message
   *      will not be sent.
   */
  on_tx_response (tdata: pjsip_tx_data): pj_status_t;

  /**
   * Optional function to be called when this module is acting as
   * transaction user for the specified transaction, when the
   * transaction's state has changed.
   *
   * @param tsx  The transaction.
   * @param event  The event which has caused the transaction state
   *      to change.
   */
  on_tsx_state (tsx: pjsip_transaction, event: pjsip_event);

}

/**
 * Module priority guidelines.
 */
export enum pjsip_module_priority {
  /**
   * This is the priority used by transport layer.
   */
  PJSIP_MOD_PRIORITY_TRANSPORT_LAYER = 8,

  /**
   * This is the priority used by transaction layer.
   */
  PJSIP_MOD_PRIORITY_TSX_LAYER = 16,

  /**
   * This is the priority used by the user agent and proxy layer.
   */
  PJSIP_MOD_PRIORITY_UA_PROXY_LAYER = 32,

  /**
   * This is the priority used by the dialog usages.
   */
  PJSIP_MOD_PRIORITY_DIALOG_USAGE = 48,

  /**
   * This is the recommended priority to be used by applications.
   */
  PJSIP_MOD_PRIORITY_APPLICATION = 64
}
