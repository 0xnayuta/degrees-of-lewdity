// @ts-check

class CombatRenderer {
	/**
	 * For colour name, lookup its canvas filter and merge with sprite prefilter.
	 *
	 * @param {Object<string, FilterMap>} dict map in setup.colours to lookup in
	 * @param {string} key colour name.
	 * @param {string} debugName used when reporting errors
	 * @param {string | undefined} customFilter key in options.filters
	 * @param {string | undefined} prefilterName name of prefilter to apply
	 * @returns {Partial<CompositeLayerSpec>?} CompositeLayerParams - Check TS docs for model.d.ts
	 */
	static lookupColour(dict, key, debugName, customFilter, prefilterName) {
		console.log("lookupColour", dict, key, debugName, customFilter, prefilterName);

		const filter = key === "custom" ? this.getCustomFilterColour(customFilter, debugName) : this.getFilterColour(key, dict, debugName);

		if (filter == null) {
			console.error("Lookup colour failed:", debugName);
			return filter;
		}

		if (prefilterName) {
			Renderer.mergeLayerData(filter, setup.colours.sprite_prefilters[prefilterName], true);
		}

		return filter;
	}

	/**
	 * @param {string} key
	 * @param {Object<string, FilterMap>} dict
	 * @param {string} debugName
	 * @returns {Partial<CompositeLayerSpec>?}
	 */
	static getFilterColour(key, dict, debugName) {
		const record = dict[key];
		if (!record) {
			console.error("unknown", debugName, "colour:", key);
			return null;
		}
		const filter = clone(record.canvasfilter);
		return filter;
	}

	/**
	 * @param {string | undefined} customFilter
	 * @param {string} debugName
	 * @returns {CompositeLayerSpec?}
	 */
	static getCustomFilterColour(customFilter, debugName) {
		if (!customFilter) return null;

		const filter = getCustomClothesColourCanvasFilter(customFilter);
		if (!filter) {
			console.error("Custom colour", debugName, "not configured");
			return null;
		}
		return filter;
	}

	/**
	 * @typedef Gradient
	 * @property {string} style
	 * @property {string[]} colours
	 */

	/**
	 * @param {"fringe" | "sides"} hairPart
	 * @param {Gradient} gradient
	 * @param {string} hairType
	 * @param {number} hairLength
	 * @param {string} prefilterName
	 * @returns {Partial<CompositeLayerSpec> | null}
	 */
	static createHairColourGradient(hairPart, gradient, hairType, hairLength, prefilterName) {
		const filterPrototypeLibrary = setup.colours.hairgradients_prototypes[hairPart][gradient.style];
		const filterPrototype = filterPrototypeLibrary[hairType] || filterPrototypeLibrary.all;
		/** @type {Partial<CompositeLayerSpec>} */
		const filter = {
			// @ts-ignore
			blend: clone(filterPrototype),
			brightness: {
				// @ts-ignore
				gradient: filterPrototype.gradient,
				values: filterPrototype.values,
				// @ts-ignore
				adjustments: [[], []],
			},
			blendMode: "hard-light",
		};
		// @ts-ignore
		for (const colorIndex in filter.blend.colors) {
			// @ts-ignore
			filter.brightness.adjustments[colorIndex][0] = filter.blend.lengthFunctions[0](hairLength, filter.blend.colors[colorIndex][0]);
			// @ts-ignore
			filter.brightness.adjustments[colorIndex][1] = setup.colours.hair_map[gradient.colours[colorIndex]].canvasfilter.brightness || 0;

			// @ts-ignore
			filter.blend.colors[colorIndex][0] = filter.blend.lengthFunctions[0](hairLength, filter.blend.colors[colorIndex][0]);
			// @ts-ignore
			filter.blend.colors[colorIndex][1] = setup.colours.hair_map[gradient.colours[colorIndex]].canvasfilter.blend;
		}
		Renderer.mergeLayerData(filter, setup.colours.sprite_prefilters[prefilterName], true);

		return filter;
	}

