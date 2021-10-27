/**
 * This enumeration describes subset of standard activities as
 * described by RFC 4480, RPID: Rich Presence Extensions to the
 * Presence Information Data Format (PIDF).
 */
import { pj_str_t } from "../pjsip/c_types_to_ts";

export enum pjrpid_activity {
  /** Activity is unknown. The activity would then be conceived
   *  in the "note" field.
   */
  PJRPID_ACTIVITY_UNKNOWN,

  /** The person is away */
  PJRPID_ACTIVITY_AWAY,

  /** The person is busy */
  PJRPID_ACTIVITY_BUSY

}

/**
 * This enumeration describes types of RPID element.
 */
export enum pjrpid_element_type {
  /** RPID <person> element */
  PJRPID_ELEMENT_TYPE_PERSON

}

/**
 * This structure describes person information in RPID document.
 */
export interface pjrpid_element {
  /** Element type. */
  type: pjrpid_element_type;

  /** Optional id to set on the element. */
  id: pj_str_t;

  /** Activity type. */
  activity: pjrpid_activity;

  /** Optional text describing the person/element. */
  note: pj_str_t;

}
