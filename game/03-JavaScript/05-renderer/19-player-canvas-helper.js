// @ts-check
/* global CombatRenderer, CombatPlayerOptions, CanvasModelLayers, TransformationKeys, BodywritingOption, ClothingRendererStep, ClothedSlots */

class PlayerCanvasHelper {
	/**
	 * @param {string} id
	 * @param {CanvasModelLayers<CombatPlayerOptions>} overrideOptions
	 * @returns {CanvasModelLayers<CombatPlayerOptions>}
	 */
	static genBodywritingLayer(id, overrideOptions = {}) {
		/**
		 * @type {CanvasModelLayers<CombatPlayerOptions>}
		 */
		const defaults = {
			srcfn(options) {
				/** @type {BodywritingOption} */
				const bodywriting = options.bodywriting[id];
				const path = `${options.src}bodywriting/${bodywriting.area}/${bodywriting.type}.png`;
				return path;
			},
			showfn(options) {
				/** @type {BodywritingOption} */
				const bodywriting = options.bodywriting[id];
				return !!bodywriting.show;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: CombatRenderer.indices.base,
		};
		return Object.assign(defaults, overrideOptions);
	}

	/**
	 * @param {ClothedSlots} slot
	 * @param {"front" | "back"} layer
	 * @param {boolean} isAccessory
	 * @param {CanvasModelLayers<CombatPlayerOptions>} overrideOptions
	 * @returns {CanvasModelLayers<CombatPlayerOptions>}
	 */
	static genClothingLayerLowerStep(slot, layer, isAccessory, overrideOptions = {}) {
		/**
		 * @type {CanvasModelLayers<CombatPlayerOptions>}
		 */
		const defaults = {
			srcfn(options) {
				const clothes = options.clothes[slot];
				if (clothes == null) {
					Errors.report("Clothing object was undefined", {
						slot,
						layer,
						isAccessory,
					});
					return "";
				}
				if (clothes?.name == null || clothes.renderStep == null) return "";
				const step = ClothingRendererStep.instances[clothes.renderStep];
				if (step == null) {
					// Fallback
					Errors.report("Step key not found in ClothingRendererStep", {
						slot,
						layer,
						isAccessory,
						name: clothes.name,
					});
					return "";
				}
				const states = [];
				if (step.isStateLayered(options.position, clothes.state)) {
					states.push(layer);
				}
				if (clothes.positions != null && step.isStateLegged(options.position, clothes.state)) {
					states.push(clothes.positions[layer]);
				}
				states.push(clothes.state);
				if (options.position === "doggy" && clothes.isRaised) {
					states.push("raised");
				}
				if (isAccessory) {
					states.push("acc");
				}
				const state = states.join("-");
				const path = `${options.src}clothing/${slot}/${clothes.name}/${state}.png`;
				console.log(slot, "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes[slot];
				if (clothes == null) {
					Errors.report("Clothing object was undefined", {
						slot,
						layer,
						isAccessory,
					});
					return false;
				}
				if (clothes.renderStep == null) {
					return false;
				}
				const step = ClothingRendererStep.instances[clothes.renderStep];
				if (step == null) {
					// Fallback
					Errors.report("Step key not found in ClothingRendererStep", {
						slot,
						layer,
						isAccessory,
						name: clothes.name,
					});
					return false;
				}
				if (isAccessory && !clothes.hasAccessory) {
					return false;
				}
				const stepShow = step.shouldShow(options.position, clothes.state);
				const isClothingShown = CombatRenderer.isClothingShown(clothes, options.showClothing);
				const hasMainImg = clothes.hasMainImg;
				return !!stepShow && !!isClothingShown && !!hasMainImg;
			},
			alphafn(options) {
				const clothes = options.clothes[slot];
				if (clothes == null) {
					Errors.report("Clothing object was undefined");
					return 1;
				}
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
			z: CombatRenderer.indices[slot],
		};
		return Object.assign(defaults, overrideOptions);
	}

	/**
	 * @param {string} slot
	 * @param {CanvasModelLayers<CombatPlayerOptions>} overrideOptions
	 * @returns {CanvasModelLayers<CombatPlayerOptions>}
	 */
	static genClothingLayer(slot, overrideOptions = {}) {
		/**
		 * @type {CanvasModelLayers<CombatPlayerOptions>}
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
				const show = CombatRenderer.isClothingShown(clothes, options.showClothing) && clothes.hasMainImg;
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
			z: CombatRenderer.indices[slot],
		};
		return Object.assign(defaults, overrideOptions);
	}

	/**
	 *
	 * @param {string} slot
	 * @param {CanvasModelLayers<CombatPlayerOptions>} overrideOptions
	 * @returns {CanvasModelLayers<CombatPlayerOptions>}
	 */
	static genClothingAccLayer(slot, overrideOptions = {}) {
		/**
		 * @type {CanvasModelLayers<CombatPlayerOptions>}
		 */
		const defaults = {
			srcfn(options) {
				const clothes = options.clothes[slot];
				if (clothes == null || clothes.name == null) return "";
				const path = `${options.src}clothing/${slot}/${clothes.name}/${clothes.state}-acc.png`;
				console.log(slot, "Path:", path);
				return path;
			},
			showfn(options) {
				const clothes = options.clothes[slot];
				const show = options.showClothing && clothes != null && clothes.show && clothes.hasAccessory;
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
				const filter = `worn_${slot}_acc`;
				console.log(slot, "Filters:", filter, options.filters[filter]);
				return [filter];
			},
			z: CombatRenderer.indices[slot],
		};
		return Object.assign(defaults, overrideOptions);
	}

	/**
	 * @param {TransformationKeys} transformation
	 * @param {"wings" | "halo" | "horns" | "tail"} part
	 * @param {"front" | "back"} layer
	 * @param {CanvasModelLayers<CombatPlayerOptions>} overrideOptions
	 * @returns {CanvasModelLayers<CombatPlayerOptions>}
	 */
	static genTransformationLayer(transformation, part, layer, overrideOptions = {}) {
		/**
		 * @type {CanvasModelLayers<CombatPlayerOptions>}
		 */
		const defaults = {
			srcfn(options) {
				const value = options.transformations[transformation][part];
				const path = `${options.src}body/transformations/${value.type}/${part}/${layer}-${value.style}.png`;
				console.log("Transformation", transformation, "part", part, layer, "src:", path);
				return path;
			},
			showfn(options) {
				const value = options.transformations[transformation][part];
				const show = value.show;
				console.log("Transformation", transformation, "part", part, layer, "show:", show);
				return show;
			},
			animationfn(options) {
				return options.animKey;
			},
			filters: [transformation + part.toUpperFirst()],
			z: CombatRenderer.indices[layer + part.toUpperFirst()],
		};
		return Object.assign(defaults, overrideOptions);
	}
}
window.PlayerCanvasHelper = PlayerCanvasHelper;
