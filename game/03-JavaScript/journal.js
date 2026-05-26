/**
 *  @class
 *  an object representing a custom reminder created by a player,
 *  for use in the journal. custom reminders may be static entries
 *  in the journal (similar to entries in the notes tab) or dynamic
 *  entries that remind the player of time-sensitive things.
 *  at any given time, a custom reminder is considered either
 *  'primed' or 'fired', such that a primed reminder either
 *  has no firing date or has not yet been fired (intended use case:
 *  "the science fair is in 6 days"), while a fired reminder has
 *  passed a date set by the user and has not yet reset (if it will
 *  reset at all) (intended use case: "the science fair is today").
 *  if a custom reminder is intrusive, it will push a message to the
 *  main passage (via <<effects>>) the moment it fires.
 */


class CustomReminder {
	/**
	 * @param {DateTime.timeStamp} timeStamp
	 *      the precise time at which the reminder should fire. if 0,
	 *      the reminder never fires or expires.
	 *      must be in [0, 315569437199]
	 * @param {"weeks" | "days" | "hours" | "minutes"} granularity
	 *      how fine the reminder is (weeks, days, hours, minutes).
	 *      determines whether 6pm reminder displays
	 *      as "today" or "in 4 hours", for example.
	 *      may be undefined if time is 0.
	 * @param {number} duration
	 *      number of seconds between when a reminder fires
	 *      and resets/expires. for use with the .time timeStamp;
	 *      granularity may not be finer than minutes.
	 *      must be nonnegative.
	 *      may be undefined if time is 0.
	 * @param {number} repeats
	 *      the amount of times a reminder fires and resets its timer
	 *      before expiration. if 0, expires on next fire.
	 *      if -1, repeats indefinitely.
	 *      must be an integer
	 *      may be undefined if time is 0.
	 * @param {number} cooldown
	 *      the number of seconds timeStamp should be increased by when
	 *      the reminder resets after being fired, for use with recurring
	 *      reminders.
	 *      must be nonnegative.
	 *      may be undefined if time is 0 or repeats is 0.
	 * @param {boolean} intrusive
	 *      boolean for whether or not to push a notification about
	 *      the reminder to the main passage text, via <<effects>>,
	 *      when it triggers.
	 *      if undefined, treated as false.
	 * @param {boolean} persistent
	 * 		boolean for whether or not pushed notifications are pushed
	 * 		persistently -- which is to say, pushed every time <<effects>> 
	 * 		is called for the duration of the reminder
	 * 		if undefined, treated as false
	 * 		must be false if intrusive is false
	 * @param {string} entry
	 *      user-generated entry displayed in the custom reminders
	 *      section of the journal. only ever display as:
	 *      "<nowiki>" + reminder.entry + " </nowiki>"
	 * @param {string} color
	 *      what color the custom reminder should be in the journal.
	 *      will be exposed to the user as a dropdown.
	 *      must correspond to a css class.
	 *      may be undefined.
	 */
	constructor(timeStamp = 0, granularity = undefined, 
				duration = undefined, repeats = undefined, 
				cooldown = undefined, intrusive = undefined, 
				persistent = undefined, entry = "", 
				color = undefined) {
		// some silly little type checking
		if (!Number.isFinite(timeStamp) || typeof timeStamp !== 'number' || timeStamp < 0 || timeStamp > 315569437199) 
			throw new Error(`invalid timeStamp ${timeStamp} passed to CustomReminder constructor`);
		/**
		 * @type {DateTime.timeStamp}
		 * @description 
		 * the precise time at which the reminder should fire. if 0,
		 * the reminder never fires or expires.
		 * must be in [0, 315569437199]
		 */
		this.timeStamp = timeStamp;

		if (this.timeStamp !== 0 && !["weeks", "days", "hours", "minutes"].includes(granularity)) 
			throw new Error(`invalid granularity ${granularity} passed to CustomReminder constructor with nonzero timeStamp ${this.timeStamp}`);
		/**
		 * @type {"weeks" | "days" | "hours" | "minutes"}
		 * @description 
		 * how fine the reminder is (weeks, days, hours, minutes).
		 * determines whether 6pm reminder displays
		 * as "today" or "in 4 hours", for example.
		 * may be undefined if time is 0.
		 */
		this.granularity = granularity;
		
		if (this.timestamp !== 0 && (!Number.isFinite(duration) || typeof duration !== 'number' || duration < 0))
			throw new Error(`invalid duration ${duration} passed to CustomReminder constructor with nonzero timeStamp ${this.timeStamp}`);
		/**
		 * @type {number}
		 * @description 
		 * number of seconds between when a reminder fires
		 * and resets/expires. for use with the .time timeStamp;
		 * granularity may not be finer than minutes.
		 * must be nonnegative.
		 * may be undefined if time is 0.
		 */
		this.duration = duration;
		
		/**
		 * @type {boolean}
		 * @description 
		 * whether or not the user has marked the reminder as complete.
		 * resets when the timer resets. if a reminder is marked
		 * as complete, it will not push notifications, even if
		 * intrusive is set to true.
		 */
		this.complete = false;

		/**
		 * @type {boolean}
		 * @description 
		 * whether or not the reminder should be suppressed from being
		 * displayed in the journal. not exposed to the user; intended
		 * for use in flashbacks where we don't want it to say "you
		 * have a custom reminder 800 years from now"
		 */
		this.hidden = false;

		/**
		 * @type {boolean}
		 * @description 
		 * when true, marks the reminder as expired, removing functionality
		 * and marking the object for deletion by the journal itself
		 */
		this.expired = false;
		
		if (this.timeStamp !== 0 && (!Number.isInteger(repeats) || typeof repeats !== 'number'))
			throw new Error(`invalid repeats ${repeats} passed to CustomReminder constructor with nonzero timeStamp ${this.timeStamp}`);
		/**
		 * @type {number}
		 * @description 
		 * the amount of times a reminder fires and resets its timer
		 * before expiration. if 0, expires on next fire.
		 * if -1, repeats indefinitely.
		 * must be an integer
		 * may be undefined if time is 0.
		 */
		this.repeats = repeats;
		
		if (this.timeStamp !== 0 && this.repeats !== 0 && (!Number.isFinite(cooldown) || typeof cooldown !== 'number'))
			throw new Error(`invalid cooldown ${cooldown} passed to CustomReminder constructor with nonzero timeStamp ${this.timeStamp} and nonzero repeats ${this.repeats}`);
		/**
		 * @type {number}
		 * @description 
		 * the number of seconds timeStamp should be increased by when
		 * the reminder resets after being fired, for use with recurring
		 * reminders. actual increase will be difference between cooldown 
		 * and duration.
		 * must be nonnegative.
		 * may be undefined if time is 0 or repeats is 0.
		 */
		this.cooldown = cooldown;

		/**
		 * @type {boolean}
		 * @description 
		 * boolean for whether or not to push a notification about
		 * the reminder to the main passage text, via <<effects>>,
		 * when it triggers.
		 * if undefined, treated as false. 
		 * must be false if duration is 0.
		 */
		this.intrusive = intrusive ? true : false; // coerce into boolean

		/**
		 * @type {boolean}
		 * @description
		 * boolean for whether or not pushed notifications are pushed
		 * persistently -- which is to say, pushed every time <<effects>> 
	 	 * is called for the duration of the reminder
	 	 * if undefined, treated as false
		 * must be false if intrusive is false
		 */
		this.persistent = persistent ? true : false; // more coercion

		/**
		 * @type {boolean}
		 * @description
		 * boolean for whether or not we've pushed a notification for
		 * this reminder in this 'cycle' -- true iff the reminder is
		 * intrusive and it has pushed a reminder since it last reset
		 * its timeStamp. recall persistent is only true if intrusive
		 * is true. resets to false when the reminder resets (timeStamp
		 * is changed)
		 */
		this.fired = false;

		if (typeof entry !== 'string')
			throw new Error(`non-string entry ${entry} passed to CustomReminder constructor`);
		if (entry.includes("nowiki")) { // this should be good enough to avoid unexpected wikification effects, but it'll need bug-testing
			entry = "nice try ;)";
		}
		/**
		 * @type {string}
		 * @description 
		 * user-generated entry displayed in the custom reminders
		 * section of the journal. only ever display as:
		 * "<nowiki>" + reminder.entry + " </nowiki>"
		 */
		this.entry = entry;
	
		// TODO add type checking for color once implemented
		/**
		 * @type {string}
		 * @description 
		 * what color the custom reminder should be in the journal.
		 * will be exposed to the user as a dropdown.
		 * must correspond to a css class.
		 * may be undefined.
		 */
		this.color = color;
	}

