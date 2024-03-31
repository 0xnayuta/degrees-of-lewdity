/* eslint-disable jsdoc/no-undefined-types */
/**
 * @typedef CombatZIndices
 * @type {object}
 * Combat layers
 * @property {0} far
 * @property {50} base
 * @property {100} near
 * Hair:
 * @property {35} backHair
 * @property {55} hair
 * Back legs:
 * @property {40} backCalf
 * @property {41} backFoot
 * @property {42} backThigh
 * @property {43} backCalfUnderwear
 * @property {44} backThighUnderwear
 * @property {45} backFootwear
 * @property {46} backCalfWear
 * @property {47} backThighWear
 * @property {48} backCalfOverwear
 * @property {49} backThighOverwear
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
 * @type {CanvasModelOptions}
 */
const combatMainPc = {
	name: "combatMainPc",
	width: 256,
	height: 256,
	frames: 4,
	/*
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
		 *	██████   █████  ███████ ███████
		 *	██   ██ ██   ██ ██      ██
		 *	██████  ███████ ███████ █████
		 *	██   ██ ██   ██      ██ ██
		 *	██████  ██   ██ ███████ ███████
		 */
		backarm: {
			srcfn(options) {
				return `${options.src}body/arms/back.png`;
			},
			showfn(options) {
				const result = options.showPlayer && options.position === "doggy";
				return !!result;
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
				if (options.position === "doggy") {
					return options.src + "";
				}
				return `${options.src}body/thighs/front-${options.legFrontPosition}.png`;
			},
			showfn(options) {
				const result = options.showPlayer && options.position !== "doggy";
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
			z: zi.base + 11,
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
				const penetrator = options.penetrator;
				return `${options.src}body/penetrator/${penetrator.position}-${penetrator.state}.png`;
			},
			showfn(options) {
				const penetrator = options.penetrator;
				const result = options.showPlayer && penetrator.show;
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
				return `${options.src}body/penetrator/${penetrator.position}-${penetrator.state}-${penetrator.ejaculate.type}.png`;
			},
			showfn(options) {
				const penetrator = options.penetrator;
				console.log("ejac penetrator", JSON.parse(JSON.stringify(penetrator)));
				const result = options.showPlayer && penetrator.show && penetrator.isEjaculating;
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
				return options.animKeyStill;
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
				return options.animKeyStill;
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
			z: zi.hair,
		},
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
				if (clothes == null || clothes.name == null) return "";
				const path = `${options.src}clothing/feet/${clothes.name}/back-${clothes.state}.png`;
				console.log("Path:", path);
				return path;
			},
			z: zi.backFootwear,
		}),
		footwearFront: genClothingLayer("feet", {
			srcfn(options) {
				const clothes = options.clothes.feet;
				if (clothes == null || clothes.name == null) return "";
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
				if (clothes == null || clothes.name == null) return "";
				if (options.position === "missionary" && clothes.state !== "handjob") return "";
				const path = `${options.src}clothing/hands/${clothes.name}/back-${clothes.state}.png`;
				return path;
			},
			z: zi.base - 2,
		}),
		handsFront: genClothingLayer("hands", {
			srcfn(options) {
				const clothes = options.clothes.hands;
				if (clothes == null || clothes.name == null) return "";
				const path = `${options.src}clothing/hands/${clothes.name}/front-${clothes.state}.png`;
				return path;
			},
			z: zi.base + 14,
		}),
		headwear: genClothingLayer("head", {
			z: zi.base + 10,
		}),
		legwearBack: genClothingLayer("legs", {
			srcfn(options) {
				const clothes = options.clothes.legs;
				if (clothes == null || clothes.name == null) return "";
				const path = `${options.src}clothing/legs/${clothes.name}/back-${options.legFrontPosition}-${clothes.state}.png`;
				console.log("legs", "Path:", path);
				return path;
			},
			z: zi.backThigh + 1,
		}),
		legwearAccBack: genClothingLayer("legs", {
			srcfn(options) {
				const clothes = options.clothes.legs;
				if (clothes == null || clothes.name == null) return "";
				const path = `${options.src}clothing/legs/${clothes.name}/back-${options.legFrontPosition}-${clothes.state}-acc.png`;
				console.log("legs", "Path:", path);
				return path;
			},
			z: zi.backThigh + 2,
		}),
		legwearFront: genClothingLayer("legs", {
			srcfn(options) {
				const clothes = options.clothes.legs;
				if (clothes == null || clothes.name == null) return "";
				const path = `${options.src}clothing/legs/${clothes.name}/front-${options.legFrontPosition}-${clothes.state}.png`;
				console.log("legs", "Path:", path);
				return path;
			},
			z: zi.frontThigh + 1,
		}),
		legwearAccFront: genClothingLayer("legs", {
			srcfn(options) {
				const clothes = options.clothes.legs;
				if (clothes == null || clothes.name == null) return "";
				const path = `${options.src}clothing/legs/${clothes.name}/front-${options.legFrontPosition}-${clothes.state}-acc.png`;
				console.log("legs", "Path:", path);
				return path;
			},
			z: zi.frontThigh + 2,
		}),
		lower: genClothingLayer("lower", {
			dxfn(options) {
				if (options.legFrontPosition === "footjob") {
					return -10;
				}
				return 0;
			},
			dyfn(options) {
				if (options.legFrontPosition === "footjob") {
					return 4;
				}
				return 0;
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
		upperAcc: genClothingLayer("upper", {
			srcfn(options) {
				const clothes = options.clothes.upper;
				if (clothes == null || clothes.name == null) return "";
				const path = `${options.src}clothing/upper/${clothes.name}/acc.png`;
				console.log("Path:", path);
				return path;
			},
			filtersfn(options) {
				return ["worn_upper_acc"];
			},
			z: zi.base + 12,
		}),
		upperBreasts: genClothingLayer("upper", {
			srcfn(options) {
				const clothes = options.clothes.upper;
				if (clothes == null || clothes.name == null) return "";
				const path = `${options.src}clothing/upper/${clothes.name}/breasts/${clothes.breasts}.png`;
				console.log("upper", "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.upper;
				const show = options.showClothing && clothes != null && clothes.name != null && clothes.hasBreasts;
				console.log("Show upper breasts:", show);
				return !!show;
			},
			z: zi.base + 13,
		}),
		upperBackSleeves: genClothingLayer("upper", {
			srcfn(options) {
				const clothes = options.clothes.upper;
				if (clothes == null || clothes.name == null) return "";
				const path = `${options.src}clothing/upper/${clothes.name}/sleeves/back-${clothes.sleeves}.png`;
				console.log("upper", "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.upper;
				const show = options.showClothing && clothes != null && clothes.name != null && clothes.hasSleeves;
				// If missionary: Sleeves on the side behind are never shown, except for handjobs.
				if (options.position === "missionary" && !["handjob"].includes(clothes.sleeves)) return false;
				console.log("Show upper breasts:", show);
				return !!show;
			},
			z: zi.base - 1,
		}),
		upperFrontSleeves: genClothingLayer("upper", {
			srcfn(options) {
				const clothes = options.clothes.upper;
				if (clothes == null || clothes.name == null) return "";
				const path = `${options.src}clothing/upper/${clothes.name}/sleeves/front-${clothes.sleeves}.png`;
				console.log("upper", "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes.upper;
				const show = options.showClothing && clothes != null && clothes.name != null && clothes.hasSleeves;
				console.log("Show upper breasts:", show);
				return !!show;
			},
			z: zi.base + 14,
		}),
	},
};
Renderer.CanvasModels.combatMainPc = combatMainPc;

/**
 *
 * @param {string} slot
 * @param {CanvasModelLayer} overrideOptions
 * @returns {CanvasModelLayer}
 */
function genClothingLayer(slot, overrideOptions = {}) {
	/**
	 * @type {CanvasModelLayer}
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
			const show = options.showClothing && clothes != null;
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
