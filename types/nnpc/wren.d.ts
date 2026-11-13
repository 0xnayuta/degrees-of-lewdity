declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** Wren's variables, see WrenState. */
		wren: WrenState;
	}
}

declare global {
	export interface WrenState {
		/** Where the PC last met Wren. Unset until the first meeting.
		 * Picks Wren's greeting at the estate, Wren's line in the prison yard, and the PC's first reply when Wren offers the heist at Landry's table. */
		lastMetAt?:
			| "metPcAtEstate"
			| "pcDeliveredMickeysLetter"
			| "caughtPcAtDocksCatsuit"
			| "metPcInPrison"
			| "metPcWithWinter"
			| "carriedLabouringPcOutOfBeachCave"
			| "didHeistWithPc"
			| "pulledPcBackOnHighMoor";
		/** The prison names the PC has given Wren so far after asking for passage off the island.
		 * "That's all the names" shows once all four are in. Emptied when the PC hands them over. */
		prisonNamesGiven: ("scarredInmate" | "relaxedGuard" | "veteranGuard" | "methodicalGuard")[];
		/** Wren's mansion heist. */
		heist: {
			/** Days until Wren can offer another heist, 0 to 30. Set to 30 when Wren makes the offer or tells the PC "You stood me up", and counts down each day.
			 * Unset the day after it reaches 0, which means Wren can offer the next heist. */
			daysUntilNextOffer?: number;
			/** If the PC accepted the heist and didn't turn up. Set at midnight after the heist night.
			 * Wren says "You stood me up" at the estate, then it's unset. Also unset when the PC accepts the next heist. */
			pcMissedLast?: true;
			/** The heist night. Created when the PC accepts and deleted at midnight or by Wren telling "You stood me up".
			 * While it exists, a heist is on tonight. */
			tonight?: {
				/** The PC's share of the loot. Picked from Wren's love when the PC accepts (40+, 20+, less) and can be raised to the next one in the car. */
				profitSplit: "50/50" | "60/40" | "70/30";
				/** If the PC arrived at the mansion. */
				pcArrived?: true;
				/** How many dances the PC has done. 0 before the first, then the passage after it:
				 *
				 * 1: the wine cellar
				 *
				 * 2: the kitchen
				 *
				 * 3: the stairs
				 *
				 * 4: the exit.
				 *
				 * Deleted on the way out of the mansion. */
				round?: 0 | 1 | 2 | 3 | 4;
				/** What the heist made before the split, in the same units as `$blackmoney`. */
				loot?: number;
				/** If the PC helped in the kitchen and lost the fight there.
				 * The attacker stops Wren during the third dance, so money doesn't go up and Wren brings it up on the stairs. */
				pcLostKitchenFight?: true;
				/** If the PC saw Wren pocket something upstairs. Unlocks the option to try and take it in the car. */
				pcSawWrenPocketSomething?: true;
			};
		};
	}

	/** Wren's once-a-day flags, stored in `$daily.wren`. */
	export interface WrenDaily {
		/** If Wren pulled the PC back on the high moor today. Wren won't turn up there again today. */
		pulledPcBackOnMoor?: true;
	}
}

export {};
