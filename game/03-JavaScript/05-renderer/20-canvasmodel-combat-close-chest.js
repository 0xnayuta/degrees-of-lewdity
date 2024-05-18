/**
 * @type {CanvasModelOptions}
 */
const combatCloseChest = {
	name: "combatCloseChest",
	width: 256,
	height: 256,
	frames: 4,
	generatedOptions() {
		console.log(this.name, "generatedOptions");
		return [];
	},
	defaultOptions() {
		console.log(this.name, "defaultOptions"); /* default options kirstyTODO */
	},
	preprocess() {
		console.log(this.name, "preprocess");
	},
	/** @type {Object<string, CanvasModelLayerClose>} */
	layers: {
		chest: {
			srcfn(options) {
				return `${options.src}${options.breasts}.png`;
			},
			showfn(options) {
				return !!options.showChest;
			},
			animationfn(options) {
				return options.animKeyChest;
			},
			filters: ["body"],
			z: 50,
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
			z: 50,
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
			z: 51,
		},
	},
};
Renderer.CanvasModels.combatCloseChest = combatCloseChest;
