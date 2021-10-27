/**
 * This structure describes the individual body part inside a multipart
 * message body. It mainly contains the message body itself and optional
 * headers.
 */
import { pjsip_hdr, pjsip_msg_body } from "./sip_msg";

export interface pjsip_multipart_part {
  /**
   * Standard list element.
   */
  PJ_DECL_LIST_MEMBER (pjsip_multipart_part);

  /**
   * Optional message headers.
   */
  hdr: pjsip_hdr;

  /**
   * Pointer to the message body.
   */
  body: pjsip_msg_body;

}
