/*
 * Usage:
 * <<timeInput varname value?>>
 * creates a 2-input time input, returning its values as a timestamp to varname whenever any of the values updates, as long as no inputs are empty. 
 * the timestamp will be between 0 and 86400
 * 
 * optionally pre-fills with provided value as default
 * 
 * must be between TimeConstants.MIN_DATE and TimeConstants.MAX_DATE,
 *
 */
Macro.add("timeInput", {
	tags: null,
	handler() {
		if (this.args.length < 1 || this.args.length > 2) 
			return this.error("<<dateInput>> had bad arguments (expected modifiable variable + optional default). bad args: " + JSON.stringify(this.args));
		
		const varName = this.args[0];
		// the DateTime constructor, when called with a single argument, constructs a DateTime object from a timeStamp
		// the timeStamp is modulo'd by 86400, which is the number of seconds in a day, to ensure we only take the hours/minutes/seconds component
		let dateTime = (this.args.length === 2 && Number.isFinite(this.args[1])) ? new DateTime(this.args[1] % 86400) : undefined;

		// we define all of these elements before adding handlers, so they can reference each other
		let hourInput = $("<input>").attr({
			name: "timeInput" + Util.slugify(varName) + "Hour",
			id: "timeInput" + Util.slugify(varName) + "Hour",
			type: "number",
			min: V.options.timestyle === "ampm" ? 1 : 0, // military time is 00:00-23:59, ampm is 12:00-11:59 (12, 1, 2, ... 11)
			max: V.options.timestyle === "ampm" ? 12 : 23, 
			placeholder: "hh"
		}).addClass("macro-numberbox");
		let minuteInput = $("<input>").attr({
			name: "timeInput" + Util.slugify(varName) + "Minute",
			id: "timeInput" + Util.slugify(varName) + "Minute",
			type: "number",
			min: 0,
			max: 59,
			placeholder: "mm"
		}).addClass("macro-numberbox");
		let ampm = $("<select>").attr({
			name: "timeInput" + Util.slugify(varName) + "AMPM",
			id: "timeInput" + Util.slugify(varName) + "AMPM"
		}).addClass("macro-listbox")
		.append($(`<option value="AM">AM</option>`))
		.append($(`<option value="PM">PM</option>`));

		function recalculateTimestamp() {
			if (minuteInput.val() !== "" && hourInput.val() !== "") {
				// note: DateTime constructor expects year, month, day, hour, minute, second
				let adjustedHour = Number(hourInput.val());
				if (V.options.timestyle === "ampm") {
					if (ampm.val() === "PM" && adjustedHour !== 12) {
						adjustedHour += 12;
					} else if (ampm.val() === "AM" && adjustedHour === 12) {
						adjustedHour = 0;
					}
				}
				// we fill first 3 with ones (as if 1/1/0001), since we just care about the hours and minutes to use them as an offset to a date's timestamp
				dateTime = new DateTime(1, 1, 1, adjustedHour, minuteInput.val(), 0); 
				State.setVar(varName, dateTime.timeStamp);
			}
		}
		function clampAndPad(element, n) {
			if (element.val() !== "") {
				element.val(Math.clamp(element.val(), element.prop("min"), element.prop("max")).toString().padStart(n, "0"));
			}
		}

		hourInput.on("change", function handler() {
			clampAndPad(hourInput, V.options.timestyle === "ampm" ? 1 : 2);
			// if (hourInput.val() !== "")
			// 	hourInput.val(Math.clamp(hourInput.val(), hourInput.prop("min"), hourInput.prop("max")));
			recalculateTimestamp();
		});

		minuteInput.on("change", function handler() {
			clampAndPad(minuteInput, 2);
			recalculateTimestamp();
		});

		ampm.on("change", function handler() {
			recalculateTimestamp();
		});

		// fill with default values, if we were given a default
		if (dateTime !== undefined) {
			let adjustedHour = dateTime.hour;
			if (V.options.timestyle === "ampm") {
				ampm.val(adjustedHour >= 12 ? "PM" : "AM");
				adjustedHour = ((adjustedHour + 11) % 12) + 1;
			}
			hourInput.val(adjustedHour);
			clampAndPad(hourInput, V.options.timestyle === "ampm" ? 1 : 2);
			minuteInput.val(dateTime.minute);
			clampAndPad(minuteInput, 2);
			recalculateTimestamp();
		}

		hourInput.appendTo(this.output);
		// $(`<span>:</span>`).appendTo(this.output);
		minuteInput.appendTo(this.output);
		if (V.options.timestyle === "ampm") {
			ampm.appendTo(this.output);
		} 
	}
});
