/**
 * Where Robin is right now, based on time, Robin's schedule, Bailey's punishments, and any location override.
 * Also stores the result in `_robin_location` for the passage to read.
 *
 * @returns {RobinLocation|undefined} undefined if the PC hasn't met Robin
 */
function getRobinLocation() {
	if (C.npc.Robin.init !== 1) {
		return;
	} else if (V.robin.locationOverride && V.robin.locationOverride.during.includes(Time.hour)) {
		T.robin_location = V.robin.locationOverride.location;
	} else if (["docks", "landfill", "dinner", "pillory", "mansion", "underground"].includes(V.robin.punishment.current)) {
		T.robin_location = V.robin.punishment.current;
	} else if (!between(Time.hour, 7, 20)) {
		// if hour is 6 or lower, or 21 or higher.
		T.robin_location = "sleep";
	} else if (
		Memories.Gwylan.has("walkedToCafeWithRobin") &&
		V.robin.hurt.daysLeft === 0 &&
		V.daily.robin.inCafe &&
		!between(V.chef_state, 7, 8) &&
		Time.schoolDay &&
		Time.hour === 8 &&
		Time.minute < 50
	) {
		// Disabled for the time being.
		// T.robin_location = "cafe";
	} else if (Time.schoolDay && between(Time.hour, 8, 15)) {
		T.robin_location = "school";
		// Start bathing time half an hour later if Robin has been asked to water the player's garden
		// Robin will only water if crops are planted, will not water in the rain at all, and will not water during snow before the greenhouse is built
	} else if (
		V.robin.orphanage.watersGarden &&
		C.npc.Robin.trauma < 50 &&
		!isRobinTooHurtToSeePc() &&
		Weather.precipitation !== "rain" &&
		(Weather.precipitation !== "snow" || V.alex_greenhouse >= 3) &&
		((Time.hour === 16 && between(Time.minute, 30, 59)) || (Time.hour === 17 && between(Time.minute, 0, 29))) &&
		orphanagePlotsPlanted()
	) {
		if (Time.hour === 16 && between(Time.minute, 30, 59) && !orphanagePlotsWatered()) {
			T.robin_location = "garden";
		} else if (!V.daily.robin.metPcInBath) {
			T.robin_location = "bath";
		} else {
			T.robin_location = "orphanage";
		}
	} else if (Time.hour === 16 && between(Time.minute, 30, 59)) {
		if (!V.daily.robin.metPcInBath) {
			T.robin_location = "bath";
		} else {
			T.robin_location = "orphanage";
		}
	} else if (V.halloween === 1 && between(Time.hour, 16, 18) && Time.monthDay === 31) {
		T.robin_location = "halloween";
	} else if (Time.isWeekEnd() && between(Time.hour, 9, 16) && Weather.precipitation !== "rain" && C.npc.Robin.trauma < 80) {
		T.robin_location = Time.season === "winter" ? "park" : "beach";
	} else if (V.englishPlay === "ongoing" && V.englishPlayDays === 0 && Time.hour >= 17 && Time.hour < 21) {
		T.robin_location = "englishPlay";
	} else {
		T.robin_location = "orphanage";
	}
	return T.robin_location;
}
window.getRobinLocation = getRobinLocation;

/**
 * Keeps Robin at a location during the given hours, instead of where Robin's schedule says.
 * Cleared at midnight in the `<<day>>` widget.
 *
 * @param {string} loc where Robin should be
 * @param {number|number[]} hour the hour(s) the override lasts
 */
function setRobinLocationOverride(loc, hour) {
	const override = {
		location: loc,
		during: [],
	};
	if (Array.isArray(hour)) override.during = hour;
	else override.during = [hour];
	V.robin.locationOverride = override;
}
window.setRobinLocationOverride = setRobinLocationOverride;

/**
 * If Robin will crossdress at the current location. On the `crossdressing` scale `npcClothes` reads 2 for always and 0 for not at all.
 * A Robin with >=40 trauma will not crossdress at all.
 *
 * @param {number} crossdressLevel how comfortable Robin is with crossdressing (`C.npc.Robin.crossdress`)
 * @returns {0|2}
 */
function getRobinCrossdressingStatus(crossdressLevel) {
	if (C.npc.Robin.init !== 1 || C.npc.Robin.trauma >= 40) return 0;
	switch (getRobinLocation()) {
		case "orphanage":
		case "sleep":
			return crossdressLevel >= 2 ? 2 : 0;
		case "park":
		case "beach":
			return crossdressLevel >= 4 ? 2 : 0;
		case "school":
			return crossdressLevel >= 5 ? 2 : 0;
		default:
			return 0;
	}
}
window.getRobinCrossdressingStatus = getRobinCrossdressingStatus;

/**
 * Makes Robin upset with the PC for up to 30 days. Adds the reason to the list Robin is upset about. A hurt that starts after the last one ran out starts a fresh list.
 *
 * @param {number} days how many days to add
 * @param {RobinHurtReason} reason why, make sure to word it like it's after "upset about"
 */
function addRobinHurt(days, reason) {
	if (V.robin.hurt.daysLeft === 0) V.robin.hurt.reasons = [];
	V.robin.hurt.daysLeft = Math.min(V.robin.hurt.daysLeft + days, 30);
	if (!V.robin.hurt.reasons.includes(reason)) V.robin.hurt.reasons.push(reason);
}
window.addRobinHurt = addRobinHurt;

/**
 * Whether Robin is too upset to see the PC: more than 8 days of hurt left.
 *
 * @returns {boolean}
 */
function isRobinTooHurtToSeePc() {
	return V.robin.hurt.daysLeft > 8;
}
window.isRobinTooHurtToSeePc = isRobinTooHurtToSeePc;

/**
 * Ends Robin's hurt and forgets the reasons, for when Robin forgives the PC.
 */
function clearRobinHurt() {
	V.robin.hurt.daysLeft = 0;
	V.robin.hurt.reasons = [];
}
window.clearRobinHurt = clearRobinHurt;
