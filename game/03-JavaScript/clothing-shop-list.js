// @ts-check
/* The clothing shop's search, filters, sort and page. */

/**
 * The shop's search, filters, sort and whether it lists outfits. Lasts until the passage changes.
 *
 * @returns {ShopView}
 */
function getShopView() {
	if (!T.shopView)
		T.shopView = {
			...getEmptyClothingFilters(),
			sort: { property: "none", isDescending: false },
			isPanelOpen: false,
			showOutfitsOnly: false,
			pageCount: 1,
		};
	return T.shopView;
}
window.getShopView = getShopView;

/**
 * Opens a tab of the shop's list. The upper tabs list either outfits or single items.
 *
 * @param {ClothedSlots | "all"} slot
 * @param {boolean} showOutfitsOnly
 */
function setShopTab(slot, showOutfitsOnly) {
	V.clothingShopSlot = slot;
	getShopView().showOutfitsOnly = showOutfitsOnly;
}
window.setShopTab = setShopTab;

const shopItemsPerPageOptions = [4, 8, 12, 16, 24, 32];
window.shopItemsPerPageOptions = shopItemsPerPageOptions;

/**
 * The filters in the shop's Filters panel, in order.
 *
 * @type {ClothingFilterName[]}
 */
const shopPanelFilters = ["traits", "reveal", "gender", "warmth"];
window.shopPanelFilters = shopPanelFilters;

/** @type {ShopSortProperty[]} */
const shopSortProperties = ["none", "price", "protection", "reveal", "warmth"];
window.shopSortProperties = shopSortProperties;

/**
 * Ascending order for each shop sort.
 *
 * @type {ShopSortComparers}
 */
const shopSortComparers = {
	price: (a, b) => a.price - b.price,
	protection: (a, b) => a.protection - b.protection,
	reveal: (a, b) => a.reveal - b.reveal,
	warmth: (a, b) => a.warmth - b.warmth,
};

/**
 * A shop item entry the search, filters and sort can check.
 *
 * @param {ClothesItem} item
 * @returns {ShopEntry}
 */
function getShopEntry(item) {
	return {
		name: item.name,
		patterns: item.pattern_options || [],
		colours: item.colour_options,
		traits: item.type,
		reveal: item.reveal,
		warmth: getTrueWarmth(item),
		gender: item.gender,
		price: getClothingCost(item, item.slot),
		protection: item.integrity_max,
		item,
	};
}

/**
 * The items that pass the search and filters, sorted.
 *
 * @param {ClothesItem[]} items
 * @returns {ClothesItem[]}
 */
function getShopVisibleItems(items) {
	const view = getShopView();
	const visible = items.map(getShopEntry).filter(entry => isClothingEntryMatch(entry, view));
	if (view.sort.property !== "none") {
		const ascending = shopSortComparers[view.sort.property];
		visible.sort(view.sort.isDescending ? (a, b) => ascending(b, a) : ascending);
	}
	return visible.map(entry => entry.item);
}
window.getShopVisibleItems = getShopVisibleItems;

/**
 * The Traits choices are every trait this shop stocks.
 *
 * @returns {{traits: ClothingFilterOption[], gender: ClothingFilterOption[]}}
 */
function getShopFilterOptions() {
	const stock = setup.clothes.all.filter(item => item.shop.includes(V.shopName));
	return {
		traits: getClothingTraitOptions([...new Set(stock.flatMap(item => item.type))].sort()),
		gender: clothingGenderOptions,
	};
}
window.getShopFilterOptions = getShopFilterOptions;

/** Any change to the search, filters, sort or page size starts again from the first page. */
function onShopViewChanged() {
	V.shopPage = 0;
	$("#shopItemList").empty().wiki("<<clothingShopList>>");
}

/**
 * Shows or hides the shop's Filters panel.
 *
 * @param {boolean} isOpen
 */
function setShopFilterPanelOpen(isOpen) {
	getShopView().isPanelOpen = isOpen;
	$("#shopFilterPanel").toggleClass("hidden", !isOpen);
	$("#shopFilterPanelButton").toggleClass("open", isOpen);
}

/** The Clear filters button. The sort is kept. */
function clearShopFilters() {
	Object.assign(getShopView(), getEmptyClothingFilters());
	$("#shopSearchRow").empty().wiki("<<shopSearchRow>>");
	onShopViewChanged();
}

/**
 * Remembers which page the shop's list is on and how many pages it has. If the list got shorter, $shopPage moves back to its last page.
 *
 * @param {{page: number, pageCount: number}} bounds from getListPageBounds()
 */
