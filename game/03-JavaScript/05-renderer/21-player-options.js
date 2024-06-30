// @ts-check
/* global CombatRenderer, Player, Bodywriting, ClothedSlots, SkinColoursSimple, TotalClothingStates, TransformationKeys, Record */

/**
 * @typedef CombatPlayerOptions
 * @type {object}
 * @property {"img/sex/" | "img/newsex/"} root The root directory.
 * @property {"doggy"|"missionary"} position The position.
 * @property {boolean} showPlayer Flag to show the player model.
 * @property {boolean} showFace
 * @property {boolean} showClothing Flag to show the clothing layers.
 * @property {boolean} showNPCs Flag to show the NPC model(s).
 * @property {boolean} showTan Flag to show the player model's tan.
 * @property {number} animSpeed The global speed to play animations.
 * Computed
 * @property {string} src The computed directory path for the position.
 * @property {string} animKey The key used for fetching the animation configuration.
 * @property {string} animKeyStill The key used for fetching the animation configuration for true still sprites.
 * @property {string} machineAnimKey The key used for fetching the animation configuration for machine sprites like milkers/dildos.
 * @property {number} breastSize The size of the player breasts.
 * @property {boolean} breastsExposed Whether the breasts are shown.
 * @property {Penetrator?} penetrator Typically the PC's penis, or strapon etc.
 * @property {SkinColoursSimple} skinType
 * @property {number} skinTone
 * @property {string} hairType The type of hair.
 * @property {string} hairLength The named stage of the hair length.
 * @property {string} leftEye
 * @property {string} rightEye
 * @property {"up" | "down" | "footjob"} legBackPosition The position the back leg is in.
 * @property {"up" | "down" | "footjob"} legFrontPosition The position the front leg is in.
 * @property {"default" | "bound" | "handjob"} armBackPosition The position the back arm is in.
 * @property {"default" | "bound" | "handjob"} armFrontPosition The position the front arm is in.
 * @property {boolean} genitalsExposed
 * @property {MouthOptions} mouth
 * @property {number} blush The volume of blush on the player, higher is more. (1 to 5, usually)
 * @property {number} tears The volume of tears the player displays, higher is more. (1 to 5, usually)
 * @property {Object<string, ClothingState>} clothes Template.
 * @property {object} filters The filters for layers.
 * @property {Props} props
 * @property {Machines} machines
 * @property {Tentacles} tentacles
 * @property {BodywritingOptions} bodywriting
 * @property {Record<string, TransformationOptions>} transformations
 */

/**
 * @typedef MouthOptions
 * @property {boolean} inOral
 * @property {boolean} open
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
 * @property {PilloryProp} pillory
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
 * @typedef {object} PilloryProp
 * @property {boolean} show
 * @property {boolean} isDirty
 * @property {boolean} hasHorse
 * @property {number} tomatoes
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
 * @property {ClothedSlots} slot
 * @property {string?} name The name of the clothing directory.
 * @property {PositionStates?} positions The position related state, typically holding leg state information for legwear/lowerwear.
 * @property {TotalClothingStates} state The state of the clothing, the file name.
 * @property {boolean} show Whether to show the clothing layer.
 * @property {number} alpha The percent of the alpha channel. 1 is 100%, 0 is 0%.
 * @property {boolean} isExposed Whether the clothing layer exposes beneath.
 * @property {boolean} isSkirt Whether the clothing layer is a skirt.
 * @property {boolean} isBoundable Whether the clothing layer has a bound state.
 * @property {boolean} hasAccessory Whether the clothing uses accessory layer.
 * @property {boolean} hasMainImg Whether the clothing has a main img layer, tape for example.
 * @property {boolean} hasBackImg Whether the clothing has a back img layer, typically for headwear or handhelds.
 * @property {PlayerBreastState} breasts Breast state.
 * @property {PlayerSleeveState} sleeves Sleeve state.
 */

/**
 * @typedef PositionStates
 * @property {string} front
 * @property {string} back
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
 * @typedef TransformationOptions
 * @property {WingOptions} wings
 * @property {HaloOptions} halo
 * @property {HornOptions} horns
 * @property {TailOptions} tail
 */

