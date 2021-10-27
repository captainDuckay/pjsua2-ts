/**
 * This enumeration specifies the packetization property of video encoding
 * process. The value is bitmask, and smaller value will have higher priority
 * to be used.
 */
import { pjmedia_dir, pjmedia_ratio } from "../../pjsip/pjsua2/types";

export enum pjmedia_vid_packing {
  /**
   * This specifies that the packetization is unknown, or if nothing
   * is supported.
   */
  PJMEDIA_VID_PACKING_UNKNOWN,

  /**
   * This specifies that the result of video encoding process will be
   * segmented into packets, which is suitable for RTP transmission.
   * The maximum size of the packets is set in \a enc_mtu field of
   * pjmedia_vid_codec_param.
   */
  PJMEDIA_VID_PACKING_PACKETS = 1,

  /**
   * This specifies that video encoding function will produce a whole
   * or full frame from the source frame. This is normally used for
   * encoding video for offline storage such as to an AVI file. The
   * maximum size of the packets is set in \a enc_mtu field of
   * pjmedia_vid_codec_param.
   */
  PJMEDIA_VID_PACKING_WHOLE = 2

}

/**
 * Enumeration of video frame info flag for the bit_info field in the
 * pjmedia_frame.
 */
export enum pjmedia_vid_frm_bit_info {
  /**
   * The video frame is keyframe.
   */
  PJMEDIA_VID_FRM_KEYFRAME = 1

}

/**
 * Encoding option.
 */
export interface pjmedia_vid_encode_opt {
  /**
   * Flag to force the encoder to generate keyframe for the specified input
   * frame. When this flag is set, application can verify the result by
   * examining PJMEDIA_VID_FRM_KEYFRAME flag in the bit_info field of the
   * output frame.
   */
  force_keyframe: pj_bool_t;

}

/**
 * Identification used to search for codec factory that supports specific
 * codec specification.
 */
export interface pjmedia_vid_codec_info {
  /**< Encoded format ID              */
  fmt_id: pjmedia_format_id;
  /**< Payload type        */
  pt: number;
  /**< Encoding name                  */
  encoding_name: string;
  /**< Encoding desc        */
  encoding_desc: string;
  /**< Clock rate          */
  clock_rate: number;
  /**< Direction                      */
  dir: pjmedia_dir;
  /**< # of supported encoding source
   format IDs                     */
  dec_fmt_id: pjmedia_format_id[];
  /**< Supported encoding source
   format IDs                     */
  dec_fmt_id_cnt: number;
  /**< Supported or requested packings,
   strategies, bitmask from
   pjmedia_vid_packing      */
  packings: number;
  /**< # of supported frame-rates, can be
   zero (support any frame-rate)  */
  fps_cnt: number;
  /**< Supported frame-rates      */
  fps: pjmedia_ratio[];

}

/**
 * Detailed codec attributes used in configuring a codec and in querying
 * the capability of codec factories. Default attributes of any codecs could
 * be queried using #pjmedia_vid_codec_mgr_get_default_param() and modified
 * using #pjmedia_vid_codec_mgr_set_default_param().
 *
 * Please note that codec parameter also contains SDP specific setting,
 * #dec_fmtp and #enc_fmtp, which may need to be set appropriately based on
 * the effective setting. See each codec documentation for more detail.
 */
export interface pjmedia_vid_codec_param {
  /**< Direction                      */
  dir: pjmedia_dir;
  /**< Packetization strategy.      */
  packing: pjmedia_vid_packing;

  /**< Encoded format              */
  enc_fmt: pjmedia_format;
  /**< Encoder fmtp params      */
  enc_fmtp: pjmedia_codec_fmtp;
  /**< MTU or max payload size setting*/
  enc_mtu: number;

  /**< Decoded format              */
  dec_fmt: pjmedia_format;
  /**< Decoder fmtp params      */
  dec_fmtp: pjmedia_codec_fmtp;

  /**< Ignore fmtp params. If set to
   PJ_TRUE, the codec will apply
   format settings specified in
   enc_fmt and dec_fmt only.      */
  ignore_fmtp: boolean;

}

/**
 * This structure describes codec operations. Each codec MUST implement
 * all of these functions.
 */
export interface pjmedia_vid_codec_op {
  /**
   * See #pjmedia_vid_codec_init().
   */
  init (codec: pjmedia_vid_codec, pool: pj_pool_t): pj_status_t;

  /**
   * See #pjmedia_vid_codec_open().
   */
  open (codec: pjmedia_vid_codec, param: pjmedia_vid_codec_param): pj_status_t;

  /**
   * See #pjmedia_vid_codec_close().
   */
  close (codec: pjmedia_vid_codec): pj_status_t;

