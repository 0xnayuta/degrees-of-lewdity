declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** Alex's variables, see AlexState. */
		alex: AlexState;
	}
}

declare global {
	export interface AlexState {
		/** If Alex is the PC's partner. Set at Alex's confession, which plays once `daysUntilConfession` reaches 0. */
		romance: boolean;
		/** Days until Alex confesses to the PC. Needs Alex's love to be 50+. Set to 3 when the farm reaches stage 7 and counts down each day. */
		daysUntilConfession?: 0 | 1 | 2 | 3;
		/** The body parts where Alex has seen Remy's cattle tattoo on the PC. Alex notices when the tattoo is gone. */
		remyTattoosSeenOn: SkinPositions[];
		/** The alcohol on Alex's shopping list for the PC's errand. "onList" while it's on the list, then what happened at the shop:
		 * - "quiet": the PC said nothing
		 * - "noBooze": the PC asked to leave it out
		 * - "noID": the PC was refused for having no ID */
		shoppingListAlcohol?: "onList" | "quiet" | "noBooze" | "noID";
		/** What the PC said the last time Alex offered a drink during a rest. Changes Alex's line when Alex offers again.
		 * Unset when the rest ends. */
		restDrinkAnswer?: "accept" | "refuse";
		/** Births Alex is part of. Alex or the PC giving birth at the cottage, and the PC's hospital births Alex comes to. */
		birth: {
			/** How many babies Alex is giving birth to at the cottage. There are unique lines for twins and triplets. Unset at each end of the birth. */
			numberOfBabies?: number;
			/** How many babies the PC is giving birth to at the cottage. Unset at each end of the birth. */
			numberOfPcBabies?: number;
			/** If Alex called an ambulance when the PC went into labour at the farm.
			 * Sends the PC to the hospital instead of the cottage birth, and changes Alex's line when the PC comes back.
			 * Unset at the end of the hospital birth. */
			calledAmbulanceForPc?: true;
			/** If Alex found the PC in labour on the farm road and got them to the hospital. Changes Alex's greeting in the hospital foyer.
			 * Unset at the end of the hospital birth. */
			rescuedPcInLabour?: true;
			/** If Alex is the only possible donor of the babies at a hospital birth. Sends the PC to Alex at the end if Alex's nursery is ready.
			 * Unset at the end of the hospital birth. */
			hospitalBabiesAreAlexs?: boolean;
		};
		/** Alex's night at the cottage. Emptied at 06:00. */
		night: {
			/** If Alex is sleeping in the PC's bed tonight. Alex sleeps in their own bed otherwise. Unset when Alex gets up. */
			inPcBed?: true;
			/** If Alex has got up for the day at 05:00. */
			gotUp?: true;
			/** If Alex won't let the PC back into Alex's bed tonight, after waking up to the PC touching Alex or after the PC pushed Alex's hand away. */
			refusedPcInBed?: true;
			/** If a lustful Alex has already woken the PC tonight. */
			wokePc?: true;
			/** How the night went after the PC touched Alex in Alex's sleep. Picks Alex's line in the morning.
			 * "wokeAngry" is when Alex woke up and shoved the PC out of bed. Alex will glare at the PC and won't have breakfast with them. */
			somnoOutcome?: "stayedAsleep" | "wokeAndHadSex" | "wokeWithoutSex" | "wokeAngry";
			/** If Alex has glared at the PC for touching Alex in Alex's sleep. Used so the glare only plays once. */
			glaredAtPc?: true;
		};
	}

	/** Alex's once-a-day flags, stored in `$daily.alex`. */
	export interface AlexDaily {
		/** If the PC went to breakfast with Alex at the cottage, even if Alex is upset with them. */
		pcWentToBreakfast?: true;
		/** If the PC found Alex watching TV in the cottage at 05:00. */
		watchedMorningTv?: true;
		/** If Alex has come in from the farm and gone up to bed. */
		wentUpToBed?: true;
		/** If Alex asked the PC to go out somewhere during a rest. Leads to the meadow date. */
		askedPcOnMeadowDate?: true;
		/** If the PC met Alex on the street in town. */
		metPcInTown?: true;
		/** If the PC snuck up on Alex in the shower shed. */
		pcSpiedInShower?: true;
		/** If one of the scenes with Alex's children at the farm played. */
		hadChildrenScene?: true;
		/** If the PC crawled under Alex's desk while Alex worked. */
		pcCrawledUnderDesk?: true;
		/** If the PC had oral with Alex at breakfast. */
		pcHadBreakfastOral?: true;
		/** If the PC asked Alex to spank them harder at breakfast. Changes later breakfast lines when the PC's pain is 20+. */
		pcAskedToSpankHarder?: true;
		/** If the PC teased Alex about the lewd film they were watching in the morning, or asked what Alex saw. */
		pcBroughtUpTvFilm?: true;
		/** If the PC gave Alex a milkshake during a rest.
		 * Hides both milkshake options for the rest of the day. */
		pcGaveMilkshake?: true;
		/** If the PC came in a wet dream while sleeping at the cottage.
		 * Changes Alex's line when Alex gets up at 05:00. */
		pcHadWetDreamInBed?: true;
	}

	/** Alex's once-a-week flags, stored in `$weekly.alex`. */
	export interface AlexWeekly {
		/** If Alex had a hangover morning. */
		hadHangover?: true;
		/** If Alex woke the PC at night to see to the babies in the nursery. */
		wokePcForNursery?: true;
		/** If Alex reacted to finding Remy's cattle tattoo on the PC. */
		reactedToRemyTattoo?: true;
	}
}

export {};
