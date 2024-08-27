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
		return [];
	},
	defaultOptions() {
		return Object.assign(NpcCombatMapper.generateOptions(), this.metadata);
	},
	preprocess(options) {
		NpcCombatMapper.mapNpcToOptions(options.index || 0, options);
	},
	layers: {
		npcBodyBack: NpcCanvasHelper.genBodyLayer("back"),
		npcBodyFront: NpcCanvasHelper.genBodyLayer("front"),
		npcDrool: {
			srcfn(options) {
				const path = `${options.src}/${options.category}/${options.type}/drool/${options.drool.amount}.png`;
				return path;
			},
			showfn(options) {
				if (!options.show) {
					return false;
				}
				return options.drool.show;
			},
			animationfn(options) {
				return options.animKey;
			},
			zfn(options) {
				return 90;
			},
		},
		npcBalls: {
			srcfn(options) {
				const path = `${options.src}/${options.category}/${options.type}/${options.state}-balls.png`;
				return path;
			},
			showfn(options) {
				if (!options.show) {
					return false;
				}
				return options.balls.hasBalls;
			},
			animationfn(options) {
				return options.animKey;
			},
			zfn(options) {
				return 49;
			},
		},
		npcPenetrator: NpcCanvasHelper.genPenetratorLayer(),
		npcPenetratorEjaculate: NpcCanvasHelper.genPenetratorEjaculationLayer(),
	},
};
Renderer.CanvasModels.combatMainNpc = combatMainNpc;
