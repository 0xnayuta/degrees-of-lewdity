// @ts-check

/**
 * The wardrobe's search, filters, page, open menus and ticked items.
 *
 * @returns {WardrobeView}
 */
function getWardrobeView() {
	if (!T.wardrobeView) {
		T.wardrobeView = {
			...getEmptyClothingFilters(),
			isPanelOpen: false,
			page: 0,
			openRow: null,
			openClothingSetIndex: null,
			isRenamingClothingSet: false,
			isSelectingMultiple: false,
			ticked: [],
		};
	}
	return T.wardrobeView;
}
window.getWardrobeView = getWardrobeView;

/**
 * The wardrobe's tabs, grouped like the clothing shop's.
 *
 * @type {WardrobeTab[][]}
 */
const wardrobeTabGroupList = [
	[{ id: "all", label: "All", icon: "all-alt" }],
	[
		{ id: "over_head", label: "Over Head", isDebugOnly: true },
		{ id: "over_upper", label: "Over Upper", icon: "over-outfit", isDebugOnly: true },
		{ id: "over_lower", label: "Over Lower", isDebugOnly: true },
	],
	[
		{ id: "upper", label: "Upper", icon: "upper" },
		{ id: "lower", label: "Lower", icon: "lower" },
	],
	[
		{ id: "under_upper", label: "Under Upper", icon: "under-upper" },
		{ id: "under_lower", label: "Under Lower", icon: "under-lower" },
	],
	[
		{ id: "head", label: "Head", icon: "head" },
		{ id: "face", label: "Face", icon: "face" },
		{ id: "neck", label: "Neck", icon: "neck" },
	],
	[
		{ id: "handheld", label: "Handheld", icon: "handheld" },
		{ id: "hands", label: "Hands", icon: "hand" },
		{ id: "legs", label: "Legs", icon: "legs" },
		{ id: "feet", label: "Feet", icon: "feet" },
	],
];

/**
 * The tabs in their groups. The over tabs only show in debug mode.
 *
 * @returns {WardrobeTab[][]}
 */
function getWardrobeTabGroups() {
	return wardrobeTabGroupList.map(group => group.filter(tab => !tab.isDebugOnly || V.debug)).filter(group => group.length);
}
window.getWardrobeTabGroups = getWardrobeTabGroups;

/**
 * The slots a tab lists. The All tab lists the slot of every other tab.
 *
 * @param {ClothedSlots | "all"} tab
 * @returns {ClothedSlots[]}
 */
function getWardrobeTabSlots(tab) {
	if (tab !== "all") return [tab];
	return getWardrobeTabGroups()
		.flat()
		.map(wardrobeTab => wardrobeTab.id)
		.filter(id => id !== "all");
}

/**
 * An outfit's other pieces are listed with its main piece, unless they have been separated or broken.
 *
 * @param {ClothesItem} item
 * @returns {boolean}
 */
function isWardrobeItemListed(item) {
	return item.outfitSecondary === undefined || ["broken", "split"].includes(item.outfitSecondary[1]);
}
window.isWardrobeItemListed = isWardrobeItemListed;

/**
 * The clothing items in these slots of the wardrobe, as entries for the list.
 *
 * @param {ClothedSlots[]} slots
 * @returns {WardrobeEntry[]}
 */
function getWardrobeEntries(slots) {
	const wardrobe = selectWardrobe();
	/** @type {WardrobeEntry[]} */
	const entries = [];
	for (const slot of slots) {
		wardrobe[slot].forEach((item, index) => {
			if (!isWardrobeItemListed(item)) return;
			entries.push({
				slot,
				index,
				name: item.name,
				patterns: item.pattern ? [item.pattern] : [],
				colours: item.colour ? [item.colour] : [],
				traits: item.type,
				reveal: item.reveal,
				warmth: getTrueWarmth(item),
				gender: item.gender,
				integrityRatio: item.integrity / clothingData(slot, item, "integrity_max"),
				isBroken: Object.values(item.outfitPrimary ?? {}).includes("broken") || item.outfitSecondary?.[1] === "broken",
				outfitStatus: item.one_piece,
				isFavourite: !!item.isFavourite,
			});
		});
	}
	return entries;
}

