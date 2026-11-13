declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** The wolf pack and the wolf cave, see WolfPackState. */
		wolfPack: WolfPackState;
	}
}

declare global {
	export interface WolfPackState {
		/** If a wolf cave event is due. Set to true every hour and after the PC gives birth in the cave, and to false when an event plays at the cave. */
		eventDue?: boolean;
		/** How many hours the PC has dug at the back of the wolf cave.
		 *
		 * 1 after examining it
		 *
		 * +1 per dig
		 *
		 * The dig text changes at 4, 6 and 9.
		 *
		 * The PC can squeeze out at 10+ depending on physique size. */
		digProgress?: number;
		/** If the wolf cave garden plots have been made. Set the first time the PC opens the plots.
		 * TODO: Black Wolf Rework. The rework plans to remove farming from the wolf cave (subject to change). */
		plotsMade?: true;
		/** If a pack wolf was hurt at the lake while the PC was there. The PC can then join the pack's Halloween outing from the wolf cave clearing.
		 * Unset when the outing starts, or on 2 November. */
		halloweenWolfHurtAtLake?: true;
		/** The pack's mood. Both are set to 10 when the PC joins the pack, and clamped to 0-22 when the PC enters the wolf cave or its clearing. */
		mood: {
			/** How peaceful the pack is. */
			harmony?: number;
			/** How aggressive the pack is. */
			ferocity?: number;
		};
		/** How the pack sees the PC. */
		standing: {
			/** How much the pack trusts the PC. Goes up by 1 at a time.
			 * At 6, the pack starts to accept the PC.
			 *
			 * At 12, it trusts them and the PC can walk out of captivity.
			 *
			 * At 18, the PC can join hunts.
			 *
			 * At 24, some forest and lake events open up. */
			trust: number;
			/** How much the pack fears the PC. Goes up by 1 each time the PC beats a wolf while held captive.
			 *
			 * At 6, the pack starts to fear the PC.
			 *
			 * At 12, it fears them and the PC can walk out of captivity. */
			fear: number;
			/** If the PC has the "Stockholm Syndrome: Wolves"  trait and lives with the pack.
			 * Set to true by `<<joinWolfPack>>`. */
			stockholm?: boolean;
			/** If the PC leads the pack.
			 * Set to true when the PC beats the Black Wolf in a fight to lead the pack.
			 * Set to false when the PC loses or surrenders to its challenge.
			 * TODO: Black Wolf Rework. Remove. */
			pcLeadsPack?: boolean;
		};
		/** The PC's night in the wolf cave. */
		sleep: {
			/** If pack wolves are sleeping around the PC in the cave bed.
			 * Set to false when the PC gets up. */
			inBedWithPc?: boolean;
			/** If a wolf has already woken the PC tonight.
			 * Set to false at 6:00. */
			wokenByPackTonight?: boolean;
		};
		/** The pack's nightly hunt. */
		hunt: {
			/** If the pack is at the cave or out hunting. */
			packLocation?: "cave" | "hunt";
			/** How tonight's hunt is going.
			 *
			 * "notStarted" is set on a daytime visit to the cave
			 *
			 * "ongoing" at dusk
			 *
			 * "success" or "failure" after
			 *
			 * "finished" when the pack comes back. */
			stage?: "notStarted" | "ongoing" | "success" | "failure" | "finished";
			/** If the PC took the pepper spray charge from the hunters' camp.
			 * It can only be taken once. */
			tookSprayCharge?: true;
		};
	}

	/** The wolf cave's once-a-day values, stored in `$daily.wolfPack`. */
	export interface WolfPackDaily {
		/** How many times the PC breastfed the pups today.
		 * At 3 the pups are full. */
		pupsBreastfed?: 1 | 2 | 3;
		/** When the PC last fed or tried to feed the pups today. See `getPupsFeedingTime()`. The pups can't be fed again until the next feeding time. */
		pupsLastFedWhen?: "morning" | "evening";
		/** If the wolf cave's wolves are monster people today. Rolled the first time it's needed each day, see `resolveIfCaveWolvesAreMonsters()`. */
		caveWolvesAreMonsters?: boolean;
		/** If a wolf pack hunt failed today. Lets two wolves harass the PC in the cave once, then it's unset. */
		huntFailed?: true;
	}
}

export {};
