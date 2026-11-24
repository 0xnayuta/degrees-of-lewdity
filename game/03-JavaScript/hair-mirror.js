// @ts-check

const hairTraitGroups = [
	{ heading: "Texture", traits: ["curly", "sleek", "textured", "wavy"] },
	{ heading: "Style", traits: ["braids", "buns", "pigtails", "ponytail"] },
	{ heading: "Other", traits: ["loose", "short"] },
];

window.hairTraitGroups = hairTraitGroups;

/**
 * The mirror's ticked traits, open tab and page.
 *
 * @returns {HairMirrorView}
 */
function getHairMirrorView() {
	if (!T.hairMirrorView) T.hairMirrorView = { traitFilters: [], page: 0, category: "sides" };
	return T.hairMirrorView;
}
window.getHairMirrorView = getHairMirrorView;

/**
 * Hairstyles that match the ticked traits.
 *
 * @param {HairStyle[]} styles setup.hairstyles.sides or .fringe
 * @returns {HairStyle[]}
 */
function getVisibleHairStyles(styles) {
	const tickedGroups = hairTraitGroups
		.map(group => group.traits.filter(trait => getHairMirrorView().traitFilters.includes(trait)))
		.filter(ticked => ticked.length);
	return styles.filter(style => tickedGroups.every(ticked => ticked.some(trait => style.type.includes(trait))));
}
window.getVisibleHairStyles = getVisibleHairStyles;

/**
 * The hairstyles on the current page, after the ticked traits.
 *
 * @returns {{items: HairStyle[], page: number, pageCount: number, shown: number, total: number}}
 */
function getHairMirrorPageContents() {
	const view = getHairMirrorView();
	const styles = setup.hairstyles[view.category];
	const visible = getVisibleHairStyles(styles);
	const bounds = getListPageBounds(visible.length, view.page, V.showMannequins ? 14 : 100);
	return {
		items: visible.slice(bounds.start, bounds.end),
		page: bounds.page,
		pageCount: bounds.pageCount,
		shown: visible.length,
		total: styles.length,
	};
}
window.getHairMirrorPageContents = getHairMirrorPageContents;

/**
 * Changes which page of hairstyles the mirror shows.
 *
 * @param {number} page counted from 0
 */
function setHairMirrorPage(page) {
	getHairMirrorView().page = page;
}
window.setHairMirrorPage = setHairMirrorPage;

/**
 * Switches between the sides and fringe tabs. Switching to the other tab starts at its first page.
 *
 * @param {HairMirrorView["category"]} category
 */
function setHairMirrorCategory(category) {
	const view = getHairMirrorView();
	if (view.category === category) return;
	view.category = category;
	view.page = 0;
}
window.setHairMirrorCategory = setHairMirrorCategory;

/**
 * The PC's current sides hairstyle ($hairtype) or fringe hairstyle ($fringetype), depending on which tab the mirror is showing.
 *
 * @returns {string}
 */
function getWornHairStyle() {
	return getHairMirrorView().category === "sides" ? V.hairtype : V.fringetype;
}
window.getWornHairStyle = getWornHairStyle;

/**
 * Changes the PC's sides hairstyle or fringe hairstyle, depending on which tab the mirror is showing.
 *
 * @param {string} style
 */
function setWornHairStyle(style) {
	if (getHairMirrorView().category === "sides") V.hairtype = style;
	else V.fringetype = style;
}

$(document).on("change", ".hairTraitOption", event => {
	const view = getHairMirrorView();
	view.traitFilters = event.target.checked ? [...view.traitFilters, event.target.value] : view.traitFilters.filter(trait => trait !== event.target.value);
	view.page = 0;
	wikifier("hairGridRefresh");
});

$(document).on("click", "#hairGrid .gridItem", event => {
	setWornHairStyle(event.currentTarget.dataset.hairStyle);
	V.isHairRuffleProof = false;
	$("#hairGrid .selectedHair").removeClass("selectedHair");
	$(event.currentTarget).addClass("selectedHair");
	wikifier("hairMirrorRefresh");
});
