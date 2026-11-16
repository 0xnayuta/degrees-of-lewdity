// The pregnancy macros that scenes can call.
// Combat calls <<combatInseminate>> and everything about the load is worked out from the fight.
// Story scenes call <<sceneInseminate>> and provide the details themselves.
// Cum inside an NPC is one <<npcPregnancyRoll>> on the spot, NPCs store no loads.

// The orifice and landing depth for each penis state.
// The names come from the $NPCList[n].penis states during combat/sex.
// States not listed here (mouth, thighs, etc.) leave nothing behind.
const depthFromPenisState = {
	vaginaentrance: ["vagina", "outside"],
	vaginaentrancedouble: ["vagina", "outside"],
	vaginaimminent: ["vagina", "imminent"],
	vaginaimminentdouble: ["vagina", "imminent"],
	vagina: ["vagina", "deep"],
	vaginadouble: ["vagina", "deep"],
	anusentrance: ["anus", "outside"],
	anusentrancedouble: ["anus", "outside"],
	anusimminent: ["anus", "imminent"],
	anusimminentdouble: ["anus", "imminent"],
	anus: ["anus", "deep"],
	anusdouble: ["anus", "deep"],
	cheeks: ["anus", "outside"],
};

// A generated NPC can only get pregnant as one of these species.
const randomCarrierTypes = ["human", "wolf", "wolfboy", "wolfgirl"];

/**
 * Called by the ejaculation widgets when an NPC climaxes in combat.
 * The fight fills in every detail of the load.
 *
 * `<<combatInseminate _npcSlot>>` or `<<combatInseminate _beastSlot true _pregnancyBoost>>` (beast)
 *
 * @param {0|1|2|3|4|5} slot which $NPCList slot climaxed
 * @param {boolean} [beast=false] pass true from the beast widget to keep the beast's species
 * @param {number} [knotBoost=0] percent added to the load's potency, from the beast widget's knot
 * @returns {Load|null} the load, which is only stored in realistic mode. null when nothing landed or it can't get the PC pregnant
 */
function combatInseminate(slot, beast = false, knotBoost = 0) {
	const npc = V.NPCList[slot];
	const landing = depthFromPenisState[npc.penis];
	if (!landing) return null;
	const [orifice, depth] = landing;

	if (npcHasStrapon(slot)) return null;
	if (condomState(slot) === "worn") return null;
	if (playerChastity(orifice)) return null;
	const donorSpecies = !beast && V.enemytype === "man" ? "human" : npc.type;
	// canPlayerConceive throws on a species it doesn't know
	if (!setup.pregnancy.typesEnabled.includes(donorSpecies)) return null;

	// A knot makes the load more potent. A size 1 penis dribbles at half potency.
	let potency = 1;
	if (knotBoost) potency = 1 + knotBoost / 100;
	else if (npc.penissize === 1) potency = 0.5;

	const forced = (orifice === "vagina" ? V.vaginaaction : V.anusaction) === "forceImpregnation";
	const load = inseminate(orifice, npc.fullDescription, donorSpecies, depth, V.location, potency, null, forced);
	if (load) instantConception(orifice, load, forced);
	return load;
}
window.combatInseminate = combatInseminate;

/**
 * Creates the PC's pregnancy from a load right now.
 * Shared by the Force Impregnation action and the fetish pregnancy roll.
 *
 * @param {"vagina"|"anus"} orifice
 * @param {Load} load the load that conceives
 * @returns {number} the new pregnancyId
 */
function conceiveNow(orifice, load) {
	const pregnancyId = createPregnancy(
		"pc",
		"human",
		load.donor,
		load.donorSpecies,
		[{ name: load.donor, species: load.donorSpecies }],
		Time.date.timeStamp,
		orifice,
		load.location
	);
	setKnowsDonor(pregnancyId, "pc");
	setKnowsCarrier(pregnancyId, "pc");
	if (V.settings.pregnancyType === "fetish") T.playerIsNowPregnant = load.donor; // the fetishPregnancyImg widget prints the banner from this
	return pregnancyId;
}

