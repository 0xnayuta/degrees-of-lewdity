declare global {
	/** Sam's once-a-day flags, stored in `$daily.sam`. */
	export interface SamDaily {
		/** If the PC went for a walk around the park with Sam today.
		 * Hides the walk option for the rest of the day. */
		wentOnParkWalk?: true;
		/** If the PC fed the ducks with Sam today.
		 * Hides the duck option for the rest of the day. */
		fedDucksWithPc?: true;
	}

	/** Sam's once-a-week flags, stored in `$weekly.sam`. */
	export interface SamWeekly {
		/** If Sam asked the PC how they feel about Gwylan this week.
		 * Sam won't ask again this week. */
		askedPcAboutGwylan?: true;
		/** If Sam asked the PC whether they and Robin are close this week.
		 * Sam won't ask again this week. */
		askedPcAboutRobin?: true;
		/** If Sam asked the PC about their crush this week.
		 * Sam won't ask again this week. */
		askedPcAboutCrush?: true;
	}
}

export {};
