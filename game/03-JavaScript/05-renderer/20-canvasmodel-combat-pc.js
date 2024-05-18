// @ts-check
/* global ClothingState, BodywritingOption */

/**
 * @typedef CombatZIndices
 * @type {object}
 * Combat layers
 * @property {0} far
 * @property {50} base
 * @property {100} near
 * Hair:
 * @property {20} backHair
 * @property {55} hair
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
 * Front Legs:
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
 */

/**
 * @type {CombatZIndices}
 */
const zi = {
	far: 0,

	backHair: 20,

	backCalf: 26,
	backFoot: 27,
	backThigh: 28,
	backCalfUnderwear: 29,
	backThighUnderwear: 30,
	backFootwear: 31,
	backCalfWear: 32,
	backThighWear: 33,
	backCalfOverwear: 34,
	backThighOverwear: 35,

	base: 50,

	hair: 55,

	frontCalf: 65,
	frontFoot: 66,
	frontThigh: 67,
	frontCalfUnderwear: 68,
	frontThighUnderwear: 69,
	frontFootwear: 70,
	frontCalfWear: 71,
	frontThighWear: 72,
	frontCalfOverwear: 73,
	frontThighOverwear: 74,

	near: 100,
};

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
		return {
			root: "img/newsex/",
			position: "missionary",
			showPlayer: true,
			showFace: true,
			showClothing: true,
			showNPCs: true,
			inOral: false,
			animSpeed: 1,
			hairType: "default",
			filters: {
				worn: {},
			},
			clothes: {},
		};
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
			z: zi.base,
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
					return zi.base + 10;
				}
				return zi.base + 12;
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
					return zi.base + 9;
				}
				return zi.base + 11;
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
			z: zi.base + 7,
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
			z: zi.base + 4,
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
				if (options.armBackPosition === "bound2") return false;
				return true;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: zi.base - 3,
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
			z: zi.backThigh,
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
			z: zi.backCalf,
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
			z: zi.base,
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
			z: zi.frontThigh,
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
			z: zi.frontCalf,
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
			z: zi.base + 14,
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
			z: zi.base + 10,
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
			z: zi.base + 5,
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
			z: zi.base + 6,
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
			z: zi.base,
		},
		lefteye: {
			srcfn(options) {
				return `${options.src}body/head/eyes.png`;
			},
			showfn(options) {
				return !!options.showPlayer;
			},
			animationfn(options) {
				return options.animKey;
			},
			filters: ["leftEye"],
			z: zi.base + 1,
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
			z: zi.base + 2,
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
			z: zi.base + 3,
		},
		blush: {
			srcfn(options) {
				return `${options.src}body/head/blush/${options.blush}.png`;
			},
			showfn(options) {
				const result = options.showFace && options.blush > 0;
				return !!result;
			},
			filters: ["body"],
			z: zi.base + 1,
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
			z: zi.base + 2,
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
			z: zi.base + 1,
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
			z: 81 /* zi.hair */,
		},
		/*
		 *    ██████   ██████  ██████  ██    ██ ██     ██ ██████  ██ ████████ ██ ███    ██  ██████
		 *    ██   ██ ██    ██ ██   ██  ██  ██  ██     ██ ██   ██ ██    ██    ██ ████   ██ ██
		 *    ██████  ██    ██ ██   ██   ████   ██  █  ██ ██████  ██    ██    ██ ██ ██  ██ ██   ███
		 *    ██   ██ ██    ██ ██   ██    ██    ██ ███ ██ ██   ██ ██    ██    ██ ██  ██ ██ ██    ██
		 *    ██████   ██████  ██████     ██     ███ ███  ██   ██ ██    ██    ██ ██   ████  ██████
		 */
		bodywritingForehead: genBodywritingLayer("forehead", {
			z: zi.base + 1,
		}),
		bodywritingBackCheek: genBodywritingLayer("backCheek", {
			z: zi.base - 1,
		}),
		bodywritingFrontCheek: genBodywritingLayer("frontCheek", {
			z: zi.base + 1,
		}),
		bodywritingBackShoulder: genBodywritingLayer("backShoulder", {
			z: zi.base - 1,
		}),
		bodywritingFrontShoulder: genBodywritingLayer("frontShoulder", {
			z: zi.base + 1,
		}),
		bodywritingBreasts: genBodywritingLayer("breasts", {
			z: zi.base + 11,
		}),
		bodywritingBack: genBodywritingLayer("back", {
			z: zi.base + 1,
		}),
		bodywritingBackBottom: genBodywritingLayer("backBottom", {
			z: zi.base - 1,
		}),
		bodywritingFrontBottom: genBodywritingLayer("frontBottom", {
			z: zi.base + 1,
		}),
		bodywritingPubic: genBodywritingLayer("pubic", {
			z: zi.base + 1,
		}),
		bodywritingBackThigh: genBodywritingLayer("backThigh", {
			z: zi.backThigh + 1,
		}),
		bodywritingFrontThigh: genBodywritingLayer("frontThigh", {
			z: zi.frontThigh + 1,
		}),
		/*
		 *	 ██████ ██       ██████  ████████ ██   ██ ██ ███    ██  ██████
		 *	██      ██      ██    ██    ██    ██   ██ ██ ████   ██ ██
		 *	██      ██      ██    ██    ██    ███████ ██ ██ ██  ██ ██   ███
		 *	██      ██      ██    ██    ██    ██   ██ ██ ██  ██ ██ ██    ██
		 *	 ██████ ███████  ██████     ██    ██   ██ ██ ██   ████  ██████
		 */
		facewear: genClothingLayer("face", {
			z: zi.base + 4,
		}),
		footwearBack: genClothingLayer("feet", {
			srcfn(options) {
				const clothes = options.clothes.feet;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/feet/${clothes.name}/back-${clothes.state}.png`;
				console.log("Path:", path);
				return path;
			},
			z: zi.backFootwear,
		}),
		footwearFront: genClothingLayer("feet", {
			srcfn(options) {
				const clothes = options.clothes.feet;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/feet/${clothes.name}/front-${clothes.state}.png`;
				console.log("Path:", path);
				return path;
			},
			z: zi.frontFootwear,
		}),
		genitals: genClothingLayer("genitals", {
			z: zi.base + 6,
		}),
		handsBack: genClothingLayer("hands", {
			srcfn(options) {
				const clothes = options.clothes.hands;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/hands/${clothes.name}/back-${options.armBackPosition}.png`;
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.hands;
				if (!isClothingShown(options, clothes)) return false;
				if (options.position === "doggy" && options.armBackPosition === "bound2") return false;
				if (options.position === "missionary" && options.armBackPosition !== "handjob") return false;
				return true;
			},
			z: zi.base - 2,
		}),
		handsFront: genClothingLayer("hands", {
			srcfn(options) {
				const clothes = options.clothes.hands;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/hands/${clothes.name}/front-${options.armFrontPosition}.png`;
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.hands;
				if (!isClothingShown(options, clothes)) return false;
				if (options.armFrontPosition === "bound2") return false;
				return true;
			},
			z: zi.base + 14,
		}),
		headwearBack: genClothingLayer("head", {
			srcfn(options) {
				const clothes = options.clothes.head;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/head/${clothes.name}/back.png`;
				console.log("Headwear [back]", "Path:", path);
				return path;
			},
			z: zi.base - 1 /* At least behind head (50) */,
		}),
		headwear: genClothingLayer("head", {
			z: 81 + 1 /* hair Z plus one */,
		}),
		legwearBack: genClothingLayer("legs", {
			srcfn(options) {
				const clothes = options.clothes.legs;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/legs/${clothes.name}/back-${options.legBackPosition}-${clothes.state}.png`;
				console.log("legs", "Path:", path);
				return path;
			},
			z: zi.backThigh + 1,
		}),
		legwearAccBack: genClothingAccLayer("legs", {
			srcfn(options) {
				const clothes = options.clothes.legs;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/legs/${clothes.name}/back-${options.legBackPosition}-${clothes.state}-acc.png`;
				console.log("legs", "Path:", path);
				return path;
			},
			z: zi.backThigh + 2,
		}),
		legwearFront: genClothingLayer("legs", {
			srcfn(options) {
				const clothes = options.clothes.legs;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/legs/${clothes.name}/front-${options.legFrontPosition}-${clothes.state}.png`;
				console.log("legs", "Path:", path);
				return path;
			},
			z: zi.frontThigh + 1,
		}),
		legwearAccFront: genClothingAccLayer("legs", {
			srcfn(options) {
				const clothes = options.clothes.legs;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/legs/${clothes.name}/front-${options.legFrontPosition}-${clothes.state}-acc.png`;
				console.log("legs", "Path:", path);
				return path;
			},
			z: zi.frontThigh + 2,
		}),
		lower: genClothingLayer("lower", {
			srcfn(options) {
				const clothes = options.clothes.lower;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/lower/${clothes.name}/${clothes.position}-${clothes.state}.png`;
				console.log("Lower", "Path:", path);
				return path;
			},
			z: zi.frontThigh + 3,
		}),
		neckWear: genClothingLayer("neck", {
			z: zi.base + 10,
		}),
		overHead: genClothingLayer("over_head", {
			z: zi.base + 10,
		}),
		overLower: genClothingLayer("over_lower", {
			z: zi.frontThigh + 3,
		}),
		overUpper: genClothingLayer("over_upper", {
			z: zi.base + 10,
		}),
		underLower: genClothingLayer("under_lower", {
			z: zi.frontThigh + 2,
		}),
		underUpper: genClothingLayer("under_upper", {
			z: zi.base + 10,
		}),
		upper: genClothingLayer("upper", {
			z: zi.base + 11,
		}),
		upperAcc: genClothingAccLayer("upper", {
			z: zi.base + 12,
		}),
		upperBreasts: genClothingLayer("upper", {
			srcfn(options) {
				const clothes = options.clothes.upper;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/upper/${clothes.name}/breasts/${clothes.breasts}.png`;
				console.log("upper", "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.upper;
				const show = isClothingShown(options, clothes) && clothes.hasBreasts;
				console.log("Show upper breasts:", show);
				return !!show;
			},
			z: zi.base + 13,
		}),
		upperBackSleeves: genClothingLayer("upper", {
			srcfn(options) {
				const clothes = options.clothes.upper;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/upper/${clothes.name}/sleeves/back-${options.armBackPosition}.png`;
				console.log("upper", "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.upper;
				const show = isClothingShown(options, clothes) && clothes.hasSleeves;
				// If missionary: Sleeves on the side behind are never shown, except for handjobs.
				if (options.position === "doggy" && options.armBackPosition === "bound2") return false;
				if (options.position === "missionary" && !["handjob"].includes(clothes.sleeves)) return false;
				console.log("Show upper breasts:", show);
				return !!show;
			},
			z: zi.base - 1,
		}),
		upperFrontSleeves: genClothingLayer("upper", {
			srcfn(options) {
				const clothes = options.clothes.upper;
				if (clothes?.name == null) return "";
				const path = `${options.src}clothing/upper/${clothes.name}/sleeves/front-${options.armFrontPosition}.png`;
				console.log("upper", "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.upper;
				const show = isClothingShown(options, clothes) && clothes.hasSleeves;
				console.log("Show upper breasts:", show);
				return !!show;
			},
			z: zi.base + 14,
		}),
	},
};
Renderer.CanvasModels.combatMainPc = combatMainPc;

