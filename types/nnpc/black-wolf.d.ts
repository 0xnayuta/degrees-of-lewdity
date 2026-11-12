declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** The Black Wolf's variables, see BlackWolfState. */
		blackWolf: BlackWolfState;
	}
}

declare global {
	export interface BlackWolfState {
		/** If the Black Wolf curled up beside the PC in the wolf cave bed. Changes the PC's wake up text.
		 * Unset when the PC climbs out of bed or the night's sleep ends. */
		inBedWithPc?: true;
		/** If the PC crumbled the pink mushroom onto the Black Wolf's food on a hunt. The Black Wolf will have 200 health instead of 600 in its fights with the PC.
		 * Set to false when the next hunt starts. */
		poisonedByPinkMushroom?: boolean;
		/** When the Black Wolf left the PC alone to check for an intruder on its night patrol. After 2+ hours, the PC sees it come back at the wolf cave.
		 * Unset afterwards or if PC comes back to the wolf cave 24+ hours later. */
		patrolLeftAt?: TimeStamp;
		/** When the Black Wolf last offered to mate during the PC's heat or rut, or last had sex with the PC in the cave.
		 * When the PC approaches the Black Wolf, it won't offer to mate again until at least 3 hours after this. */
		lastSexAt?: TimeStamp;
		/** The Black Wolf challenging the PC for the lead of the pack. Only happens while `$wolfpackleader` is 1.
		 * TODO: Black Wolf Rework. Will be removed. */
		challenge: {
			/** The earliest the Black Wolf can challenge the PC again. Set to 14 days after each challenge.
			 * Unset until the first challenge, which can happen as soon as the PC leads the pack. */
			nextAllowedAt?: TimeStamp;
			/** If the PC talked the Black Wolf down with "Reason" at the last challenge. Reasoning fails at the next challenge if this is true.
			 * Set to false when the PC fights or surrenders. */
			pcTalkedDownLast?: boolean;
		};
		/** The Black Wolf on the pack's hunt. */
		hunt: {
			/** If the Black Wolf stayed at the wolf cave instead of hunting due to being too pregnant to hunt, or because the PC asked it to stay.
			 * Changes the hunt's start and return text. Unset when the pack comes back. */
			stayedAtCave?: true;
			/** If the Black Wolf told a visibly pregnant PC to stay behind. The Black Wolf will bring them meat. Unset when the pack comes back. */
			huntingForPregnantPc?: true;
			/** The mushroom the PC took at the cliff to add to the Black Wolf's food at the deer. "none" once it's used.
			 * Kept if the PC doesn't use it, so it can be used on a later hunt. */
			mushroomPcCarries?: "red" | "pink" | "none";
		};
	}

	/** The Black Wolf's once-a-day flags, stored in `$daily.blackWolf`. */
	export interface BlackWolfDaily {
		/** If the Black Wolf goes on its night patrol tonight. Rolled each day with a 1 in 3 chance while the PC has `$syndromewolves`. */
		patrolTonight?: true;
		/** If the Black Wolf licked its scent back onto the PC after a wash in the stream. */
		markedPcAfterWash?: true;
		/** If the Black Wolf tried to lick the PC clean after they came back messy from the forest. */
		triedToCleanPc?: true;
	}

	/** The Black Wolf's once-a-week flags, stored in `$weekly.blackWolf`. */
	export interface BlackWolfWeekly {
		/** If the Black Wolf asked the PC to come and watch the forest. */
		askedPcToWatchForest?: true;
		/** If the Black Wolf has gone on its night patrol. */
		wentOnPatrol?: true;
		/** If the baby rabbit event was added to the wolf cave's event pool. Another event can still be picked instead. */
		babyRabbitChanceUsed?: true;
	}
}

export {};
