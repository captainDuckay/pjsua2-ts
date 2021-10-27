export type pj_pool_t = any
export type pj_char_t = string
export type pj_bool_t = boolean
export type pj_uint32_t = number
export type pj_uint64_t = number
export type pj_sock_t = number
export type pj_uint16_t = number
export type pj_int8_t = number
export type pj_uint8_t = number
export type pj_size_t = number
export type pj_ssize_t = number
export type pj_off_t = pj_ssize_t
export type pj_status_t = number
export type pj_int16_t = number
export type pj_int32_t = number
export type pj_oshandle_t = void
export type pj_sockaddr_t = void
export type pj_color_t = number
export type pj_exception_id_t = number
export type pj_exit_callback = number
export type pj_init = pj_status_t
export type pj_shutdown = void
export type pj_atexit = pj_status_t
export type pj_swap16 = number
export type pj_swap32 = number
export type long = number
export type short = number
export type int = number
export type unsigned = number
export type signed = number
export type char = string

export interface pj_timestamp {
  hi: number,
  lo: number
}


export enum pj_constants_ {
  /** Status is OK.*/
  PJ_SUCCESS =0,
  /** True value. */
  PJ_TRUE =1,
  /** False value. */
  PJ_FALSE =0
}

