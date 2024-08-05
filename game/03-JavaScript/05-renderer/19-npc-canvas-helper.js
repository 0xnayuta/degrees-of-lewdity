// @ts-check
/* global CanvasModelLayers, KeyframeAnimationSpec, CombatRenderer */

class NpcCanvasHelper {
	/**
	 * @param {CanvasModelLayers<NpcOptions>} overrideOptions
	 * @returns {CanvasModelLayers<NpcOptions>}
	 */
	static genBodyLayer(overrideOptions = {}) {
		/**
		 * @type {CanvasModelLayers<NpcOptions>}
		 */
		const defaults = {
			srcfn(options) {
				const path = `${options.src}/${options.category}/${options.type}/${options.state}.png`;
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
			dxfn(options) {
				const penetrator = options.penetrators[0];
				if (penetrator == null) {
					return 0;
				}
				if (penetrator.position != null && ["vagina", "anus", "butt", "thighs"].includes(penetrator.position)) {
					switch (penetrator.state) {
						case "penetrating":
							return 0;
						case "imminent":
							return 10;
						case "entrance":
							return 20;
					}
				}
				if (penetrator.position === "mouth") {
					switch (penetrator.state) {
						case "penetrating":
							return 0;
						case "imminent":
							return -10;
						case "entrance":
							return -20;
					}
				}
				return 0;
			},
		};
		return Object.assign(defaults, overrideOptions);
	}

	/**
	 * @param {CanvasModelLayers<NpcOptions>} overrideOptions
	 * @returns {CanvasModelLayers<NpcOptions>}
	 */
	static genPenetratorLayer(overrideOptions = {}) {
		/**
		 * @type {CanvasModelLayers<NpcOptions>}
		 */
		const defaults = {
			srcfn(options) {
				if (options.penetrators.length <= 0) return "";
				const penetrator = options.penetrators[0];
				const path = `${options.src}/penetrators/${penetrator.type}/${penetrator.position}.png`;
				return path;
			},
			showfn(options) {
				if (options.penetrators.length <= 0) return false;
				const penetrator = options.penetrators[0];
				// if (penetrator.position === "vagina" && penetrator.state === "penetrated") return false;
				return !!penetrator.show;
			},
			zfn(options) {
				if (options.penetrators.length <= 0) return 0;
				const penetrator = options.penetrators[0];
				if (penetrator.position === "thighs") {
					return 30;
				}
				if (options.position === "doggy" && penetrator.position === "rightarm") {
					return CombatRenderer.indices.backArm - 1;
				}
				if (options.position === "missionary" && penetrator.position === "leftarm") {
					return CombatRenderer.indices.backArm - 1;
				}
				if (penetrator.position === "mouth" && penetrator.state !== "penetrating") {
					return CombatRenderer.indices.head + 1; // Put in front of head
				}
				return 49;
			},
			animationfn(options) {
				if (options.category !== "shadow") {
					return options.animKey;
				}
				const speed = options.speed;
				const penetrator = options.penetrators[0];
				if (penetrator == null) {
					return options.animKey;
				}
				if (penetrator.position != null && ["vagina", "anus", "thighs"].includes(penetrator.position)) {
					return `equal-oscillation-${speed}`;
				}
				if (penetrator.position === "butt") {
					return `butt-rubbing-${speed}`;
				}
				if (penetrator.position === "mouth") {
					return `blowjob-${speed}`;
				}
				if (penetrator.position === "chest") {
					return `boobjob-${speed}`;
				}
				if (penetrator.position === "feet") {
					return `footjob-${speed}`;
				}
				return options.animKey;
			},
			dxfn(options) {
				if (options.category !== "shadow") {
					return 0;
				}
				const penetrator = options.penetrators[0];
				if (penetrator == null) {
					return 0;
				}
				if (penetrator.position != null && ["vagina", "anus", "thighs"].includes(penetrator.position)) {
					switch (penetrator.state) {
						case "penetrating":
							return 0;
						case "imminent":
							return 10;
						case "entrance":
							return 20;
					}
				}
				if (penetrator.position === "mouth") {
					switch (penetrator.state) {
						case "penetrating":
							return 0;
						case "imminent":
							return -10;
						case "entrance":
							return -20;
					}
				}
				return 0;
			},
			dyfn(options) {
				if (options.category !== "shadow") {
					return 0;
				}
				const penetrator = options.penetrators[0];
				if (penetrator == null) {
					return 0;
				}
				return 0;
			},
			heightfn(options) {
				return 256;
			},
			widthfn(options) {
				return 256;
			},
		};
		return Object.assign(defaults, overrideOptions);
	}

	/**
	 * @param {CanvasModelLayers<NpcOptions>} overrideOptions
	 * @returns {CanvasModelLayers<NpcOptions>}
	 */
	static genPenetratorEjaculationLayer(overrideOptions = {}) {
		/**
		 * @type {CanvasModelLayers<NpcOptions>}
		 */
		const defaults = {
			srcfn(options) {
				if (options.penetrators.length <= 0) return "";
				const penetrator = options.penetrators[0];
				const path = `${options.src}/penetrators/${penetrator.type}/${penetrator.position}-${penetrator.ejaculate.type}.png`;
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
				return 49;
			},
		};
		return Object.assign(defaults, overrideOptions);
	}
}
window.NpcCanvasHelper = NpcCanvasHelper;

/*
-idle
[
	{
		frame: 0,
		duration: 2000,
	},
	{
		frame: 2,
		duration: 2000,
	}
],

-mid
{
	frames: 4,
	duration: 170,
}

-vfast
{
	frames: 4,
	duration: 80,
}
*/

/**
 * @type {KeyframeAnimationSpec}
 */
const oscillationIdle = {
	frameCount: 2,
	keyframes: [
		{
			frame: 0,
			duration: 2000,
			dx: 0,
		},
		{
			frame: 0,
			duration: 2000,
			dx: 12,
		},
	],
};
Renderer.Animations["equal-oscillation-idle"] = oscillationIdle;

/**
 * @type {KeyframeAnimationSpec}
 */
const oscillationMid = {
	frameCount: 4,
	keyframes: [
		{
			frame: 0,
			duration: 170,
			dx: 0,
		},
		{
			frame: 0,
			duration: 170,
			dx: 6,
		},
		{
			frame: 0,
			duration: 170,
			dx: 12,
		},
		{
			frame: 0,
			duration: 170,
			dx: 6,
		},
	],
};
Renderer.Animations["equal-oscillation-mid"] = oscillationMid;

/**
 * @type {KeyframeAnimationSpec}
 */
const oscillationVeryFast = {
	frameCount: 4,
	keyframes: [
		{
			frame: 0,
			duration: 80,
			dx: 0,
		},
		{
			frame: 0,
			duration: 80,
			dx: 6,
		},
		{
			frame: 0,
			duration: 80,
			dx: 12,
		},
		{
			frame: 0,
			duration: 80,
			dx: 6,
		},
	],
};
Renderer.Animations["equal-oscillation-vfast"] = oscillationVeryFast;

/**
 * @type {KeyframeAnimationSpec}
 */
const buttRubbingIdle = {
	frameCount: 2,
	keyframes: [
		{
			frame: 0,
			duration: 2000,
			dx: 0,
			dy: 0,
		},
		{
			frame: 0,
			duration: 2000,
			dx: -1,
			dy: 0,
		},
	],
};
Renderer.Animations["butt-rubbing-idle"] = buttRubbingIdle;

/**
 * @type {KeyframeAnimationSpec}
 */
const buttRubbingMid = {
	frameCount: 4,
	keyframes: [
		{
			frame: 0,
			duration: 170,
			dx: 0,
			dy: 0,
		},
		{
			frame: 0,
			duration: 170,
			dx: -4,
			dy: -2,
		},
		{
			frame: 0,
			duration: 170,
			dx: -2,
			dy: 0,
		},
		{
			frame: 0,
			duration: 170,
			dx: 2,
			dy: 0,
		},
	],
};
Renderer.Animations["butt-rubbing-mid"] = buttRubbingMid;

/**
 * @type {KeyframeAnimationSpec}
 */
const buttRubbingVeryFast = {
	frameCount: 4,
	keyframes: [
		{
			frame: 0,
			duration: 80,
			dx: 0,
			dy: 0,
		},
		{
			frame: 0,
			duration: 80,
			dx: -2,
			dy: -1,
		},
		{
			frame: 0,
			duration: 80,
			dx: -1,
			dy: 0,
		},
		{
			frame: 0,
			duration: 80,
			dx: 1,
			dy: 0,
		},
	],
};
Renderer.Animations["butt-rubbing-vfast"] = buttRubbingVeryFast;

/**
 * @type {KeyframeAnimationSpec}
 */
const blowjobIdle = {
	frameCount: 2,
	keyframes: [
		{
			frame: 0,
			duration: 2000,
			dx: 0,
		},
		{
			frame: 0,
			duration: 2000,
			dx: 12,
		},
	],
};
Renderer.Animations["blowjob-idle"] = blowjobIdle;

/**
 * @type {KeyframeAnimationSpec}
 */
const blowjobMid = {
	frameCount: 4,
	keyframes: [
		{
			frame: 0,
			duration: 170,
			dx: 0,
		},
		{
			frame: 0,
			duration: 170,
			dx: 4,
		},
		{
			frame: 0,
			duration: 170,
			dx: 12,
		},
		{
			frame: 0,
			duration: 170,
			dx: 6,
		},
	],
};
Renderer.Animations["blowjob-mid"] = blowjobMid;

/**
 * @type {KeyframeAnimationSpec}
 */
const blowjobVeryFast = {
	frameCount: 4,
	keyframes: [
		{
			frame: 0,
			duration: 80,
			dx: 0,
		},
		{
			frame: 0,
			duration: 80,
			dx: 4,
		},
		{
			frame: 0,
			duration: 80,
			dx: 16,
		},
		{
			frame: 0,
			duration: 80,
			dx: 6,
		},
	],
};
Renderer.Animations["blowjob-vfast"] = blowjobVeryFast;

/**
 * @type {KeyframeAnimationSpec}
 */
const boobjobIdle = {
	frameCount: 4,
	keyframes: [
		{
			frame: 0,
			duration: 1000,
			dx: 0,
		},
		{
			frame: 0,
			duration: 1000,
			dx: 4,
		},
	],
};
Renderer.Animations["boobjob-idle"] = boobjobIdle;

/**
 * @type {KeyframeAnimationSpec}
 */
const boobjobMid = {
	frameCount: 4,
	keyframes: [
		{
			frame: 0,
			duration: 170,
			dx: 0,
		},
		{
			frame: 0,
			duration: 170,
			dx: 4,
		},
		{
			frame: 0,
			duration: 170,
			dx: 8,
		},
		{
			frame: 0,
			duration: 170,
			dx: 4,
		},
	],
};
Renderer.Animations["boobjob-mid"] = boobjobMid;

/**
 * @type {KeyframeAnimationSpec}
 */
const boobjobVeryFast = {
	frameCount: 4,
	keyframes: [
		{
			frame: 0,
			duration: 80,
			dx: 0,
		},
		{
			frame: 0,
			duration: 80,
			dx: 4,
		},
		{
			frame: 0,
			duration: 80,
			dx: 16,
		},
		{
			frame: 0,
			duration: 80,
			dx: 6,
		},
	],
};
Renderer.Animations["boobjob-vfast"] = boobjobVeryFast;

/**
 * @type {KeyframeAnimationSpec}
 */
const footjobIdle = {
	frameCount: 4,
	keyframes: [
		{
			frame: 0,
			duration: 1000,
			dx: 0,
		},
		{
			frame: 0,
			duration: 1000,
			dx: 4,
		},
	],
};
Renderer.Animations["footjob-idle"] = footjobIdle;

/**
 * @type {KeyframeAnimationSpec}
 */
const footjobMid = {
	frameCount: 4,
	keyframes: [
		{
			frame: 0,
			duration: 170,
			dx: 0,
		},
		{
			frame: 0,
			duration: 170,
			dx: 2,
		},
		{
			frame: 0,
			duration: 170,
			dx: 4,
		},
		{
			frame: 0,
			duration: 170,
			dx: 2,
		},
	],
};
Renderer.Animations["footjob-mid"] = footjobMid;

/**
 * @type {KeyframeAnimationSpec}
 */
const footjobVeryFast = {
	frameCount: 4,
	keyframes: [
		{
			frame: 0,
			duration: 80,
			dx: 0,
		},
		{
			frame: 0,
			duration: 80,
			dx: 2,
		},
		{
			frame: 0,
			duration: 80,
			dx: 4,
		},
		{
			frame: 0,
			duration: 80,
			dx: 2,
		},
	],
};
Renderer.Animations["footjob-vfast"] = footjobVeryFast;
