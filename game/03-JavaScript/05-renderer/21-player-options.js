/* eslint-disable jsdoc/no-undefined-types */
/**
 * @typedef Options
 * @type {object}
 * @property {"img/sex/"} root The root directory.
 * @property {"doggy"|"missionary"} position The position.
 * @property {boolean} showPlayer Flag to show the player model.
 * @property {boolean} showClothing Flag to show the clothing layers.
 * @property {boolean} showNPCs Flag to show the NPC model(s).
 * @property {number} animSpeed The global speed to play animations.
 * Computed
 * @property {string} src The computed directory path for the position.
 * @property {string} animKey The key used for fetching the animation configuration.
 * @property {string} animKeyStill The key used for fetching the animation configuration for true still sprites.
 * @property {string} machineAnimKey The key used for fetching the animation configuration for machine sprites like milkers/dildos.
 * @property {number} breastSize The size of the player breasts.
 * @property {number} breastsExposed Whether the breasts are shown.
 * @property {Penetrator} penetrator Typically the PC's penis, or strapon etc.
 * @property {string} hairType The type of hair.
 * @property {string} hairLength The named stage of the hair length.
 * @property {"up"|"down"|"footjob"} legBackPosition The position the back leg is in.
 * @property {"up"|"down"|"footjob"} legFrontPosition The position the front leg is in.
 * @property {"default"|"bound"|"bound2"|"handjob"} armBackPosition The position the back arm is in.
 * @property {"default"|"bound"|"bound2"|"handjob"} armFrontPosition The position the front arm is in.
 * @property {boolean} genitalsExposed
 * @property {1|2|3|4|5} blush The volume of blush on the player, higher is more.
 * @property {1|2|3|4|5} tears The volume of tears the player displays, higher is more.
 * @property {Object<string, ClothingState>} clothes Template.
 * @property {object} filters The filters for layers.
 * @property {Props} props
 * @property {Machines} machines
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
 * @property {string} name The name of the clothing directory.
 * @property {string} state The state of the clothing, the file name.
 * @property {number} alpha The percent of the alpha channel. 1 is 100%, 0 is 0%.
 * @property {boolean} hasAccessory Whether the clothing uses accessory layer.
 * @property {boolean} hasBreasts Whether the clothing uses breast sprites.
 * @property {string} breasts Breast state.
 * @property {boolean} hasSleeves Whether the clothing uses sleeve sprites.
 * @property {string} sleeves Sleeve state.
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

	// Set animation speed
	options.animKey = combat.isActive() ? "sex-4f-vfast" : "sex-2f-idle";
	options.animKeyStill = combat.isActive() ? "sex-4f-vfast" : "sex-1f-idle";
	options.machineAnimKey = combat.isActive() ? "machine-4f" : "machine-2f";

	// Ensure breast size is calculated before clothing options.
	options.breastSize = Math.clamp(V.player.perceived_breastsize / 3, 0, 4);

	// Clothing options
	mapPcToClothingOptions(V.player, options);

	// Ensure body options comes after clothing options
	mapPcToBodyOptions(V.player, options);

	/** @type {Penetrator} */
	const penetrator = mapPcToPenetratorOptions(V.player, options);
	options.penetrator = penetrator;

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
	mapPcToPropsOptions(options);

	// Set machine
	mapPcToMachineOptions(options);

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
 *
 * @param {Options} options
 * @returns {Options}
 */
function mapPcToPropsOptions(options) {
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

	const propList = ["bench", "examTable", "haybale", "hospitalBed", "ivBag", "milkTank", "pillory", "semenTank", "rail", "shakles", "table", "web"];
	options.props = {};
	propList.forEach(p => {
		options.props[p] = { show: false };
	});
	if (V.prop.includes("haybale")) {
		options.props.haybale = {
			show: true,
		};
	}

	if (V.prop.includes("milk")) {
		const volume = mapVolume(T.barn_milk);
		options.props.milkTank = {
			show: true,
			isFull: volume === 7,
			volume,
		};
	}
	if (V.prop.includes("semen")) {
		const volume = mapVolume(T.barn_semen);
		options.props.semenTank = {
			show: true,
			isFull: volume === 7,
			volume,
		};
	}
	return options;
}

/**
 *
 * @param {Options} options
 * @returns {Options}
 */