/**
 * The filters in the wardrobe's Filters panel
 *
 * @type {ClothingFilterName[]}
 */
const wardrobePanelFilters = ["colours", "traits", "reveal", "gender", "warmth"];
window.wardrobePanelFilters = wardrobePanelFilters;

/**
 * The checkboxes in the Filters panel. Colour and Traits only show for what the items on this tab have.
 *
 * @returns {{colours: ClothingFilterOption[], traits: ClothingFilterOption[], gender: ClothingFilterOption[]}}
 */
function getWardrobeFilterOptions() {
	const view = getWardrobeView();
	const entries = getWardrobeEntries(getWardrobeTabSlots(V.lastWardrobeSlot));
	const colours = [...new Set([...entries.flatMap(entry => entry.colours), ...view.colours])].sort();
	const traits = [...new Set([...entries.flatMap(entry => entry.traits), ...view.traits])].sort();
	return {
		colours: colours.map(colour => ({ value: colour, label: colour.toUpperFirst() })),
		traits: getClothingTraitOptions(traits),
		gender: clothingGenderOptions,
	};
}
window.getWardrobeFilterOptions = getWardrobeFilterOptions;

const wardrobeItemsPerPageOptions = [10, 20, 30, 40, 50];
window.wardrobeItemsPerPageOptions = wardrobeItemsPerPageOptions;

/**
 * Every sort the wardrobe offers. wardrobeSearchRow leaves out Outfit status on tabs that can't hold outfits.
 *
 * @type {WardrobeSortProperty[]}
 */
const wardrobeSortProperties = ["none", "name", "colour", "reveal", "integrity", "warmth", "outfit"];
window.wardrobeSortProperties = wardrobeSortProperties;

/**
 * Checks a wardrobe sort before it is remembered. Since it can come from a setting import or from an old save, it can be missing.
 *
 * @param {WardrobeSort | undefined} sort
 * @returns {boolean}
 */
function isValidWardrobeSort(sort) {
	if (!sort) return false;
	return wardrobeSortProperties.includes(sort.property) && typeof sort.isDescending === "boolean";
}
window.isValidWardrobeSort = isValidWardrobeSort;

/**
 * The order of the Outfit status sort.
 *
 * @type {WardrobeEntry["outfitStatus"][]}
 */
const outfitStatusOrder = [1, 0, "split", "broken"];

/**
 * Where an entry falls in the Outfit status sort. Intact outfits come first, and items with no outfit status come last.
 *
 * @param {WardrobeEntry} entry
 * @returns {number}
 */
function getOutfitStatusRank(entry) {
	const rank = outfitStatusOrder.indexOf(entry.outfitStatus);
	return rank === -1 ? outfitStatusOrder.length : rank;
}

/**
 * Ascending order for each wardrobe sort. Broken outfits come below every other item in Integrity.
 *
 * @type {WardrobeSortComparers}
 */
const wardrobeSortComparers = {
	name: (a, b) => a.name.localeCompare(b.name),
	colour: (a, b) => (a.colours[0] ?? "").localeCompare(b.colours[0] ?? ""),
	reveal: (a, b) => a.reveal - b.reveal,
	integrity: (a, b) => (a.isBroken ? -1 : a.integrityRatio) - (b.isBroken ? -1 : b.integrityRatio),
	warmth: (a, b) => a.warmth - b.warmth,
	outfit: (a, b) => getOutfitStatusRank(a) - getOutfitStatusRank(b),
};

/**
 * The items on the current page, after the search, filters and sort. Favourites come first.
 *
 * @returns {{items: WardrobeEntry[], page: number, pageCount: number, shown: number, total: number}}
 */
