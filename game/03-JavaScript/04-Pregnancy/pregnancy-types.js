/**
 * How many parasites this orifice can hold at once.
 *
 * @param {"anus"|"vagina"} genital which orifice
 * @returns {number} 1, 2, or 4
 */
function maxParasites(genital = "anus") {
	switch (V.sexStats[genital].pregnancy.motherStatus) {
		case 1:
			return 2;
		case 2:
			return 4;
		default:
			return 1;
	}
}
window.maxParasites = maxParasites;

/**
 * Whether pc can take a new parasite in this orifice right now: parasites enabled, no anti-parasite
 * cream active, no real pregnancy there, and a free slot left.
 *
 * @param {"anus"|"vagina"} genital which orifice
 * @returns {boolean}
 */
function canImpregnateParasite(genital = "anus") {
	if (V.settings.parasitePregnancyEnabled === false || (genital === "vagina" && !V.player.vaginaExist)) return false;
	if (V.sexStats.pills.pills["Anti-Parasite Cream"] && V.sexStats.pills.pills["Anti-Parasite Cream"].doseTaken) return false;
	if (getActivePregnancy("pc", genital)) return false;
	const pregnancy = V.sexStats[genital].pregnancy;

	if ((pregnancy.type !== null && pregnancy.type !== "parasite") || pregnancy.fetus.length >= maxParasites(genital)) return false;

	return true;
}
window.canImpregnateParasite = canImpregnateParasite;

/**
 * Whether pc can carry an anal pregnancy through an acquired method like the magic tattoo
 * or ear-slime. Always false while pc has a vagina.
 *
 * @returns {boolean}
 */
function canBeMPregnant() {
	return (
		!V.player.vaginaExist &&
		((V.skin.pubic.pen === "magic" && V.skin.pubic.special === "pregnancy") ||
			(V.earSlime.growth >= 100 && ["pregnancy", "mixed"].includes(V.earSlime.focus)))
	);
}
window.canBeMPregnant = canBeMPregnant;

/**
 * Checks if pc can host a pregnancy in this orifice and returns the parasite pregnancy object
 * ($sexStats[genital].pregnancy) to add to or an error string when something blocks it.
 *
 * @param {string|null} parasiteType the parasite to add, or null for a non-parasitic pregnancy (mpreg in the anus)
 * @param {"anus"|"vagina"} genital which orifice
 * @returns {object|string} the pregnancy object to add to, or an error string when blocked
 */
function parasitePrep(parasiteType, genital) {
	if (!["anus", "vagina"].includes(genital)) return `Invalid genital '${genital}' set`;
	if (genital === "vagina" && !V.player.vaginaExist) return "Player doesn't have a vagina for pregnancy";
	// A non-parasitic anal pregnancy needs mpreg (magic tattoo/ear slime); a parasite doesn't.
	if (genital === "anus" && !canBeMPregnant() && !parasiteType) return "MPreg is not currently available to the player";

	const pregnancy = V.sexStats[genital].pregnancy;
	if (getActivePregnancy("pc", genital)) return "Player currently pregnant and cannot support other types";
	// A parasite can't coexist with a non-parasitic pregnancy
	if (pregnancy.type !== "parasite" && pregnancy.fetus.length) return "Player currently pregnant and cannot support other types";
	if (pregnancy.type === "parasite" && !parasiteType) return "Player currently pregnant with parasite and cannot support other types";
	if (parasiteType && pregnancy.fetus.length >= maxParasites(genital)) return "Player does not have room for more parasites";

	return pregnancy;
}

/**
 * Returns colour if given, otherwise a random eye colour from the gene pool.
 *
 * @param {string} [colour] a specific eye colour, or falsy to roll one
 * @returns {string}
 */
function eyeColourCalc(colour) {
	if (colour) return colour;
	return PregnancyConstants.genePool.eyeColour.random();
}
window.eyeColourCalc = eyeColourCalc;

window.pregnancyGenerator = {
	parasite: ({ parasiteType = null, hermParasite = null, genital = "anus" }) => {
		const pregnancy = parasitePrep(parasiteType, genital);
		if (typeof pregnancy === "string" || pregnancy instanceof String) return pregnancy;

		if (pregnancy) {
			/*
				creature: the type of creature it is. "Lurker", "Slime", "Pale Tentacle", etc
				fertilised: whether it's fertilised or not. Parasites need to be fertilised before they can be birthed
				daysLeft: how long until it can be birthed. Birthing is possible when it's 3 or less, but significantly more likely at 0
				timeLeft: how long until it prompts a daily event. Speed impacts how fast it goes down
				stats.growth: how long it takes to birth and how much the parasite is worth when selling
				stats.speed: how often it prompts a daily event. Also determines the parasite's activity
			*/
			const result = { fetus: clone(pregnancy.fetus), type: "parasite" };
			const parasite = {
				creature: parasiteType,
				fertilised: !!hermParasite,
				daysLeft: 1,
				timeLeft: null,
				stats: {
					growth: random(7, 14),
					speed: random(60, 360),
				},
			};
			if (hermParasite) {
				parasite.daysLeft = Math.floor(hermParasite.stats.growth * 0.8);
				parasite.stats.growth = Math.floor(hermParasite.stats.growth * 0.8);
				parasite.stats.speed = Math.floor(hermParasite.stats.speed * 0.8);
			} else {
				if (parasiteType.includes("Pale")) {
					// Pale parasites have significantly better activity
					parasite.stats.speed *= 0.6;
				} else if (parasiteType.includes("Tentacle") || parasiteType.includes("Vine")) {
					// Tentacles and vines have better activity. Done in an elseif so pale tentacles don't get the calculation twice
					parasite.stats.speed *= 0.9;
				}
				if (parasiteType.includes("Vine") && random(0, 100) > 99) {
					// Vine Vine easter egg lol
					parasite.creature += " Vine";
					parasite.stats.growth--;
				}
				if (parasiteType.includes("Lurker")) {
					// Lurkers have better activity, but sell for less and take longer to birth
					parasite.stats.growth += 14;
					for (let i = 0; i < 3; i++) {
						if (parasite.stats.speed >= 100) {
							parasite.stats.speed -= 50;
						}
					}
				}
			}

			const genderCheck = random(0, 100);
			if (genderCheck < 70) {
				// Female parasites are most likely
				parasite.stats.gender = "Female";
			} else if (
				genderCheck > 90 &&
				maxParasites(genital) > 1 &&
				!pregnancy.fetus.find(currentParasite => currentParasite.stats.gender === "Hermaphrodite")
			) {
				// You can only get a futa if you're ready for a futa and don't currently have one
				parasite.stats.gender = "Hermaphrodite";
				parasite.stats.lastEgg = Math.floor(parasite.stats.growth / 3);
			} else {
				parasite.stats.gender = "Male";
			}
			result.fetus.push(clone(parasite));

			T.impregnatedParasite = genital;
			return result;
		}
		T.impregnatedParasite = null;
		return false;
	},
};
