declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** Mason's variables, see MasonState. */
		mason: MasonState;
	}
}

declare global {
	export interface MasonState {
		/** Mason's offers to unlock the chastity devices Winter puts on the PC. */
		chastity: {
			/** Whether Mason carries the key to Winter's chastity devices.
			 *
			 * "carried" once Mason notices PC's device at the pond while PC is exposed or in swimming class. Mason will start offering to remove it.
			 *
			 * "shownToPc" once Mason shows PC the key. Later offers skip "Ask" if PC has exhibitionism 5. */
			key: "notCarried" | "carried" | "shownToPc";
			/** How many of Winter's chastity devices Mason has unlocked from the PC.
			 * Mason's lines differ for 0, 1, and 2+.
			 * At 3+, PC can grab Mason's hand. */
			timesRemovedFromPc: number;
			/** If the PC turned down Mason's last offer to remove a device. Mason's offer text changes.
			 * Set back to false when the PC accepts. */
			pcDeclinedRemoval: boolean;
		};
	}

	/** Mason's once-a-day flags, stored in `$daily.mason`. */
	export interface MasonDaily {
		/** If the PC met Mason swimming in the lake or at Mason's pond today. */
		metPcAtLake?: true;
		/** If the PC swam out to Mason in the lake today, after having caught up with Mason before.
		 * Hides "Swim out to Mason" for the rest of the day. */
		pcSwamOutToTalk?: true;
		/** What Mason did today about the underwear going missing from the changing room lockers.
		 *
		 * "lookedAround": Mason walked past the PC hiding in a locker, looked around the corner by the entrance and went back to the pool. Mason won't come in again today.
		 *
		 * "searchedLockers": Mason opened the lockers one by one while the PC hid in one. PC can't raid any more lockers today. */
		lockerThiefCheck?: "lookedAround" | "searchedLockers";
		/** If Mason first noticed the PC's chastity device today, or the PC declined Mason's offer to remove it today.
		 * Mason won't offer again today. Deleted when the PC accepts. */
		chastityOfferUsed?: true;
	}

	/** Mason's once-a-week flags, stored in `$weekly.mason`. */
	export interface MasonWeekly {
		/** If the PC declined Mason's offer to remove a chastity device this week.
		 * Mason won't offer again this week at the pond or in swimming class. Deleted when the PC accepts. */
		pcDeclinedChastityRemoval?: true;
	}
}

export {};
