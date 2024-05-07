/**
 * @typedef {object} NpcObject
 * @property {string | 0 | null} vagina
 * @property {string | 0 | null} penis
 */

/**
 * @typedef {object} NpcOptions
 * @property {"img/newsex"} root
 * @property {string} src Typically "img/newsex/missionary/"
 * @property {"missionary" | "doggy"} position
 * @property {"shadow" | "beast"} category
 * @property {string} type
 * @property {Colour} colour
 * @property {string} state
 * @property {boolean} show
 * @property {Penetrator[]} penetrators
 */

/**
 * @typedef {object} Penetrator
 * @property {"human" | "strapon" | "knotted" | "equine" | "feline" | "sus"} type
 * @property {number} size
 * @property {string} colour
 * @property {-1|0|1|2|3|4|5} target PC is -1. NPCs are 0 to 5.
 * @property {string} position Area that the penetrator is in.
 * @property {string} state What it is doing in the position.
 * @property {string} isEjaculating Whether the penetrator is ejaculating.
 * @property {Ejaculate} ejaculate The type of ejaculate.
 * @property {string} hasCondom Whether the penetrator is wrapped in a condom.
 * @property {boolean} show Whether to render the penetrator.
 */

/**
 * @typedef {object} Ejaculate
 * @property {"sperm" | "pee" | "girlcum" | "sriracha"} type
 */

/**
 * @typedef {object} Colour
 * @property {string} hex
 */

const beastModels = ["bear", "boar", "cat", "creature", "dog", "dolphin", "fox", "horse", "lizard", "pig", "wolf"];

/**
 *
 * @param {number} index
 * @param {NpcOptions} options
 * @returns {NpcOptions}
 */
function mapNpcToOptions(index, options) {
	console.log("mapNpcToOptions", index, JSON.parse(JSON.stringify(options)));

	// Set position
	if (!["doggy", "missionary"].includes(V.position)) {
		Errors.report("Position not set to any valid values", V.position);
		options.position = "missionary";
	} else {
		options.position = V.position;
	}

	// Set directory for images
	options.root = "img/newsex";
	options.src = `${options.root}/${options.position}/`;

	// Configure state
	// Maybe use active_enemy? const index = V.active_enemy.
	const npc = V.NPCList[index];
	options.category = beastModels.includes(npc.type) ? "beast" : "shadow";
	options.type = npc.type;
	options.state = "default";
	options.show = false;

	mapNpcToBodyOptions(npc, options);

	// Set animation speed
	options.animKey = getNpcAnimationSpeed(options);
	options.animKeyStill = getNpcAnimationSpeed(options);

	return options;
}
window.mapNpcToOptions = mapNpcToOptions;

/**
 * @param {NpcOptions} options
 * @returns {string}
 */
function getNpcAnimationSpeed(options) {
	if (combat.isPenetrated()) {
		return "sex-4f-vfast";
	}
	if (combat.isActive()) {
		return "sex-4f-mid";
	}
	return "sex-2f-idle";
}

/**
 *
 * @param {NpcObject} npc
 * @param {NpcOptions} options
 * @returns {NpcOptions}
 */
function mapNpcToBodyOptions(npc, options) {
	options.penetrators = options.penetrators = [];
	const penetrator = mapNpcToPenetratorOptions(npc, options);
	if (penetrator != null) {
		console.log("Pushing penetrator to list:", penetrator);
		options.penetrators.push(penetrator);

		// Figure out which shadow base to use from penetrator:
		options.state = penetrator.position;

		if (options.category === "beast") {
			if (["horse", "centaur"].includes(npc.type)) {
				const isPenetrating = [V.anusstate, V.vaginastate].includes("penetrated");
				options.state = isPenetrating ? "over-penetrated" : "over-default";
				options.show = true;
				return options;
			}
			if (npc.stance === "top") {
				options.state = options.category === "shadow" ? "default" : "over-default";
				options.show = ["vagina", "anus"].includes(penetrator.position);
				return options;
			}
		}

		// Add penetrator states to NPC state so the shadows can be staggered for oral.
		/*
		if (penetrator.position === "mouth") {
			options.state += "-" + penetrator.state;
		}
		*/
		// Calculate DP state from positions, if position is >= 2, add double at least, triple P not sure what to do.
		if (combat.positions[penetrator.position] >= 2) {
			options.state += "-double";
			penetrator.state += "-double";
		}
		// Figure out whether to show the shadow man or not:
		options.show = ["vagina", "anus", "mouth"].includes(penetrator.position);

		return options;
	}
	// Since no penetrator exists on the NPC, check for their other states
	// WHY IS ANAL LIKE THIS
	if (["otheranusfrot", "otheranusentrance", "otheranusimminent", "otheranus"].includes(npc.penis)) {
		options.state = options.category === "shadow" ? "default" : "under-default";
		options.show = true;
		return options;
	}
	if (npc.vagina && npc.vagina !== "none") {
		console.warn("NPC's Vagina:", npc.vagina);
		switch (npc.vagina) {
			case "penisentrance":
			case "penisimminent":
			case "penis":
				if (options.category !== "shadow") {
					options.state = "penis";
					options.show = true;
				}
				break;
		}
	}
	// Primary for being pinned:
	if (npc.stance === "top") {
		options.state = options.category === "shadow" ? "default" : "over-default";
		options.show = true;
		return options;
	}

	return options;
}
window.mapNpcToBodyOptions = mapNpcToBodyOptions;

