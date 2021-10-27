/**
 * tel: URI.
 */
export interface pjsip_tel_uri {
  /**< Pointer to virtual function table.  */
  vptr: pjsip_uri_vptr;
  /**< Global or local phone number  */
  number: string;
  /**< Phone context (for local number).  */
  context: string;
  /**< Extension param.      */
  ext_param: string;
  /**< ISDN sub-address param.    */
  isub_param: string;
  /**< Other parameter.      */
  other_param: pjsip_param;
}
