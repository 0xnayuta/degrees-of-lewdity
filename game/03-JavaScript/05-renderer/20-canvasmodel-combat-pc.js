// @ts-check
/* global CombatRenderer, PlayerCombatMapper, CombatPlayerOptions, CanvasModelLayers, TransformationKeys, BodywritingOption */

class PlayerCanvasHelper {
	/**
	 * @param {string} id
	 * @param {CanvasModelLayers<CombatPlayerOptions>} overrideOptions
	 * @returns {CanvasModelLayers<CombatPlayerOptions>}
	 */
	static genBodywritingLayer(id, overrideOptions = {}) {
		/**
		 * @type {CanvasModelLayers<CombatPlayerOptions>}
		 */
		const defaults = {
			srcfn(options) {
				/** @type {BodywritingOption} */
				const bodywriting = options.bodywriting[id];
				const path = `${options.src}bodywriting/${bodywriting.area}/${bodywriting.type}.png`;
				return path;
			},
			showfn(options) {
				/** @type {BodywritingOption} */
				const bodywriting = options.bodywriting[id];
				return !!bodywriting.show;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: CombatRenderer.indices.base,
		};
		return Object.assign(defaults, overrideOptions);
	}

	/**
	 * @param {string} slot
	 * @param {CanvasModelLayers<CombatPlayerOptions>} overrideOptions
	 * @returns {CanvasModelLayers<CombatPlayerOptions>}
	 */
	static genClothingLayer(slot, overrideOptions = {}) {
		/**
		 * @type {CanvasModelLayers<CombatPlayerOptions>}
		 */
		const defaults = {
			srcfn(options) {
				const clothes = options.clothes[slot];
				if (clothes == null || clothes.name == null) return "";
				const path = `${options.src}clothing/${slot}/${clothes.name}/${clothes.state}.png`;
				console.log(slot, "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes[slot];
				const show = CombatRenderer.isClothingShown(clothes, options.showClothing) && clothes.hasMainImg;
				console.log(slot, "Show?:", show);
				return !!show;
			},
			alphafn(options) {
				const clothes = options.clothes[slot];
				const alpha = clothes.alpha;
				console.log(slot, "Alpha:", alpha);
				return alpha;
			},
			animationfn(options) {
				return options.animKey;
			},
			filtersfn(options) {
				const filter = `worn_${slot}_main`;
				console.log(slot, "Filters:", filter, options.filters[filter]);
				return [filter];
			},
			z: CombatRenderer.indices[slot],
		};
		return Object.assign(defaults, overrideOptions);
	}

	/**
	 *
	 * @param {string} slot
	 * @param {CanvasModelLayers<CombatPlayerOptions>} overrideOptions
	 * @returns {CanvasModelLayers<CombatPlayerOptions>}
	 */
	static genClothingAccLayer(slot, overrideOptions = {}) {
		/**
		 * @type {CanvasModelLayers<CombatPlayerOptions>}
		 */
		const defaults = {
			srcfn(options) {
				const clothes = options.clothes[slot];
				if (clothes == null || clothes.name == null) return "";
				const path = `${options.src}clothing/${slot}/${clothes.name}/${clothes.state}-acc.png`;
				console.log(slot, "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes[slot];
				const show = options.showClothing && clothes != null && clothes.show && clothes.hasAccessory;
				console.log(slot, "Show?:", show);
				return !!show;
			},
			alphafn(options) {
				const clothes = options.clothes[slot];
				const alpha = clothes.alpha;
				console.log(slot, "Alpha:", alpha);
				return alpha;
			},
			animationfn(options) {
				return options.animKey;
			},
			filtersfn(options) {
				const filter = `worn_${slot}_acc`;
				console.log(slot, "Filters:", filter, options.filters[filter]);
				return [filter];
			},
			z: CombatRenderer.indices[slot],
		};
		return Object.assign(defaults, overrideOptions);
	}

	/**
	 * @param {TransformationKeys} transformation
	 * @param {"wings" | "halo" | "horns" | "tail"} part
	 * @param {"front" | "back"} layer
	 * @param {CanvasModelLayers<CombatPlayerOptions>} overrideOptions
	 * @returns {CanvasModelLayers<CombatPlayerOptions>}
	 */
	static genTransformationLayer(transformation, part, layer, overrideOptions = {}) {
		/**
		 * @type {CanvasModelLayers<CombatPlayerOptions>}
		 */
		const defaults = {
			srcfn(options) {
				const value = options.transformations[transformation][part];
				const path = `${options.src}body/transformations/${value.type}/${part}/${layer}-${value.style}.png`;
				console.log("Transformation", transformation, "part", part, layer, "src:", path);
				return path;
			},
			showfn(options) {
				const value = options.transformations[transformation][part];
				const show = value.show;
				console.log("Transformation", transformation, "part", part, layer, "show:", show);
				return show;
			},
			animationfn(options) {
				return options.animKey;
			},
			filters: [transformation + part.toUpperFirst()],
			z: CombatRenderer.indices[layer + part.toUpperFirst()],
		};
		return Object.assign(defaults, overrideOptions);
	}
}
window.PlayerCanvasHelper = PlayerCanvasHelper;

/**
 * @type {CanvasModelOptions<CombatPlayerOptions>}
 */
const combatMainPc = {
	name: "combatMainPc",
	width: 256,
	height: 256,
	frames: 4,
	/*
	 * http://patorjk.com/software/taag/#p=display&c=c&f=ANSI%20Regular&t=generated
	 *	 ██████  ███████ ███    ██ ███████ ██████   █████  ████████ ███████ ██████
	 *	██       ██      ████   ██ ██      ██   ██ ██   ██    ██    ██      ██   ██
	 *	██   ███ █████   ██ ██  ██ █████   ██████  ███████    ██    █████   ██   ██
	 *	██    ██ ██      ██  ██ ██ ██      ██   ██ ██   ██    ██    ██      ██   ██
	 *	 ██████  ███████ ██   ████ ███████ ██   ██ ██   ██    ██    ███████ ██████
	 */
	generatedOptions() {
		/* Ask Aim about how this could be used? */
		return [];
	},
	/*
	 *	██████  ███████ ███████  █████  ██    ██ ██      ████████ ███████
	 *	██   ██ ██      ██      ██   ██ ██    ██ ██         ██    ██
	 *	██   ██ █████   █████   ███████ ██    ██ ██         ██    ███████
	 *	██   ██ ██      ██      ██   ██ ██    ██ ██         ██         ██
	 *	██████  ███████ ██      ██   ██  ██████  ███████    ██    ███████
	 */
	defaultOptions() {
		console.debug("combatMainPc-defaultOptions");
		return { ...PlayerCombatMapper.generateOptions(), ...this.metadata };
	},
	/*
	 *	██████  ██████  ███████ ██████  ██████   ██████   ██████ ███████ ███████ ███████
	 *	██   ██ ██   ██ ██      ██   ██ ██   ██ ██    ██ ██      ██      ██      ██
	 *	██████  ██████  █████   ██████  ██████  ██    ██ ██      █████   ███████ ███████
	 *	██      ██   ██ ██      ██      ██   ██ ██    ██ ██      ██           ██      ██
	 *	██      ██   ██ ███████ ██      ██   ██  ██████   ██████ ███████ ███████ ███████
	 */
	preprocess(options) {
		console.debug("combatMainPc-preprocess", JSON.parse(JSON.stringify(options)));
		PlayerCombatMapper.mapPlayerToOptions(options);
	},
	layers: {
		/*
		 *    ██████  ███████ ██████  ██    ██  ██████
		 *    ██   ██ ██      ██   ██ ██    ██ ██
		 *    ██   ██ █████   ██████  ██    ██ ██   ███
		 *    ██   ██ ██      ██   ██ ██    ██ ██    ██
		 *    ██████  ███████ ██████   ██████   ██████
		 */
		frameCount: {
			srcfn(options) {
				return `${options.root}${options.animKey.includes("4f") ? "4f" : "2f"}.png`;
			},
			showfn(options) {
				return true;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: 100,
		},
		/*
		 *    ██████  ██████   ██████  ██████  ███████
		 *    ██   ██ ██   ██ ██    ██ ██   ██ ██
		 *    ██████  ██████  ██    ██ ██████  ███████
		 *    ██      ██   ██ ██    ██ ██           ██
		 *    ██      ██   ██  ██████  ██      ███████
		 */
		bench: {
			srcfn(options) {
				return `${options.root}prop/bench/${options.position}.png`;
			},
			showfn(options) {
				return !!options.props.bench.show;
			},
			z: 5,
		},
		examTable: {
			srcfn(options) {
				return `${options.root}prop/exam-table/${options.position}.png`;
			},
			showfn(options) {
				return !!options.props.examTable.show;
			},
			z: 5,
		},
		haybale: {
			srcfn(options) {
				return `${options.root}prop/haybale/haybale.png`;
			},
			showfn(options) {
				return !!options.props.haybale.show;
			},
			z: 5,
		},
		hospitalBed: {
			srcfn(options) {
				return `${options.root}prop/hospital-bed/${options.position}.png`;
			},
			showfn(options) {
				return !!options.props.hospitalBed.show;
			},
			z: 5,
		},
		hospitalBedRails: {
			srcfn(options) {
				return `${options.root}prop/hospital-bed/${options.position}-rails.png`;
			},
			showfn(options) {
				return !!options.props.hospitalBed.show;
			},
			z: 95,
		},
		ivBag: {
			srcfn(options) {
				return `${options.root}prop/iv-bag/${options.position}.png`;
			},
			showfn(options) {
				return !!options.props.ivBag.show;
			},
			z: 5,
		},
		milkTank: {
			srcfn(options) {
				const tank = options.props.milkTank;
				if (tank.isFull) {
					return `${options.root}prop/milk-tank/tank-full.png`;
				}
				return `${options.root}prop/milk-tank/tank.png`;
			},
			showfn(options) {
				return !!options.props.milkTank.show;
			},
			animation: "prop-4f-tank",
			z: 1,
		},
		milkTankVolume: {
			srcfn(options) {
				const tank = options.props.milkTank;
				return `${options.root}prop/milk-tank/${tank.volume}.png`;
			},
			showfn(options) {
				return !!options.props.milkTank.show;
			},
			animation: "prop-4f-tank",
			z: 3,
		},
		semenTank: {
			srcfn(options) {
				if (options.props.semenTank.isFull) {
					return `${options.root}prop/semen-tank/semen-full.png`;
				}
				return `${options.root}prop/semen-tank/semen.png`;
			},
			showfn(options) {
				const show = options.props.semenTank.show;
				return !!show;
			},
			animation: "prop-4f-tank",
			z: 2,
		},
		semenTankVolume: {
			srcfn(options) {
				const tank = options.props.semenTank;
				return `${options.root}prop/semen-tank/${tank.volume}.png`;
			},
			showfn(options) {
				const show = options.props.semenTank.show;
				return !!show;
			},
			animation: "prop-4f-tank",
			z: 2,
		},
		table: {
			srcfn(options) {
				return `${options.root}prop/table/${options.position}.png`;
			},
			showfn(options) {
				return !!options.props.table.show;
			},
			z: 5,
		},
		leash: {
			srcfn(options) {
				return `${options.root}prop/leash/${options.position}.png`;
			},
			showfn(options) {
				return !!options.props.leash.show;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: CombatRenderer.indices.base,
		},
		pilloryBack: {
			srcfn(options) {
				const pillory = options.props.pillory;
				if (pillory.isDirty) {
					return `${options.root}prop/pillory/back-dirty.png`;
				}
				return `${options.root}prop/pillory/back-clean.png`;
			},
			showfn(options) {
				const pillory = options.props.pillory;
				return pillory.show && !pillory.hasHorse;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: CombatRenderer.indices.head - 1,
		},
		pilloryFront: {
			srcfn(options) {
				const pillory = options.props.pillory;
				if (pillory.hasHorse) {
					return `${options.root}prop/pillory/front-horse.png`;
				}
				if (pillory.isDirty) {
					return `${options.root}prop/pillory/front-dirty.png`;
				}
				return `${options.root}prop/pillory/front-clean.png`;
			},
			showfn(options) {
				return options.props.pillory.show;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: CombatRenderer.indices.head + 1,
		},
		pilloryTomatoes: {
			srcfn(options) {
				const pillory = options.props.pillory;
				return `${options.root}prop/pillory/tomato/${pillory.tomatoes}.png`;
			},
			showfn(options) {
				const pillory = options.props.pillory;
				return pillory.show && pillory.isDirty && [1, 2, 3, 4].includes(pillory.tomatoes);
			},
			animationfn(options) {
				return options.animKey;
			},
			z: CombatRenderer.indices.head + 1,
		},
		/*
		 *    ███    ███  █████   ██████ ██   ██ ██ ███    ██ ███████ ███████
		 *    ████  ████ ██   ██ ██      ██   ██ ██ ████   ██ ██      ██
		 *    ██ ████ ██ ███████ ██      ███████ ██ ██ ██  ██ █████   ███████
		 *    ██  ██  ██ ██   ██ ██      ██   ██ ██ ██  ██ ██ ██           ██
		 *    ██      ██ ██   ██  ██████ ██   ██ ██ ██   ████ ███████ ███████
		 */
		breastMilker: {
			srcfn(options) {
				const size = Math.clamp(options.breastSize, 1, 4);
				return `${options.root}machine/milker/${options.position}/breasts-${size}.png`;
			},
			showfn(options) {
				return !!options.machines.breastMilker.show;
			},
			animationfn(options) {
				return options.animKey;
			},
			zfn(options) {
				if (options.position === "doggy") {
					return CombatRenderer.indices.base + 10;
				}
				return CombatRenderer.indices.base + 12;
			},
		},
		breastMilkerVolume: {
			srcfn(options) {
				const size = Math.clamp(options.breastSize, 1, 4);
				return `${options.root}machine/milker/${options.position}/breasts-${size}-milk.png`;
			},
			showfn(options) {
				return !!options.machines.breastMilker.show;
			},
			animationfn(options) {
				return options.animKey;
			},
			zfn(options) {
				if (options.position === "doggy") {
					return CombatRenderer.indices.base + 9;
				}
				return CombatRenderer.indices.base + 11;
			},
		},
		penisMilker: {
			srcfn(options) {
				return `${options.root}machine/milker/${options.position}/penis.png`;
			},
			showfn(options) {
				return !!options.machines.penisMilker.show;
			},
			animationfn(options) {
				return options.machineAnimKey;
			},
			z: CombatRenderer.indices.base + 7,
		},
		penisMilkerVolume: {
			srcfn(options) {
				return `${options.root}machine/milker/${options.position}/penis-semen.png`;
			},
			showfn(options) {
				return !!options.machines.penisMilker.show;
			},
			animationfn(options) {
				return options.machineAnimKey;
			},
			z: CombatRenderer.indices.base + 4,
		},
		/*
		 *    ████████ ███████ ███    ██ ████████  █████   ██████ ██      ███████ ███████
		 *       ██    ██      ████   ██    ██    ██   ██ ██      ██      ██      ██
		 *       ██    █████   ██ ██  ██    ██    ███████ ██      ██      █████   ███████
		 *       ██    ██      ██  ██ ██    ██    ██   ██ ██      ██      ██           ██
		 *       ██    ███████ ██   ████    ██    ██   ██  ██████ ███████ ███████ ███████
		 */
		tentacleAnal: {
			srcfn(options) {
				return `${options.src}tentacles/${options.tentacles.anus.state}.png`;
			},
			showfn(options) {
				return options.tentacles.anus.show;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: 49,
		},
		tentacleBreasts: {
			srcfn(options) {
				return `${options.src}tentacles/${options.tentacles.breasts.state}.png`;
			},
			showfn(options) {
				return options.tentacles.breasts.show;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: 49,
		},
		tentacleFeet: {
			srcfn(options) {
				return `${options.src}tentacles/${options.tentacles.feet.state}.png`;
			},
			showfn(options) {
				return options.tentacles.feet.show;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: 49,
		},
		tentacleLeftArm: {
			srcfn(options) {
				return `${options.src}tentacles/${options.tentacles.backArm.state}.png`;
			},
			showfn(options) {
				return options.tentacles.backArm.show;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: 49,
		},
		tentacleRightArm: {
			srcfn(options) {
				return `${options.src}tentacles/${options.tentacles.frontArm.state}.png`;
			},
			showfn(options) {
				return options.tentacles.frontArm.show;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: 49,
		},
		tentacleLeftLeg: {
			srcfn(options) {
				return `${options.src}tentacles/${options.tentacles.backLeg.state}.png`;
			},
			showfn(options) {
				return options.tentacles.backLeg.show;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: 49,
		},
		tentacleRightLeg: {
			srcfn(options) {
				return `${options.src}tentacles/${options.tentacles.frontLeg.state}.png`;
			},
			showfn(options) {
				return options.tentacles.frontLeg.show;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: 49,
		},
		tentacleOral: {
			srcfn(options) {
				return `${options.src}tentacles/${options.tentacles.mouth.state}.png`;
			},
			showfn(options) {
				return options.tentacles.mouth.show;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: 49,
		},
		tentaclePenis: {
			srcfn(options) {
				return `${options.src}tentacles/${options.tentacles.penis.state}.png`;
			},
			showfn(options) {
				return options.tentacles.penis.show;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: CombatRenderer.indices.frontLowerOverwear + 1,
		},
		tentacleVagina: {
			srcfn(options) {
				return `${options.src}tentacles/${options.tentacles.vagina.state}.png`;
			},
			showfn(options) {
				return options.tentacles.vagina.show;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: 49,
		},
		/*
		 *	██████   █████  ███████ ███████
		 *	██   ██ ██   ██ ██      ██
		 *	██████  ███████ ███████ █████
		 *	██   ██ ██   ██      ██ ██
		 *	██████  ██   ██ ███████ ███████
		 */
		backarm: {
			srcfn(options) {
				return `${options.src}body/arms/back-${options.armBackPosition}.png`;
			},
			showfn(options) {
				if (!options.showPlayer) return false;
				if (options.position === "missionary" && options.armBackPosition === "default") return false;
				if (options.armBackPosition === "bound") return false;
				return true;
			},
			animationfn(options) {
				return options.animKey;
			},
			filters: ["body"],
			z: CombatRenderer.indices.backArm,
		},
		backthigh: {
			srcfn(options) {
				return `${options.src}body/thighs/back-${options.legBackPosition}.png`;
			},
			showfn(options) {
				return !!options.showPlayer;
			},
			animationfn(options) {
				return options.animKey;
			},
			filters: ["body"],
			z: CombatRenderer.indices.backThigh,
		},
		backleg: {
			srcfn(options) {
				return `${options.src}body/legs/back-${options.legBackPosition}.png`;
			},
			showfn(options) {
				return !!options.showPlayer;
			},
			animationfn(options) {
				return options.animKey;
			},
			filters: ["body"],
			z: CombatRenderer.indices.backLeg,
		},
		base: {
			srcfn(options) {
				return `${options.src}body/base.png`;
			},
			showfn(options) {
				return !!options.showPlayer;
			},
			animationfn(options) {
				return options.animKey;
			},
			filters: ["body"],
			z: CombatRenderer.indices.base,
		},
		frontthigh: {
			srcfn(options) {
				return `${options.src}body/thighs/front-${options.legFrontPosition}.png`;
			},
			showfn(options) {
				const result = options.showPlayer;
				return !!result;
			},
			animationfn(options) {
				return options.animKey;
			},
			filters: ["body"],
			z: CombatRenderer.indices.frontThigh,
		},
		frontleg: {
			srcfn(options) {
				return `${options.src}body/legs/front-${options.legFrontPosition}.png`;
			},
			showfn(options) {
				return !!options.showPlayer;
			},
			animationfn(options) {
				return options.animKey;
			},
			filters: ["body"],
			z: CombatRenderer.indices.frontLeg,
		},
		frontarm: {
			srcfn(options) {
				return `${options.src}body/arms/front-${options.armFrontPosition}.png`;
			},
			showfn(options) {
				return !!options.showPlayer;
			},
			animationfn(options) {
				return options.animKey;
			},
			filters: ["body"],
			z: CombatRenderer.indices.frontArm,
		},
		frontbreast: {
			srcfn(options) {
				return `${options.src}body/breasts/${options.breastSize}.png`;
			},
			showfn(options) {
				if (!options.breastSize) return false;
				const result = options.showPlayer && options.breastsExposed;
				return !!result;
			},
			animationfn(options) {
				return options.animKey;
			},
			filters: ["body"],
			z: CombatRenderer.indices.base + 10,
		},
		penetrator: {
			srcfn(options) {
				return `${options.src}body/penetrator/default-default.png`;
			},
			showfn(options) {
				const penetrator = options.penetrator;
				const result = options.showPlayer && penetrator?.show;
				return !!result;
			},
			animationfn(options) {
				return options.animKey;
			},
			filters: ["body"],
			z: CombatRenderer.indices.backLowerOverwear + 1,
		},
		penetratorEjaculate: {
			srcfn(options) {
				const penetrator = options.penetrator;
				return `${options.src}body/penetrator/default-default-${penetrator?.ejaculate.type}.png`;
			},
			showfn(options) {
				const penetrator = options.penetrator;
				console.log("ejac penetrator", JSON.parse(JSON.stringify(penetrator)));
				if (options.machines.penisMilker.show) return false;
				const result = options.showPlayer && penetrator?.show && penetrator?.isEjaculating;
				return !!result;
			},
			animationfn(options) {
				return "sex-4f-vfast";
			},
			z: CombatRenderer.indices.backLowerOverwear + 1,
		},
		/*
		 *	██   ██ ███████  █████  ██████
		 *	██   ██ ██      ██   ██ ██   ██
		 *	███████ █████   ███████ ██   ██
		 *	██   ██ ██      ██   ██ ██   ██
		 *	██   ██ ███████ ██   ██ ██████
		 */
		head: {
			srcfn(options) {
				return `${options.src}body/head/head.png`;
			},
			showfn(options) {
				return !!options.showPlayer;
			},
			animationfn(options) {
				return options.animKey;
			},
			filters: ["body"],
			z: CombatRenderer.indices.head,
		},
		frontEye: {
			srcfn(options) {
				return `${options.src}body/head/eyes.png`;
			},
			showfn(options) {
				return !!options.showPlayer && !!options.showFace;
			},
			animationfn(options) {
				return options.animKey;
			},
			filtersfn(options) {
				return [options.position === "missionary" ? "rightEye" : "leftEye"];
			},
			z: CombatRenderer.indices.head + 1,
		},
		eyelid: {
			srcfn(options) {
				return `${options.src}body/head/eyelids.png`;
			},
			showfn(options) {
				const result = options.showPlayer && !!options.showFace;
				return !!result;
			},
			animationfn(options) {
				return options.animKey;
			},
			filters: ["body"],
			z: CombatRenderer.indices.head + 2,
		},
		eyelashes: {
			srcfn(options) {
				return `${options.src}body/head/lashes.png`;
			},
			showfn(options) {
				return !!options.showPlayer && !!options.showFace;
			},
			animationfn(options) {
				return options.animKey;
			},
			filters: ["phair"],
			z: CombatRenderer.indices.head + 3,
		},
		blush: {
			srcfn(options) {
				return `${options.src}body/head/blush/${options.blush}.png`;
			},
			showfn(options) {
				const result = options.showPlayer && !!options.showFace && options.blush > 0;
				return !!result;
			},
			animationfn(options) {
				return options.animKey;
			},
			filters: ["body"],
			z: CombatRenderer.indices.head + 1,
		},
		/* This creates a weird effect on the face, tbi */
		tears: {
			srcfn(options) {
				return `${options.src}body/head/tear/${options.tears}.png`;
			},
			showfn(options) {
				const result = options.showPlayer && options.showFace && options.tears > 0;
				return !!result;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: CombatRenderer.indices.head + 2,
		},
		mouth: {
			srcfn(options) {
				const mouth = options.mouth;
				if (mouth.inOral || mouth.open) {
					return `${options.src}body/oral/mouth.png`;
				}
				return `${options.src}body/oral/closedmouth.png`;
			},
			showfn(options) {
				return !!options.showPlayer && !!options.showFace;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: CombatRenderer.indices.head + 1,
		},
		tongue: {
			srcfn(options) {
				return `${options.src}body/oral/openmouth.png`;
			},
			showfn(options) {
				const mouth = options.mouth;
				return !!options.showPlayer && !!options.showFace && mouth.inOral;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: CombatRenderer.indices.head + 1,
		},
		hair: {
			srcfn(options) {
				return `${options.src}hair/${options.hairType}/${options.hairLength}.png`;
			},
			showfn(options) {
				return !!options.showPlayer;
			},
			animationfn(options) {
				return options.animKey;
			},
			filters: ["hair"],
			z: CombatRenderer.indices.hair,
		},
		/*
		 *    ████████ ██████   █████  ███    ██ ███████ ███████  ██████  ██████  ███    ███  █████  ████████ ██  ██████  ███    ██
		 *       ██    ██   ██ ██   ██ ████   ██ ██      ██      ██    ██ ██   ██ ████  ████ ██   ██    ██    ██ ██    ██ ████   ██
		 *       ██    ██████  ███████ ██ ██  ██ ███████ █████   ██    ██ ██████  ██ ████ ██ ███████    ██    ██ ██    ██ ██ ██  ██
		 *       ██    ██   ██ ██   ██ ██  ██ ██      ██ ██      ██    ██ ██   ██ ██  ██  ██ ██   ██    ██    ██ ██    ██ ██  ██ ██
		 *       ██    ██   ██ ██   ██ ██   ████ ███████ ██       ██████  ██   ██ ██      ██ ██   ██    ██    ██  ██████  ██   ████
		 */
		angelWingsBack: PlayerCanvasHelper.genTransformationLayer("angel", "wings", "back"),
		angelWingsFront: PlayerCanvasHelper.genTransformationLayer("angel", "wings", "front"),
		angelHaloBack: PlayerCanvasHelper.genTransformationLayer("angel", "halo", "back"),
		angelHaloFront: PlayerCanvasHelper.genTransformationLayer("angel", "halo", "front"),

		birdTailBack: PlayerCanvasHelper.genTransformationLayer("bird", "tail", "back"),
		birdTailFront: PlayerCanvasHelper.genTransformationLayer("bird", "tail", "front"),
		birdWingsBack: PlayerCanvasHelper.genTransformationLayer("bird", "wings", "back"),
		birdWingsFront: PlayerCanvasHelper.genTransformationLayer("bird", "wings", "front"),

		catTailBack: PlayerCanvasHelper.genTransformationLayer("cat", "tail", "back"),
		catTailFront: PlayerCanvasHelper.genTransformationLayer("cat", "tail", "front"),

		cowHornsBack: PlayerCanvasHelper.genTransformationLayer("cow", "horns", "back"),
		cowHornsFront: PlayerCanvasHelper.genTransformationLayer("cow", "horns", "front"),
		cowTailBack: PlayerCanvasHelper.genTransformationLayer("cow", "tail", "back"),
		cowTailFront: PlayerCanvasHelper.genTransformationLayer("cow", "tail", "front"),

		demonHornsBack: PlayerCanvasHelper.genTransformationLayer("demon", "horns", "back"),
		demonHornsFront: PlayerCanvasHelper.genTransformationLayer("demon", "horns", "front"),
		demonTailBack: PlayerCanvasHelper.genTransformationLayer("demon", "tail", "back"),
		demonTailFront: PlayerCanvasHelper.genTransformationLayer("demon", "tail", "front"),
		demonWingsBack: PlayerCanvasHelper.genTransformationLayer("demon", "wings", "back"),
		demonWingsFront: PlayerCanvasHelper.genTransformationLayer("demon", "wings", "front"),

		fallenAngelWingsBack: PlayerCanvasHelper.genTransformationLayer("fallenAngel", "wings", "back"),
		fallenAngelWingsFront: PlayerCanvasHelper.genTransformationLayer("fallenAngel", "wings", "front"),
		fallenAngelHaloBack: PlayerCanvasHelper.genTransformationLayer("fallenAngel", "halo", "back"),
		fallenAngelHaloFront: PlayerCanvasHelper.genTransformationLayer("fallenAngel", "halo", "front"),

		foxTailBack: PlayerCanvasHelper.genTransformationLayer("fox", "tail", "back"),
		foxTailFront: PlayerCanvasHelper.genTransformationLayer("fox", "tail", "front"),

		wolfTailBack: PlayerCanvasHelper.genTransformationLayer("wolf", "tail", "back"),
		wolfTailFront: PlayerCanvasHelper.genTransformationLayer("wolf", "tail", "front"),
		/*
		 *    ██████   ██████  ██████  ██    ██ ██     ██ ██████  ██ ████████ ██ ███    ██  ██████
		 *    ██   ██ ██    ██ ██   ██  ██  ██  ██     ██ ██   ██ ██    ██    ██ ████   ██ ██
		 *    ██████  ██    ██ ██   ██   ████   ██  █  ██ ██████  ██    ██    ██ ██ ██  ██ ██   ███
		 *    ██   ██ ██    ██ ██   ██    ██    ██ ███ ██ ██   ██ ██    ██    ██ ██  ██ ██ ██    ██
		 *    ██████   ██████  ██████     ██     ███ ███  ██   ██ ██    ██    ██ ██   ████  ██████
		 */
		bodywritingForehead: PlayerCanvasHelper.genBodywritingLayer("forehead", {
			z: CombatRenderer.indices.head + 3,
		}),
		bodywritingBackCheek: PlayerCanvasHelper.genBodywritingLayer("backCheek", {
			z: CombatRenderer.indices.base - 1,
		}),
		bodywritingFrontCheek: PlayerCanvasHelper.genBodywritingLayer("frontCheek", {
			z: CombatRenderer.indices.base + 1,
		}),
		bodywritingBackShoulder: PlayerCanvasHelper.genBodywritingLayer("backShoulder", {
			z: CombatRenderer.indices.base - 1,
		}),
		bodywritingFrontShoulder: PlayerCanvasHelper.genBodywritingLayer("frontShoulder", {
			z: CombatRenderer.indices.base + 1,
		}),
		bodywritingBreasts: PlayerCanvasHelper.genBodywritingLayer("breasts", {
			z: CombatRenderer.indices.base + 11,
		}),
		bodywritingBack: PlayerCanvasHelper.genBodywritingLayer("back", {
			z: CombatRenderer.indices.base + 1,
		}),
		bodywritingBackBottom: PlayerCanvasHelper.genBodywritingLayer("backBottom", {
			z: CombatRenderer.indices.base - 1,
		}),
		bodywritingFrontBottom: PlayerCanvasHelper.genBodywritingLayer("frontBottom", {
			z: CombatRenderer.indices.base + 1,
		}),
		bodywritingPubic: PlayerCanvasHelper.genBodywritingLayer("pubic", {
			z: CombatRenderer.indices.base + 1,
		}),
		bodywritingBackThigh: PlayerCanvasHelper.genBodywritingLayer("backThigh", {
			z: CombatRenderer.indices.backThigh + 1,
		}),
		bodywritingFrontThigh: PlayerCanvasHelper.genBodywritingLayer("frontThigh", {
			z: CombatRenderer.indices.frontThigh + 1,
		}),
		/*
		 *	 ██████ ██       ██████  ████████ ██   ██ ██ ███    ██  ██████
		 *	██      ██      ██    ██    ██    ██   ██ ██ ████   ██ ██
		 *	██      ██      ██    ██    ██    ███████ ██ ██ ██  ██ ██   ███
		 *	██      ██      ██    ██    ██    ██   ██ ██ ██  ██ ██ ██    ██
		 *	 ██████ ███████  ██████     ██    ██   ██ ██ ██   ████  ██████
		 */
		facewear: PlayerCanvasHelper.genClothingLayer("face", {
			z: CombatRenderer.indices.head + 4,
		}),
		facewearAcc: PlayerCanvasHelper.genClothingAccLayer("face", {
			z: CombatRenderer.indices.head + 4,
		}),
		footwearBack: PlayerCanvasHelper.genClothingLayer("feet", {
			srcfn(options) {
				const clothes = options.clothes.feet;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/feet/${clothes.name}/back-${clothes.positions.back}.png`;
				console.log("Path:", path);
				return path;
			},
			z: CombatRenderer.indices.backFootwear,
		}),
		footwearAccBack: PlayerCanvasHelper.genClothingAccLayer("feet", {
			srcfn(options) {
				const clothes = options.clothes.feet;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/feet/${clothes.name}/back-${clothes.positions.back}-acc.png`;
				console.log("Feet Acc Back Path:", path);
				return path;
			},
			z: CombatRenderer.indices.backFootwear,
		}),
		footwearFront: PlayerCanvasHelper.genClothingLayer("feet", {
			srcfn(options) {
				const clothes = options.clothes.feet;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/feet/${clothes.name}/front-${clothes.positions.front}.png`;
				console.log("Path:", path);
				return path;
			},
			z: CombatRenderer.indices.frontFootwear,
		}),
		footwearAccFront: PlayerCanvasHelper.genClothingAccLayer("feet", {
			srcfn(options) {
				const clothes = options.clothes.feet;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/feet/${clothes.name}/front-${clothes.positions.front}-acc.png`;
				console.log("Feet Acc Front Path:", path);
				return path;
			},
			z: CombatRenderer.indices.frontFootwear,
		}),
		genitals: PlayerCanvasHelper.genClothingLayer("genitals", {
			z: CombatRenderer.indices.base + 6,
		}),
		genitalsAcc: PlayerCanvasHelper.genClothingAccLayer("genitals", {
			z: CombatRenderer.indices.base + 6,
		}),
		handsBack: PlayerCanvasHelper.genClothingLayer("hands", {
			srcfn(options) {
				const clothes = options.clothes.hands;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/hands/${clothes.name}/back-${options.armBackPosition}.png`;
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.hands;
				if (!CombatRenderer.isClothingShown(clothes, options.showClothing)) return false;
				if (options.position === "doggy") {
					const states = ["default", "handjob"];
					if (clothes.isBoundable) {
						states.push("bound");
					}
					return states.includes(options.armBackPosition);
				}
				return ["handjob"].includes(options.armBackPosition);
			},
			z: CombatRenderer.indices.backArm + 1,
		}),
		handsBackAcc: PlayerCanvasHelper.genClothingAccLayer("hands", {
			srcfn(options) {
				const clothes = options.clothes.hands;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/hands/${clothes.name}/back-${options.armBackPosition}-acc.png`;
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.hands;
				if (!CombatRenderer.isClothingShown(clothes, options.showClothing)) return false;
				if (!clothes.hasAccessory) return false;
				if (options.position === "doggy") {
					const states = ["default", "handjob"];
					if (clothes.isBoundable) {
						states.push("bound");
					}
					return states.includes(options.armBackPosition);
				}
				return ["handjob"].includes(options.armBackPosition);
			},
			z: CombatRenderer.indices.backArm + 1,
		}),
		handsFront: PlayerCanvasHelper.genClothingLayer("hands", {
			srcfn(options) {
				const clothes = options.clothes.hands;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/hands/${clothes.name}/front-${options.armFrontPosition}.png`;
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.hands;
				if (!CombatRenderer.isClothingShown(clothes, options.showClothing)) return false;
				const available = options.position === "doggy" ? ["default", "handjob"] : ["default", "handjob", "stroke"];
				return available.includes(options.armFrontPosition);
			},
			z: CombatRenderer.indices.frontArm + 1,
		}),
		handsFrontAcc: PlayerCanvasHelper.genClothingAccLayer("hands", {
			srcfn(options) {
				const clothes = options.clothes.hands;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/hands/${clothes.name}/front-${options.armFrontPosition}-acc.png`;
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.hands;
				const show = options.showClothing && !CombatRenderer.isClothingShown(clothes, options.showClothing) && clothes.hasAccessory;
				const available = options.position === "doggy" ? ["default", "handjob"] : ["default", "handjob", "stroke"];
				const found = available.includes(options.armFrontPosition);
				return !!show && !!found;
			},
			z: CombatRenderer.indices.frontArm + 1,
		}),
		headwearBack: PlayerCanvasHelper.genClothingLayer("head", {
			srcfn(options) {
				const clothes = options.clothes.head;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/head/${clothes.name}/back.png`;
				console.log("Headwear [back]", "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.head;
				if (!CombatRenderer.isClothingShown(clothes, options.showClothing)) return false;
				return !!clothes.hasBackImg;
			},
			z: CombatRenderer.indices.head - 1,
		}),
		headwear: PlayerCanvasHelper.genClothingLayer("head", {
			z: CombatRenderer.indices.hair + 1,
		}),
		headwearAcc: PlayerCanvasHelper.genClothingAccLayer("head", {
			z: CombatRenderer.indices.hair + 1,
		}),
		legwearBack: PlayerCanvasHelper.genClothingLayer("legs", {
			srcfn(options) {
				const clothes = options.clothes.legs;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/legs/${clothes.name}/back-${clothes.positions.back}-${clothes.state}.png`;
				console.log("legs", "Path:", path);
				return path;
			},
			z: CombatRenderer.indices.backLegwear,
		}),
		legwearAccBack: PlayerCanvasHelper.genClothingAccLayer("legs", {
			srcfn(options) {
				const clothes = options.clothes.legs;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/legs/${clothes.name}/back-${clothes.positions.back}-${clothes.state}-acc.png`;
				console.log("legs", "Path:", path);
				return path;
			},
			z: CombatRenderer.indices.backLegwear,
		}),
		legwearFront: PlayerCanvasHelper.genClothingLayer("legs", {
			srcfn(options) {
				const clothes = options.clothes.legs;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/legs/${clothes.name}/front-${clothes.positions.front}-${clothes.state}.png`;
				console.log("legs", "Path:", path);
				return path;
			},
			z: CombatRenderer.indices.frontLegwear,
		}),
		legwearAccFront: PlayerCanvasHelper.genClothingAccLayer("legs", {
			srcfn(options) {
				const clothes = options.clothes.legs;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/legs/${clothes.name}/front-${clothes.positions.front}-${clothes.state}-acc.png`;
				console.log("legs", "Path:", path);
				return path;
			},
			z: CombatRenderer.indices.frontLegwear,
		}),
		backLower: PlayerCanvasHelper.genClothingLayer("lower", {
			srcfn(options) {
				const clothes = options.clothes.lower;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/lower/${clothes.name}/back-${clothes.positions.back}-${clothes.state}.png`;
				console.log("Lower back path:", path);
				return path;
			},
			z: CombatRenderer.indices.backLowerWear,
		}),
		backLowerAcc: PlayerCanvasHelper.genClothingAccLayer("lower", {
			srcfn(options) {
				const clothes = options.clothes.lower;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/lower/${clothes.name}/back-${clothes.positions.back}-${clothes.state}-acc.png`;
				console.log("Lower back acc path:", path);
				return path;
			},
			z: CombatRenderer.indices.backLowerWear,
		}),
		frontLower: PlayerCanvasHelper.genClothingLayer("lower", {
			srcfn(options) {
				const clothes = options.clothes.lower;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/lower/${clothes.name}/front-${clothes.positions.front}-${clothes.state}.png`;
				console.log("Lower front path:", path);
				return path;
			},
			z: CombatRenderer.indices.frontLowerWear,
		}),
		frontLowerAcc: PlayerCanvasHelper.genClothingAccLayer("lower", {
			srcfn(options) {
				const clothes = options.clothes.lower;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/lower/${clothes.name}/front-${clothes.positions.front}-${clothes.state}-acc.png`;
				console.log("Lower front acc path:", path);
				return path;
			},
			z: CombatRenderer.indices.frontLowerWear,
		}),
		neckWear: PlayerCanvasHelper.genClothingLayer("neck", {
			z: CombatRenderer.indices.head - 1,
		}),
		neckWearAcc: PlayerCanvasHelper.genClothingAccLayer("neck", {
			z: CombatRenderer.indices.head - 1,
		}),
		overHead: PlayerCanvasHelper.genClothingLayer("over_head", {
			z: CombatRenderer.indices.head + 2,
		}),
		overHeadAcc: PlayerCanvasHelper.genClothingAccLayer("over_head", {
			z: CombatRenderer.indices.head + 2,
		}),
		backOverLower: PlayerCanvasHelper.genClothingLayer("over_lower", {
			srcfn(options) {
				const clothes = options.clothes.over_lower;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/over_lower/${clothes.name}/back-${clothes.positions.back}-${clothes.state}.png`;
				console.log("Over lower back path:", path);
				return path;
			},
			show: false,
			z: CombatRenderer.indices.backLowerOverwear,
		}),
		backOverLowerAcc: PlayerCanvasHelper.genClothingAccLayer("over_lower", {
			srcfn(options) {
				const clothes = options.clothes.over_lower;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/over_lower/${clothes.name}/back-${clothes.positions.back}-${clothes.state}-acc.png`;
				console.log("Over lower back acc path:", path);
				return path;
			},
			show: false,
			z: CombatRenderer.indices.backLowerOverwear,
		}),
		frontOverLower: PlayerCanvasHelper.genClothingLayer("over_lower", {
			z: CombatRenderer.indices.frontLowerOverwear,
		}),
		frontOverLowerAcc: PlayerCanvasHelper.genClothingAccLayer("over_lower", {
			z: CombatRenderer.indices.frontLowerOverwear,
		}),
		overUpper: PlayerCanvasHelper.genClothingLayer("over_upper", {
			z: CombatRenderer.indices.frontArm - 1,
		}),
		overUpperAcc: PlayerCanvasHelper.genClothingAccLayer("over_upper", {
			z: CombatRenderer.indices.frontArm - 1,
		}),
		backUnderLower: PlayerCanvasHelper.genClothingLayer("under_lower", {
			srcfn(options) {
				const clothes = options.clothes.under_lower;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/under_lower/${clothes.name}/back-${clothes.positions.back}-${clothes.state}.png`;
				console.log("Under lower back path:", path);
				return path;
			},
			show: false,
			z: CombatRenderer.indices.backLowerUnderwear,
		}),
		backUnderLowerAcc: PlayerCanvasHelper.genClothingAccLayer("under_lower", {
			srcfn(options) {
				const clothes = options.clothes.under_lower;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/under_lower/${clothes.name}/back-${clothes.positions.back}-${clothes.state}-acc.png`;
				console.log("Under lower back acc path:", path);
				return path;
			},
			show: false,
			z: CombatRenderer.indices.backLowerUnderwear,
		}),
		frontUnderLower: PlayerCanvasHelper.genClothingLayer("under_lower", {
			srcfn(options) {
				const clothes = options.clothes.under_lower;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/under_lower/${clothes.name}/front-${clothes.positions.front}-${clothes.state}.png`;
				console.log("Under lower front path:", path);
				return path;
			},
			z: CombatRenderer.indices.frontLowerUnderwear,
		}),
		frontUnderLowerAcc: PlayerCanvasHelper.genClothingAccLayer("under_lower", {
			srcfn(options) {
				const clothes = options.clothes.under_lower;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/under_lower/${clothes.name}/front-${clothes.positions.front}-${clothes.state}-acc.png`;
				console.log("Under lower front acc path:", path);
				return path;
			},
			z: CombatRenderer.indices.frontLowerUnderwear,
		}),
		underUpper: PlayerCanvasHelper.genClothingLayer("under_upper", {
			z: CombatRenderer.indices.frontArm - 4,
		}),
		underUpperAcc: PlayerCanvasHelper.genClothingAccLayer("under_upper", {
			z: CombatRenderer.indices.frontArm - 4,
		}),
		underUpperBreasts: PlayerCanvasHelper.genClothingLayer("under_upper", {
			srcfn(options) {
				const clothes = options.clothes.under_upper;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/under_upper/${clothes.name}/breasts/${clothes.breasts.size}.png`;
				console.log("upper", "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.under_upper;
				const show = CombatRenderer.isClothingShown(clothes, options.showClothing) && clothes.breasts.show;
				console.log("Show under upper breasts:", show);
				return !!show;
			},
			z: CombatRenderer.indices.frontArm - 4,
		}),
		upper: PlayerCanvasHelper.genClothingLayer("upper", {
			z: CombatRenderer.indices.frontArm - 3,
		}),
		upperAcc: PlayerCanvasHelper.genClothingAccLayer("upper", {
			z: CombatRenderer.indices.frontArm - 3,
		}),
		upperBreasts: PlayerCanvasHelper.genClothingLayer("upper", {
			srcfn(options) {
				const clothes = options.clothes.upper;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/upper/${clothes.name}/breasts/${clothes.breasts.size}.png`;
				console.log("upper", "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.upper;
				const show = CombatRenderer.isClothingShown(clothes, options.showClothing) && clothes.breasts.show;
				console.log("Show upper breasts:", show);
				return !!show;
			},
			z: CombatRenderer.indices.frontArm - 3,
		}),
		upperBackSleeves: PlayerCanvasHelper.genClothingLayer("upper", {
			srcfn(options) {
				const clothes = options.clothes.upper;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/upper/${clothes.name}/sleeves/back-${options.armBackPosition}.png`;
				console.log("upper", "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.upper;
				const show = CombatRenderer.isClothingShown(clothes, options.showClothing) && clothes.sleeves.show;
				// If missionary: Sleeves on the side behind are never shown, except for handjobs.
				if (options.position === "doggy" && options.armBackPosition === "bound") return false;
				if (options.position === "missionary" && !["handjob"].includes(clothes.sleeves.state)) return false;
				console.log("Show upper breasts:", show);
				return !!show;
			},
			z: CombatRenderer.indices.backArm + 1,
		}),
		upperFrontSleeves: PlayerCanvasHelper.genClothingLayer("upper", {
			srcfn(options) {
				const clothes = options.clothes.upper;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/upper/${clothes.name}/sleeves/front-${options.armFrontPosition}.png`;
				console.log("upper", "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.upper;
				const show = CombatRenderer.isClothingShown(clothes, options.showClothing) && clothes.sleeves.show;
				console.log("Show upper breasts:", show);
				return !!show;
			},
			z: CombatRenderer.indices.frontArm + 1,
		}),
	},
};
Renderer.CanvasModels.combatMainPc = combatMainPc;