/**
 * @typedef WingOptions
 * @property {boolean} show
 * @property {string} type
 * @property {string} style
 */

/**
 * @typedef HaloOptions
 * @property {boolean} show
 * @property {string} type
 * @property {string} style
 */

/**
 * @typedef HornOptions
 * @property {boolean} show
 * @property {string} type
 * @property {string} style
 */

/**
 * @typedef TailOptions
 * @property {boolean} show
 * @property {string} type
 * @property {string} style
 */

/** @type {CanvasModelOptions<CombatPlayerOptions>} */
class PlayerCombatMapper {
	/** @returns {CombatPlayerOptions} */
	static generateOptions() {
		// @ts-ignore
		return {
			root: "img/newsex/",
			position: "missionary",
			showPlayer: true,
			showFace: true,
			showClothing: true,
			showNPCs: true,
			mouth: {
				inOral: false,
				open: false,
			},
			animSpeed: 1,
			hairType: "default",
			filters: {
				worn: {},
			},
			clothes: {},
			showTan: true,
			src: "img/newsex/missionary/",
			legBackPosition: "down",
			legFrontPosition: "down",
			armBackPosition: "default",
			armFrontPosition: "default",
			animKey: "sex-2f-idle",
			animKeyStill: "sex-2f-idle",
			machineAnimKey: "machine-4f-slow",
			blush: 0,
			breastsExposed: false,
			breastSize: 0,
			genitalsExposed: false,
			hairLength: "short",
			leftEye: "blue",
			rightEye: "blue",
			skinTone: 0,
			skinType: "light",
			tears: 0,
			transformations: {},
		};
	}

	/**
	 * @param {CombatPlayerOptions=} options
	 * @returns {CombatPlayerOptions}
	 */
	static mapPlayerToOptions(options) {
		console.debug("mapPlayerToOptions", JSON.parse(JSON.stringify(options)));

		if (options == null) {
			options = this.generateOptions();
		}

		// Set position
		options.position = CombatRenderer.getPosition(V.position);

		// Set directory for images
		options.src = options.root + options.position + "/";

		// Set hair properties
		this.generateHairFilters(options);

		// Set breast exposed, for example, an NPC had pushed clothing aside to make tits fall out
		options.breastsExposed = true;

		// Copied from <<leg_position>> - Centralise usage later. Added footjob state
		options.legBackPosition = this.mapPcToLegBackPosition(options);
		options.legFrontPosition = this.mapPcToLegFrontPosition(options);

		// Mouth configuration
		options.mouth.inOral = combat.isMouthActive();
		options.mouth.open = combat.isActive() && V.arousalmax / V.arousal > 0.6;

		// Set values for blush and tears
		options.blush = Math.floor(Math.clamp(V.arousal / 2000 + 1, 0, 5));
		options.tears = painToTearsLvl(V.pain);

		// Ensure breast size is calculated before clothing options.
		const breastSize = Math.round(V.player.perceived_breastsize / 3);
		options.breastSize = Math.clamp(breastSize, 0, 4);

		// Clothing options
		this.mapPcToClothingOptions(V.player, options);

		// Ensure body options comes after clothing options
		this.mapPcToBodyOptions(V.player, options);

		this.mapToTransformationOptions(options);

		options.penetrator = this.mapPcToPenetratorOptions(V.player, options);

		this.generateBodyFilters(options);

		options.leftEye = V.leftEyeColour || "blue";
		options.rightEye = V.rightEyeColour || "blue";

		options.filters.leftEye = CombatRenderer.lookupColour(setup.colours.eyes_map, options.leftEye, "leftEye", undefined, "eyes");
		options.filters.rightEye = CombatRenderer.lookupColour(setup.colours.eyes_map, options.rightEye, "rightEye", undefined, "eyes");

		// Set props
		this.mapToPropsOptions(options);

		// Set machine
		this.mapToMachineOptions(options);

		// Set tentacles
		this.mapToTentacleOptions(options);

		// Set animation speed
		options.animKey = this.getPcAnimationSpeed(options);
		options.animKeyStill = this.getPcAnimationSpeed(options);
		options.machineAnimKey = this.getMachineAnimationSpeed(options);

		console.debug("===============================================");
		console.debug("=============== Player Options: ===============");
		console.debug("===============================================");
		console.debug("Options:", JSON.parse(JSON.stringify(options)));

		return options;
	}