function setShopPageBounds(bounds) {
	V.shopPage = bounds.page;
	getShopView().pageCount = bounds.pageCount;
}
window.setShopPageBounds = setShopPageBounds;

/**
 * Shows a page of the shop's list and redraws the pager.
 *
 * @param {number} page counted from 0
 */
function showShopPage(page) {
	V.shopPage = page;
	$("#shop-list-pages > div.clothing-shop-page").addClass("hidden no-numberify");
	$(`#shop-list-pages > div.clothing-shop-page.page-${page}`).removeClass("hidden no-numberify");
	$("#shopPager").empty().wiki("<<shopPager>>");
}

let shopListRenderCount = 0;

/**
 * Gives each render of the shop's list its own number. The list's other pages are added in the background, and stop being added once a render with a newer number has replaced the list.
 *
 * @returns {number} the new render's number
 */
function startShopListRender() {
	shopListRenderCount++;
	return shopListRenderCount;
}
window.startShopListRender = startShopListRender;

/**
 * Whether the item is an outfit with a lower piece, such as a dress. These are listed on the outfit tabs.
 *
 * @param {ClothesItem} item
 * @returns {boolean}
 */
function isShopOutfit(item) {
	return Object.keys(item.outfitPrimary ?? {}).some(slot => slot.includes("lower"));
}
window.isShopOutfit = isShopOutfit;

/** Waits for typing in the search bar to pause, so a word redraws the list once. */
const onShopSearchInput = $.debounce(150, input => {
	if (!document.contains(input)) return;
	getShopView().search = input.value;
	onShopViewChanged();
});

$(document)
	.on("change", ".shopHideToggle input", () => onShopViewChanged())
	.on("input", "#shopSearchInput", event => onShopSearchInput(event.target))
	.on("change", "#shopSortDropdown .clothingFilterOption", event => {
		const view = getShopView();
		if (event.target.dataset.sortPart === "descending") view.sort = { ...view.sort, isDescending: event.target.value === "true" };
		else view.sort = { ...view.sort, property: event.target.value };
		$("#shopSortDropdown .clothingFilterDropdownText").text(getClothingSortDropdownText(view.sort));
		keepClothingFilterMenuOnScreen(event.target.closest("#shopSortDropdown"));
		onShopViewChanged();
	})
	.on("change", "#shopClothingSetDropdown .clothingFilterOption", event => {
		const view = getShopView();
		view.clothingSetIndex = event.target.value === "" ? null : Number(event.target.value);
		$("#shopClothingSetDropdown .clothingFilterDropdownText").text(getClothingSetDropdownText(view.clothingSetIndex));
		keepClothingFilterMenuOnScreen(event.target.closest("#shopClothingSetDropdown"));
		onShopViewChanged();
	})
	.on("change", "#shopFilterPanel .clothingFilterOption", event => {
		const field = /** @type {"traits"|"gender"} */ (event.target.closest(".clothingFilterSection").dataset.filter);
		const view = getShopView();
		view[field] = event.target.checked ? [...view[field], event.target.value] : view[field].filter(value => value !== event.target.value);
		$("#shopFilterPanelButton").text(getClothingFilterPanelButtonText(view, shopPanelFilters));
		onShopViewChanged();
	})
	.on("change", "#shopFilterPanel .clothingFilterRange", event => {
		const section = event.target.closest(".clothingFilterSection");
		/** @type {ClothingListRange} */
		const range = { from: null, to: null };
		$(section)
			.find(".clothingFilterRange")
			.each((_, element) => {
				if (element.value !== "") range[/** @type {"from"|"to"} */ (element.dataset.bound)] = Number(element.value);
			});
		const view = getShopView();
		view[/** @type {"reveal"|"warmth"} */ (section.dataset.filter)] = range;
		$("#shopFilterPanelButton").text(getClothingFilterPanelButtonText(view, shopPanelFilters));
		onShopViewChanged();
	})
	.on("click", "#shopFilterPanelButton", () => setShopFilterPanelOpen(!getShopView().isPanelOpen))
	.on("click", "#shopClearFilters", () => clearShopFilters())
	.on("click", "#shopPager .clothingPagerButton", event => {
		showShopPage(Number(event.currentTarget.dataset.page));
	})
	.on("change", "#shopPager .clothingPager select", event => {
		showShopPage(event.target.selectedIndex);
	})
	.on("change", "#shopItemList .itemsPerPageLabel select", () => onShopViewChanged());
