/**	
	an object representing a custom reminder created by a player,
	for use in the journal. custom reminders may be static entries
	in the journal (similar to entries in the notes tab) or dynamic
	entries that remind the player of time-sensitive things.
	at any given time, a custom reminder is considered either
	'primed' or 'fired', such that a primed reminder either
	has no firing date or has not yet been fired (intended use case:
	"the science fair is in 6 days"), while a fired reminder has
	passed a date set by the user and has not yet reset (if it will
	reset at all) (intended use case: "the science fair is today").
	if a custom reminder is intrusive, it will push a message to the
	main passage (via <<effects>>) the moment it fires. 
	
	TODO: document further functionality (eg other fields), decide 
	on internal or external checking
	@typedef {Object} CustomReminder

	@property {DateTime.timestamp} timestamp
		the precise time at which the reminder should fire. if 0,
		the reminder never fires or expires. 
		must be in [0, 315569437199]
	@property {"weeks" | "days" | "hours" | "minutes"} granularity  
		how fine the reminder is (weeks, days, hours, minutes). 
		determines whether 6pm reminder displays
		as "today" or "in 4 hours", for example.
		may be undefined if time is 0.
	@property {number} duration 
		number of seconds between when a reminder fires 
		and resets/expires. for use with the .time timestamp;
		granularity may not be finer than minutes. 
		must be nonnegative.
		may be undefined if time is 0.
	@property {boolean} complete
		whether or not the user has marked the reminder as complete.
		resets when the timer resets. if a reminder is marked
		as complete, it will not push notifications, even if
		intrusive is set to true.
	@property {number} repeats
		the amount of times a reminder fires and resets its timer 
		before expiration. if 0, expires on next fire. 
		if -1, repeats indefinitely.
		must be an integer
		may be undefined if time is 0.
	@property {boolean} expired
		when true, marks the reminder as expired, removing functionality
		and marking the object for deletion by the journal itself
	@property {number} cooldown
		the number of seconds timestamp should be increased by when
		the reminder resets after being fired, for use with recurring 
		reminders.
		must be nonnegative.
		may be undefined if time is 0 or repeats is 0.
	@property {boolean} intrusive
		boolean for whether or not to push a notification about
		the reminder to the main passage text, via <<effects>>,
		when it triggers.
		if undefined, treated as false.
	@property {string} entry 
		user-generated entry displayed in the custom reminders
		section of the journal. only ever display as:
		"<nowiki>" + reminder.entry + " </nowiki>"
*/

class CustomReminder {
	constructor(timestamp = 0, granularity = undefined, 
				duration = undefined, repeats = undefined, 
				cooldown = undefined, intrusive = undefined, entry = "") {
		// some silly little type checking
		if (!Number.isFinite(timestamp) || typeof timestamp !== 'number' || timestamp < 0 || timestamp > 315569437199) 
			throw new Error(`invalid timestamp ${timestamp} passed to CustomReminder constructor`);
		this.timestamp = timestamp;
		if (this.timestamp !== 0 && !["weeks", "days", "hours", "minutes"].includes(granularity)) 
			throw new Error(`invalid granularity ${granularity} passed to CustomReminder constructor with nonzero timestamp ${this.timestamp}`);
		this.granularity = granularity;
		if (this.timestamp !== 0 && (!Number.isFinite(duration) || typeof duration !== 'number' || duration < 0))
			throw new Error(`invalid duration ${duration} passed to CustomReminder constructor with nonzero timestamp ${this.timestamp}`);
		this.duration = duration;
		this.complete = false;
		if (this.timestamp !== 0 && (!Number.isInteger(repeats) || typeof repeats !== 'number'))
			throw new Error(`invalid repeats ${repeats} passed to CustomReminder constructor with nonzero timestamp ${this.timestamp}`);
		this.repeats = repeats;
		this.expired = false;
		if (this.timestamp !== 0 && this.repeats !== 0 && (!Number.isFinite(cooldown) || typeof cooldown !== 'number'))
			throw new Error(`invalid cooldown ${cooldown} passed to CustomReminder constructor with nonzero timestamp ${this.timestamp} and nonzero repeats ${this.repeats}`);
		this.cooldown = cooldown;
		this.intrusive = intrusive ? true : false; // coerce into boolean (yes, i know it could just be !!intrusive, but that's less readable)
		if (typeof entry !== 'string')
			throw new Error(`non-string entry ${entry} passed to CustomReminder constructor`);
		this.entry = entry;
	}

	

}
