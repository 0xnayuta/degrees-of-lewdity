// @ts-check
/* global NpcCombatMapper, NpcCanvasHelper */

/**
 * @type {CanvasModelOptions<NpcOptions>}
 */
const combatMainNpc = {
	name: "combatMainNpc",
	width: 256,
	height: 256,
	frames: 4,
	generatedOptions() {
		console.log(this.name, "generatedOptions");
		return [];
	},
	defaultOptions() {
		console.log(this.name, "defaultOptions");
		return Object.assign(NpcCombatMapper.generateOptions(), this.metadata);
	},
	preprocess(options) {
		console.log("combatMainNpc-Preprocess:", JSON.parse(JSON.stringify(options)));
		NpcCombatMapper.mapNpcToOptions(options.index || 0, options);
	},
	layers: {
		npcBody: NpcCanvasHelper.genBodyLayer(),
		npcFrontleg: {
			srcfn(options) {
				const path = `${options.src}/${options.category}/${options.type}/${options.state}-leg.png`;
				console.warn("NPC path:", path);
				return path;
			},
			showfn(options) {
				const show = options.show && options.category === "beast";
				console.warn("NPC showing:", show);
				return !!show;
			},
			animationfn(options) {
				return options.animKey;
			},
			z: 85,
		},
		npcPenetrator: NpcCanvasHelper.genPenetratorLayer(),
		npcPenetratorEjaculate: NpcCanvasHelper.genPenetratorEjaculationLayer(),
	},
};
Renderer.CanvasModels.combatMainNpc = combatMainNpc;