	/**
	 * returns a string of this reminder's text that can be safely wikified
	 *
	 * @param {string} color optionally, a class to apply to the text
	 * @returns the text of the reminder that we want to display in the 
	 * 			journal or in the main passage, wrapped up cozy and safe
	 */
	getText(color = undefined) {
		// TODO replace color arg with simple this.color if appropriate (use cases?)
		if (color !== undefined) {
			return `<span class=${color}><nowiki>${this.entry}</nowiki></span>`;
		}
		return `<nowiki>${this.entry}</nowiki>`
	}

	/**
	 * resets this reminder
	 * 
	 * @param {DateTime.timeStamp} timeStamp 
	 * 	the timeStamp to reset the reminder to. 
	 *  if undefined, defaults to this.timeStamp + this.cooldown 
	 * @param {number} repeats
	 *  the amount of repeats to set the reminder to.
	 *  if undefined, defaults to -1 if this.repeats is -1, or this.repeats - 1 otherwise
	 */
	reset(timeStamp = undefined, repeats = undefined) {
		// use nullish coalescing to decide between passed arguments and defaults
		this.timeStamp = timeStamp ?? (this.timeStamp + this.cooldown);
		this.repeats = repeats ?? (this.repeats == -1 ? -1 : (this.repeats - 1));
		this.fired = false;
	}

