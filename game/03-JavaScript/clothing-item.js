/* Wrapper for an article of clothing.
 * Bridges V.worn and setup.clothes
 * Interactions regarding clothing should use this object instead of direct access.
 */
class ClothingItem {
	constructor(slot) {
		this.slot = slot;
	}

	get item() {
		return V.worn[this.slot];
	}

	get template() {
		return setup.clothes[this.slot][clothesIndex(this.slot, this.item)];
	}

	/* runtime */
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
	get colour() {
		return this.item.colour;
	}

	/* static */
	get isSkirt() {
		return this.template.skirt === 1;
	}
	get isShort() {
		return this.template.short === 1;
	}
	get isOnePiece() {
		return this.template.one_piece === 1;
	}
	get integrityMax() {
		return this.template.integrity_max;
	}
	get fabricStrength() {
		return this.template.fabric_strength;
	}
	get warmth() {
		return this.template.warmth;
	}
	get reveal() {
		return this.template.reveal;
	}
	get cost() {
		return this.template.cost;
	}
	get description() {
		return this.template.description;
	}

	/* boolean */
	get isNaked() {
		return this.item.type.includes("naked");
	}
	get isCursed() {
		return !!this.item.cursed;
	}
	get isWorn() {
		return this.item.state === "waist";
	}

	/* exposure */
	exposes(type) {
		return !!this.item[type + "_exposed"];
	}

	/* mutations */
	damage(amount) {
		this.item.integrity -= amount;
	}
}
window.ClothingItem = ClothingItem;

/* General-purpose factory — usable anywhere in twee.
 * @param {string} slot e.g. "lower", "upper", "under_lower"
 * @returns {ClothingItem}
 */
function clothingItem(slot) {
	return new ClothingItem(slot);
}
window.clothingItem = clothingItem;

/* Returns the outermost clothing layer covering a body area, or null if exposed.
 * @param {string} region "lower" or "upper"
 * @param {string} [exposureType] "anus" or "vagina" (ignored for upper)
 * @returns {ClothingItem|null}
 */
function combatClothingLayer(region, exposureType) {
	const worn = V.worn;
	if (region === "upper") {
		const layers = [
			{ nameSlot: "over_upper", stateSlot: "over_lower" },
			{ nameSlot: "upper", stateSlot: "lower" },
			{ nameSlot: "under_upper", stateSlot: "under_lower" },
		];
		for (const layer of layers) {
			if (worn[layer.nameSlot].name !== "naked" && worn[layer.stateSlot].state === "waist") {
				return new ClothingItem(layer.nameSlot);
			}
		}
		return null;
	}

	const exposedKey = exposureType + "_exposed";
	const layers = ["over_lower", "lower", "under_lower"];
	for (const slot of layers) {
		const item = worn[slot];
		if (item.name !== "naked" && item.state === "waist" && !item[exposedKey]) {
			return new ClothingItem(slot);
		}
	}
	return null;
}
window.combatClothingLayer = combatClothingLayer;
