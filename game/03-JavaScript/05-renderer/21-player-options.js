// @ts-check
/* global FilterMap, Player, Bodywriting */

/**
 * @typedef Options
 * @type {object}
 * @property {"img/sex/"} root The root directory.
 * @property {"doggy"|"missionary"} position The position.
 * @property {boolean} showPlayer Flag to show the player model.
 * @property {boolean} showFace
 * @property {boolean} showClothing Flag to show the clothing layers.
 * @property {boolean} showNPCs Flag to show the NPC model(s).
 * @property {number} animSpeed The global speed to play animations.
 * Computed
 * @property {string} src The computed directory path for the position.
 * @property {string} animKey The key used for fetching the animation configuration.
 * @property {string} animKeyStill The key used for fetching the animation configuration for true still sprites.
 * @property {string} machineAnimKey The key used for fetching the animation configuration for machine sprites like milkers/dildos.
 * @property {number} breastSize The size of the player breasts.
 * @property {boolean} breastsExposed Whether the breasts are shown.
 * @property {Penetrator?} penetrator Typically the PC's penis, or strapon etc.
 * @property {"custom"|"light"|"medium"|"dark"|"gyaru"} skinType
 * @property {number} skinTone
 * @property {string} hairType The type of hair.
 * @property {string} hairLength The named stage of the hair length.
 * @property {string} hairColour
 * @property {string} hairFringeColour
 * @property {string} leftEye
 * @property {string} rightEye
 * @property {"up" | "down" | "footjob"} legBackPosition The position the back leg is in.
 * @property {"up" | "down" | "footjob"} legFrontPosition The position the front leg is in.
 * @property {"default"|"bound"|"bound2"|"handjob"} armBackPosition The position the back arm is in.
 * @property {"default"|"bound"|"bound2"|"handjob"} armFrontPosition The position the front arm is in.
 * @property {boolean} genitalsExposed
 * @property {boolean} inOral
 * @property {number} blush The volume of blush on the player, higher is more. (1 to 5, usually)
 * @property {number} tears The volume of tears the player displays, higher is more. (1 to 5, usually)
 * @property {Object<string, ClothingState>} clothes Template.
 * @property {object} filters The filters for layers.
 * @property {Props} props
 * @property {Machines} machines
 * @property {Tentacles} tentacles
 * @property {BodywritingOptions} bodywriting
 */

/**
 * @typedef {object} BodywritingOptions
 * @property {boolean} isEnabled
 * @property {BodywritingOption} forehead
 * @property {BodywritingOption} backCheek
 * @property {BodywritingOption} frontCheek
 * @property {BodywritingOption} backShoulder
 * @property {BodywritingOption} frontShoulder
 * @property {BodywritingOption} breasts
 * @property {BodywritingOption} back
 * @property {BodywritingOption} backBottom
 * @property {BodywritingOption} frontBottom
 * @property {BodywritingOption} pubic
 * @property {BodywritingOption} backThigh
 * @property {BodywritingOption} frontThigh
 */

/**
 * @typedef {object} BodywritingOption
 * @property {boolean} show
 * @property {string} area
 * @property {string} type
 */

/**
 * @typedef {object} Props
 * @property {Prop} bench
 * @property {Prop} examTable
 * @property {Prop} haybale
 * @property {Prop} hospitalBed
 * @property {Prop} ivBag
 * @property {TankProp} milkTank
 * @property {Prop} pillory
 * @property {TankProp} semenTank
 * @property {Prop} rail
 * @property {Prop} shakles
 * @property {Prop} table
 * @property {Prop} web
 * @property {Prop} leash
 */

/**
 * @typedef {object} Prop
 * @property {boolean} show
 */

/**
 * @typedef {object} TankProp
 * @property {boolean} show
 * @property {boolean} isFull
 * @property {1|2|3|4|5|6|7} volume
 */

/**
 * @typedef {object} Machines
 * @property {DildoMachine} dildo
 * @property {Machine} breastMilker
 * @property {Machine} penisMilker
 * @property {Machine} tattoo
 */

/**
 * @typedef {object} Machine
 * @property {boolean} show
 */

