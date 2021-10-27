/**
 * This structure describes Event header.
 */
import { pjsip_generic_array_hdr } from '../pjsip/sip_msg'
import { pj_str_t } from '../../pjlib/pj/types'
import { pjsip_param } from '../pjsip/sip_uri'
import { int, unsigned } from '../pjsip/c_types_to_ts'

export interface pjsip_event_hdr {

  event_type: pj_str_t;
  /**< Event name. */
  id_param: pj_str_t;
  /**< Optional event ID parameter. */
  other_param: pjsip_param;    /**< Other parameter. */
}

/**
 * This structure describes Allow-Events header.
 */
export type  pjsip_allow_events_hdr = pjsip_generic_array_hdr;

/**
 * This structure describes Subscription-State header.
 */
export interface pjsip_sub_state_hdr {

  sub_state: pj_str_t;
  /**< Subscription state. */
  reason_param: pj_str_t;
  /**< Optional termination reason. */
  expires_param: unsigned;
  /**< Expires param, or
   PJSIP_EXPIRES_NOT_SPECIFIED. */
  retry_after: int;
  /**< Retry after param, or -1. */
  other_param: pjsip_param;	/**< Other parameters. */
}
