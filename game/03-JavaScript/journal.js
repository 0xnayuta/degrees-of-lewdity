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
	 *      must be in [TimeConstants.MIN_DATE.timeStamp, TimeConstants.MAX_DATE.timeStamp]
	 * @param {"weeks" | "days" | "hours" | "minutes"} granularity
	 *      how fine the reminder is (weeks, days, hours, minutes).
	 *      determines whether 6pm reminder displays
	 *      as "today" or "in 4 hours", for example.
	 *      may be undefined if time is 0.
	 * @param {DateTime.timeStamp} duration
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
	 * @param {DateTime.timeStamp} cooldown
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
	 * @param {undefined | "red" | "pink" | "purple" | "blue" | "lblue" | "teal" | "green" | "gold"} colour
	 *      what colour the custom reminder should be in the journal.
	 *      will be exposed to the user as a dropdown.
	 *      must correspond to a css class.
	 *      may be undefined.
	 */
	constructor(timeStamp = 0, // granularity = undefined, 
				duration = undefined, repeats = undefined, 
				cooldown = undefined, intrusive = undefined, 
				persistent = undefined, entry = "", 
				colour = undefined) {
		// some silly little type checking
		if (!Number.isFinite(timeStamp) || typeof timeStamp !== 'number' || timeStamp < TimeConstants.MIN_DATE.timeStamp || timeStamp > TimeConstants.MAX_DATE.timeStamp) 
			throw new Error(`invalid timeStamp ${timeStamp} passed to CustomReminder constructor`);
		/**
		 * @type {DateTime.timeStamp}
		 * @description 
		 * the precise time at which the reminder should fire. if 0,
		 * the reminder never fires or expires.
		 * must be in [TimeConstants.MIN_DATE.timeStamp, TimeConstants.MAX_DATE.timeStamp]
		 */
		this.timeStamp = timeStamp;

		// if (this.timeStamp !== 0 && !["weeks", "days", "hours", "minutes"].includes(granularity)) 
		// 	throw new Error(`invalid granularity ${granularity} passed to CustomReminder constructor with nonzero timeStamp ${this.timeStamp}`);
		// /**
		//  * @type {"weeks" | "days" | "hours" | "minutes"}
		//  * @description 
		//  * how fine the reminder is (weeks, days, hours, minutes).
		//  * determines whether 6pm reminder displays
		//  * as "today" or "in 4 hours", for example.
		//  * may be undefined if time is 0.
		//  */
		// this.granularity = granularity;
		
		if (this.timeStamp !== 0 && (!Number.isFinite(duration) || typeof duration !== 'number' || duration < 0))
			throw new Error(`invalid duration ${duration} passed to CustomReminder constructor with nonzero timeStamp ${this.timeStamp}`);
		/**
		 * @type {DateTime.timeStamp}
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
		 * @type {DateTime.timeStamp}
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
	
		// TODO add type checking for colour once implemented
		if (colour !== undefined && !["red", "pink", "purple", "blue", "lblue", "teal", "green", "gold"].includes(colour))
			throw new Error(`invalid colour ${colour} passed to CustomReminder constructor`)
		/**
		 * @type {undefined | "red" | "pink" | "purple" | "blue" | "lblue" | "teal" | "green" | "gold"}
		 * @description 
		 * what colour the custom reminder should be in the journal.
		 * will be exposed to the user as a dropdown.
		 * must correspond to a css class.
		 * may be undefined.
		 */
		this.colour = colour;
	}

	/**
	 * returns a string of this reminder's text that can be safely wikified
	 *
	 * @returns the text of the reminder that we want to display in the 
	 * 			journal, wrapped up cozy and safe
	 */
	getText() {
		// TODO replace colour arg with simple this.colour if appropriate (use cases?)
		if (this.colour !== undefined) {
			return `<span class=${this.colour}><nowiki>${this.entry}</nowiki></span>`;
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
	 * update the reminder, and push intrusive non-persistent reminders
	 * 
	 * to be called by pass() in time.js
	 */
	update() {
		// safety checks
		if (V.customReminders === undefined)
			throw new Error(`some CustomReminder with entry ${this.entry} called its update() when V.customReminders was undefined`);
		if (V.customReminders?.reminders === undefined)
			throw new Error(`V.customReminders exists but has no attribute reminders, yet some CustomReminder with entry ${this.entry} exists and called its update()`)
		if (V.customReminders?.notifications == undefined)
			throw new Error(`V.customReminders exists but has no attribute notifications`)
		// if (!Object.hasOwn(V.customReminders, "colours"))
		// 	throw new Error(`V.customReminders exists but has no attribute colours`)

		// if the reminder is hidden, we're in a flashback or something
		// we don't want to update anything, because it could mess with things
		// separately, we also don't ever want to use an already-expired reminder
		if (this.hidden || this.expired)
			return;

		// first, fire the reminder if needed
		if (Time.date.timeStamp >= this.timeStamp) {
			// if we haven't fired, do so whether or not the duration has lapsed,
			// unless the user has already marked the reminder as complete
			if (this.intrusive && !this.fired && !this.complete) {
				V.customReminders.notifications.push(this.entry.getText());
				// V.customReminders.colours.push(this.colour);
				// if the reminder is persistent, fired can stay false so it continues firing
				// otherwise, set it to true, so it doesn't fire again until the next reset
				this.fired = !this.persistent; 
			}
		}
		// next, if the reminder needs to reset
		if (Time.date.timeStamp >= this.timeStamp + this.duration) {
			let elapsedTime = Time.date.timeStamp - this.timeStamp; // current time - fire time
			// this is fine because cooldown is the exact period between firings, 
			// rather than the durations between when a reminder becomes active
			// ex: if a reminder repeats every 5 minutes, lasts 1 minute, and 11 minutes 
			// have passed since it was last fired, skippedDurations will be 2
			let skippedDurations = Math.floor(elapsedTime / this.cooldown);
			// skippedDurations could be 0: if it is, all of the below code that uses it has no effect,
			// so no need to check for that explicitly
			
			if (this.repeats !== -1) {
				// make sure we don't do more durations than we have left
				// this doesn't include the "final fire" that happens before the reminder expires
				// but that should be handled by the above initial fire:
				skippedDurations = Math.min(skippedDurations, this.repeats);
				// decrement inside this if, because we only want to decrement if 
				// the reminder doesn't go forever
				this.repeats -= skippedDurations;
			}
			
			if (this.intrusive) {
				// stack a reminder for each full duration we missed
				// even if it's persistent (and so not 1:1 reminder per fire), we still want parity here
				for (let i = 0; i < skippedDurations; i++) {
					V.customReminders.notifications.push(this.entry.getText());
					// V.customReminders.colours.push(this.colour);
				}
			}
			this.timeStamp += this.cooldown * this.skippedDurations;
			

		}

		// now, handle the finishing cases
		if (Time.date.timeStamp >= this.timeStamp + this.duration) {
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
		return Time.date.timeStamp >= this.timeStamp && Time.date.timeStamp < this.timeStamp + this.duration;
	}

	/**
	 * 
	 */
	hash() {

	}

	

}


/**
 * TODOS
 * 
 * investigate timetravel
 * statfreeze support: hide all journal entries and ensure new entries can't be made
 * 
 * input stuff:
 * <<addclass>>, <<removeclass>>, <<toggleclass>>
 * <<radiovar>>
 * <<checkbox>>
 * <label>
 * <form>
 * <input> (particularly time input, dropdown input)
 * 
 * for interface: add simple mode and advanced mode (what has what?)
 * in-journal click-to-complete? onclick function for the textboxes that toggles their class
 * 
 * investigate save reminder (alternative to <<effects>>?)
 * in-passage dismiss button (mark as complete)
 * in-journal checkbox (mark as complete)
 * investigate sidebar integration
 * investigate time freezing stuff and hc integration
 * add export/import for reminders (json format? -- investigate settings export/import)
 * 
 * hash function or unique ids? probably ids, but how do we pick the id?
 * hardcoded limit to max reminders? testing for later, how much can the game handle? how big is a reminder, how much do they bloat save size? compare to notes...
 * 
 * maybe remove granularity? seems stupid when we can just hardcode to show days at >24 hours and hours at >60 mins
 * 
 * have persistent reminders act as regular intrusive, and otherwise only queue reminders if there isn't already one queued? how do we check if it's queued or not?
 * 
 * don't push reminders when $combat is 1 -- just skip everything there
 * 
 * nullish assignment
 * 
 * other -- make strange flowers impossible to grow outside of the farm
 */



/*
 * macro to make the input elements for the 'repeats' field, 
 * because sugarcube makes this type of thing surprisingly difficult
 * 
 * necessary because as far as i can tell, it's impossible to reliably add event handlers 
 * in a sugarcube <<script>> tag without the ":passagerender" event -- which doesn't work for putting
 * elements into DoL's customOverlay element, which the journal uses, since they use post-render 
 * <<replace>> calls to put things in the window. so the path of least resistance is to create 
 * the element with handlers baked in via jquery, put them in a macro, and call that macro where the
 * elements are wanted.
 * 
 */
Macro.add("journalCustomEntriesRepeatsInput", {
	tags: null,
	handler() {
		if (this.args.length !== 3) 
			return this.error("<<journalCustomEntriesRepeatsInput>> had bad arguments. bad args: " + JSON.stringify(this.args));
		
		const varNameNum = this.args[0];
		const varNameChecked = this.args[1];
		const defaultNumber = this.args[2];

		let numberInput = $("<input>").attr({
			name: "journalCustomEntriesRepeatsInput" + Util.slugify(varNameNum) + "Number",
			id: "journalCustomEntriesRepeatsInput" + Util.slugify(varNameNum) + "Number",
			type: "number",
			min: 0, 
		}).addClass("macro-numberbox");

		let checkboxInput = $("<input>").attr({
			name: "journalCustomEntriesRepeatsInput" + Util.slugify(varNameChecked) + "Checkbox",
			id: "journalCustomEntriesRepeatsInput" + Util.slugify(varNameChecked) + "Checkbox",
			type: "checkbox",
		}).addClass("macro-checkbox");

		numberInput.on("change", function handler() {
			State.setVar(varNameNum, Number(numberInput.val()));
		});

		numberInput.val(defaultNumber);

		checkboxInput.on("change", function handler() {
			numberInput.prop('disabled', this.checked);
			State.setVar(varNameChecked, this.checked);
		});

		let label = $("<label></label>")
		.append(checkboxInput)
		.append(`<span> Repeat forever</span>`);

		numberInput.appendTo(this.output);
		$(`<span> | </span>`).appendTo(this.output);
		label.appendTo(this.output);
	}
});
