/* eslint-disable no-undef */
// Should a name type for species be setup, say, human/wolf specific names
/**
 * Generates a baby's name from name pools.
 *
 * @param {string} name the child's name
 * @param {"m"|"f"|"h"} gender determines which name pool the name pulls from
 * @param {number} childId the child being named
 * @returns {string} the name, or "Unnamed" if every name is taken
 */
function generateBabyName(name, gender, childId) {
	if (!!name && name !== "Unnamed") {
		return name.replace(/[^a-zA-ZÀ-ÿ\u4e00-\u9fa5 ]+/g, "").substring(0, 30);
	}
	const usedNames = [];
	getBornChildren().forEach(child => {
		if (!usedNames.includes(child.name) && child.childId !== childId && child.name !== "Unnamed") {
			usedNames.push(child.name);
		}
	});
	let names = [];
	switch (gender) {
		case "m":
			// eslint-disable-next-line prettier/prettier
			names = ['Addison','Algernon','Allan','Alpha','Anton','Axel','Bazza','Benton','Bernard','Brand','Brett','Cale','Calvin','Carol','Chuck','Chucky','Clay','Cornelius','Crofton','Darden','Dax','Den','Deven','Digby','Don','Douglas','Driscoll','Duane','Duke','Edmund','Elsdon','Freeman','Gabby','Garland','George','Godfrey','Graeme','Grier','Hammond','Harlan','Hendrix','Herman','Hewie','Hugh','Indiana','Ingram','Jackie','Jasper','Jaxon','Jaycob','Jere','Kamden','Kelcey','Kendall','Kevin','Kian','Kieran','Kirby','Lanny','Lawson','Laz','Leland','Levi','Lindon','Linton','Lionel','Lonny','Lucas','Manley','Maverick','Merlyn','Michael','Monty','Murphy','Nate','Ned','Nowell','Odell','Ollie','Osbert','Otto','Paget','Pip','Quintin','Raymund','Ricky','Robert','Ross','Rudolph','Sammy','Scotty','Stacey','Thad','Theodore','Tommy','Trey','Tyson','Val','Vernon','Willis','Wilmer','Winton','Wisdom'];
			break;
		case "f":
			// eslint-disable-next-line prettier/prettier
			names = ['Adelyn','Alene','Alexa','Aliah','Alyson','Angelica','Annalise','Annora','Azaria','Bessie','Betsy','Bettie','Biddy','Brianne','Camellia','Camille','Camryn','Caroline','Chastity','Chelsea','Chelsey','Cindy','Clematis','Darla','Deb','Debby','Dortha','Eleanora','Eliana','Elsabeth','Elyse','Emerson','Emmeline','Erica','Ettie','Eustacia','Evelyn','Gabrielle','Georgiana','Harper','Harrietta','Haylie','Haze','Hunter','Hyacinth','Indiana','Indie','Jacquetta','Janie','Jannine','Jonquil','Kaelyn','Kam','Khloe','Kolleen','Korrine','Kourtney','Krystine','Lavena','Leeann','Lela','Lesleigh','Lindsie','Lorena','Lucile','Luvinia','Lyn','Lyssa','Madeleine','Marian','Maudie','Maureen','Maxine','Melody','Milani','Misti','Nat','Noelle','Ottoline','Paige','Pauline','Payton','Pearl','Perlie','Petronel','Phebe','Posie','Praise','Rexana','Serena','Sharalyn','Sharla','Shauna','Sky','Sybella','Tracy','Tresha','Trudi','Wallis','Wilda','Yvette'];
			break;
	}
	// eslint-disable-next-line prettier/prettier
	names.pushUnique('Aaren','Addison','Alex','Alpha','Andie','Arden','Ariel','Artie','Ashton','Aston','Aubrey','Beau','Bernie','Bertie','Beverly','Bobbie','Brooklyn','Caelan','Cameron','Carol','Cary','Casey','Channing','Charley','Cherokee','Cheyenne','Coby','Codie','Collyn','Cyan','Dale','Dallas','Dana','Darby','Dee','Derby','Devan','Devin','Emmerson','Emory','Finley','Flannery','Florence','Gabby','Garnet','Garnett','Gray','Hadyn','Harlow','Hollis','Jackie','Jade','Jae','Jaiden','Johnnie','Joyce','Justice','Kam','Kelcey','Kelsey','Leslie','Lindsey','Lorin','Lyric','Maitland','Marley','McKinley','Merlyn','Murphy','Nicky','Oakley','Odell','Pacey','Paget','Peyton','Presley','Rain','Raleigh','Reagan','Regan','Reilly','Remington','Robbie','Rory','Royale','Sage','Sam','Schuyler','Selby','Shae','Shaye','Shelly','Skylar','Sloan','Stacey','Stacy','Tayler','Tommie','Tracey','Tristen','Tristin','Val');
	names.delete(usedNames);

	let result = names[random(0, names.length - 1)];
	if (!result) result = "Unnamed";
	return result;
}
window.generateBabyName = generateBabyName;

