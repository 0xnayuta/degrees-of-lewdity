/** The PC's parasite pregnancy object on $sexStats: the vagina's if the PC has one, otherwise the anus's. */
function getParasiteObject() {
	return V.player.vaginaExist ? V.sexStats.vagina.pregnancy : V.sexStats.anus.pregnancy;
}
window.getParasiteObject = getParasiteObject;

/** Total birth events the PC has had, from both orifices. */
function playerNormalPregnancyTotal() {
	return V.sexStats.vagina.pregnancy.totalBirthEvents + V.sexStats.anus.pregnancy.totalBirthEvents;
}
window.playerNormalPregnancyTotal = playerNormalPregnancyTotal;

/**
 * Belly size from one pregnancy. It is 0 until the pregnancy's progress reaches belly.showFraction,
 * then grows to the term size by the due date. A bigger litter gives a bigger term size.
 *
 * @param {Pregnancy} pregnancy
 * @returns {number} 0 to belly.maxSize
 */
function pregnancyBellySize(pregnancy) {
	const litter = getChildrenOf(pregnancy.pregnancyId).length;
	const termSize = Math.clamp(PregnancyConstants.belly.termBase + litter, 0, PregnancyConstants.belly.maxSize);
	const showAt = PregnancyConstants.belly.showFraction;
	const shown = Math.clamp((pregnancyProgress(pregnancy) - showAt) / (1 - showAt), 0, 1);
	return shown * termSize;
}
window.pregnancyBellySize = pregnancyBellySize;

/**
 * The PC's belly size.
 *
 * @param {boolean} [pregnancyOnly=false] count only pregnancies, leaving out parasites and bloating
 * @returns {number} 0 to belly.maxSize
 */
function playerBellySize(pregnancyOnly = false) {
	let bellySize = V.bellySizeDebug || 0;
	if (!V.statFreeze) {
		for (const orifice of ["vagina", "anus"]) {
			const pregnancy = getActivePregnancy("pc", orifice);
			if (pregnancy && !pregnancy.litterBorn) bellySize += pregnancyBellySize(pregnancy);
		}
		if (!pregnancyOnly) {
			if (V.sexStats.vagina.pregnancy.type === "parasite") bellySize += Math.clamp(V.sexStats.vagina.pregnancy.fetus.length, 0, 4);
			if (V.sexStats.anus.pregnancy.type === "parasite") bellySize += Math.clamp(V.sexStats.anus.pregnancy.fetus.length, 0, 4);
			if (V.daily.bloated) bellySize += Math.clamp(V.daily.bloated, 1, 2);
			if (V.parasite.tummy.name === "urchin") bellySize += 2;
			if (V.parasite.tummy.name === "slime") bellySize -= 2;
		}
	}

	return Math.floor(Math.clamp(bellySize, 0, PregnancyConstants.belly.maxSize));
}
window.playerBellySize = playerBellySize;

function playerBellyVisible(pregnancyOnly = false) {
	const visibility = PregnancyConstants.belly.visibility;
	const size = playerBellySize(pregnancyOnly);
	if (size < visibility.bareMin) return false;
	if (
		size < visibility.clothedMin &&
		((V.worn.upper.name !== "naked" && !V.worn.upper.type.includes("bellyShow")) || !V.worn.over_upper.type.includes("naked"))
	)
		return false;
	if (
		size < visibility.hiddenMin &&
		(V.worn.upper.type.includes("bellyHide") || V.worn.lower.type.includes("bellyHide") || !V.worn.over_upper.type.includes("naked"))
	)
		return false;

	return true;
}
window.playerBellyVisible = playerBellyVisible;

function npcBellySize(npc) {
	let bellySize = 0;
	for (const pregnancy of getActivePregnancies(npc)) bellySize += pregnancyBellySize(pregnancy);

	return Math.floor(Math.clamp(bellySize, 0, PregnancyConstants.belly.maxSize));
}
window.npcBellySize = npcBellySize;

/**
 * Whether an NPC's belly is big enough to see. Clothing is not checked.
 *
 * @param {string} npc the NPC's name
 * @returns {boolean}
 */
function npcBellyVisible(npc) {
	return npcBellySize(npc) >= PregnancyConstants.belly.visibility.bareMin;
}
window.npcBellyVisible = npcBellyVisible;

function npcPregnancyProgress(npc) {
	return pregnancyProgress(getActivePregnancies(npc)[0]);
}
window.npcPregnancyProgress = npcPregnancyProgress;

function npcIsPregnant(npc) {
	return getActivePregnancies(npc).length > 0;
}
window.npcIsPregnant = npcIsPregnant;

/**
 * Whether the NPC's water has broken.
 *
 * @param {string} npc the NPC's name
 * @returns {boolean}
 */
function npcPregnancyEnding(npc) {
	const pregnancy = getLabouringPregnancy(npc);
	return !!(pregnancy && pregnancy.waterBreaking);
}
window.npcPregnancyEnding = npcPregnancyEnding;

/**
 * Whether a bird NPC has an egg ready to lay, and whether it is fertilised.
 *
 * "fertilised": a hawk pregnancy whose water has broken or that has reached its due date.
 *
 * "unfertilised": not pregnant, and two cycle days past cycleDangerousDay.
 *
 * undefined: no egg, or egg laying is turned off.
 *
 * @param {string} npc the NPC's name
 * @returns {"fertilised"|"unfertilised"|undefined}
 */
