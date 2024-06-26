// @ts-check
/* globals CombatClothingTypes, ClothingStates, ZeroedClothingStates, ClothingRendererStepState, Partial, Record */

class ClothingRendererStep {
	/**
	 * @param {CombatClothingTypes} type
	 * @param {Partial<Record<ClothingStates, ClothingRendererStepState>>} states
	 */
	static create(type, states) {
		if (!(type in ClothingRendererStep.instances)) {
			ClothingRendererStep.instances[type] = new ClothingRendererStep(type, states);
		}
		return ClothingRendererStep.instances[type];
	}

	/**
	 * @param {CombatClothingTypes} type
	 * @param {Partial<Record<ClothingStates, ClothingRendererStepState>>} states
	 */
	constructor(type, states) {
		this.type = type;
		this.states = states;
	}

	/**
	 * @param {ZeroedClothingStates} state
	 * @returns {boolean}
	 */
	isStateLayered(state) {
		if (state === 0) {
			return false;
		}
		const selected = this.states[state];
		if (selected == null) {
			return false;
		}
		return !!selected.layered;
	}

	/**
	 * @param {ZeroedClothingStates} state
	 * @returns {boolean}
	 */
	isStateLegged(state) {
		if (state === 0) {
			return false;
		}
		const selected = this.states[state];
		if (selected == null) {
			return false;
		}
		return !!selected.legged;
	}

	/**
	 * @param {ZeroedClothingStates} state
	 * @returns {boolean}
	 */
	shouldShow(state) {
		if (state === 0) {
			return false;
		}
		return Object.keys(this.states).includes(state);
	}
}
/** @type {Partial<Record<CombatClothingTypes, ClothingRendererStep>>} */
ClothingRendererStep.instances = {};
// @ts-ignore
window.ClothingRendererStep = ClothingRendererStep;

class LowerwearRendererStep extends ClothingRendererStep {}
// @ts-ignore
window.LowerwearRendererStep = LowerwearRendererStep;

ClothingRendererStep.create("skirt", {
	chest: {
		layered: false,
		legged: false,
	},
	midriff: {
		layered: false,
		legged: false,
	},
	waist: {
		layered: true,
		legged: true,
	},
	thighs: {
		layered: true,
		legged: true,
	},
	knees: {
		layered: true,
		legged: true,
	},
	ankles: {
		layered: true,
		legged: true,
	},
});

ClothingRendererStep.create("longskirt", {
	chest: {
		layered: false,
		legged: false,
	},
	midriff: {
		layered: false,
		legged: false,
	},
	waist: {
		layered: true,
		legged: true,
	},
	thighs: {
		layered: true,
		legged: true,
	},
	knees: {
		layered: true,
		legged: true,
	},
	ankles: {
		layered: true,
		legged: true,
	},
});

ClothingRendererStep.create("trousers", {
	waist: {
		layered: true,
		legged: true,
	},
	thighs: {
		layered: true,
		legged: true,
	},
	knees: {
		layered: true,
		legged: true,
	},
	ankles: {
		layered: true,
		legged: true,
	},
});

ClothingRendererStep.create("shorts", {
	waist: {
		layered: true,
		legged: true,
	},
	thighs: {
		layered: true,
		legged: true,
	},
	knees: {
		layered: true,
		legged: true,
	},
	ankles: {
		layered: true,
		legged: true,
	},
});
