/*
 * This is a TypeScript typings file with definitions an documentation of in-game structures.
 *
 * While documenting everything  here is optional, the definitions might be picked by IDE,
 * and, should TypeScript rewrite become a thing in future, would work as a static type check.
 */

import { SugarCubeStoryVariables, SugarCubeTemporaryVariables } from "twine-sugarcube";

declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		options: {
			silhouetteEnabled: boolean;
		};

		arousal: number;
		pain: number;
		position: "missionary" | "doggy";
		hairlengthstage: string;
		skinColor: SkinColour;
		player: Player;
		haircolour: string;
		eyeselect: string;
		prop: string[];

		NPCList: Npc[];

		enemyarousal: number;
		enemyarousalmax: number;

		orgasmdown: number;
		orgasmcount: number;
		femaleclimax: number;

		leftarm: string;
		rightarm: string;

		feetstate: string;
		feetuse: string | 1 | 0;
		feettarget: 0 | 1 | 2 | 3 | 4 | 5 | -1;

		anusstate: string;
		anususe: string | 1 | 0;
		anustarget: 0 | 1 | 2 | 3 | 4 | 5 | -1;

		vaginastate: string;
		vaginause: string | 1 | 0;
		vaginatarget: 0 | 1 | 2 | 3 | 4 | 5 | -1;

		thighstate: string;
		thighuse: string | 1 | 0;
		thightarget: 0 | 1 | 2 | 3 | 4 | 5 | -1;

		penisstate: string;
		penisuse: string | 1 | 0;
		penistarget: 0 | 1 | 2 | 3 | 4 | 5 | -1;

		machine: {
			tattoo: {
				use: string;
			};
		};
		tentacles: {
			[x: number]: TentacleState;
			active: number;
			max: number;
		};

		worn: {
			[x: string]: ClothesItem;
		};
	}

	export interface SugarCubeTemporaryVariables {
	}

	export interface SugarCubeSetupObject {
		colours: ColourMap;
		clothes_all_slots: string[];
		clothes: {
			[x: string]: {
				[x: number]: ClothesItem;
			};
		};
	}
}

declare global {
	export interface Npc {
		skincolour: string;
		penis: string;
		vagina: string;
		stance: string;
		type: string;
	}

	export interface TentacleState {
		head: string;
		tentaclehealth: number;
	}

	export interface Player {
		perceived_breastsize: number;
	}

	export interface SkinColour {
		natural: "custom" | "light" | "medium" | "dark" | "gyaru";
		range: number;
		current: {
			penis: string;
		}
	}

	export interface ColourMap {
		clothes_map: {
			[x: string]: object;
		};
		eyes_map: {
			[x: string]: object;
		};
		hair_map: {
			[x: string]: object;
		};
		sprite_prefilters: {
			[x: string]: object;
		};
	}

	const V: SugarCubeStoryVariables;
	const T: SugarCubeTemporaryVariables;
}