function birdEggsReady(npc) {
	if (V.settings.playerPregnancyEggLayingEnabled === false) return undefined;
	const pregnancy = C.npc[npc].pregnancy;
	if (getActivePregnancies(npc).some(p => childBaseSpecies(p.donorSpecies) === "hawk" && (p.waterBreaking || Time.date.timeStamp >= getDueDate(p))))
		return "fertilised";
	if (C.npc[npc].vagina === "none") return undefined;
	if (npc === "Great Hawk" && V.daily.hawkUnfertilisedEggs) return undefined;
	if (!npcIsPregnant(npc) && pregnancy.cycleDay === pregnancy.cycleDangerousDay + 2) return "unfertilised";
}
window.birdEggsReady = birdEggsReady;

/**
 * The PC's active pregnancies in the body they are in right now (can be inside other bodies during stories/paintings).
 *
 * @returns {Pregnancy[]}
 */
function currentBodyPregnancies() {
	const firstOfThisVision = V.statFreeze && V.frozenValues ? (V.frozenValues.pregnancies ?? V.pregnancies).length : 0;
	return getActivePregnancies("pc").filter(p => p.pregnancyId >= firstOfThisVision);
}
window.currentBodyPregnancies = currentBodyPregnancies;

/**
 * Whether the PC is pregnant in the body they are in right now. See currentBodyPregnancies.
 *
 * @returns {boolean}
 */
function playerIsPregnant() {
	return currentBodyPregnancies().length > 0;
}
window.playerIsPregnant = playerIsPregnant;

/**
 * Progress of the PC's furthest along active pregnancy, from 0 to 1.
 *
 * @returns {number|undefined} undefined when the PC has no active pregnancy
 */
function playerPregnancyProgress() {
	const active = getActivePregnancies("pc");
	if (!active.length) return undefined;
	return Math.max(...active.map(pregnancyProgress));
}
window.playerPregnancyProgress = playerPregnancyProgress;

/**
 * Whether one of the PC's pregnancies has had its water break and the birth has not started yet.
 *
 * @returns {boolean} false while stats are frozen
 */
function isPregnancyEnding() {
	if (V.statFreeze) return false;
	return getActivePregnancies("pc").some(pregnancy => pregnancy.waterBreaking && !pregnancy.birthInProgress);
}
window.isPregnancyEnding = isPregnancyEnding;

/**
 * The base species of the PC's labouring pregnancy, or of the first active one if none is labouring.
 *
 * @returns {ChildSpecies|undefined} undefined when the PC is not pregnant
 */
function playerNormalPregnancyType() {
	const pregnancy = getLabouringPregnancy("pc");
	return pregnancy ? childBaseSpecies(pregnancy.donorSpecies) : undefined;
}
window.playerNormalPregnancyType = playerNormalPregnancyType;

/**
 * Shared setup for the daily and waking pregnancy symptom events.
 *
 * @returns {{pregnancy: Pregnancy|undefined, menstruation: object, pills: object, pregnancyStage: number|undefined, normalPregnancyEvents: boolean}|undefined}
 *   undefined when no symptom event should fire
 */
function pregnancyEventReadings() {
	if (V.statFreeze) return undefined;
	if (!V.player.vaginaExist && playerNormalPregnancyTotal() === 0 && !playerIsPregnant()) return undefined;
	const pregnancy = getPlayerPregnancy();
	if (!pregnancy && (V.sexStats.vagina.pregnancy.type === "parasite" || V.sexStats.anus.pregnancy.type === "parasite")) return undefined;
	return {
		pregnancy,
		menstruation: V.sexStats.vagina.menstruation,
		pills: V.sexStats.pills,
		pregnancyStage: pregnancy ? pregnancyProgress(pregnancy) : undefined,
		normalPregnancyEvents: pregnancy ? childBaseSpecies(pregnancy.donorSpecies) !== "hawk" : false,
	};
}

/**
 * @typedef {"lightHeaded"|"dizzy"|"mildNausea"|"nausea"|"headache"|"sensitiveBreasts"|"dryheaving"|"tired"|"crying"|"angry"|"meatCraving"|"foodCraving"|"lightBabyKick"|"babyKick"|"babyMovement"|"babyHiccup"|"earlyContractions"|"cramping"|"bloated"|"nothing"} PregnancySymptom
 */

/**
 * Rolls one pregnancy symptom for a chosen event category.
 *
 * @param {"discomfortModerate"|"discomfortSevere"|"midPregnancy"|"nearBirth"|"nearBirthEvent"|"periodIssues"|undefined} effectName the event category to roll within
 * @param {Pregnancy|undefined} pregnancy the pregnancy the symptom is for
 * @returns {PregnancySymptom|undefined} the rolled symptom, or undefined without a category
 */
function pregnancyEventSymptom(effectName, pregnancy) {
	switch (effectName) {
		case "discomfortModerate":
			return weightedRandom(["lightHeaded", 1], ["dizzy", 3], ["mildNausea", 3], ["nausea", 1], ["headache", 1]);
		case "discomfortSevere":
			return weightedRandom(
				["lightHeaded", 1],
				["dizzy", 1],
				["sensitiveBreasts", 1],
				["mildNausea", 1],
				["headache", 1],
				["nausea", 4],
				["dryheaving", 3]
			);
		case "midPregnancy":
			return weightedRandom(
				["tired", 1],
				[V.submissive >= 1000 ? "crying" : "angry", 1],
				[childBaseSpecies(pregnancy.donorSpecies) === "wolf" ? "meatCraving" : "foodCraving", 1]
			);
		case "nearBirth":
			return weightedRandom(["lightBabyKick", 1], ["babyKick", 1], ["babyMovement", 1], ["babyHiccup", 1]);
		case "nearBirthEvent":
			return weightedRandom(["lightBabyKick", 1], ["babyKick", 1], ["babyMovement", 1], ["babyHiccup", 1], ["earlyContractions", 2]);
		case "periodIssues":
			return weightedRandom(["nothing", 1], ["cramping", 1], ["bloated", 1], ["lightHeaded", 1], ["mildNausea", 1], ["nausea", 1]);
	}
	return undefined;
}

