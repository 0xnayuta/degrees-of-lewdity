declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** Landry's variables, see LandryState. */
		landry: LandryState;
	}
}

declare global {
	export interface LandryState {
		/** Landry's black box job. */
		blackBox: {
			/** Where the current black box is. Unset when there is no job.
			 * Landry only offers the job while it's unset and the PC's crime is 500 or more. The journal also prints it. */
			location?: "forest" | "moor" | "sewers";
			/** If the PC has the black box and hasn't handed it to Landry yet.
			 * Shows "Hand over the black box" at the pub and "Return the black box" in the journal. */
			pcHasBox?: true;
			/** Who is guarding the box, set on the first visit. Unset when the box is handed over.
			 *
			 * In the forest: "bear" or "humanPair"
			 *
			 * On the moor: "lurkers" or "human" on the moor
			 *
			 * In the sewers: "lizard" or "smugglers". Whichever the PC searches first hides the other spot. */
			guardedBy?: "bear" | "humanPair" | "lurkers" | "human" | "lizard" | "smugglers";
			/** Where Landry's next black box job will be.
			 * The jobs go forest, then moor, then sewers, then back to the forest. Kept when the box is handed over. */
			nextLocation: "forest" | "moor" | "sewers";
			/** If the PC walked away from the smugglers' offer or the smugglers' sex scene ended without the PC getting the box.
			 * The next time the PC searches there, the smugglers grab them. Unset then. */
			pcLeftSmugglersWithoutBox?: true;
		};
	}
}

export {};
