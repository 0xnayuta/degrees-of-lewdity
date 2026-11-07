declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** Morgan's variables, see MorganState. */
		morgan: MorganState;
	}
}

declare global {
	export interface MorganState {
		/** Morgan hunting the PC through the old sewers. */
		hunt: MorganHunt;
	}

	/** Morgan hunting the PC through the old sewers. Starts when the PC escapes Morgan, trips a trap, or hears the scream. Ends when the PC hides, is caught, or leaves. */
	export interface MorganHunt {
		/** Whether Morgan is hunting the PC right now. While true, PC can't use the ladders, other tunnel events don't happen, and orgasms that are loud enough draw Morgan closer. */
		inProgress?: boolean;
		/** Moves left before Morgan catches the PC. Set to 3 when a hunt starts, and goes down by 1 for each tunnel the PC moves through, each failed struggle, and each loud orgasm. The warning text changes at 2 and 1, and Morgan catches the PC at 0 or less. */
		stepsLeft?: number;
		/** Which of Morgan's 8 lines `<<morgantext>>` says next while hunting PC. From 0 to 7, then back to 0. */
		nextLine: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
		/** If the PC passed out in labour while Morgan was hunting them. Set just before the hunt ends and unset by `<<pregnancyPassout>>`. Changes some Morgan lines. */
		pcWentIntoLabour?: true;
	}

	/** Morgan's once-a-day flags, stored in `$daily.morgan`. */
	export interface MorganDaily {
		/** If Morgan fed the PC today, either through 18:00 dinner or by nursing. */
		fedPc?: true;
		/** If Morgan gave the PC the 9:00 history lesson today. */
		taughtHistory?: true;
		/** If Morgan gave the PC the 12:00 maths lesson today. */
		taughtMaths?: true;
		/** If Morgan gave the PC the 15:00 English lesson today. */
		taughtEnglish?: true;
		/** If Morgan gave the PC the 17:00 science lesson today. */
		taughtScience?: true;
		/** If Morgan's 20:00 "special learning" is done. Used up whether the PC lay down, refused, or Morgan raped the PC after a review instead. Morgan only asks a favour for the USB while this is unset. */
		sexEdUsed?: true;
		/** If Morgan started a bath for the PC today, even if the PC refuses it. */
		bathedPc?: true;
		/** If Morgan raped the PC tonight. Morgan does it once a night at most. */
		rapedPcTonight?: true;
	}
}

export {};
