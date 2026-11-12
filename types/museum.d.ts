declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** The museum's variables, see MuseumState. */
		museum: MuseumState;
		/** What the antiques the PC is carrying are worth, in pounds. The museum pays it out and sets it back to 0. */
		antiqueMoney: number;
		/** The total value of antiques the PC has handed in, in pounds. Not currently read. */
		antiqueMoneyHistory: number;
	}
}

declare global {
	export interface MuseumState {
		/** How interested the public is in the museum, 0 to 100. Winter's demonstrations raise it.
		 * It drops by 2 a day or drops by 5 a day while it's 60 or more.
		 * Picks how busy the museum is at 20, 60 and 100.
		 * Can go past 100 after a demonstration until the next day. */
		publicInterest: number;
		/** The missing antique Winter is hinting at, by its id, like `antiquegoldmask`.
		 * Unset when there's no hint, so Winter gives a new one the next time the PC looks at the collection.
		 * Unset every Saturday and whenever the PC donates an antique. */
		antiqueHint?: string;
		/** Winter's demonstrations at the museum. */
		demonstrations: {
			/** The PC's safe word. Defaults to "Marshmallow". */
			safeWord?: string;
			/** PC agreed to help Winter demonstrate the wooden horse after 10 donated antiques. */
			horseDemonstration?: "asked" | "agreed";
			/** PC agreed to help Winter demonstrate the ducking stool after 10 donated antiques. */
			duckingStoolDemonstration?: "asked" | "agreed";
			/** PC agreed to help Winter demonstrate the wooden horse in front of a paying crowd. Only after the PC endured the horse and is famous enough. */
			paidHorseDemonstration?: "asked" | "agreed";
			/** If the PC demonstrated the wooden horse this week, paid or not. Unset on Monday. */
			horseDoneThisWeek?: true;
			/** If the PC demonstrated the ducking stool this week. Unset on Monday. */
			duckingStoolDoneThisWeek?: true;
			/** How much PC is paid for the horse show, in pounds.
			 * At least 500, more if the PC is famous. */
			paidHorseShowPay?: number;
			/** If the PC endured the wooden horse to the end.
			 * Earns the "Pain Rider" feat. */
			pcEnduredHorse?: true;
			/** If the PC stayed calm under the ducking stool.
			 * Earns the "Submerged" feat. */
			pcEnduredDuckingStool?: true;
		};
	}

	/** The museum's once-a-day flags, stored in `$daily.museum`. */
	export interface MuseumDaily {
		/** If Winter told the PC a painting story today. Hides the painting stories for the rest of the day.
		 * The Hopeless Cycle sets it back to false when it ends or the PC backs out. The Bleeding Ward sets it to false when the PC stops early.
		 * Also read at the end of the day to save the Hopeless Cycle endings. */
		toldPaintingStory?: boolean;
	}
}

export {};