	static getTanValues() {
		const tanValByName = {
			body: 0,
			breasts: -0.01,
			penis: -0.01,
			swimshorts: -0.01,
			swimsuitTop: -0.01,
			swimsuitBottom: -0.01,
			bikiniTop: -0.01,
			bikiniBottom: -0.01,
			/* No sprites yet? */
			tshirt: -0.01,
		};
		for (let i = 0; i < setup.skinColor.tanLoc.length; i++) {
			tanValByName[setup.skinColor.tanLoc[i]] = V.skinColor.tanValues[i] / 100;
		}
		return tanValByName;
	}

	/** @returns {string} */
	static getHairSideType() {
		const style = setup.hairstyles.sides.find(hs => hs.variable === V.hairtype);
		const isAlt = style.alt_head_type?.includes(setup.clothes.head[clothesIndex("head", V.worn.head)].head_type);
		return isAlt ? style.alt : V.hairtype;
	}

	/** @returns {string} */
	static getHairFringeType() {
		const style = setup.hairstyles.fringe.find(hs => hs.variable === V.hairtype);
		const isAlt = style.alt_head_type?.includes(setup.clothes.head[clothesIndex("head", V.worn.head)].head_type);
		return isAlt ? style.alt : V.fringetype;
	}

	/**
	 * @param {string} frontPosition
	 * @param {string} backPosition
	 * @param {ClothedSlots} slot
	 * @param {ClothesItem} defaults
	 * @returns {PositionStates?}
	 */
	static getPositionStates(frontPosition, backPosition, slot, defaults) {
		if (!["lower", "under_lower", "over_lower", "legs", "feet"].includes(slot)) {
			return null;
		}
		if (["lower", "under_lower", "over_lower"].includes(slot)) {
			if (defaults.skirt === 1 && frontPosition === "footjob") {
				frontPosition = "up";
			}
			if (backPosition === "footjob") {
				backPosition = "up";
			}
		}
		return {
			front: frontPosition,
			back: backPosition,
		};
	}

	/**
	 * @param {ClothedSlots} slot
	 * @returns {ClothesItem}
	 */
	static getClothingBySlot(slot) {
		const active = V.worn[slot];
		const defaults = setup.clothes[slot][active.index];
		return Object.assign({}, defaults, active);
	}

	/**
	 * @param {ClothedSlots} slot
	 * @returns {number}
	 */
	static getAlpha(slot) {
		// Wetness
		let alpha = 1;
		const stage = V[slot + "wetstage"];
		if (typeof stage === "number") {
			alpha = Math.clamp(1 - stage / 4, 0, 1);
		}
		return alpha;
	}

	/**
	 * @param {ClothedSlots} slot
	 * @param {ClothesItem} defaults
	 * @returns {boolean}
	 */
	static getAccessoryState(slot, defaults) {
		const source = this.getSourceClothing(slot, defaults);
		if (source.combatAccessoryOverride !== undefined) {
			return !!source.combatAccessoryOverride;
		}
		return source.accessory !== 0;
	}

	/**
	 * If combatImg is used to override the sprite images, this function aims to follow the redirects until
	 * reaching the clothing item that correctly matches the sprite configuration.
	 *
	 * For example, our current item uses accessory layers, but uses a redirected sprite key which doesn't use accessory layers,
	 * we want to use the accessory configuration of the redirected item, otherwise the renderer will try to display -acc files.
	 *
	 * @param {ClothedSlots} slot
	 * @param {ClothesItem} item
	 * @param {string[]} failsafe
	 * @returns {ClothesItem}
	 */
	static getSourceClothing(slot, item, failsafe = []) {
		// Check to ensure no loops
		if (failsafe.includes(item.variable)) {
			console.error("getSourceClothing ran into a potential infinite loop:", item.variable, failsafe);
			return item;
		}
		failsafe.push(item.variable);
		// Main code
		if (!item.combatImg) {
			return item;
		}
		// Check combatImg's redirect for a possible clothing item:
		const source = setup.clothes[slot]?.find(c => c.variable === item.combatImg);
		if (source == null) {
			return item;
		}
		// If this redirect item has combatImg, we'll want to look again:
		if (source.combatImg) {
			return this.getSourceClothing(slot, source, failsafe);
		}
		return source;
	}
}
window.CombatRenderer = CombatRenderer;