/**
 * Rolls the pregnancy event or symptom the PC wakes up with. A morning sickness symptom resets
 * $pregnancyStats.morningSicknessWaking to 0.
 *
 * @returns {"bellySize"|"missedPeriod"|"clothesRemoval"|"eggLaying"|PregnancySymptom|undefined} undefined when nothing happens
 */
function wakingPregnancyEvent() {
	const readings = pregnancyEventReadings();
	if (!readings) return undefined;
	const { pregnancy, menstruation, pills, pregnancyStage, normalPregnancyEvents } = readings;

	const rng = random(0, 100);
	let wakingEffects;

	if (playerBellySize(true) >= 8 && !playerAwareTheyArePregnant()) {
		return "bellySize";
	} else if (
		V.settings.fertilityCycleEnabled === true &&
		V.player.vaginaExist &&
		!menstruation.awareOfPeriodDelay &&
		V.awareness >= 200 &&
		!playerAwareTheyArePregnant() &&
		pregnancyStage !== undefined &&
		between(menstruation.currentDay, 3, 5) &&
		(random(0, 100) >= 105 - V.sciencetrait * 5 || playerNormalPregnancyTotal() >= 3)
	) {
		return "missedPeriod";
	} else if (
		playerBellySize() >= 12 &&
		["genitals", "under_upper", "upper", "under_lower", "lower"].find(slot => V.worn[slot].type.includes("constricting"))
	) {
		return "clothesRemoval";
	} else if (
		V.settings.playerPregnancyEggLayingEnabled === true &&
		((playerNormalPregnancyType() === "hawk" && pregnancyProgress(getLabouringPregnancy("pc")) >= 1) ||
			(!playerIsPregnant() && !birdConceptionPending() && V.harpyEggs?.daysTillLaying <= 0))
	) {
		return "eggLaying";
	} else if (normalPregnancyEvents && between(pregnancyStage, 0.9, 1)) {
		wakingEffects = "nearBirthEvent";
	} else if (normalPregnancyEvents && between(pregnancyStage, 0.7, 0.9)) {
		wakingEffects = "nearBirth";
	} else if (normalPregnancyEvents && between(pregnancyStage, 0.4, 0.7) && rng > 50) {
		wakingEffects = "midPregnancy";
	} else if (normalPregnancyEvents && V.pregnancyStats.morningSicknessWaking >= 2) {
		wakingEffects = "discomfortSevere";
		V.pregnancyStats.morningSicknessWaking = 0;
	} else if (normalPregnancyEvents && V.pregnancyStats.morningSicknessWaking >= 1 && rng >= 50) {
		wakingEffects = "discomfortModerate";
		V.pregnancyStats.morningSicknessWaking = 0;
	} else if (normalPregnancyEvents && (pills.pills.contraceptive.doseTaken >= 2 || pills.pills["fertility booster"].doseTaken >= 2) && rng >= 50) {
		wakingEffects = "discomfortModerate";
	} else if ((pills.pills.contraceptive.doseTaken >= 1 || pills.pills["fertility booster"].doseTaken >= 1) && rng >= 75) {
		wakingEffects = "discomfortMild";
	}
	if (wakingEffects === "discomfortMild") {
		return weightedRandom(["nothing", 2], ["lightHeaded", 2], ["dizzy", 3], ["mildNausea", 1]);
	}
	return pregnancyEventSymptom(wakingEffects, pregnancy);
}
window.wakingPregnancyEvent = wakingPregnancyEvent;

/**
 * Rolls a pregnancy or period symptom. $daily.pregnancyEvent raises the roll. A morning sickness
 * symptom lowers $pregnancyStats.morningSicknessGeneral by 1.
 *
 * @returns {PregnancySymptom|undefined} undefined when nothing happens
 */
function dailyPregnancyEvent() {
	const readings = pregnancyEventReadings();
	if (!readings) return undefined;
	const { pregnancy, menstruation, pills, pregnancyStage, normalPregnancyEvents } = readings;

	const rng = random(0, 100) + (V.daily.pregnancyEvent || 0);
	let dailyEffects;

	if (normalPregnancyEvents && ((between(pregnancyStage, 0.9, 0.95) && rng > 80) || (between(pregnancyStage, 0.95, 1) && rng >= 75))) {
		dailyEffects = "nearBirthEvent";
	} else if (normalPregnancyEvents && ((between(pregnancyStage, 0.7, 0.8) && rng > 85) || (between(pregnancyStage, 0.8, 0.9) && rng >= 80))) {
		dailyEffects = "nearBirth";
	} else if (normalPregnancyEvents && ((between(pregnancyStage, 0.4, 0.5) && rng > 90) || (between(pregnancyStage, 0.5, 0.7) && rng >= 85))) {
		dailyEffects = "midPregnancy";
	} else if (normalPregnancyEvents && V.pregnancyStats.morningSicknessGeneral >= 2 && rng >= 85) {
		dailyEffects = "discomfortSevere";
		V.pregnancyStats.morningSicknessGeneral--;
	} else if (normalPregnancyEvents && V.pregnancyStats.morningSicknessGeneral >= 1 && rng >= 90) {
		dailyEffects = "discomfortModerate";
		V.pregnancyStats.morningSicknessGeneral--;
	} else if (normalPregnancyEvents && (pills.pills.contraceptive.doseTaken >= 2 || pills.pills["fertility booster"].doseTaken >= 2) && rng >= 90) {
		dailyEffects = "discomfortModerate";
	} else if ((pills.pills.contraceptive.doseTaken >= 1 || pills.pills["fertility booster"].doseTaken >= 1) && rng >= 95) {
		dailyEffects = "discomfortMild";
	} else if (
		V.settings.fertilityCycleEnabled === true &&
		menstruation.currentState === "normal" &&
		(menstruation.currentDay < 3 || (menstruation.currentDay >= menstruation.currentDaysMax - 1 && rng >= 80)) &&
		menstruation.periodEnabled
	) {
		dailyEffects = "periodIssues";
	}

	if (dailyEffects === "discomfortMild") {
		return weightedRandom(["nothing", 1], ["lightHeaded", 2], ["dizzy", 4], ["mildNausea", 1]);
	}
	return pregnancyEventSymptom(dailyEffects, pregnancy);
}
window.dailyPregnancyEvent = dailyPregnancyEvent;

