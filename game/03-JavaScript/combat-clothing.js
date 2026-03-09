class ClothingLayer {
	constructor(slot) {
		this.slot = slot;
	}

	/* live reference to the worn item */
	get item() {
		return V.worn[this.slot];
	}

	/* properties */
	get name() {
		return this.item.name;
	}
	get integrity() {
		return this.item.integrity;
	}
	get state() {
		return this.item.state;
	}
	get type() {
		return this.item.type;
	}

	/* boolean checks */
	get isNaked() {
		return this.item.type.includes("naked");
	}
	get isCursed() {
		return !!this.item.cursed;
	}
	get isWorn() {
		return this.item.state === "waist";
	}
	get isSkirt() {
		return setup.clothes[this.slot][clothesIndex(this.slot, this.item)].skirt === 1;
	}

	/* exposure checks */
	exposes(type) {
		return !!this.item[type + "_exposed"];
	}

	/* mutations */
	damage(amount) {
		this.item.integrity -= amount;
	}
	strip() {
		this.item.state = "legs";
	}
}
window.ClothingLayer = ClothingLayer;

/* Returns the outermost clothing layer covering a body area, or null if exposed.
 * @param {string} region "lower" or "upper"
 * @param {string} [exposureType] "anus" or "vagina" (ignored for upper)
 * @returns {ClothingLayer|null}
 */
function combatClothingLayer(region, exposureType) {
	const worn = V.worn;
	if (region === "upper") {
		/* upper body checks lower slot state for waist — matches existing combat-dildospank behavior */
		const layers = [
			{ nameSlot: "over_upper", stateSlot: "over_lower" },
			{ nameSlot: "upper", stateSlot: "lower" },
			{ nameSlot: "under_upper", stateSlot: "under_lower" },
		];
		for (const layer of layers) {
			if (worn[layer.nameSlot].name !== "naked" && worn[layer.stateSlot].state === "waist") {
				return new ClothingLayer(layer.nameSlot);
			}
		}
		return null;
	}
	/* lower body: over_lower → lower → under_lower */
	const exposedKey = exposureType + "_exposed";
	const layers = ["over_lower", "lower", "under_lower"];
	for (const slot of layers) {
		const item = worn[slot];
		if (item.name !== "naked" && item.state === "waist" && !item[exposedKey]) {
			return new ClothingLayer(slot);
		}
	}
	return null;
}
window.combatClothingLayer = combatClothingLayer;
