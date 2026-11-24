// @ts-check

/**
 * The clothing sets that show in a wardrobe. Leaves out sets saved as unique to another wardrobe.
 *
 * @param {WardrobeLocation} location
 * @returns {number[]} indexes in $outfit
 */
function getClothingSetIndexesInWardrobe(location) {
	const indexes = [];
	V.outfit.forEach((clothingSet, index) => {
		if (clothingSet.location === undefined || clothingSet.location === location) indexes.push(index);
	});
	return indexes;
}
window.getClothingSetIndexesInWardrobe = getClothingSetIndexesInWardrobe;

/**
 * Removes symbols and cuts the name to 30 characters.
 *
 * @param {string} name
 * @returns {string}
 */
function sanitiseClothingSetName(name) {
	return name.replace(/[^a-zA-Z一-龥 0-9.!()]+/g, "").slice(0, 30);
}
window.sanitiseClothingSetName = sanitiseClothingSetName;

/**
 * The name a clothing set is saved under. A name left blank or as "Custom" becomes "Custom" and the set's position.
 *
 * @param {string} name as typed
 * @param {number} index the set's position in $outfit
 * @returns {string}
 */
function getClothingSetNameFromInput(name, index) {
	const cleanName = sanitiseClothingSetName(name);
	return cleanName === "" || cleanName === "Custom" ? `Custom ${index}` : cleanName;
}

/**
 * The name of the clothing item the PC is wearing in each slot.
 *
 * @returns {ClothingSetItems}
 */
function getWornClothingSetItems() {
	return {
		over_upper: V.worn.over_upper.name,
		over_lower: V.worn.over_lower.name,
		upper: V.worn.upper.name,
		lower: V.worn.lower.name,
		under_upper: V.worn.under_upper.name,
		under_lower: V.worn.under_lower.name,
		over_head: V.worn.over_head.name,
		head: V.worn.head.name,
		face: V.worn.face.name,
		neck: V.worn.neck.name,
		hands: V.worn.hands.name,
		handheld: V.worn.handheld.name,
		legs: V.worn.legs.name,
		feet: V.worn.feet.name,
		genitals: V.worn.genitals.name,
	};
}

/**
 * The colours and patterns of what the PC is wearing, as a clothing set stores them.
 *
 * @returns {ClothingSetColours}
 */
function getWornClothingSetColours() {
	/** @type {ClothingSetColours} */
	const colours = {};
	for (const slot of setup.clothingLayer.all) {
		colours[slot] = [V.worn[slot].colour, V.worn[slot].accessory_colour];
		if (V.worn[slot].pattern !== undefined) colours[slot].push(V.worn[slot].pattern);
		// Saved clothing sets keep a custom colour under the slot's name followed by "custom", such as "uppercustom".
		if (V.worn[slot].colour === "custom" || V.worn[slot].accessory_colour === "custom")
			colours[`${slot}custom`] = [V.worn[slot].colourCustom, V.worn[slot].accessory_colourCustom];
	}
	return colours;
}

/**
 * Saves the alternate positions and features of what the PC is wearing into a clothing set, or clears them when nothing is in an alternate position.
 *
 * @param {ClothingSet} clothingSet
 */
function setClothingSetPositionsToWorn(clothingSet) {
	/** @type {ClothingSetPositions} */
	const positions = {};
	for (const slot of setup.clothingLayer.all) {
		if (V.worn[slot].altposition) positions[slot] = V.worn[slot].altposition;
		if (V.worn[slot].altsleeve) positions.sleeves = V.worn[slot].altsleeve;
	}
	if (Object.keys(positions).length > 0) clothingSet.positions = positions;
	else delete clothingSet.positions;
}

/**
 * A new clothing set of what the PC is wearing.
 *
 * @param {string} name as typed
 * @param {ClothingSetType} type
 * @param {boolean} saveColours whether the set remembers colours and patterns
 * @param {WardrobeLocation | undefined} location the only wardrobe the set shows in, or undefined for every wardrobe
 * @param {string | undefined} hairStyle the name of a saved hairstyle to switch to
 * @param {string | undefined} facevariant the demeanour to switch to
 * @param {"smile" | "neutral" | undefined} defaultSidebarMouth
 * @returns {ClothingSet}
 */
function createClothingSet(name, type, saveColours, location, hairStyle, facevariant, defaultSidebarMouth) {
	/** @type {ClothingSet} */
	const clothingSet = {
		...getWornClothingSetItems(),
		name: getClothingSetNameFromInput(name, V.outfit.length),
		type: [type],
		colors: saveColours ? getWornClothingSetColours() : false,
		location,
		hairStyle,
		facevariant,
		defaultSidebarMouth,
	};
	setClothingSetPositionsToWorn(clothingSet);
	return clothingSet;
}
window.createClothingSet = createClothingSet;

/**
 * Adds a clothing set to the end of $outfit and lists it in the wardrobe's Clothing set filter.
 *
 * @param {ClothingSet} clothingSet
 */
function addClothingSet(clothingSet) {
	V.outfit.push(clothingSet);
	redrawWardrobeClothingSetDropdown();
}
window.addClothingSet = addClothingSet;

/**
 * Renames a clothing set and shows the new name in the wardrobe's Clothing set filter.
 *
 * @param {number} index
 * @param {string} name as typed
 */
function renameClothingSet(index, name) {
	V.outfit[index].name = getClothingSetNameFromInput(name, index);
	redrawWardrobeClothingSetDropdown();
}
window.renameClothingSet = renameClothingSet;

