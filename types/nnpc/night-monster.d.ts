declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** The Night Monster's lair, see NightMonsterState. */
		nightMonster: NightMonsterState;
	}
}

declare global {
	/** The state of the PC's current or last stay in the Night Monster's lair. Both are set when the Night Monster carries the PC off. */
	export interface NightMonsterState {
		/** How deeply the Night Monster sleeps. Set to 110 when it falls asleep and drops by 20 each time the PC looks around the lair. It wakes when this is lower than `$rng`. */
		sleepDepth?: 110 | 90 | 70 | 50 | 30 | 10 | -10;
		/** How many hours the PC has spent making the sheet rope. At 12 the rope reaches the ground and the PC can escape. */
		timesPcAddedToSheetRope?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
	}

	/** The Night Monster's once-a-day flags, stored in `$daily.nightMonster`. */
	export interface NightMonsterDaily {
		/** If the Night Monster has ambushed the PC on the street at night today, whether the PC stood or ran. */
		ambushedPcOnStreet?: true;
	}
}

export {};
