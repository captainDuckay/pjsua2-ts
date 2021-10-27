import { pj_bool_t, pj_str_t } from "../pjsip/c_types_to_ts";

export interface pjpidf_status_op {
  construct (pj_pool_t, pjpidf_status);

  is_basic_open (pjpidf_status): pj_bool_t;

  set_basic_open (pjpidf_status, pj_bool_t);
}

export interface pjpidf_tuple_op {
  construct (pj_pool_t, pjpidf_tuple, pj_str_t);

  get_id (pjpidf_tuple): pj_str_t;

  set_id (pj_pool_t, pjpidf_tuple, pj_str_t);

  get_status (pjpidf_tuple): pjpidf_status;

  get_contact (pjpidf_tuple): pj_str_t;

  set_contact (pj_pool_t, pjpidf_tuple, pj_str_t);

  set_contact_prio (pj_pool_t, pjpidf_tuple, pj_str_t);

  get_contact_prio (pjpidf_tuple): pj_str_t;

  add_note (pj_pool_t, pjpidf_tuple, pj_str_t): pjpidf_note;

  get_first_note (pjpidf_tuple): pjpidf_note;

  get_next_note (pjpidf_tuple, pjpidf_note): pjpidf_note;

  get_timestamp (pjpidf_tuple): pj_str_t;

  set_timestamp (pj_pool_t, pjpidf_tuple, pj_str_t);

  set_timestamp_np (pj_pool_t, pjpidf_tuple, pj_str_t);

}

export interface pjpidf_pres_op {
  construct (pj_pool_t, pjpidf_pres, pj_str_t);

  add_tuple (pj_pool_t, pjpidf_pres, pj_str_t): pjpidf_tuple;

  get_first_tuple (pjpidf_pres): pjpidf_tuple;

  get_next_tuple (pjpidf_pres, pjpidf_tuple): pjpidf_tuple;

  find_tuple (pjpidf_pres, pj_str_t): pjpidf_tuple;

  remove_tuple (pjpidf_pres, pjpidf_tuple);

  add_note (pj_pool_t, pjpidf_pres, pj_str_t): pjpidf_note;

  get_first_note (pjpidf_pres): pjpidf_note;

  get_next_note (pjpidf_pres, pjpidf_note): pjpidf_note;

}

export interface pjpidf_op_desc {
  pres: pjpidf_pres_op;
  tuple: pjpidf_tuple_op;
  status: pjpidf_status_op;
}

