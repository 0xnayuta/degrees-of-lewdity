// @ts-check
/**
 * @typedef {object} CanvasModelLayerClosePenis
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
 * @typedef {object} CanvasModelClosePenisOptions
 * @property {string} name Model name, for debugging.
 * @property {number} width Frame width.
 * @property {number} height Frame height.
 * @property {number} frames Number of frames for CSS animation.
 * @property {Object<string, CanvasModelLayerClosePenis>} layers Layers (by name).
 * @property {Function} [generatedOptions] Function ()=>string[] names of generated options.
 * @property {Function} [defaultOptions] Function ()=>object returning default options.
 * @property {Function} [preprocess] Preprocessing function (options)=>void to generate temp options.
 */

/**
 * @type {CanvasModelClosePenisOptions}
 */
const combatClosePenis = {
	name: "combatClosePenis",
	width: 256,
	height: 256,
	frames: 4,
	generatedOptions() {
		console.log(this.name, "closePenis generatedOptions");
		return [];
	},
	defaultOptions() {
		console.log(this.name, "closePenis defaultOptions");
		return {
			root: "img/newsex/close/",
			position: "missionary",
			showPenis: false,
			penis: {},
			filters: {
				worn: {},
			},
		};
	},
	preprocess(options) {
		console.log(this.name, "closePenis preprocess");
	},
	/** @type {Object<string, CanvasModelLayerClosePenis>} */
	layers: {
		base: {
			srcfn(options) {
				return `${options.src}penis/${options.position}/base-${V.player.vaginaExist ? "herm" : "penis"}.png`;
			},
			showfn(options) {
				return !!options.showPenis;
			},
			animationfn(options) {
				return options.animKeyPenis;
			},
			filters: ["body"],
			z: ZIndices.closeBase,
		},
		panties: {
			srcfn(options) {
				return `${options.src}penis/${options.position}/panties.png`;
			},
			showfn(options) {
				return !!options.showPenis && V.worn.under_lower.state === "totheside";
			},
			animationfn(options) {
				return options.animKeyPenis;
			},
			filters: ["worn_under_lower_main"],
			z: ZIndices.closeWorn,
		},
		penis: {
			srcfn(options) {
				if (window.playerHasStrapon()) {
					options.pcPenis = V.worn.under_lower.name === "strap-on knotted cock" ? "strapon-knotted" : "strapon-dick";
				} else if (playerChastity("cage")) {
					options.pcPenis = options.penis.chastityPenis;
				} else if (["beast", "beast-oral"].includes(options.penis.npc)) {
					options.pcPenis = `${options.penis.size}-${options.penis.type}-${options.penis.state}`;
				} else {
					options.pcPenis = `${options.penis.size}-${options.penis.type}`;
				}
				return `${options.src}penis/${options.position}/${options.pcPenis}.png`;
			},
			showfn(options) {
				const concealed = V.worn.genitals.type.includes("hidden") || V.worn.genitals.name === "chastity parasite";
				return !!options.showPenis && !concealed;
			},
			animationfn(options) {
				return options.animKeyPenis;
			},
			filters: ["body"],
			z: ZIndices.closeGenitals + 4,
		},
		condom: {
			srcfn(options) {
				return `${options.src}penis/${options.position}/${options.penis.size}-condom-${V.player.condom.type}.png`;
			},
			showfn(options) {
				return !!options.showPenis && !!options.penis.condom;
			},
			animationfn(options) {
				return options.animKeyPenis;
			},
			alpha: 0.4,
			filters: ["condom"],
			z: ZIndices.closeGenitals + 4,
		},
		parasite: {
			srcfn(options) {
				const panties = V.earSlime.focus === "impregnation" ? "shorts" : "panties";
				const herm = V.player.vaginaExist ? "-herm" : "";
				return `${options.src}penis/${options.position}/parasite-${panties}${herm}.png`;
			},
			showfn(options) {
				return !!options.showPenis && (V.parasite.clit.name === "parasite" || V.parasite.penis.name === "parasite");
			},
			animationfn(options) {
				return options.animKeyPenis;
			},
			filters: ["parasitePanties"],
			z: ZIndices.closeWornUnder,
		},
		parasiteBalls: {
			srcfn(options) {
				return `${options.src}penis/${options.position}/parasite-balls.png`;
			},
			showfn(options) {
				return (
					!!options.showPenis &&
					!!V.player.ballsExist &&
					V.player.gender === "m" &&
					(V.parasite.clit.name === "parasite" || V.parasite.penis.name === "parasite") &&
					["mixed", "impregnation"].includes(V.earSlime.focus)
				);
			},
			animationfn(options) {
				return options.animKeyPenis;
			},
			filters: ["parasitePanties"],
			z: ZIndices.closeWornUnder,
		},
		chastity: {
			srcfn(options) {
				return `${options.src}penis/${options.position}/${options.penis.chastityDevice}.png`;
			},
			showfn(options) {
				return !!options.showPenis && !!playerChastity("penis");
			},
			animationfn(options) {
				return options.animKeyPenis;
			},
			filtersfn(options) {
				return options.penis.chastityDevice.includes("parasite") ? ["parasitePanties"] : [];
			},
			z: ZIndices.closeWorn,
		},
		penetratedNpc: {
			srcfn(options) {
				return `${options.src}penis/${options.position}/npc/${options.penis.npc}-${options.penis.state}.png`;
			},
			showfn(options) {
				return !!options.showPenis && !!options.penis.npc;
			},
			animationfn(options) {
				return options.animKeyPenis;
			},
			filtersfn(options) {
				return options.penis.npc === "tentacle" ? ["penisTentacle"] : ["penisNpc"];
			},
			alphafn(options) {
				return options.penis.npc === "tentacle" && ["tentacles-wraith", "tentacles-wraith-penetrated"].includes(V.tentacleColour) ? 0.4 : 1;
			},
			z: ZIndices.closeNpc,
		},
		cum: {
			srcfn(options) {
				return `${options.src}penis/${options.position}/npc/${options.penis.npc}-cum.png`;
			},
			showfn(options) {
				return !!options.showPenis && options.penis.npc === "beast-oral" && V.orgasmdown >= 1;
			},
			animationfn(options) {
				return options.animKeyPenis;
			},
			filters: ["parasitePanties"],
			z: ZIndices.closeCum,
		},
	},
};
Renderer.CanvasModels.combatClosePenis = combatClosePenis;