/**
 * A parent's name as it reads in a sentence: "the Black Wolf", "yourself" for the PC, "a" or "an"
 * before a lowercase name, and other names as they are.
 *
 * @param {string} name "pc", or an NPC's name
 * @param {boolean} [caps=false] capitalise the first word
 * @returns {string}
 */
function pregnancyNameCorrection(name, caps = false) {
	switch (name) {
		case "Black Wolf":
		case "Great Hawk":
		case "Night Monster":
		case "Ivory Wraith":
		case "cum bucket":
			return (caps ? "The " : "the ") + name;
		case "pc":
			return caps ? "Yourself" : "yourself";
	}
	if (name[0] !== name[0].toLowerCase()) return name;
	const article = ["a", "e", "i", "o", "u"].includes(name[0]) ? "an" : "a";
	return (caps ? article.toUpperFirst() : article) + " " + name;
}
window.pregnancyNameCorrection = pregnancyNameCorrection;

/**
 * How fertile the PC is over the days a load landing on a day of a cycle could live, after birth
 * control and fertility boosters. Each day counts by the chance the load is still alive on it.
 * It leaves out the base pregnancy chance setting.
 *
 * Days past the end of the cycle wrap around using the same cycle's length, because the cycle after
 * it isn't rolled until it starts.
 *
 * @param {Menstruation} menstruation the cycle to read: its stages, fertileLeadDays and currentDaysMax
 * @param {number} cycleDay the day of that cycle the load lands on
 * @param {number} daysFromNow how many real days from today that is, to read that day's pill doses
 * @returns {number} 0 is no chance, 1 is a load spending its whole life at ovulation with no pills.
 *   Fertility boosters can push it past 1.
 */
function cycleExposure(menstruation, cycleDay, daysFromNow) {
	let sum = 0;
	let weight = 0;
	for (let d = 0; d < PregnancyConstants.loadLifespanDays.max; d++) {
		const alive = loadSurvival(d);
		const ahead = daysFromNow + d;
		let day = cycleDay + d;
		while (day >= menstruation.currentDaysMax) day -= menstruation.currentDaysMax;
		sum += alive * fertilityOnCycleDay(menstruation, day, ahead) * contraceptiveGuard(ahead) * fertilityBoost(ahead);
		weight += alive;
	}
	return sum / weight;
}

/**
 * cycleExposure for a load landing in the PC's current cycle. The fertility meter and
 * menstrualFertileDates read this.
 *
 * @param {number} [daysFromNow=0] read the load as landing this many days from today
 * @returns {number} see cycleExposure
 */
function menstrualExposure(daysFromNow = 0) {
	const menstruation = V.sexStats.vagina.menstruation;
	return cycleExposure(menstruation, menstruation.currentDay + daysFromNow, daysFromNow);
}
window.menstrualExposure = menstrualExposure;

/**
 * What the fertility meter reads: today's exposure, once everything that would stop the conception
 * roll outright has been ruled out.
 *
 * @returns {number} 0 for no chance at all. Fertility boosters can push it past 1.
 */
function menstrualOutlook() {
	if (!readyToCarry()) return 0;
	if (V.settings.basePlayerPregnancyChance <= 0) return 0;
	// Reads 0 only when every orifice the PC can carry in has parasites.
	const orifices = [V.player.vaginaExist && "vagina", playerCanCarryAnally() && "anus"].filter(Boolean);
	if (orifices.every(orifice => orificeHasParasites(orifice))) return 0;
	return menstrualExposure(0);
}
window.menstrualOutlook = menstrualOutlook;

/**
 * The character-screen fertility meter.
 *
 * @returns {0|1|2|3|4} an index into riskMeterLabels: 0 very safe, 4 dangerous
 */
function playerPregnancyRisk() {
	if (V.settings.playerPregnancyHumanEnabled === false && V.settings.playerPregnancyBeastEnabled === false) return 0;
	if (!V.player.vaginaExist && !playerCanCarryAnally()) return 0;
	const outlook = menstrualOutlook();
	// findIndex gives -1 when outlook is NaN, and the result is used as an index into riskMeterLabels.
	return Math.max(
		0,
		PregnancyConstants.riskMeterLabels.findIndex(label => outlook <= label.upTo)
	);
}
window.playerPregnancyRisk = playerPregnancyRisk;

/**
 * The PC's risky and dangerous days this cycle as calendar dates, in the date format from the
 * options, for the stats screen.
 *
 * Only this cycle is shown, because restartMenstruationCycle rolls the next cycle's length and
 * stages when it starts. When no day left in this cycle is risky, passed is true, risky and
 * dangerous are undefined, and nextWindow gives how many days away the next window could be, as a range.
 * nextWindow is also undefined when no day of the next cycle would be risky, for example while pregnant.
 *
 * A window that has already started is reported from today. dangerous is undefined when no day left
 * is dangerous, even if some are still risky.
 *
 * @returns {{risky: string|undefined, dangerous: string|undefined, today: string, todayColour: string, passed: boolean, nextWindow: {min: number, max: number}|undefined}}
 *   today and todayColour are the text and colour of today's riskMeterLabels entry
 */
