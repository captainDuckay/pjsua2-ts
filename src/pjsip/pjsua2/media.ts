/**
 * This export interfaceure contains all the information needed to completely describe
 * a media.
 */
import {
  pjsua_codec_info,
  pjsua_conf_port_info,
  pjsua_vid_conf_port_info,
  pjsua_vid_preview_param,
  pjsua_vid_win_id
} from "../pjsua-lib/pjsua";
import { pjmedia_dir, pjmedia_type } from "./types";
import { pjmedia_codec_opus_config } from "../../pjmedia/pjmedia-codec/opus";
import { pjmedia_format, pjmedia_format_id } from "../../pjmedia/pjmedia/format";

export interface MediaFormat {
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

  MediaFormat ();
}

/**
 * This export interfaceure describe detail information about an audio media.
 */
export interface MediaFormatAudio {
  clockRate: number;
  /**< Audio clock rate in samples or Hz. */
  channelCount: number;
  /**< Number of channels.    */
  frameTimeUsec: number;
  /**< Frame interval, in microseconds.  */
  bitsPerSample: number;
  /**< Number of bits per sample.    */
  avgBps: number;
  /**< Average bitrate      */
  maxBps: number;		/**< Maximum bitrate      */

  /**
   * Conexport interface from pjmedia_format.
   */
  fromPj (format: pjmedia_format): void;

  /**
   * Export to pjmedia_format.
   */
  toPj (): pjmedia_format;
}

/**
 * This export interfaceure describe detail information about an video media.
 */
export interface MediaFormatVideo {
  width: number;
  /**< Video width.      */
  height: number;
  /**< Video height.      */
  fpsNum: number;
  /**< Frames per second numerator.  */
  fpsDenum: number;
  /**< Frames per second denumerator.  */
  avgBps: number;
  /**< Average bitrate.    */
  maxBps: number;	    /**< Maximum bitrate.    */

  /**
   * Conexport interface from pjmedia_format.
   */
  fromPj (format: pjmedia_format): void;

  /**
   * Export to pjmedia_format.
   */
  toPj (): pjmedia_format;
}

/** Array of MediaFormatAudio */
export type MediaFormatAudioVector = MediaFormatAudio[];

/** Array of MediaFormatVideo */
export type MediaFormatVideoVector = MediaFormatVideo[];

/**
 * This export interfaceure descibes information about a particular media port that
 * has been registered into the conference bridge.
 */
export interface ConfPortInfo {
  /**
   * Conference port number.
   */
  portId: number;

  /**
   * Port name.
   */
  name: string;

  /**
   * Media audio format information
   */
  format: MediaFormatAudio;

  /**
   * Tx level adjustment. Value 1.0 means no adjustment, value 0 means
   * the port is muted, value 2.0 means the level is amplified two times.
   */
  txLevelAdj: number;

  /**
   * Rx level adjustment. Value 1.0 means no adjustment, value 0 means
   * the port is muted, value 2.0 means the level is amplified two times.
   */
  rxLevelAdj: number;

  /**
   * Array of listeners (in other words, ports where this port is
   * transmitting to).
   */
  listeners: number[];

  /**
   * Conexport interface from pjsua_conf_port_info.
   */
  fromPj (port_info: pjsua_conf_port_info): void;
}

/**
 * Media port, corresponds to pjmedia_port
 */
export type MediaPort = void;

/**
 * Media.
 */
export interface Media {

  /**
   * Get type of the media.
   *
   * @return          The media type.
   */
  getType (): pjmedia_type;

  /**
   * Conexport interfaceor.
   */
  Media (med_type: pjmedia_type): Media;

  /**
   * Media type.
   */
  type: pjmedia_type;
}

/**
 * Parameters for AudioMedia::startTransmit2() method.
 */
export interface AudioMediaTransmitParam {
  /**
   * Signal level adjustment. Value 1.0 means no level adjustment,
   * while value 0 means to mute the port.
   *
   * Default: 1.0
   */
  level: number;

  /**
   * Default conexport interfaceor
   */
  AudioMediaTransmitParam ();
}

/**
 * Audio Media. This is a lite wrapper class for audio conference bridge port,
 * i.e: this class only maintains one data member, conference slot ID, and
 * the methods are simply proxies for conference bridge operations.
 *
 * Application can create a derived class and use registerMediaPort2()/
 * unregisterMediaPort() to register/unregister a media port to/from the
 * conference bridge.
 *
 * The library will not keep a list of AudioMedia instances, so any
 * AudioMedia (descendant) instances instantiated by application must be
 * maintained and destroyed by the application itself.
 *
 * Note that any PJSUA2 APIs that return AudioMedia instance(s) such as
 * Endpoint::mediaEnumPorts2() or Call::getAudioMedia() will just return
 * generated copy. All AudioMedia methods should work normally on this
 * generated copy instance.
 */
export interface AudioMedia extends Media {
  /**
   * Get information about the specified conference port.
   */
  getPortInfo (): ConfPortInfo;

  /**
   * Get port Id.
   */
  getPortId (): number;

  /**
   * Get information from specific port id.
   */
  getPortInfoFromId (port_id: number): ConfPortInfo;

  /**
   * Establish unidirectional media flow to sink. This media port
   * will act as a source, and it may transmit to multiple destinations/sink.
   * And if multiple sources are transmitting to the same sink, the media
   * will be mixed together. Source and sink may refer to the same Media,
   * effectively looping the media.
   *
   * If bidirectional media flow is desired, application needs to call
   * this method twice, with the second one called from the opposite source
   * media.
   *
   * @param sink    The destination Media.
   */
  startTransmit (sink: AudioMedia): void;

  /**
   * Establish unidirectional media flow to sink. This media port
   * will act as a source, and it may transmit to multiple destinations/sink.
   * And if multiple sources are transmitting to the same sink, the media
   * will be mixed together. Source and sink may refer to the same Media,
   * effectively looping the media.
   *
   * Signal level from this source to the sink can be adjusted by making
   * it louder or quieter via the parameter param. The level adjustment
   * will apply to a specific connection only (i.e. only for signal
   * from this source to the sink), as compared to
   * adjustTxLevel()/adjustRxLevel() which applies to all signals from/to
   * this media port. The signal adjustment
   * will be cumulative, in this following order:
   * signal from this source will be adjusted with the level specified
   * in adjustTxLevel(), then with the level specified via this API,
   * and finally with the level specified to the sink's adjustRxLevel().
   *
   * If bidirectional media flow is desired, application needs to call
   * this method twice, with the second one called from the opposite source
   * media.
   *
   * @param sink    The destination Media.
   * @param param    The parameter.
   */
  startTransmit2 (sink: AudioMedia, param: AudioMediaTransmitParam);

  /**
   *  Stop media flow to destination/sink port.
   *
   * @param sink    The destination media.
   *
   */
  stopTransmit (sink: AudioMedia);

  /**
   * Adjust the signal level to be transmitted from the bridge to this
   * media port by making it louder or quieter.
   *
   * @param level    Signal level adjustment. Value 1.0 means no
   *        level adjustment, while value 0 means to mute
   *        the port.
   */
  adjustRxLevel (level: number);

  /**
   * Adjust the signal level to be received from this media port (to
   * the bridge) by making it louder or quieter.
   *
   * @param level    Signal level adjustment. Value 1.0 means no
   *        level adjustment, while value 0 means to mute
   *        the port.
   */
  adjustTxLevel (level: number);

  /**
   * Get the last received signal level.
   *
   * @return      Signal level in percent.
   */
  getRxLevel (): number;

  /**
   * Get the last transmitted signal level.
   *
   * @return      Signal level in percent.
   */
  getTxLevel (): number;

  /**
   * Warning: deprecated and will be removed in future release.
   *
   * Typecast from base class Media. This is useful for application written
   * in language that does not support downcasting such as Python.
   *
   * @param media    The object to be downcasted
   *
   * @return      The object as AudioMedia instance
   */
  typecastFromMedia (media: Media): AudioMedia;

  /**
   * Default Conexport interfaceor.
   *
   * Normally application will not create AudioMedia object directly,
   * but it instantiates an AudioMedia derived class. This is set as public
   * because some STL vector implementations require it.
   */
  AudioMedia ();

