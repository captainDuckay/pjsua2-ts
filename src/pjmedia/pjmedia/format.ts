/**
 * This enumeration uniquely identify audio sample and/or video pixel formats.
 * Some well known formats are listed here. The format ids are built by
 * combining four character codes, similar to FOURCC. The format id is
 * extensible, as application may define and use format ids not declared
 * on this enumeration.
 *
 * This format id along with other information will fully describe the media
 * in #pjmedia_format structure.
 */
import { pjmedia_rect_size, pjmedia_type } from "../../pjsip/pjsua2/types";

export enum pjmedia_format_id {
  /*
   * Audio formats
   */

  /** 16bit signed integer linear PCM audio */
  PJMEDIA_FORMAT_L16 = 0,

  /** Alias for PJMEDIA_FORMAT_L16 */
  PJMEDIA_FORMAT_PCM = PJMEDIA_FORMAT_L16,

  /** G.711 ALAW */
  PJMEDIA_FORMAT_PCMA = "ALAW",

  /** Alias for PJMEDIA_FORMAT_PCMA */
  PJMEDIA_FORMAT_ALAW = PJMEDIA_FORMAT_PCMA,

  /** G.711 ULAW */
  PJMEDIA_FORMAT_PCMU = "uLAW",

  /** Aliaw for PJMEDIA_FORMAT_PCMU */
  PJMEDIA_FORMAT_ULAW = PJMEDIA_FORMAT_PCMU,

  /** AMR narrowband */
  PJMEDIA_FORMAT_AMR = "AMR",

  /** ITU G.729 */
  PJMEDIA_FORMAT_G729 = "G729",

  /** Internet Low Bit-Rate Codec (ILBC) */
  PJMEDIA_FORMAT_ILBC = "ILBC",

  /*
   * Video formats.
   */
  /**
   * 24bit RGB
   */
  PJMEDIA_FORMAT_RGB24 = "RGB3",

  /**
   * 32bit RGB with alpha channel
   */
  PJMEDIA_FORMAT_RGBA = "RGBA",
  PJMEDIA_FORMAT_BGRA = "BGRA",

  /**
   * Alias for PJMEDIA_FORMAT_RGBA
   */
  PJMEDIA_FORMAT_RGB32 = PJMEDIA_FORMAT_RGBA,

  /**
   * Device Independent Bitmap, alias for 24 bit RGB
   */
  PJMEDIA_FORMAT_DIB = "DIB",

  /**
   * This is planar 4:4:4/24bpp RGB format, the data can be treated as
   * three planes of color components, where the first plane contains
   * only the G samples, the second plane contains only the B samples,
   * and the third plane contains only the R samples.
   */
  PJMEDIA_FORMAT_GBRP = "GBRP",

  /**
   * This is a packed 4:4:4/32bpp format, where each pixel is encoded as
   * four consecutive bytes, arranged in the following sequence: V0, U0,
   * Y0, A0. Source:
   * http://msdn.microsoft.com/en-us/library/dd206750%28v=VS.85%29.aspx#ayuv
   */
  PJMEDIA_FORMAT_AYUV = "AYUV",

  /**
   * This is packed 4:2:2/16bpp YUV format, the data can be treated as
   * an array of unsigned char values, where the first byte contains
   * the first Y sample, the second byte contains the first U (Cb) sample,
   * the third byte contains the second Y sample, and the fourth byte
   * contains the first V (Cr) sample, and so forth. Source:
   * http://msdn.microsoft.com/en-us/library/dd206750%28v=VS.85%29.aspx#yuy2
   */
  PJMEDIA_FORMAT_YUY2 = "YUY2",

  /**
   * This format is the same as the YUY2 format except the byte order is
   * reversed -- that is, the chroma and luma bytes are flipped. If the
   * image is addressed as an array of two little-endian WORD values, the
   * first WORD contains U in the LSBs and Y0 in the MSBs, and the second
   * WORD contains V in the LSBs and Y1 in the MSBs. Source:
   * http://msdn.microsoft.com/en-us/library/dd206750%28v=VS.85%29.aspx#uyvy
   */
  PJMEDIA_FORMAT_UYVY = "UYVY",

  /**
   * This format is the same as the YUY2 and UYVY format except the byte
   * order is reversed -- that is, the chroma and luma bytes are flipped.
   * If the image is addressed as an array of two little-endian WORD values,
   * the first WORD contains Y0 in the LSBs and V in the MSBs, and the second
   * WORD contains Y1 in the LSBs and U in the MSBs.
   */
  PJMEDIA_FORMAT_YVYU = "YVYU",