	/**
	 * update the reminder, and push 
	 * 
	 * to be called by pass() in time.js
	 */
	update() {
		// safety checks
		if (typeof V.customReminders === 'undefined')
			throw new Error(`some CustomReminder with entry ${this.entry} called its update() when V.customReminders was undefined`);
		if (!Object.hasOwn(V.customReminders, "reminders"))
			throw new Error(`V.customReminders exists but has no attribute reminders, yet some CustomReminder with entry ${this.entry} exists and called its update()`)
		if (!Object.hasOwn(V.customReminders, "notifications"))
			throw new Error(`V.customReminders exists but has no attribute notifications`)

		// if the reminder is hidden, we're in a flashback or something
		// we don't want to update anything, because it could mess with things
		// separately, we also don't ever want to use an already-expired reminder
		if (this.hidden || this.expired)
			return;

		// first, fire the reminder if needed
		if (V.timeStamp >= this.timeStamp) {
			// if we haven't fired, do so whether or not the duration has lapsed,
			// unless the user has already marked the reminder as complete
			if (this.intrusive && !this.fired && !this.complete) {
				V.customReminders.notifications.push(this.getText(this.color));
				// if the reminder is persistent, fired can stay false so it continues firing
				// otherwise, set it to true, so it doesn't fire again until the next reset
				this.fired = !this.persistent; 
			}
		}
		// next, if the reminder needs to reset
		if (V.timeStamp >= this.timeStamp + this.duration) {
			let elapsedTime = V.timeStamp - this.timeStamp; // current time - fire time
			// this is fine because cooldown is the exact period between firings, 
			// rather than the durations between when a reminder becomes active
			// ex: if a reminder repeats every 5 minutes, lasts 1 minute, and 11 minutes 
			// have passed since it was last fired, skippedDurations will be 2
			let skippedDurations = Math.floor(elapsedTime / this.cooldown);
			// skippedDurations could be 0: if it is, all of the below code that uses it has no effect,
			// so no need to check for that explicitly
			
			if (this.repeats !== -1) {
				// make sure we don't do more durations than we have left
				// this will never include the final fire (the one that 
				// happens when repeats is 0 and sets the reminder to expire after)
				// that's always handled on its own after we deal with however many cycles we've skipped
				skippedDurations = Math.min(skippedDurations, this.repeats);
				// decrement inside this if, because we only want to decrement if 
				// the reminder doesn't go forever
				this.repeats -= skippedDurations;
			}
			
			if (this.intrusive) {
				// stack a reminder for each full duration we missed
				// even if it's persistent (and so not 1:1 reminder per fire), we still want parity here
				for (let i = 0; i < skippedDurations; i++) {
					V.customReminders.notifications.push(this.getText(this.color));
				}
			}
			this.timeStamp += this.cooldown * this.skippedDurations;
			

		}

		// now, handle the finishing cases
		if (V.timeStamp >= this.timeStamp + this.duration) {
			if (this.repeats === 0) {
				this.expired = true;
				return;
			}
			// if we get here, we need to go to the next cycle: 
			// decrement repeats and reset timeStamp to next cooldown,
			// and set fired to false
			// TODO sub with reset() call? or remove reset() function
			if (this.repeats !== -1)
				this.repeats--;
			this.timeStamp += this.cooldown;
			this.fired = false;
		}
	}

	/**
	 * 
	 * 
	 * 
	 */
	isActive() {
		return V.timeStamp >= this.timestamp && V.timeStamp < this.timeStamp + this.duration;
	}

	

}


/**
 * TODOS
 * 
 * investigate timetravel
 * statfreeze support: hide all journal entries and ensure new entries can't be made
 * 
 * 
 * for interface: add simple mode and advanced mode (what has what?)
 * 
 * investigate save reminder (alternative to <<effects>>?)
 * in-passage dismiss button (mark as complete)
 * in-journal checkbox (mark as complete)
 * investigate sidebar integration
 * investigate time freezing stuff and hc integration
 * add export/import for reminders (json format? -- investigate settings export/import)
 * 
 * 
 */
