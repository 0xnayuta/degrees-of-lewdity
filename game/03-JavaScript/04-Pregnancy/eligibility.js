// Whether a pregnancy can happen, from anatomy, settings and the infertile list.

/**
 * The PC's pregnancy checks that don't depend on the orifice, such as the impregnation and species settings,
 * the donor's infertility, and unfinished content.
 *
 * canPlayerConceive and playerPregnancyPossibleWith both run through this.
 *
 * The infertile and unfinished-content checks only match named NPCs, so a generated NPC passes them.
 *
 * @param {string} name the donor's name, or "pc"
 * @param {PregnancySpecies} species the donor's species
 * @param {boolean} forced a forced impregnation bypasses disableNormalImpregnation
 * @returns {boolean}
 */
function playerPregnancyEligible(name, species, forced) {
	if (impregnationDisabled(forced)) return false;
	if (!playerSpeciesPregnancyEnabled(species)) return false;
	if (setup.pregnancy.infertile.includes(name)) return false;
	if (V.settings.incompletePregnancyEnabled === false && C.npc[name] && !setup.pregnancy.canImpregnatePlayer.includes(name)) return false;
	return true;
}
window.playerPregnancyEligible = playerPregnancyEligible;

/**
 * Whether the PC can conceive from this donor in this orifice. Impregnation must be enabled, a named
 * donor must have finished pregnancy content (unless the unfinished-content toggle is on), the
 * species must be enabled, the donor must not be infertile, and the anus needs playerCanCarryAnally.
 * An unknown orifice throws. An unknown species throws.
 *
 * @param {"vagina"|"anus"} orifice which impregnable hole the cum went in
 * @param {string} donor who came inside: an NPC's name, or "pc"
 * @param {PregnancySpecies} donorSpecies the donor's species, so the right pregnancy setting gets checked
 * @param {boolean} [forced=false] the PC's Force Impregnation action, which ignores disableNormalImpregnation
 * @returns {boolean}
 */
function canPlayerConceive(orifice, donor, donorSpecies, forced = false) {
	if (orifice !== "vagina" && orifice !== "anus") throw new Error(`unknown orifice "${orifice}"`);
	childBaseSpecies(donorSpecies); // throws on unknown species
	if (!playerPregnancyEligible(donor, donorSpecies, forced)) return false;
	if (orifice === "anus" && !playerCanCarryAnally()) return false;
	return true;
}
window.canPlayerConceive = canPlayerConceive;

/**
 * Whether this NPC can conceive in this orifice. Checks the NPC pregnancy settings and a named
 * NPC's pregnancy toggles. An unknown orifice throws.
 *
 * @param {"vagina"|"anus"} orifice which impregnable hole the cum went in
 * @param {string} carrier the NPC's name
 * @param {string} donor who came inside them: an NPC's name, or "pc"
 * @returns {boolean}
 */
function canNpcConceive(orifice, carrier, donor) {
	if (orifice !== "vagina" && orifice !== "anus") throw new Error(`unknown orifice "${orifice}"`);
	if (!(C.npc[carrier] ? V.settings.nnpcPregnancyEnabled : V.settings.npcPregnancyEnabled)) return false;
	// A named NPC with pregnancy turned off can't conceive.
	if (C.npc[carrier] && C.npc[carrier].pregnancy && !C.npc[carrier].pregnancy.enabled) return false;
	if (orifice === "anus") {
		if (!V.settings.npcAnalPregnancyEnabled) return false;
		if (C.npc[carrier] && C.npc[carrier].pregnancy && C.npc[carrier].pregnancy.analEnabled === false) return false;
	}
	return !setup.pregnancy.infertile.includes(carrier) && !setup.pregnancy.infertile.includes(donor);
}
window.canNpcConceive = canNpcConceive;

/**
 * Whether impregnation is turned off. A forced impregnation ignores disableNormalImpregnation.
 *
 * @param {boolean} forced whether this is a forced impregnation
 * @returns {boolean}
 */
function impregnationDisabled(forced) {
	if (V.disableImpregnation) return true;
	if (V.disableNormalImpregnation && !forced) return true;
	return false;
}
window.impregnationDisabled = impregnationDisabled;

/**
 * Whether the pregnancy settings let the PC carry a pregnancy from this species.
 *
 * @param {PregnancySpecies} species the donor's species
 * @returns {boolean} false for an unknown species
 */
function playerSpeciesPregnancyEnabled(species) {
	switch (species) {
		case "human":
			return V.settings.playerPregnancyHumanEnabled !== false;
		case "wolf":
		case "wolfboy":
		case "wolfgirl":
			return V.settings.playerPregnancyBeastEnabled !== false;
		case "hawk":
		case "harpy":
			return V.settings.playerPregnancyBeastEnabled !== false && V.settings.playerPregnancyEggLayingEnabled !== false;
		default:
			return false;
	}
}
window.playerSpeciesPregnancyEnabled = playerSpeciesPregnancyEnabled;

/**
 * Whether the PC has a way to carry an anal pregnancy under the "exceptional circumstances" setting (ear slime, magic tattoo).
 *
 * Always false while the PC has a vagina.
 *
 * @returns {boolean}
 */
function hasExceptionalAnalPregnancy() {
	return !V.player.vaginaExist && (hasPregnancyTattoo() || (V.earSlime.growth >= 100 && ["pregnancy", "mixed"].includes(V.earSlime.focus)));
}

/**
 * Whether the PC has the magic pregnancy tattoo, which raises the chance of conceiving.
 *
 * @returns {boolean}
 */