  id: number;

  /**
   * Warning: deprecated and will be removed in future release, use
   * registerMediaPort2() instead.
   *
   * This method needs to be called by descendants of this class to register
   * the media port created to the conference bridge and Endpoint's
   * media list.
   *
   * param port  The media port to be registered to the conference bridge.
   *
   */
  registerMediaPort (port: MediaPort);

  /**
   * This method needs to be called by descendants of this class to register
   * the media port created to the conference bridge and Endpoint's
   * media list.
   *
   * param port  The media port to be registered to the conference bridge.
   * param pool  The memory pool.
   *
   */
  registerMediaPort2 (port: MediaPort, pool);

  /**
   * This method needs to be called by descendants of this class to remove
   * the media port from the conference bridge and Endpoint's media list.
   * Descendant should only call this method if it has registered the media
   * with the previous call to registerMediaPort().
   */
  unregisterMediaPort ();

  /* Memory pool for deprecated registerMediaPort() */
  mediaCachingPool;
  mediaPool;
}

/**
 * Warning: deprecated, use AudioMediaVector2 instead.
 *
 * Array of Audio Media.
 */
export type AudioMediaVector = AudioMedia[];

/** Array of Audio Media */
export type AudioMediaVector2 = AudioMedia[];

/**
 * This export interfaceure contains additional info about AudioMediaPlayer.
 */
export interface AudioMediaPlayerInfo {
  /**
   * Format ID of the payload.
   */
  formatId: pjmedia_format_id;

  /**
   * The number of bits per sample of the file payload. For example,
   * the value is 16 for PCM WAV and 8 for Alaw/Ulas WAV files.
   */
  payloadBitsPerSample: number;

  /**
   * The WAV payload size in bytes.
   */
  sizeBytes: number;

  /**
   * The WAV payload size in samples.
   */
  sizeSamples: number;

  /**
   * Default conexport interfaceor
   */
  AudioMediaPlayerInfo ();
}

/**
 * Audio Media Player.
 */
export interface AudioMediaPlayer extends AudioMedia {

  /**
   * Create a file player,  and automatically add this
   * player to the conference bridge.
   *
   * @param file_name   The filename to be played. Currently only
   *       WAV files are supported, and the WAV file MUST be
   *       formatted as 16bit PCM mono/single channel (any
   *       clock rate is supported).
   * @param options   Optional option flag. Application may specify
   *       PJMEDIA_FILE_NO_LOOP to prevent playback loop.
   */
  createPlayer (file_name: string, options: number);

  /**
   * Create a file playlist media port, and automatically add the port
   * to the conference bridge.
   *
   * @param file_names  Array of file names to be added to the play list.
   *        Note that the files must have the same clock rate,
   *        number of channels, and number of bits per sample.
   * @param label    Optional label to be set for the media port.
   * @param options    Optional option flag. Application may specify
   *        PJMEDIA_FILE_NO_LOOP to prevent looping.
   */
  createPlaylist (file_names: string[], label: string, options: number);

  /**
   * Get additional info about the player. This operation is only valid
   * for player. For playlist, Error will be thrown.
   *
   * @return    the info.
   */
  getInfo (): AudioMediaPlayerInfo;

  /**
   * Get current playback position in samples. This operation is not valid
   * for playlist.
   *
   * @return       Current playback position, in samples.
   */
  getPos (): number;

  /**
   * Set playback position in samples. This operation is not valid for
   * playlist.
   *
   * @param samples     The desired playback position, in samples.
   */
  setPos (samples: number);

  /**
   * Warning: deprecated and will be removed in future release.
   *
   * Typecast from base class AudioMedia. This is useful for application
   * written in language that does not support downcasting such as Python.
   *
   * @param media    The object to be downcasted
   *
   * @return      The object as AudioMediaPlayer instance
   */
  typecastFromAudioMedia (media: AudioMedia): AudioMediaPlayer;

  /**
   * Deexport interfaceor. This will unregister the player port from the conference
   * bridge.
   */

  /*
   * Callbacks
   */

  /**
   * Register a callback to be called when the file player reading has
   * reached the end of file, or when the file reading has reached the
   * end of file of the last file for a playlist. If the file or playlist
   * is set to play repeatedly, then the callback will be called multiple
   * times.
   *
   * @return      If the callback returns false, the playback
   *        will stop. Note that if application destroys
   *        the player in the callback, it must return
   *        false here.
   */
  onEof (): boolean;

  /**
   * Register a callback to be called when the file player reading has
   * reached the end of file, or when the file reading has reached the
   * end of file of the last file for a playlist. If the file or playlist
   * is set to play repeatedly, then the callback will be called multiple
   * times.
   *
   * If application wishes to stop the playback, it can stop the media
   * transmission in the callback, and only after all transmissions have
   * been stopped, could the application safely destroy the player.
   */
  onEof2 (): void;

  /**
   * Player Id.
   */
  playerId: number;

  /**
   *  Low level PJMEDIA callback
   */
  eof_cb (port: pjmedia_port, usr_data: void);
}

/**
 * Audio Media Recorder.
 */
export interface AudioMediaRecorder extends AudioMedia {

  /**
   * Create a file recorder, and automatically connect this recorder to
   * the conference bridge. The recorder currently supports recording WAV
   * file. The type of the recorder to use is determined by the extension of
   * the file (e.g. ".wav").
   *
   * @param file_name   Output file name. The function will determine the
   *       default format to be used based on the file extension.
   *       Currently ".wav" is supported on all platforms.
   * @param enc_type   Optionally specify the type of encoder to be used to
   *       compress the media, if the file can support different
   *       encodings. This value must be zero for now.
   * @param max_size   Maximum file size. Specify zero or -1 to remove size
   *       limitation. This value must be zero or -1 for now.
   * @param options   Optional options, which can be used to specify the
   *       recording file format. Supported options are
   *       PJMEDIA_FILE_WRITE_PCM, PJMEDIA_FILE_WRITE_ALAW,
   *       and PJMEDIA_FILE_WRITE_ULAW. Default is zero or
   *       PJMEDIA_FILE_WRITE_PCM.
   */
  createRecorder (file_name: string, enc_type: number, max_size: number, options: number);

  /**
   * Warning: deprecated and will be removed in future release.
   *
   * Typecast from base class AudioMedia. This is useful for application
   * written in language that does not support downcasting such as Python.
   *
   * @param media    The object to be downcasted
   *
   * @return      The object as AudioMediaRecorder instance
   */
  typecastFromAudioMedia (media: AudioMedia): AudioMediaRecorder;

  /**
   * Recorder Id.
   */
  recorderId: number;
}

/**
 * Tone descriptor (abstraction for pjmedia_tone_desc)
 */
export interface ToneDesc extends pjmedia_tone_desc {}

/**
 * Array of tone descriptor.
 */
export type ToneDescVector = ToneDesc[];

/**
 * Tone digit (abstraction for pjmedia_tone_digit)
 */
export interface ToneDigit extends pjmedia_tone_digit {}

/**
 * Array of tone digits.
 */
export type ToneDigitVector = ToneDigit[];

/**
 * A digit in tone digit map
 */
export interface ToneDigitMapDigit {
  digit: string;
  freq1: number;
  freq2: number;
};

/**
 * Tone digit map
 */
export type ToneDigitMapVector = ToneDigitMapDigit[];

/**
 * Tone generator.
 */
interface ToneGenerator extends AudioMedia {

  /**
   * Create tone generator and register the port to the conference bridge.
   */
  createToneGenerator (clock_rate: number, channel_count: number);

  /**
   * Check if the tone generator is still busy producing some tones.
   * @return        Non-zero if busy.
   */
  isBusy (): boolean;

  /**
   * Inexport interface the tone generator to stop current processing.
   */
  stop ();

  /**
   * Rewind the playback. This will start the playback to the first
   * tone in the playback list.
   */
  rewind ();

  /**
   * Inexport interface the tone generator to play single or dual frequency tones
   * with the specified duration. The new tones will be appended to
   * currently playing tones, unless stop() is called before calling this
   * function. The playback will begin as soon as the tone generator is
   * connected to other media.
   *
   * @param tones      Array of tones to be played.
   * @param loop      Play the tone in a loop.
   */
  play (tones: ToneDescVector, loop: boolean);

