/**
 * Declaration of SIP Replaces header (RFC 3891).
 */
import { pj_bool_t, pj_str_t } from "../pjsip/c_types_to_ts";
import { pjsip_param } from "../pjsip/sip_uri";

export interface pjsip_replaces_hdr
{
    /** Call-Id */
    	call_id:pj_str_t;

    /** to-tag */
    	to_tag:pj_str_t;

    /** from-tag */
    	from_tag:pj_str_t;

    /** early-only? */
    	early_only:pj_bool_t;

    /** Other parameters */
    	other_param:pjsip_param;

}
