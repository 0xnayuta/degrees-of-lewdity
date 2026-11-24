// @ts-check

/**
 * The other pieces of an outfit in the wardrobe, such as a dress's skirt or a hoodie's hood. Separated and broken pieces are left out.
 *
 * @param {ClothesItem} item the outfit's main piece
 * @returns {ClothesItem[]}
 */
function getOutfitPieces(item) {
	const pieces = [];
	if (!item.outfitPrimary) return pieces;
	const wardrobe = selectWardrobe();
	for (const pieceSlot of setup.clothingLayer.all) {
		const pieceName = item.outfitPrimary[pieceSlot];
		if (!pieceName || pieceName === "broken" || pieceName === "split") continue;
		const piece = wardrobe[pieceSlot].find(candidate => isOutfitPieceMatch(item, candidate, pieceName));
		if (piece) pieces.push(piece);
	}
	return pieces;
}
window.getOutfitPieces = getOutfitPieces;

/**
 * Whether a wardrobe item is one of the other pieces of the given outfit.
 *
 * @param {ClothesItem} item the outfit's main piece
 * @param {ClothesItem} piece a candidate from the wardrobe
 * @param {string} pieceName the name the main piece expects in that slot
 * @returns {boolean}
 */
function isOutfitPieceMatch(item, piece, pieceName) {
	if (piece.name !== pieceName) return false;
	if (!piece.outfitSecondary || piece.outfitSecondary[1] !== item.name) return false;
	if (item.colour !== piece.colour) return false;
	if (piece.accessory !== 0 && item.accessory_colour !== piece.accessory_colour) return false;
	if (piece.pattern && item.pattern && item.pattern !== piece.pattern) return false;
	if (piece.colour === "custom" && (item.colourCustom === undefined || item.colourCustom !== piece.colourCustom)) return false;
	if (
		piece.accessory !== 0 &&
		piece.accessory_colour === "custom" &&
		(item.accessory_colourCustom === undefined || item.accessory_colourCustom !== piece.accessory_colourCustom)
	)
		return false;
	return true;
}

/**
 * Where an item is in its slot of the wardrobe. Throws when it isn't there, because removing a missing position would take out the slot's last item instead.
 *
 * @param {ClothesItem} item
 * @returns {number}
 */
function getWardrobeItemIndex(item) {
	const index = selectWardrobe()[item.slot].indexOf(item);
	if (index === -1) throw new Error(`The ${item.name} isn't in the wardrobe at $wardrobe_location "${V.wardrobe_location}".`);
	return index;
}

/**
 * Takes an item out of the wardrobe.
 *
 * @param {ClothesItem} item
 */
function removeFromWardrobe(item) {
	selectWardrobe()[item.slot].deleteAt(getWardrobeItemIndex(item));
}
window.removeFromWardrobe = removeFromWardrobe;

/**
 * Discards items and their other pieces from the wardrobe. Each one is temporarily saved so Undo can put it back where it was.
 *
 * @param {ClothesItem[]} items
 * @returns {WardrobeDiscardUndo}
 */
function discardWardrobeItems(items) {
	/** @type {WardrobeDiscardUndo} */
	const undo = { entries: [] };
	for (const item of items) {
		for (const discarded of [item, ...getOutfitPieces(item)]) {
			const index = getWardrobeItemIndex(discarded);
			undo.entries.push({ index, item: discarded });
			selectWardrobe()[discarded.slot].deleteAt(index);
		}
	}
	return undo;
}
window.discardWardrobeItems = discardWardrobeItems;

/**
 * Puts discarded items back where they were in the wardrobe.
 *
 * @param {WardrobeDiscardUndo} undo
 */
function undoWardrobeDiscard(undo) {
	const wardrobe = selectWardrobe();
	for (const entry of [...undo.entries].reverse()) wardrobe[entry.item.slot].splice(entry.index, 0, entry.item);
}
window.undoWardrobeDiscard = undoWardrobeDiscard;

/**
 * Once Avery is gone, the mansion wardrobe is called a storage unit.
 *
 * @param {string} location a key of $wardrobes
 * @returns {string}
 */
function getWardrobeName(location) {
	if (location === "avery_mansion" && ["kicked", "fallen"].includes(V.avery_fate)) return "Storage Unit";
	return V.wardrobes[location].name;
}
window.getWardrobeName = getWardrobeName;

/**
 * The wardrobes this one can send clothes to. Empty unless multiple wardrobes are on.
 *
 * @returns {Object<string, string>}
 */
