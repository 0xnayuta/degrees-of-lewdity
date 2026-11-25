// @ts-check
/* What the wardrobe and the shop use to search, filter and page their lists. */

const revealLevels = [
	{ label: "Unassuming", from: 0, to: 99 },
	{ label: "Smart", from: 100, to: 199 },
	{ label: "Tasteful", from: 200, to: 299 },
	{ label: "Comfy", from: 300, to: 499 },
	{ label: "Seductive", from: 500, to: 699 },
	{ label: "Risqué", from: 700, to: 899 },
	{ label: "Lewd", from: 900, to: 9999 },
];
window.revealLevels = revealLevels;

const clothingFilterLabels = {
	sort: "Sort",
	colours: "Colour",
	traits: "Traits (any)",
	reveal: "Reveal",
	gender: "Gender",
	warmth: "Warmth",
	clothingSetIndex: "Clothing set",
};
window.clothingFilterLabels = clothingFilterLabels;

const clothingSortLabels = {
	none: "None",
	name: "Name",
	colour: "Colour",
	price: "Price",
	protection: "Protection",
	reveal: "Reveal",
	integrity: "Integrity",
	warmth: "Warmth",
	outfit: "Outfit status",
};
window.clothingSortLabels = clothingSortLabels;

/**
 * Checks a reveal or warmth value against a From/To filter. Empty means no limit on that side.
 *
 * @param {number} value
 * @param {ClothingListRange} range
 * @returns {boolean}
 */
function isInClothingRange(value, range) {
	return value >= (range.from ?? -Infinity) && value <= (range.to ?? Infinity);
}

/**
 * Whether the clothing set at that position in $outfit holds an item with this name.
 *
 * @param {string} name
 * @param {number} clothingSetIndex
 * @returns {boolean}
 */
function isInClothingSet(name, clothingSetIndex) {
	return setup.clothingLayer.all.some(slot => V.outfit[clothingSetIndex][slot] === name);
}

/**
 * Whether an entry passes the search box and every filter.
 *
 * @param {ClothingListEntry} entry
 * @param {ClothingListFilters} filters
 * @returns {boolean}
 */
function isClothingEntryMatch(entry, filters) {
	if (filters.search) {
		const searchText = filters.search.toLowerCase();
		if (![entry.name, ...entry.patterns].some(name => name.toLowerCase().includes(searchText))) return false;
	}
	if (filters.colours.length && !entry.colours.some(colour => filters.colours.includes(colour))) return false;
	if (filters.traits.length && !entry.traits.some(trait => filters.traits.includes(trait))) return false;
	if (!isInClothingRange(entry.reveal, filters.reveal)) return false;
	if (filters.gender.length && !filters.gender.includes(entry.gender)) return false;
	if (!isInClothingRange(entry.warmth, filters.warmth)) return false;
	if (filters.clothingSetIndex !== null && !isInClothingSet(entry.name, filters.clothingSetIndex)) return false;
	return true;
}
window.isClothingEntryMatch = isClothingEntryMatch;

/**
 * Where one page of a list starts and ends. A page past the end of the list moves back to the last page.
 *
 * @param {number} itemCount
 * @param {number} page counted from 0
 * @param {number} perPage
 * @returns {{start: number, end: number, page: number, pageCount: number}}
 */
function getListPageBounds(itemCount, page, perPage) {
	const pageCount = Math.max(1, Math.ceil(itemCount / perPage));
	const shownPage = Math.min(page, pageCount - 1);
	return { start: shownPage * perPage, end: (shownPage + 1) * perPage, page: shownPage, pageCount };
}
window.getListPageBounds = getListPageBounds;

/**
 * Filters with nothing typed or ticked.
 *
 * @returns {ClothingListFilters}
 */
function getEmptyClothingFilters() {
	return {
		search: "",
		colours: [],
		traits: [],
		reveal: { from: null, to: null },
		gender: [],
		warmth: { from: null, to: null },
		clothingSetIndex: null,
	};
}
window.getEmptyClothingFilters = getEmptyClothingFilters;

/** @type {ClothingFilterOption[]} */
const clothingGenderOptions = [
	{ value: "f", label: "Female" },
	{ value: "n", label: "Unisex" },
	{ value: "m", label: "Male" },
];
window.clothingGenderOptions = clothingGenderOptions;