  /**
   * Inexport interface the tone generator to play multiple MF digits with each of
   * the digits having individual ON/OFF duration. Each of the digit in the
   * digit array must have the corresponding descriptor in the digit map.
   * The new tones will be appended to currently playing tones, unless
   * stop() is called before calling this function. The playback will begin
   * as soon as the tone generator is connected to a sink media.
   *
   * @param digits      Array of MF digits.
   * @param loop      Play the tone in a loop.
   */
  playDigits (digits: ToneDigitVector, loop: boolean);

  /**
   * Get the digit-map currently used by this tone generator.
   *
   * @return        The digitmap currently used by the tone generator
   */
  getDigitMap (): ToneDigitMapVector;

  /**
   * Set digit map to be used by the tone generator.
   *
   * @param digit_map      Digitmap to be used by the tone generator.
   */
  setDigitMap (digit_map: ToneDigitMapVector);

  pool;
  tonegen: pjmedia_port;
  digitMap: pjmedia_tone_digit_map;
}

/*************************************************************************
 * Sound device management
 */

/**
 * Audio device information export interfaceure.
 */
export interface AudioDevInfo {
  /**
   * The device name
   */
  name: string;

  /**
   * Maximum number of input channels supported by this device. If the
   * value is zero, the device does not support input operation (i.e.
   * it is a playback only device).
   */
  inputCount: number;

  /**
   * Maximum number of output channels supported by this device. If the
   * value is zero, the device does not support output operation (i.e.
   * it is an input only device).
   */
  outputCount: number;

  /**
   * Default sampling rate.
   */
  defaultSamplesPerSec: number;

  /**
   * The underlying driver name
   */
  driver: string;

  /**
   * Device capabilities, as bitmask combination of pjmedia_aud_dev_cap.
   */
  caps: number;

  /**
   * Supported audio device routes, as bitmask combination of
   * pjmedia_aud_dev_route. The value may be zero if the device
   * does not support audio routing.
   */
  routes: number;

  /**
   * Array of supported extended audio formats
   */
  extFmt: MediaFormatAudioVector;

  /**
   * Conexport interface from pjmedia_aud_dev_info.
   */
  fromPj (dev_info: pjmedia_aud_dev_info);

}

/**
 * Warning: deprecated, use AudioDevInfoVector2 instead.
 *
 * Array of audio device info.
 */
export type AudioDevInfoVector = AudioDevInfo[];

/** Array of audio device info */
export type AudioDevInfoVector2 = AudioDevInfo[];

/**
 * Audio device manager.
 */
export interface AudDevManager {

  /**
   * Get currently active capture sound devices. If sound devices has not been
   * created, it is possible that the function returns -1 as device IDs.
   *
   * @return      Device ID of the capture device.
   */
  getCaptureDev (): number;

  /**
   * Get the AudioMedia of the capture audio device.
   *
   * @return      Audio media for the capture device.
   */
  getCaptureDevMedia (): AudioMedia;

  /**
   * Get currently active playback sound devices. If sound devices has not
   * been created, it is possible that the function returns -1 as device IDs.
   *
   * @return      Device ID of the playback device.
   */
  getPlaybackDev (): number;

  /**
   * Get the AudioMedia of the speaker/playback audio device.
   *
   * @return      Audio media for the speaker/playback device.
   */
  getPlaybackDevMedia (): AudioMedia;

  /**
   * Select or change capture sound device. Application may call this
   * function at any time to replace current sound device. Calling this
   * method will not change the state of the sound device (opened/closed).
   *
   * @param capture_dev    Device ID of the capture device.
   */
  setCaptureDev (capture_dev: number);

  /**
   * Select or change playback sound device. Application may call this
   * function at any time to replace current sound device. Calling this
   * method will not change the state of the sound device (opened/closed).
   *
   * @param playback_dev    Device ID of the playback device.
   */
  setPlaybackDev (playback_dev: number);

  /**
   * Warning: deprecated, use enumDev2 instead. This function is not
   * safe in multithreaded environment.
   *
   * Enum all audio devices installed in the system. This function is not
   * safe in multithreaded environment.
   *
   * @return      The list of audio device info.
   */
  enumDev (): AudioDevInfoVector;

  /**
   * Enum all audio devices installed in the system.
   *
   * @return      The list of audio device info.
   */
  enumDev2 (): AudioDevInfoVector2;

  /**
   * Set pjsua to use null sound device. The null sound device only provides
   * the timing needed by the conference bridge, and will not interract with
   * any hardware.
   *
   */
  setNullDev ();

  /**
   * Disconnect the main conference bridge from any sound devices, and let
   * application connect the bridge to it's own sound device/master port.
   *
   * @return      The port interface of the conference bridge,
   *        so that application can connect this to it's
   *        own sound device or master port.
   */
  setNoDev (): MediaPort;

  /**
   * Set sound device mode.
   *
   * Note that this method will open the sound device, using current
   * active IDs set via setCaptureDev() or setPlaybackDev(), if the flag
   * PJSUA_SND_DEV_NO_IMMEDIATE_OPEN is not specified.
   *
   * @param mode    The sound device mode, as bitmask combination
   *        of #pjsua_snd_dev_mode
   *
   */
  setSndDevMode (mode: number);

  /**
   * Change the echo cancellation settings.
   *
   * The behavior of this function depends on whether the sound device is
   * currently active, and if it is, whether device or software AEC is
   * being used.
   *
   * If the sound device is currently active, and if the device supports AEC,
   * this function will forward the change request to the device and it will
   * be up to the device on whether support the request. If software AEC is
   * being used (the software EC will be used if the device does not support
   * AEC), this function will change the software EC settings. In all cases,
   * the setting will be saved for future opening of the sound device.
   *
   * If the sound device is not currently active, this will only change the
   * default AEC settings and the setting will be applied next time the
   * sound device is opened.
   *
   * @param tail_msec    The tail length, in miliseconds. Set to zero to
   *        disable AEC.
   * @param options    Options to be passed to pjmedia_echo_create().
   *        Normally the value should be zero.
   *
   */
  setEcOptions (tail_msec: number, options: number);

  /**
   * Get current echo canceller tail length.
   *
   * @return      The EC tail length in milliseconds,
   *        If AEC is disabled, the value will be zero.
   */
  getEcTail (): number;

  /**
   * Check whether the sound device is currently active. The sound device
   * may be inactive if the application has set the auto close feature to
   * non-zero (the sndAutoCloseTime setting in MediaConfig), or
   * if null sound device or no sound device has been configured via the
   * setNoDev() function.
   */
  sndIsActive (): boolean;

  /**
   * Refresh the list of sound devices installed in the system. This method
   * will only refresh the list of audio device so all active audio streams
   * will be unaffected. After refreshing the device list, application MUST
   * make sure to update all index references to audio devices before calling
   * any method that accepts audio device index as its parameter.
   *
   */
  refreshDevs ();

  /**
   * Get the number of sound devices installed in the system.
   *
   * @return      The number of sound devices installed in the
   *        system.
   *
   */
  getDevCount (): number;

  /**
   * Get device information.
   *
   * @param id    The audio device ID.
   *
   * @return      The device information which will be filled in
   *        by this method once it returns successfully.
   */
  getDevInfo (id: number): AudioDevInfo;

  /**
   * Lookup device index based on the driver and device name.
   *
   * @param drv_name    The driver name.
   * @param dev_name    The device name.
   *
   * @return      The device ID. If the device is not found,
   *        Error will be thrown.
   */
  lookupDev (drv_name: string, dev_name: string): number;

  /**
   * Get string info for the specified capability.
   *
   * @param cap    The capability ID.
   *
   * @return      Capability name.
   */
  capName (cap: pjmedia_aud_dev_cap): string;