	/**
	 * @param {CombatPlayerOptions} options
	 * @returns {string}
	 */
	static getPcAnimationSpeed(options) {
		if (T.crOverrides?.animSpeed) {
			return T.crOverrides.animSpeed;
		}
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

	/**
	 * @param {CombatPlayerOptions} options
	 * @returns {string}
	 */
	static getMachineAnimationSpeed(options) {
		if (options.machines.penisMilker.show || options.machines.breastMilker.show) {
			return "machine-2f-slow";
		}
		if (combat.isActive()) {
			return "machine-4f";
		}
		return "machine-4f-slow";
	}

	/**
	 *
	 * @param {CombatPlayerOptions} options
	 * @returns {CombatPlayerOptions}
	 */
	static mapToPropsOptions(options) {
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

		/**
		 * @returns {PilloryProp}
		 */
		function createPillory() {
			const audience = V.pilloryaudience || 0;
			const tomatoes = V.walltype === "pillory" ? Math.clamp(audience - 1, 1, 4) : 0;
			return {
				show: V.position === "wall" && !!V.walltype,
				isDirty: V.walltype === "pillory",
				hasHorse: V.walltype === "horse_pillory",
				tomatoes,
			};
		}

		options.props = {
			bench: createProp("bench"),
			examTable: createProp("examtable"),
			haybale: createProp("haybale"),
			hospitalBed: createProp("hospitalbed"),
			ivBag: createProp("ivbag"),
			milkTank: createTank("milk", T.barn_milk),
			pillory: createPillory(),
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

	/**
	 *
	 * @param {CombatPlayerOptions} options
	 * @returns {CombatPlayerOptions}
	 */
	static mapToMachineOptions(options) {
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

	/**
	 * @returns {TentacleState[]}
	 */
	static getTentacles() {
		const count = V.tentacles.active;
		const tentacles = [];
		for (let i = 0; i < count; i++) {
			const tentacle = V.tentacles[i];
			tentacles.push(tentacle);
		}
		return tentacles;
	}

	/**
	 *
	 * @param {CombatPlayerOptions} options
	 * @returns {CombatPlayerOptions}
	 */
	static mapToTentacleOptions(options) {
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
					console.debug("Tentacle", i, tentacle, "selected for:", parts);
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

	/**
	 *
	 * @param {CombatPlayerOptions} options
	 * @returns {CombatPlayerOptions}
	 */
	static mapPcToArmPosition(options) {
		if (options.position === "missionary") {
			options.armBackPosition = this.getArmState(V.leftarm);
			options.armFrontPosition = this.getArmState(V.rightarm);
			return options;
		}
		options.armBackPosition = this.getArmState(V.rightarm);
		options.armFrontPosition = this.getArmState(V.leftarm);
		return options;
	}

	/**
	 * @param {object} arm
	 * @returns {"bound" | "handjob" | "default"}
	 */
	static getArmState(arm) {
		if (["bound", "grappled", "behind"].includes(arm)) {
			return "bound";
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

	/**
	 * @param {CombatPlayerOptions} options
	 * @returns {"up" | "down" | "footjob"}
	 */
	static mapPcToLegFrontPosition(options) {
		// Overrides
		if (T.crOverrides?.legFrontPosition) {
			return T.crOverrides.legFrontPosition;
		}
		// General
		if (options.position === "missionary") {
			if (V.feetuse === "penis" || V.feetstate === "tentacle") {
				return "footjob";
			}
			if (V.NPCList.find(a => ["horse", "centaur"].includes(a.type))) {
				return "down";
			}
			if (V.NPCList.some(a => ["dog"].includes(a.type))) {
				return "up";
			}
		}
		if (V.feetuse === "penis" || V.feetstate === "tentacle") {
			return "footjob";
		}
		if (V.machine && V.machine.tattoo && ["left_thigh", "right_thigh"].includes(V.machine.tattoo.use)) {
			return "up";
		}
		if (options.position === "doggy") {
			return "down";
		}
		const parts = [V.anususe, V.vaginause, V.thighuse];
		if (parts.includes("penis") || parts.includes(1)) {
			return "up";
		}
		if (combat.vaginaCount >= 2 || combat.anusCount >= 2) {
			return "up";
		}
		return "down";
	}

	/**
	 * @param {CombatPlayerOptions} options
	 * @returns {"up" | "down" | "footjob"}
	 */
	static mapPcToLegBackPosition(options) {
		// Overrides
		if (T.crOverrides?.legBackPosition) {
			return T.crOverrides.legBackPosition;
		}
		// General
		if (options.position === "missionary") {
			if (V.feetuse === "penis" || V.feetstate === "tentacle") {
				return "up";
			}
			if (V.NPCList.find(a => ["horse", "centaur"].includes(a.type))) {
				return "up";
			}
			if (V.NPCList.some(a => ["dog"].includes(a.type))) {
				return "up";
			}
		}
		if (V.feetuse === "penis" || V.feetstate === "tentacle") {
			return "up";
		}
		if (V.machine && V.machine.tattoo && ["left_thigh", "right_thigh"].includes(V.machine.tattoo.use)) {
			return "up";
		}
		if (options.position === "doggy") {
			return "down";
		}
		const parts = [V.anususe, V.vaginause, V.thighuse];
		if (parts.includes("penis") || parts.includes(1)) {
			return "up";
		}
		if (combat.vaginaCount >= 2 || combat.anusCount >= 2) {
			return "up";
		}
		return "down";
	}

	/**
	 * @param {CombatPlayerOptions} options
	 * @param {ClothingState} clothing
	 * @returns {TotalClothingStates[]}
	 */
	static getExposedStates(options, clothing) {
		/** @type {TotalClothingStates[]} */
		const exposedStates = ["neck", "midriff", "thighs", "knees", "ankles", "totheside"];
		const areLegsUp = ["up", "footjob"].includes(options.legBackPosition) || ["up", "footjob"].includes(options.legFrontPosition);
		if (clothing.isSkirt) {
			// Add states that are for skirts.
		}
		if (options.position === "missionary" && areLegsUp) {
			exposedStates.pushUnique("waist");
		}
		return exposedStates;
	}

	/**
	 * @param {CombatPlayerOptions} options
	 * @param {ClothingState} clothing
	 * @returns {boolean}
	 */
	static isClothingExposed(options, clothing) {
		return clothing.isExposed || this.getExposedStates(options, clothing).includes(clothing.state);
	}

	/**
	 * @param {CombatPlayerOptions} options
	 * @returns {boolean}
	 */
	static isPenisExposed(options) {
		const lower = options.clothes.lower;
		const lowerExposed = !lower.show || this.isClothingExposed(options, lower);

		const underLower = options.clothes.under_lower;
		const underLowerExposed = !underLower.show || this.isClothingExposed(options, underLower);

		const overLower = options.clothes.over_lower;
		const overLowerExposed = !overLower.show || this.isClothingExposed(options, overLower);

		console.debug("Exposed values: lower:", lowerExposed, "under_lower:", underLowerExposed, "over_lower", overLowerExposed);
		const clothingExposed = lowerExposed && underLowerExposed && overLowerExposed;

		return clothingExposed;
	}

	/**
	 *
	 * @param {Player} pc
	 * @param {CombatPlayerOptions} options
	 * @returns {Penetrator?}
	 */
	static mapPcToPenetratorOptions(pc, options) {
		const hasPenetrator = pc.penisExist || playerHasStrapon();
		const isExposed = this.isPenisExposed(options);
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
			case "tentacle":
				penetrator.position = "tentacle";
				penetrator.state = "tentacle";
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

	/**
	 *
	 * @param {Player} pc
	 * @param {CombatPlayerOptions} options
	 * @returns {CombatPlayerOptions}
	 */
	static mapPcToClothingOptions(pc, options) {
		// Clothing filters and options
		for (const slot of setup.clothes_all_slots) {
			const clothes = this.mapPcToClothingOption(slot, pc, options);
			options.clothes = options.clothes || {};
			options.clothes[slot] = clothes;
		}
		return options;
	}

	/**
	 * @param {ClothedSlots} slot
	 * @param {Player} pc
	 * @param {CombatPlayerOptions} options
	 * @returns {ClothingState}
	 */
	static mapPcToClothingOption(slot, pc, options) {
		const defaults = setup.clothes[slot][V.worn[slot].index];
		const clothing = CombatRenderer.getClothingBySlot(slot);

		const name = defaults.combatImg ?? clothing.variable;
		/** @type {TotalClothingStates} */
		let state = clothing.state;
		let show = name != null;

		if (slot === "upper" && (state === 0 || (typeof state === "string" && !["midriff", "chest", "waist"].includes(state)))) {
			show = false;
		}

		if (slot === "under_upper" && (state === 0 || (typeof state === "string" && !["midriff", "chest", "waist"].includes(state)))) {
			show = false;
		}

		if (slot === "lower") {
			// Move skirt to thighs if skirt_down is 0
			if (defaults.skirt === 1 && clothing.skirt_down === 0 && state === "waist") {
				state = "thighs";
			}
		}

		if (slot === "under_lower") {
			// Slot for under lower configurations
			show = state !== 0 && ["ankles", "waist", "totheside"].includes(state);
		}

		if (slot === "feet") {
			state = options.legFrontPosition;
			// state = options.legBackPosition;
		}

		this.generateClothingFilter(slot, clothing, options);

		if (defaults.index === 0 || name === "naked") {
			// Clothing is naked.
			show = false;
		}

		/**
		 * @type {ClothingState}
		 */
		const clothes = {
			item: clothing,
			slot,
			name,
			positions: CombatRenderer.getPositionStates(options.legFrontPosition, options.legBackPosition, slot, defaults),
			state: state || "full",
			show,
			alpha: CombatRenderer.getAlpha(slot),
			isSkirt: defaults.skirt === 1,
			isExposed: !!clothing.exposed,
			isBoundable: !!clothing.combatBoundable,
			hasAccessory: CombatRenderer.getAccessoryState(slot, defaults),
			hasMainImg: clothing.combatHasMainImg !== false,
			hasBackImg: !!defaults.back_img && [1, "combat"].includes(defaults.back_img),
			breasts: {
				show: ["upper", "under_upper", "over_upper"].includes(slot) && defaults.breast_img !== 0,
				size: options.breastSize,
			},
			sleeves: {
				show: ["upper", "under_upper", "over_upper"].includes(slot) && defaults.sleeve_img === 1,
				state: "default",
			},
		};

		return clothes;
	}

	/**
	 * @param {ClothedSlots} slot
	 * @param {ClothesItem} clothing
	 * @param {CombatPlayerOptions} options
	 */
	static generateClothingFilter(slot, clothing, options) {
		const mainFilterKey = `worn_${slot}_main`;
		const accFilterKey = `worn_${slot}_acc`;

		options.filters = options.filters || {
			worn: {},
		};
		options.filters.worn[slot] = {};

		const colour = clothing.combatColourOverride || clothing.colour;
		const debugName = slot + " clothing";
		const customFilter = clothing.colourCustom;
		console.debug("Clothing colour:", slot, colour);
		options.filters[mainFilterKey] = colour
			? CombatRenderer.lookupColour(setup.colours.clothes_map, colour, debugName, customFilter, clothing.prefilter)
			: Renderer.emptyLayerFilter();

		const accColour = clothing.combatAccessoryColourOverride || clothing.accessory_colour;
		const accDebugName = slot + " accessory";
		const accCustomFilter = clothing.accessory_colourCustom;
		options.filters[accFilterKey] = accColour
			? CombatRenderer.lookupColour(setup.colours.clothes_map, accColour, accDebugName, accCustomFilter, clothing.prefilter)
			: Renderer.emptyLayerFilter();
	}

	/**
	 * @param {Player} pc
	 * @param {CombatPlayerOptions} options
	 * @returns {CombatPlayerOptions}
	 */
	static mapPcToBodyOptions(pc, options) {
		this.mapPcToArmPosition(options);
		this.mapPcToBodywritingOptions(pc, options);
		return options;
	}

	/**
	 * @param {CombatPlayerOptions} options
	 * @returns {CombatPlayerOptions}
	 */
	static mapToTransformationOptions(options) {
		/**
		 * @param {TransformationKeys} type
		 * @param {"wings" | "halo" | "horns" | "tail"} part
		 */
		function generateTransformationFilter(type, part) {
			const parts = V.transformationParts[type];
			if (part in parts) {
				options.filters[type + part.toUpperFirst()] = CombatRenderer.getTransformationFilter(type, part);
			}
		}

		/** @type {TransformationKeys[]} */
		const transformations = ["angel", "bird", "cat", "cow", "demon", "fallenAngel", "fox", "wolf"];
		options.transformations = options.transformations || {};
		transformations.forEach(transformation => {
			options.transformations[transformation] = {
				wings: this.mapToTransformationWingOptions(transformation),
				halo: this.mapToTransformationHaloOptions(transformation),
				horns: this.mapToTransformationHornOptions(transformation),
				tail: this.mapToTransformationTailOptions(transformation),
			};
			generateTransformationFilter(transformation, "wings");
			generateTransformationFilter(transformation, "halo");
			generateTransformationFilter(transformation, "horns");
			generateTransformationFilter(transformation, "tail");
		});
		return options;
	}

	/**
	 * @param {TransformationKeys} type
	 * @returns {WingOptions}
	 */
	static mapToTransformationWingOptions(type) {
		const parts = V.transformationParts[type];
		if (!("wings" in parts) || parts.wings === "disabled") {
			return {
				show: false,
				type,
				style: "disabled",
			};
		}
		return {
			show: true,
			type,
			style: parts.wings,
		};
	}

	/**
	 * @param {string} type
	 * @returns {HaloOptions}
	 */
	static mapToTransformationHaloOptions(type) {
		const parts = V.transformationParts[type];
		if (!("halo" in parts) || parts.halo === "disabled") {
			return {
				show: false,
				type,
				style: "disabled",
			};
		}
		return {
			show: true,
			type,
			style: parts.halo,
		};
	}

	/**
	 * @param {string} type
	 * @returns {HornOptions}
	 */
	static mapToTransformationHornOptions(type) {
		const parts = V.transformationParts[type];
		if (!("horns" in parts) || parts.horns === "disabled") {
			return {
				show: false,
				type,
				style: "disabled",
			};
		}
		return {
			show: true,
			type,
			style: parts.horns,
		};
	}

	/**
	 * @param {string} type
	 * @returns {TailOptions}
	 */
	static mapToTransformationTailOptions(type) {
		const parts = V.transformationParts[type];
		if (!("tail" in parts) || parts.tail === "disabled") {
			return {
				show: false,
				type,
				style: "disabled",
			};
		}
		return {
			show: true,
			type,
			style: parts.tail,
		};
	}

	/**
	 * @param {Player} pc
	 * @param {CombatPlayerOptions} options
	 */
	static mapPcToBodywritingOptions(pc, options) {
		/**
		 * @param {string} path
		 * @returns {string}
		 */
		function sanitise(path) {
			return path.replace("_", "-");
		}

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
				type: sanitise(id),
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
				type: sanitise(id),
			};
		}

		/**
		 * @param {string} id
		 * @param {Bodywriting} bodywriting
		 * @returns {BodywritingOption?}
		 */
		function hidden(id, bodywriting) {
			return {
				show: false,
				area: bodywriting.writing,
				type: sanitise(id),
			};
		}

		options.bodywriting = options.bodywriting || {
			isEnabled: V.options.bodywritingImages === true,
			forehead: {
				show: false,
				type: "forehead",
			},
			breasts: getState("breasts", simpleText),
			back: getState("back", simpleText),
		};

		switch (options.position) {
			case "missionary":
				options.bodywriting.frontCheek = getState("left_cheek", (id, bodywriting) => {
					return {
						show: false,
						area: bodywriting.writing,
						type: sanitise(id),
					};
				});
				options.bodywriting.backCheek = getState("right_cheek", (id, bodywriting) => {
					if (bodywriting.type === "text" || bodywriting.special === "islander") {
						return {
							show: true,
							area: "text",
							type: sanitise(id),
						};
					}
					if (bodywriting.type === "object") {
						return {
							show: true,
							area: bodywriting.writing,
							type: sanitise(id),
						};
					}
					return null;
				});
				options.bodywriting.backShoulder = getState("right_shoulder", (id, bodywriting) => {
					if (bodywriting.type === "text" || bodywriting.special === "islander") {
						return {
							show: true,
							area: "text",
							type: sanitise(id),
						};
					}
					if (bodywriting.type !== "object") {
						return null;
					}
					if (V.leftarm === "bound" || V.rightarm === "grappled" || V.leftarm === "behind") {
						return {
							show: true,
							area: bodywriting.writing,
							type: "left-shoulder-bound",
						};
					}
					return {
						show: true,
						area: bodywriting.writing,
						type: sanitise(id),
					};
				});
				options.bodywriting.frontShoulder = getState("left_shoulder", (id, bodywriting) => {
					return {
						show: false,
						area: bodywriting.writing,
						type: sanitise(id),
					};
				});
				options.bodywriting.backBottom = getState("right_bottom", hidden);
				options.bodywriting.frontBottom = getState("left_bottom", hidden);
				options.bodywriting.pubic = getState("pubic", (id, bodywriting) => {
					if (bodywriting.type === "text") {
						return {
							show: true,
							area: "text",
							type: sanitise(id),
						};
					}
					if (bodywriting.type === "object" && bodywriting.special !== "islander") {
						return {
							show: true,
							area: bodywriting.writing,
							type: sanitise(id),
						};
					}
					return null;
				});
				options.bodywriting.backThigh = getState("right_thigh", (id, bodywriting) => {
					if (bodywriting.type === "text" || bodywriting.special === "islander") {
						let type = id;
						if (["up", "down"].includes(options.legFrontPosition)) {
							type += "-" + options.legFrontPosition;
						}
						if (bodywriting.arrow === 1) {
							type += "-arrow";
						}
						return {
							show: true,
							area: "text",
							type: sanitise(type),
						};
					}
					if (bodywriting.type === "object") {
						return {
							show: true,
							area: bodywriting.writing,
							type: sanitise(id),
						};
					}
					return null;
				});
				options.bodywriting.frontThigh = getState("left_thigh", (id, bodywriting) => {
					if (bodywriting.type === "text" || bodywriting.special === "islander") {
						let type = id;
						if (["up", "down"].includes(options.legFrontPosition)) {
							type += "-" + options.legFrontPosition;
						}
						if (bodywriting.arrow === 1) {
							type += "-arrow";
						}
						return {
							show: true,
							area: "text",
							type: sanitise(type),
						};
					}
					if (bodywriting.type === "object") {
						return {
							show: true,
							area: bodywriting.writing,
							type: sanitise(id),
						};
					}
					return null;
				});
				break;
			case "doggy":
				options.bodywriting.frontCheek = getState("right_cheek", (id, bodywriting) => {
					return {
						show: false,
						area: bodywriting.writing,
						type: sanitise(id),
					};
				});
				options.bodywriting.backCheek = getState("left_cheek", (id, bodywriting) => {
					if (bodywriting.type === "text" || bodywriting.special === "islander") {
						return {
							show: true,
							area: "text",
							type: sanitise(id),
						};
					}
					if (bodywriting.type === "object") {
						return {
							show: true,
							area: bodywriting.writing,
							type: sanitise(id),
						};
					}
					return null;
				});
				options.bodywriting.backShoulder = getState("left_shoulder", (id, bodywriting) => {
					if (bodywriting.type === "text" || bodywriting.special === "islander") {
						return {
							show: true,
							area: "text",
							type: sanitise(id),
						};
					}
					if (bodywriting.type !== "object") {
						return null;
					}
					if (V.leftarm === "bound" || V.rightarm === "grappled" || V.leftarm === "behind") {
						return {
							show: true,
							area: bodywriting.writing,
							type: "left-shoulder-bound",
						};
					}
					return {
						show: true,
						area: bodywriting.writing,
						type: sanitise(id),
					};
				});
				options.bodywriting.frontShoulder = getState("right_shoulder", (id, bodywriting) => {
					return {
						show: false,
						area: bodywriting.writing,
						type: sanitise(id),
					};
				});
				options.bodywriting.backBottom = getState("left_bottom", simpleText);
				options.bodywriting.frontBottom = getState("right_bottom", (id, bodywriting) => {
					return {
						show: false,
						area: bodywriting.writing,
						type: sanitise(id),
					};
				});
				options.bodywriting.pubic = getState("pubic", (id, bodywriting) => {
					if (bodywriting.type === "text") {
						return {
							show: true,
							area: "text",
							type: sanitise(id),
						};
					}
					if (bodywriting.type === "object" && bodywriting.special !== "islander") {
						return {
							show: true,
							area: bodywriting.writing,
							type: sanitise(id),
						};
					}
					return null;
				});
				options.bodywriting.backThigh = getState("left_thigh", simpleText);
				options.bodywriting.frontThigh = getState("right_thigh", (id, bodywriting) => {
					if (bodywriting.type === "text" || bodywriting.special === "islander") {
						return {
							show: true,
							area: "text",
							type: sanitise(bodywriting.arrow === 1 ? id + "-arrow" : id),
						};
					}
					if (bodywriting.type === "object") {
						return {
							show: true,
							area: bodywriting.writing,
							type: sanitise(id),
						};
					}
					return null;
				});
				break;
		}
		return options;
	}

	/**
	 * @param {CombatPlayerOptions} options
	 */
	static generateHairFilters(options) {
		if (V.hairColourStyle === "simple") {
			options.filters.hair = CombatRenderer.lookupColour(setup.colours.hair_map, V.haircolour, "hair", "hair_custom", "hair");
		} else {
			options.filters.hair = CombatRenderer.createHairColourGradient(
				"sides",
				V.hairColourGradient,
				CombatRenderer.getHairSideType(),
				hairLengthStringToNumber(V.hairlengthstage),
				"hair"
			);
		}

		if (V.hairFringeColourStyle === "simple") {
			options.filters.fringe = CombatRenderer.lookupColour(
				setup.colours.hair_map,
				V.hairfringecolour || V.haircolour,
				"hair_fringe",
				"hair_fringe_custom",
				"hair_fringe"
			);
		} else {
			options.filters.fringe = CombatRenderer.createHairColourGradient(
				"fringe",
				V.hairFringeColourGradient || V.hairColourGradient,
				CombatRenderer.getHairFringeType(),
				hairLengthStringToNumber(V.fringelengthstage),
				"fringe"
			);
		}

		options.hairLength = V.hairlengthstage;
		options.hairType = "default";
	}

	/**
	 * @param {CombatPlayerOptions} options
	 */
	static generateBodyFilters(options) {
		options.skinType = V.skinColor.natural;
		options.skinTone = CombatRenderer.getTanValues().body;
		const skinFilter = setup.colours.getSkinFilter(options.skinType, options.skinTone);
		options.filters.body = skinFilter;
		options.filters.breasts = skinFilter;
		options.filters.penis = skinFilter;
		if (options.showTan) {
			const tanslots = ["breasts", "penis", "swimshorts", "swimsuitTop", "swimsuitBottom", "bikiniTop", "bikiniBottom"]
				.map(slotname => [slotname, options["skin_tone_" + slotname]])
				.filter(slot => slot[1] >= 0);
			// Brightest on top
			tanslots.sort((a, b) => b[1] - a[1]);
			tanslots.forEach((slot, i) => {
				options.filters[slot[0]] = setup.colours.getSkinFilter(options.skinType, slot[1]);
				options["ztan_" + slot[0]] = options["ztan_" + slot[0]] + 0.01 * i;
			});
		}
	}
}
window.PlayerCombatMapper = PlayerCombatMapper;
