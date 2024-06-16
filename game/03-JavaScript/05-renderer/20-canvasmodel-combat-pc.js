// @ts-check
/* global CombatRenderer, PlayerCombatMapper */

/**
 * @typedef CombatZIndices
 * @type {object}
 * Combat layers
 * @property {0} far
 * @property {50} base
 * @property {100} near
 * Hair:
 * @property {20} backHair
 * @property {81} hair
 * @property {70} head
 * Back legs:
 * @property {26} backCalf
 * @property {27} backFoot
 * @property {28} backThigh
 * @property {29} backCalfUnderwear
 * @property {30} backThighUnderwear
 * @property {31} backFootwear
 * @property {32} backCalfWear
 * @property {33} backThighWear
 * @property {34} backCalfOverwear
 * @property {35} backThighOverwear
 * Front legs:
 * @property {65} frontCalf
 * @property {66} frontFoot
 * @property {67} frontThigh
 * @property {68} frontCalfUnderwear
 * @property {69} frontThighUnderwear
 * @property {70} frontFootwear
 * @property {71} frontCalfWear
 * @property {72} frontThighWear
 * @property {73} frontCalfOverwear
 * @property {74} frontThighOverwear
 * Back arms:
 * @property {30} backArm
 * Front arms:
 * @property {75} frontArm
 * Transformation parts
 * @property {40} backWings
 * @property {40} backHalo
 * @property {40} backHorns
 * @property {40} backTail
 * @property {40} frontWings
 * @property {84} frontHalo
 * @property {83} frontHorns
 * @property {40} frontTail
 */

/**
 * @typedef {object} CanvasModelLayerPc
 * @property {boolean} [show] Show this layer, default false (if no show:true or showfn present, needs explicit `<<showlayer>>`). Do not use undefined/null/0/"" to hide layer!
 * @property {string} [src] Image path. Either `src` or `srcfn` is required.
 * @property {number} [z] Z-index (rendering order), higher=above, lower=below. Either `z` of `zfn` is required.
 * @property {number} [alpha] Layer opacity, from 0 (invisible) to 1 (opaque, default).
 * @property {boolean} [desaturate] Convert image to grayscale (before recoloring), default false.
 * @property {number} [brightness] Adjust brightness, from -1 to +1 (before recoloring), default 0.
 * @property {number} [contrast] Adjust contrast (before recoloring), default 1.
 * @property {string} [blendMode] Recoloring mode (see docs for globalCompositeOperation; "hard-light", "multiply" and "screen" ), default none.
 * @property {string|object} [blend] Color for recoloring, CSS color string or gradient spec (see model.d.ts).
 * @property {string} [masksrc] Mask image path. If present, only parts where mask is opaque will be displayed.
 * @property {string} [animation] Name of animation to apply, default none.
 * @property {number} [frames] Frame numbers used to display static images, array of subsprite indices. For example, if model frame count is 6 but layer has only 3 subsprites, default frames would be [0, 0, 1, 1, 2, 2].
 * @property {string[]} [filters] Names of filters that should be applied to the layer; filters themselves are taken from model options.
 * @property {number} [dx] Layer X position on the image, default 0.
 * @property {number} [dy] Layer Y position on the image, default 0.
 * @property {number} [width] Layer subsprite width, default = model width.
 * @property {number} [height] Layer subsprite width, default = model height.
 *
 * The following functions can be used instead of constant properties. Their arguments are (options) where options are model options provided in render call (from _modeloptions variable for <<rendermodel>>/<<animatemodel>> widget).
 * @property {function(Options): boolean} [showfn] (options)=>boolean Function generating `show` property. Should return boolean, do not use undefined/null/0/"" to hide layer, use of !! (double not) operator recommended.
 * @property {function(Options): string} [srcfn] (options)=>string.
 * @property {function(Options): number} [zfn] (options)=>number.
 * @property {function(Options): number} [alphafn] (options)=>number.
 * @property {function(Options): boolean} [desaturatefn] (options)=>boolean.
 * @property {function(Options): number} [brightnessfn] (options)=>number.
 * @property {function(Options): number} [contrastftn] (options)=>number.
 * @property {function(Options): (string|object)} [blendModefn] (options)=>(string|object).
 * @property {function(Options): string} [blendfn] (options)=>string.
 * @property {function(Options): string} [masksrcfn] (options)=>string.
 * @property {function(Options): string} [animationfn] (options)=>string.
 * @property {function(Options): number[]} [framesfn] (options)=>number[].
 * @property {function(Options): string[]} [filtersfn] (options)=>string[].
 * @property {function(Options): number} [dxfn] (options)=>number.
 * @property {function(Options): number} [dyfn] (options)=>number.
 * @property {function(Options): number} [widthfn] (options)=>number.
 * @property {function(Options): number} [heightfn] (options)=>number.
 */

