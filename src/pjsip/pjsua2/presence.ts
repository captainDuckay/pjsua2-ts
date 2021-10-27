/**
 * This describes presence status.
 */
import { pjsua_buddy_id, pjsua_buddy_info, pjsua_buddy_status } from "../pjsua-lib/pjsua";
import { SendInstantMessageParam, SendTypingIndicationParam, SipEvent } from "./SIPTypes";
import { Account } from "./account";

export interface PresenceStatus {
  /**
   * Buddy's online status.
   */
  status: pjsua_buddy_status;

  /**
   * Text to describe buddy's online status.
   */
  statusText: string;

  /**
   * Activity type.
   */
  activity: pjrpid_activity;

  /**
   * Optional text describing the person/element.
   */
  note: string;

  /**
   * Optional RPID ID string.
   */
  rpidId: string;

  /**
   * Conexport interfaceor.
   */
  PresenceStatus ();
};

/**
 * This export interfaceure describes buddy configuration when adding a buddy to
 * the buddy list with Buddy::create().
 */
export interface BuddyConfig {
  /**
   * Buddy URL or name address.
   */
  uri: string;

  /**
   * Specify whether presence subscription should start immediately.
   */
  subscribe: boolean;

};

/**
 * This export interfaceure describes buddy info, which can be retrieved by via
 * Buddy::getInfo().
 */
export interface BuddyInfo {
  /**
   * The full URI of the buddy, as specified in the configuration.
   */
  uri: string;

  /**
   * Buddy's Contact, only available when presence subscription has
   * been established to the buddy.
   */
  contact: string;

  /**
   * Flag to indicate that we should monitor the presence information for
   * this buddy (normally yes, unless explicitly disabled).
   */
  presMonitorEnabled: boolean;

  /**
   * If \a presMonitorEnabled is true, this specifies the last state of
   * the presence subscription. If presence subscription session is currently
   * active, the value will be PJSIP_EVSUB_STATE_ACTIVE. If presence
   * subscription request has been rejected, the value will be
   * PJSIP_EVSUB_STATE_TERMINATED, and the termination reason will be
   * specified in \a subTermReason.
   */
  subState: pjsip_evsub_state;

  /**
   * String representation of subscription state.
   */
  subStateName: string;

  /**
   * Specifies the last presence subscription termination code. This would
   * return the last status of the SUBSCRIBE request. If the subscription
   * is terminated with NOTIFY by the server, this value will be set to
   * 200, and subscription termination reason will be given in the
   * \a subTermReason field.
   */
  subTermCode: pjsip_status_code;

  /**
   * Specifies the last presence subscription termination reason. If
   * presence subscription is currently active, the value will be empty.
   */
  subTermReason: string;

  /**
   * Presence status.
   */
  presStatus: PresenceStatus;

  /** Import from pjsip export interfaceure */
  fromPj (pbi: pjsua_buddy_info);
};

/**
 * This export interfaceure contains parameters for Buddy::onBuddyEvSubState() callback.
 */
export interface OnBuddyEvSubStateParam {
  /**
   * * The event which triggers state change event.
   */
  e: SipEvent;
};

/**
 * Buddy. This is a lite wrapper class for PJSUA-LIB buddy, i.e: this class
 * only maintains one data member, PJSUA-LIB buddy ID, and the methods are
 * simply proxies for PJSUA-LIB buddy operations.
 *
 * Application can use create() to register a buddy to PJSUA-LIB, and
 * the deexport interfaceor of the original instance (i.e: the instance that calls
 * create()) will unregister and delete the buddy from PJSUA-LIB. Application
 * must delete all Buddy instances belong to an account before shutting down
 * the account (via Account::shutdown()).
 *
 * The library will not keep a list of Buddy instances, so any Buddy (or
 * descendant) instances instantiated by application must be maintained
 * and destroyed by the application itself. Any PJSUA2 APIs that return Buddy
 * instance(s) such as Account::enumBuddies2() or Account::findBuddy2() will
 * just return generated copy. All Buddy methods should work normally on this
 * generated copy instance.
 */
export interface Buddy {

  /**
   * Create buddy and register the buddy to PJSUA-LIB.
   *
   * Note that application should maintain the Buddy original instance, i.e:
   * the instance that calls this create() method as it is only the original
   * instance deexport interfaceor that will delete the underlying Buddy in PJSUA-LIB.
   *
   * @param acc    The account for this buddy.
   * @param cfg    The buddy config.
   */
  create (acc: Account, cfg: BuddyConfig);

  /**
   * Check if this buddy is valid.
   *
   * @return      True if it is.
   */
  isValid (): boolean;

  /**
   * Get PJSUA-LIB buddy ID or index associated with this buddy.
   *
   * @return      Integer greater than or equal to zero.
   */
  getId (): number;

  /**
   * Get detailed buddy info.
   *
   * @return      Buddy info.
   */
  getInfo (): BuddyInfo;

  /**
   * Enable/disable buddy's presence monitoring. Once buddy's presence is
   * subscribed, application will be informed about buddy's presence status
   * changed via \a onBuddyState() callback.
   *
   * @param subscribe    Specify true to activate presence
   *        subscription.
   */
  subscribePresence (subscribe: boolean);

  /**
   * Update the presence information for the buddy. Although the library
   * periodically refreshes the presence subscription for all buddies,
   * some application may want to refresh the buddy's presence subscription
   * immediately, and in this case it can use this function to accomplish
   * this.
   *
   * Note that the buddy's presence subscription will only be initiated
   * if presence monitoring is enabled for the buddy. See
   * subscribePresence() for more info. Also if presence subscription for
   * the buddy is already active, this function will not do anything.
   *
   * Once the presence subscription is activated successfully for the buddy,
   * application will be notified about the buddy's presence status in the
   * \a onBuddyState() callback.
   */
  updatePresence ();

  /**
   * Send instant messaging outside dialog, using this buddy's specified
   * account for route set and authentication.
   *
   * @param prm  Sending instant message parameter.
   */
  sendInstantMessage (prm: SendInstantMessageParam);

  /**
   * Send typing indication outside dialog.
   *
   * @param prm  Sending instant message parameter.
   */
  sendTypingIndication (prm: SendTypingIndicationParam);

  /*
   * Callbacks
   */

  /**
   * Notify application when the buddy state has changed.
   * Application may then query the buddy info to get the details.
   */
  onBuddyState ();

  /**
   * Notify application when the state of client subscription session
   * associated with a buddy has changed. Application may use this
   * callback to retrieve more detailed information about the state
   * changed event.
   *
   * @param prm  Callback parameter.
   */
  onBuddyEvSubState (prm: OnBuddyEvSubStateParam);

  /**
   * Buddy ID.
   */
  id: pjsua_buddy_id;

  /* Internal conexport interfaceor/methods used by Endpoint and Account */
  Buddy (buddy_id: pjsua_buddy_id);

  getOriginalInstance (): Buddy;
}

/**
 * Warning: deprecated, use BuddyVector2 instead.
 *
 * Array of buddies.
 */
export type BuddyVector = Buddy[];

/** Array of buddies */
export type BuddyVector2 = Buddy[];