/**
 * Creates the player's pregnancy from a donor based on pregnancy settings.
 *
 * @param {string} npc the donor's name
 * @param {string} npcType the donor's species
 * @param {boolean} [donorKnown=false] whether the player knows the donor
 * @param {"vagina"|"anus"} [genital="vagina"] which orifice conceives
 * @param {object[]} [trackedNPCs] multiple donors ({source, type} each) when paternity is uncertain
 * @param {boolean} [awareOf=false] whether the player knows they are pregnant
 * @returns {boolean} true if a pregnancy was created
 */
const playerPregnancy = (npc, npcType, donorKnown = false, genital = "vagina", trackedNPCs, awareOf = false) => {
	if (V.settings.playerPregnancyHumanEnabled === false && npcType === "human") return false; // Human player pregnancy disabled
	if (V.settings.playerPregnancyBeastEnabled === false && npcType !== "human") return false; // Beast player pregnancy disabled
	if (V.settings.playerPregnancyEggLayingEnabled === false && ["hawk", "harpy"].includes(npcType)) return false; // Egg laying player pregnancy disabled

	if (!["human", "wolf", "wolfboy", "wolfgirl", "hawk", "harpy"].includes(npcType)) return false; // an unknown species can't conceive
	const donors = trackedNPCs ? trackedNPCs.map(t => ({ name: t.source, species: t.type })) : [{ name: npc, species: npcType }];
	const pregnancyId = createPregnancy("pc", "human", npc, npcType, donors, Time.date.timeStamp, genital, V.location);
	if (awareOf) setKnowsPregnancy(pregnancyId, "pc"); // this pregnancy only, not every active one
	if (donorKnown) setKnowsDonor(pregnancyId, "pc");
	return true;
};
DefineMacro("playerPregnancy", playerPregnancy);
window.playerPregnancyTest = (npc, npcType, donorKnown, genital, trackedNPCs, awareOf) => {
	if (V.pregnancyTesting) return playerPregnancy(npc, npcType, donorKnown, genital, trackedNPCs, awareOf);
}; // V.pregnancyTesting Check should not be removed, debugging purposes only

/**
 * Twice a day player pregnancy side effects, per orifice. Day counting, morning sickness, and the
 * once per term breast growth and lactation. Parasites are a separate system.
 *
 * @param {"vagina"|"anus"} [genital] which orifice's pregnancy to advance
 */
