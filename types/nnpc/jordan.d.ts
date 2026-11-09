declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** Jordan's variables, see JordanState. */
		jordan: JordanState;
	}
}

declare global {
	export interface JordanState {
		/** Jordan's quest: find the flock member who went missing at a Danube Street manor. Unset until Jordan asks or the PC finds the ritual during a dance job.
		 *
		 * - `askedPc`: Jordan asked the PC to look out for them.
		 * - `pcFoundRitual`: the PC found the ritual beneath the manor and left.
		 * - `pcReportedRitual`: the PC told Jordan about the ritual.
		 * - `pcRescuedFlockMember`: the PC broke up the ritual and Jordan arrived. Also unlocks the exorcist's uniforms. */
		missingFlockQuest?: "askedPc" | "pcFoundRitual" | "pcReportedRitual" | "pcRescuedFlockMember";
	}

	/** Jordan's once-a-day flags, stored in `$daily.jordan`. */
	export interface JordanDaily {
		/** If Jordan walked in on the PC praying in the prayer room they snuck into today. */
		foundPcInPrayerRoom?: true;
		/** If the PC told Jordan about the ritual today and Jordan left for the manor.
		 * Hides Jordan from the altar and confessional for the rest of the day. */
		leftAfterRitualReport?: true;
	}

	/** Jordan's once-a-week flags, stored in `$weekly.jordan`. */
	export interface JordanWeekly {
		/** If Jordan came to the PC's confessional booth this week to check in. */
		checkedOnPcInConfessional?: true;
	}
}

export {};
