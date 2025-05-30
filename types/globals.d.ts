import { SugarCubeStoryVariables, SugarCubeTemporaryVariables } from "twine-sugarcube";

declare global {
	export type NpcNames =
		| "Avery"
		| "Bailey"
		| "Briar"
		| "Charlie"
		| "Darryl"
		| "Doren"
		| "Eden"
		| "Gwylan"
		| "Harper"
		| "Jordan"
		| "Kylar"
		| "Landry"
		| "Leighton"
		| "Mason"
		| "Morgan"
		| "River"
		| "Robin"
		| "Sam"
		| "Sirris"
		| "Whitney"
		| "Winter"
		| "Black Wolf"
		| "Niki"
		| "Quinn"
		| "Remy"
		| "Alex"
		| "Great Hawk"
		| "Wren"
		| "Sydney"
		| "Ivory Wraith"
		| "Zephyr";

	const V: SugarCubeStoryVariables;
	const T: SugarCubeTemporaryVariables;
	const C: {
		crime: any;
		npc: {
			[key in NpcNames]: Npc;
		};
		tiredness: {
			max: number;
		};
	};
	const DOL: {
		Stack: string[];
		Errors: any;
		Versions: any;
		Perflog: any;
		State: any;
		setup: any;
		Wikifier: any;
		Template: any;
	};
	const EventSystem: EventData;

	const Browser: {
		isMobile: {
			any(): boolean;
		};
	};

	const L10n: any;

	let throwError: Function;

	interface ObjectConstructor {
		hasOwn(object: any, property: any): boolean;
		deepMerge(objects: any): object;
		find(objects: any): object;
	}

	interface NumberConstructor {
		shuffle();
		select(index: number): any;
		except(): any;
		formatList(options: any): any;
	}

	interface ArrayConstructor {
		between(min: number, max: number): boolean;
	}

	interface EventData {
	}

	function defineGlobalNamespaces(dol: typeof DOL): void;

	interface Window {
		DOL: typeof DOL;
		defineGlobalNamespaces: (dol: typeof DOL) => void;
	}
}

export {};
