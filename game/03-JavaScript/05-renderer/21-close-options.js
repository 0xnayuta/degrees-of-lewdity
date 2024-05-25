/**
 * @typedef {object} CloseOptions
 * @property {boolean} showChest
 * @property {boolean} showPenis
 * @property {boolean} showVagina
 * @property {boolean} showArse
 * @property {string} src Source directory for closeup images.
 * @property {"doggy"|"missionary"} position Doggy or missionary position.
 * @property {number|"topdown"} breasts Breast size, or topdown sprites if size >= 8. (May want to add ability to toggle views.)
 * @property {"parasite"|"herm-balls"|"herm-base"} herm Player penis, used in vagina closeup.
 * @property {penis} penis Player penis, used in penis closeup.
 * @property {"entrance"|"penetrated"} anus Player arse state. Penetrated or entrance.
 * @property {"entrance"|"penetrated"} vagina Player vagina state. Penetrated or entrance.
 * @property {"beast"|"beast-oral"|"horse"|"machine"|"npc"|"tentacle"} anusNpc Type of npc penetrating player anus.
 * @property {"beast"|"beast-oral"|"horse"|"machine"|"npc"|"tentacle"} vaginaNpc Type of npc penetrating player vagina.
 * @property {"beast"|"penis"|"tentacle"} breastsNpc Type of npc giving boobjob.
 * @property {object} filters The filters for layers.
 */

/**
 * @param {CloseOptions} options
 * @returns {CloseOptions}
 */

function getCloseOptions(options = {}) {
	// Source directory
	options.src = "img/newsex/close/";

	// Show Conditions
	options.showPenis = (V.player.penisExist || playerHasStrapon()) && V.worn.under_lower.vagina_exposed === 1 && V.worn.lower.vagina_exposed === 1;
	options.showVagina = V.player.vaginaExist && V.worn.under_lower.vagina_exposed === 1 && V.worn.lower.vagina_exposed === 1;
	options.showChest = combat.isChestActive() || (V.worn.under_upper.exposed >= 1 && V.worn.upper.exposed >= 2);
	options.showArse = V.worn.under_lower.anus_exposed === 1 && V.worn.lower.anus_exposed === 1;

	// Position
	options.position = V.position === "wall" ? "doggy" : V.position;

	// Breasts
	if (["penis", "tentacle"].includes(V.chestuse)) {
		options.breasts = `${V.player.breastsize >= 8 ? "topdown-job" : V.player.breastsize}-job`;
	} else {
		options.breasts = V.player.breastsize;
	}
	options.breastsNpc = options.breasts === "topdown-job" ? "penis-topdown" : V.enemytype === "beast" ? "beast" : V.chestuse;

	// Genitals
	if (options.showArse) {
		mapClosePenetrators("anus", options);
	}
	if (V.player.vaginaExist) {
		mapClosePenetrators("vagina", options);
	}
	if (V.player.penisExist) {
		mapClosePenis(options);
	}

	// Colours
	options.skinType = V.skinColor.natural;
	options.skinTone = V.skinColor.range / 100;
	options.pbhairColour = V.makeup.pbcolour || V.naturalhaircolour;
	options.condomColour = V.player.condom.colour || "red";
	options.clitParasite = options.clitParasite || "red";
	options.tentacleColour = V.tentacleColour || "tentacles-purple";
	options.filters = options.filters || {
		worn: {},
	};
	options.filters.body = setup.colours.getSkinFilter(options.skinType, options.skinTone);
	options.filters.pbhair = window.lookupColour(
		options,
		setup.colours.hair_map,
		options.pbhairColour || options.pbHairColour,
		"pbhair",
		"pbhair_custom",
		"pbhair"
	);
	options.filters.condom = window.lookupColour(options, setup.colours.condom_map, options.condomColour, "condom", "condom_custom", "condom");
	options.filters.tentacle = window.lookupColour(options, setup.colours.clothes_map, options.tentacleColour, "tentacle", "tentacle_custom", "tentacle");
	window.mapPcToClothingOptions(V.player, options);

	if (["parasite", "parasitem"].includes(V.parasite.clit.name) || ["parasite"].includes(V.parasite.penis.name)) {
		options.filters.parasitePanties = window.lookupColour(options, setup.colours.clothes_map, "red", "parasitePanties");
	}

	// Set animation speed
	const speedChest = combat.isChestActive() ? "mid" : "slow";
	const framesChest = V.player.breastsize >= 8 ? 10 : 6;
	options.animKeyChest = `sex-${framesChest}f-${speedChest}`;

	options.animKeyVagina = `sex-${combat.isVaginaActive("close") ? (combat.isRapid() ? "6f-vfast" : "6f-mid") : "1f-idle"}`;
	options.animKeyArse = `sex-${combat.isAnusActive("close") ? (combat.isRapid() ? "6f-vfast" : "6f-mid") : "1f-idle"}`;
	options.animKeyPenis = `sex-${combat.isPenisActive("close") ? (combat.isRapid() ? "6f-vfast" : "6f-mid") : "1f-idle"}`;

	return options;
}
window.getCloseOptions = getCloseOptions;