// eslint-disable-next-line no-unused-vars
function advancePregnancy(genital = "vagina") {
	if (V.statFreeze) return null;
	const pregnancy = getActivePregnancy("pc", genital);
	if (!pregnancy) return null;

	V.pregnancyStats.totalDaysPregnant += 0.5;
	if (knowsPregnancy(pregnancy.pregnancyId, "pc")) V.pregnancyStats.totalDaysPregnancyKnown += 0.5;

	const progress = pregnancyProgress(pregnancy);

	if (between(progress, PregnancyConstants.morningSickness.earlyStart, PregnancyConstants.morningSickness.earlyEnd)) {
		/* Early Morning sickness */
		/* Light Nausea/dizzyness at any time of day, but mostly when waking up */
		if (weightedRandom([true, 70], [false, 30])) {
			V.pregnancyStats.morningSicknessWaking = 1;
		}
		if (weightedRandom([true, 70], [false, 30])) {
			V.pregnancyStats.morningSicknessGeneral = 1;
		}
	} else if (between(progress, PregnancyConstants.morningSickness.mainStart, PregnancyConstants.morningSickness.mainEnd)) {
		V.pregnancyStats.morningSicknessWaking = [1, 2, 2][random(0, 2)];
		if ((V.sexStats[genital].pregnancy.totalBirthEvents || 0) === 0 && V.pregnancyStats.morningSicknessWaking < 2) {
			V.pregnancyStats.morningSicknessWaking = 2;
		}
	}

	/* Breast growth and lactation. */
	if (progress >= 1 && !pregnancy.termEffectsDone) {
		pregnancy.termEffectsDone = true;
		if (V.player.breastsize <= 4 && V.player.breastsize < V.breastsizemax) {
			V.player.breastsize += 1;
			if (V.player.breastsize <= 4 && V.player.breastsize < V.breastsizemax) V.player.breastsize += 1;
			V.breastgrowthtimer = 700;
			V.breastgrowthmessage = V.player.breastsize;
			V.effectsmessage = 1;
		}
		if (V.lactating !== 1 && V.settings.breastFeedingEnabled === true && V.player.breastsize > 0) {
			V.lactating = 1;
			V.lactation_pressure = 100;
			Wikifier.wikifyEval("<<milkvolume 50>>");
			V.effectsmessage = 1;
			V.lactationmessage = 1;
		}
	}
}

/**
 * How long labour lasts, in minutes. A base time for birth, plus a bit more for
 * each baby, so twins and triplets take longer.
 * Feed the result to <<pass>>, and to getTimeString() for the "Next (H:MM)" link.
 */
window.birthLaborTime = function birthLaborTime() {
	const babies = getLabouringLitter("pc").length;

	const BASE_MIN = 60;
	const BASE_MAX = 180;
	const PER_EXTRA_MIN = 30;
	const PER_EXTRA_MAX = 90;

	return random(BASE_MIN, BASE_MAX) + random(PER_EXTRA_MIN, PER_EXTRA_MAX) * Math.max(0, babies - 1);
};

/**
 * Births a records pregnancy. Lays or delivers each child, sets up its rearing state, and carries
 * the pregnancy-wide side effects (counts, toy unlocks, who now knows).
 *
 * @param {number} pregnancyId the pregnancy record to birth
 * @param {string} birthLocation where the birth or lay takes place
 * @param {string} location where the children are placed and reared afterwards
 * @returns {boolean} true once the litter is birthed. Throws if the record has no children
 */
function birthRecordedLitter(pregnancyId, birthLocation, location) {
	const pregnancy = V.pregnancies[pregnancyId];
	const litter = getChildrenOf(pregnancyId);
	if (!litter.length) throw new Error(`birthRecordedLitter: pregnancy ${pregnancyId} has no children to birth`);
	if (pregnancy.carrier === "pc") {
		if (location === "home") setKnowsAboutPregnancy(pregnancy.carrier, "Bailey");
		else if (location === "wolf_cave") setKnowsAboutPregnancy(pregnancy.carrier, "Black Wolf");
		else if (location === "tower") setKnowsAboutPregnancy(pregnancy.carrier, "Great Hawk");
	}

	recordDelivery(pregnancyId, location);

	for (const child of litter) {
		beginRearing(child, location, birthLocation);
		if (!childIsUnhatchedEgg(child)) {
			if (!child.name) child.name = generateBabyName(undefined, child.gender, child.childId);
			recordBirth(child.childId);
		}

		// Species + parentage counters (derive the parent from the link, never store it on the child).
		if (child.species === "human") V.pregnancyStats.humanChildren++;
		else if (child.species === "wolf") V.pregnancyStats.wolfChildren++;
		else if (child.species === "hawk") V.pregnancyStats.hawkChildren++;
		if (pregnancy.carrier === "pc") V.pregnancyStats.playerChildren++;
		else if (pregnancy.donor === "pc") V.pregnancyStats.npcChildren++;
		else V.pregnancyStats.npcChildrenUnrelatedToPlayer++;
	}

	// "First birth" toy unlocks, by the litter's species.
	if (litter[0].species === "human") V.pregnancyStats.humanToysUnlocked = true;
	if (litter[0].species === "wolf") V.pregnancyStats.wolfToysUnlocked = true;
	if (litter[0].species === "hawk") V.pregnancyStats.hawkToysUnlocked = true;

	return true;
}
window.birthRecordedLitter = birthRecordedLitter;