function getWardrobePageContents() {
	const view = getWardrobeView();
	const entries = getWardrobeEntries(getWardrobeTabSlots(V.lastWardrobeSlot));
	const visible = entries.filter(entry => isClothingEntryMatch(entry, view));
	if (V.wardrobeDefaults.sort.property !== "none") {
		const ascending = wardrobeSortComparers[V.wardrobeDefaults.sort.property];
		visible.sort(V.wardrobeDefaults.sort.isDescending ? (a, b) => ascending(b, a) : ascending);
	}
	const favouritesFirst = [...visible.filter(entry => entry.isFavourite), ...visible.filter(entry => !entry.isFavourite)];
	const bounds = getListPageBounds(favouritesFirst.length, view.page, V.wardrobeDefaults.itemsPerPage);
	return {
		items: favouritesFirst.slice(bounds.start, bounds.end),
		page: bounds.page,
		pageCount: bounds.pageCount,
		shown: visible.length,
		total: entries.length,
	};
}
window.getWardrobePageContents = getWardrobePageContents;

/** Redraws the wardrobe's list and pager together, so the page number always matches. */
function redrawWardrobeItems() {
	$("#wardrobeListBar").empty().wiki("<<wardrobeListBar>>");
	$("#wardrobePage").empty().wiki("<<wardrobePage>>");
}
window.redrawWardrobeItems = redrawWardrobeItems;

/**
 * Changes which page of the wardrobe's list is shown.
 *
 * @param {number} page counted from 0
 */
function setWardrobePage(page) {
	getWardrobeView().page = page;
}
window.setWardrobePage = setWardrobePage;

/** Any change to the search, filters, sort or page size starts again from the first page with nothing ticked. */
function onWardrobeViewChanged() {
	resetWardrobeRows();
	setWardrobePage(0);
	redrawWardrobeSelectControls();
	redrawWardrobeItems();
}

/**
 * Whether a row is the one at this slot and index.
 *
 * @param {WardrobeRow | null} row null when no item's menu is open
 * @param {ClothedSlots} slot
 * @param {number} index
 * @returns {boolean}
 */
function isSameWardrobeRow(row, slot, index) {
	return row !== null && row.slot === slot && row.index === index;
}
window.isSameWardrobeRow = isSameWardrobeRow;

/**
 * Whether the item at this slot and index is ticked.
 *
 * @param {ClothedSlots} slot
 * @param {number} index
 * @returns {boolean}
 */
function isWardrobeRowTicked(slot, index) {
	return getWardrobeView().ticked.some(row => isSameWardrobeRow(row, slot, index));
}
window.isWardrobeRowTicked = isWardrobeRowTicked;

/**
 * Opens an item's menu, or closes it if it's already open. Opening one item's menu closes any other.
 *
 * @param {ClothedSlots} slot
 * @param {number} index
 */
function toggleWardrobeItemMenu(slot, index) {
	const view = getWardrobeView();
	view.openRow = isSameWardrobeRow(view.openRow, slot, index) ? null : { slot, index };
	redrawWardrobeItems();
}
window.toggleWardrobeItemMenu = toggleWardrobeItemMenu;

/**
 * Marks an item as a favourite, or takes the mark off.
 *
 * @param {ClothesItem} item
 * @param {boolean} isFavourite
 */
function setWardrobeItemFavourite(item, isFavourite) {
	if (isFavourite) item.isFavourite = true;
	else delete item.isFavourite;
}

/**
 * Favourites an item, or unfavourites it when it already is one.
 *
 * @param {ClothesItem} item
 */
function toggleWardrobeItemFavourite(item) {
	setWardrobeItemFavourite(item, !item.isFavourite);
	redrawWardrobeItems();
}
window.toggleWardrobeItemFavourite = toggleWardrobeItemFavourite;

/**
 * Whether any items are ticked and every one is a favourite.
 *
 * @returns {boolean}
 */
