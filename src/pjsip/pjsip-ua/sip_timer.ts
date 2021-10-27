/**
 * This structure describes Session Timers settings in an invite session.
 */
import { pj_str_t, unsigned } from "../pjsip/c_types_to_ts";
import { pjsip_param } from "../pjsip/sip_uri";

export interface pjsip_timer_setting
{
    /**
     * Specify minimum session expiration period, in seconds. Must not be
     * lower than 90. Default is 90.
     */
    			 min_se:unsigned;

    /**
     * Specify session expiration period, in seconds. Must not be lower than
     * #min_se. Default is 1800.
     */
    			 sess_expires:unsigned;

}

/**
 * SIP Session-Expires header (RFC 4028).
 */
export interface pjsip_sess_expires_hdr
{
    /** Session expiration period */
    	sess_expires:unsigned;

    /** Refresher */
    	refresher:pj_str_t;

    /** Other parameters */
    	other_param:pjsip_param;

}

/**
 * SIP Min-SE header (RFC 4028).
 */
export interface pjsip_min_se_hdr
{
    /** Minimum session expiration period */
    	min_se:unsigned;

    /** Other parameters */
    	other_param:pjsip_param;

}