/**
 * Replaces a set's clothing items and positions with what the PC is wearing. A set saved with its colours also takes the worn colours and patterns.
 *
 * @param {number} index
 */
function overwriteClothingSet(index) {
	Object.assign(V.outfit[index], getWornClothingSetItems());
	if (V.outfit[index].colors) V.outfit[index].colors = getWornClothingSetColours();
	setClothingSetPositionsToWorn(V.outfit[index]);
	if (getWardrobeView().clothingSetIndex === index) redrawWardrobeItems();
}
window.overwriteClothingSet = overwriteClothingSet;

/**
 * Moves a clothing set to another position in $outfit.
 *
 * @param {number} fromIndex
 * @param {number} toIndex
 */
function moveClothingSet(fromIndex, toIndex) {
	const [clothingSet] = V.outfit.splice(fromIndex, 1);
	V.outfit.splice(toIndex, 0, clothingSet);
	resetWardrobeClothingSetFilter();
}
window.moveClothingSet = moveClothingSet;

/**
 * Deletes a clothing set. Returns the set and where it was, so the Undo banner can bring it back.
 *
 * @param {number} index
 * @returns {ClothingSetDeleteUndo}
 */
function deleteClothingSet(index) {
	const clothingSet = V.outfit.splice(index, 1)[0];
	resetWardrobeClothingSetFilter();
	return { index, clothingSet };
}
window.deleteClothingSet = deleteClothingSet;

/**
 * Puts a deleted set back where it was.
 *
 * @param {ClothingSetDeleteUndo} undo
 */
function undoClothingSetDelete(undo) {
	V.outfit.splice(undo.index, 0, undo.clothingSet);
	resetWardrobeClothingSetFilter();
}
window.undoClothingSetDelete = undoClothingSetDelete;

/**
 * Opens a clothing set's menu.
 *
 * @param {number} index
 */
function openClothingSetMenu(index) {
	const view = getWardrobeView();
	view.openClothingSetIndex = index;
	view.isRenamingClothingSet = false;
}
window.openClothingSetMenu = openClothingSetMenu;

/** Closes the clothing set menu. */
function closeClothingSetMenu() {
	const view = getWardrobeView();
	view.openClothingSetIndex = null;
	view.isRenamingClothingSet = false;
}
window.closeClothingSetMenu = closeClothingSetMenu;

/**
 * Opens a clothing set's menu, or closes it if it's already open. Opening one set's menu closes any other.
 *
 * @param {number} index
 */
function toggleClothingSetMenu(index) {
	if (getWardrobeView().openClothingSetIndex === index) closeClothingSetMenu();
	else openClothingSetMenu(index);
}
window.toggleClothingSetMenu = toggleClothingSetMenu;

/** Swaps the name in the open clothing set menu for a text box to rename the set. */
function startRenamingClothingSet() {
	getWardrobeView().isRenamingClothingSet = true;
}
window.startRenamingClothingSet = startRenamingClothingSet;

/**
 * Where a dragged clothing set ends up in $outfit when it's dropped beside another set.
 *
 * @param {number} from the dragged set's index
 * @param {number} target the index of the set it's dropped beside
 * @param {boolean} isAfter whether it's dropped after the target rather than before
 * @returns {number}
 */
function getClothingSetDropIndex(from, target, isAfter) {
	const insertAt = isAfter ? target + 1 : target;
	return from < insertAt ? insertAt - 1 : insertAt;
}

/**
 * Lets clothing sets be dragged by their handle into a new order. The listeners sit on the document, so dragging keeps working after the set grid is redrawn.
 */
function bindClothingSetDrag() {
	/** @type {{from: number, to: number | null} | null} */
	let drag = null;
	function clearDragClasses() {
		$("#clothingSetGrid .clothingSetCell").removeClass("dragging dropBefore dropAfter");
	}
	$(document)
		.on("pointerdown", "#clothingSetGrid .clothingSetDragHandle", event => {
			if (event.button !== 0) return;
			event.preventDefault();
			event.currentTarget.setPointerCapture(event.pointerId);
			const cell = event.currentTarget.closest(".clothingSetCell");
			drag = { from: Number(cell.dataset.index), to: null };
			$(cell).addClass("dragging");
		})
		.on("pointermove", "#clothingSetGrid .clothingSetDragHandle", event => {
			if (!drag) return;
			if (event.clientY < 40) window.scrollBy(0, -10);
			else if (event.clientY > window.innerHeight - 40) window.scrollBy(0, 10);
			const target = document.elementFromPoint(event.clientX, event.clientY)?.closest("#clothingSetGrid .clothingSetCell[data-index]");
			$("#clothingSetGrid .clothingSetCell").removeClass("dropBefore dropAfter");
			drag.to = null;
			if (!target || target.classList.contains("dragging")) return;
			const bounds = target.getBoundingClientRect();
			const isAfter = event.clientX > bounds.left + bounds.width / 2;
			const to = getClothingSetDropIndex(drag.from, Number(target.getAttribute("data-index")), isAfter);
			if (to === drag.from) return;
			drag.to = to;
			$(target).addClass(isAfter ? "dropAfter" : "dropBefore");
		})
		.on("pointerup", "#clothingSetGrid .clothingSetDragHandle", () => {
			if (!drag) return;
			const { from, to } = drag;
			drag = null;
			clearDragClasses();
			if (to === null) return;
			moveClothingSet(from, to);
			openClothingSetMenu(to);
			wikifier("clothingSetGridRefresh");
		})
		.on("pointercancel", "#clothingSetGrid .clothingSetDragHandle", () => {
			drag = null;
			clearDragClasses();
		});
}

bindClothingSetDrag();