function mapPcToMachineOptions(options) {
	const machineList = ["dildo", "milker", "tattoo"];
	options.machines = {};
	machineList.forEach(p => {
		options.machines[p] = { show: false };
	});

	if (V.prop.includes("penis_pump")) {
		options.machines.penisMilker = {
			show: true,
		};
	}

	if (V.prop.includes("breast_pump")) {
		options.machines.breastMilker = {
			show: true,
		};
	}

	return options;
}

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

function getArmState(arm) {
	if (["bound", "grappled", "behind"].includes(arm)) {
		return "bound2";
	}
	if (arm === "penis") {
		return "handjob";
	}
	return "default";
}

/**
 *
 * @param {Options} options
 * @returns {Options}
 */
function mapPcToLegPosition(options) {
	const parts = [V.anususe, V.vaginause];
	if (V.feetuse === "penis") {
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

/**
 *
 * @param {object} pc
 * @param {Options} options
 * @returns {Penetrator?}
 */
function mapPcToPenetratorOptions(pc, options) {
	const hasPenetrator = pc.penisExist || playerHasStrapon();
	const isExposed = V.worn.lower.exposed > 1 && V.worn.under_lower.exposed > 0;
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
 * @param {object} pc
 * @param {Options} options
 * @returns {Options}
 */
function mapPcToClothingOptions(pc, options) {
	// Clothing filters and options
	for (const slot of setup.clothes_all_slots) {
		/**
		 * @type {ClothesItem}
		 */
		const wornObj = V.worn[slot];
		/**
		 * @type {ClothesItem}
		 */
		const setupObj = setup.clothes[slot][wornObj.index];

		const clothing = Object.assign({}, setupObj, wornObj);

		let state = clothing.state || "full";

		// Lower clothing states
		const isSkirtDown = clothing.skirt_down === 0;
		const areLegsUp = ["footjob", "up"].includes(options.legFrontPosition) || ["footjob", "up"].includes(options.legFrontPosition);
		// Replace slot === "lower" with all lower slots? In case we need this logic for all lower layers that could be skirts.
		if (slot === "lower") {
			if (clothing.state === "waist" && (isSkirtDown || areLegsUp)) {
				options.genitalsExposed = true;
				state = "hips";
			}
			if (clothing.state === "thighs" && (isSkirtDown || areLegsUp)) {
				options.genitalsExposed = true;
				state = "thighs";
			}
		}

		// Feet clothing states
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
			name: clothing.combatImg,
			state,
			alpha,
			hasAccessory: clothing.accessory === 1,
		};

		if (["upper", "under_upper", "over_upper"].includes(slot)) {
			if (clothing.sleeve_img === 1) {
				clothes.hasSleeves = true;
				clothes.sleeves = "default";
			}
			if (clothing.breast_img !== 0) {
				clothes.hasBreasts = true;
				clothes.breasts = options.breastSize;
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
		options.filters[mainFilterKey] = clothing.colour
			? lookupColour(options, setup.colours.clothes_map, clothes.item.colour, slot + " clothing", "worn_" + slot + "_custom", clothing.prefilter)
			: Renderer.emptyLayerFilter();

		options.filters[accFilterKey] = clothing.accessory_colour
			? lookupColour(
					options,
					setup.colours.clothes_map,
					clothes.item.accessory_colour,
					slot + " accessory",
					"worn_" + slot + "_acc_custom",
					clothing.prefilter
			  )
			: Renderer.emptyLayerFilter();
	}
	return options;
}
window.mapPcToClothingOptions = mapPcToClothingOptions;

/**
 *
 * @param {object} pc
 * @param {Options} options
 * @returns {Options}
 */
function mapPcToBodyOptions(pc, options) {
	mapPcToArmPosition(options);
	return options;
}
window.mapPcToBodyOptions = mapPcToBodyOptions;

/**
 * For colour name, lookup its canvas filter and merge with sprite prefilter.
 *
 * @param {object} options Options
 * @param {Object<string, object>} dict map in setup.colours to lookup in
 * @param {string} key colour name.
 * @param {string} debugName used when reporting errors
 * @param {string} customFilterName key in options.filters
 * @param {string} prefilterName name of prefilter to apply
 * @returns {any} CompositeLayerParams - Check TS docs for model.d.ts
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
