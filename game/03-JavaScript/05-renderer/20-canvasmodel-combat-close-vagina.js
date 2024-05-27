// @ts-check
/**
 * @typedef {object} CanvasModelLayerCloseVagina
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
 * @typedef {object} CanvasModelCloseVaginaOptions
 * @property {string} name Model name, for debugging.
 * @property {number} width Frame width.
 * @property {number} height Frame height.
 * @property {number} frames Number of frames for CSS animation.
 * @property {Object<string, CanvasModelLayerCloseVagina>} layers Layers (by name).
 * @property {Function} [generatedOptions] Function ()=>string[] names of generated options.
 * @property {Function} [defaultOptions] Function ()=>object returning default options.
 * @property {Function} [preprocess] Preprocessing function (options)=>void to generate temp options.
 */

/**
 * @type {CanvasModelCloseVaginaOptions}
 */
const combatCloseVagina = {
	name: "combatCloseVagina",
	width: 256,
	height: 256,
	frames: 4,
	generatedOptions() {
		console.log(this.name, "closeVagina generatedOptions");
		return [];
	},
	defaultOptions() {
		console.log(this.name, "closeVagina defaultOptions");
		return {
			root: "img/newsex/close/",
			position: "missionary",
			showVagina: false,
			penis: {},
			filters: {
				worn: {},
			},
		};
	},
	preprocess() {
		console.log(this.name, "closeVagina preprocess");
	},
	/** @type {Object<string, CanvasModelLayerCloseVagina>} */
	layers: {
		vagina: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/${options.vagina.state}-base.png`;
			},
			showfn(options) {
				return !!options.showVagina;
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["body"],
			z: ZIndices.closeBase,
		},
		vaginaAroused: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/${options.vagina.state}-aroused.png`;
			},
			showfn(options) {
				return !!options.showVagina && options.vagina.state === "entrance" && V.vaginaWetness >= 75;
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["body"],
			z: ZIndices.closeBase,
		},
		penis: {
			srcfn(options) {
				if (V.position === "missionary" && options.vagina.state === "penetrated" && V.player.ballsExist) {
					options.pcPenis = options.penis.size + "-" + options.penis.type + "-penetrated";
				} else {
					options.pcPenis = options.penis.size + "-" + options.penis.type;
				}
				return `${options.src}vagina/${options.position}/${options.pcPenis}.png`;
			},
			showfn(options) {
				return !!options.showVagina && V.player.penisExist && V.worn.genitals.name !== "chastity parasite";
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["body"],
			z: ZIndices.closeGenitals + 2,
		},
		vaginaCum: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/${options.vagina.cumState}-cum.png`;
			},
			showfn(options) {
				return !!options.showVagina && setup.bodyliquid.combined("vagina") >= 1;
			},
			animationfn(options) {
				return options.vagina.cumState === "vagina" ? "sex-17f-slow" : options.animKeyVagina;
			},
			z: ZIndices.closeCum,
		},
		hirsute: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/hair/hirsute.png`;
			},
			showfn(options) {
				return !!options.showVagina && options.vagina.hirsute;
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["pbhair"],
			z: ZIndices.closeBase + 1,
		},
		silhouette: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/npc/shadow-${options.vagina.silhouette}.png`;
			},
			showfn(options) {
				return !!options.showVagina && !!options.vagina.silhouette;
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			z: ZIndices.closeNpc + 3,
		},
		parasite: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/parasite-${V.earSlime.focus === "impregnation" ? "shorts" : "panties"}.png`;
			},
			showfn(options) {
				return !!options.showVagina && (V.parasite.clit.name === "parasite" || V.parasite.penis.name === "parasite");
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["parasitePanties"],
			z: ZIndices.closeWorn,
		},
		panties: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/panties.png`;
			},
			showfn(options) {
				return !!options.showVagina && V.worn.under_lower.state === "totheside";
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["worn_under_lower_main"],
			z: ZIndices.closeWorn,
		},
		chastity: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/${options.vagina.chastityDevice}.png`;
			},
			showfn(options) {
				return !!options.showVagina && playerChastity();
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filtersfn(options) {
				return options.vagina.chastityDevice.includes("parasite") ? ["parasitePanties"] : [];
			},
			z: ZIndices.closeWorn,
		},
		npcCum: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/npc/npc-cum.png`;
			},
			showfn(options) {
				return (
					!!options.showVagina &&
					!!options.vagina.npc &&
					V.enemyarousal >= V.enemyarousalmax &&
					wearingCondom(V.vaginatarget) !== "worn" &&
					!npcHasStrapon(V.vaginatarget)
				);
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			z: ZIndices.closeNpc,
		},
		npcPenetrator: vaginaPenetrator("npc", "strapon"),
		npcPenetrator2: vaginaPenetrator("npc2", "dpStrapon"),
		npcCondom: vaginaPenetratorCondom("npc"),
		npcCondom2: vaginaPenetratorCondom("npc2"),
		pubicStrip: vaginaPubes("pbstrip", 1),
		pubicHair: vaginaPubes("pblevel", 2),
	},
};

/**
 *
 * @param {string} npc
 * @param {string} strapon
 * @param {CanvasModelLayerCloseVagina} overrideOptions
 * @returns {CanvasModelLayerCloseVagina}
 */
function vaginaPenetrator(npc, strapon, overrideOptions = {}) {
	/**
	 * @type {CanvasModelLayerCloseVagina}
	 */
	const defaults = {
		srcfn(options) {
			return `${options.src}vagina/${options.position}/npc/${options.vagina[npc]}-${options.vagina.state}.png`;
		},
		showfn(options) {
			return !!options.showVagina && !!options.vagina[npc];
		},
		animationfn(options) {
			return options.animKeyVagina;
		},
		filtersfn(options) {
			const filter = npc === "npc2" ? ["vaginaNpc2"] : ["vaginaNpc"];
			return options.vagina[npc] === "tentacle" ? ["vaginaTentacle"] : filter;
		},
		desaturatefn(options) {
			return options.vagina[strapon];
		},
		brightnessfn(options) {
			return options.vagina[strapon] ? -0.25 : 0;
		},
		alphafn(options) {
			const isWraith = options.vagina[npc] === "tentacle" && ["tentacles-wraith", "tentacles-wraith-penetrated"].includes(V.tentacleColour);
			return isWraith ? (V.tentacleColour === "tentacles-wraith" ? 0.4 : 0.8) : 1;
		},
		z: ZIndices.closeNpc,
	};
	return Object.assign(defaults, overrideOptions);
}

/**
 *
 * @param {string} npc
 * @param {CanvasModelLayerCloseVagina} overrideOptions
 * @returns {CanvasModelLayerCloseVagina}
 */
function vaginaPenetratorCondom(npc, overrideOptions = {}) {
	/**
	 * @type {CanvasModelLayerCloseVagina}
	 */
	const defaults = {
		srcfn(options) {
			return `${options.src}arse/npc/${options.vagina[npc]}-condom-${options.vagina.state}.png`;
		},
		showfn(options) {
			const target = npc === "npc2" ? V.vaginadoubletarget : V.vaginatarget;
			return !!options.showArse && !!options.vagina[npc] && !!V.NPCList[target].condom.worn;
		},
		animationfn(options) {
			return options.animKeyArse;
		},
		alpha: 0.4,
		filters: npc === "npc2" ? ["vaginaCondom2"] : ["vaginaCondom"],
		z: ZIndices.closeNpc + 1,
	};
	return Object.assign(defaults, overrideOptions);
}

/**
 *
 * @param {string} pubes
 * @param {number} level
 * @param {CanvasModelLayerCloseVagina} overrideOptions
 * @returns {CanvasModelLayerCloseVagina}
 */
function vaginaPubes(pubes, level, overrideOptions = {}) {
	/**
	 * @type {CanvasModelLayerCloseVagina}
	 */
	const defaults = {
		srcfn(options) {
			return `${options.src}vagina/${options.position}/hair/${options.vagina.state}-${pubes + V[pubes]}.png`;
		},
		showfn(options) {
			return !!options.showVagina && V.pbdisable === "f" && V[pubes] >= level;
		},
		animationfn(options) {
			return options.animKeyVagina;
		},
		brightness: -0.2,
		contrast: 0.1,
		filters: ["pbhair"],
		z: ZIndices.closeBase,
	};
	return Object.assign(defaults, overrideOptions);
}
Renderer.CanvasModels.combatCloseVagina = combatCloseVagina;
