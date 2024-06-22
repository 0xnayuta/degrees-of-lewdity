// @ts-check

/* globals mapNpcToOptions */

/**
 * @type {CanvasModelOptions}
 */
const combatMainNpc = {
	name: "combatMainNpc",
	width: 256,
	height: 256,
	frames: 4,
	metadata: {},
	generatedOptions() {
		console.log(this.name, "generatedOptions");
		return [];
	},
	defaultOptions() {
		console.log(this.name, "defaultOptions");
		return this.metadata;
	},
	preprocess(options) {
		console.log("combatMainNpc-Preprocess:", JSON.parse(JSON.stringify(options)));
		mapNpcToOptions(options.index || 0, options);
	},
	layers: {
		body: {
			srcfn(options) {
				const path = `${options.src}${options.category}/${options.type}/${options.state}.png`;
				console.warn("NPC path:", path);
				return path;
			},
			showfn(options) {
				const show = options.show;
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
				const show = options.show && options.category === "beast";
				console.warn("NPC showing:", show);
				return !!show;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: 85,
		},
		penetrator: {
			srcfn(options) {
				if (options.penetrators.length <= 0) return "";
				const penetrator = options.penetrators[0];
				const path = `${options.src}penetrators/${penetrator.type}/${penetrator.position}-${penetrator.state}.png`;
				return path;
			},
			showfn(options) {
				if (options.penetrators.length <= 0) return false;
				const penetrator = options.penetrators[0];
				// if (penetrator.position === "vagina" && penetrator.state === "penetrated") return false;
				return !!penetrator.show;
			},
			animationfn(options) {
				return options.animKey;
			},
			zfn(options) {
				if (options.penetrators.length <= 0) return 0;
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
				if (options.penetrators.length <= 0) return "";
				const penetrator = options.penetrators[0];
				const path = `${options.src}penetrators/${penetrator.type}/${penetrator.position}-${penetrator.state}-${penetrator.ejaculate.type}.png`;
				return path;
			},
			showfn(options) {
				if (options.penetrators.length <= 0) return false;
				const penetrator = options.penetrators[0];
				const result = penetrator.show && penetrator.isEjaculating;
				return !!result;
			},
			animationfn(options) {
				return options.animKey;
			},
			zfn(options) {
				if (options.penetrators.length <= 0) return 0;
				const penetrator = options.penetrators[0];
				if (penetrator.position === "thighs") {
					return 32;
				}
				if (penetrator.position === "leftarm") {
					return 48; // Behind the Z index of PC's "backarm"
				}
				return 61;
			},
		},
	},
};
Renderer.CanvasModels.combatMainNpc = combatMainNpc;
