/**
 * @type {CanvasModelOptions}
 */
const combatClosePenis = {
	name: "combatClosePenis",
	width: 256,
	height: 256,
	frames: 4,
	generatedOptions() {
		console.log(this.name, "generatedOptions");
		return [];
	},
	defaultOptions() {
		console.log(this.name, "defaultOptions");
		return {};
	},
	preprocess(options) {
		if (window.playerHasStrapon()) {
			options.pcPenis = V.worn.under_lower.name === "strap-on knotted cock" ? "strapon-knotted" : "strapon-dick";
		} else if (V.player.penisExist) {
			options.pcPenis = options.penis.type;
		}
	},
	/** @type {Object<string, CanvasModelLayerClose>} */
	layers: {
		base: {
			srcfn(options) {
				return `${options.src}penis/${options.position}/${V.player.vaginaExist ? "herm" : "penis"}-base.png`;
			},
			showfn(options) {
				return !!options.showPenis;
			},
			animationfn(options) {
				return !options.penis.npc ? "sex-1f-idle" : options.animKeyPenis;
			},
			filters: ["body"],
			z: 51,
		},
		penis: {
			srcfn(options) {
				return `${options.src}penis/${options.position}/${options.pcPenis}.png`;
			},
			showfn(options) {
				return !!options.showPenis;
			},
			animationfn(options) {
				return !options.penis.npc ? "sex-1f-idle" : options.animKeyPenis;
			},
			filters: ["body"],
			z: 51,
		},
		panties: {
			srcfn(options) {
				return `${options.src}penis/${options.position}/panties.png`;
			},
			showfn(options) {
				return !!options.showPenis && V.worn.under_lower.state === "totheside";
			},
			animationfn(options) {
				return options.penis.npc ? options.animKeyArse : "sex-1f-idle";
			},
			z: 51,
		},
	},
};
Renderer.CanvasModels.combatClosePenis = combatClosePenis;
