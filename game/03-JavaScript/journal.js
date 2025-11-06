/*
	custom reminder type namespace/typedef:
	- time: 		timestamp, the time at which the reminder fires. if 0,
						the reminder never fires or expires.
	- granularity:  how fine the reminder is (weeks, days, hours, minutes). 
						determines whether 6pm reminder displays
						as "today" or "in 4 hours", for example.
						may be undefined if time is 0.
	- duration: 	number of seconds between when a reminder fires 
						and resets/expires. for use with the .time timestamp;
						granularity may not be finer than minutes.
						may be undefined if time is 0.
	- cooldown: 	the time between the reminder being set and the reminder 
						being fired, for use with recurring reminders.
						may be undefined if time is 0 or repeats is 0.
	- repeats:  	the amount of time a reminder fires and resets its timer 
						before expiration. if 0, expires on next fire. 
						if -1, repeats indefinitely.
						may be undefined if time is 0.
	- intrusive: 	boolean for whether or not to push a notification about
						the reminder to the main passage text, via <<effects>>,
						when it triggers.
						if undefined, treated as false.
	- entry:		user-generated entry displayed in the custom reminders
						section of the journal. only ever display as:
						"<nowiki>" + reminder.entry + " </nowiki>"
*/