/**
 * @typedef {object} DildoMachine
 * @property {boolean} show
 * @property {"entrance" | "penetrated"} state
 */

/**
 * @typedef ClothingState
 * @type {object}
 * @property {ClothesItem} item The clothing item's setup with worn properties copied over.
 * @property {string?} name The name of the clothing directory.
 * @property {"up" | "down" | "footjob"} position Part of the file name for certain clothing, such as lowerwear.
 * @property {"full" | "chest" | "midriff" | "waist" | "thighs" | "knees" | "ankles" | "worn" | "up" | "down" | "footjob" | "totheside"} state The state of the clothing, the file name.
 * @property {boolean} show Whether to show the clothing layer.
 * @property {number} alpha The percent of the alpha channel. 1 is 100%, 0 is 0%.
 * @property {boolean} hasAccessory Whether the clothing uses accessory layer.
 * @property {boolean} hasBackImg Whether the clothing has a back img layer, typically for headwear or handhelds.
 * @property {PlayerBreastState} breasts Breast state.
 * @property {PlayerSleeveState} sleeves Sleeve state.
 */

/**
 * @typedef PlayerBreastState
 * @property {boolean} show
 * @property {number} size
 */

/**
 * @typedef PlayerSleeveState
 * @property {boolean} show
 * @property {string} state
 */

/**
 * @typedef Tentacles
 * @property {Tentacle} anus
 * @property {Tentacle} breasts
 * @property {Tentacle} feet
 * @property {Tentacle} backArm
 * @property {Tentacle} frontArm
 * @property {Tentacle} backLeg
 * @property {Tentacle} frontLeg
 * @property {Tentacle} mouth
 * @property {Tentacle} penis
 * @property {Tentacle} vagina
 */

/**
 * @typedef Tentacle
 * @property {boolean} show
 * @property {string?} state
 */

/**
 *
 * @param {Options} options
 * @returns {Options}
 */
function mapPlayerToOptions(options) {
	console.log("mapPlayerToOptions", JSON.parse(JSON.stringify(options)));

	// Set position
	if (!["doggy", "missionary"].includes(V.position)) {
		Errors.report("Position not set to any valid values", V.position);
		options.position = "missionary";
	} else {
		options.position = V.position;
	}

	// Set directory for images
	options.src = options.root + options.position + "/";

	// Set hair properties
	options.hairLength = V.hairlengthstage;
	options.hairType = "default";

	// Set breast exposed, for example, an NPC had pushed clothing aside to make tits fall out
	options.breastsExposed = true;

	// Copied from <<leg_position>> - Centralise usage later. Added footjob state
	mapPcToLegPosition(options);

	// Set values for blush and tears
	options.blush = Math.floor(Math.clamp(V.arousal / 2000 + 1, 0, 5));
	options.tears = painToTearsLvl(V.pain);

	// Ensure breast size is calculated before clothing options.
	const breastSize = Math.round(V.player.perceived_breastsize / 3);
	options.breastSize = Math.clamp(breastSize, 0, 4);

	// Clothing options
	mapPcToClothingOptions(V.player, options);

	// Ensure body options comes after clothing options
	mapPcToBodyOptions(V.player, options);

	options.penetrator = mapPcToPenetratorOptions(V.player, options);

	options.skinType = V.skinColor.natural;
	options.skinTone = V.skinColor.range / 100;

	options.hairColour = V.haircolour || "red";
	options.leftEye = V.eyeselect || "red";
	options.rightEye = V.eyeselect || "red";

	options.filters.leftEye = lookupColour(options, setup.colours.eyes_map, options.leftEye, "eyes", "eyes_custom", "eyes");
	options.filters.rightEye = lookupColour(options, setup.colours.eyes_map, options.rightEye, "eyes", "eyes_custom", "eyes");
	options.filters.hair = lookupColour(options, setup.colours.hair_map, options.hairColour, "hair", "hair_custom", "hair");
	options.filters.hairFringe = lookupColour(
		options,
		setup.colours.hair_map,
		options.hairFringeColour || options.hairColour,
		"hair_fringe",
		"hair_fringe_custom",
		"hair_fringe"
	);

	// Set props
	mapToPropsOptions(options);

	// Set machine
	mapToMachineOptions(options);

	// Set tentacles
	mapToTentacleOptions(options);

	// Set animation speed
	options.animKey = getPcAnimationSpeed(options);
	options.animKeyStill = getPcAnimationSpeed(options);
	options.machineAnimKey = getMachineAnimationSpeed(options);

	console.warn("===============================================");
	console.warn("=============== Player Options: ===============");
	console.warn("===============================================");
	console.log("Options:", JSON.parse(JSON.stringify(options)));

	return options;
}
window.mapPlayerToOptions = mapPlayerToOptions;

