// @ts-check

setup.clothingStates = [0, "chest", "midriff", "waist", "thighs", "knees", "ankles"];
setup.positions = [0, "doggy", "missionary", "wall", "stalk", "wall"];
setup.legPositions = ["up", "down", "footjob"];

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
		this.vaginaStates = ["vaginaentrance", "vaginaentrancedouble", "vaginaimminent", "vaginaimminentdouble", "vagina", "vaginadouble"];
		this.anusStates = ["anusentrance", "anusentrancedouble", "anus", "anusdouble"];
		this.mouthStates = ["mouthentrance", "mouthimminent", "mouth"];
	}

	get vaginaCount() {
		const states = this.vaginaStates;
		const count = V.NPCList.reduce((i, npc) => i + (npc.penis && states.includes(npc.penis) ? 1 : 0), 0);
		return count;
	}

	get anusCount() {
		const states = this.anusStates;
		const count = V.NPCList.reduce((i, npc) => i + (npc.penis && states.includes(npc.penis) ? 1 : 0), 0);
		return count;
	}

	get mouthCount() {
		const states = this.mouthStates;
		const count = V.NPCList.reduce((i, npc) => i + (npc.penis && states.includes(npc.penis) ? 1 : 0), 0);
		return count;
	}

	/**
	 * @param {number} index
	 * @param {string} position
	 */
	penetratorCountBefore(index, position) {
		let count = 0;
		for (let i = 0; i < V.NPCList.length; i++) {
			const npc = V.NPCList[i];
			if (i >= index) {
				break;
			}
			switch (position) {
				case "vagina":
					if (npc.penis && this.vaginaStates.includes(npc.penis)) {
						count++;
					}
					break;
				case "anus":
					if (npc.penis && this.anusStates.includes(npc.penis)) {
						count++;
					}
					break;
				case "mouth":
					if (npc.penis && this.mouthStates.includes(npc.penis)) {
						count++;
					}
					break;
			}
		}
		return count;
	}

	isRapid() {
		return this.isVaginaPenetrated() || this.isAnusPenetrated() || this.isMouthPenetrated() || this.isPenisPenetrated();
	}

	isActive() {
		if (V.NPCList.some(a => a.type === "horse")) {
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
		const activeState = V.vaginastate && ["penetrated", "doublepenetrated", "tentacledeep"].includes(V.vaginastate);
		return activeState;
	}

	/**
	 * @param {string | undefined} [canvas]
	 */
	isVaginaActive(canvas) {
		const activeState =
			V.vaginastate &&
			["penetrated", "doublepenetrated", "othermouth", "tentacleentrance", "tentacleimminent", "tentacle", "tentacledeep"].includes(V.vaginastate);
		const activeUse = V.vaginause === "tentaclerub" && canvas !== "close";
		if (canvas === "close" && V.vaginastate && ["othervaginaentrance", "othervagina", "entrance", "imminent"].includes(V.vaginastate)) return true;
		return activeState || activeUse;
	}

	isAnusPenetrated() {
		const activeState = V.anusstate && ["penetrated", "doublepenetrated", "tentacledeep"].includes(V.anusstate);
		return activeState;
	}

	/**
	 * @param {string | undefined} [canvas]
	 */
	isAnusActive(canvas) {
		const activeState =
			V.anusstate &&
			["penetrated", "doublepenetrated", "cheeks", "othermouth", "tentacleentrance", "tentacleimminent", "tentacle", "tentacledeep"].includes(
				V.anusstate
			);
		if (canvas === "close" && V.anusstate && ["entrance", "imminent", "othermouthentrance", "othermouthimminent"].includes(V.anusstate)) {
			return true;
		}
		const activeUse = V.anususe === "tentaclerub" && canvas !== "close";
		return activeState || activeUse;
	}

	isMouthPenetrated() {
		const activeState = V.mouthstate && ["penetrated", "tentacledeep"].includes(V.mouthstate);
		return activeState;
	}

	isMouthActive() {
		const activeState = V.mouthstate && ["penetrated", "kiss", "tentacleentrance", "tentacleimminent", "tentacle", "tentacledeep"].includes(V.mouthstate);
		return activeState;
	}

	isPenisPenetrated() {
		const activeState = V.penisstate && ["penetrated", "tentacledeep", "othermouth"].includes(V.penisstate);
		return activeState;
	}

	isPenisActive(canvas) {
		const activeState =
			V.penisstate &&
			["penetrated", "otheranus", "othermouth", "tentacleentrance", "tentacleimminent", "tentacle", "tentacledeep"].includes(V.penisstate);
		const activeUse = V.penisuse === "tentaclerub";
		if (
			canvas === "close" &&
			V.penisstate &&
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
		return V.rightarm === "penis" || V.leftarm === "penis";
	}

	isChestActive(canvas) {
		const activeUse = V.cheststate && ["penis"].includes(V.cheststate);
		if (canvas === "close" && V.cheststate && ["penis", "tentacle"].includes(V.cheststate)) {
			return true;
		}
		return activeUse;
	}

	isThighActive() {
		const activeUse = V.thighstate && ["penis"].includes(V.thighstate);
		return activeUse;
	}

	isFeetActive() {
		const activeUse = V.feetstate && ["penis"].includes(V.feetstate);
		return activeUse;
	}
}
const combat = new CombatSystem();
// @ts-ignore
window.combat = combat;