function menstrualFertileDates() {
	const menstruation = V.sexStats.vagina.menstruation;
	const labels = PregnancyConstants.riskMeterLabels;
	const riskyBound = labels[labels.findIndex(l => l.text === "risky") - 1].upTo;
	const dangerousBound = labels[labels.length - 2].upTo;
	const dateIn = days => {
		const d = new DateTime(Time.date).addDays(days);
		return new Date(d.year, d.month - 1, d.day).toLocaleDateString(returnTimeFormat(), { day: "2-digit", month: "2-digit" });
	};
	const daysLeft = Math.ceil(menstruation.currentDaysMax - menstruation.currentDay);
	const exposure = [];
	for (let day = 0; day <= daysLeft; day++) exposure.push(menstrualExposure(day));
	const spanOver = bound => {
		const first = exposure.findIndex(e => e > bound);
		if (first === -1) return undefined;
		let last = first;
		while (last + 1 < exposure.length && exposure[last + 1] > bound) last++;
		return first === last ? dateIn(first) : `${dateIn(first)} to ${dateIn(last)}`;
	};
	const risky = spanOver(riskyBound);
	const passed = risky === undefined;
	return {
		passed,
		risky,
		dangerous: passed ? undefined : spanOver(dangerousBound),
		nextWindow: passed ? menstrualNextWindowIn(riskyBound) : undefined,
		today: labels[playerPregnancyRisk()].text,
		todayColour: labels[playerPregnancyRisk()].colour,
	};
}
window.menstrualFertileDates = menstrualFertileDates;

/**
 * How many days away the next cycle's first risky day could be, as a range.
 *
 * restartMenstruationCycle rolls the next cycle's length from baseDays/baseDaysRng and its lead days
 * from fertileLeadDaysMin/Max, and rollMenstrualStages places ovulation at a fixed fraction of the
 * length and makes it last half a day or a day. This reads cycleExposure on the earliest and the
 * latest cycle those rolls can give.
 *
 * @param {number} riskyBound the exposure a day has to be over to count as risky
 * @returns {{min: number, max: number}|undefined} real days from today. undefined when no day of the next cycle would be risky
 */
function menstrualNextWindowIn(riskyBound) {
	const cycle = PregnancyConstants.menstrualCycle;
	const menstruation = V.sexStats.vagina.menstruation;
	const daysUntilNextCycle = menstruation.currentDaysMax - menstruation.currentDay;
	const firstRiskyDayIn = (length, fertileLeadDays, ovulationDays) => {
		const ovulationStart = Math.round(length * cycle.ovulationStartCycleFraction);
		const nextCycle = { currentDaysMax: length, fertileLeadDays, stages: [0, 0, ovulationStart, ovulationStart + ovulationDays] };
		for (let cycleDay = cycle.cycleRestartDay; cycleDay < length; cycleDay += 1 / cycle.cycleTicksPerDay) {
			const daysFromNow = daysUntilNextCycle + cycleDay - cycle.cycleRestartDay;
			if (cycleExposure(nextCycle, cycleDay, daysFromNow) > riskyBound) return daysFromNow;
		}
		return undefined;
	};
	const soonest = firstRiskyDayIn(menstruation.baseDays, cycle.fertileLeadDaysMax, 1);
	const latest = firstRiskyDayIn(menstruation.baseDays + menstruation.baseDaysRng, cycle.fertileLeadDaysMin, 0.5);
	if (soonest === undefined || latest === undefined) return undefined;
	return { min: Math.round(soonest), max: Math.round(latest) };
}
window.menstrualNextWindowIn = menstrualNextWindowIn;

/**
 * Roll a fresh cycle's phase boundaries from its length.
 *
 * The four values are day markers into the cycle:
 *   [0] cycleStart     always 0, the period begins
 *   [1] menstrualEnd   the period ends
 *   [2] ovulationStart peak fertility opens
 *   [3] ovulationEnd   the fertile window closes, half a day to a day later
 *
 * @param {number} currentDaysMax the cycle's length in days
 * @returns {number[]} always four values: [cycleStart, menstrualEnd, ovulationStart, ovulationEnd]
 */
function rollMenstrualStages(currentDaysMax) {
	const cycle = PregnancyConstants.menstrualCycle;
	const menstrualEnd = random(cycle.periodDaysMin, cycle.periodDaysMax);
	const ovulationStart = Math.round(currentDaysMax * cycle.ovulationStartCycleFraction);
	return [0, menstrualEnd, ovulationStart, ovulationStart + random(1, 2) * 0.5];
}
window.rollMenstrualStages = rollMenstrualStages;

/**
 * The minimum arousal the PC's heat gives, from ear slime, beast transformations and fertility boosters.
 * When ear slime and transformations add nothing, it also sets $pregnancyStats.heatStillEnabled to whether the PC
 * is not pregnant.
 *
 * @returns {number}
 */