  /**
   * This will configure audio format capability (other than PCM) to the
   * sound device being used. If sound device is currently active, the method
   * will forward the setting to the sound device instance to be applied
   * immediately, if it supports it.
   *
   * This method is only valid if the device has
   * PJMEDIA_AUD_DEV_CAP_EXT_FORMAT capability in AudioDevInfo.caps flags,
   * otherwise Error will be thrown.
   *
   * Note that in case the setting is kept for future use, it will be applied
   * to any devices, even when application has changed the sound device to be
   * used.
   *
   * @param format    The audio format.
   * @param keep    Specify whether the setting is to be kept for
   *        future use.
   *
   */
  setExtFormat (format: MediaFormatAudio, keep: boolean);

  /**
   * Get the audio format capability (other than PCM) of the sound device
   * being used. If sound device is currently active, the method will forward
   * the request to the sound device. If sound device is currently inactive,
   * and if application had previously set the setting and mark the setting
   * as kept, then that setting will be returned. Otherwise, this method
   * will raise error.
   *
   * This method is only valid if the device has
   * PJMEDIA_AUD_DEV_CAP_EXT_FORMAT capability in AudioDevInfo.caps flags,
   * otherwise Error will be thrown.
   *
   * @return          The audio format.
   *
   */
  getExtFormat (): MediaFormatAudio;

  /**
   * This will configure audio input latency control or query capability to
   * the sound device being used. If sound device is currently active,
   * the method will forward the setting to the sound device instance to be
   * applied immediately, if it supports it.
   *
   * This method is only valid if the device has
   * PJMEDIA_AUD_DEV_CAP_INPUT_LATENCY capability in AudioDevInfo.caps flags,
   * otherwise Error will be thrown.
   *
   * Note that in case the setting is kept for future use, it will be applied
   * to any devices, even when application has changed the sound device to be
   * used.
   *
   * @param latency_msec  The input latency.
   * @param keep    Specify whether the setting is to be kept
   *        for future use.
   */
  setInputLatency (latency_msec: number, keep: boolean);

  /**
   * Get the audio input latency control or query capability of the sound
   * device being used. If sound device is currently active, the method will
   * forward the request to the sound device. If sound device is currently
   * inactive, and if application had previously set the setting and mark the
   * setting as kept, then that setting will be returned. Otherwise, this
   * method will raise error.
   *
   * This method is only valid if the device has
   * PJMEDIA_AUD_DEV_CAP_INPUT_LATENCY capability in AudioDevInfo.caps flags,
   * otherwise Error will be thrown.
   *
   * @return          The audio input latency.
   *
   */
  getInputLatency (): number;

  /**
   * This will configure audio output latency control or query capability to
   * the sound device being used. If sound device is currently active,
   * the method will forward the setting to the sound device instance to be
   * applied immediately, if it supports it.
   *
   * This method is only valid if the device has
   * PJMEDIA_AUD_DEV_CAP_OUTPUT_LATENCY capability in AudioDevInfo.caps flags,
   * otherwise Error will be thrown.
   *
   * Note that in case the setting is kept for future use, it will be applied
   * to any devices, even when application has changed the sound device to be
   * used.
   *
   * @param latency_msec      The output latency.
   * @param keep    Specify whether the setting is to be kept
   *        for future use.
   *
   */
  setOutputLatency (latency_msec: number, keep: boolean);

  /**
   * Get the audio output latency control or query capability of the sound
   * device being used. If sound device is currently active, the method will
   * forward the request to the sound device. If sound device is currently
   * inactive, and if application had previously set the setting and mark the
   * setting as kept, then that setting will be returned. Otherwise, this
   * method will raise error.
   *
   * This method is only valid if the device has
   * PJMEDIA_AUD_DEV_CAP_OUTPUT_LATENCY capability in AudioDevInfo.caps flags,
   * otherwise Error will be thrown.
   *
   * @return          The audio output latency.
   *
   */
  getOutputLatency (): number;

  /**
   * This will configure audio input volume level capability to the
   * sound device being used.
   * If sound device is currently active, the method will forward the
   * setting to the sound device instance to be applied immediately,
   * if it supports it.
   *
   * This method is only valid if the device has
   * PJMEDIA_AUD_DEV_CAP_INPUT_VOLUME_SETTING capability in AudioDevInfo.caps
   * flags, otherwise Error will be thrown.
   *
   * Note that in case the setting is kept for future use, it will be applied
   * to any devices, even when application has changed the sound device to be
   * used.
   *
   * @param volume    The input volume level, in percent.
   * @param keep    Specify whether the setting is to be kept for
   *        future use.
   *
   */
  setInputVolume (volume: number, keep: boolean);

  /**
   * Get the audio input volume level capability of the sound device being
   * used. If sound device is currently active, the method will forward the
   * request to the sound device. If sound device is currently inactive,
   * and if application had previously set the setting and mark the setting
   * as kept, then that setting will be returned. Otherwise, this method
   * will raise error.
   *
   * This method is only valid if the device has
   * PJMEDIA_AUD_DEV_CAP_INPUT_VOLUME_SETTING capability in AudioDevInfo.caps
   * flags, otherwise Error will be thrown.     *

   * @return          The audio input volume level, in percent.
   *
   */
  getInputVolume (): number;

  /**
   * This will configure audio output volume level capability to the sound
   * device being used. If sound device is currently active, the method will
   * forward the setting to the sound device instance to be applied
   * immediately, if it supports it.
   *
   * This method is only valid if the device has
   * PJMEDIA_AUD_DEV_CAP_OUTPUT_VOLUME_SETTING capability in AudioDevInfo.caps
   * flags, otherwise Error will be thrown.
   *
   * Note that in case the setting is kept for future use, it will be applied
   * to any devices, even when application has changed the sound device to be
   * used.
   *
   * @param volume    The output volume level, in percent.
   * @param keep    Specify whether the setting is to be kept
   *        for future use.
   *
   */
  setOutputVolume (volume: number, keep: boolean);

  /**
   * Get the audio output volume level capability of the sound device being
   * used. If sound device is currently active, the method will forward the
   * request to the sound device. If sound device is currently inactive,
   * and if application had previously set the setting and mark the setting
   * as kept, then that setting will be returned. Otherwise, this method
   * will raise error.
   *
   * This method is only valid if the device has
   * PJMEDIA_AUD_DEV_CAP_OUTPUT_VOLUME_SETTING capability in AudioDevInfo.caps
   * flags, otherwise Error will be thrown.
   *
   * @return          The audio output volume level, in percent.
   *
   */
  getOutputVolume (): number;

  /**
   * Get the audio input signal level capability of the sound device being
   * used. If sound device is currently active, the method will forward the
   * request to the sound device. If sound device is currently inactive,
   * and if application had previously set the setting and mark the setting
   * as kept, then that setting will be returned. Otherwise, this method
   * will raise error.
   *
   * This method is only valid if the device has
   * PJMEDIA_AUD_DEV_CAP_INPUT_SIGNAL_METER capability in AudioDevInfo.caps
   * flags, otherwise Error will be thrown.
   *
   * @return          The audio input signal level, in percent.
   *
   */
  getInputSignal (): number;

  /**
   * Get the audio output signal level capability of the sound device being
   * used. If sound device is currently active, the method will forward the
   * request to the sound device. If sound device is currently inactive,
   * and if application had previously set the setting and mark the setting
   * as kept, then that setting will be returned. Otherwise, this method
   * will raise error.
   *
   * This method is only valid if the device has
   * PJMEDIA_AUD_DEV_CAP_OUTPUT_SIGNAL_METER capability in AudioDevInfo.caps
   * flags, otherwise Error will be thrown.
   *
   * @return          The audio output signal level, in percent.
   *
   */
  getOutputSignal (): number;

  /**
   * This will configure audio input route capability to the sound device
   * being used. If sound device is currently active, the method will
   * forward the setting to the sound device instance to be applied
   * immediately, if it supports it.
   *
   * This method is only valid if the device has
   * PJMEDIA_AUD_DEV_CAP_INPUT_ROUTE capability in AudioDevInfo.caps
   * flags, otherwise Error will be thrown.
   *
   * Note that in case the setting is kept for future use, it will be applied
   * to any devices, even when application has changed the sound device to be
   * used.
   *
   * @param route    The audio input route.
   * @param keep    Specify whether the setting is to be kept
   *        for future use.
   *
   */
  setInputRoute (route: pjmedia_aud_dev_route, keep: boolean);