function hasPregnancyTattoo() {
	return V.skin.pubic.pen === "magic" && V.skin.pubic.special === "pregnancy";
}
window.hasPregnancyTattoo = hasPregnancyTattoo;
window.hasExceptionalAnalPregnancy = hasExceptionalAnalPregnancy;

/**
 * Whether the PC can carry a pregnancy anally right now.
 *
 * "always" treats it like any other pregnancy,
 *
 * "exceptional" needs hasExceptionalAnalPregnancy, and any other value turns it off.
 *
 * @returns {boolean}
 */
function playerCanCarryAnally() {
	if (V.settings.analPregnancy === "always") return true;
	if (V.settings.analPregnancy === "exceptional") return hasExceptionalAnalPregnancy();
	return false;
}
window.playerCanCarryAnally = playerCanCarryAnally;

/**
 * Whether the PC and this NPC have the anatomy to breed.
 *
 * A PC who can only carry anally counts only for a named NPC who knows the PC has been pregnant.
 *
 * Accepts either a named NPC's name or a $NPCList entry, e.g.
 * playerCanBreedWith("Kylar") or playerCanBreedWith($NPCList[0]).
 *
 * @param {string|object} NPC the NPC's name, or a $NPCList entry
 * @returns {boolean}
 */
function playerCanBreedWith(NPC) {
	const { npc: resolvedNpc, name } = resolvePregnancyNpc(NPC);
	if (!resolvedNpc) return false;

	const playerCanCarry = V.player.vaginaExist || (playerCanCarryAnally() && C.npc[name] && knowsAboutAnyPregnancy("pc", name));
	const npcBreedsPlayer = playerCanCarry && resolvedNpc.penis !== "none";
	const playerBreedsNpc = V.player.penisExist && resolvedNpc.vagina !== "none";
	return npcBreedsPlayer || playerBreedsNpc;
}
window.playerCanBreedWith = playerCanBreedWith;

/**
 * Whether the PC could get this NPC pregnant, or this NPC could get the PC pregnant.
 *
 * @param {string|object} NPC a named NPC's name, or a $NPCList entry
 * @returns {boolean}
 */
function pregnancyCompatible(NPC) {
	return playerPregnancyPossibleWith(NPC) || NPCPregnancyPossibleWithPlayer(NPC);
}
window.pregnancyCompatible = pregnancyCompatible;

/**
 * Turns an NPC argument into one { npc, name, named } shape. `npc` is the resolved NPC, or null for an
 * unknown name. `name` is its key. `named` is true for a named NPC, false for a generated one.
 * NPCPregnancyPossibleWithPlayer reads `named` to apply the named-only rules.
 *
 * @param {string|object} NPC a named NPC's name, or a $NPCList entry
 * @returns {{npc: object|null, name: string, named: boolean}}
 */
function resolvePregnancyNpc(NPC) {
	// A $NPCList entry carries its name as fullDescription. Named NPCs in combat do too.
	const name = typeof NPC === "string" ? NPC : NPC.fullDescription;
	// A named NPC is one with an entry in C.npc.
	const npc = C.npc[name];
	if (npc) return { npc, name, named: true };
	if (typeof NPC === "string") return { npc: null, name: "", named: false };
	return { npc: NPC, name, named: false };
}
window.resolvePregnancyNpc = resolvePregnancyNpc;

/**
 * Whether the PC could get pregnant by this NPC.
 *
 * @param {string|object} NPC a named NPC's name, or a $NPCList entry
 * @returns {boolean}
 */
function playerPregnancyPossibleWith(NPC) {
	const { npc: resolvedNpc, name } = resolvePregnancyNpc(NPC);
	if (!resolvedNpc) return false;
	if (!playerPregnancyEligible(name, resolvedNpc.type, true)) return false;
	if (playerIsPregnant() || getParasiteObject().fetus.length) return false;
	if (!(V.player.vaginaExist || playerCanCarryAnally())) return false;
	if (resolvedNpc.gender !== "m" && resolvedNpc.gender !== "h") return false;
	if ("strapon" in resolvedNpc) return false;
	return true;
}
window.playerPregnancyPossibleWith = playerPregnancyPossibleWith;

/**
 * Whether this NPC could get pregnant by the PC.
 *
 * @param {string|object} NPC a named NPC's name, or a $NPCList entry
 * @returns {boolean}
 */
function NPCPregnancyPossibleWithPlayer(NPC) {
	const { npc: resolvedNpc, name, named } = resolvePregnancyNpc(NPC);
	if (!resolvedNpc) return false;
	if (impregnationDisabled(true)) return false;
	if (named) {
		// The infertile list and the pregnancy toggles only exist for named NPCs.
		if (setup.pregnancy.infertile.includes(name) || !resolvedNpc.pregnancy.enabled) return false;
		if (getActivePregnancies(name).length) return false;
	} else if (resolvedNpc.pregnancy) {
		return false;
	}
	if ((named ? V.settings.nnpcPregnancyEnabled : V.settings.npcPregnancyEnabled) === false) return false;
	if (!setup.pregnancy.typesEnabled.includes(resolvedNpc.type)) return false;
	if (!V.player.penisExist) return false;
	// A male NPC can only carry anally, so it needs the NPC anal pregnancy setting and its own anal toggle.
	if (resolvedNpc.gender === "m") {
		if (!V.settings.npcAnalPregnancyEnabled) return false;
		if (named && resolvedNpc.pregnancy.analEnabled === false) return false;
	}
	return true;
}
window.NPCPregnancyPossibleWithPlayer = NPCPregnancyPossibleWithPlayer;