function areWardrobeTickedItemsFavourite() {
	const tickedItems = getWardrobeTickedItems();
	return tickedItems.length > 0 && tickedItems.every(item => item.isFavourite);
}
window.areWardrobeTickedItemsFavourite = areWardrobeTickedItemsFavourite;

/** Favourites every ticked item, or unfavourites them all when they already are. */
function toggleWardrobeTickedFavourites() {
	const shouldFavourite = !areWardrobeTickedItemsFavourite();
	for (const item of getWardrobeTickedItems()) setWardrobeItemFavourite(item, shouldFavourite);
	redrawWardrobeSelectControls();
	redrawWardrobeItems();
}
window.toggleWardrobeTickedFavourites = toggleWardrobeTickedFavourites;

/** Redraws the Select multiple items link or actions for the ticked items while it is on. */
function redrawWardrobeSelectControls() {
	$("#wardrobeSelectControls").empty().wiki("<<wardrobeSelectControls>>");
}
window.redrawWardrobeSelectControls = redrawWardrobeSelectControls;

/**
 * Turns Select multiple items on or off.
 *
 * @param {boolean} isSelectingMultiple
 */
function setWardrobeSelectingMultiple(isSelectingMultiple) {
	getWardrobeView().isSelectingMultiple = isSelectingMultiple;
	resetWardrobeRows();
}
window.setWardrobeSelectingMultiple = setWardrobeSelectingMultiple;

/**
 * Ticks or unticks one item while Select multiple items is on.
 *
 * @param {ClothedSlots} slot
 * @param {number} index
 */
function toggleWardrobeTick(slot, index) {
	const view = getWardrobeView();
	const wasTicked = isWardrobeRowTicked(slot, index);
	view.ticked = wasTicked ? view.ticked.filter(row => !isSameWardrobeRow(row, slot, index)) : [...view.ticked, { slot, index }];
	$(`#wardrobeItems .wardrobeTick[data-slot="${slot}"][data-index="${index}"]`).prop("checked", !wasTicked);
	redrawWardrobeSelectControls();
}
window.toggleWardrobeTick = toggleWardrobeTick;

/** Closes the open item menu and unticks every item. */
function resetWardrobeRows() {
	const view = getWardrobeView();
	view.openRow = null;
	view.ticked = [];
}
window.resetWardrobeRows = resetWardrobeRows;

/**
 * The ticked clothing items.
 *
 * @returns {ClothesItem[]}
 */
function getWardrobeTickedItems() {
	const wardrobe = selectWardrobe();
	return getWardrobeView().ticked.map(row => wardrobe[row.slot][row.index]);
}
window.getWardrobeTickedItems = getWardrobeTickedItems;

/** Redraws the wardrobe's Clothing set filter, which lists every clothing set by name. */
function redrawWardrobeClothingSetDropdown() {
	$("#wardrobeClothingSetDropdown").empty().wiki("<<wardrobeClothingSetDropdown>>");
}
window.redrawWardrobeClothingSetDropdown = redrawWardrobeClothingSetDropdown;

/** Sets the Clothing set filter back to Any after sets move or one is deleted, since the chosen position may now hold another set. */
function resetWardrobeClothingSetFilter() {
	const view = getWardrobeView();
	const hadSet = view.clothingSetIndex !== null;
	view.clothingSetIndex = null;
	redrawWardrobeClothingSetDropdown();
	if (hadSet) onWardrobeViewChanged();
}
window.resetWardrobeClothingSetFilter = resetWardrobeClothingSetFilter;

/**
 * Shows or hides the wardrobe's Filters panel.
 *
 * @param {boolean} isOpen
 */
function setWardrobeFilterPanelOpen(isOpen) {
	getWardrobeView().isPanelOpen = isOpen;
	$("#wardrobeFilterPanel").toggleClass("hidden", !isOpen);
	$("#wardrobeFilterPanelButton").toggleClass("open", isOpen);
}

