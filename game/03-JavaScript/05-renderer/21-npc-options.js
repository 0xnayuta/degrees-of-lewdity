// @ts-check
/* globals CombatRenderer, CharacterTypes */

/**
 * @typedef NpcOptions
 * @property {number} index
 * @property {"img/newsex"} root
 * @property {string} src Typically "img/newsex/missionary"
 * @property {"missionary" | "doggy"} position
 * @property {"shadow" | "beast"} category
 * @property {CharacterTypes} type
 * @property {Colour} colour
 * @property {string} state
 * @property {boolean} show
 * @property {Penetrator[]} penetrators
 * @property {string} animKey
 * @property {string} animKeyStill
 * @property {Balls} balls
 */

/**
 * @typedef Balls
 * @property {boolean} hasBalls
 * @property {string=} type
 * @property {number=} size
 */

/**
 * @typedef Penetrator
 * @property {"human" | "strapon" | "knotted" | "equine" | "feline" | "sus"} type
 * @property {number} size
 * @property {string} colour
 * @property {number} target PC is -1. NPCs are 0 to 5.
 * @property {string} position Area that the penetrator is in.
 * @property {string} state What it is doing in the position.
 * @property {boolean} isEjaculating Whether the penetrator is ejaculating.
 * @property {Ejaculate} ejaculate The type of ejaculate.
 * @property {boolean} hasCondom Whether the penetrator is wrapped in a condom.
 * @property {boolean} show Whether to render the penetrator.
 */

/**
 * @typedef Ejaculate
 * @property {"sperm" | "pee" | "girlcum" | "sriracha"} type
 */

/**
 * @typedef Colour
 * @property {string} hex
 */

const beastModels = ["bear", "boar", "cat", "creature", "dog", "dolphin", "fox", "horse", "lizard", "pig", "wolf"];

class NpcCombatMapper {
	/** @returns {NpcOptions} */
	static generateOptions() {
		// @ts-ignore
		return {
			position: "missionary",
			src: "img/newsex/missionary",
			animKey: "sex-2f-idle",
			animKeyStill: "sex-2f-idle",
		};
	}

	/**
	 *
	 * @param {number} index
	 * @param {NpcOptions} options
	 * @returns {NpcOptions}
	 */
	static mapNpcToOptions(index, options) {
		console.log("mapNpcToOptions", index, JSON.parse(JSON.stringify(options)));

		// Set position
		options.position = CombatRenderer.getPosition(V.position);

		// Set directory for images
		options.root = "img/newsex";
		options.src = `${options.root}/${options.position}`;

		// Configure state
		// Maybe use active_enemy? const index = V.active_enemy.
		const npc = V.NPCList[index];
		options.category = beastModels.includes(npc.type) ? "beast" : "shadow";
		options.type = npc.type;
		options.state = "default";
		options.show = false;

		this.mapNpcToBodyOptions(index, npc, options);

		// Set animation speed
		options.animKey = this.getNpcAnimationSpeed();
		options.animKeyStill = this.getNpcAnimationSpeed();

		return options;
	}

	/**
	 * @returns {string}
	 */
	static getNpcAnimationSpeed() {
		if (T.crOverrides?.animSpeed) {
			return T.crOverrides.animSpeed;
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
	 * @param {number} index
	 * @param {Npc} npc
	 * @param {NpcOptions} options
	 * @returns {NpcOptions}
	 */
	static mapNpcToBodyOptions(index, npc, options) {
		options.balls = {
			hasBalls: false,
		};
		options.penetrators = options.penetrators = [];
		const penetrator = this.mapNpcToPenetratorOptions(npc, options);
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
					options.state = "over-default";
					options.show = ["vagina", "anus", "thighs", "butt"].includes(penetrator.position);
					return options;
				}

				if (options.position === "doggy" && ["pig", "boar"].includes(npc.type) && npc.stance === "topface") {
					options.state = "front-default";
					options.show = true;
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
			if (combat.penetratorCountBefore(index, penetrator.position) >= 2) {
				options.state += "-double";
				penetrator.state += "-double";
			}
			// Figure out whether to show the shadow man or not:
			options.show = ["vagina", "anus", "mouth"].includes(penetrator.position);

			return options;
		}
		// Since no penetrator exists on the NPC, check for their other states
		// WHY IS ANAL LIKE THIS
		if (typeof npc.penis === "string" && ["otheranusfrot", "otheranusentrance", "otheranusimminent", "otheranus"].includes(npc.penis)) {
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

	/**
	 * @param {Npc} npc
	 * @param {NpcOptions} options
	 * @returns {Penetrator?}
	 */
	static mapNpcToPenetratorOptions(npc, options) {
		/**
		 * @param {Npc} npc
		 * @returns {"human" | "strapon" | "knotted" | "equine" | "feline" | "sus"}
		 */
		function getPenetratorType(npc) {
			if (["dog", "wolf", "fox"].includes(npc.type)) {
				return "knotted";
			}
			if (["horse", "centaur"].includes(npc.type)) {
				return "equine";
			}
			if (["cat", "cougar"].includes(npc.type)) {
				return "feline";
			}
			if (["pig"].includes(npc.type)) {
				return "sus";
			}
			return "human";
		}

		/** @type {Penetrator} */
		const penetrator = {
			show: true,
			type: getPenetratorType(npc),
			colour: npc.skincolour,
			target: combat.target.pc,
			isEjaculating: V.enemyarousal >= V.enemyarousalmax && wearingCondom(V.vaginatarget) !== "worn" && !npcHasStrapon(V.vaginatarget),
			ejaculate: {
				type: "sperm",
			},
			size: 0,
			position: "default",
			state: "default",
			hasCondom: false,
		};

		// Pig is in top face position, but combat doesn't say the penis is at the mouth explicitly. This clause forces this state.
		if (options.position === "doggy" && ["pig", "boar"].includes(npc.type) && npc.stance === "topface") {
			penetrator.position = "mouth";
			penetrator.state = "entrance";
			return penetrator;
		}

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
				return penetrator;
			case "anusentrancedouble":
				penetrator.position = "anus";
				penetrator.state = "entrance";
				return penetrator;
			case "anus":
				penetrator.position = "anus";
				penetrator.state = "penetrated";
				return penetrator;
			case "anusdouble":
				penetrator.position = "anus";
				penetrator.state = "penetrated";
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
				penetrator.state = "entrance";
				return penetrator;
			case "vaginaimminent":
				penetrator.position = "vagina";
				penetrator.state = "imminent";
				return penetrator;
			case "vaginaimminentdouble":
				penetrator.position = "vagina";
				penetrator.state = "imminent";
				return penetrator;
			case "vagina":
				penetrator.position = "vagina";
				penetrator.state = "penetrated";
				return penetrator;
			case "vaginadouble":
				penetrator.position = "vagina";
				penetrator.state = "penetrated";
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
}
window.NpcCombatMapper = NpcCombatMapper;