/**
 * Instant conception when a load lands, if it can. The Force Impregnation action conceives
 * in every pregnancy mode, but only from a load that can't be washed away. Otherwise only fetish
 * mode conceives here, from a roll. Nothing happens if the PC is already pregnant or the orifice
 * has parasites.
 *
 * @param {"vagina"|"anus"} orifice
 * @param {Load} load the load that just landed
 * @param {boolean} [force=false] the Force Impregnation action, which skips the fetish-mode roll
 */
function instantConception(orifice, load, force = false) {
	const forced = force && !load.canWash;
	if (!forced && V.settings.pregnancyType !== "fetish") return;
	if (getActivePregnancies("pc").length) return;
	if (orificeHasParasites(orifice)) return;
	const won = forced ? load : fetishPregnancyRoll(load);
	if (won) conceiveNow(orifice, won);
}
window.instantConception = instantConception;

/**
 * Call this when a scene puts cum inside the PC outside of combat.
 * Say who and where, the pregnancy system does the rest.
 *
 * For a creampie, `<<sceneInseminate "vagina" "Whitney" "human" "deep">>`
 *
 * For six loads lasting 12 days, `<<sceneInseminate "anus" "Harper's serum" "human" "deep" 6 12>>`
 *
 * @param {"vagina"|"anus"} orifice vagina or anus
 * @param {string} donor who it came from: an NPC's name, or "pc"
 * @param {PregnancySpecies} donorSpecies the donor's species
 * @param {"outside"|"imminent"|"deep"} depth where it landed
 * @param {number} [quantity=1] how many loads. Optional (default = 1)
 * @param {number|null} [days] how long the loads last in days. Optional (default = 4 to 8 days)
 * @returns {Load|null} the last load, which is only stored in realistic mode. null when the loads can't get the PC pregnant
 */
function sceneInseminate(orifice, donor, donorSpecies, depth, quantity = 1, days = null) {
	if (PregnancyConstants.depthWeight[depth] === undefined) throw new Error(`unknown depth "${depth}"`);
	if (!donorSpecies) throw new Error(`no donor species given for "${donor}"`);
	if (!setup.pregnancy.typesEnabled.includes(donorSpecies)) return null; // species that can't impregnate return null without an error
	let lifespan = null;
	if (days !== null) lifespan = days * TimeConstants.secondsPerDay;
	let stored = null;
	for (let i = 0; i < quantity; i++) {
		const load = inseminate(orifice, donor, donorSpecies, depth, V.location, 1, lifespan);
		if (load === null) return null; // every load has the same details, so if one is refused they all are
		stored = load;
		instantConception(orifice, load);
	}
	return stored;
}
window.sceneInseminate = sceneInseminate;

/**
 * Decides whether the game keeps track of a generated NPC's pregnancy, and files them in $storedNPCs if so.
 * Only consensual sex is kept.
 *
 * @param {number} slot the carrier's $NPCList slot
 * @param {string} location where it happened
 * @returns {string|null} the key to record their pregnancy under. null when they are not kept
 */
function rememberRandomCarrier(slot, location) {
	if (V.consensual !== 1) return null;
	const followed = Object.keys(V.storedNPCs).reduce((count, key) => (getActivePregnancies(key).length ? count + 1 : count), 0);
	const keep = setup.pregnancy.randomAlwaysKeep.includes(location) ? followed <= 15 : followed <= 10 && random(0, 1 + followed) === 0;
	if (!keep) return null;
	return storeNPC(slot, "pregnancy");
}

