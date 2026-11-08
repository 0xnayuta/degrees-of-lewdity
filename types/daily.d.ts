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
		/** The Night Monster's once-a-day flags, unset at midnight. */
		nightMonster: NightMonsterDaily;
		/** Morgan's once-a-day flags, unset at midnight. */
		morgan: MorganDaily;
		/** Whether the named beasts are a monster person today. Rolled when it's needed from its monster chance setting. */
		namedBeastIsMonster?: Partial<Record<NamedBeastType, boolean>>;
		/** Leighton's once-a-day flags, unset at midnight. */
		leighton: LeightonDaily;
		/** Jordan's once-a-day flags, unset at midnight. */
		jordan: JordanDaily;
	}
}

export {};
