// @ts-check
/* globals CombatRenderer, CharacterTypes, NpcStates, AnimationSpeed, PenetratorTypes, SpritePositions, Partial, Dict */

/**
 * @typedef NpcOptions
 * @property {number} index
 * @property {"img/newsex"} root
 * @property {string} src Typically "img/newsex/missionary"
 * @property {Dict<Partial<CompositeLayerSpec>>} filters
 * @property {SpritePositions} position
 * @property {"shadow" | "beast"} category
 * @property {CharacterTypes} type
 * @property {Penetrator[]} penetrators
 * @property {Balls} balls
 * @property {boolean} show
 * @property {NpcStates?} state
 * @property {Colour} colour
 * @property {AnimationSpeed} speed
 * @property {string} animKey
 * @property {string} animKeyStill
 */

/**
 * @typedef Balls
 * @property {boolean} hasBalls
 * @property {string=} type
 * @property {number=} size
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
			filters: {},
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
		options.state = null;
		options.show = false;

		this.mapNpcToBodyOptions(index, npc, options);

		// Set animation speed
		options.animKey = this.getNpcAnimation();
		options.animKeyStill = this.getNpcAnimation();
		options.speed = this.getNpcAnimationSpeed();

		return options;
	}

	/**
	 * @returns {string}
	 */
	static getNpcAnimation() {
		const speed = this.getNpcAnimationSpeed();
		const frames = this.getNpcAnimationFrameCount();
		if (combat.isActive()) {
			return `sex-${frames}f-${speed}`;
		}
		return `sex-${frames}f-${speed}`;
	}

	/**
	 * @returns {number}
	 */
	static getNpcAnimationFrameCount() {
		if (T.crOverrides?.animFrames) {
			return T.crOverrides.animFrames;
		}
		if (combat.isActive()) {
			return 4;
		}
		return 2;
	}

	/**
	 * @returns {AnimationSpeed}
	 */
	static getNpcAnimationSpeed() {
		if (T.crOverrides?.animSpeed) {
			return T.crOverrides.animSpeed;
		}
		if (combat.isRapid()) {
			return "vfast";
		}
		if (combat.isActive()) {
			return "mid";
		}
		return "idle";
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

		options.filters.skin = this.getNpcSkinFilter(npc);

		const penetrator = this.mapNpcToPenetratorOptions(npc, options);
		if (penetrator != null) {
			console.log("Pushing penetrator to list:", penetrator);
			options.penetrators.push(penetrator);

			// Figure out which shadow base to use from penetrator:
			if (penetrator.position != null) {
				options.state = penetrator.position;
			}

			if (options.category === "beast") {
				if (["horse", "centaur"].includes(npc.type)) {
					options.show = true;
					return options;
				}

				if (npc.stance === "top") {
					options.show = penetrator.position != null && ["vagina", "anus", "thighs", "butt"].includes(penetrator.position);
					return options;
				}

				if (options.position === "doggy" && ["pig", "boar"].includes(npc.type) && npc.stance === "topface") {
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
			options.show = penetrator.position != null && ["vagina", "anus", "mouth"].includes(penetrator.position);
		}

		// Figure out whether the NPC is riding the PC, prepare for combat retardation
		if (V.penisuse === "otheranus" && V.penistarget === index) {
			options.show = false;
			options.state = "penis";
		}
		if (V.penisuse === "otherpenis" && V.penistarget === index) {
			options.show = false;
			options.state = "penis";
		}
		if (V.penisuse === "othervagina" && V.penistarget === index) {
			options.show = false;
			options.state = "penis";
		}

		// Since no penetrator exists on the NPC, check for their other states
		// WHY IS ANAL LIKE THIS
		if (typeof npc.penis === "string" && ["otheranusfrot", "otheranusentrance", "otheranusimminent", "otheranus"].includes(npc.penis)) {
			// options.state = options.category === "shadow" ? "default" : "under-default";
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
			// options.state = options.category === "shadow" ? "default" : "over-default";
			options.show = true;
			return options;
		}

		return options;
	}

	/**
	 * @param {Npc} npc
	 * @returns {Partial<CompositeLayerSpec>}
	 */
	static getNpcSkinFilter(npc) {
		return setup.colours.getSkinFilter(npc.skincolour === "white" ? "light" : "dark", 0);
	}

	/**
	 * @param {Npc} npc
	 * @returns {Partial<CompositeLayerSpec>}
	 */
	static getNpcPenetratorFilter(npc) {
		// Get any special colours, strapon, etc.
		if (npc.strapon) {
			// Figure out a filter for each strapon colour:
			switch (npc.strapon.color) {
				case "fleshy":
					return this.getNpcSkinFilter(npc);
				case "black":
					return {
						blend: "#000",
						blendMode: "multiply",
						desaturate: true,
					};
				case "blue":
					return {
						blend: "#00f",
						blendMode: "multiply",
						desaturate: true,
					};
				case "green":
					return {
						blend: "#00ff00",
						blendMode: "multiply",
						desaturate: true,
					};
				case "pink":
					return {
						blend: "#ff00ff",
						blendMode: "multiply",
						desaturate: true,
					};
				case "purple":
					return {
						blend: "#a0f",
						blendMode: "multiply",
						desaturate: true,
					};
				case "red":
					return {
						blend: "#f00",
						blendMode: "multiply",
						desaturate: true,
					};
			}
		}
		return this.getNpcSkinFilter(npc);
	}

	/**
	 * @param {Npc} npc
	 * @param {NpcOptions} options
	 * @returns {Penetrator?}
	 */
	static mapNpcToPenetratorOptions(npc, options) {
		/**
		 * @param {Npc} npc
		 * @returns {PenetratorTypes}
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
			show: false,
			type: getPenetratorType(npc),
			colour: npc.skincolour,
			target: combat.target.pc,
			isEjaculating: V.enemyarousal >= V.enemyarousalmax && wearingCondom(V.vaginatarget) !== "worn" && !npcHasStrapon(V.vaginatarget),
			ejaculate: {
				type: "sperm",
			},
			size: 0,
			position: null,
			state: null,
			hasCondom: false,
		};

		Object.assign(penetrator, combat.getNpcPenetratorState(npc));

		options.filters.penetrator = this.getNpcPenetratorFilter(npc);

		console.log("npc-penetrator:", penetrator);

		// Pig is in top face position, but combat doesn't say the penis is at the mouth explicitly. This clause forces this state.
		if (options.position === "doggy" && ["pig", "boar"].includes(npc.type) && npc.stance === "topface") {
			penetrator.show = true;
			penetrator.position = "mouth";
			penetrator.state = "entrance";
			return penetrator;
		}

		if (["horse", "centaur"].includes(npc.type)) {
			if (options.position === "missionary") {
				return null;
			}
			penetrator.show = true;
			penetrator.state = [V.anusstate, V.vaginastate].includes("penetrated") ? "penetrating" : "entrance";
			return penetrator;
		}

		if (!penetrator.show) {
			return null;
		}

		return penetrator;
	}
}
window.NpcCombatMapper = NpcCombatMapper;