Macro.add("mapplayertooptions", {
	handler() {
		const slot = this.args[0];
		const options = T.options[slot] || {};
		T.options[slot] = mapPlayerToOptions(options);
	},
});

/**
 * @param {Options} options
 * @returns {string}
 */
function getPcAnimationSpeed(options) {
	if (options.props.semenTank.show || options.props.milkTank.show) {
		return "sex-2f-idle";
	}
	if (combat.isRapid()) {
		return "sex-4f-vfast";
	}
	if (combat.isActive()) {
		return "sex-4f-mid";
	}
	return "sex-2f-idle";
}
window.getPcAnimationSpeed = getPcAnimationSpeed;

/**
 * @param {Options} options
 * @returns {string}
 */
function getMachineAnimationSpeed(options) {
	if (options.machines.penisMilker.show || options.machines.breastMilker.show) {
		return "machine-2f-slow";
	}
	if (combat.isActive()) {
		return "machine-4f";
	}
	return "machine-4f-slow";
}
window.getMachineAnimationSpeed = getMachineAnimationSpeed;

/**
 *
 * @param {Options} options
 * @returns {Options}
 */
function mapToPropsOptions(options) {
	/**
	 * @param {number} source
	 * @returns {1 | 2 | 3 | 4 | 5 | 6 | 7}
	 */
	function mapVolume(source) {
		if (source >= 3000) {
			return 7;
		}
		if (source >= 2000) {
			return 6;
		}
		if (source >= 1500) {
			return 5;
		}
		if (source >= 1000) {
			return 4;
		}
		if (source >= 500) {
			return 3;
		}
		if (source >= 200) {
			return 2;
		}
		return 1;
	}

	/**
	 * @param {string} id
	 * @param {number} volume
	 * @returns {TankProp}
	 */
	function createTank(id, volume) {
		const level = mapVolume(volume);
		return {
			show: V.prop.includes(id),
			isFull: level === 7,
			volume: level,
		};
	}

	/**
	 * @param {string} id
	 * @returns {Prop}
	 */
	function createProp(id) {
		return {
			show: V.prop.includes(id),
		};
	}

	options.props = {
		bench: createProp("bench"),
		examTable: createProp("examtable"),
		haybale: createProp("haybale"),
		hospitalBed: createProp("hospitalbed"),
		ivBag: createProp("ivbag"),
		milkTank: createTank("milk", T.barn_milk),
		pillory: createProp("pillory"),
		semenTank: createTank("semen", T.barn_semen),
		rail: createProp("rails"),
		shakles: createProp("arm_shackle"), // Neck and leg shackle?
		table: createProp("table"),
		web: createProp("web"),
		leash: {
			show: V.worn.neck.collared === 1,
		},
	};

	return options;
}
window.mapToPropsOptions = mapToPropsOptions;

/**
 *
 * @param {Options} options
 * @returns {Options}
 */
function mapToMachineOptions(options) {
	/**
	 * @param {string} id
	 * @returns {Prop}
	 */
	function createMachine(id) {
		return {
			show: V.prop.includes(id),
		};
	}

	options.machines = {
		dildo: {
			show: false,
			state: "entrance",
		},
		penisMilker: createMachine("penis_pump"),
		breastMilker: createMachine("breast_pump"),
		tattoo: createMachine("tattoo"),
	};

	return options;
}
window.mapToMachineOptions = mapToMachineOptions;

/**
 * @returns {TentacleState[]}
 */
