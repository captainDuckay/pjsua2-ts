

/**
 * Top most media type. See also #pjmedia_type_name().
 */
export enum pjmedia_type {
    /** Type is not specified. */
    PJMEDIA_TYPE_NONE,

    /** The media is audio */
    PJMEDIA_TYPE_AUDIO,

    /** The media is video. */
    PJMEDIA_TYPE_VIDEO,

    /** The media is application. */
    PJMEDIA_TYPE_APPLICATION,

    /** The media type is unknown or unsupported. */
    PJMEDIA_TYPE_UNKNOWN

}

/**
 * Media transport protocol and profile.
 */
export enum pjmedia_tp_proto {
    /* Basic transports */

    /** No transport type */
    PJMEDIA_TP_PROTO_NONE = 0,

    /** Transport unknown */
    PJMEDIA_TP_PROTO_UNKNOWN = (1 << 0),

    /** UDP transport */
    PJMEDIA_TP_PROTO_UDP = (1 << 1),

    /** RTP transport */
    PJMEDIA_TP_PROTO_RTP = (1 << 2),

    /** DTLS transport */
    PJMEDIA_TP_PROTO_DTLS = (1 << 3),

    /* Basic profiles */

    /** RTCP Feedback profile */
    PJMEDIA_TP_PROFILE_RTCP_FB = (1 << 13),

    /** Secure RTP profile */
    PJMEDIA_TP_PROFILE_SRTP = (1 << 14),

    /** Audio/video profile */
    PJMEDIA_TP_PROFILE_AVP = (1 << 15),

    /* Predefined transport profiles (commonly used) */

    /** RTP using A/V profile */
    PJMEDIA_TP_PROTO_RTP_AVP = (PJMEDIA_TP_PROTO_RTP |
      PJMEDIA_TP_PROFILE_AVP),

    /** Secure RTP using A/V profile */
    PJMEDIA_TP_PROTO_RTP_SAVP = (PJMEDIA_TP_PROTO_RTP_AVP |
      PJMEDIA_TP_PROFILE_SRTP),

    /** Secure RTP using A/V profile and DTLS-SRTP keying */
    PJMEDIA_TP_PROTO_DTLS_SRTP = (PJMEDIA_TP_PROTO_DTLS |
      PJMEDIA_TP_PROTO_RTP_SAVP),

    /** RTP using A/V and RTCP feedback profile */
    PJMEDIA_TP_PROTO_RTP_AVPF = (PJMEDIA_TP_PROTO_RTP_AVP |
      PJMEDIA_TP_PROFILE_RTCP_FB),

    /** Secure RTP using A/V and RTCP feedback profile */
    PJMEDIA_TP_PROTO_RTP_SAVPF = (PJMEDIA_TP_PROTO_RTP_SAVP |
      PJMEDIA_TP_PROFILE_RTCP_FB),

    /** Secure RTP using A/V and RTCP feedback profile and DTLS-SRTP keying */
    PJMEDIA_TP_PROTO_DTLS_SRTPF = (PJMEDIA_TP_PROTO_DTLS_SRTP |
      PJMEDIA_TP_PROFILE_RTCP_FB),

}

/**
 * Media direction.
 */
export enum pjmedia_dir {
    /** None */
    PJMEDIA_DIR_NONE = 0,

    /** Encoding (outgoing to network) stream, also known as capture */
    PJMEDIA_DIR_ENCODING = 1,

    /** Same as encoding direction. */
    PJMEDIA_DIR_CAPTURE = PJMEDIA_DIR_ENCODING,

    /** Decoding (incoming from network) stream, also known as playback. */
    PJMEDIA_DIR_DECODING = 2,

    /** Same as decoding. */
    PJMEDIA_DIR_PLAYBACK = PJMEDIA_DIR_DECODING,

    /** Same as decoding. */
    PJMEDIA_DIR_RENDER = PJMEDIA_DIR_DECODING,

    /** Incoming and outgoing stream, same as PJMEDIA_DIR_CAPTURE_PLAYBACK */
    PJMEDIA_DIR_ENCODING_DECODING = 3,

    /** Same as ENCODING_DECODING */
    PJMEDIA_DIR_CAPTURE_PLAYBACK = PJMEDIA_DIR_ENCODING_DECODING,

    /** Same as ENCODING_DECODING */
    PJMEDIA_DIR_CAPTURE_RENDER = PJMEDIA_DIR_ENCODING_DECODING

}

/**
 * Enumeration for picture coordinate base.
 */
export enum pjmedia_coord_base {
    /**
     * This specifies that the pixel [0, 0] location is at the left-top
     * position.
     */
    PJMEDIA_COORD_BASE_LEFT_TOP,

    /**
     * This specifies that the pixel [0, 0] location is at the left-bottom
     * position.
     */
    PJMEDIA_COORD_BASE_LEFT_BOTTOM

}

/**
 * This structure is used to represent rational numbers.
 */
export interface pjmedia_ratio {
    num: number;
    /** < Numerator. */
    denum: number;  /** < Denumerator. */
}

/**
 * This structure represent a coordinate.
 */
export interface pjmedia_coord {
    x: number;
    /**< X position of the coordinate */
    y: number;	/**< Y position of the coordinate */
}

/**
 * This structure represents rectangle size.
 */
export interface pjmedia_rect_size {
    w: number;
    /**< The width.    */
    h: number;	/**< The height.  */
}

/**
 * This structure describes a rectangle.
 */
export interface pjmedia_rect {
    coord: pjmedia_coord;
    /**< The position.  */
    size: pjmedia_rect_size;	/**< The size.    */
}


/**
 * Enumeration for video/picture orientation.
 */
export enum pjmedia_orient {
    /**
     * Unknown orientation.
     */
    PJMEDIA_ORIENT_UNKNOWN,

    /**
     * Natural orientation, i.e. the original orientation video will be
     * displayed/captured without rotation.
     */
    PJMEDIA_ORIENT_NATURAL,

    /**
     * Specifies that the video/picture needs to be rotated 90 degrees
     * from its natural orientation in clockwise direction from the user's
     * perspective.
     * Note that for devices with back cameras (which faces away
     * from the user), the video will actually need to be rotated
     * 270 degrees clockwise instead.
     */
    PJMEDIA_ORIENT_ROTATE_90DEG,

    /**
     * Specifies that the video/picture needs to be rotated 180 degrees
     * from its natural orientation.
     */
    PJMEDIA_ORIENT_ROTATE_180DEG,

    /**
     * Specifies that the video/picture needs to be rotated 270 degrees
     * from its natural orientation in clockwise direction from the user's
     * perspective.
     * Note that for devices with back cameras (which faces away
     * from the user), the video will actually need to be rotated
     * 90 degrees clockwise instead.
     */
    PJMEDIA_ORIENT_ROTATE_270DEG

}

