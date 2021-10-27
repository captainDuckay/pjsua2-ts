/**
 * @defgroup PJMED_OPUS Opus Codec Family
 * @ingroup PJMEDIA_CODEC_CODECS
 * @brief Opus codec wrapper
 * @{
 *
 * This section describes functions to initialize and register Opus codec
 * factory to the codec manager. After the codec factory has been registered,
 * application can use @ref PJMEDIA_CODEC API to manipulate the codec.
 *
 * Opus codec uses multiple bit rates, and supports fullband (48 kHz
 * sampling rate), super wideband (24 kHz sampling rate), wideband (16 kHz
 * sampling rate), medium band (12kHz sampling rate), and narrowband
 * (8 kHz sampling rate).
 *
 *
 * \section codec_setting Codec Settings
 *
 * General codec settings for this codec such as VAD and PLC can be
 * manipulated through the <tt>setting</tt> field in #pjmedia_codec_param
 * (see the documentation of #pjmedia_codec_param for more info).
 *
 * For Opus codec specific settings, such as sample rate,
 * channel count, bit rate, complexity, and CBR, can be configured
 * in #pjmedia_codec_opus_config.
 * The default setting of sample rate is specified in
 * #PJMEDIA_CODEC_OPUS_DEFAULT_SAMPLE_RATE. The default setting of
 * bitrate is specified in #PJMEDIA_CODEC_OPUS_DEFAULT_BIT_RATE.
 * And the default setting of complexity is specified in
 * #PJMEDIA_CODEC_OPUS_DEFAULT_COMPLEXITY.
 *
 * After modifying any of these settings, application needs to call
 * #pjmedia_codec_opus_set_default_param(), which will generate the
 * appropriate decoding fmtp attributes.
 *
 * Here is an example of modifying the codec settings:
 \code
    pjmedia_codec_param param;
    pjmedia_codec_opus_config opus_cfg;

    pjmedia_codec_mgr_get_default_param(.., &param);
    pjmedia_codec_opus_get_config(&opus_cfg);
    ...
    // Set VAD
    param.setting.vad = 1;
    // Set PLC
    param.setting.vad = 1;
    // Set sample rate
    opus_cfg.sample_rate = 16000;
    // Set channel count
    opus_cfg.channel_cnt = 2;
    // Set bit rate
    opus_cfg.bit_rate = 20000;
    ...
    pjmedia_codec_opus_set_default_param(&opus_cfg, &param);
 \endcode
 *
 */

/**
 * Opus codec configuration.
 */
export interface pjmedia_codec_opus_config {
  /**< Sample rate in Hz.                     */
  sample_rate: number;
  /**< Number of channels.                    */
  channel_cnt: number;
  /**< Frame time in msec.        */
  frm_ptime: number;
  /**< Encoder bit rate in bps.    */
  bit_rate: number;
  /**< Encoder's expected packet loss pct.  */
  packet_loss: number;
  /**< Encoder complexity, 0-10(10 is highest)*/
  complexity: number;
  /**< Constant bit rate?      */
  cbr: boolean;
}





