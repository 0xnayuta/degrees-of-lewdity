/**
 * @typedef {object} CanvasModelLayerClose
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
 * @property {function(CloseOptions): boolean} [showfn] (options)=>boolean Function generating `show` property. Should return boolean, do not use undefined/null/0/"" to hide layer, use of !! (double not) operator recommended.
 * @property {function(CloseOptions): string} [srcfn] (options)=>string.
 * @property {function(CloseOptions): number} [zfn] (options)=>number.
 * @property {function(CloseOptions): number} [alphafn] (options)=>number.
 * @property {function(CloseOptions): boolean} [desaturatefn] (options)=>boolean.
 * @property {function(CloseOptions): number} [brightnessfn] (options)=>number.
 * @property {function(CloseOptions): number} [contrastftn] (options)=>number.
 * @property {function(CloseOptions): (string|object)} [blendModefn] (options)=>(string|object).
 * @property {function(CloseOptions): string} [blendfn] (options)=>string.
 * @property {function(CloseOptions): string} [masksrcfn] (options)=>string.
 * @property {function(CloseOptions): string} [animationfn] (options)=>string.
 * @property {function(CloseOptions): number[]} [framesfn] (options)=>number[].
 * @property {function(CloseOptions): string[]} [filtersfn] (options)=>string[].
 * @property {function(CloseOptions): number} [dxfn] (options)=>number.
 * @property {function(CloseOptions): number} [dyfn] (options)=>number.
 * @property {function(CloseOptions): number} [widthfn] (options)=>number.
 * @property {function(CloseOptions): number} [heightfn] (options)=>number.
 */

/**
 * @type {CanvasModelOptions}
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
	preprocess(options) {
		console.log(this.name, "closeArse preprocess");
		if (options.anus.npc) {
			if (!["horse", "beast-oral", "machine"].includes(options.anus.npc) && (options.anus === "penetrated" || V.anususe === "othervagina")) {
				options.anusSilhouette = V.anusstate === "doublepenetrated" ? "dp" : "solo";
			} else options.anusSilhouetet = "null";
		}
	},
	/** @type {Object<string, CanvasModelLayerClose>} */
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
		npcPenetrator: {
			srcfn(options) {
				return `${options.src}arse/npc/${options.anus.npc}-${options.anus.state}.png`;
			},
			showfn(options) {
				return !!options.showArse && !!options.anus.npc;
			},
			animationfn(options) {
				return options.animKeyArse;
			},
			filters: ["npcBody"],
			z: ZIndices.closeNpc,
		},
		npcPenetrator2: {
			srcfn(options) {
				return `${options.src}arse/npc/${options.anus.npc2}-${options.anus.state}.png`;
			},
			showfn(options) {
				return !!options.showArse && !!options.anus.npc2;
			},
			animationfn(options) {
				return options.animKeyArse;
			},
			filters: ["npcBody2"],
			z: ZIndices.closeNpc,
		},
		npcCondom: {
			srcfn(options) {
				return `${options.src}arse/npc/${options.anus.npc}-condom-${options.anus.state}.png`;
			},
			showfn(options) {
				return !!options.showArse && !!options.anus.npc && !!V.NPCList[V.anustarget].condom.worn;
			},
			animationfn(options) {
				return options.animKeyArse;
			},
			alpha: 0.4,
			filters: ["npcAnusCondom"],
			z: ZIndices.closeNpc + 1,
		},
		npcCondom2: {
			srcfn(options) {
				return `${options.src}arse/npc/${options.anus.npc2}-condom-${options.anus.state}.png`;
			},
			showfn(options) {
				return !!options.showArse && !!options.anus.npc && !!V.NPCList[V.anusdoubletarget].condom.worn;
			},
			animationfn(options) {
				return options.animKeyArse;
			},
			alpha: 0.4,
			filters: ["npcAnusCondom2"],
			z: ZIndices.closeNpc + 1,
		},
		npcSilhouette: {
			srcfn(options) {
				if (!["horse", "beast-oral", "machine"].includes(options.anus.npc) && options.anus === "penetrated") {
					options.anusSilhouette = V.anusstate === "doublepenetrated" ? "dp" : "solo";
				}
				return `${options.src}arse/npc/shadow-${V.anusstate === "doublepenetrated" ? "dp" : "solo"}.png`;
			},
			showfn(options) {
				return !!options.showArse && options.anus === "penetrated";
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
	},
};
Renderer.CanvasModels.combatCloseArse = combatCloseArse;
