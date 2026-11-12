declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		monthly: MonthlyVariables;
	}
}

declare global {
	export interface MonthlyVariables {
		/** Bailey's once-a-month flags, unset when the month ends. */
		bailey: BaileyMonthly;
		/** Doren's once-a-month flags, unset when the month ends. */
		doren: DorenMonthly;
	}
}

export {};