/**
 * @param {NpcObject} npc
 * @param {NpcOptions} options
 * @returns {Penetrator?}
 */
function mapNpcToPenetratorOptions(npc, options) {
	/** @type {Penetrator} */
	const penetrator = {
		show: true,
		type: npc.type,
		colour: npc.skincolour,
		target: combat.target.pc,
		isEjaculating: V.enemyarousal >= V.enemyarousalmax && wearingCondom(V.vaginatarget) !== "worn" && !npcHasStrapon(V.vaginatarget),
		ejaculate: {
			type: "sperm",
		},
	};
	if (["horse", "centaur"].includes(npc.type)) {
		if (options.position === "missionary") {
			return null;
		}
		penetrator.position = "default";
		penetrator.state = [V.anusstate, V.vaginastate].includes("penetrated") ? "penetrated" : "entrance";
		return penetrator;
	}
	switch (npc.penis) {
		case "anusentrance":
			penetrator.position = "anus";
			penetrator.state = "entrance";
			combat.positions.anus++;
			return penetrator;
		case "anusentrancedouble":
			penetrator.position = "anus";
			penetrator.state = "entrance";
			combat.positions.anus++;
			return penetrator;
		case "anus":
			penetrator.position = "anus";
			penetrator.state = "penetrated";
			combat.positions.anus++;
			return penetrator;
		case "anusdouble":
			penetrator.position = "anus";
			penetrator.state = "penetrated";
			combat.positions.anus++;
			return penetrator;
		case "penisentrance":
			return null;
		case "penisimminent":
			return null;
		case "penis":
			return null;
		case "vaginaentrance":
			penetrator.position = "vagina";
			penetrator.state = "entrance";
			combat.positions.vagina++;
			return penetrator;
		case "vaginaentrancedouble":
			penetrator.position = "vagina";
			penetrator.state = "entrance";
			combat.positions.vagina++;
			return penetrator;
		case "vaginaimminent":
			penetrator.position = "vagina";
			penetrator.state = "imminent";
			combat.positions.vagina++;
			return penetrator;
		case "vaginaimminentdouble":
			penetrator.position = "vagina";
			penetrator.state = "imminent";
			combat.positions.vagina++;
			return penetrator;
		case "vagina":
			penetrator.position = "vagina";
			penetrator.state = "penetrated";
			combat.positions.vagina++;
			return penetrator;
		case "vaginadouble":
			penetrator.position = "vagina";
			penetrator.state = "penetrated";
			combat.positions.vagina++;
			return penetrator;
		case "mouthentrance":
			penetrator.position = "mouth";
			penetrator.state = "entrance";
			combat.positions.mouth++;
			return penetrator;
		case "mouthimminent":
			penetrator.position = "mouth";
			penetrator.state = "imminent";
			combat.positions.mouth++;
			return penetrator;
		case "mouth":
			penetrator.position = "mouth";
			penetrator.state = "penetrated";
			combat.positions.mouth++;
			return penetrator;
		case "othermouth":
			// Not sure of the usage?
			// Maybe it shouldn't be part of npc.penis
			return null;
		case "feet":
			penetrator.position = "feet";
			penetrator.state = "footjob";
			return penetrator;
		case "footjob": // Duplicate of feet
			penetrator.position = "feet";
			penetrator.state = "footjob";
			return penetrator;
		case "clothed": // Huh? Asking Puri - For when you need to undress NPCs before using the part.
			return null;
		case "leftarm":
			penetrator.position = "leftarm";
			penetrator.state = "handjob";
			return penetrator;
		case "rightarm":
			penetrator.position = "rightarm";
			penetrator.state = "handjob";
			return penetrator;
		case "thighs":
			penetrator.position = "thighs";
			penetrator.state = "thighjob";
			return penetrator;
		case "cheeks":
			penetrator.position = "butt";
			penetrator.state = "buttjob";
			return penetrator;
		case "chest":
			penetrator.position = "chest";
			penetrator.state = "titjob";
			return penetrator;
		// case "leftDildoAnus":
		// case "rightDildoAnus":
		// case "leftStroker":
		// case "rightStroker":
		// case "strap-on":
		// case "mouthotheranus": (wtf is this?)
		// case "idle": (Pointless to account for this)
		// case "none": (No pp)
	}
	return null;
}
window.mapNpcToPenetratorOptions = mapNpcToPenetratorOptions;

Macro.add("mapnpctooptions", {
	handler() {
		const slot = this.args[0];
		const index = this.args[1];
		const options = T.options[slot] || {};
		T.options[slot] = mapNpcToOptions(index, options);
		console.log(T.options[slot]);
	},
});