function getTentacles() {
	const count = V.tentacles.active;
	const tentacles = [];
	for (let i = 0; i < count; i++) {
		const tentacle = V.tentacles[i];
		tentacles.push(tentacle);
	}
	return tentacles;
}
window.getTentacles = getTentacles;

/**
 *
 * @param {Options} options
 * @returns {Options}
 */
function mapToTentacleOptions(options) {
	/**
	 * @param {...Object<string, string>} parts
	 * @returns {string?}
	 */
	function getTentacleHeadPosition(...parts) {
		const count = V.tentacles.max;
		// const count = V.tentacles.active;
		for (let i = 0; i < count; i++) {
			/** @type {TentacleState?} */
			const tentacle = V.tentacles[i];

			if (tentacle == null) {
				continue;
			}

			if (tentacle.tentaclehealth <= 0) {
				continue;
			}

			const part = parts.find(part => tentacle.head in part);
			if (part) {
				console.log("Tentacle", i, tentacle, "selected for:", parts);
				return part[tentacle.head];
			}
		}
		return null;
	}

	/**
	 * @param {...Object<string, string>} parts
	 * @returns {Tentacle}
	 */
	function getState(...parts) {
		const state = getTentacleHeadPosition(...parts);
		return {
			state,
			show: state != null,
		};
	}

	const tentacles = {
		mouth: getState({ mouthentrance: "oral-entrance" }, { mouthimminent: "oral-imminent" }, { mouth: "oral" }),
		breasts: getState(),
		backArm: getState({ leftarm: "handjob-left" }),
		frontArm: getState({ rightarm: "handjob-right" }),
		penis: getState(
			{ penisentrance: "penis-entrance-0" },
			{ penisimminent: "penis-imminent" },
			{ penis: "penis" },
			{ penisdeep: "penis" },
			{ penisrub: "penis" }
		),
		vagina: getState({ vaginaentrance: "vagina-entrance" }, { vaginaimminent: "vagina-imminent" }, { vagina: "vagina" }, { vaginadeep: "vagina" }),
		anus: getState({ anusentrance: "anal-entrance" }, { anusimminent: "anal-imminent" }, { anus: "anal" }, { anusrub: "anal-rub" }),
		backLeg: getState(),
		frontLeg: getState({ feet: "footjob" }, { leftlegentrance: "footjob" }),
		feet: getState(),
	};

	if (V.anusstate === "tentacledeep") {
		tentacles.anus = getState({ finished: "anal" });
	}
	if (V.feetstate === "tentacle") {
		tentacles.feet = getState({ finished: "footjob" });
	}
	switch (options.position) {
		case "doggy":
			tentacles.backArm = getState({ rightarm: "handjob-right" });
			tentacles.frontArm = getState({ leftarm: "handjob-left" });
			break;
		case "missionary":
			tentacles.backArm = getState({ leftarm: "handjob-left" });
			tentacles.frontArm = getState({ rightarm: "handjob-right" });
			break;
	}
	options.tentacles = tentacles;
	return options;
}
window.mapToTentacleOptions = mapToTentacleOptions;

/**
 *
 * @param {Options} options
 * @returns {Options}
 */
function mapPcToArmPosition(options) {
	if (options.position === "missionary") {
		options.armBackPosition = getArmState(V.leftarm);
		options.armFrontPosition = getArmState(V.rightarm);
		return options;
	}
	options.armBackPosition = getArmState(V.rightarm);
	options.armFrontPosition = getArmState(V.leftarm);
	return options;
}
window.mapPcToArmPosition = mapPcToArmPosition;

/**
 * @param {object} arm
 * @returns {"bound2" | "handjob" | "default"}
 */
function getArmState(arm) {
	if (["bound", "grappled", "behind"].includes(arm)) {
		return "bound2";
	}
	if (
		[
			"penis",
			"tentacle0",
			"tentacle1",
			"tentacle2",
			"tentacle3",
			"tentacle4",
			"tentacle5",
			"tentacle6",
			"tentacle7",
			"tentacle8",
			"tentacle9",
			"tentacle10",
			"tentacle11",
			"tentacle12",
			"tentacle13",
			"tentacle14",
			"tentacle15",
			"tentacle16",
			"tentacle17",
			"tentacle18",
			"tentacle19",
			"tentacle20",
		].includes(arm)
	) {
		return "handjob";
	}
	return "default";
}
window.getArmState = getArmState;