  /**
   * Get the audio input route capability of the sound device being used.
   * If sound device is currently active, the method will forward the
   * request to the sound device. If sound device is currently inactive,
   * and if application had previously set the setting and mark the setting
   * as kept, then that setting will be returned. Otherwise, this method
   * will raise error.
   *
   * This method is only valid if the device has
   * PJMEDIA_AUD_DEV_CAP_INPUT_ROUTE capability in AudioDevInfo.caps
   * flags, otherwise Error will be thrown.
   *
   * @return          The audio input route.
   *
   */
  getInputRoute (): pjmedia_aud_dev_route;

  /**
   * This will configure audio output route capability to the sound device
   * being used. If sound device is currently active, the method will
   * forward the setting to the sound device instance to be applied
   * immediately, if it supports it.
   *
   * This method is only valid if the device has
   * PJMEDIA_AUD_DEV_CAP_OUTPUT_ROUTE capability in AudioDevInfo.caps
   * flags, otherwise Error will be thrown.
   *
   * Note that in case the setting is kept for future use, it will be applied
   * to any devices, even when application has changed the sound device to be
   * used.
   *
   * @param route    The audio output route.
   * @param keep    Specify whether the setting is to be kept
   *        for future use.
   *
   */
  setOutputRoute (route: pjmedia_aud_dev_route, keep: boolean);

  /**
   * Get the audio output route capability of the sound device being used.
   * If sound device is currently active, the method will forward the
   * request to the sound device. If sound device is currently inactive,
   * and if application had previously set the setting and mark the setting
   * as kept, then that setting will be returned. Otherwise, this method
   * will raise error.
   *
   * This method is only valid if the device has
   * PJMEDIA_AUD_DEV_CAP_OUTPUT_ROUTE capability in AudioDevInfo.caps
   * flags, otherwise Error will be thrown.
   *
   * @return          The audio output route.
   *
   */
  getOutputRoute (): pjmedia_aud_dev_route;

  /**
   * This will configure audio voice activity detection capability to
   * the sound device being used. If sound device is currently active,
   * the method will forward the setting to the sound device instance
   * to be applied immediately, if it supports it.
   *
   * This method is only valid if the device has PJMEDIA_AUD_DEV_CAP_VAD
   * capability in AudioDevInfo.caps flags, otherwise Error will be thrown.
   *
   * Note that in case the setting is kept for future use, it will be applied
   * to any devices, even when application has changed the sound device to be
   * used.
   *
   * @param enable    Enable/disable voice activity detection
   *        feature. Set true to enable.
   * @param keep    Specify whether the setting is to be kept for
   *        future use.
   *
   */
  setVad (enable: boolean, keep: boolean);

  /**
   * Get the audio voice activity detection capability of the sound device
   * being used. If sound device is currently active, the method will
   * forward the request to the sound device. If sound device is currently
   * inactive, and if application had previously set the setting and mark
   * the setting as kept, then that setting will be returned. Otherwise,
   * this method will raise error.
   *
   * This method is only valid if the device has PJMEDIA_AUD_DEV_CAP_VAD
   * capability in AudioDevInfo.caps flags, otherwise Error will be thrown.
   *
   * @return          The audio voice activity detection feature.
   *
   */
  getVad (): boolean;

  /**
   * This will configure audio comfort noise generation capability to
   * the sound device being used. If sound device is currently active,
   * the method will forward the setting to the sound device instance
   * to be applied immediately, if it supports it.
   *
   * This method is only valid if the device has PJMEDIA_AUD_DEV_CAP_CNG
   * capability in AudioDevInfo.caps flags, otherwise Error will be thrown.
   *
   * Note that in case the setting is kept for future use, it will be applied
   * to any devices, even when application has changed the sound device to be
   * used.
   *
   * @param enable    Enable/disable comfort noise generation
   *        feature. Set true to enable.
   * @param keep    Specify whether the setting is to be kept for
   *        future use.
   *
   */
  setCng (enable: boolean, keep: boolean);

  /**
   * Get the audio comfort noise generation capability of the sound device
   * being used. If sound device is currently active, the method will
   * forward the request to the sound device. If sound device is currently
   * inactive, and if application had previously set the setting and mark
   * the setting as kept, then that setting will be returned. Otherwise,
   * this method will raise error.
   *
   * This method is only valid if the device has PJMEDIA_AUD_DEV_CAP_CNG
   * capability in AudioDevInfo.caps flags, otherwise Error will be thrown.
   *
   * @return          The audio comfort noise generation feature.
   *
   */
  getCng (): boolean;

  /**
   * This will configure audio packet loss concealment capability to
   * the sound device being used. If sound device is currently active,
   * the method will forward the setting to the sound device instance
   * to be applied immediately, if it supports it.
   *
   * This method is only valid if the device has PJMEDIA_AUD_DEV_CAP_PLC
   * capability in AudioDevInfo.caps flags, otherwise Error will be thrown.
   *
   * Note that in case the setting is kept for future use, it will be applied
   * to any devices, even when application has changed the sound device to be
   * used.
   *
   * @param enable    Enable/disable packet loss concealment
   *        feature. Set true to enable.
   * @param keep    Specify whether the setting is to be kept for
   *        future use.
   *
   */
  setPlc (enable: boolean, keep: boolean);

  /**
   * Get the audio packet loss concealment capability of the sound device
   * being used. If sound device is currently active, the method will
   * forward the request to the sound device. If sound device is currently
   * inactive, and if application had previously set the setting and mark
   * the setting as kept, then that setting will be returned. Otherwise,
   * this method will raise error.
   *
   * This method is only valid if the device has PJMEDIA_AUD_DEV_CAP_PLC
   * capability in AudioDevInfo.caps flags, otherwise Error will be thrown.
   *
   * @return          The audio packet loss concealment feature.
   *
   */
  getPlc (): boolean;

  audioDevList: AudioDevInfoVector;
  devMedia: AudioMedia;

  /**
   * Conexport interfaceor.
   */
  AudDevManager ();

  clearAudioDevList ();

  getActiveDev (is_capture: boolean): number;

}

/**
 * Extra audio device. This class allows application to have multiple
 * sound device instances active concurrently.

 * Application may also use this class to improve media clock. Normally
 * media clock is driven by sound device in master port, but unfortunately
 * some sound devices may produce jittery clock. To improve media clock,
 * application can install Null Sound Device (i.e: using
 * AudDevManager::setNullDev()), which will act as a master port, and
 * install the sound device as extra sound device.
 *
 * Note that extra sound device will not have auto-close upon idle feature.
 * Also note that the extra sound device only supports mono channel.
 */
export interface ExtraAudioDevice extends AudioMedia {
  /**
   * Conexport interfaceor.
   *
   * @param playdev    Playback device ID.
   * @param recdev    Record device ID.
   */
  ExtraAudioDevice (playdev: number, recdev: number);

  /**
   * Open the audio device using format (e.g.: clock rate, bit per sample,
   * samples per frame) matched to the conference bridge's format, except
   * the channel count, which will be set to one (mono channel). This will
   * also register the audio device port to conference bridge.
   */
  open ();

  /**
   * Close the audio device and unregister the audio device port from the
   * conference bridge.
   */
  close ();

  /**
   * Is the extra audio device opened?
   *
   * @return          'true' if it is opened.
   */
  isOpened (): boolean;

  playDev: number;
  recDev: number;
  ext_snd_dev;
}

/*************************************************************************
 * Video media
 */

/**
 * Representation of media coordinate.
 */
export interface MediaCoordinate {
  x: number;
  /**< X position of the coordinate */
  y: number;	    /**< Y position of the coordinate */
}

/**
 * Representation of media size.
 */
export interface MediaSize {
  w: number;
  /**< The width.  */
  h: number;	    /**< The height.  */
}

/**
 * This export interfaceure descibes information about a particular media port that
 * has been registered into the conference bridge.
 */
export interface VidConfPortInfo {
  /**
   * Conference port number.
   */
  portId: number;

  /**
   * Port name.
   */
  name: string;

  /**
   * Media audio format information
   */
  format: MediaFormatVideo;

