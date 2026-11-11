declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		weekly: WeeklyVariables;
	}

	export interface SugarCubeSetupObject {
		weeklyObject: WeeklySetupVariables;
	}
}

declare global {
	export interface WeeklySetupVariables {
		theft: object;
		sewers: object;
	}

	export interface WeeklyVariables extends WeeklySetupVariables {
		kylarCreep?: number;
		edenPrey?: boolean;
		slimeWakeMasturbation?: boolean;
		alexNightTimeNursery?: 1;
		whitneyPub?: number;
		streetPolice?: number;
		adultShopWhitney?: boolean;
		danceJob?: boolean;
		policeHigh?: boolean;
		brothelVMLube?: boolean;

		/* There are a lot more weekly variables */

		theft: {
			danceStudio?: boolean;
			oceanBreeze?: boolean;
			stripClub?: boolean;
			clothingShop?: boolean;
			furnitureShop?: boolean;
			hairDressers?: boolean;
			tailor?: boolean;
			petShop?: boolean;
			toyShop?: boolean;
			tattooParlour?: boolean;
			ridingSchool?: boolean;
			spa?: boolean;
			schoolLibraryMoney?: boolean;
		};

		sewers: {
			antiqueCrystal?: boolean;
			antiqueWatch?: boolean;
			antiqueDildo?: boolean;
			antiqueCandlestick?: boolean;
			antiqueHorn?: boolean;
		};

		/** Robin's once-a-week flags, unset when the week ends. */
		robin: RobinWeekly;
		/** Leighton's once-a-week flags, unset when the week ends. */
		leighton: LeightonWeekly;
		/** Jordan's once-a-week flags, unset when the week ends. */
		jordan: JordanWeekly;
		/** Bailey's once-a-week flags, unset when the week ends. */
		bailey: BaileyWeekly;
		/** Sam's once-a-week flags, unset when the week ends. */
		sam: SamWeekly;
		/** Winter's once-a-week flags, unset when the week ends. */
		winter: WinterWeekly;
		/** The Ivory Wraith's once-a-week flags, unset when the week ends. */
		ivoryWraith: IvoryWraithWeekly;
		/** Doren's once-a-week flags, unset when the week ends. */
		doren: DorenWeekly;
	}
}

export {};
