/*
 * Usage:
 * <<dateInput varname>>
 * creates a 3-input date input, returning its values as a timestamp to varname whenever any of the values updates, as long as no inputs are empty
 * 
 * optionally pre-fills with provided value as default
 * 
 * must be between TimeConstants.MIN_DATE and TimeConstants.MAX_DATE,
 *
 */
Macro.add("relativeInput", {
	tags: null,
	handler() {
		if (this.args.length !== 1) 
			return this.error("<<dateInput>> had bad arguments (expected modifiable variable only). bad args: " + JSON.stringify(this.args));

		const varName = this.args[0];
		// the DateTime constructor, when called with a single argument, constructs a DateTime object from a timeStamp
		let dateTime;

		// we define all of these elements before adding handlers, so they can reference each other
		let numInput = $("<input>").attr({
			name: "relativeInput" + Util.slugify(varName) + "Num",
			id: "relativeInput" + Util.slugify(varName) + "Num",
			type: "number",
			min: 1,
			max: Math.floor(TimeConstants.MAX_DATE.timeStamp / TimeConstants.secondsPerMinute)
		}).addClass("macro-numberbox");
		let granularity = $("<select>").attr({
			name: "relativeInput" + Util.slugify(varName) + "Granularity",
			id: "relativeInput" + Util.slugify(varName) + "Granularity"
		}).addClass("macro-listbox");

		// declared as their own variables in order to reference them later
		// if we didn't need to modify them, we could just append them directly instead
		// but i want it to depluralize when num is 1 and repluralize when it isn't 1, 
		// because i am silly and care about pointless little things like that
		let minutes = $(`<option value="minutes">Minutes</option>`);
		let hours = $(`<option value="hours">Hours</option>`);
		let days = $(`<option value="days">Days</option>`);
		granularity.append(minutes)
		.append(hours)
		.append(days);
		
		function recalculateTimestamp() {
			if (numInput.val() !== "") {
				numInput.val(Math.clamp(numInput.val(), numInput.prop("min"), numInput.prop("max")));
			}
			// we use > 0 to coerce .val() into a number for the comparison, 
			// since empty vals will convert to 0 (empty strings) and all minimums are at least 1
			if (numInput.val() > 0) {
				switch (granularity.val()) {
					case "minutes":
						dateTime = new DateTime(1, 1, 1, 0, numInput.val(), 0); 
						break;
					case "hours":
						dateTime = new DateTime(1, 1, 1, numInput.val(), 0, 0); 
						break;
					case "days":
						// the DateTime constructor enforces accurate dates: DateTime(1, 1, 32, 0, 0, 0) throws an error
						// but it converts extra minutes into hours and extra hours into accurate dates just fine,
						// so we just multiply the days by 24 and put them in the hour section
						// this is also why we don't need any maximal bounds checking beyond the max date
						dateTime = new DateTime(1, 1, 1, numInput.val() * 24, 0, 0); 
						break;
					default:
						return this.error("<<relativeInput>> had a bad granularity setting: " + granularity.val());
				}
				// DateTime constructor expects year, month, day, hour, minute, second
				// the minimum timestamp is 1/1/0001 00:00:00, so the minimum input is new DateTime(1, 1, 1, 0, 0, 0)
				State.setVar(varName, dateTime.timeStamp);
			}
		}
		numInput.on("change", function handler() {
			recalculateTimestamp();
			// soft equality, since it could be a number or a string
			if (numInput.val() == 1) {
				minutes.text("Minute");
				hours.text("Hour");
				days.text("Day");
			} else {
				minutes.text("Minutes");
				hours.text("Hours");
				days.text("Days");
			}
		});

		granularity.on("change", function handler() {
		switch (granularity.val()) {
				case "minutes":
					numInput.prop("max", Math.floor(TimeConstants.MAX_DATE.timeStamp / TimeConstants.secondsPerMinute));
					break;
				case "hours":
					numInput.prop("max", Math.floor(TimeConstants.MAX_DATE.timeStamp / TimeConstants.secondsPerHour));
					break;
				case "days":
					numInput.prop("max", Math.floor(TimeConstants.MAX_DATE.timeStamp / TimeConstants.secondsPerDay));
					break;
				default:
					return this.error("<<relativeInput>> had a bad granularity setting: " + granularity.val());
			}
			recalculateTimestamp();
		});

		numInput.appendTo(this.output);
		granularity.appendTo(this.output);
	},
});
