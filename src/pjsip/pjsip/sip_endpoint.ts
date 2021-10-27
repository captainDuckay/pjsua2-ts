/**
 * This describes additional parameters to pjsip_endpt_process_rx_data()
 * function. Application MUST call pjsip_process_rdata_param_default() to
 * initialize this structure.
 */
import { pj_bool_t, unsigned } from "./c_types_to_ts";

export interface pjsip_process_rdata_param {
  /**
   * Specify the minimum priority number of the modules that are allowed
   * to process the message. Default is zero to allow all modules to
   * process the message.
   */
  start_prio: unsigned;

  /**
   * Specify the pointer of the module where processing will start.
   * The default is NULL, meaning processing will start from the start
   * of the module list.
   */
  start_mod;

  /**
   * Set to N, then processing will start at Nth module after start
   * module (where start module can be an explicit module as specified
   * by \a start_mod or the start of module list when \a start_mod is
   * NULL). For example, if set to 1, then processing will start from
   * the next module after start module. Default is zero.
   */
  idx_after_start: unsigned;

  /**
   * Print nothing to log. Default is PJ_FALSE.
   */
  silent: pj_bool_t;

}
