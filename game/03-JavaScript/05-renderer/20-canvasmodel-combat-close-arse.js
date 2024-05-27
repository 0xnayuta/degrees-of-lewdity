// @ts-check
/**
 * @typedef {object} CanvasModelLayerCloseArse
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
 * @property {function(object): boolean} [showfn] (options)=>boolean Function generating `show` property. Should return boolean, do not use undefined/null/0/"" to hide layer, use of !! (double not) operator recommended.
 * @property {function(object): string} [srcfn] (options)=>string.
 * @property {function(object): number} [zfn] (options)=>number.
 * @property {function(object): number} [alphafn] (options)=>number.
 * @property {function(object): boolean} [desaturatefn] (options)=>boolean.
 * @property {function(object): number} [brightnessfn] (options)=>number.
 * @property {function(object): number} [contrastftn] (options)=>number.
 * @property {function(object): (string|object)} [blendModefn] (options)=>(string|object).
 * @property {function(object): string} [blendfn] (options)=>string.
 * @property {function(object): string} [masksrcfn] (options)=>string.
 * @property {function(object): string} [animationfn] (options)=>string.
 * @property {function(object): number[]} [framesfn] (options)=>number[].
 * @property {function(object): string[]} [filtersfn] (options)=>string[].
 * @property {function(object): number} [dxfn] (options)=>number.
 * @property {function(object): number} [dyfn] (options)=>number.
 * @property {function(object): number} [widthfn] (options)=>number.
 * @property {function(object): number} [heightfn] (options)=>number.
 */
/**
 * @typedef {object} CanvasModelCloseArseOptions
 * @property {string} name Model name, for debugging.
 * @property {number} width Frame width.
 * @property {number} height Frame height.
 * @property {number} frames Number of frames for CSS animation.
 * @property {Object<string, CanvasModelLayerCloseArse>} layers Layers (by name).
 * @property {Function} [generatedOptions] Function ()=>string[] names of generated options.
 * @property {Function} [defaultOptions] Function ()=>object returning default options.
 * @property {Function} [preprocess] Preprocessing function (options)=>void to generate temp options.
 */

/**
 * @type {CanvasModelCloseArseOptions}
 */
const combatCloseArse = {
	name: "combatCloseArse",
	width: 256,
	height: 256,
	frames: 4,
	generatedOptions() {
		console.log(this.name, "closeArse generatedOptions");
		return [];
	},
	defaultOptions() {
		console.log(this.name, "closeArse defaultOptions");
		return {
			root: "img/newsex/close/",
			position: "missionary",
			showArse: false,
			filters: {
				worn: {},
			},
		};
	},
	preprocess() {
		console.log(this.name, "closeArse preprocess");
	},
	/** @type {Object<string, CanvasModelLayerCloseArse>} */
	layers: {
		arse: {
			srcfn(options) {
				return `${options.src}arse/${options.anus.state}-base.png`;
			},
			showfn(options) {
				return !!options.showArse;
			},
			animationfn(options) {
				return options.animKeyArse;
			},
			filters: ["body"],
			z: ZIndices.closeBase,
		},
		npcSilhouette: {
			srcfn(options) {
				return `${options.src}arse/npc/shadow-${options.anus.silhouette}.png`;
			},
			showfn(options) {
				return !!options.showArse && !!options.anus.silhouette;
			},
			animationfn(options) {
				return options.animKeyArse;
			},
			z: ZIndices.closeNpc + 3,
		},
		panties: {
			srcfn(options) {
				return `${options.src}arse/${options.anus.state}-panties.png`;
			},
			showfn(options) {
				return !!options.showArse && V.worn.under_lower.state === "totheside";
			},
			animationfn(options) {
				return options.animKeyArse;
			},
			filters: ["worn_under_lower_main"],
			z: ZIndices.closeWorn,
		},
		npcPenetrator: arsePenetrator("npc", "strapon"),
		npcPenetrator2: arsePenetrator("npc2", "dpStrapon"),
		npcCondom: arsePenetratorCondom("npc"),
		npcCondom2: arsePenetratorCondom("npc2"),
	},
};

/**
 *
 * @param {string} npc
 * @param {string} strapon
 * @param {CanvasModelLayerCloseArse} overrideOptions
 * @returns {CanvasModelLayerCloseArse}
 */
function arsePenetrator(npc, strapon, overrideOptions = {}) {
	/**
	 * @type {CanvasModelLayerCloseArse}
	 */
	const defaults = {
		srcfn(options) {
			return `${options.src}arse/npc/${options.anus[npc]}-${options.anus.state}.png`;
		},
		showfn(options) {
			return !!options.showArse && !!options.anus[npc];
		},
		animationfn(options) {
			return options.animKeyArse;
		},
		filtersfn(options) {
			const filter = npc === "npc2" ? ["anusNpc2"] : ["anusNpc"];
			return options.anus[npc] === "tentacle" ? ["anusTentacle"] : filter;
		},
		desaturatefn(options) {
			return !!options.anus[strapon];
		},
		brightnessfn(options) {
			return options.anus[strapon] ? -0.25 : 0;
		},
		alphafn(options) {
			const isWraith = options.anus[npc] === "tentacle" && ["tentacles-wraith", "tentacles-wraith-penetrated"].includes(V.tentacleColour);
			return isWraith ? (V.tentacleColour === "tentacles-wraith" ? 0.4 : 0.8) : 1;
		},
		z: ZIndices.closeNpc,
	};
	return Object.assign(defaults, overrideOptions);
}

/**
 *
 * @param {string} npc
 * @param {CanvasModelLayerCloseArse} overrideOptions
 * @returns {CanvasModelLayerCloseArse}
 */
function arsePenetratorCondom(npc, overrideOptions = {}) {
	/**
	 * @type {CanvasModelLayerCloseArse}
	 */
	const defaults = {
		srcfn(options) {
			return `${options.src}arse/npc/${options.anus[npc]}-condom-${options.anus.state}.png`;
		},
		showfn(options) {
			const target = npc === "npc2" ? V.anusdoubletarget : V.anustarget;
			return !!options.showArse && !!options.anus[npc] && !!V.NPCList[target].condom.worn;
		},
		animationfn(options) {
			return options.animKeyArse;
		},
		alpha: 0.4,
		filters: npc === "npc2" ? ["anusCondom2"] : ["anusCondom"],
		z: ZIndices.closeNpc + 1,
	};
	return Object.assign(defaults, overrideOptions);
}
Renderer.CanvasModels.combatCloseArse = combatCloseArse;