// NPCs that can take their children out of Bailey's orphanage and avoid the childcare fee
const CHILD_FEE_NPCS = ["Alex"];

/**
 * Whether an NPC still has one of their own children at the orphanage (location "home").
 * Determines whether Bailey charges the PC a weekly child fee for that NPC or not.
 *
 * @param {string} npc the NPC's name
 * @returns {boolean}
 */
function npcHasChildAtOrphanage(npc) {
	return getBornChildren().some(
		child => (getPregnancyOf(child).carrier === npc || getPregnancyOf(child).donor === npc) && child.development.location === "home"
	);
}

/**
 * Clears an NPC's Bailey child fee once their last child leaves the orphanage.
 *
 * @param {string} npc the NPC's name
 */
function updateNpcChildFee(npc) {
	if (CHILD_FEE_NPCS.includes(npc) && !npcHasChildAtOrphanage(npc)) {
		delete C.npc[npc].pregnancy.fee;
	}
}

/**
 * Ends the player's labouring pregnancy: births the litter and runs the birth-side cleanup (Alex, fees).
 *
 * @param {string} birthLocation where the birth takes place
 * @param {string} location where the children are placed afterwards
 * @returns {boolean} true once birthed, false if the player has no pregnancy in labour
 */
function endPlayerPregnancy(birthLocation, location) {
	// The pregnancy in labour, if any, otherwise whichever active pregnancy the player has.
	const pregnancy = getLabouringPregnancy("pc");
	if (!pregnancy) return false;

	if (pregnancy.donor === "Alex") {
		delete C.npc.Alex.pregnancy.pcKnowledge;
		delete C.npc.Alex.pregnancy.test;
		delete C.npc.Alex.pregnancy.ultraSound;
		delete C.npc.Alex.pregnancy.sample;
		delete C.npc.Alex.pregnancy.noBirthControl;
		delete C.npc.Alex.pregnancy.ultraSoundPics;
		C.npc.Alex.pregnancy.pills = "contraceptive";
		C.npc.Alex.pregnancyAvoidance = 50;
	}
	updateNpcChildFee(pregnancy.donor);

	const validBirth = birthRecordedLitter(pregnancy.pregnancyId, birthLocation, location);

	if (validBirth) {
		// Record the birth on the player's per-orifice body stats. These drive the hymen and
		// vaginal-looseness lines, recovery, and the anal mpreg gate. Kept off records on purpose bc
		// Virginity-restoration events (schism, scarlet) reset them to 0
		const bodyStats = V.sexStats[pregnancy.orifice].pregnancy;
		bodyStats.totalBirthEvents = (bodyStats.totalBirthEvents || 0) + 1;
		bodyStats.givenBirth = (bodyStats.givenBirth || 0) + getChildrenOf(pregnancy.pregnancyId).length;
	}

	if (
		validBirth &&
		((pregnancy.orifice === "vagina" && V.player.virginity.vaginal === true) || (pregnancy.orifice === "anus" && V.player.virginity.anal === true))
	) {
		V.pregnancyStats.playerVirginBirths.pushUnique(pregnancy.pregnancyId);
	}
	if (getActivePregnancies("pc").length === 0) {
		const menstruation = V.sexStats.vagina.menstruation;
		switch (childBaseSpecies(pregnancy.donorSpecies)) {
			case "human":
				menstruation.recoveryTime = random(2, 3) * V.settings.humanPregnancyMonths;
				break;
			case "wolf":
				menstruation.recoveryTime = random(1, 2) * V.settings.wolfPregnancyWeeks;
				break;
			case "hawk":
				menstruation.recoveryTime = 0.5;
				break;
		}
		V.sexStats.vagina.menstruation = {
			...menstruation,
			currentState: "recovering",
			recoveryTimeStart: menstruation.recoveryTime,
			recoveryStage: 0,
			periodEnabled: false,
			awareOfPeriodDelay: false,
		};
	}

	// Labour is over either way.
	pregnancy.waterBreaking = false;
	pregnancy.birthInProgress = false;

	delete V.templeVirginPregnancy;
	delete V.caveHumanPregnancyDiscovered;

	return validBirth;
}
DefineMacro("endPlayerPregnancy", endPlayerPregnancy);
window.endPlayerPregnancyTest = (birthLocation, location) => {
	if (V.pregnancyTesting && birthLocation && location) return endPlayerPregnancy(birthLocation, location);
}; // V.pregnancyTesting Check should not be removed, debugging purposes only
/* Player pregnancy ends here */

