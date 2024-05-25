/**
 * @typedef {object} Targets
 * @property {-1} pc
 * @property {0} npc0
 * @property {1} npc1
 * @property {2} npc2
 * @property {3} npc3
 * @property {4} npc4
 * @property {5} npc5
 */
/**
 * @typedef {object} Positions
 * @property {number} vagina
 * @property {number} anus
 * @property {number} mouth
 */

class CombatSystem {
	constructor() {
		this.target = {
			pc: -1,
			npc0: 0,
			npc1: 1,
			npc2: 2,
			npc3: 3,
			npc4: 4,
			npc5: 5,
		};
		this.positions = {
			vagina: 0,
			anus: 0,
			mouth: 0,
		};
	}

	resetNpcStates() {
		this.positions.vagina = 0;
		this.positions.anus = 0;
		this.positions.mouth = 0;
	}

	isRapid() {
		return this.isVaginaPenetrated() || this.isAnusPenetrated() || this.isMouthPenetrated() || this.isPenisPenetrated();
	}

	isActive() {
		if (V.NPCList.some(a => ["horse"].includes(a.type))) {
			return true;
		}
		return (
			this.isVaginaActive() ||
			this.isAnusActive() ||
			this.isMouthActive() ||
			this.isPenisActive() ||
			this.isArmActive() ||
			this.isThighActive() ||
			this.isChestActive() ||
			this.isFeetActive()
		);
	}

	isVaginaPenetrated() {
		const activeState = ["penetrated", "doublepenetrated", "tentacledeep"].includes(V.vaginastate);
		return activeState;
	}

	isVaginaActive(canvas) {
		const activeState = ["penetrated", "doublepenetrated", "othermouth", "tentacleentrance", "tentacleimminent", "tentacle", "tentacledeep"].includes(
			V.vaginastate
		);
		const activeUse = ["tentaclerub"].includes(V.vaginause);
		if (canvas === "close" && ["othervaginaentrance", "othervagina", "entrance", "imminent"].includes(V.vaginastate)) return true;
		return activeState || activeUse;
	}

	isAnusPenetrated() {
		const activeState = ["penetrated", "doublepenetrated", "tentacledeep"].includes(V.anusstate);
		return activeState;
	}

	isAnusActive(canvas) {
		const activeState = [
			"penetrated",
			"doublepenetrated",
			"cheeks",
			"othermouth",
			"tentacleentrance",
			"tentacleimminent",
			"tentacle",
			"tentacledeep",
		].includes(V.anusstate);
		if (canvas === "close" && ["entrance", "imminent", "othermouthentrance", "othermouthimminent"].includes(V.anusstate)) {
			return true;
		}
		const activeUse = ["tentaclerub"].includes(V.anususe);
		return activeState || activeUse;
	}

	isMouthPenetrated() {
		const activeState = ["penetrated", "tentacledeep"].includes(V.mouthstate);
		return activeState;
	}

	isMouthActive() {
		const activeState = ["penetrated", "kiss", "tentacleentrance", "tentacleimminent", "tentacle", "tentacledeep"].includes(V.mouthstate);
		return activeState;
	}

	isPenisPenetrated() {
		const activeState = ["penetrated", "tentacledeep", "othermouth"].includes(V.penisstate);
		return activeState;
	}

	isPenisActive(canvas) {
		const activeState = ["penetrated", "otheranus", "othermouth", "tentacleentrance", "tentacleimminent", "tentacle", "tentacledeep"].includes(
			V.penisstate
		);
		const activeUse = ["tentaclerub"].includes(V.penisuse);
		if (
			canvas === "close" &&
			[
				"entrance",
				"imminent",
				"otheranusimminent",
				"otheranusentrance",
				"othermouthentrance",
				"othermouthimminent",
				"otherpenisentrance",
				"otherpenisimminent",
			].includes(V.penisstate)
		)
			return true;
		return activeState || activeUse;
	}

	isArmActive() {
		return ["penis"].includes(V.rightarm) || ["penis"].includes(V.leftarm);
	}

	isChestActive() {
		const activeUse = ["penis"].includes(V.chestuse);
		return activeUse;
	}

	isThighActive() {
		const activeUse = ["penis"].includes(V.thighuse);
		return activeUse;
	}

	isFeetActive() {
		const activeUse = ["penis"].includes(V.feetuse);
		return activeUse;
	}
}
const combat = new CombatSystem();
window.combat = combat;

Macro.add("resetNpcStates", {
	handler() {
		combat.resetNpcStates();
	},
});