/**
 * The Traits choices, labelled with each trait's shop name.
 *
 * @param {string[]} traits
 * @returns {ClothingFilterOption[]}
 */
function getClothingTraitOptions(traits) {
	return traits.map(trait => ({ value: trait, label: setup.shopDetails[trait].name }));
}
window.getClothingTraitOptions = getClothingTraitOptions;

/**
 * Whether a filter is narrowing the list. If something is ticked, a range has a bound, or a clothing set is picked.
 *
 * @param {ClothingListFilters} filters
 * @param {ClothingFilterName} field
 * @returns {boolean}
 */
function isClothingFilterActive(filters, field) {
	switch (field) {
		case "colours":
		case "traits":
		case "gender":
			return filters[field].length > 0;
		case "reveal":
		case "warmth":
			return filters[field].from !== null || filters[field].to !== null;
		case "clothingSetIndex":
			return filters.clothingSetIndex !== null;
	}
}

/**
 * The sort in words, such as "Name ↓"
 *
 * @param {ClothingListSort} sort
 * @returns {string}
 */
function getClothingSortName(sort) {
	if (sort.property === "none") return clothingSortLabels.none;
	return `${clothingSortLabels[sort.property]} ${sort.isDescending ? "↓" : "↑"}`;
}
window.getClothingSortName = getClothingSortName;

/**
 * The text on a Sort dropdown
 *
 * @param {ClothingListSort} sort
 * @returns {string}
 */
function getClothingSortDropdownText(sort) {
	if (sort.property === "none") return clothingFilterLabels.sort;
	return `${clothingFilterLabels.sort}: ${getClothingSortName(sort)}`;
}
window.getClothingSortDropdownText = getClothingSortDropdownText;

/**
 * The text on a Clothing set dropdown
 *
 * @param {number | null} clothingSetIndex
 * @returns {string}
 */
function getClothingSetDropdownText(clothingSetIndex) {
	if (clothingSetIndex === null) return clothingFilterLabels.clothingSetIndex;
	return `${clothingFilterLabels.clothingSetIndex}: ${V.outfit[clothingSetIndex].name}`;
}
window.getClothingSetDropdownText = getClothingSetDropdownText;

/**
 * The text on a Filters button
 *
 * @param {ClothingListFilters} filters
 * @param {ClothingFilterName[]} panelFilters
 * @returns {string}
 */
function getClothingFilterPanelButtonText(filters, panelFilters) {
	const activeFilterCount = panelFilters.filter(field => isClothingFilterActive(filters, field)).length;
	return activeFilterCount ? `Filters (${activeFilterCount})` : "Filters";
}
window.getClothingFilterPanelButtonText = getClothingFilterPanelButtonText;

/**
 * Keeps an open dropdown's menu on screen. The wardrobe, shop and mirror share this.
 *
 * @param {HTMLElement} dropdown
 */
function keepClothingFilterMenuOnScreen(dropdown) {
	const screenMargin = 8;
	const menu = $(dropdown).find(".clothingFilterMenu").css("left", "");
	const menuBounds = menu[0].getBoundingClientRect();
	const overflow = menuBounds.right + screenMargin - document.documentElement.clientWidth;
	if (overflow > 0) menu.css("left", `${-Math.min(overflow, menuBounds.left - screenMargin)}px`);
}
window.keepClothingFilterMenuOnScreen = keepClothingFilterMenuOnScreen;

document.addEventListener(
	"toggle",
	event => {
		if (event.target instanceof HTMLDetailsElement && event.target.matches(".clothingFilterDropdown") && event.target.open)
			keepClothingFilterMenuOnScreen(event.target);
	},
	true
);

document.addEventListener(
	"toggle",
	event => {
		if (event.target instanceof HTMLDetailsElement && event.target.matches(".clothingFilterDropdown") && event.target.open)
			$(".clothingFilterDropdown[open]").not(event.target).prop("open", false);
	},
	true
);

document.addEventListener(
	"click",
	event => {
		$(".clothingFilterDropdown[open]").not($(event.target).closest(".clothingFilterDropdown")).prop("open", false);
	},
	true
);
