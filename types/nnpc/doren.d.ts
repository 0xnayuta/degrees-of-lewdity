declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** Doren's variables, see DorenState. */
		doren: DorenState;
	}
}

declare global {
	export interface DorenState {
		/** How many cups of hot chocolate Doren ordered at Robin's stand in the park, 20 to 50. Doren pays £2 a cup.
		 * Set when Doren places the order and unset in "Hot Chocolate Doren" once the cups are handed over. */
		hotChocolateCupsOrdered?: number;
		/** How many times the PC asked to shower with Doren at Doren's flat.
		 * Not currently used. */
		timesPcAskedToShower: number;
	}

	/** Doren's once-a-week flags, stored in `$weekly.doren`. */
	export interface DorenWeekly {
		/** If Doren bought hot chocolate at Robin's stand in the park this week, either for a group or as a bulk order.
		 * Doren won't come to the stand again this week. */
		boughtFromHotChocolateStand?: true;
		/** If Doren bought lemonade at Robin's stand on the beach this week.
		 * Doren won't come to the stand again this week. */
		boughtFromLemonadeStand?: true;
		/** If the PC found Doren setting up the little library in the park this week.
		 * Stops the event from rolling again this week. */
		metPcAtLittleLibrary?: true;
	}

	/** Doren's once-a-month flags, stored in `$monthly.doren`. */
	export interface DorenMonthly {
		/** If the PC joined Doren's Sunday beach clean-up this month.
		 * Lets River and Doren talk about it at the soup kitchen. */
		pcVolunteeredAtBeach?: true;
	}
}

export {};