function playerHeatMinArousal() {
	if (!V.sexStats || !V.sexStats.pills || (V.statFreeze && !V.statFreezeIgnoreRestrictions)) return 0;
	if (!V.player.vaginaExist && !playerCanCarryAnally()) return 0;
	if (playerIsPregnant() && !V.pregnancyStats.heatStillEnabled) return 0;

	if (V.settings.playerPregnancyHumanEnabled === false && V.settings.playerPregnancyBeastEnabled === false) return 0;

	const pills = V.sexStats.pills.pills;
	const heat = PregnancyConstants.menstrualCycle.heatFertility;
	// Uses the cycle's own curve and not fertilityOnCycleDay, because a fertility booster raises that
	// on every day of the month and would leave a PC with a beast transformation always in heat.
	const fertility = menstrualCycleFertility();
	const tier = fertility >= heat.full ? 2 : fertility >= heat.partial ? 1 : 0;
	let minArousal = 0;

	// The heatStillEnabled check below needs this to be the only thing added to minArousal before it.
	if (V.settings.fertilityCycleEnabled !== false && tier > 0 && pills.contraceptive.doseTaken === 0) {
		if (V.earSlime.growth > 50 && V.earSlime.focus === "pregnancy" && !V.earSlime.defyCooldown) {
			minArousal += Math.clamp(V.earSlime.growth, 0, 200) * 5 * tier;
		}
		if (V.wolfgirl >= 2) minArousal += Math.clamp(V.wolfbuild, 0, 100) * 10 * tier;
		if (V.cat >= 2) minArousal += Math.clamp(V.catbuild, 0, 100) * 10 * tier;
		if (V.cow >= 2) minArousal += Math.clamp(V.cowbuild, 0, 100) * 10 * tier;
		if (V.fox >= 2) minArousal += Math.clamp(V.foxbuild, 0, 100) * 10 * tier;
	}
	if (minArousal === 0) V.pregnancyStats.heatStillEnabled = !playerIsPregnant();

	if (pills["fertility booster"].doseTaken > 2) {
		minArousal += 500;
	}

	return minArousal;
}
window.playerHeatMinArousal = playerHeatMinArousal;

function playerRutMinArousal() {
	if (!V.player.penisExist || V.player.penissize < 1 || !V.sexStats || !V.sexStats.pills || (V.statFreeze && !V.statFreezeIgnoreRestrictions)) return 0;

	const pills = V.sexStats.pills.pills;
	let minArousal = 0;

	if (pills.contraceptive.doseTaken === 0 && V.player.beastRut !== undefined && V.player.beastRut <= 1) {
		if (V.earSlime.growth > 50 && V.earSlime.focus === "impregnation" && !V.earSlime.defyCooldown) {
			minArousal += Math.clamp(V.earSlime.growth, 0, 200) * 5;
		}
		if (V.wolfgirl >= 2) minArousal += Math.clamp(V.wolfbuild, 0, 100) * 10;
		if (V.cat >= 2) minArousal += Math.clamp(V.catbuild, 0, 100) * 10;
		if (V.cow >= 2) minArousal += Math.clamp(V.cowbuild, 0, 100) * 10;
		if (V.fox >= 2) minArousal += Math.clamp(V.foxbuild, 0, 100) * 10;
	}
	if (pills["fertility booster"].doseTaken > 2) {
		minArousal += 500;
	}

	return minArousal;
}
window.playerRutMinArousal = playerRutMinArousal;

function playerAwareTheyCanBePregnant() {
	return (
		V.player.vaginaExist ||
		(playerCanCarryAnally() && (V.settings.analPregnancy === "always" || V.sexStats.anus.pregnancy.totalBirthEvents >= 1)) ||
		playerAwareTheyArePregnant()
	);
}
window.playerAwareTheyCanBePregnant = playerAwareTheyCanBePregnant;

/**
 * Whether the PC knows about a pregnancy in the body they are in right now.
 *
 * @returns {boolean}
 */
function playerAwareTheyArePregnant() {
	return currentBodyPregnancies().some(p => knowsPregnancy(p.pregnancyId, "pc"));
}
window.playerAwareTheyArePregnant = playerAwareTheyArePregnant;

/**
 * How the PC found out about their pregnancy. Reads the vaginal pregnancy first, then the anal one.
 *
 * @returns {"mirror"|"museum"|"pharmacy"|"pregnancyTest"|"temple"|"wakingUp"|null} null when the PC is not pregnant or no source is recorded
 */
function playerLearnedPregnancyFrom() {
	const pregnancy = getPlayerPregnancy();
	return pregnancy ? pregnancy.playerLearnedFrom : null;
}
window.playerLearnedPregnancyFrom = playerLearnedPregnancyFrom;

/**
 * Records how the PC found out about each of their active pregnancies, and marks the PC as knowing about them.
 *
 * @param {"mirror"|"museum"|"pharmacy"|"pregnancyTest"|"temple"|"wakingUp"} source
 */
function setPlayerLearnedPregnancyFrom(source) {
	getActivePregnancies("pc").forEach(pregnancy => setPlayerLearnedFrom(pregnancy.pregnancyId, source));
}
window.setPlayerLearnedPregnancyFrom = setPlayerLearnedPregnancyFrom;

/**
 * Whether the PC knows about the children in this pregnancy. Checks the first child.
 *
 * @param {Pregnancy} pregnancy
 * @returns {boolean}
 */
function playerKnowsLitterDetails(pregnancy) {
	const litter = getChildrenOf(pregnancy.pregnancyId);
	return litter.length > 0 && knowsChild(litter[0].childId, "pc");
}
window.playerKnowsLitterDetails = playerKnowsLitterDetails;

/**
 * Whether the PC knows the litter's species: they know about the children, or every possible donor
 * has the same base species.
 *
 * @param {Pregnancy} pregnancy
 * @returns {boolean}
 */
function playerKnowsLitterSpecies(pregnancy) {
	if (playerKnowsLitterDetails(pregnancy)) return true;
	const donors = pregnancy.possibleDonors;
	return donors.length > 0 && donors.every(d => childBaseSpecies(d.species) === childBaseSpecies(donors[0].species));
}
window.playerKnowsLitterSpecies = playerKnowsLitterSpecies;

