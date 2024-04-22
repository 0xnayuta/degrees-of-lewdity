/* eslint-disable jsdoc/no-undefined-types */
/**
 * @typedef {object} CanvasModelLayerNpc
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
 * @property {function(NpcOptions): boolean} [showfn] (options)=>boolean Function generating `show` property. Should return boolean, do not use undefined/null/0/"" to hide layer, use of !! (double not) operator recommended.
 * @property {function(NpcOptions): string} [srcfn] (options)=>string.
 * @property {function(NpcOptions): number} [zfn] (options)=>number.
 * @property {function(NpcOptions): number} [alphafn] (options)=>number.
 * @property {function(NpcOptions): boolean} [desaturatefn] (options)=>boolean.
 * @property {function(NpcOptions): number} [brightnessfn] (options)=>number.
 * @property {function(NpcOptions): number} [contrastftn] (options)=>number.
 * @property {function(NpcOptions): (string|object)} [blendModefn] (options)=>(string|object).
 * @property {function(NpcOptions): string} [blendfn] (options)=>string.
 * @property {function(NpcOptions): string} [masksrcfn] (options)=>string.
 * @property {function(NpcOptions): string} [animationfn] (options)=>string.
 * @property {function(NpcOptions): number[]} [framesfn] (options)=>number[].
 * @property {function(NpcOptions): string[]} [filtersfn] (options)=>string[].
 * @property {function(NpcOptions): number} [dxfn] (options)=>number.
 * @property {function(NpcOptions): number} [dyfn] (options)=>number.
 * @property {function(NpcOptions): number} [widthfn] (options)=>number.
 * @property {function(NpcOptions): number} [heightfn] (options)=>number.
 */

/**
 * @type {CanvasModelOptions}
 */
const combatMainNpc = {
	name: "combatMainNpc",
	width: 256,
	height: 256,
	frames: 4,
	generatedOptions() {
		console.log(this.name, "generatedOptions");
		return [];
	},
	defaultOptions() {
		console.log(this.name, "defaultOptions");
		return {};
	},
	preprocess() {
		console.log(this.name, "preprocess");
	},
	/** @type {Object<string, CanvasModelLayerNpc>} */
	layers: {
		body: {
			srcfn(options) {
				const path = `${options.src}${options.category}/${options.type}/${options.state}.png`;
				console.warn("NPC path:", path);
				return path;
			},
			showfn(options) {
				const show = options.show && V.options.silhouetteEnabled;
				console.warn("NPC showing:", show);
				return !!show;
			},
			animationfn(options) {
				return options.animKey;
			},
			zfn(options) {
				if (options.position === "doggy") {
					return 20;
				}
				if (options.state === "penis") {
					return 90;
				}
				return 60;
			},
		},
		frontleg: {
			srcfn(options) {
				const path = `${options.src}${options.category}/${options.type}/${options.state}-leg.png`;
				console.warn("NPC path:", path);
				return path;
			},
			showfn(options) {
				const show = options.show && V.options.silhouetteEnabled && options.category === "beast";
				console.warn("NPC showing:", show);
				return !!show;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: 80,
		},
		penetrator: {
			srcfn(options) {
				if (options.penetrators.length <= 0) return;
				const penetrator = options.penetrators[0];
				const path = `${options.src}penetrators/${penetrator.type}/${penetrator.position}-${penetrator.state}.png`;
				return path;
			},
			showfn(options) {
				if (options.penetrators.length <= 0) return;
				const penetrator = options.penetrators[0];
				if (penetrator.position === "vagina" && penetrator.state === "penetrated") return false;
				return !!penetrator.show;
			},
			animationfn(options) {
				return options.animKey;
			},
			zfn(options) {
				if (options.penetrators.length <= 0) return;
				const penetrator = options.penetrators[0];
				if (penetrator.position === "thighs") {
					return 30;
				}
				if (penetrator.position === "leftarm") {
					return 46; // Behind the Z index of PC's "backarm"
				}
				return 59;
			},
		},
		penetratorEjaculate: {
			srcfn(options) {
				if (options.penetrators.length <= 0) return;
				const penetrator = options.penetrators[0];
				const path = `${options.src}penetrators/${penetrator.type}/${penetrator.position}-${penetrator.state}-${penetrator.ejaculate.type}.png`;
				return path;
			},
			showfn(options) {
				if (options.penetrators.length <= 0) return;
				const penetrator = options.penetrators[0];
				const result = penetrator.show && penetrator.isEjaculating;
				return !!result;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: 61,
		},
	},
};
Renderer.CanvasModels.combatMainNpc = combatMainNpc;