/* Named NPC pregnancy starts here */
/**
 * Ages every named NPC's records pregnancy as time passes.
 * Marks the NPC aware once gestation passes npcGestation.awareProgressFraction.
 * Resolves a birth offscreen once it is past due by npcGestation.offscreenBirthGraceDays.
 */
// eslint-disable-next-line no-unused-vars
function npcPregnancyCycle() {
	if (V.statFreeze) return null;
	for (const npcName of V.NPCNameList) {
		const npc = C.npc[npcName];
		if (!npc) continue;
		const pregnancy = npc.pregnancy;
		if (!pregnancy) continue;
		const record = getActivePregnancies(npcName)[0];
		if (record) {
			if (
				Time.date.timeStamp - record.conceivedDate > gestationSeconds(record.donorSpecies) * PregnancyConstants.npcGestation.awareProgressFraction &&
				!knowsAboutPregnancy(npcName, npcName)
			) {
				setKnowsAboutPregnancy(npcName, npcName);
			}
			if (Time.date.timeStamp >= getDueDate(record)) {
				if (Time.date.timeStamp >= getDueDate(record) + PregnancyConstants.npcGestation.offscreenBirthGraceDays * TimeConstants.secondsPerDay) {
					/* Player has not seen the npc recently, sort out the pregnancy in another way */
					let birthLocation = "";
					let location = "";
					switch (npcName) {
						case "Black Wolf":
							birthLocation = "wolf_cave";
							location = "wolf_cave";
							break;
						case "Alex":
							if (!C.npc.Alex.pregnancy.missedBirth) {
								C.npc.Alex.pregnancy.missedBirth = true;
								C.npc.Alex.pregnancy.missedBirthCount = 1;
							} else {
								C.npc.Alex.pregnancy.missedBirth = true;
								C.npc.Alex.pregnancy.missedBirthCount += 1;
							}
							if (C.npc.Alex.pregnancy.nursery === true) {
								birthLocation = "alex_cottage";
								location = "alex_cottage";
							} else {
								birthLocation = "alex_cottage";
								location = "home";
							}
							break;
					}
					[birthLocation, location] = defaultBirthLocations(record.donorSpecies, birthLocation, location);
					if (!endNpcPregnancy(npcName, birthLocation, location)) {
						throw new Error(`offscreen NPC birth for "${npcName}" (pregnancy ${record.pregnancyId}) failed to deliver a past-due pregnancy`);
					}
				} else {
					/* Can deal with the npc in the next event */
					record.waterBreaking = true;
				}
			}
			continue;
		}
		if (pregnancy.enabled && V.settings.npcPregnancyEnabled === true) {
			if (V.settings.fertilityCycleEnabled === true) {
				pregnancy.cycleDay++;
				if (pregnancy.cycleDay >= pregnancy.cycleDaysTotal) {
					pregnancy.cycleDay = 1;
				}
			} else {
				pregnancy.nonCycleRng.push(random(0, 4));
				pregnancy.nonCycleRng.deleteAt(0);
				if (npcName === "Great Hawk" && pregnancy.nonCycleRng[0] === 0) pregnancy.nonCycleRngHasEggs = true;
			}
		}
	}
}
/**
 * The species a pregnancy grows as. An unrecognised pairing conceives nothing.
 *
 * @param {string} donorSpecies the donor's species
 * @param {string} carrierSpecies the carrier's species, after any monster selection
 * @returns {string|null} the offspring species, or null if the pairing conceives nothing
 */