/**
 * Call this when someone cums inside an NPC who could get pregnant from it.
 * One roll on the spot decides it, scaled by depth. NPCs store no loads, this roll is their whole conception.
 * A named NPC missing from setup.pregnancy.canBePregnant can only conceive when the unfinished pregnancy content setting is on.
 *
 * For a creampie, `<<npcPregnancyRoll "Robin" "human" "pc" "human" "vagina">>`
 *
 * For a spill that never went in, `<<npcPregnancyRoll "Robin" "human" "someone" "human" "vagina" "imminent">>`
 *
 * From a fight, pass the slot and it sorts named from generated NPCs itself:
 * `<<npcPregnancyRoll $NPCList[_npcSlot].fullDescription $NPCList[_npcSlot].type "pc" "human" "vagina" "deep" $location 1 _npcSlot>>`
 *
 * @param {string} carrier the NPC who might get pregnant: a name, or a generated one like "lissome man"
 * @param {string} carrierSpecies what the carrier is, e.g. "human"
 * @param {string} donor who came inside them: an NPC's name, or "pc"
 * @param {PregnancySpecies} donorSpecies the donor's species
 * @param {"vagina"|"anus"} orifice where the cum went
 * @param {"outside"|"imminent"|"deep"} [depth="deep"] where it landed. Can be left out for a creampie, a spill scales the chance down
 * @param {string} [location] where it happened. Defaults to $location, pass one when the scene runs off-screen
 * @param {number} [donorFertility=1] extra multiplier on the conception chance from the donor's side (e.g. the PC's low-semen or earSlime state)
 * @param {number|null} [slot=null] the carrier's $NPCList slot. A generated NPC in a slot is filed in $storedNPCs
 * @param {boolean} [forced=false] the PC's Force Impregnation action, which skips the chance roll and the normal-impregnation toggle
 * @returns {number|null} the new pregnancyId. null = no conception, or a generated carrier the game does not follow
 */
function npcPregnancyRoll(
	carrier,
	carrierSpecies,
	donor,
	donorSpecies,
	orifice,
	depth = "deep",
	location = V.location,
	donorFertility = 1,
	slot = null,
	forced = false
) {
	const depthWeight = PregnancyConstants.depthWeight[depth];
	if (depthWeight === undefined) throw new Error(`unknown depth "${depth}"`);
	if (!donorSpecies) throw new Error(`no donor species given for "${donor}"`);
	if (!setup.pregnancy.typesEnabled.includes(donorSpecies)) return null; // species that can't impregnate return null without an error
	const generated = slot !== null && !C.npc[carrier];
	if (generated && (V.NPCList[slot].pregnancy || !randomCarrierTypes.includes(carrierSpecies))) return null;
	if (getActivePregnancies(carrier).length) return null; // one pregnancy at a time, same as the PC
	// Unfinished pregnancy content setting
	if (!V.settings.incompletePregnancyEnabled && C.npc[carrier] && !setup.pregnancy.canBePregnant.includes(carrier)) return null;
	// Dream sex leaves nothing behind, so a nightmare counts as a disabled scene.
	if (V.activeNightmare || impregnationDisabled(forced)) return null;
	if (!canNpcConceive(orifice, carrier, donor)) return null;
	// null when these two species can't have children together
	const offspring = offspringSpecies(donorSpecies, carrierSpecies);
	if (!offspring) return null;
	if (
		!forced &&
		State.random() >=
			(V.settings.baseNpcPregnancyChance / 100) * depthWeight * npcMenstrualFertility(carrier) * npcConceptionModifier(carrier) * donorFertility
	)
		return null;

	// Fetish mode only, when the PC is the donor
	const playerImpregnated = donor === "pc" && V.settings.pregnancyType === "fetish";
	if (playerImpregnated) T.pregnantNpc = carrier; // the fetishPregnancyImg widget prints the banner from this
	let recorded = carrier;
	if (generated) {
		V.NPCList[slot].pregnancy = 1;
		recorded = rememberRandomCarrier(slot, location);
		if (recorded === null) return null;
	}

	const time = Time.date.timeStamp;
	const pregnancyId = createPregnancy(recorded, carrierSpecies, donor, offspring, [{ name: donor, species: donorSpecies }], time, orifice, location);
	if (playerImpregnated) {
		setKnowsDonor(pregnancyId, "pc");
		if (!generated) setKnowsCarrier(pregnancyId, "pc");
	}
	return pregnancyId;
}
window.npcPregnancyRoll = npcPregnancyRoll;

DefineMacro("combatInseminate", combatInseminate);
DefineMacro("sceneInseminate", sceneInseminate);
DefineMacro("npcPregnancyRoll", npcPregnancyRoll);
