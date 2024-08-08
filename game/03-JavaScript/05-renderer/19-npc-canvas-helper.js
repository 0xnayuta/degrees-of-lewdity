// @ts-check
/* global CanvasModelLayers, KeyframeAnimationSpec, CombatRenderer, KeyframeSpec */

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
				const penetrator = options.penetrators[0];
				if (penetrator == null || !penetrator.show) {
					return "";
				}
				const path = `${options.src}/penetrators/${penetrator.type}/${penetrator.position}.png`;
				return path;
			},
			showfn(options) {
				const penetrator = options.penetrators[0];
				if (penetrator == null) {
					return false;
				}
				// if (penetrator.position === "vagina" && penetrator.state === "penetrated") return false;
				return !!penetrator.show;
			},
			zfn(options) {
				const penetrator = options.penetrators[0];
				if (penetrator == null) {
					return 0;
				}
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
				if (options.position === "missionary") {
					switch (penetrator.position) {
						case "vagina":
							return `vagina-missionary-${speed}`;
						case "mouth":
							return `blowjob-missionary-${speed}`;
					}
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
				if (penetrator.position === "rightarm") {
					return `back-handjob-${speed}`;
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
				const penetrator = options.penetrators[0];
				if (penetrator == null) {
					return "";
				}
				const path = `${options.src}/penetrators/${penetrator.type}/${penetrator.position}-${penetrator.ejaculate.type}.png`;
				return path;
			},
			showfn(options) {
				const penetrator = options.penetrators[0];
				if (penetrator == null) {
					return false;
				}
				const result = penetrator.show && penetrator.isEjaculating;
				return !!result;
			},
			animationfn(options) {
				return options.animKey;
			},
			zfn(options) {
				const penetrator = options.penetrators[0];
				if (penetrator == null) {
					return 0;
				}
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

/**
 * @param {number} count
 * @param {number} duration
 * @param {number} minX
 * @param {number} maxX
 * @param {number} minY
 * @param {number} maxY
 * @returns {KeyframeAnimationSpec}
 */
function genLinearKeyFrames(count, duration, minX, maxX, minY, maxY) {
	/** @type {KeyframeAnimationSpec} */
	const spec = {
		frameCount: count,
		keyframes: [],
	};

	const diffX = maxX - minX;
	const diffY = maxY - minY;

	for (let i = 0; i < count; i++) {
		const dX = (i * diffX) / (count - 1);
		const dY = (i * diffY) / (count - 1);
		const frame = genKeyFrame(duration, dX, dY);
		spec.keyframes.push(frame);
	}

	return spec;
}
window.genLinearKeyFrames = genLinearKeyFrames;

/**
 * @param {number} duration
 * @param {number} minX
 * @param {number} maxX
 * @param {number} minY
 * @param {number} maxY
 * @returns {KeyframeAnimationSpec}
 */
function genOffsetFourKeyFrames(duration, minX, maxX, minY, maxY) {
	const count = 4;
	/** @type {KeyframeAnimationSpec} */
	const spec = {
		frameCount: count,
		keyframes: [],
	};

	const diffX = maxX - minX;
	const dX = diffX / 2;
	const diffY = maxY - minY;
	const dY = diffY / 2;

	spec.keyframes.push(genKeyFrame(duration, 0 * dX, 0 * dY));
	spec.keyframes.push(genKeyFrame(duration, 1 * dX, 1 * dY));
	spec.keyframes.push(genKeyFrame(duration, 2 * dX, 2 * dY));
	spec.keyframes.push(genKeyFrame(duration, 1 * dX, 1 * dY));

	return spec;
}
window.genOffsetFourKeyFrames = genOffsetFourKeyFrames;

/**
 * @param {number} duration
 * @param {number} minX
 * @param {number} maxX
 * @param {number} minY
 * @param {number} maxY
 * @returns {KeyframeAnimationSpec}
 */
function genSkewedFourKeyFrames(duration, minX, maxX, minY, maxY) {
	const count = 4;
	/** @type {KeyframeAnimationSpec} */
	const spec = {
		frameCount: count,
		keyframes: [],
	};

	const diffX = maxX - minX;
	const dX = diffX / 3;
	const diffY = maxY - minY;
	const dY = diffY / 3;

	spec.keyframes.push(genKeyFrame(duration, 0 * dX, 0 * dY));
	spec.keyframes.push(genKeyFrame(duration, 1 * dX, 1 * dY));
	spec.keyframes.push(genKeyFrame(duration, 3 * dX, 3 * dY));
	spec.keyframes.push(genKeyFrame(duration, 2 * dX, 2 * dY));

	return spec;
}
window.genSkewedFourKeyFrames = genSkewedFourKeyFrames;

/**
 * @param {number} duration
 * @param {number} dx
 * @param {number} dy
 * @returns {KeyframeSpec}
 */
function genKeyFrame(duration, dx, dy) {
	return {
		frame: 0,
		duration,
		dx,
		dy,
	};
}

Renderer.Animations["equal-oscillation-idle"] = genLinearKeyFrames(2, 2000, 0, 12, 0, 0);
Renderer.Animations["equal-oscillation-mid"] = genOffsetFourKeyFrames(170, 0, 12, 0, 0);
Renderer.Animations["equal-oscillation-vfast"] = genOffsetFourKeyFrames(80, 0, 12, 0, 0);

Renderer.Animations["butt-rubbing-idle"] = genLinearKeyFrames(2, 2000, 0, -1, 0, 0);

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

Renderer.Animations["blowjob-idle"] = genLinearKeyFrames(2, 2000, 0, 12, 0, 0);

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

Renderer.Animations["boobjob-idle"] = genLinearKeyFrames(2, 2000, 0, 4, 0, 0);
Renderer.Animations["boobjob-mid"] = genSkewedFourKeyFrames(170, 0, 12, 0, 0);
Renderer.Animations["boobjob-vfast"] = genSkewedFourKeyFrames(80, 0, 12, 0, 0);

Renderer.Animations["footjob-idle"] = genLinearKeyFrames(2, 1000, 0, 4, 0, 0);
Renderer.Animations["footjob-mid"] = genOffsetFourKeyFrames(170, 0, 4, 0, 0);
Renderer.Animations["footjob-vfast"] = genOffsetFourKeyFrames(80, 0, 4, 0, 0);

Renderer.Animations["back-handjob-idle"] = genLinearKeyFrames(2, 1000, 0, 0, 0, 0);

/**
 * @type {KeyframeAnimationSpec}
 */
const backHandjobMid = {
	frameCount: 4,
	keyframes: [
		{
			frame: 0,
			duration: 170,
		},
		{
			frame: 0,
			duration: 170,
		},
		{
			frame: 0,
			duration: 170,
		},
		{
			frame: 0,
			duration: 170,
			dx: 2,
		},
	],
};
Renderer.Animations["back-handjob-mid"] = backHandjobMid;

/**
 * @type {KeyframeAnimationSpec}
 */
const backHandjobVeryFast = {
	frameCount: 4,
	keyframes: [
		{
			frame: 0,
			duration: 80,
		},
		{
			frame: 0,
			duration: 80,
		},
		{
			frame: 0,
			duration: 80,
		},
		{
			frame: 0,
			duration: 80,
			dx: 2,
		},
	],
};
Renderer.Animations["back-handjob-vfast"] = backHandjobVeryFast;

Renderer.Animations["vagina-missionary-idle"] = genLinearKeyFrames(2, 2000, 0, 4, 0, 0);
Renderer.Animations["vagina-missionary-mid"] = genOffsetFourKeyFrames(170, 0, 4, 0, 0);
Renderer.Animations["vagina-missionary-vfast"] = genOffsetFourKeyFrames(80, 0, 4, 0, 0);

Renderer.Animations["blowjob-missionary-idle"] = genLinearKeyFrames(2, 2000, 0, 12, 0, -6);
Renderer.Animations["blowjob-missionary-mid"] = genSkewedFourKeyFrames(170, 0, 12, 0, -6);
Renderer.Animations["blowjob-missionary-vfast"] = genSkewedFourKeyFrames(80, 0, 12, 0, -6);