function offspringSpecies(donorSpecies, carrierSpecies) {
	const bird = ["hawk", "harpy"];
	const wolfMonster = ["wolfboy", "wolfgirl"];
	const plain = ["human", "wolf"];
	if (bird.includes(donorSpecies) || bird.includes(carrierSpecies)) return carrierSpecies;
	if (wolfMonster.includes(donorSpecies) || wolfMonster.includes(carrierSpecies)) return "wolfgirl";
	if (plain.includes(donorSpecies) && plain.includes(carrierSpecies)) return donorSpecies === "wolf" || carrierSpecies === "wolf" ? "wolf" : "human";
	return null;
}
window.offspringSpecies = offspringSpecies;

/**
 * Creates a named NPC's pregnancy from a donor.
 *
 * @param {string} carrier the pregnant NPC's name
 * @param {string} donor the donor's name, usually pc
 * @param {string} donorInputSpecies the donor's species
 * @param {boolean} [donorKnown=false] whether the player learns who the donor is
 * @param {boolean} [awareOf=false] whether the player learns about the pregnancy
 * @returns {boolean} true if a pregnancy was created
 */
function namedNpcPregnancy(carrier, donor, donorInputSpecies, donorKnown = false, awareOf = false) {
	if (V.settings.npcPregnancyEnabled === false) return false; // Npc pregnancy disabled
	const namedNpc = C.npc[carrier];
	let namedNpcType;
	switch (carrier) {
		case "Black Wolf":
			if ((V.settings.monsterChance >= random(1, 100) && (V.hallucinations >= 1 || !V.settings.monsterHallucinationsOnly)) || V.blackwolfmonster === 2) {
				namedNpcType = "wolfgirl";
			} else {
				namedNpcType = namedNpc.type;
			}
			break;
		case "Great Hawk":
			if ((V.settings.monsterChance >= random(1, 100) && (V.hallucinations >= 1 || !V.settings.monsterHallucinationsOnly)) || V.greathawkmonster === 2) {
				namedNpcType = "harpy";
			} else {
				namedNpcType = namedNpc.type;
			}
			break;
		default:
			namedNpcType = namedNpc.type;
			break;
	}
	const donorSpecies = offspringSpecies(donorInputSpecies, namedNpcType);
	if (!donorSpecies) return false;

	const eggLaying = donorSpecies === "hawk" || donorSpecies === "harpy";
	const pregnancyId = createPregnancy(
		carrier,
		namedNpc.type || donorSpecies,
		donor,
		donorSpecies,
		[{ name: donor, species: donorInputSpecies }],
		Time.date.timeStamp,
		"vagina",
		eggLaying ? "tower" : V.location
	);
	if (awareOf) setKnowsPregnancy(pregnancyId, "pc");
	if (donorKnown) setKnowsDonor(pregnancyId, "pc");
	return true;
}
DefineMacro("namedNpcPregnancy", namedNpcPregnancy);
window.namedNpcPregnancyTest = (carrier, donor, pregnancyType, donorKnown, awareOf) => {
	if (V.pregnancyTesting) return namedNpcPregnancy(carrier, donor, pregnancyType, donorKnown, awareOf);
}; // V.pregnancyTesting Check should not be removed, debugging purposes only

/**
 * Ends an NPC's pregnancy. Delivers the pregnancy off screen and runs clean up.
 *
 * @param {string} npcName the pregnant NPC's name
 * @param {string} birthLocation where the birth takes place
 * @param {string} location where the children live
 * @returns {boolean} true once delivered, false if the NPC has no pregnancy
 */
