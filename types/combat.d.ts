declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		combat: boolean;
		position: "doggy" | "missionary";

		arousalmax: number;
		enemyarousal: number;
		enemyarousalmax: number;

		orgasmdown: number;
		orgasmcount: number;

		vaginause: number | string;
		anususe: number | string;
		mouth: number | string;
		head: number | string;
		front: number | string;
		back: number | string;
		chest: number | string;
		leftarm: number | string;
		rightarm: number | string;

		anustarget: number;
		anususe: number;
		anusstate: string | 0;
		bottomtarget: number;
		bottomuse: number;
		bottomstate: string | 0;
		chesttarget: number;
		chestuse: number;
		cheststate: string | 0;
		feettarget: number;
		feetuse: string | 0;
		feetstate: string | 0;
		handtarget: number;
		handuse: number;
		handstate: string | 0;
		lefttarget: number;
		leftuse: number;
		leftstate: string | 0;
		mouthtarget: number;
		mouthuse: number;
		mouthstate: string | 0;
		penistarget: number;
		penisuse: string | 1 | 0;
		penisstate: string | 0;
		righttarget: number;
		rightuse: number;
		rightstate: string | 0;
		stealtarget: number;
		stealuse: number;
		stealstate: string | 0;
		thightarget: number;
		thighuse: number;
		thighstate: string | 0;
		tooltarget: number;
		tooluse: number;
		toolstate: string | 0;
		vaginatarget: number;
		vaginause: number;
		vaginastate: string | 0;

		fingersInVagina: number;
		vaginaFingerLimit: number;
		selfsuckDepth: number;
		penisHeight: number;
		corruptionMasturbation: boolean;
		corruptionMasturbationCount: number;
		masturbationorgasmstat: number;
		masturbationOrgasmTimeStat: TimeStamp;
		masturbationorgasm: number;
		masturbationorgasmsemen: number;
		secondsSpentMasturbating: number;
		femaleclimax: number;

		currentToyLeft: any;
		currentToyRight: any;
		currentToyVagina: any;
		currentToyAnus: any;

		prop: string[];
		machine?: {
			tattoo: {
				use: string;
			};
		};
		tentacles: {
			0?: TentacleState;
			1?: TentacleState;
			2?: TentacleState;
			3?: TentacleState;
			4?: TentacleState;
			5?: TentacleState;
			6?: TentacleState;
			7?: TentacleState;
			8?: TentacleState;
			9?: TentacleState;
			10?: TentacleState;
			11?: TentacleState;
			12?: TentacleState;
			13?: TentacleState;
			14?: TentacleState;
			15?: TentacleState;
			16?: TentacleState;
			17?: TentacleState;
			18?: TentacleState;
			19?: TentacleState;
			20?: TentacleState;
			active: number;
			max: number;
		};
	}
}

declare global {
	export interface TentacleState {
		baby: number;
		babychance: number;
		desc: string;
		fullDesc: string;
		head: string;
		id: string;
		shaft: string;
		size: number;
		tentaclehealth: number;
		tentaclehealthstart: number;
		traits: string[];
		type: "tentacle";
	}
}

export {};
