declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** Winter's variables, see WinterState. */
		winter: WinterState;
	}
}

declare global {
	export interface WinterState {
		/** How far Winter's lake research has gone. Unset until the PC first asks about it.
		 *
		 * 0: only for a moment the first time the PC asks, before it becomes 1.
		 *
		 * 1: Winter found the channel north of the lake is partly man-made and wants someone to follow the brook.
		 *
		 * 2: the PC scouted the bog and Winter is sending a team.
		 *
		 * 3: the team came back with samples.
		 */
		lakeResearchStage?: 0 | 1 | 2 | 3;
		/** If Winter searched the history classroom's cupboards during a lesson this Halloween.
		 * Stops the scene playing again until Halloween ends.
		 * TODO: Nothing follows this up yet. */
		searchedCupboardsThisHalloween?: true;
	}

	/** Winter's once-a-week flags, stored in `$weekly.winter`. */
	export interface WinterWeekly {
		/** If Winter came to the PC's confession booth this week. */
		confessedToPc?: true;
		/** If the PC asked about Winter's lake research this week. Hides the question until next week.
		 * Only set at stages 0 and 1. Set back to false when the PC tells Winter about the bog. */
		pcAskedAboutLakeResearch?: boolean;
	}
}

export {};
