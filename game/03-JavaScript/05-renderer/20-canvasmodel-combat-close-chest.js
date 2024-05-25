/**
 * @type {CanvasModelOptions}
 */
const combatCloseChest = {
	name: "combatCloseChest",
	width: 256,
	height: 256,
	frames: 4,
	generatedOptions() {
		console.log(this.name, "closeChest generatedOptions");
		return [];
	},
	defaultOptions() {
		console.log(this.name, "closeChest defaultOptions");
		return {
			root: "img/newsex/close/",
			position: "missionary",
			showChest: false,
			filters: {
				worn: {},
			},
		};
	},
	preprocess() {
		console.log(this.name, "closeChest preprocess");
	},
	/** @type {Object<string, CanvasModelLayerClose>} */
	layers: {
		chest: {
			srcfn(options) {
				return `${options.src}chest/${options.breasts}.png`;
			},
			showfn(options) {
				return !!options.showChest;
			},
			animationfn(options) {
				return options.animKeyChest;
			},
			filters: ["body"],
			z: ZIndices.closeBase,
		},
		chest_nipple: {
			srcfn(options) {
				return `${options.src}chest/${options.breasts}.png`;
			},
			showfn(options) {
				return !!options.showChest;
			},
			animationfn(options) {
				return options.animKeyChest;
			},
			filters: ["body"],
			z: ZIndices.closeBase,
		},
		npc: {
			srcfn(options) {
				return `${options.src}chest/npc/${options.breastsNpc}${options.breasts === "topdown" ? "-topdown" : ""}.png`;
			},
			showfn(options) {
				return !!options.showChest && ["penis", "tentacle"].includes(V.chestuse);
			},
			animationfn(options) {
				return options.animKeyChest;
			},
			filters: ["body"],
			z: ZIndices.closeNpc,
		},
	},
};
Renderer.CanvasModels.combatCloseChest = combatCloseChest;