function endNpcPregnancy(npcName, birthLocation, location) {
	if (!C.npc[npcName] || !C.npc[npcName].pregnancy) {
		return false;
	}
	const pregnancy = C.npc[npcName].pregnancy;

	const record = getLabouringPregnancy(npcName);
	if (record && getChildrenOf(record.pregnancyId).length) {
		// Handled by Baileys Orphanage event and when naming them, this is backup for other situations
		if (record.donor === "pc" && location !== "home") {
			document.getElementById("passages").children[0].append(Wikifier.wikifyEval('<<earnFeat "First Fatherhood">>'));
		}
		switch (location) {
			case "home":
				setKnowsAboutPregnancy(npcName, "Bailey", record.pregnancyId, true);
				break;
			case "wolf_cave":
				setKnowsAboutPregnancy(npcName, "Black Wolf", record.pregnancyId);
				break;
		}
		const validBirth = birthRecordedLitter(record.pregnancyId, birthLocation, location);
		pregnancy.cycleDay = (pregnancy.cycleDaysTotal || 0) - 3;

		if (npcName === "Alex") {
			delete C.npc.Alex.pregnancy.selfKnowledge;
			delete C.npc.Alex.pregnancy.noBirthControl;

			C.npc.Alex.pregnancy.pills = "contraceptive";
			C.npc.Alex.pregnancyAvoidance = 50;
		}
		updateNpcChildFee(npcName);

		if (validBirth) V.pregnancyStats.npcTotalBirthEvents++;
		return validBirth;
	}

	return false;
}
DefineMacro("endNpcPregnancy", endNpcPregnancy);
window.endNpcPregnancyTest = (npcName, birthLocation, location) => {
	if (V.pregnancyTesting && npcName && birthLocation && location) return endNpcPregnancy(npcName, birthLocation, location);
}; // V.pregnancyTesting Check should not be removed, debugging purposes only
/* Named NPC pregnancy ends here */

/**
 * Ages every stored NPC's records pregnancy.
 * Births each one that is now due at its species' default location, then removes the stored NPC.
 *
 * @returns {boolean} false when there is nothing to process (stats frozen or no stored NPCs), else true
 */
// eslint-disable-next-line no-unused-vars
function randomPregnancyProgress() {
	if (!V.storedNPCs || V.statFreeze) return false;
	const toDelete = [];
	Object.keys(V.storedNPCs).forEach(npcKey => {
		const record = getActivePregnancies(npcKey)[0];
		if (record && Time.date.timeStamp >= getDueDate(record)) {
			const [birthLocation, location] = defaultBirthLocations(record.donorSpecies);
			birthRecordedLitter(record.pregnancyId, birthLocation, location);
			toDelete.push(npcKey);
		}
	});
	toDelete.forEach(npcKey => delete V.storedNPCs[npcKey]);
	return true;
}

/**
 * Fills in the default birth and placement locations for a species when a caller leaves them blank.
 *
 * @param {string} type the child's species
 * @param {string} [birthLocation] where the birth happens, defaulted if missing
 * @param {string} [location] where the children go afterwards, defaulted if missing
 * @returns {string[]} the resolved [birthLocation, location]
 */
function defaultBirthLocations(type, birthLocation, location) {
	switch (type) {
		case "human":
			if (!birthLocation) birthLocation = "hospital";
			if (!location) location = "home";
			break;
		case "wolf":
		case "wolfboy":
		case "wolfgirl":
			if (!birthLocation) birthLocation = "wolf_cave";
			if (!location) location = "wolf_cave";
			break;
		case "hawk":
		case "harpy":
			if (!birthLocation) birthLocation = "tower";
			if (!location) location = "tower";
			break;
		default:
			throw new Error(`defaultBirthLocations: unknown donor species "${type}"`);
	}
	return [birthLocation, location];
}
/**
 * Whether the player can breed with the given NPC. For NPC breeding lines only.
 *
 * Accepts either a named NPC's name or an NPC object (from $NPCList or $NPCName), e.g.
 * playerCanBreedWith("Kylar"), playerCanBreedWith($NPCList[0]), or playerCanBreedWith(C.npc.Kylar).
 *
 * @param {string|object} npc the NPC's name, or an NPC object from $NPCList / $NPCName
 * @returns {boolean}
 */
function playerCanBreedWith(npc) {
	if (typeof npc === "string") npc = V.NPCName[V.NPCNameList.indexOf(npc)];

	return (
		((V.player.vaginaExist || (canBeMPregnant() && C.npc[npc.fullDescription] && knowsAboutAnyPregnancy("pc", npc.fullDescription))) &&
			npc.penis !== "none") ||
		(V.player.penisExist && npc.vagina !== "none")
	);
}
window.playerCanBreedWith = playerCanBreedWith;

/**
 * Whether the player or NPC can conceive.
 *
 * @param {string|object} NPC a named NPC's name, or an NPC object
 * @returns {boolean}
 */
function pregnancyCompatible(NPC) {
	if (playerPregnancyPossibleWith(NPC) === false && NPCPregnancyPossibleWithPlayer(NPC) === false) return false;
	return true;
}
window.pregnancyCompatible = pregnancyCompatible;