/**
 * @typedef {object} CanvasModelPcOptions
 * @property {string} name Model name, for debugging.
 * @property {number} width Frame width.
 * @property {number} height Frame height.
 * @property {number} frames Number of frames for CSS animation.
 * @property {Object<string, CanvasModelLayerPc>} layers Layers (by name).
 * @property {Function} [generatedOptions] Function ()=>string[] names of generated options.
 * @property {Function} [defaultOptions] Function ()=>object returning default options.
 * @property {Function} [preprocess] Preprocessing function (options)=>void to generate temp options.
 */

/**
 * @type {CanvasModelPcOptions}
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
		console.log("Combat-model defaultOptions");
		return PlayerCombatMapper.generateOptions();
	},
	/*
	 *	██████  ██████  ███████ ██████  ██████   ██████   ██████ ███████ ███████ ███████
	 *	██   ██ ██   ██ ██      ██   ██ ██   ██ ██    ██ ██      ██      ██      ██
	 *	██████  ██████  █████   ██████  ██████  ██    ██ ██      █████   ███████ ███████
	 *	██      ██   ██ ██      ██      ██   ██ ██    ██ ██      ██           ██      ██
	 *	██      ██   ██ ███████ ██      ██   ██  ██████   ██████ ███████ ███████ ███████
	 */
	/**
	 * @param {any} options
	 */
	preprocess(options) {
		console.log("combatMainPc-Preprocess:", JSON.parse(JSON.stringify(options)));
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
			z: 49,
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
			z: CombatRenderer.indices.backCalf,
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
			z: CombatRenderer.indices.frontCalf,
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
			z: CombatRenderer.indices.base + 5,
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
			z: CombatRenderer.indices.base + 6,
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
				return !!options.showPlayer;
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
				const result = options.showPlayer;
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
				return !!options.showPlayer;
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
				const result = options.showFace && options.blush > 0;
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
				const result = options.showFace && options.tears > 0;
				return !!result;
			},
			z: CombatRenderer.indices.head + 2,
		},
		mouth: {
			srcfn(options) {
				let state = "closedmouth";
				if (options.inOral) state = "mouth";
				return `${options.src}body/oral/${state}.png`;
			},
			showfn(options) {
				return !!options.showPlayer;
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
		angelWingsBack: CombatRenderer.genTransformationLayer("angel", "wings", "back"),
		angelWingsFront: CombatRenderer.genTransformationLayer("angel", "wings", "front"),
		angelHaloBack: CombatRenderer.genTransformationLayer("angel", "halo", "back"),
		angelHaloFront: CombatRenderer.genTransformationLayer("angel", "halo", "front"),

		birdTailBack: CombatRenderer.genTransformationLayer("bird", "tail", "back"),
		birdTailFront: CombatRenderer.genTransformationLayer("bird", "tail", "front"),
		birdWingsBack: CombatRenderer.genTransformationLayer("bird", "wings", "back"),
		birdWingsFront: CombatRenderer.genTransformationLayer("bird", "wings", "front"),

		catTailBack: CombatRenderer.genTransformationLayer("cat", "tail", "back"),
		catTailFront: CombatRenderer.genTransformationLayer("cat", "tail", "front"),

		cowHornsBack: CombatRenderer.genTransformationLayer("cow", "horns", "back"),
		cowHornsFront: CombatRenderer.genTransformationLayer("cow", "horns", "front"),
		cowTailBack: CombatRenderer.genTransformationLayer("cow", "tail", "back"),
		cowTailFront: CombatRenderer.genTransformationLayer("cow", "tail", "front"),

		demonHornsBack: CombatRenderer.genTransformationLayer("demon", "horns", "back"),
		demonHornsFront: CombatRenderer.genTransformationLayer("demon", "horns", "front"),
		demonTailBack: CombatRenderer.genTransformationLayer("demon", "tail", "back"),
		demonTailFront: CombatRenderer.genTransformationLayer("demon", "tail", "front"),
		demonWingsBack: CombatRenderer.genTransformationLayer("demon", "wings", "back"),
		demonWingsFront: CombatRenderer.genTransformationLayer("demon", "wings", "front"),

		fallenAngelWingsBack: CombatRenderer.genTransformationLayer("fallenAngel", "wings", "back"),
		fallenAngelWingsFront: CombatRenderer.genTransformationLayer("fallenAngel", "wings", "front"),
		fallenAngelHaloBack: CombatRenderer.genTransformationLayer("fallenAngel", "halo", "back"),
		fallenAngelHaloFront: CombatRenderer.genTransformationLayer("fallenAngel", "halo", "front"),

		foxTailBack: CombatRenderer.genTransformationLayer("fox", "tail", "back"),
		foxTailFront: CombatRenderer.genTransformationLayer("fox", "tail", "front"),

		wolfTailBack: CombatRenderer.genTransformationLayer("wolf", "tail", "back"),
		wolfTailFront: CombatRenderer.genTransformationLayer("wolf", "tail", "front"),
		/*
		 *    ██████   ██████  ██████  ██    ██ ██     ██ ██████  ██ ████████ ██ ███    ██  ██████
		 *    ██   ██ ██    ██ ██   ██  ██  ██  ██     ██ ██   ██ ██    ██    ██ ████   ██ ██
		 *    ██████  ██    ██ ██   ██   ████   ██  █  ██ ██████  ██    ██    ██ ██ ██  ██ ██   ███
		 *    ██   ██ ██    ██ ██   ██    ██    ██ ███ ██ ██   ██ ██    ██    ██ ██  ██ ██ ██    ██
		 *    ██████   ██████  ██████     ██     ███ ███  ██   ██ ██    ██    ██ ██   ████  ██████
		 */
		bodywritingForehead: CombatRenderer.genBodywritingLayer("forehead", {
			z: CombatRenderer.indices.base + 1,
		}),
		bodywritingBackCheek: CombatRenderer.genBodywritingLayer("backCheek", {
			z: CombatRenderer.indices.base - 1,
		}),
		bodywritingFrontCheek: CombatRenderer.genBodywritingLayer("frontCheek", {
			z: CombatRenderer.indices.base + 1,
		}),
		bodywritingBackShoulder: CombatRenderer.genBodywritingLayer("backShoulder", {
			z: CombatRenderer.indices.base - 1,
		}),
		bodywritingFrontShoulder: CombatRenderer.genBodywritingLayer("frontShoulder", {
			z: CombatRenderer.indices.base + 1,
		}),
		bodywritingBreasts: CombatRenderer.genBodywritingLayer("breasts", {
			z: CombatRenderer.indices.base + 11,
		}),
		bodywritingBack: CombatRenderer.genBodywritingLayer("back", {
			z: CombatRenderer.indices.base + 1,
		}),
		bodywritingBackBottom: CombatRenderer.genBodywritingLayer("backBottom", {
			z: CombatRenderer.indices.base - 1,
		}),
		bodywritingFrontBottom: CombatRenderer.genBodywritingLayer("frontBottom", {
			z: CombatRenderer.indices.base + 1,
		}),
		bodywritingPubic: CombatRenderer.genBodywritingLayer("pubic", {
			z: CombatRenderer.indices.base + 1,
		}),
		bodywritingBackThigh: CombatRenderer.genBodywritingLayer("backThigh", {
			z: CombatRenderer.indices.backThigh + 1,
		}),
		bodywritingFrontThigh: CombatRenderer.genBodywritingLayer("frontThigh", {
			z: CombatRenderer.indices.frontThigh + 1,
		}),
		/*
		 *	 ██████ ██       ██████  ████████ ██   ██ ██ ███    ██  ██████
		 *	██      ██      ██    ██    ██    ██   ██ ██ ████   ██ ██
		 *	██      ██      ██    ██    ██    ███████ ██ ██ ██  ██ ██   ███
		 *	██      ██      ██    ██    ██    ██   ██ ██ ██  ██ ██ ██    ██
		 *	 ██████ ███████  ██████     ██    ██   ██ ██ ██   ████  ██████
		 */
		facewear: CombatRenderer.genClothingLayer("face", {
			z: CombatRenderer.indices.base + 4,
		}),
		facewearAcc: CombatRenderer.genClothingAccLayer("face", {
			z: CombatRenderer.indices.base + 4,
		}),
		footwearBack: CombatRenderer.genClothingLayer("feet", {
			srcfn(options) {
				const clothes = options.clothes.feet;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/feet/${clothes.name}/back-${clothes.positions.back}.png`;
				console.log("Path:", path);
				return path;
			},
			z: CombatRenderer.indices.backFootwear,
		}),
		footwearAccBack: CombatRenderer.genClothingAccLayer("feet", {
			srcfn(options) {
				const clothes = options.clothes.feet;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/feet/${clothes.name}/back-${clothes.positions.back}-acc.png`;
				console.log("Feet Acc Back Path:", path);
				return path;
			},
			z: CombatRenderer.indices.backFootwear,
		}),
		footwearFront: CombatRenderer.genClothingLayer("feet", {
			srcfn(options) {
				const clothes = options.clothes.feet;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/feet/${clothes.name}/front-${clothes.positions.front}.png`;
				console.log("Path:", path);
				return path;
			},
			z: CombatRenderer.indices.frontFootwear,
		}),
		footwearAccFront: CombatRenderer.genClothingAccLayer("feet", {
			srcfn(options) {
				const clothes = options.clothes.feet;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/feet/${clothes.name}/front-${clothes.positions.front}-acc.png`;
				console.log("Feet Acc Front Path:", path);
				return path;
			},
			z: CombatRenderer.indices.frontFootwear,
		}),
		genitals: CombatRenderer.genClothingLayer("genitals", {
			z: CombatRenderer.indices.base + 6,
		}),
		genitalsAcc: CombatRenderer.genClothingAccLayer("genitals", {
			z: CombatRenderer.indices.base + 6,
		}),
		handsBack: CombatRenderer.genClothingLayer("hands", {
			srcfn(options) {
				const clothes = options.clothes.hands;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/hands/${clothes.name}/back-${options.armBackPosition}.png`;
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.hands;
				if (!CombatRenderer.isClothingShown(options, clothes)) return false;
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
		handsBackAcc: CombatRenderer.genClothingAccLayer("hands", {
			srcfn(options) {
				const clothes = options.clothes.hands;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/hands/${clothes.name}/back-${options.armBackPosition}-acc.png`;
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.hands;
				if (!CombatRenderer.isClothingShown(options, clothes)) return false;
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
		handsFront: CombatRenderer.genClothingLayer("hands", {
			srcfn(options) {
				const clothes = options.clothes.hands;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/hands/${clothes.name}/front-${options.armFrontPosition}.png`;
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.hands;
				if (!CombatRenderer.isClothingShown(options, clothes)) return false;
				const available = options.position === "doggy" ? ["default", "handjob"] : ["default", "handjob", "stroke"];
				return available.includes(options.armFrontPosition);
			},
			z: CombatRenderer.indices.frontArm + 1,
		}),
		handsFrontAcc: CombatRenderer.genClothingAccLayer("hands", {
			srcfn(options) {
				const clothes = options.clothes.hands;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/hands/${clothes.name}/front-${options.armFrontPosition}-acc.png`;
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.hands;
				const show = options.showClothing && !CombatRenderer.isClothingShown(options, clothes) && clothes.hasAccessory;
				const available = options.position === "doggy" ? ["default", "handjob"] : ["default", "handjob", "stroke"];
				const found = available.includes(options.armFrontPosition);
				return !!show && !!found;
			},
			z: CombatRenderer.indices.frontArm + 1,
		}),
		headwearBack: CombatRenderer.genClothingLayer("head", {
			srcfn(options) {
				const clothes = options.clothes.head;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/head/${clothes.name}/back.png`;
				console.log("Headwear [back]", "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.head;
				if (!CombatRenderer.isClothingShown(options, clothes)) return false;
				return !!clothes.hasBackImg;
			},
			z: CombatRenderer.indices.base - 1 /* At least behind head (50) */,
		}),
		headwear: CombatRenderer.genClothingLayer("head", {
			z: 81 + 1 /* hair Z plus one */,
		}),
		headwearAcc: CombatRenderer.genClothingAccLayer("head", {
			z: 81 + 1 /* hair Z plus one */,
		}),
		legwearBack: CombatRenderer.genClothingLayer("legs", {
			srcfn(options) {
				const clothes = options.clothes.legs;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/legs/${clothes.name}/back-${clothes.positions.back}-${clothes.state}.png`;
				console.log("legs", "Path:", path);
				return path;
			},
			z: CombatRenderer.indices.backThigh + 1,
		}),
		legwearAccBack: CombatRenderer.genClothingAccLayer("legs", {
			srcfn(options) {
				const clothes = options.clothes.legs;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/legs/${clothes.name}/back-${clothes.positions.back}-${clothes.state}-acc.png`;
				console.log("legs", "Path:", path);
				return path;
			},
			z: CombatRenderer.indices.backThigh + 2,
		}),
		legwearFront: CombatRenderer.genClothingLayer("legs", {
			srcfn(options) {
				const clothes = options.clothes.legs;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/legs/${clothes.name}/front-${clothes.positions.front}-${clothes.state}.png`;
				console.log("legs", "Path:", path);
				return path;
			},
			z: CombatRenderer.indices.frontThigh + 1,
		}),
		legwearAccFront: CombatRenderer.genClothingAccLayer("legs", {
			srcfn(options) {
				const clothes = options.clothes.legs;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/legs/${clothes.name}/front-${clothes.positions.front}-${clothes.state}-acc.png`;
				console.log("legs", "Path:", path);
				return path;
			},
			z: CombatRenderer.indices.frontThigh + 2,
		}),
		backLower: CombatRenderer.genClothingLayer("lower", {
			srcfn(options) {
				const clothes = options.clothes.lower;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/lower/${clothes.name}/back-${clothes.positions.back}-${clothes.state}.png`;
				console.log("Lower back path:", path);
				return path;
			},
			z: CombatRenderer.indices.backThigh + 3,
		}),
		backLowerAcc: CombatRenderer.genClothingAccLayer("lower", {
			srcfn(options) {
				const clothes = options.clothes.lower;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/lower/${clothes.name}/back-${clothes.positions.back}-${clothes.state}-acc.png`;
				console.log("Lower back acc path:", path);
				return path;
			},
			z: CombatRenderer.indices.backThigh + 3,
		}),
		frontLower: CombatRenderer.genClothingLayer("lower", {
			srcfn(options) {
				const clothes = options.clothes.lower;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/lower/${clothes.name}/front-${clothes.positions.front}-${clothes.state}.png`;
				console.log("Lower front path:", path);
				return path;
			},
			z: CombatRenderer.indices.frontThigh + 3,
		}),
		frontLowerAcc: CombatRenderer.genClothingAccLayer("lower", {
			srcfn(options) {
				const clothes = options.clothes.lower;
				if (clothes?.name == null || clothes.positions == null) return "";
				const path = `${options.src}clothing/lower/${clothes.name}/front-${clothes.positions.front}-${clothes.state}-acc.png`;
				console.log("Lower front acc path:", path);
				return path;
			},
			z: CombatRenderer.indices.frontThigh + 3,
		}),
		neckWear: CombatRenderer.genClothingLayer("neck", {
			z: CombatRenderer.indices.frontArm - 1,
		}),
		neckWearAcc: CombatRenderer.genClothingAccLayer("neck", {
			z: CombatRenderer.indices.frontArm - 1,
		}),
		overHead: CombatRenderer.genClothingLayer("over_head", {
			z: CombatRenderer.indices.base + 10,
		}),
		overHeadAcc: CombatRenderer.genClothingAccLayer("over_head", {
			z: CombatRenderer.indices.base + 10,
		}),
		overLower: CombatRenderer.genClothingLayer("over_lower", {
			z: CombatRenderer.indices.frontThigh + 4,
		}),
		overLowerAcc: CombatRenderer.genClothingAccLayer("over_lower", {
			z: CombatRenderer.indices.frontThigh + 4,
		}),
		overUpper: CombatRenderer.genClothingLayer("over_upper", {
			z: CombatRenderer.indices.frontArm - 1,
		}),
		overUpperAcc: CombatRenderer.genClothingAccLayer("over_upper", {
			z: CombatRenderer.indices.frontArm - 1,
		}),
		underLower: CombatRenderer.genClothingLayer("under_lower", {
			srcfn(options) {
				const clothes = options.clothes.under_lower;
				if (clothes?.name == null) return "";
				const state = options.position === "missionary" ? `${clothes.state}-${options.legFrontPosition}` : clothes.state;
				const path = `${options.src}clothing/under_lower/${clothes.name}/${state}.png`;
				console.log("Under lower path:", path);
				return path;
			},
			z: CombatRenderer.indices.frontThigh + 2,
		}),
		underLowerAcc: CombatRenderer.genClothingAccLayer("under_lower", {
			srcfn(options) {
				const clothes = options.clothes.under_lower;
				if (clothes?.name == null) return "";
				const state = options.position === "missionary" ? `${clothes.state}-${options.legFrontPosition}` : clothes.state;
				const path = `${options.src}clothing/under_lower/${clothes.name}/${state}-acc.png`;
				console.log("Under lower path:", path);
				return path;
			},
			z: CombatRenderer.indices.frontThigh + 2,
		}),
		underUpper: CombatRenderer.genClothingLayer("under_upper", {
			z: CombatRenderer.indices.frontArm - 4,
		}),
		underUpperAcc: CombatRenderer.genClothingAccLayer("under_upper", {
			z: CombatRenderer.indices.frontArm - 4,
		}),
		underUpperBreasts: CombatRenderer.genClothingLayer("under_upper", {
			srcfn(options) {
				const clothes = options.clothes.under_upper;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/under_upper/${clothes.name}/breasts/${clothes.breasts.size}.png`;
				console.log("upper", "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.under_upper;
				const show = CombatRenderer.isClothingShown(options, clothes) && clothes.breasts.show;
				console.log("Show under upper breasts:", show);
				return !!show;
			},
			z: CombatRenderer.indices.frontArm - 4,
		}),
		upper: CombatRenderer.genClothingLayer("upper", {
			z: CombatRenderer.indices.frontArm - 3,
		}),
		upperAcc: CombatRenderer.genClothingAccLayer("upper", {
			z: CombatRenderer.indices.frontArm - 3,
		}),
		upperBreasts: CombatRenderer.genClothingLayer("upper", {
			srcfn(options) {
				const clothes = options.clothes.upper;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/upper/${clothes.name}/breasts/${clothes.breasts.size}.png`;
				console.log("upper", "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.upper;
				const show = CombatRenderer.isClothingShown(options, clothes) && clothes.breasts.show;
				console.log("Show upper breasts:", show);
				return !!show;
			},
			z: CombatRenderer.indices.frontArm - 3,
		}),
		upperBackSleeves: CombatRenderer.genClothingLayer("upper", {
			srcfn(options) {
				const clothes = options.clothes.upper;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/upper/${clothes.name}/sleeves/back-${options.armBackPosition}.png`;
				console.log("upper", "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.upper;
				const show = CombatRenderer.isClothingShown(options, clothes) && clothes.sleeves.show;
				// If missionary: Sleeves on the side behind are never shown, except for handjobs.
				if (options.position === "doggy" && options.armBackPosition === "bound") return false;
				if (options.position === "missionary" && !["handjob"].includes(clothes.sleeves.state)) return false;
				console.log("Show upper breasts:", show);
				return !!show;
			},
			z: CombatRenderer.indices.backArm + 1,
		}),
		upperFrontSleeves: CombatRenderer.genClothingLayer("upper", {
			srcfn(options) {
				const clothes = options.clothes.upper;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/upper/${clothes.name}/sleeves/front-${options.armFrontPosition}.png`;
				console.log("upper", "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.upper;
				const show = CombatRenderer.isClothingShown(options, clothes) && clothes.sleeves.show;
				console.log("Show upper breasts:", show);
				return !!show;
			},
			z: CombatRenderer.indices.frontArm + 1,
		}),
	},
};
Renderer.CanvasModels.combatMainPc = combatMainPc;
