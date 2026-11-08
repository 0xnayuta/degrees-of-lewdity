declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** Leighton's variables, see LeightonState. */
		leighton: LeightonState;
	}
}

declare global {
	export interface LeightonState {
		/** Leighton's genital inspection scene in Sirris's science class. Only exists while the scene plays. */
		inspection?: LeightonInspection;
		/** If Leighton photographed the PC with a penis grown by the ear slime at the boys' inspection. Leighton then expects the PC during the girls' inspection too. Unset at an inspection where the PC doesn't have a penis. */
		photographedPcParasitePenis?: true;
		/** School days since the PC's last photoshoot for Leighton's photo blackmail. Unset until the blackmail starts.
		 *
		 * Goes up by 1 each school day and back to 0 after each photoshoot. At 1 or more a photoshoot is due, and at 3 or more the photos can go up on the notice board and the PC can offer to do photoshoots for money. */
		schoolDaysSincePhotoshoot?: number;
	}

	/** Leighton's genital inspection scene in Sirris's science class. */
	export interface LeightonInspection {
		/** What the PC did when Leighton called the line: joined it, stayed seated, or was forced to join. Empty until the PC chooses. */
		actualAction?: "" | "join" | "sit" | "forced";
		/** Whether Leighton and the class expect the PC to join the line or stay seated based on their gender appearance. */
		expectedAction?: "join" | "sit";
		/** The PC's gender appearance when the scene started. */
		genderAppearance: "m" | "f";
	}

	/** Leighton's once-a-day flags, stored in `$daily.leighton`. */
	export interface LeightonDaily {
		/** If Leighton offered the PC money for a private dance at the brothel today. */
		offeredPcPrivateDance?: true;
		/** If the PC left Leighton's office today without doing anything or having anything to say.
		 * Makes Leighton annoyed on the next visit. */
		pcWastedTime?: true;
	}

	/** Leighton's once-a-week flags, stored in `$weekly.leighton`. */
	export interface LeightonWeekly {
		/** Whether Leighton is waiting in the brothel dressing room after PC ignores them.
		 * True when the PC ignores Leighton's offer. False once that scene plays. */
		waitingInBrothelDressingRoom?: boolean;
	}
}

export {};