/** The Clear filters button. The sort is kept. */
function clearWardrobeFilters() {
	Object.assign(getWardrobeView(), getEmptyClothingFilters());
	$("#wardrobeSearchRow").empty().wiki("<<wardrobeSearchRow>>");
	onWardrobeViewChanged();
}

/** Waits for typing in the search bar to pause, so a word redraws the list once. */
const onWardrobeSearchInput = $.debounce(150, input => {
	if (!document.contains(input)) return;
	getWardrobeView().search = input.value;
	onWardrobeViewChanged();
});

$(document)
	.on("change", "#wardrobeItems .wardrobeTick", event => toggleWardrobeTick(event.target.dataset.slot, Number(event.target.dataset.index)))
	.on("input", "#wardrobeSearchInput", event => onWardrobeSearchInput(event.target))
	.on("change", "#wardrobeSortDropdown .clothingFilterOption", event => {
		if (event.target.dataset.sortPart === "descending") V.wardrobeDefaults.sort.isDescending = event.target.value === "true";
		else V.wardrobeDefaults.sort.property = event.target.value;
		$("#wardrobeSortDropdown .clothingFilterDropdownText").text(getClothingSortDropdownText(V.wardrobeDefaults.sort));
		keepClothingFilterMenuOnScreen(event.target.closest("#wardrobeSortDropdown"));
		onWardrobeViewChanged();
	})
	.on("change", "#wardrobeClothingSetDropdown .clothingFilterOption", event => {
		const view = getWardrobeView();
		view.clothingSetIndex = event.target.value === "" ? null : Number(event.target.value);
		$("#wardrobeClothingSetDropdown .clothingFilterDropdownText").text(getClothingSetDropdownText(view.clothingSetIndex));
		keepClothingFilterMenuOnScreen(event.target.closest("#wardrobeClothingSetDropdown"));
		onWardrobeViewChanged();
	})
	.on("change", "#wardrobeFilterPanel .clothingFilterOption", event => {
		const field = /** @type {"colours"|"traits"|"gender"} */ (event.target.closest(".clothingFilterSection").dataset.filter);
		const view = getWardrobeView();
		view[field] = event.target.checked ? [...view[field], event.target.value] : view[field].filter(value => value !== event.target.value);
		$("#wardrobeFilterPanelButton").text(getClothingFilterPanelButtonText(view, wardrobePanelFilters));
		onWardrobeViewChanged();
	})
	.on("change", "#wardrobeFilterPanel .clothingFilterRange", event => {
		const section = event.target.closest(".clothingFilterSection");
		/** @type {ClothingListRange} */
		const range = { from: null, to: null };
		$(section)
			.find(".clothingFilterRange")
			.each((_, element) => {
				if (element.value !== "") range[/** @type {"from"|"to"} */ (element.dataset.bound)] = Number(element.value);
			});
		const view = getWardrobeView();
		view[/** @type {"reveal"|"warmth"} */ (section.dataset.filter)] = range;
		$("#wardrobeFilterPanelButton").text(getClothingFilterPanelButtonText(view, wardrobePanelFilters));
		onWardrobeViewChanged();
	})
	.on("click", "#wardrobeFilterPanelButton", () => setWardrobeFilterPanelOpen(!getWardrobeView().isPanelOpen))
	.on("click", "#wardrobeClearFilters", () => clearWardrobeFilters())
	.on("click", "#wardrobeListBar .clothingPagerButton", event => {
		setWardrobePage(Number(event.currentTarget.dataset.page));
		redrawWardrobeItems();
	})
	.on("change", "#wardrobeListBar .clothingPager select", event => {
		setWardrobePage(event.target.selectedIndex);
		redrawWardrobeItems();
	})
	.on("change", "#wardrobeListBar .itemsPerPageLabel select", () => onWardrobeViewChanged())
	.on("mousedown", ".wardrobe-action a", event => {
		const row = $(event.currentTarget).parent();
		row.addClass("notransition action-flash");
		setTimeout(() => row.removeClass("notransition action-flash"), 100);
	});
