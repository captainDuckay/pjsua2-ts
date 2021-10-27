import { int, long, pj_status_t, unsigned } from '../pjsip/c_types_to_ts'

export type TransportId = number
export type SocketAddress = string

export type StringVector = string[]
export type IntVector = number[]
export type Token = void
export type TransportHandle = void
export type TimerEntry = void
export type GenericData = void

/**
 * ants
 */
enum
{
  /** Invalid ID, equal to PJSUA_INVALID_ID */
  INVALID_ID	= -1,

  /** Success, equal to PJ_SUCCESS */
  SUCCESS = 0
};

//////////////////////////////////////////////////////////////////////////////

/**
 * This structure contains information about an error that is thrown
 * as an exception.
 */
export interface Error
{
  /** The error code. */
  	status:pj_status_t;

  /** The PJSUA API operation that throws the error. */
  	title:string;

  /** The error message */
  	reason:string;

  /** The PJSUA source file that throws the error */
  	srcFile:string;

  /** The line number of PJSUA source file that throws the error */
  		srcLine:int;

  /** Build error string. */
  	info( multi_line:boolean):string;

  /** Default ructor */
  Error();

  /**
   * ruct an Error instance from the specified parameters. If
   * \a prm_reason is empty, it will be filled with the error description
   *  for the status code.
   */
  Error( prm_status:pj_status_t, prm_title:string, prm_reason:string, prm_src_file:string, prm_src_line:int);
};


//////////////////////////////////////////////////////////////////////////////
/**
 * Version information.
 */
export interface Version
{
  /** Major number */
  		major:int;

  /** Minor number */
  		minor:int;

  /** Additional revision number */
  		rev:int;

  /** Version suffix (e.g. "-svn") */
  	suffix:string;

  /** The full version info (e.g. "2.1.0-svn") */
  	full:string;

  /**
   * PJLIB version number as three bytes with the following format:
   * 0xMMIIRR00, where MM: major number, II: minor number, RR: revision
   * number, 00: always zero for now.
   */
  	numeric:unsigned;
};

//////////////////////////////////////////////////////////////////////////////

/**
 * Representation of time value.
 */
export interface TimeVal
{
  /**
   * The seconds part of the time.
   */
   sec:long;

  /**
   * The miliseconds fraction of the time.
   */
   msec:long;

   fromPj(  prm:pj_time_val);
};