function mapClosePenetrators(slot, options) {
	const activeEnemy = V.NPCList[V.active_enemy].type;
	const chastity = (playerChastity("hidden") || V.worn.genitals.name === "chastity parasite") && slot === "vagina" && !playerHasStrapon();
	const npc = ["horse", "centaur"].includes(activeEnemy) ? "horse" : ["beast", "machine"].includes(V.enemytype) ? V.enemytype : "npc";
	/* check $anusstate or $vaginastate */
	switch (V[slot + "state"]) {
		case "tentacle":
		case "tentacledeep":
		case "tentacleentrance":
		case "tentacleimminent":
			/* tentacle penetrating, or preparing to penetrate, anus/vagina */
			options[slot] = chastity ? "chastity" : ["tentacle", "tentacledeep"].includes(V[slot + "state"]) ? "penetrated" : "entrance";
			options[slot + "Npc"] = "tentacle";
			break;
		case "entrance":
		case "imminent":
		case "penetrated":
			/* other enemy types penetrating, or preparing to penetrate, anus/vagina */
			options[slot] = chastity ? "chastity" : ["penetrated", "doublepenetrated"].includes(V[slot + "state"]) ? "penetrated" : "entrance";
			options[slot + "Npc"] = npc;
			break;
		case "doublepenetrated":
			options[slot] = chastity ? "chastity" : "penetrated";
			options[slot + "Npc"] = "top";
			options[slot + "Npc2"] = "bottom";
			break;
		case "othermouth":
		case "othermouthentrance":
		case "othermouthimminent":
			/* beast oral. worst naming convention ever. */
			if (V.enemytype === "beast" && V.monster !== 1) {
				options[slot] = V[slot + "state"] === "othermouth" ? "penetrated" : "entrance";
				options[slot + "Npc"] = "beast-oral";
			} else {
				/* if monsterperson, no beast sprites; anus or vagina is not actively in use */
				options[slot] = "entrance";
				options[slot + "Npc"] = null;
			}
			break;
		default:
			/* anus or vagina is not actively in use */
			options[slot] = "entrance";
			options[slot + "Npc"] = null;
	}
	const belt = V.worn.genitals.name === "gold chastity belt" ? "gold-belt" : "belt";
	if (chastity && slot === "vagina") {
		options.chastityDevice = V.worn.genitals.name === "chastity parasite" ? `chastity-parasite-${V.player.penissize}` : `chastity-${belt}`;
	}
}
window.mapClosePenetrators = mapClosePenetrators;

function mapClosePenis(options) {
	const chastityTypes = {
		"chastity belt": "belt",
		"gold chastity belt": "belt-gold",
		"chastity parasite": `parasite-${V.player.penissize + 2}`,
		"flat chastity cage": "flat",
		"small chastity cage": "small",
	};
	const chastityDevice = chastityTypes[V.worn.genitals.name] || "base";
	const penisType = V.player.gender === "f" ? "parasite" : V.player.ballsExist ? "penis" : "herm";
	/* V.showPenisSize is a placeholder, in case we ever get visual representation of other penis sizes in the closeups */
	options.penis = {
		type: penisType,
		size: V.showPenisSize ? V.player.penissize : 1,
		condom: V.player.condom && !playerChastity(),
		chastityDevice: `chastity-${V.worn.genitals.name.includes("cage") ? "cage-" + chastityDevice : chastityDevice}`,
		chastityPenis: `chastity-${penisType + "-"}${chastityDevice}`,
	};

	/* npc targeting player penis */
	switch (V.penisstate) {
		case "tentacle":
		case "tentacledeep":
		case "tentacleentrance":
		case "tentacleimminent":
			/* penis penetrating, or preparing to penetrate, tentussy */
			options.penis.state = playerChastity() ? "chastity" : ["tentacle", "tentacledeep"].includes(V.penisstate) ? "penetrated" : "entrance";
			options.penis.npc = "tentacle";
			break;
		case "entrance":
		case "imminent":
		case "otheranusimminent":
		case "otheranusentrance":
			/* penis preparing to penetrate npc */
			options.penis.state = "entrance";
			options.penis.npc = V.enemytype === "beast" && V.monster !== 1 ? "beast" : "npc";
			break;
		case "penetrated":
		case "otheranus":
			/* penis penetrating npc */
			options.penis.state = "penetrated";
			options.penis.npc = V.enemytype === "beast" && V.monster !== 1 ? "beast" : "npc";
			break;
		case "othermouth":
		case "othermouthentrance":
		case "othermouthimminent":
			/* penis penetrating beast mouth */
			if (V.enemytype === "beast" && V.monster !== 1) {
				options.penis.state = V.penisstate === "othermouth" ? "penetrated" : V.penisstate === "othermouthimminent" ? "imminent" : "entrance";
				options.penis.npc = "beast-oral";
			} else {
				/* if monsterperson, no beast sprites. no oral sprites */
				options.penis.state = "entrance";
				options.penis.npc = null;
			}
			break;
		default:
			/* penis is not actively in use */
			options.penis.state = "entrance";
			options.penis.npc = null;
	}
	return options.penis;
}
window.mapClosePenis = mapClosePenis;