  /**
   * Array of listeners (in other words, ports where this port is
   * transmitting to).
   */
  listeners: number[];

  /**
   * Array of listeners (in other words, ports where this port is
   * listening to).
   */
  transmitters: number[];

  /**
   * Conexport interface from pjsua_conf_port_info.
   */
  fromPj (port_info: pjsua_vid_conf_port_info);
}

/**
 * Parameters for VideoMedia::startTransmit() method.
 */
export interface VideoMediaTransmitParam {
}

/**
 * Video Media.
 */
export interface VideoMedia extends Media {
  /**
   * Get information about the specified conference port.
   */
  getPortInfo (): VidConfPortInfo;

  /**
   * Get port Id.
   */
  getPortId (): number;

  /**
   * Get information from specific port id.
   */
  getPortInfoFromId (port_id: number): VidConfPortInfo;

  /**
   * Establish unidirectional media flow to sink. This media port
   * will act as a source, and it may transmit to multiple destinations/sink.
   * And if multiple sources are transmitting to the same sink, the media
   * will be mixed together. Source and sink may refer to the same Media,
   * effectively looping the media.
   *
   * If bidirectional media flow is desired, application needs to call
   * this method twice, with the second one called from the opposite source
   * media.
   *
   * @param sink    The destination Media.
   * @param param    The parameter.
   */
  startTransmit (sink: VideoMedia, param: VideoMediaTransmitParam);

  /**
   *  Stop media flow to destination/sink port.
   *
   * @param sink    The destination media.
   *
   */
  stopTransmit (sink: VideoMedia);

  /**
   * Update or refresh port states from video port info. Some port may
   * change its port info in the middle of a session, for example when
   * a video stream decoder learns that incoming video size or frame rate
   * has changed, video conference needs to be informed to update its
   * internal states.
   *
   */
  update ();

  /**
   * Default Conexport interfaceor.
   *
   * Normally application will not create VideoMedia object directly,
   * but it instantiates a VideoMedia derived class. This is set as public
   * because some STL vector implementations require it.
   */
  VideoMedia ();

  /**
   * Conference port Id.
   */
  id: number;

  /**
   * This method needs to be called by descendants of this class to register
   * the media port created to the conference bridge and Endpoint's
   * media list.
   *
   * param port  The media port to be registered to the conference bridge.
   * param pool  The memory pool.
   */
  registerMediaPort (port: MediaPort, pool);

  /**
   * This method needs to be called by descendants of this class to remove
   * the media port from the conference bridge and Endpoint's media list.
   * Descendant should only call this method if it has registered the media
   * with the previous call to registerMediaPort().
   */
  unregisterMediaPort ();
}

/** Array of Video Media */
export type VideoMediaVector = VideoMedia[];

/**
 * Window handle.
 */
export interface WindowHandle {
  window;
  /**< Window    */
  display;   /**< Display  */
}

/**
 * Video window handle.
 */
export interface VideoWindowHandle {
  /**
   * The window handle type.
   */
  type: pjmedia_vid_dev_hwnd_type;

  /**
   * The window handle.
   */
  handle: WindowHandle;
}

/**
 * This export interfaceure describes video window info.
 */
export interface VideoWindowInfo {
  /**
   * Flag to indicate whether this window is a native window,
   * such as created by built-in preview device. If this field is
   * true, only the video window handle field of this
   * export interfaceure is valid.
   */
  isNative: boolean;

  /**
   * Video window handle.
   */
  winHandle: VideoWindowHandle;

  /**
   * Renderer device ID.
   */
  renderDeviceId: number;

  /**
   * Window show status. The window is hidden if false.
   */
  show: boolean;

  /**
   * Window position.
   */
  pos: MediaCoordinate;

  /**
   * Window size.
   */
  size: MediaSize;

}

/**
 * Video window.
 */
export interface VideoWindow {
  /**
   * Conexport interfaceor
   */
  VideoWindow (win_id: number);

  /**
   * Get window info.
   *
   * @return      video window info.
   */
  getInfo (): VideoWindowInfo;

  /**
   * Get video media or conference bridge port of the renderer of
   * this video window.
   *
   * @return      Video media of this renderer window.
   */
  getVideoMedia (): VideoMedia;

  /**
   * Show or hide window. This operation is not valid for native windows
   * (VideoWindowInfo.isNative=true), on which native windowing API
   * must be used instead.
   *
   * @param show    Set to true to show the window, false to
   *        hide the window.
   *
   */
  Show (show: boolean);

  /**
   * Set video window position. This operation is not valid for native windows
   * (VideoWindowInfo.isNative=true), on which native windowing API
   * must be used instead.
   *
   * @param pos    The window position.
   *
   */
  setPos (pos: MediaCoordinate);

  /**
   * Resize window. This operation is not valid for native windows
   * (VideoWindowInfo.isNative=true), on which native windowing API
   * must be used instead.
   *
   * @param size    The new window size.
   *
   */
  setSize (size: MediaSize);

  /**
   * Rotate the video window. This function will change the video orientation
   * and also possibly the video window size (width and height get swapped).
   * This operation is not valid for native windows (VideoWindowInfo.isNative
   * =true), on which native windowing API must be used instead.
   *
   * @param angle    The rotation angle in degrees, must be
   *        multiple of 90.
   *        Specify positive value for clockwise rotation or
   *        negative value for counter-clockwise rotation.
   */
  rotate (angle: number);

  /**
   * Set output window. This operation is valid only when the underlying
   * video device supports PJMEDIA_VIDEO_DEV_CAP_OUTPUT_WINDOW capability AND
   * allows the output window to be changed on-the-fly, otherwise Error will
   * be thrown. Currently it is only supported on Android.
   *
   * @param win    The new output window.
   */
  setWindow (win: VideoWindowHandle);

  /**
   * Set video window full-screen. This operation is valid only when the
   * underlying video device supports PJMEDIA_VID_DEV_CAP_OUTPUT_FULLSCREEN
   * capability. Currently it is only supported on SDL backend.
   *
   * @param enabled    Set to true if full screen is desired, false
   *        otherwise.
   */
  setFullScreen (enabled: boolean);

  /**
   * Set video window full-screen. This operation is valid only when the
   * underlying video device supports PJMEDIA_VID_DEV_CAP_OUTPUT_FULLSCREEN
   * capability. Currently it is only supported on SDL backend.
   *
   * @param mode    Fullscreen mode, see
   *        pjmedia_vid_dev_fullscreen_flag.
   */
  setFullScreen2 (mode: pjmedia_vid_dev_fullscreen_flag);

  winId: pjsua_vid_win_id;
}

/**
 * This export interfaceure contains parameters for VideoPreview::start()
 */
export interface VideoPreviewOpParam {
  /**
   * Device ID for the video renderer to be used for rendering the
   * capture stream for preview. This parameter is ignored if native
   * preview is being used.
   *
   * Default: PJMEDIA_VID_DEFAULT_RENDER_DEV
   */
  rendId: pjmedia_vid_dev_index;

  /**
   * Show window initially.
   *
   * Default: PJ_TRUE.
   */
  show: boolean;

  /**
   * Window flags.  The value is a bitmask combination of
   * \a pjmedia_vid_dev_wnd_flag.
   *
   * Default: 0.
   */
  windowFlags: number;

  /**
   * Media format. If left unitialized, this parameter will not be used.
   */
  format: MediaFormat;

  /**
   * Optional output window to be used to display the video preview.
   * This parameter will only be used if the video device supports
   * PJMEDIA_VID_DEV_CAP_OUTPUT_WINDOW capability and the capability
   * is not read-only.
   */
  window: VideoWindowHandle;

  /**
   * Default conexport interfaceor initializes with default values.
   */
  VideoPreviewOpParam ();

  /**
   * Convert from pjsip
   */
  fromPj (prm: pjsua_vid_preview_param);

  /**
   * Convert to pjsip
   */
  toPj (): pjsua_vid_preview_param;
}

/**
 * Video Preview
 */
export interface VideoPreview {
  /**
   * Conexport interfaceor
   */
  VideoPreview (dev_id: number);

