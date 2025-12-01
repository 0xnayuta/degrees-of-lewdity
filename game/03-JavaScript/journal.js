/**	
	custom reminder type typedef:
	@typedef {Object} CustomReminder

	@property {DateTime} time
		timestamp, the time at which the reminder fires. if 0,
		the reminder never fires or expires.
	@property {"weeks" | "days" | "hours" | "minutes"} granularity  
		how fine the reminder is (weeks, days, hours, minutes). 
		determines whether 6pm reminder displays
		as "today" or "in 4 hours", for example.
		may be undefined if time is 0.
	@property {number} duration 
		number of seconds between when a reminder fires 
		and resets/expires. for use with the .time timestamp;
		granularity may not be finer than minutes.
		may be undefined if time is 0.
	@property {boolean} complete
		whether or not the user has marked the reminder as complete.
		resets when the timer resets. if a reminder is marked
		as complete, it will not push notifications, even if
		intrusive is set to true.
	@property {number} cooldown
		the number of seconds between the reminder being set and the 
		reminder being fired, for use with recurring reminders.
		may be undefined if time is 0 or repeats is 0.
	@property {number} repeats
		the amount of times a reminder fires and resets its timer 
		before expiration. if 0, expires on next fire. 
		if -1, repeats indefinitely.
		may be undefined if time is 0.
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