function playerAwareTheyAreInHeat() {
	return playerHeatMinArousal() > 0 && playerAwareTheyCanBePregnant();
}
window.playerAwareTheyAreInHeat = playerAwareTheyAreInHeat;

/**
 * Whole days until the pregnancy's due date, rounded down. Negative once it is overdue.
 *
 * @param {Pregnancy} pregnancy
 * @returns {number}
 */
function pregnancyDaysEta(pregnancy) {
	return Math.floor((getDueDate(pregnancy) - Time.date.timeStamp) / TimeConstants.secondsPerDay);
}
window.pregnancyDaysEta = pregnancyDaysEta;

/**
 * Whether whoToCheck knows about a pregnancy the carrier is currently carrying.
 * For one specific pregnancy, use knowsPregnancy.
 *
 * @param {string} carrier "pc", or an NPC's name
 * @param {string} whoToCheck who might know: "pc", or an NPC's name
 * @returns {boolean}
 */
function knowsAboutPregnancy(carrier, whoToCheck) {
	return getActivePregnancies(carrier).some(p => knowsPregnancy(p.pregnancyId, whoToCheck));
}
window.knowsAboutPregnancy = knowsAboutPregnancy;

/**
 * Queues a BabyIntro for introFor, unless one for the same birth is queued already.
 *
 * @param {string} introFor who the introduction is for: "pc", or an NPC's name
 * @param {number} pregnancyId the birth to introduce
 * @param {string} [description] for carriers who are not named NPCs ("stranger")
 */
function addBabyIntro(introFor, pregnancyId, description) {
	if (!V.babyIntros) V.babyIntros = {};
	if (!V.babyIntros[introFor]) V.babyIntros[introFor] = [];
	if (V.babyIntros[introFor].some(intro => intro.birthId === pregnancyId)) return;
	const intro = { birthId: pregnancyId, mother: V.pregnancies[pregnancyId].carrier, children: getChildrenOf(pregnancyId).length };
	if (description) intro.description = description;
	V.babyIntros[introFor].push(intro);
}
window.addBabyIntro = addBabyIntro;

/**
 * Marks whoNowKnows aware of every pregnancy the carrier is currently carrying. Does nothing while
 * stats are frozen. For one specific pregnancy, use setKnowsPregnancy.
 *
 * For example `<<setKnowsAboutPregnancy "pc" "Whitney">>` makes Whitney aware of the PC's current pregnancy.
 *
 * @param {string} carrier whose pregnancy it is: "pc", or an NPC's name
 * @param {string} whoNowKnows who now knows: "pc", or an NPC's name
 */
function setKnowsAboutPregnancy(carrier, whoNowKnows) {
	if (V.statFreeze) return;
	for (const pregnancy of getActivePregnancies(carrier)) {
		if (!knowsPregnancy(pregnancy.pregnancyId, whoNowKnows)) setKnowsPregnancy(pregnancy.pregnancyId, whoNowKnows);
	}
}
DefineMacro("setKnowsAboutPregnancy", setKnowsAboutPregnancy);

/**
 * When the PC's pregnancy belly can be seen, marks every NPC in $NPCList that has a fullDescription
 * as knowing about the PC's pregnancy.
 */
function setKnowsAboutPregnancyCurrentLoaded() {
	if (V.statFreeze) return;
	if (playerIsPregnant() && playerBellyVisible(true)) {
		V.NPCList.forEach(npc => {
			if (npc.fullDescription) setKnowsAboutPregnancy("pc", npc.fullDescription);
		});
	}
}
DefineMacro("setKnowsAboutPregnancyCurrentLoaded", setKnowsAboutPregnancyCurrentLoaded);

/**
 * How many of the parent's births whoToCheck knows about.
 * A birth counts once regardless of litter size.
 *
 * @param {string} parent the parent (carrier or donor) whose births to count
 * @param {string} whoToCheck who might know: "pc", or an NPC's name
 * @param {string} [location] only count births whose first child is at this location
 * @returns {number}
 */
function knowsAboutPregnancyTotal(parent, whoToCheck, location) {
	const bornByPregnancy = new Map();
	for (const child of getBornChildren()) {
		if (!bornByPregnancy.has(child.pregnancyId)) bornByPregnancy.set(child.pregnancyId, []);
		bornByPregnancy.get(child.pregnancyId).push(child);
	}
	return V.pregnancies.reduce((count, p) => {
		if (p.carrier !== parent && p.donor !== parent) return count;
		if (!knowsPregnancy(p.pregnancyId, whoToCheck)) return count;
		const litter = bornByPregnancy.get(p.pregnancyId);
		if (!litter) return count;
		if (location && litter[0].development.location !== location) return count;
		return count + 1;
	}, 0);
}
window.knowsAboutPregnancyTotal = knowsAboutPregnancyTotal;

/**
 * Whether whoToCheck knows about any pregnancy the carrier has ever carried, active or delivered.
 *
 * @param {string} carrier "pc", or an NPC's name
 * @param {string} whoToCheck who might know: "pc", or an NPC's name
 * @returns {boolean}
 */
function knowsAboutAnyPregnancy(carrier, whoToCheck) {
	return V.pregnancies.some(p => p.carrier === carrier && knowsPregnancy(p.pregnancyId, whoToCheck));
}
window.knowsAboutAnyPregnancy = knowsAboutAnyPregnancy;

/**
 * How many of the parent's born children come from pregnancies whoToCheck knows about.
 *
 * @param {string} parent the parent (carrier or donor) whose children to count
 * @param {string} whoToCheck who might know: "pc", or an NPC's name
 * @param {string} [location] only count children at this location
 * @returns {number}
 */
