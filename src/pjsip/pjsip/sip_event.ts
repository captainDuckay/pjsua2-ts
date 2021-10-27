/**
 * Event IDs.
 */
export enum pjsip_event_id_e {
  /** Unidentified event. */
  PJSIP_EVENT_UNKNOWN,

  /** Timer event, normally only used internally in transaction. */
  PJSIP_EVENT_TIMER,

  /** Message transmission event. */
  PJSIP_EVENT_TX_MSG,

  /** Message received event. */
  PJSIP_EVENT_RX_MSG,

  /** Transport error event. */
  PJSIP_EVENT_TRANSPORT_ERROR,

  /** Transaction state changed event. */
  PJSIP_EVENT_TSX_STATE,

  /** Indicates that the event was triggered by user action. */
  PJSIP_EVENT_USER

}

/**
 * This structure describe event descriptor to fully identify a SIP event.
 *
 * Events are the only way for a lower layer object to inform something
 * to higher layer objects. Normally this is achieved by means of callback,
 * i.e. the higher layer objects register a callback to handle the event on
 * the lower layer objects.
 *
 * This event descriptor is used for example by transactions, to inform
 * endpoint about events, and by transports, to inform endpoint about
 * unexpected transport error.
 */
export interface pjsip_event {
  /** This is necessary so that we can put events as a list. */
  PJ_DECL_LIST_MEMBER (pjsip_event);

  /** The event type, can be any value of \b pjsip_event_id_e.
   */
  type: pjsip_event_id_e;

  /**
   * The event body as union, which fields depends on the event type.
   * By convention, the first member of each struct in the union must be
   * the pointer which is relevant to the event.
   */
  body: {
    /** Timer event. */
    timer:
      {
        entry: pj_timer_entry;      /**< The timer entry.           */
      };

    /** Transaction state has changed event. */
    tsx_state: {
      src: {
        rdata: pjsip_rx_data; /**< The incoming message.      */
        tdata: pjsip_tx_data; /**< The outgoing message.      */
        timer: pj_timer_entry; /**< The timer.                 */
        status: pj_status_t; /**< Transport error status.    */
        data;  /**< Generic data.              */
      };
      tsx: pjsip_transaction; /**< The transaction.           */
      prev_state: number; /**< Previous state.  */
      type: pjsip_event_id_e;  /**< Type of event source:
       *      - PJSIP_EVENT_TX_MSG
       *      - PJSIP_EVENT_RX_MSG,
       *      - PJSIP_EVENT_TRANSPORT_ERROR
       *      - PJSIP_EVENT_TIMER
       *      - PJSIP_EVENT_USER
       */
    };

    /** Message transmission event. */
    tx_msg: {
      tdata: pjsip_tx_data; /**< The transmit data buffer.  */

    };

    /** Transmission error event. */
    tx_error: {
      tdata: pjsip_tx_data; /**< The transmit data.         */
      tsx: pjsip_transaction;   /**< The transaction.           */
    };

    /** Message arrival event. */
    rx_msg: {
      rdata: pjsip_rx_data; /**< The receive data buffer.   */
    };

    /** User event. */
    user: {
      user1; /**< User data 1.               */
      user2; /**< User data 2.               */
      user3; /**< User data 3.               */
      user4; /**< User data 4.               */
    };

  };
};
