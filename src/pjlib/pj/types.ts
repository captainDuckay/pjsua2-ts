import { char, int, long, pj_ssize_t, pj_uint64_t, short, signed, unsigned } from '../../pjsip/pjsip/c_types_to_ts'
import { pj_int64_t } from './compat/cc_armcc'

/** Signed 32bit integer. */
export type pj_int32_t = int;

/** Unsigned 32bit integer. */
export  type  pj_uint32_t = unsigned;

/** Signed 16bit integer. */
export  type  pj_int16_t = short;

/** Unsigned 16bit integer. */
export type  pj_uint16_t = short;

/** Signed 8bit integer. */
export  type  pj_int8_t = signed;

/** Unsigned 8bit integer. */
export  type  pj_uint8_t = unsigned;

/** Large unsigned integer. */
export type    pj_size_t = unsigned;

/** Status code. */
export type    pj_status = int;

/** Boolean. */
export type    pj_bool_t = boolean;

/** Some constants */
export enum pj_constants_ {
  /** Status is OK. */
  PJ_SUCCESS = 0,

  /** True value. */
  PJ_TRUE = 1,

  /** False value. */
  PJ_FALSE = 0
}

/* ************************************************************************* */

/*
 * Data structure types.
 */
/**
 * This type is used as replacement to legacy C string, and used throughout
 * the library. By convention, the string is NOT null terminated.
 */
export interface pj_str_t {
  /** Buffer pointer, which is by convention NOT null terminated. */
  ptr: char;

  /** The length of the string. */
  slen: pj_ssize_t;
}

/**
 * This structure represents high resolution (64bit) time value. The time
 * values represent time in cycles, which is retrieved by calling
 * #pj_get_timestamp().
 */
export interface pj_timestamp {
  u32:
    {
      lo: pj_uint32_t; /**< Low 32-bit value of the 64-bit value. */
      hi: pj_uint32_t;     /**< high 32-bit value of the 64-bit value. */
    };
  /**< The 64-bit value as two 32-bit values. */

  u64: pj_uint64_t;        /**< The whole 64-bit value, where available. */
}

/**
 * The opaque data type for linked list, which is used as arguments throughout
 * the linked list operations.
 */
export type pj_list_type;

/**
 * List.
 */
export type pj_list;

/**
 * Data type for hash search iterator.
 * This structure should be opaque, however applications need to declare
 * concrete variable of this type, that's why the declaration is visible here.
 */
export interface pj_hash_iterator_t {
  index: pj_uint32_t;
  /**< Internal index.     */
  entry: pj_hash_entry;     /**< Internal entry.     */
}

/**
 * Value type of an atomic variable.
 */
export type pj_atomic_value_t = PJ_ATOMIC_VALUE_TYPE;

/* ************************************************************************* */

/** Operating system handle. */
export type pj_oshandle_t = void;

export type  pj_sock_t = pj_int64_t;

/** Generic socket address. */
export type pj_sockaddr_t = void;

/** Color type. */
export  type pj_color_t = unsigned;

/** Exception id. */
export type pj_exception_id_t = int;

/* ************************************************************************* */

/**
 * Representation of time value in this library.
 * This type can be used to represent either an interval or a specific time
 * or date.
 */
export interface pj_time_val {
  /** The seconds part of the time. */
  sec: long;

  /** The miliseconds fraction of the time. */
  msec: long;

}

/**
 * This structure represent the parsed representation of time.
 * It is acquired by calling #pj_time_decode().
 */
export interface pj_parsed_time {
  /** This represents day of week where value zero means Sunday */
  wday: int;

  /* This represents day of the year, 0-365, where zero means
   *  1st of January.
   */
  /*int yday; */

  /** This represents day of month: 1-31 */
  day: int;

  /** This represents month, with the value is 0 - 11 (zero is January) */
  mon: int;

  /** This represent the actual year (unlike in ANSI libc where
   *  the value must be added by 1900).
   */
  year: int;

  /** This represents the second part, with the value is 0-59 */
  sec: int;

  /** This represents the minute part, with the value is: 0-59 */
  min: int;

  /** This represents the hour part, with the value is 0-23 */
  hour: int;

  /** This represents the milisecond part, with the value is 0-999 */
  msec: int;

}

/**
 * @}  // Time Management
 */

/* ************************************************************************* */
/*
 * Terminal.
 */

/**
 * Color code combination.
 */
enum color {
  PJ_TERM_COLOR_R = 2, /**< Red            */
  PJ_TERM_COLOR_G = 4, /**< Green          */
  PJ_TERM_COLOR_B = 1, /**< Blue.          */
  PJ_TERM_COLOR_BRIGHT = 8    /**< Bright mask.   */
}