/**
 *
 * @param {Options} options
 * @returns {Options}
 */
function mapPcToLegPosition(options) {
	if (options.position === "missionary") {
		if (V.feetuse === "penis" || V.feetstate === "tentacle") {
			options.legFrontPosition = "footjob";
			options.legBackPosition = "up";
			return options;
		}
		if (V.NPCList.find(a => ["horse", "centaur"].includes(a.type))) {
			options.legFrontPosition = "down";
			options.legBackPosition = "up";
			return options;
		}
		if (V.NPCList.some(a => ["dog"].includes(a.type))) {
			options.legFrontPosition = "up";
			options.legBackPosition = "up";
			return options;
		}
	}
	if (V.feetuse === "penis" || V.feetstate === "tentacle") {
		options.legFrontPosition = "footjob";
		options.legBackPosition = "footjob";
		return options;
	}
	if (V.machine && V.machine.tattoo && ["left_thigh", "right_thigh"].includes(V.machine.tattoo.use)) {
		options.legFrontPosition = "up";
		options.legBackPosition = "up";
		return options;
	}
	if (options.position === "doggy") {
		options.legFrontPosition = "down";
		options.legBackPosition = "down";
		return options;
	}
	const parts = [V.anususe, V.vaginause, V.thighuse];
	if (parts.includes("penis") || parts.includes(1)) {
		options.legFrontPosition = "up";
		options.legBackPosition = "up";
		return options;
	}
	if (combat.positions.vagina >= 2 || combat.positions.anus >= 2) {
		options.legFrontPosition = "up";
		options.legBackPosition = "up";
		return options;
	}
	options.legFrontPosition = "down";
	options.legBackPosition = "down";
	return options;
}
window.mapPcToLegPosition = mapPcToLegPosition;

/**
 * @param {Options} options
 * @returns {boolean}
 */
function isPenisExposed(options) {
	const skirtExposedStates = ["neck", "midriff", "thighs", "knees", "ankles", "totheside"];
	const areLegsUp = ["up", "footjob"].includes(options.legBackPosition) || ["up", "footjob"].includes(options.legFrontPosition);
	if (options.position === "missionary" && areLegsUp) {
		skirtExposedStates.push("waist");
	}
	const lowerExposed = skirtExposedStates.includes(options.clothes.lower.state) || !options.clothes.lower.show;
	const underLowerExposed = skirtExposedStates.includes(options.clothes.under_lower.state) || !options.clothes.under_lower.show;
	const overLowerExposed = skirtExposedStates.includes(options.clothes.over_lower.state) || !options.clothes.over_lower.show;
	const clothingExposed = lowerExposed && underLowerExposed && overLowerExposed;

	return clothingExposed;
}
window.isPenisExposed = isPenisExposed;

/**
 *
 * @param {Player} pc
 * @param {Options} options
 * @returns {Penetrator?}
 */