/**
 * @param {string} id
 * @param {CanvasModelLayerPc} overrideOptions
 * @returns {CanvasModelLayerPc}
 */
function genBodywritingLayer(id, overrideOptions = {}) {
	/**
	 * @type {CanvasModelLayerPc}
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
		z: zi.base,
	};
	return Object.assign(defaults, overrideOptions);
}

/**
 * @param {Options} options
 * @param {ClothingState} clothing
 */
function isClothingShown(options, clothing) {
	// Global clothing visibility
	if (!options.showClothing) return false;
	// Name is the identifier for clothing sprites, if null, problem occurred.
	if (clothing?.name == null) return false;
	// Per clothing show flag.
	return clothing.show;
}

/**
 * @param {string} slot
 * @param {CanvasModelLayerPc} overrideOptions
 * @returns {CanvasModelLayerPc}
 */
function genClothingLayer(slot, overrideOptions = {}) {
	/**
	 * @type {CanvasModelLayerPc}
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
			const show = isClothingShown(options, clothes);
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
		z: zi[slot],
	};
	return Object.assign(defaults, overrideOptions);
}

/**
 *
 * @param {string} slot
 * @param {CanvasModelLayerPc} overrideOptions
 * @returns {CanvasModelLayerPc}
 */
function genClothingAccLayer(slot, overrideOptions = {}) {
	/**
	 * @type {CanvasModelLayerPc}
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
		z: zi[slot],
	};
	return Object.assign(defaults, overrideOptions);
}