function getWardrobeTransferTargets() {
	/** @type {Object<string, string>} */
	const transferTargets = {};
	const { shopReturn, ...wardrobes } = V.wardrobes;
	if (!V.settings.multipleWardrobes || !wardrobes[V.wardrobe_location].transfer) return transferTargets;
	if (Object.values(wardrobes).filter(wardrobe => wardrobe.unlocked && wardrobe.shopSend).length < 2) return transferTargets;
	for (const [wardrobeKey, wardrobe] of Object.entries(wardrobes)) {
		if (!wardrobe.unlocked || !wardrobe.shopSend || wardrobeKey === V.wardrobe_location) continue;
		transferTargets[getWardrobeName(wardrobeKey)] = wardrobeKey;
	}
	return transferTargets;
}
window.getWardrobeTransferTargets = getWardrobeTransferTargets;

/**
 * Whether the wardrobe to send to has room for an item and its other pieces.
 *
 * @param {ClothesItem} item
 * @param {string} target the wardrobe to send to, as a key of $wardrobes
 * @returns {boolean}
 */
function hasWardrobeRoomFor(item, target) {
	const targetWardrobe = selectWardrobe(target, "return");
	return [item, ...getOutfitPieces(item)].every(piece => targetWardrobe[piece.slot].length <= targetWardrobe.space);
}
window.hasWardrobeRoomFor = hasWardrobeRoomFor;

/**
 * Moves an item and its other pieces to another wardrobe.
 *
 * @param {ClothesItem} item
 * @param {string} target the wardrobe to send to, as a key of $wardrobes
 */
function sendWardrobeItem(item, target) {
	for (const sent of [item, ...getOutfitPieces(item)]) transferClothing(sent.slot, getWardrobeItemIndex(sent), target);
}
window.sendWardrobeItem = sendWardrobeItem;

const wardrobeRepairMinutesPerPiece = 5;
const wardrobeSeparateOutfitMinutes = 10;
window.wardrobeSeparateOutfitMinutes = wardrobeSeparateOutfitMinutes;

/**
 * The time to repair an item and its other pieces. Returns 0 when none of them are damaged.
 *
 * @param {ClothesItem} item
 * @returns {number} minutes
 */
function getWardrobeRepairMinutes(item) {
	const pieces = [item, ...getOutfitPieces(item)];
	return pieces.some(piece => piece.integrity < clothingData(piece.slot, piece, "integrity_max")) ? wardrobeRepairMinutesPerPiece * pieces.length : 0;
}
window.getWardrobeRepairMinutes = getWardrobeRepairMinutes;

/**
 * The time to repair every ticked item. Undamaged items add nothing.
 *
 * @returns {number} minutes
 */
function getWardrobeTickedRepairMinutes() {
	return getWardrobeTickedItems().reduce((minutes, item) => minutes + getWardrobeRepairMinutes(item), 0);
}
window.getWardrobeTickedRepairMinutes = getWardrobeTickedRepairMinutes;

/**
 * Restores an item and its other pieces to full integrity.
 *
 * @param {ClothesItem} item
 */
function repairWardrobeItem(item) {
	for (const piece of [item, ...getOutfitPieces(item)]) piece.integrity = clothingData(piece.slot, piece, "integrity_max");
}
window.repairWardrobeItem = repairWardrobeItem;

/**
 * Finds the cursed item that stops the PC taking off what they wear in this slot. Gives this slot if its item is cursed, or the slot of a cursed piece of the same outfit. Undefined when nothing is cursed.
 *
 * @param {ClothedSlots} slot
 * @returns {ClothedSlots | undefined}
 */
function getCursedWornSlot(slot) {
	if (V.worn[slot].cursed === 1) return slot;
	if (!V.worn[slot].outfitPrimary) return undefined;
	return setup.clothingLayer.all.find(pieceSlot => pieceSlot in V.worn[slot].outfitPrimary && V.worn[pieceSlot].cursed === 1);
}
window.getCursedWornSlot = getCursedWornSlot;

/**
 * Finds what's stopping the PC from putting on an item. Gives the first slot the item or its other pieces need that a worn cursed item keeps full. Undefined when nothing is cursed.
 *
 * @param {ClothesItem} item
 * @returns {ClothedSlots | undefined}
 */
function getWornSlotBlockedByCurse(item) {
	return [item.slot, ...getOutfitPieces(item).map(piece => piece.slot)].find(slot => getCursedWornSlot(slot));
}
window.getWornSlotBlockedByCurse = getWornSlotBlockedByCurse;