/**
 * Normalizes a *PossibleWith argument into one { npc, name, named } shape, so
 * playerPregnancyPossibleWith and NPCPregnancyPossibleWithPlayer can resolve the same.
 *
 * @param {string|object} NPC a named NPC's name, or an NPC
 * @returns {{npc: object|null, name: string, named: boolean}} named is true for a named NPC. npc is null when nothing resolves
 */
function resolvePregnancyNpc(NPC) {
	if (typeof NPC === "string" || (NPC && V.NPCNameList.includes(NPC.fullDescription))) {
		const npc = V.NPCName[V.NPCNameList.indexOf(typeof NPC === "string" ? NPC : NPC.fullDescription)];
		if (!npc) return { npc: null, name: "", named: false };
		return { npc, name: npc.fullDescription || npc.description, named: true };
	}
	if (typeof NPC === "object" && !Array.isArray(NPC) && NPC !== null) return { npc: NPC, name: NPC.fullDescription, named: false };
	return { npc: null, name: "", named: false };
}
window.resolvePregnancyNpc = resolvePregnancyNpc;

/**
 * Whether the player could get pregnant by this NPC.
 *
 * @param {string|object} NPC a named NPC's name, or an NPC object (a scene $NPCList entry or a V.NPCName entry)
 * @returns {boolean}
 */
function playerPregnancyPossibleWith(NPC) {
	const { npc, name, named } = resolvePregnancyNpc(NPC);
	if (!npc) return false;
	if (
		named &&
		(setup.pregnancy.infertile.includes(name) ||
			(V.settings.incompletePregnancyEnabled === false && C.npc[name] && !setup.pregnancy.canImpregnatePlayer.includes(name)))
	) {
		return false;
	}
	if (playerIsPregnant() || getParasiteObject().fetus.length) return false;
	switch (npc.type) {
		case "human":
			if (V.settings.playerPregnancyHumanEnabled === false) return false;
			break;
		case "wolf":
		case "wolfboy":
		case "wolfgirl":
		case "hawk":
		case "harpy":
			if (
				V.settings.playerPregnancyBeastEnabled === false ||
				(V.settings.playerPregnancyEggLayingEnabled === false && ["hawk", "harpy"].includes(npc.type))
			) {
				return false;
			}
			break;
		default:
			return false;
	}
	if (!((V.player.vaginaExist || canBeMPregnant()) && npc.gender === "m") || "strapon" in npc) return false;
	return true;
}
window.playerPregnancyPossibleWith = playerPregnancyPossibleWith;

/**
 * Whether this NPC could get pregnant by the player.
 *
 * @param {string|object} NPC a named NPC's name, or an NPC object (a scene $NPCList entry or a V.NPCName entry)
 * @returns {boolean}
 */
function NPCPregnancyPossibleWithPlayer(NPC) {
	const { npc, name, named } = resolvePregnancyNpc(NPC);
	if (!npc) return false;
	if (named) {
		if (!C.npc[name]) {
			Errors.report("Named NPC " + name + " is undefined for pregnancy compatibility check.");
			return false;
		}
		// Infertility only applies to named NPCs.
		if (setup.pregnancy.infertile.includes(name) || !npc.pregnancy.enabled) return false;
		if (getActivePregnancies(name).length) return false;
	} else if (npc.pregnancy) {
		return false;
	}
	if (V.settings.npcPregnancyEnabled === false) return false;
	if (!setup.pregnancy.typesEnabled.includes(npc.type)) return false;
	if (!V.player.penisExist || npc.gender === "m") return false;
	return true;
}
window.NPCPregnancyPossibleWithPlayer = NPCPregnancyPossibleWithPlayer;

/**
 * Resolves paternity for every active player pregnancy and marks the player aware of each child.
 */
function makeAwareOfDetails() {
	getActivePregnancies("pc").forEach(p => {
		resolvePaternity(p.pregnancyId);
		getChildrenOf(p.pregnancyId).forEach(child => {
			setKnowsChild(child.childId, "pc");
		});
	});
}
DefineMacro("makeAwareOfDetails", makeAwareOfDetails);
