declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** Harper's variables, see HarperState. */
		harper: HarperState;
	}
}

declare global {
	export interface HarperState {
		/** If Harper drugged a Cow PC during a park run and took them to Remy's farm.
		 * The next time the PC resists Harper's hypnosis at the farm, they confront Harper about it. Unset then. */
		abductedPcFromPark?: true;
		/** The machine scene in Harper's nightmare. Created when the machine starts and deleted when the PC wakes up. */
		nightmare?: {
			/** Successful Struggles left before the machine breaks, 4 to 0. */
			machineStrugglesLeft: 0 | 1 | 2 | 3 | 4;
			/** Turns left before the machine runs dry, 9 to 0. */
			machineTurnsLeft: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
		};
		/** The PC's sessions with Harper. */
		appointments: {
			/** How the PC gets to see Harper. Unset before either.
			 *
			 * "referredBySchoolNurse": the school nurse gave the PC Harper's card so PC can ask for Doctor Harper at the hospital.
			 *
			 * "weekly": Harper sees the PC on Fridays. Set by Harper's invitation, after the first visit referred by the school nurse, or after Harper sends the PC to the asylum. */
			status?: "referredBySchoolNurse" | "weekly";
			/** How far the PC is through the hypnosis sessions, 0 to 5. 5 repeats.
			 * Set back to 0 by every event that removes the PC's hypnosis. */
			hypnosisStage: 0 | 1 | 2 | 3 | 4 | 5;
			/** How far the PC is through the exams, 0 to 3. At 3, any exam can replay. */
			examStage: 0 | 1 | 2 | 3;
			/** How far the PC is through the "therapy dog" sessions, 0 to 5. 5 repeats. */
			dogStage: 0 | 1 | 2 | 3 | 4 | 5;
			/** What the last session was, so the next one is different. */
			lastType?: "hypnosis" | "exam" | "dog";
			/** Where the dog knotted the PC during this dog session. Unset when the PC leaves. */
			whereDogKnottedPc?: "vagina" | "anus" | "mouth";
			/** If Harper will warn that the dog is not for intimacy during the next session. Unset after Harper says it. */
			willWarnDogNotForIntimacy?: true;
			/** The PC's `$uncomfortable.nude` before it's hypnotised away during the dog session. Put back and unset when the scene is done. */
			pcWasUncomfortableNude?: boolean;
		};
	}

	/** Harper's once-a-day flags, stored in `$daily.harper`. */
	export interface HarperDaily {
		/** If the PC went into Harper's office today.
		 * Stops a second visit that day. */
		pcVisitedOffice?: true;
	}
}

export {};
