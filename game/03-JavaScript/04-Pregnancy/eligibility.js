// eligibility.js checks anatomy, settings, and scene flags and answers if pregnancy can happen here.

/**
 * Can pregnancy happen here? Yes or no.
 * The settings get read in here. The caller only passes what the scene knows.
 * An unknown orifice throws. An unknown species throws when the player is the carrier.
 *
 * @param {"vagina"|"anus"} orifice which impregnable hole the cum went in
 * @param {string} donorSpecies the donor's species, so the right pregnancy setting gets checked
 * @param {string} carrier who'd carry: "pc" for the player, or an NPC's name
 * @param {boolean} infertile is the carrier or the other party flagged infertile
 */
function canConceive(orifice, donorSpecies, carrier, infertile) {
	// An unknown orifice is a bug, not a no.
	if (orifice !== "vagina" && orifice !== "anus") throw new Error(`unknown orifice "${orifice}"`);

	const carrierIsPlayer = carrier === "pc";
	if (carrierIsPlayer) {
		// Each species answers to its own pregnancy setting.
		switch (childBaseSpecies(donorSpecies)) {
			case "human":
				if (!V.settings.playerPregnancyHumanEnabled) return false;
				break;
			case "wolf":
				if (!V.settings.playerPregnancyBeastEnabled) return false;
				break;
			case "hawk":
				// Birds are beasts that lay eggs, so both switches have a say.
				if (!V.settings.playerPregnancyBeastEnabled) return false;
				if (!V.settings.playerPregnancyEggLayingEnabled) return false;
				break;
		}
	} else if (!V.settings.npcPregnancyEnabled) {
		return false;
	}

	// A vagina is always a valid impregnable site. The anus has rules.
	if (orifice === "anus") {
		if (!V.settings.analPregnancyEnabled) return false;
		// A carrier with no womb needs mpreg to carry anally.
		// A carrier with one is just having an anal pregnancy, which is not mpreg.
		if (!carrierHasWomb(carrier) && !V.settings.mpregEnabled) return false;
	}

	if (infertile) return false;

	return true;
}
window.canConceive = canConceive;

/**
 * Does the carrier have a womb to carry in? The player, a named NPC, or a generated one from the scene.
 * A carrier we can't resolve is treated as having no womb, so mpreg is required rather than assumed.
 *
 * @param {string} carrier "pc" for the player, or an NPC's name / generated description
 * @returns {boolean}
 */
function carrierHasWomb(carrier) {
	if (carrier === "pc") return V.player.vaginaExist;
	// A named NPC keeps their anatomy in C.npc, where "none" means no vagina.
	if (C.npc[carrier]) return C.npc[carrier].vagina !== "none";
	// A generated NPC is only in the scene's NPCList. Their gender is their anatomy, f or h has a womb.
	const npc = V.NPCList?.find(n => n.fullDescription === carrier);
	return !!npc && (npc.gender === "f" || npc.gender === "h");
}
window.carrierHasWomb = carrierHasWomb;
