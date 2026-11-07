declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		daily: DailyVariables;
	}
}

declare global {
	export interface DailyVariables {
		dawnCheck: any;
		noonCheck: any;
		kylar: any;
		school: {
			attended(attended: any): unknown;
			lunchEaten: boolean;
		};
		milkFullPainMessage: boolean;
		graceUp: boolean;
		/** Robin's once-a-day flags, unset at midnight. */
		robin: RobinDaily;
	}
}

export {};
