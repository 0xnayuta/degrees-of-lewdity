/**
 * @typedef {object} CloseOptions
 * @property {boolean} showChest
 * @property {boolean} showPenis
 * @property {boolean} showVagina
 * @property {boolean} showArse
 * @property {string} src Source directory for closeup images.
 * @property {"doggy"|"missionary"} position Doggy or missionary position.
 * @property {1|2|3|4|5|6|7|8|9|10|11|12|"topdown"} breasts Breast size, or topdown sprites if size >= 8. (May want to add ability to toggle views.)
 * @property {"parasite"|"herm-balls"|"herm-base"} herm Player penis, used in vagina closeup.
 * @property {penis} penis Player penis, used in penis closeup.
 * @property {"entrance"|"penetrated"} anus Player arse state. Penetrated or entrance.
 * @property {"entrance"|"penetrated"} vagina Player vagina state. Penetrated or entrance.
 * @property {"beast"|"beast-oral"|"horse"|"machine"|"npc"|"tentacle"} anusNpc Type of npc penetrating player anus.
 * @property {"beast"|"beast-oral"|"horse"|"npc"|"tentacle"} vaginaNpc Type of npc penetrating player vagina.
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

	// Colours TODO
	options.filters = {};
	options.skinType = V.skinColor.natural;
	options.skinTone = V.skinColor.range / 100;
	options.pbhairColour = V.makeup.pbcolour || V.naturalhaircolour;

	options.filters.body = setup.colours.getSkinFilter(options.skinType, options.skinTone);
	options.filters.pbhair = lookupColour(options, setup.colours.hair_map, options.pbhairColour || options.pbHairColour, "pbhair", "pbhair_custom", "pbhair");

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
	if (options.showVagina) {
		mapClosePenetrators("vagina", options);
	}
	if (options.showPenis) {
		mapClosePenis(options);
	}

	// Hermaphrodite
	if (V.player.penisExist && V.player.vaginaExist && V.worn.genitals.name !== "chastity parasite") {
		if (V.player.gender === "f" && !["none", "pregnancy"].includes(V.earSlime.focus)) {
			options.herm = "parasite";
		} else if (V.player.ballsExist) {
			options.herm = `herm-balls`;
		} else {
			options.herm = "herm-base";
		}
	}

	// Worn Items TODO

	if (!isNaN(V.anustarget) && V.NPCList[V.anustarget] && V.NPCList[V.anustarget].condom) {
		options.npc_condom_colour = V.NPCList[V.anustarget].condom.colour;
	}
	if (!isNaN(V.anusdoubletarget) && V.NPCList[V.anusdoubletarget] && V.NPCList[V.anusdoubletarget].condom) {
		options.dp_condom_colour = V.NPCList[V.anusdoubletarget].condom.colour;
	}

	// Set animation speed
	const speedChest = combat.isChestActive() ? "mid" : "slow";
	const framesChest = V.player.breastsize >= 8 ? 10 : 6;
	options.animKeyChest = `sex-${framesChest}f-${speedChest}`;

	options.animKeyVagina = `sex-6f-${combat.isVaginaActive() ? "vfast" : "mid"}`;
	options.animKeyArse = `sex-6f-${combat.isAnusActive() ? "vfast" : "mid"}`;
	options.animKeyPenis = `sex-6f-${combat.isPenisActive() ? "vfast" : "mid"}`;

	return options;
}
window.getCloseOptions = getCloseOptions;

function mapClosePenetrators(slot, options) {
	const activeEnemy = V.NPCList[V.active_enemy].type;
	const chastity = (playerChastity("hidden") || V.worn.genitals.name === "chastity parasite") && !playerHasStrapon() && slot === "vagina";
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

	if (!isNaN(V[slot + "target"]) && V.NPCList[V[slot + "target"]] && V.NPCList[V[slot + "target"]].condom) {
		options[slot + "NpcCondom"] = V.NPCList[V[slot + "target"]].condom.colour;
	}
	if (!isNaN(V[slot + "doubletarget"]) && V.NPCList[slot + "doubletarget"] && V.NPCList[slot + "doubletarget"].condom) {
		options[slot + "NpcCondom"] = V.NPCList[V.anusdoubletarget].condom.colour;
	}
}
window.mapClosePenetrators = mapClosePenetrators;

function mapClosePenis(options) {
	/* player penis type */
	options.penis = {
		type: V.player.gender === "f" ? "parasite" : V.player.ballsExist === "false" ? "herm" : "penis",
		isChastity: V.worn.genitals.name.includes("cage") && !playerHasStrapon(),
		chastity: "chastity-" + V.worn.genitals.name === "flat chastity cage" ? "flat" : V.worn.genitals.name === "small chastity cage" ? "small" : "base",
	};

	/* npc targeting player penis */
	switch (V.penisstate) {
		case "tentacle":
		case "tentacledeep":
		case "tentacleentrance":
		case "tentacleimminent":
			/* penis penetrating, or preparing to penetrate, tentussy */
			options.penis.state = ["tentacle", "tentacledeep"].includes(V.penisstate) ? "penetrated" : "entrance";
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
}
window.mapClosePenis = mapClosePenis;

Macro.add("mapcloseoptions", {
	handler() {
		const slot = this.args[0];
		const options = T.options[slot] || {};
		T.options[slot] = getCloseOptions(options);
	},
});

/**
 * For colour name, lookup its canvas filter and merge with sprite prefilter.
 *
 * @param {object} options Options
 * @param {Object<string, object>} dict map in setup.colours to lookup in
 * @param {string} key colour name.
 * @param {string} debugName used when reporting errors
 * @param {string} customFilterName key in options.filters
 * @param {string | undefined} prefilterName name of prefilter to apply
 * @returns {CompositeLayerParams} CompositeLayerParams - Check TS docs for model.d.ts
 */
function lookupColour(options, dict, key, debugName, customFilterName, prefilterName) {
	console.log("lookupColour", dict, key, debugName, customFilterName, prefilterName);
	let filter;
	if (key === "custom") {
		filter = clone(options.filters[customFilterName]);
		if (!filter) {
			console.error("custom " + debugName + " colour not configured");
			return {};
		}
	} else {
		const record = dict[key];
		if (!record) {
			console.error("unknown " + debugName + " colour: " + key);
			return {};
		}
		filter = clone(record.canvasfilter);
	}

	if (prefilterName) {
		Renderer.mergeLayerData(filter, setup.colours.sprite_prefilters[prefilterName], true);
	}
	return filter;
}
window.lookupColour = lookupColour;