  /**
   * Determine if the specified video input device has built-in native
   * preview capability. This is a convenience function that is equal to
   * querying device's capability for PJMEDIA_VID_DEV_CAP_INPUT_PREVIEW
   * capability.
   *
   * @return    true if it has.
   */
  hasNative (): boolean;

  /**
   * Start video preview window for the specified capture device.
   *
   * @param param    Video preview parameters.
   */
  start (param: VideoPreviewOpParam);

  /**
   * Stop video preview.
   */
  stop ();

  /*
   * Get the preview window handle associated with the capture device,if any.
   */
  getVideoWindow (): VideoWindow;

  /**
   * Get video media or conference bridge port of the video capture device.
   *
   * @return      Video media of the video capture device.
   */
  getVideoMedia (): VideoMedia;

  devId: pjmedia_vid_dev_index;
  winId: pjsua_vid_win_id;

  updateDevId ();
}

/**
 * Video device information export interfaceure.
 */
export interface VideoDevInfo {
  /**
   * The device ID
   */
  id: pjmedia_vid_dev_index;

  /**
   * The device name
   */
  name: string;

  /**
   * The underlying driver name
   */
  driver: string;

  /**
   * The supported direction of the video device, i.e. whether it supports
   * capture only, render only, or both.
   */
  dir: pjmedia_dir;

  /**
   * Device capabilities, as bitmask combination of #pjmedia_vid_dev_cap
   */
  caps: number;

  /**
   * Array of supported video formats. Some fields in each supported video
   * format may be set to zero or of "unknown" value, to indicate that the
   * value is unknown or should be ignored. When these value are not set
   * to zero, it indicates that the exact format combination is being used.
   */
  fmt: MediaFormatVideoVector;

  /**
   * Default conexport interfaceor
   */
  VideoDevInfo ();

  /**
   * Conexport interface from pjmedia_vid_dev_info.
   */
  fromPj (dev_info: pjmedia_vid_dev_info);

}

/**
 * Warning: deprecated, use VideoDevInfoVector2 instead.
 *
 * Array of video device info.
 */
export type VideoDevInfoVector = VideoDevInfo[];

/** Array of video device info */
export type VideoDevInfoVector2 = VideoDevInfo[];

/**
 * Parameter for switching device with PJMEDIA_VID_DEV_CAP_SWITCH capability.
 */
export interface VideoSwitchParam {
  /**
   * Target device ID to switch to. Once the switching is successful, the
   * video stream will use this device and the old device will be closed.
   */
  target_id: pjmedia_vid_dev_index;
}

/**
 * Video device manager.
 */
export interface VidDevManager {

  /**
   * Initialize the video device subsystem. This will register all supported
   * video device factories to the video device subsystem.
   *
   * By default, library will initialize video device subsystem automatically
   * on library initialization, so application will never need to invoke this
   * function. However, when PJSUA_DONT_INIT_VID_DEV_SUBSYS is set to
   * non-zero, application should invoke this function before accessing
   * video device.
   */
  initSubsys ();

  /**
   * Refresh the list of video devices installed in the system. This function
   * will only refresh the list of video device so all active video streams
   * will be unaffected. After refreshing the device list, application MUST
   * make sure to update all index references to video devices (i.e. all
   * variables of type pjmedia_vid_dev_index) before calling any function
   * that accepts video device index as its parameter.
   */
  refreshDevs ();

  /**
   * Get the number of video devices installed in the system.
   *
   * @return    The number of devices.
   */
  getDevCount (): number;

  /**
   * Retrieve the video device info for the specified device index.
   *
   * @param dev_id  The video device id
   *
   * @return    The list of video device info
   */
  getDevInfo (dev_id: number): VideoDevInfo;

  /**
   * Warning: deprecated, use enumDev2() instead. This function is not
   * safe in multithreaded environment.
   *
   * Enum all video devices installed in the system.
   *
   * @return    The list of video device info
   */
  enumDev (): VideoDevInfoVector;

  /**
   * Enum all video devices installed in the system.
   *
   * @return    The list of video device info
   */
  enumDev2 (): VideoDevInfoVector2;

  /**
   * Lookup device index based on the driver and device name.
   *
   * @param drv_name  The driver name.
   * @param dev_name  The device name.
   *
   * @return    The device ID. If the device is not found,
   *      Error will be thrown.
   */
  lookupDev (drv_name: string, dev_name: string): number;

  /**
   * Get string info for the specified capability.
   *
   * @param cap  The capability ID.
   *
   * @return    Capability name.
   */
  capName (cap: pjmedia_vid_dev_cap): string;

  /**
   * This will configure video format capability to the video device.
   * If video device is currently active, the method will forward the setting
   * to the video device instance to be applied immediately, if it
   * supports it.
   *
   * This method is only valid if the device has
   * PJMEDIA_VID_DEV_CAP_FORMAT capability in VideoDevInfo.caps flags,
   * otherwise Error will be thrown.
   *
   * Note that in case the setting is kept for future use, it will be applied
   * to any devices, even when application has changed the video device to be
   * used.
   *
   * @param dev_id  The video device id.
   * @param format  The video format.
   * @param keep  Specify whether the setting is to be kept for
   *      future use.
   */
  setFormat (dev_id: number, format: MediaFormatVideo, keep: boolean);

  /**
   * Get the video format capability to the video device.
   * If video device is currently active, the method will forward the request
   * to the video device. If video device is currently inactive, and if
   * application had previously set the setting and mark the setting as kept,
   * then that setting will be returned. Otherwise, this method will
   * raise error.
   *
   * This method is only valid if the device has
   * PJMEDIA_VID_DEV_CAP_FORMAT capability in VideoDevInfo.caps flags,
   * otherwise Error will be thrown.
   *
   * @param dev_id  The video device id.
   * @return keep  The video format.
   */
  getFormat (dev_id: number): MediaFormatVideo;

  /**
   * This will configure video format capability to the video device.
   * If video device is currently active, the method will forward the setting
   * to the video device instance to be applied immediately, if it
   * supports it.
   *
   * This method is only valid if the device has
   * PJMEDIA_VID_DEV_CAP_INPUT_SCALE capability in VideoDevInfo.caps flags,
   * otherwise Error will be thrown.
   *
   * Note that in case the setting is kept for future use, it will be applied
   * to any devices, even when application has changed the video device to be
   * used.
   *
   * @param dev_id  The video device id.
   * @param scale  The video scale.
   * @param keep  Specify whether the setting is to be kept for
   *      future use.
   */
  setInputScale (dev_id: number, scale: MediaSize, keep: boolean);

  /**
   * Get the video input scale capability to the video device.
   * If video device is currently active, the method will forward the request
   * to the video device. If video device is currently inactive, and if
   * application had previously set the setting and mark the setting as kept,
   * then that setting will be returned. Otherwise, this method will
   * raise error.
   *
   * This method is only valid if the device has
   * PJMEDIA_VID_DEV_CAP_FORMAT capability in VideoDevInfo.caps flags,
   * otherwise Error will be thrown.
   *
   * @param dev_id  The video device id.
   * @return keep  The video format.
   */
  getInputScale (dev_id: number): MediaSize;

  /**
   * This will configure fast switching to another video device.
   * If video device is currently active, the method will forward the setting
   * to the video device instance to be applied immediately, if it
   * supports it.
   *
   * This method is only valid if the device has
   * PJMEDIA_VID_DEV_CAP_OUTPUT_WINDOW_FLAGS capability in VideoDevInfo.caps
   * flags, otherwise Error will be thrown.
   *
   * Note that in case the setting is kept for future use, it will be applied
   * to any devices, even when application has changed the video device to be
   * used.
   *
   * @param dev_id  The video device id.
   * @param flags  The video window flag.
   * @param keep  Specify whether the setting is to be kept for
   *      future use.
   */
  setOutputWindowFlags (dev_id: number, flags: number, keep: boolean);

  /**
   * Get the window output flags capability to the video device.
   * If video device is currently active, the method will forward the request
   * to the video device. If video device is currently inactive, and if
   * application had previously set the setting and mark the setting as kept,
   * then that setting will be returned. Otherwise, this method will
   * raise error.
   *
   * This method is only valid if the device has
   * PJMEDIA_VID_DEV_CAP_OUTPUT_WINDOW_FLAGS capability in VideoDevInfo.caps
   * flags, otherwise Error will be thrown.
   *
   * @param dev_id  The video device id.
   * @return keep  The video format.
   */
  getOutputWindowFlags (dev_id: number): number;

