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

function canImpregnateParasite(genital = "anus") {
	if (V.settings.parasitePregnancyEnabled === false || (genital === "vagina" && !V.player.vaginaExist)) return false;
	if (V.sexStats.pills.pills["Anti-Parasite Cream"] && V.sexStats.pills.pills["Anti-Parasite Cream"].doseTaken) return false;
	// A real pregnancy lives in records now, not on this old-shape object, so check it directly.
	if (getActivePregnancy("pc", genital)) return false;
	const pregnancy = V.sexStats[genital].pregnancy;

	if ((pregnancy.type !== null && pregnancy.type !== "parasite") || pregnancy.fetus.length >= maxParasites(genital)) return false;

	return true;
}
window.canImpregnateParasite = canImpregnateParasite;

function canBeMPregnant() {
	return (
		!V.player.vaginaExist &&
		((V.skin.pubic.pen === "magic" && V.skin.pubic.special === "pregnancy") ||
			(V.earSlime.growth >= 100 && ["pregnancy", "mixed"].includes(V.earSlime.focus)))
	);
}
window.canBeMPregnant = canBeMPregnant;

function npcPregObject(person, isCarrier) {
	let result = "Invalid input";
	const parentType = isCarrier ? 0 : 1;

	if (typeof person === "string" || person instanceof String) {
		let parentId = parentFunction.findParent(person, parentType, true);
		if (parentId === -1) {
			parentId = parentFunction.addToParentList(person, undefined, parentType);
		}
		if (person === "pc") {
			// pregnancy isn't required for the player
			result = {
				name: "pc",
				gender: V.player.sex,
				type: "human",
				parentId: Array.isArray(parentId) ? parentId[0] : parentId,
				skinColour: Skin.color.natural,
				hairColour: V.naturalhaircolour,
				eyeColour: V.eyeselect,
			};
		} else if (C.npc[person]) {
			result = {
				name: C.npc[person].nam,
				pregnancy: C.npc[person].pregnancy,
				type: C.npc[person].type,
				parentId: Array.isArray(parentId) ? parentId[0] : parentId,
				skinColour: C.npc[person].skincolour,
				hairColour: C.npc[person].hairColour,
				eyeColour: C.npc[person].eyeColour,
			};
			if (C.npc[person].vagina !== "none" && C.npc[person].penis !== "none") {
				result.gender = "h";
			} else if (C.npc[person].vagina !== "none") {
				result.gender = "f";
			} else if (C.npc[person].penis !== "none") {
				result.gender = "m";
			} else {
				// No Gender detected
				return "Gender for Named NPC not found";
			}
		} else {
			// No NPC found, likely found from sperm name string
			return {
				name: person,
				type: "unknown",
				parentId: Array.isArray(parentId) ? parentId[0] : parentId,
				skinColour: random(1, 100) <= V.settings.darkSkinChance ? "dark" : "light",
			};
		}
	} else {
		if (person.fullDescription) {
			let parentId = parentFunction.findParent(person.fullDescription, parentType, true);
			if (parentId === -1) {
				parentId = parentFunction.addToParentList(person.fullDescription, C.npc[person.fullDescription] ? undefined : person, parentType);
			}
			result = {
				name: person.fullDescription,
				pregnancy: person.pregnancy,
				type: person.type,
				parentId: Array.isArray(parentId) ? parentId[0] : parentId,
				skinColour: person.skincolour,
				hairColour: person.hairColour,
				eyeColour: person.eyeColour,
			};
			if (C.npc[person.fullDescription]) {
				if (!result.hairColour) result.hairColour = C.npc[person.fullDescription].hairColour;
				if (!result.eyeColour) result.eyeColour = C.npc[person.fullDescription].eyeColour;
			}
			if (person.vagina !== undefined && person.vagina !== "none" && person.penis !== undefined && person.penis !== "none") {
				result.gender = "h";
			} else if (person.vagina !== undefined && person.vagina !== "none") {
				result.gender = "f";
			} else if (person.penis !== undefined && person.penis !== "none") {
				result.gender = "m";
			} else {
				// No Gender detected
				return "Gender for object not found";
			}
		}
	}
	return result;
}

function parasitePrep({ carrierObject, parasiteType = null, genital = null }) {
	let pregnancy;
	if (!carrierObject) {
		return [`carrier object not provided`];
	} else if (!["anus", "vagina"].includes(genital)) {
		return [`Invalid genital '${genital}' set`];
	} else if (carrierObject.name === "pc") {
		if (genital === "vagina" && !V.player.vaginaExist) return ["Player doesn't have a vagina for pregnancy"];

		// Prevent Non-parasitic pregnancy in the anus unless the player is male with a magic tattoo
		if (genital === "anus" && !canBeMPregnant() && !parasiteType) return ["MPreg is not currently available to the player"];

		pregnancy = V.sexStats[genital].pregnancy;

		if (getActivePregnancy("pc", genital)) return ["Player currently pregnant and cannot support other types"];

		// Prevent a parasite if a non-parasitic pregnancy already exists
		if (pregnancy.type !== "parasite" && pregnancy.fetus.length) return ["Player currently pregnant and cannot support other types"];

		// Prevent any non-parasitic pregnancy a parasitic pregnancy already exists
		if (pregnancy.type === "parasite" && !parasiteType) return ["Player currently pregnant with parasite and cannot support other types"];

		// Prevent a parasitic pregnancy if there is not enough space
		if (parasiteType && pregnancy.fetus.length >= maxParasites(genital)) return ["Player does not have room for more parasites"];
	}

	return [pregnancy];
}

function eyeColourCalc(colour) {
	if (colour) return colour;
	return PregnancyConstants.genePool.eyeColour.random();
}
window.eyeColourCalc = eyeColourCalc; // used cross-file by eyes-related.js

window.pregnancyGenerator = {
	parasite: ({ carrier = null, parasiteType = null, hermParasite = null, genital = "anus" }) => {
		const carrierObject = npcPregObject(carrier, true);
		if (typeof carrierObject === "string" || carrierObject instanceof String) return carrierObject;

		const [pregnancy] = parasitePrep({ carrierObject, parasiteType, genital });
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
