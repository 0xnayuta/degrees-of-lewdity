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

	isActive() {
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

	isVaginaActive() {
		const activeState = ["penetrated", "doublepenetrated", "othermouth", "tentacleentrance", "tentacleimminent", "tentacle", "tentacledeep"].includes(
			V.vaginastate
		);
		const activeUse = ["tentaclerub"].includes(V.vaginause);
		return activeState || activeUse;
	}

	isAnusActive() {
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
		const activeUse = ["tentaclerub"].includes(V.anususe);
		return activeState || activeUse;
	}

	isMouthActive() {
		const activeState = ["penetrated", "kiss", "tentacleentrance", "tentacleimminent", "tentacle", "tentacledeep"].includes(V.mouthstate);
		return activeState;
	}

	isPenisActive() {
		const activeState = ["penetrated", "otheranus", "othermouth", "tentacleentrance", "tentacleimminent", "tentacle", "tentacledeep"].includes(
			V.penisstate
		);
		const activeUse = ["tentaclerub"].includes(V.penisuse);
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