function mapPcToPenetratorOptions(pc, options) {
	const hasPenetrator = pc.penisExist || playerHasStrapon();
	const isExposed = isPenisExposed(options);
	const hasChastityBelt = V.worn.genitals.name.includes("chastity belt");
	/** @type {Penetrator} */
	const penetrator = {
		show: hasPenetrator && isExposed && !hasChastityBelt,
		type: playerHasStrapon() ? "strapon" : "human",
		size: pc.penissize,
		colour: V.skinColor.current.penis,
		target: V.penistarget,
		isEjaculating:
			V.orgasmdown > 0 &&
			V.penisstate !== "penetrated" &&
			V.orgasmcount < 25 &&
			V.femaleclimax !== 1 &&
			!V.worn.genitals.name.includes("chastity belt") &&
			!playerHasStrapon() &&
			wearingCondom("player") !== "worn",
		ejaculate: {
			type: "sperm",
		},
		position: "default",
		state: "default",
		hasCondom: false,
	};
	switch (V.penisuse) {
		case 1:
		case 0:
			penetrator.position = "default";
			penetrator.state = "default";
			return penetrator;
		case "anusentrance":
			penetrator.position = "anus";
			penetrator.state = "entrance";
			return penetrator;
		case "anusentrancedouble":
			penetrator.position = "anus";
			penetrator.state = "entrancedouble";
			return penetrator;
		case "anus":
			penetrator.position = "anus";
			penetrator.state = "penetrated";
			return penetrator;
		case "anusdouble":
			penetrator.position = "anus";
			penetrator.state = "penetrateddouble";
			return penetrator;
		case "penisentrance":
			return null;
		case "penisimminent":
			return null;
		case "penis":
			return null;
		case "othervagina":
			penetrator.position = "vagina";
			penetrator.state = "entrance";
			return penetrator;
		case "vaginaentrance":
			penetrator.position = "vagina";
			penetrator.state = "entrance";
			return penetrator;
		case "vaginaentrancedouble":
			penetrator.position = "vagina";
			penetrator.state = "entrancedouble";
			return penetrator;
		case "vaginaimminent":
			penetrator.position = "vagina";
			penetrator.state = "imminent";
			return penetrator;
		case "vaginaimminentdouble":
			penetrator.position = "vagina";
			penetrator.state = "imminentdouble";
			return penetrator;
		case "vagina":
			penetrator.position = "vagina";
			penetrator.state = "penetrated";
			return penetrator;
		case "vaginadouble":
			penetrator.position = "vagina";
			penetrator.state = "penetrateddouble";
			return penetrator;
		case "mouthentrance":
			penetrator.position = "mouth";
			penetrator.state = "entrance";
			return penetrator;
		case "mouthimminent":
			penetrator.position = "mouth";
			penetrator.state = "imminent";
			return penetrator;
		case "mouth":
			penetrator.position = "mouth";
			penetrator.state = "penetrated";
			return penetrator;
		case "othermouth": // "Wraps its tongue around your penis"
			penetrator.position = "mouth";
			penetrator.state = "entrance";
			return penetrator;
		case "feet":
			penetrator.position = "feet";
			penetrator.state = "footjob";
			return penetrator;
		case "footjob": // Duplicate of feet
			penetrator.position = "feet";
			penetrator.state = "footjob";
			return penetrator;
		case "clothed": // Huh? Asking Puri - For when you need to undress NPCs before using the part.
			penetrator.position = "feet";
			penetrator.state = "footjob";
			return penetrator;
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
window.mapPcToPenetratorOptions = mapPcToPenetratorOptions;

/**
 *
 * @param {Player} pc
 * @param {Options} options
 * @returns {Options}
 */
function mapPcToClothingOptions(pc, options) {
	// Clothing filters and options
	for (const slot of setup.clothes_all_slots) {
		/** @type {ClothesItem} */
		const wornObj = V.worn[slot];

		/** @type {ClothesItem} */
		const setupObj = setup.clothes[slot][wornObj.index];

		const clothing = Object.assign({}, setupObj, wornObj);

		const name = clothing.combatImg ?? clothing.variable;
		let state = clothing.state;
		let show = name != null;
		// Any up legs are enough to force the up position.
		/** @type {"down" | "up" | "footjob"} */
		let position = "down";

		if (options.legBackPosition === "up" || options.legFrontPosition === "up") {
			position = "up";
		}

		if (options.legBackPosition === "footjob" || options.legFrontPosition === "footjob") {
			position = "footjob";
		}

		if (clothing.index === 0) {
			// Clothing is naked.
			show = false;
		}

		if (slot === "upper" && (state === 0 || (typeof state === "string" && !["midriff", "chest", "waist"].includes(state)))) {
			show = false;
		}

		if (slot === "under_upper" && (state === 0 || (typeof state === "string" && !["midriff", "chest", "waist"].includes(state)))) {
			show = false;
		}

		if (slot === "lower") {
			position = position === "down" ? "down" : "up";
		}

		if (slot === "under_lower") {
			// Slot for under lower configurations
			show = state !== 0 && ["ankles", "waist", "totheside"].includes(state);
		}

		if (slot === "feet") {
			state = options.legFrontPosition;
			// state = options.legBackPosition;
		}

		// Wetness
		let alpha = 1;
		const stage = V[slot + "wetstage"];
		if (stage != null) {
			alpha = Math.clamp(1 - stage / 4, 0, 1);
		}

		/**
		 * @type {ClothingState}
		 */
		const clothes = {
			item: clothing,
			name,
			position,
			state: state || "full",
			show,
			alpha,
			hasAccessory: clothing.accessory === 1,
			hasBackImg: [1, "combat"].includes(clothing.back_img),
			breasts: {
				show: false,
				size: 0,
			},
			sleeves: {
				show: false,
				state: "default",
			},
		};

		if (["upper", "under_upper", "over_upper"].includes(slot)) {
			if (clothing.sleeve_img === 1) {
				clothes.sleeves.show = true;
				clothes.sleeves.state = "default";
			}
			if (clothing.breast_img !== 0) {
				clothes.breasts.show = true;
				clothes.breasts.size = options.breastSize;
			}
		}

		options.clothes = options.clothes || {};
		options.clothes[slot] = clothes;

		const mainFilterKey = `worn_${slot}_main`;
		const accFilterKey = `worn_${slot}_acc`;

		options.filters = options.filters || {
			worn: {},
		};
		options.filters.worn[slot] = {};

		const colour = clothing.colour || clothing.colour_combat;
		const debugName = slot + " clothing";
		const filterName = "worn_" + slot + "_custom";
		console.log("Clothing colour:", slot, colour);
		options.filters[mainFilterKey] = colour
			? lookupColour(options, setup.colours.clothes_map, colour, debugName, filterName, clothing.prefilter)
			: Renderer.emptyLayerFilter();

		const accColour = clothing.accessory_colour || clothing.accessory_colour_combat;
		const accDebugName = slot + " accessory";
		const accFilterName = "worn_" + slot + "_acc_custom";
		options.filters[accFilterKey] = accColour
			? lookupColour(options, setup.colours.clothes_map, accColour, accDebugName, accFilterName, clothing.prefilter)
			: Renderer.emptyLayerFilter();
	}
	return options;
}
window.mapPcToClothingOptions = mapPcToClothingOptions;

/**
 * @param {Player} pc
 * @param {Options} options
 * @returns {Options}
 */
function mapPcToBodyOptions(pc, options) {
	mapPcToArmPosition(options);
	mapPcToBodywritingOptions(pc, options);
	return options;
}
window.mapPcToBodyOptions = mapPcToBodyOptions;

/**
 * @param {Player} pc
 * @param {Options} options
 */
function mapPcToBodywritingOptions(pc, options) {
	/**
	 * @param {string} id
	 * @param {function(string, Bodywriting): BodywritingOption?} mapper
	 * @returns {BodywritingOption}
	 */
	function getState(id, mapper) {
		/** @type {Bodywriting=} */
		const bodywriting = V.skin[id];

		const defaultState = {
			show: false,
			area: "text",
			type: id,
		};

		if (bodywriting == null || !bodywriting.writing) {
			return defaultState;
		}

		const options = mapper(id, bodywriting);
		return options || defaultState;
	}

	/**
	 * @param {string} id
	 * @param {Bodywriting} bodywriting
	 * @returns {BodywritingOption?}
	 */
	function simpleText(id, bodywriting) {
		if (bodywriting.type !== "text") {
			return null;
		}
		return {
			show: true,
			area: "text",
			type: id,
		};
	}

	if (options.position === "missionary") {
		options.bodywriting = options.bodywriting || {
			isEnabled: V.options.bodywritingImages === true,
			forehead: {
				show: false,
				type: "forehead",
			},
			backCheek: getState("right_cheek", (id, bodywriting) => {
				if (bodywriting.type === "text" || bodywriting.special === "islander") {
					return {
						show: true,
						area: "text",
						type: id,
					};
				}
				if (bodywriting.type === "object") {
					return {
						show: true,
						area: bodywriting.writing,
						type: id,
					};
				}
				return null;
			}),
			frontCheek: {
				show: false,
				type: "left_cheek",
			},
			backShoulder: getState("right_shoulder", (id, bodywriting) => {
				if (bodywriting.type === "text" || bodywriting.special === "islander") {
					return {
						show: true,
						area: "text",
						type: id,
					};
				}
				if (bodywriting.type !== "object") {
					return null;
				}
				if (V.leftarm === "bound" || V.rightarm === "grappled" || V.leftarm === "behind") {
					return {
						show: true,
						area: bodywriting.writing,
						type: "left_shoulder_bound",
					};
				}
				return {
					show: true,
					area: bodywriting.writing,
					type: id,
				};
			}),
			frontShoulder: {
				show: false,
				type: "left_shoulder",
			},
			breasts: getState("breasts", simpleText),
			back: getState("back", simpleText),
			backBottom: getState("right_bottom", simpleText),
			frontBottom: {
				show: false,
				type: "left_bottom",
			},
			pubic: getState("pubic", (id, bodywriting) => {
				if (bodywriting.type === "text") {
					return {
						show: true,
						area: "text",
						type: id,
					};
				}
				if (bodywriting.type === "object" && bodywriting.special !== "islander") {
					return {
						show: true,
						area: bodywriting.writing,
						type: id,
					};
				}
				return null;
			}),
			backThigh: getState("right_thigh", simpleText),
			frontThigh: getState("left_thigh", (id, bodywriting) => {
				if (bodywriting.type === "text" || bodywriting.special === "islander") {
					return {
						show: true,
						area: "text",
						type: bodywriting.arrow === 1 ? id + "_arrow" : id,
					};
				}
				if (bodywriting.type === "object") {
					return {
						show: true,
						area: bodywriting.writing,
						type: id,
					};
				}
				return null;
			}),
		};
		return options;
	}

	options.bodywriting = options.bodywriting || {
		isEnabled: V.options.bodywritingImages === true,
		forehead: {
			show: false,
			type: "forehead",
		},
		backCheek: getState("left_cheek", (id, bodywriting) => {
			if (bodywriting.type === "text" || bodywriting.special === "islander") {
				return {
					show: true,
					area: "text",
					type: id,
				};
			}
			if (bodywriting.type === "object") {
				return {
					show: true,
					area: bodywriting.writing,
					type: id,
				};
			}
			return null;
		}),
		frontCheek: {
			show: false,
			type: "right_cheek",
		},
		backShoulder: getState("left_shoulder", (id, bodywriting) => {
			if (bodywriting.type === "text" || bodywriting.special === "islander") {
				return {
					show: true,
					area: "text",
					type: id,
				};
			}
			if (bodywriting.type !== "object") {
				return null;
			}
			if (V.leftarm === "bound" || V.rightarm === "grappled" || V.leftarm === "behind") {
				return {
					show: true,
					area: bodywriting.writing,
					type: "left_shoulder_bound",
				};
			}
			return {
				show: true,
				area: bodywriting.writing,
				type: id,
			};
		}),
		frontShoulder: {
			show: false,
			type: "right_shoulder",
		},
		breasts: getState("breasts", simpleText),
		back: getState("back", simpleText),
		backBottom: getState("left_bottom", simpleText),
		frontBottom: {
			show: false,
			type: "right_bottom",
		},
		pubic: getState("pubic", (id, bodywriting) => {
			if (bodywriting.type === "text") {
				return {
					show: true,
					area: "text",
					type: id,
				};
			}
			if (bodywriting.type === "object" && bodywriting.special !== "islander") {
				return {
					show: true,
					area: bodywriting.writing,
					type: id,
				};
			}
			return null;
		}),
		backThigh: getState("left_thigh", simpleText),
		frontThigh: getState("right_thigh", (id, bodywriting) => {
			if (bodywriting.type === "text" || bodywriting.special === "islander") {
				return {
					show: true,
					area: "text",
					type: bodywriting.arrow === 1 ? id + "_arrow" : id,
				};
			}
			if (bodywriting.type === "object") {
				return {
					show: true,
					area: bodywriting.writing,
					type: id,
				};
			}
			return null;
		}),
	};
}
window.mapPcToBodywritingOptions = mapPcToBodywritingOptions;

/**
 * For colour name, lookup its canvas filter and merge with sprite prefilter.
 *
 * @param {object} options Options
 * @param {Object<string, FilterMap>} dict map in setup.colours to lookup in
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