  /**
   * See #pjmedia_vid_codec_modify().
   */
  modify (codec: pjmedia_vid_codec, param: pjmedia_vid_codec_param): pj_status_t;

  /**
   * See #pjmedia_vid_codec_get_param().
   */
  get_param (codec: pjmedia_vid_codec, param: pjmedia_vid_codec_param): pj_status_t;

  /**
   * See #pjmedia_vid_codec_encode_begin().
   */
  encode_begin (codec: pjmedia_vid_codec, opt: pjmedia_vid_encode_opt, input: pjmedia_frame, out_size: number, output: pjmedia_frame, has_more: pj_bool_t): pj_status_t;

  /**
   * See #pjmedia_vid_codec_encode_more()
   */
  encode_more (codec: pjmedia_vid_codec, out_size: number, output: pjmedia_frame, has_more: boolean): pj_status_t;

  /*
   * See #pjmedia_vid_codec_decode().
   */
  decode (codec: pjmedia_vid_codec, count: pj_size_t, packets: pjmedia_frame[], out_size: number, output: pjmedia_frame): pj_status_t;

  /**
   * See #pjmedia_vid_codec_recover()
   */
  recover (codec: pjmedia_vid_codec, out_size: number, output: pjmedia_frame): pj_status_t;

}

/*
 * Forward declaration for pjmedia_vid_codec_factory.
 */
export interface pjmedia_vid_codec_factory

pjmedia_vid_codec_factory;

/**
 * This structure describes a video codec instance. Codec implementers
 * should use #pjmedia_vid_codec_init() to initialize this structure with
 * default values.
 */
export interface pjmedia_vid_codec {

  /** Codec's private data. */
  codec_data;

  /** Codec factory where this codec was allocated. */
  factory: pjmedia_vid_codec_factory;

  /** Operations to codec. */
  op: pjmedia_vid_codec_op;
};

/**
 * This structure describes operations that must be supported by codec
 * factories.
 */
export interface pjmedia_vid_codec_factory_op {
  /**
   * Check whether the factory can create codec with the specified
   * codec info.
   *
   * @param factory  The codec factory.
   * @param info  The codec info.
   *
   * @return    PJ_SUCCESS if this factory is able to create an
   *      instance of codec with the specified info.
   */
  test_alloc (factory: pjmedia_vid_codec_factory, info: pjmedia_vid_codec_info): pj_status_t;

  /**
   * Create default attributes for the specified codec ID. This function
   * can be called by application to get the capability of the codec.
   *
   * @param factory  The codec factory.
   * @param info  The codec info.
   * @param attr  The attribute to be initialized.
   *
   * @return    PJ_SUCCESS if success.
   */
  default_attr (factory: pjmedia_vid_codec_factory, info: pjmedia_vid_codec_info, attr: pjmedia_vid_codec_param): pj_status_t;

  /**
   * Enumerate supported codecs that can be created using this factory.
   *
   *  @param factory  The codec factory.
   *  @param count  On input, specifies the number of elements in
   *      the array. On output, the value will be set to
   *      the number of elements that have been initialized
   *      by this function.
   *  @param codecs  The codec info array, which contents will be
   *      initialized upon return.
   *
   *  @return    PJ_SUCCESS on success.
   */
  enum_info (factory: pjmedia_vid_codec_factory, count: number, codecs: pjmedia_vid_codec_info[]): pj_status_t;

  /**
   * Create one instance of the codec with the specified codec info.
   *
   * @param factory  The codec factory.
   * @param info  The codec info.
   * @param p_codec  Pointer to receive the codec instance.
   *
   * @return    PJ_SUCCESS on success.
   */
  alloc_codec (factory: pjmedia_vid_codec_factory, info: pjmedia_vid_codec_info, p_codec: pjmedia_vid_codec): pj_status_t;

  /**
   * This function is called by codec manager to return a particular
   * instance of codec back to the codec factory.
   *
   * @param factory  The codec factory.
   * @param codec  The codec instance to be returned.
   *
   * @return    PJ_SUCCESS on success.
   */
  dealloc_codec (factory: pjmedia_vid_codec_factory, codec: pjmedia_vid_codec): pj_status_t;

}

/**
 * Codec factory describes a module that is able to create codec with specific
 * capabilities. These capabilities can be queried by codec manager to create
 * instances of codec.
 */
export interface pjmedia_vid_codec_factory {
  /** Entries to put this structure in the codec manager list. */
  PJ_DECL_LIST_MEMBER (pjmedia_vid_codec_factory);

  /** The factory's private data. */
  factory_data: void;

  /** Operations to the factory. */
  o: pjmedia_vid_codec_factory_op;

}