  /**
   * This is planar 4:2:0/12bpp YUV format, the data can be treated as
   * three planes of color components, where the first plane contains
   * only the Y samples, the second plane contains only the U (Cb) samples,
   * and the third plane contains only the V (Cr) sample.
   */
  PJMEDIA_FORMAT_I420 = "I420",

  /**
   * IYUV is alias for I420.
   */
  PJMEDIA_FORMAT_IYUV = PJMEDIA_FORMAT_I420,

  /**
   * This is planar 4:2:0/12bpp YUV format, similar to I420 or IYUV but
   * the U (Cb) and V (Cr) planes order is switched, i.e: the second plane
   * contains the V (Cb) samples and the third plane contains the V (Cr)
   * samples.
   */
  PJMEDIA_FORMAT_YV12 = "YV12",

  /**
   * This is planar 4:2:0/12bpp YUV format, the data can be treated as
   * two planes of color components, where the first plane contains
   * only the Y samples, the second plane contains interleaved
   * U (Cb) - V (Cr) samples.
   */
  PJMEDIA_FORMAT_NV12 = "NV12",

  /**
   * This is planar 4:2:0/12bpp YUV format, the data can be treated as
   * two planes of color components, where the first plane contains
   * only the Y samples, the second plane contains interleaved
   * V (Cr) - U (Cb) samples.
   */
  PJMEDIA_FORMAT_NV21 = "NV21",

  /**
   * This is planar 4:2:2/16bpp YUV format, the data can be treated as
   * three planes of color components, where the first plane contains
   * only the Y samples, the second plane contains only the U (Cb) samples,
   * and the third plane contains only the V (Cr) sample.
   */
  PJMEDIA_FORMAT_I422 = "I422",

  /**
   * The JPEG version of planar 4:2:0/12bpp YUV format.
   */
  PJMEDIA_FORMAT_I420JPEG = "J420",

  /**
   * The JPEG version of planar 4:2:2/16bpp YUV format.
   */
  PJMEDIA_FORMAT_I422JPEG = "J422",

  /**
   * Encoded video formats
   */

  PJMEDIA_FORMAT_H261 = "H261",
  PJMEDIA_FORMAT_H263 = "H263",
  PJMEDIA_FORMAT_H263P = "P263",
  PJMEDIA_FORMAT_H264 = "H264",

  PJMEDIA_FORMAT_VP8 = "VP80",
  PJMEDIA_FORMAT_VP9 = "VP90",

  PJMEDIA_FORMAT_MJPEG = "MJPG",
  PJMEDIA_FORMAT_MPEG1VIDEO = "MP1V",
  PJMEDIA_FORMAT_MPEG2VIDEO = "MP2V",
  PJMEDIA_FORMAT_MPEG4 = "MPG4",

  PJMEDIA_FORMAT_INVALID = 0xFFFFFFFF

}

/**
 * This enumeration specifies what type of detail is included in a
 * #pjmedia_format structure.
 */
export enum pjmedia_format_detail_type {
  /** Format detail is not specified. */
  PJMEDIA_FORMAT_DETAIL_NONE,

  /** Audio format detail. */
  PJMEDIA_FORMAT_DETAIL_AUDIO,

  /** Video format detail. */
  PJMEDIA_FORMAT_DETAIL_VIDEO,

  /** Number of format detail type that has been defined. */
  PJMEDIA_FORMAT_DETAIL_MAX

}

/**
 * This structure is put in \a detail field of #pjmedia_format to describe
 * detail information about an audio media.
 */
export interface pjmedia_audio_format_detail {
  clock_rate: number;
  /**< Audio clock rate in samples or Hz. */
  channel_count: number;
  /**< Number of channels.    */
  frame_time_usec: number;
  /**< Frame interval, in microseconds.  */
  bits_per_sample: number;
  /**< Number of bits per sample.    */
  avg_bps: number;
  /**< Average bitrate      */
  max_bps: number;	/**< Maximum bitrate      */
}

/**
 * This structure is put in \a detail field of #pjmedia_format to describe
 * detail information about a video media.
 *
 * Additional information about a video format can also be retrieved by
 * calling #pjmedia_get_video_format_info().
 */
