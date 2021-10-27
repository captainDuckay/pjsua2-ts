//
// Class Pj_Object is declared in pool.hpp
//

//
// Time value wrapper.
//
import { long, pj_status_t } from '../../pjsip/pjsip/c_types_to_ts'

export interface pj_time_val {

  get_sec (): long

  get_msec (): long

  set_sec (s: long): void

  set_msec (ms: long): void

  to_msec (): long

  /* Must include os.hpp to use these, otherwise unresolved in linking */
  gettimeofday (): pj_status_t;

  decode (): pj_parsed_time;

  encode (pt: pj_parsed_time): pj_status_t;

  to_gmt (): pj_status_t;

  to_local (): pj_status_t;

}
