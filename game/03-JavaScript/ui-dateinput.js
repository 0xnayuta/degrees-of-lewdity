/*
 * Usage:
 * <<dateInput varname value?>>
 * creates a 3-input date input, returning its values as a timestamp to varname whenever updates
 * 
 * to state variable VARNAME having value VALUE.
 *
 */
Macro.add("dateInput", {
	tags: null,
	handler() {
		if (this.args.length < 1 || this.args.length > 2) 
			return this.error("<<dateInput>> had bad arguments (expected modifiable variable + optional default). bad args: " + JSON.stringify(this.args));

		const varName = this.args[0];
		// the DateTime constructor, when called with a single argument, constructs a DateTime object from a timeStamp
		let dateTime = (this.args.length === 2 && Number.isFinite(this.args[1])) ? new DateTime(this.args[1]) : undefined;
		//const content = this.payload[0].contents;

		// we define all of these elements before adding handlers, so they can reference each other
		let dayInput = $("<input>").attr({
			name: "dateInput" + Util.slugify(varName) + "Day",
			id: "dateInput" + Util.slugify(varName) + "Day",
			type: "number",
			min: 1,
			max: 31, // will change depending on month and year -- e.g. 30 days hath september, february has 28 or 29 days
			placeholder: "dd"
		}).addClass("macro-numberbox");
		let monthInput = $("<input>").attr({
			name: "dateInput" + Util.slugify(varName) + "Month",
			id: "dateInput" + Util.slugify(varName) + "Month",
			type: "number",
			min: 1,
			max: 12,
			placeholder: "mm"
		}).addClass("macro-numberbox");
		let yearInput = $("<input>").attr({
			name: "dateInput" + Util.slugify(varName) + "Year",
			id: "dateInput" + Util.slugify(varName) + "Year",
			type: "number",
			min: TimeConstants.MIN_DATE.year,
			max: TimeConstants.MAX_DATE.year,
			placeholder: "yyyy"
		}).addClass("macro-numberbox");

		// fill with default values, if we were given a default
		if (dateTime !== undefined) {
			dayInput.val(dateTime.day);
			monthInput.val(dateTime.month);
			yearInput.val(dateTime.year);
		}

		function recalculateTimestamp() {
			// we use > 0 to coerce .val() into a number for the comparison, 
			// since empty vals will convert to 0 (empty strings) and all minimums are at least 1
			// (well, i guess it could break if MIN_DATE was changed to be before year 1, but that's probably not going to happen)
			if (dayInput.val() > 0 && monthInput.val() > 0 && yearInput.val() > 0) {
				// note: DateTime constructor expects year, month, day, hour, minute, second
				// we fill last 3 with zeroes (as if midnight), since we just care about the day
				// to coerce the strings returned by .val() into numbers, we multiply them by 1
				dateTime = new DateTime(yearInput.val() * 1, monthInput.val() * 1, dayInput.val() * 1, 0, 0, 0); 
				State.setVar(varName, dateTime.timeStamp);
			}
		}
		function recalculateMaxDays() {
			// this is an if because that's easier to read than a nested ternary
			if (monthInput.val() > 0) {
				/**
				 * reassign the max value of the days input to the number of days in that month:
				 * 
				 * get the number of days in that month via getDaysOfMonthFromYear, which returns an array of 12 months, 
				 * and dereference it to grab the right month.
				 * if yearInput.val() is empty (falsy), we want a leap year to err on the side of a larger max for february,
				 * so we default to 2024 (because it's the most recent leap year :p)
				 * 
				 * monthInput.val() is coerced to a number automatically for dereferencing. wish there was an easy way to have 
				 * jquery just return these as numbers directly instead of strings, but i think there's no way to do that 
				 * without changing something global, and i don't want to cause side effects for anyone else. so, we rely
				 * on javascript's weird type unsafety and just pretend the strings are numbers.
				 * good thing getDaysOfMonthFromYear() returns an array of numbers!
				 */				
				dayInput.prop("max", DateTime.getDaysOfMonthFromYear(yearInput.val() || 2024)[monthInput.val() - 1]);
			} else {
				// if month is empty, reset max days to 31, since that's the highest possible value
				dayInput.prop("max", 31);
			}
			if (dayInput.val() !== "")
				dayInput.val(Math.clamp(dayInput.val(), dayInput.prop("min"), dayInput.prop("max")));
		}

		dayInput.on("change", function handler() {
			if (dayInput.val() !== "")
				dayInput.val(Math.clamp(dayInput.val(), dayInput.prop("min"), dayInput.prop("max")));
			recalculateTimestamp();
		});

		monthInput.on("change", function handler() {
			if (monthInput.val() !== "")
				monthInput.val(Math.clamp(monthInput.val(), monthInput.prop("min"), monthInput.prop("max")));
			recalculateMaxDays();
			recalculateTimestamp();
		});

		yearInput.on("change", function handler() {
			if (yearInput.val() !== "")
				yearInput.val(Math.clamp(yearInput.val(), yearInput.prop("min"), yearInput.prop("max")));
			recalculateMaxDays();
			recalculateTimestamp();
		});

		switch (V.options.dateFormat) {
			case "zh-CN":
				yearInput.appendTo(this.output);
				monthInput.appendTo(this.output);
				dayInput.appendTo(this.output);
				break;
			case "en-US":
				monthInput.appendTo(this.output);
				dayInput.appendTo(this.output);
				yearInput.appendTo(this.output);
				break;
			default: // assume en-GB as fallback, god save the queen
				dayInput.appendTo(this.output);
				monthInput.appendTo(this.output);
				yearInput.appendTo(this.output);
		}
	},
});