export interface pjmedia_video_format_detail {
  size: pjmedia_rect_size;
  /**< Video size (width, height)  */
  fps: pjmedia_ratio;
  /**< Number of frames per second.  */
  avg_bps: number;
  /**< Average bitrate.      */
  max_bps: number;/**< Maximum bitrate.      */
}

/**
 * This structure contains all the information needed to completely describe
 * a media.
 */
export interface pjmedia_format {
  /**
   * The format id that specifies the audio sample or video pixel format.
   * Some well known formats ids are declared in pjmedia_format_id
   * enumeration.
   *
   * @see pjmedia_format_id
   */
  id: number;

  /**
   * The top-most type of the media, as an information.
   */
  type: pjmedia_type;

  /**
   * The type of detail structure in the \a detail pointer.
   */
  detail_type: pjmedia_format_detail_type;

  /**
   * Detail section to describe the media.
   */
  det: {
    /**
     * Detail section for audio format.
     */
    aud: pjmedia_audio_format_detail;

    /**
     * Detail section for video format.
     */
    vid: pjmedia_video_format_detail;

    /**
     * Reserved area for user-defined format detail.
     */
    user: string[];
  };

}

/**
 * This enumeration describes video color model. It mostly serves as
 * information only.
 */
export enum pjmedia_color_model {
  /** The color model is unknown or unspecified. */
  PJMEDIA_COLOR_MODEL_NONE,

  /** RGB color model. */
  PJMEDIA_COLOR_MODEL_RGB,

  /** YUV color model. */
  PJMEDIA_COLOR_MODEL_YUV
}

/**
 * This structure holds information to apply a specific video format
 * against size and buffer information, and get additional information
 * from it. To do that, application fills up the input fields of this
 * structure, and give this structure to \a apply_fmt() function
 * of #pjmedia_video_format_info structure.
 */
export interface pjmedia_video_apply_fmt_param {
  /* input fields: */

  /**
   * [IN] The image size. This field is mandatory, and has to be set
   * correctly prior to calling \a apply_fmt() function.
   */
  size: pjmedia_rect_size;

  /**
   * [IN] Pointer to the buffer that holds the frame. The \a apply_fmt()
   * function uses this pointer to calculate the pointer for each video
   * planes of the media. This field is optional -- however, the
   * \a apply_fmt() would still fill up the \a planes[] array with the
   * correct pointer even though the buffer is set to NULL. This could be
   * useful to calculate the size (in bytes) of each plane.
   */
  buffer: number;

  /* output fields: */

  /**
   * [OUT] The size (in bytes) required of the buffer to hold the video
   * frame of the particular frame size (width, height).
   */
  framebytes: number;

  /**
   * [OUT] Array of strides value (in bytes) for each video plane.
   */
  strides: number[];

  /**
   * [OUT] Array of pointers to each of the video planes. The values are
   * calculated from the \a buffer field.
   */
  planes: number[];

  /**
   * [OUT] Array of video plane sizes.
   */
  plane_bytes: number[];

}

/**
 * This structure holds information to describe a video format. Application
 * can retrieve this structure by calling #pjmedia_get_video_format_info()
 * funcion.
 */
export interface pjmedia_video_format_info {
  /**
   * The unique format ID of the media. Well known format ids are declared
   * in pjmedia_format_id enumeration.
   */
  id: number;

  /**
   * Null terminated string containing short identification about the
   * format.
   */
  name: string[];

  /**
   * Information about the color model of this video format.
   */
  color_model: pjmedia_color_model;

  /**
   * Number of bits needed to store one pixel of this video format.
   */
  bpp: number;

  /**
   * Number of video planes that this format uses. Value 1 indicates
   * packed format, while value greater than 1 indicates planar format.
   */
  plane_cnt: number;

  /**
   * Pointer to function to apply this format against size and buffer
   * information in pjmedia_video_apply_fmt_param argument. Application
   * uses this function to obtain various information such as the
   * memory size of a frame buffer, strides value of the image, the
   * location of the planes, and so on. See pjmedia_video_apply_fmt_param
   * for additional information.
   *
   * @param vfi  The video format info.
   * @param vafp  The parameters to investigate.
   *
   * @return    PJ_SUCCESS if the function has calculated the
   *      information in \a vafp successfully.
   */
  apply_fmt (vfi: pjmedia_video_format_info, vafp: pjmedia_video_apply_fmt_param): pj_status_t;

}