  /**
   * This will configure fast switching to another video device.
   * If video device is currently active, the method will forward the setting
   * to the video device instance to be applied immediately, if it
   * supports it.
   *
   * This method is only valid if the device has
   * PJMEDIA_VID_DEV_CAP_SWITCH capability in VideoDevInfo.caps flags,
   * otherwise Error will be thrown.
   *
   * @param dev_id  The video device id.
   * @param param  The video switch param.
   */
  switchDev (dev_id: number, param: VideoSwitchParam);

  /**
   * Check whether the video capture device is currently active, i.e. if
   * a video preview has been started or there is a video call using
   * the device.
   *
   * @param dev_id  The video device id
   *
   * @return    True if it's active.
   */
  isCaptureActive (dev_id: number): boolean;

  /**
   * This will configure video orientation of the video capture device.
   * If the device is currently active (i.e. if there is a video call
   * using the device or a video preview has been started), the method
   * will forward the setting to the video device instance to be applied
   * immediately, if it supports it.
   *
   * The setting will be saved for future opening of the video device,
   * if the "keep" argument is set to true. If the video device is
   * currently inactive, and the "keep" argument is false, this method
   * will throw Error.
   *
   * @param dev_id  The video device id
   * @param orient  The video orientation.
   * @param keep  Specify whether the setting is to be kept for
   *      future use.
   *
   */
  setCaptureOrient (dev_id: pjmedia_vid_dev_index, orient: pjmedia_orient, keep: boolean);

  videoDevList: VideoDevInfoVector;

  clearVideoDevList ();

}

/*************************************************************************
 * Codec management
 */

/**
 * This export interfaceure describes codec information.
 */
export interface CodecInfo {
  /**
   * Codec unique identification.
   */
  codecId: string;

  /**
   * Codec priority (integer 0-255).
   */
  priority: number;

  /**
   * Codec description.
   */
  desc: string;

  /**
   * Conexport interface from pjsua_codec_info.
   */
  fromPj (codec_info: pjsua_codec_info);
}

/**
 * Warning: deprecated, use CodecInfoVector2 instead.
 *
 * Array of codec info.
 */
export type CodecInfoVector = CodecInfo[];

/** Array of codec info */
export type CodecInfoVector2 = CodecInfo[];

/**
 * export interfaceure of codec specific parameters which contains name=value pairs.
 * The codec specific parameters are to be used with SDP according to
 * the standards (e.g: RFC 3555) in SDP 'a=fmtp' attribute.
 */
export interface CodecFmtp {
  name: string;
  val: string;
}

/** Array of codec fmtp */
export type CodecFmtpVector = CodecFmtp[];

/**
 * Audio codec parameters info.
 */
export interface CodecParamInfo {
  clockRate: number;
  /**< Sampling rate in Hz      */
  channelCnt: number;
  /**< Channel count.        */
  avgBps: number;
  /**< Average bandwidth in bits/sec  */
  maxBps: number;
  /**< Maximum bandwidth in bits/sec  */
  maxRxFrameSize: number;
  /**< Maximum frame size             */
  frameLen: number;
  /**< Decoder frame ptime in msec.   */
  pcmBitsPerSample: number;
  /**< Bits/sample in the PCM side    */
  pt: number;
  /**< Payload type.        */
  fmtId: pjmedia_format_id;		/**< Source format, it's format of
   encoder input and decoder
   output.          */
}

/**
 * Audio codec parameters setting.
 */
export interface CodecParamSetting {
  frmPerPkt: number;
  /**< Number of frames per packet.  */
  vad: boolean;
  /**< Voice Activity Detector.  */
  cng: boolean;
  /**< Comfort Noise Generator.  */
  penh: boolean;
  /**< Perceptual Enhancement    */
  plc: boolean;
  /**< Packet loss concealment  */
  reserved: boolean;
  /**< Reserved, must be zero.  */
  encFmtp: CodecFmtpVector;
  /**< Encoder's fmtp params.    */
  decFmtp: CodecFmtpVector;	    /**< Decoder's fmtp params.    */
}

/**
 * Detailed codec attributes used in configuring an audio codec and in querying
 * the capability of audio codec factories.
 *
 * Please note that codec parameter also contains SDP specific setting,
 * #setting::decFmtp and #setting::encFmtp, which may need to be set
 * appropriately based on the effective setting.
 * See each codec documentation for more detail.
 */
export interface CodecParam {
  info: CodecParamInfo;
  setting: CodecParamSetting;

  fromPj (param: pjmedia_codec_param);

  toPj (): pjmedia_codec_param;
}

/**
 * Opus codec parameters setting;
 */
export interface CodecOpusConfig {
  sample_rate: number;
  /**< Sample rate in Hz.                     */
  channel_cnt: number;
  /**< Number of channels.                    */
  frm_ptime: number;
  /**< Frame time in msec.        */
  bit_rate: number;
  /**< Encoder bit rate in bps.    */
  packet_loss: number;
  /**< Encoder's expected packet loss pct.  */
  complexity: number;
  /**< Encoder complexity, 0-10(10 is highest)*/
  cbr: boolean;

  /**< Constant bit rate?      */

  toPj (): pjmedia_codec_opus_config;

  fromPj (config: pjmedia_codec_opus_config);
}

/**
 * Detailed codec attributes used in configuring a video codec and in querying
 * the capability of video codec factories.
 *
 * Please note that codec parameter also contains SDP specific setting,
 * #decFmtp and #encFmtp, which may need to be set appropriately based on
 * the effective setting. See each codec documentation for more detail.
 */
export interface VidCodecParam {
  dir: pjmedia_dir;
  /**< Direction                      */
  packing: pjmedia_vid_packing;
  /**< Packetization strategy.      */

  encFmt: MediaFormatVideo;
  /**< Encoded format              */
  encFmtp: CodecFmtpVector;
  /**< Encoder fmtp params      */
  encMtu: number;
  /**< MTU or max payload size setting*/

  decFmt: MediaFormatVideo;
  /**< Decoded format              */
  decFmtp: CodecFmtpVector;
  /**< Decoder fmtp params      */

  ignoreFmtp: boolean;	/**< Ignore fmtp params. If set to
   true, the codec will apply
   format settings specified in
   encFmt and decFmt only.      */

  /**
   * Default conexport interfaceor
   */

  fromPj (param: pjmedia_vid_codec_param);

  toPj (): pjmedia_vid_codec_param;
}

/*************************************************************************
 * Media event
 */

/**
 * This export interfaceure describes a media format changed event.
 */
export interface MediaFmtChangedEvent {
  newWidth: number;
  /**< The new width.     */
  newHeight: number;     /**< The new height.    */
}

/**
 * This export interfaceure describes an audio device error event.
 */
export interface AudDevErrorEvent {
  dir: pjmedia_dir;
  /**< The direction.      */
  id: number;
  /**< The audio device ID.   */
  status: pj_status_t;	/**< The status code.      */
}

/**
 * Media event data.
 */
export type MediaEventData = {
  /**
   * Media format changed event data.
   */
  fmtChanged: MediaFmtChangedEvent;

  /**
   * Audio device error event data.
   */
  audDevError: AudDevErrorEvent;

  /**
   * Pointer to storage to user event data, if it's outside
   * this export interface
   */
  ptr: GenericData;

}

/**
 * This export interfaceure describes a media event. It corresponds to the
 * pjmedia_event export interfaceure.
 */
export interface MediaEvent {
  /**
   * The event type.
   */
  type: pjmedia_event_type;

  /**
   * Additional data/parameters about the event. The type of data
   * will be specific to the event type being reported.
   */
  data: MediaEventData;

  /**
   * Pointer to original pjmedia_event. Only valid when the export interface
   * is converted from PJSIP's pjmedia_event.
   */
  pjMediaEvent;

  /**
   * Convert from pjsip
   */
  fromPj (ev: pjmedia_event);
}