function knowsAboutChildrenTotal(parent, whoToCheck, location) {
	return getBornChildren().reduce((count, child) => {
		const pregnancy = getPregnancyOf(child);
		if (pregnancy.carrier !== parent && pregnancy.donor !== parent) return count;
		if (!knowsPregnancy(child.pregnancyId, whoToCheck)) return count;
		if (location && child.development.location !== location) return count;
		return count + 1;
	}, 0);
}
window.knowsAboutChildrenTotal = knowsAboutChildrenTotal;

/**
 * Every born child carrier carried and donor sired, across all their shared pregnancies.
 * Directional. A self-pregnancy never counts.
 *
 * @param {string} carrier who carried, "pc" or an NPC name
 * @param {string} donor who sired, "pc" or an NPC name
 * @returns {Child[]}
 */
function childrenFromParents(carrier, donor) {
	return getBornChildren().filter(child => {
		const pregnancy = getPregnancyOf(child);
		return pregnancy.carrier !== pregnancy.donor && pregnancy.carrier === carrier && pregnancy.donor === donor;
	});
}

/**
 * Born children two people share, whichever of them carried.
 *
 * @param {string} parent1 "pc", or an NPC's name
 * @param {string} parent2 "pc", or an NPC's name
 * @returns {Child[]}
 */
function childrenBetweenParents(parent1, parent2) {
	return [...childrenFromParents(parent1, parent2), ...childrenFromParents(parent2, parent1)];
}
window.childrenBetweenParents = childrenBetweenParents;

/**
 * How many born children two people share, regardless of who carried.
 *
 * @param {string} parent1 "pc", or an NPC's name
 * @param {string} parent2 "pc", or an NPC's name
 * @returns {number}
 */
function childrenCountBetweenParents(parent1, parent2) {
	return childrenBetweenParents(parent1, parent2).length;
}
window.childrenCountBetweenParents = childrenCountBetweenParents;

/**
 * How many pregnancies with born children two people share, regardless of who carried.
 *
 * @param {string} parent1 "pc", or an NPC's name
 * @param {string} parent2 "pc", or an NPC's name
 * @returns {number}
 */
function pregnancyCountBetweenParents(parent1, parent2) {
	return new Set(childrenBetweenParents(parent1, parent2).map(child => child.pregnancyId)).size;
}
window.pregnancyCountBetweenParents = pregnancyCountBetweenParents;

/**
 * How many pregnancies with born children carrier carried that donor sired. Directional.
 *
 * @param {string} carrier who carried
 * @param {string} donor who sired
 * @returns {number}
 */
function pregnancyCountFromParents(carrier, donor) {
	return new Set(childrenFromParents(carrier, donor).map(child => child.pregnancyId)).size;
}
window.pregnancyCountFromParents = pregnancyCountFromParents;

/**
 * Whether the PC has ever conceived a pregnancy with an NPC, active or already delivered.
 *
 * @param {string} name the NPC's name
 * @returns {boolean}
 */
function playerConceivedWith(name) {
	return V.pregnancies.some(p => (p.carrier === "pc" && p.donor === name) || (p.carrier === name && p.donor === "pc"));
}
window.playerConceivedWith = playerConceivedWith;

/**
 * Queues a baby introduction for the pregnancy getLabouringPregnancy picks for the carrier.
 * For one specific pregnancy, use addBabyIntro.
 *
 * @param {string} carrier whose birth it is: "pc", or an NPC's name
 * @param {string} introFor who the introduction is for: "pc", or an NPC's name
 */
function setBabyIntro(carrier, introFor) {
	if (!carrier || !introFor) throw new Error(`setBabyIntro: got carrier "${carrier}" and introFor "${introFor}"`);
	const pregnancy = getLabouringPregnancy(carrier);
	if (pregnancy) addBabyIntro(introFor, pregnancy.pregnancyId);
}
DefineMacro("setBabyIntro", setBabyIntro);
window.setBabyIntro = setBabyIntro;

/**
 * Removes a queued baby introduction for one specific birth.
 *
 * @param {string} introFor who the introduction was for: "pc", or an NPC's name
 * @param {number} pregnancyId the birth whose introduction to remove
 */
function removeBabyIntro(introFor, pregnancyId) {
	if (!V.babyIntros || !V.babyIntros[introFor]) return;
	V.babyIntros[introFor] = V.babyIntros[introFor].filter(intro => intro.birthId !== pregnancyId);
	if (!V.babyIntros[introFor].length) delete V.babyIntros[introFor];
}
DefineMacro("removeBabyIntro", removeBabyIntro);

/**
 * Whether a pregnancy the carrier is currently carrying has been discussed with someone.
 *
 * @param {string} carrier "pc", or an NPC's name
 * @param {string} whoToCheck who might have discussed it: "pc", or an NPC's name
 * @returns {boolean}
 */
function talkedAboutPregnancy(carrier, whoToCheck) {
	return getActivePregnancies(carrier).some(p => hasTalkedAbout(p.pregnancyId, whoToCheck));
}
window.talkedAboutPregnancy = talkedAboutPregnancy;

/**
 * Marks every pregnancy the carrier is currently carrying as discussed with someone. Does nothing
 * unless whoToIncrement is "pc" or a named NPC.
 *
 * @param {string} carrier "pc", or an NPC's name
 * @param {string} whoToIncrement who it was discussed with: "pc", or an NPC's name
 */
function setTalkedAboutPregnancy(carrier, whoToIncrement) {
	if (whoToIncrement !== "pc" && !V.NPCNameList.includes(whoToIncrement)) return;
	getActivePregnancies(carrier).forEach(p => markTalkedAbout(p.pregnancyId, whoToIncrement));
}
DefineMacro("setTalkedAboutPregnancy", setTalkedAboutPregnancy);
