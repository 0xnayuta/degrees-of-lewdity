declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** The Ivory Wraith's variables, see IvoryWraithState. */
		ivoryWraith: IvoryWraithState;
	}
}

declare global {
	/** The forms the Ivory Wraith can take in a fight. */
	export type IvoryWraithForm = "man" | "tentacles" | "slimetentacles" | "slime" | "abomination" | "arms";

	export interface IvoryWraithState {
		/** The Ivory Wraith's state, updated by `<<checkWraith>>` during the blood moon and whenever the Ivory Wraith appears. Only starts once `Time.days` is 32 or more.
		 * It isn't updated while `Time.monthName` is "October", so an autumn start first meets the Ivory Wraith at the November blood moon instead of on Halloween.
		 *
		 * "": not active yet or if the Ivory Wraith has been sent away.
		 *
		 * "active": the ivory necklace is still in the lake ruin.
		 *
		 * "haunt": the PC took the ivory necklace.
		 *
		 * "despair": a diver took the ivory necklace. */
		state: "" | "active" | "haunt" | "despair";
		/** Nights since the Ivory Wraith became active.
		 * `compound.chance` can only build up once this is 31 or more.
		 */
		daysActive: number;
		/** How many times the Ivory Wraith has met the PC directly.
		 *
		 * 1+ times: the PC knows its voice and finds its face familiar.
		 *
		 * 3+ times: the PC recognises it as a familiar pale figure.
		 *
		 * 5+ times: a few extra lines.
		 *
		 * 10+ times: the PC can ask about the pale figure at the temple. */
		timesMetPc: number;
		/** How many times the PC has beaten the Ivory Wraith in a fight.
		 * Not currently used for anything. */
		timesPcWonFight: number;
		/** How many times the Ivory Wraith's possession of the PC has ended.
		 * Shown in Statistics.
		 *
		 * The first possession is easier to resist, and `gwylanCanRescueFromWraith()` needs it to be 1 or more for Gwylan's first rescue from a possession. */
		timesPossessedPc: number;
		/** If the PC took the Ivory Wraith's hand in the Christmas mirror and saw the vision. Stepping away doesn't count.
		 * Hides the mirror for the rest of this Christmas. Deleted when the Christmas period ends. */
		pcSawChristmasMirrorVision?: true;
		/** If the Ivory Wraith appeared in the PC's underground brothel cell. Unset when the PC escapes. */
		visitedPcInUbCell?: true;
		/** If the PC hears the Ivory Wraith's voice while stuck in the moor quicksand. Unset when the quicksand ends. */
		whisperingInQuicksand?: true;
		/** The Ivory Wraith at the Elk compound. */
		compound: IvoryWraithCompound;
		/** The Ivory Wraith pretending to be one of the PC's love interests. */
		mimic: IvoryWraithMimic;
		/** Fights with the Ivory Wraith. */
		fight: IvoryWraithFight;
		/** The Ivory Wraith's hunts during the blood moon. */
		hunt: IvoryWraithHunt;
		/** The ivory necklace being taken from the lake ruin. */
		necklace: IvoryWraithNecklace;
		/** The Ivory Wraith's pale offspring. */
		offspring: IvoryWraithOffspring;
		/** The Ivory Wraith possessing the PC. */
		possession: IvoryWraithPossession;
		/** The underwater prison beneath the lake ruin. */
		prison: IvoryWraithPrison;
		/** The Ivory Wraith's Schism vision. */
		schism: IvoryWraithSchism;
	}

	/** The Ivory Wraith at the Elk compound. */
	export interface IvoryWraithCompound {
		/** How likely the Ivory Wraith is to start waiting for the PC at the Elk compound. Checked each night while `state` is set, once `daysActive` is 31 or more, if the PC has met it (`firstEncounter`) and found the compound (`$compound.discovered`), and if there's no `cooldownDaysLeft` or `waitingForPc`.
		 *
		 * Goes up by 1 on those nights if `$world_corruption_soft` is 30 or more, and by 10 each time the PC sells pale offspring. Set to 10 after each compound encounter.
		 *
		 * Once it reaches `random(5, 60 - C.npc["Ivory Wraith"].lust)`, the Ivory Wraith waits at the compound (`waitingForPc`) and this is deleted. */
		chance?: number;
		/** Nights before the Ivory Wraith can start waiting at the compound again:
		 *
		 * 10 after a compound encounter
		 *
		 * 30 after the Ivory Wraith frees the pale creatures held in the compound. */
		cooldownDaysLeft?: number;
		/** If the Ivory Wraith is waiting for the PC at the Elk compound.
		 *
		 * Plays if the PC visits with `$hallucinations` 2 or more. */
		waitingForPc?: true;
		/** If "A fell mist hangs over Elk Street." should show on the next screen. */
		showMistMessage?: true;
		/** How the PC answered the Ivory Wraith in this compound encounter. Unset when the encounter ends. */
		pcResponse?: "accepted" | "willing" | "resisted";
	}

	/** The Ivory Wraith pretending to be one of the PC's love interests. */
	export interface IvoryWraithMimic {
		/** Who the Ivory Wraith is pretending to be, or "" if it's not pretending to be anyone. */
		npc: "" | "Eden" | "Robin" | "Kylar";
		/** If the PC realised the Ivory Wraith isn't the real NPC.
		 * Set back to false when the encounter ends. */
		pcSawThrough: boolean;
		/** If the PC chose to just cuddle with the Ivory Wraith while it pretended to be Robin. The PC wakes to the Robin mimic fight. */
		inBedAsRobin?: true;
	}

	/** A series of fights with the Ivory Wraith. `<<endWraith>>` clears this group when the series ends, and sets `healthLeft` for the next one. */
	export interface IvoryWraithFight {
		/** The form the Ivory Wraith took for this fight. */
		form?: IvoryWraithForm;
		/** Which combat system the fight uses. */
		combatType?: "man" | "tentacles" | "slime";
		/** The form picked in the debug "Wraith Test". */
		debugForm?: IvoryWraithForm | "random";
		/** Forms not used yet in this series of fights.
		 * Refilled by `<<continueWraith>>` and cleared by `<<endWraith>>`. */
		formsLeft?: IvoryWraithForm[];
		/** The Ivory Wraith's health carried into its next fight. `<<continueWraith>>` keeps it as it was between fights in a row, and `<<endWraith>>` adds 50 when a series of fights ends.
		 * Unset when `$enemyhealth` reaches 0, or by `<<clearWraith>>`. */
		healthLeft?: number;
		/** If the PC apologised to the Ivory Wraith this combat turn. */
		pcApologisedThisTurn?: true;
		/** How many fights in a row before the Ivory Wraith lets the PC go. */
		fightsInARowLimit?: 0 | 1 | 2 | 3 | 4;
		/** How many fights in a row so far.
		 * The underwater prison limit is never more than 3. */
		fightsInARow?: number;
	}

	/** The Ivory Wraith hunting the PC during a blood moon.
	 * `<<clearWraith>>` resets it when the hunt ends at sunrise, at the end of many encounters, and the day after the blood moon at the latest. */
	export interface IvoryWraithHunt {
		/** How close the Ivory Wraith is to catching the PC.
		 *
		 * 0 when it isn't hunting. Goes up by 0.5 to 1.5 each time the PC loads a street, forest, lake or sewer passage while it hunts.
		 *
		 * At 5 its close events can start, and at 10 it catches the PC.
		 *
		 * Escaping sets it back to 6 or 8, and getting away in some encounters lowers it by 2 or 3. */
		progress: number;
		/** How likely a hunt is to start. Grows during a blood moon while the Ivory Wraith isn't hunting, each time `<<wTimerProgress>>` runs, and each turn fishing. It's set to its obsession (`C.npc["Ivory Wraith"].lust`) when a blood moon starts if it's 0 or below.
		 *
		 * A hunt starts once this beats a random roll. The roll goes up to 60 in town and the sewers, 40 in the forest (20 in one spot), and 10 at the lake.
		 *
		 * Set to -30 when the PC wins "Wraith Caught Finish", and to -50 when the PC removes ear slimes.
		 *
		 * Lowered by 20 when the Ivory Wraith gets what it wanted after an encounter and leaves.
		 *
		 * Also goes up by 5 when the PC shakes off a hunt, and is set to 0 by `<<clearWraith>>`. */
		chance: number;
		/** The Ivory Wraith waking the PC from sleep at a blood moon.
		 *
		 * "none": nothing planned.
		 *
		 * "tonight": it will wake the PC tonight.
		 *
		 * "wokePc": it did and the PC will see the nightmare and wake up possessed. */
		nightmare: "none" | "tonight" | "wokePc";
		/** If the roll for the nightmare has already succeeded.
		 * Unset by `<<clearWraith>>`. */
		nightmareRolled?: true;
		/** How many times the PC has escaped the Ivory Wraith this blood moon.
		 * Not currently read. */
		timesPcEscaped: number;
		/** The Ivory Wraith's hunt carrying on after the PC leaves the forest.
		 *
		 * "followed": it hunted the PC in the forest, and will keep coming when they leave.
		 *
		 * "pcWarned": back in town, the PC was told "Whatever was hunting you is still coming." */
		followedOutOfForest?: "followed" | "pcWarned";
		/** If the PC has apologised to the Ivory Wraith in combat.
		 * They can only do it once until the next `<<clearWraith>>`. */
		pcApologised?: true;
		/** If `<<checkWraith>>` should leave `state` alone until the next `<<clearWraith>>`.
		 * Usually set together with `state` = "" when the Ivory Wraith is sent away. */
		sentAway?: true;
		/** Where `<<exitWraith>>` sends the PC when an encounter or possession ends, or "" for nowhere.
		 *
		 * `<<wraithPossess>>` with no argument keeps whatever was set before.
		 *
		 * `<<exitWraith>>` has cases for "moor" and "forest_shop", but nothing sets them. */
		exitTo:
			| ""
			| "home"
			| "sleep"
			| "cabin"
			| "alex_cottage"
			| "tower"
			| "town"
			| "beach"
			| "pier"
			| "forest"
			| "Gwylan"
			| "lake_ruin"
			| "lake"
			| "wolf_cave"
			| "farm_assault"
			| "sewers"
			| "pirates"
			| "mansion";
	}

	/** The ivory necklace being taken from the lake ruin.
	 * The Schism vision replays the time and weather of that moment. */
	export interface IvoryWraithNecklace {
		/** Who took the necklace, or "" if it's still in the lake ruin.
		 *
		 * "pc": the PC took it.
		 *
		 * "diver": a diver took it after the PC paid for the lake field office at the town hall. */
		takenBy: "" | "pc" | "diver";
		/** Timestamp of when the necklace was taken. */
		takenAt?: TimeStamp;
		/** The weather when the necklace was taken. */
		weatherWhenTaken?: {
			name: string;
			temp: number;
			snow: number;
		};
	}

	/** The Ivory Wraith's pale offspring. */
	export interface IvoryWraithOffspring {
		/** What last happened to the PC's pale offspring.
		 *
		 * "": nothing yet, or the Ivory Wraith has calmed down.
		 *
		 * "alive": the Ivory Wraith has appeared over a living one.
		 *
		 * "dead": it died.
		 *
		 * "sold": the PC sold it.
		 *
		 * Goes back to "" when `angerDaysLeft` runs out, or when the Ivory Wraith frees them from the Elk compound. */
		status: "" | "alive" | "dead" | "sold";
		/** Days before `status` goes back to "".
		 *
		 * 30 when a pale offspring dies
		 *
		 * 15 for each one sold */
		angerDaysLeft?: number;
		/** How many pale offspring have died since the Ivory Wraith last punished the PC for it. When the PC finds them dead, its obsession (`C.npc["Ivory Wraith"].lust`) goes up by 2 for each one, then this resets. */
		unpunishedDeaths?: number;
	}

	/** The Ivory Wraith possessing the PC. */
	export interface IvoryWraithPossession {
		/** How strongly the Ivory Wraith is holding the PC. The difficulty of the PC's `<<willpowerdifficulty>>` checks to fight it.
		 *
		 * Starts at 1100 to 1700 when a possession begins. Only `<<clearWraith>>` deletes it. Goes down when the PC resists or gets hurt while possessed. Goes up when they give in. */
		holdOnPc?: number;
		/** The PC's `$control` from before the possession set it to 0. Given back when the possession ends. */
		pcControlBefore?: number;
		/** How far the possessed walk from a sleeping place has got.
		 *
		 * 5 means the walk has reached the forest. It stays at 5 from then on, and `$forest` changes as the PC is walked toward the lake. */
		walkStep?: 0 | 1 | 2 | 3 | 4 | 5;
		/** Which pale offspring the possessed PC is being walked to. Either the ones at home or at the lake. */
		paleOffspringVisit?: "home" | "lake";
		/** If the Ivory Wraith's obsession (`C.npc["Ivory Wraith"].lust`) was low enough that it only touched the sleeping partner (Robin, Kylar, Eden or Avery) instead of grabbing them. */
		pcTouchedPartner?: true;
		/** If the "restore your control" hint has been shown. Turns on the control meter during the possession. Unset by `<<clearWraith>>`. */
		controlHintShown?: true;
		/** If Gwylan hugged the possessed PC and left them in the forest and will come back for them. */
		gwylanLeftPcInForest?: true;
	}

	/** When the PC is imprisoned by the Ivory Wraith in the underwater prison beneath the lake ruin. */
	export interface IvoryWraithPrison {
		/** Minutes until the Ivory Wraith comes back after leaving the room: 30, 60 or 120. */
		minutesUntilReturn?: number;
		/** Minutes the PC has spent in the prison this visit.
		 *
		 * 120: the PC can leave at dawn.
		 *
		 * 140: the Ivory Wraith can show the PC the Schism vision if `state` is "haunt" or "despair" and `$trauma` is at least 40% of `$traumamax`. */
		minutesSpent?: number;
		/** How much of the prison the PC has searched. The PC can rest once it's 2 or more. */
		searchProgress?: 0 | 1 | 2 | 3 | 4;
		/** Where the Ivory Wraith is.
		 *
		 * "present": in the room with the PC.
		 *
		 * "recovering": away, coming back when `minutesUntilReturn` runs out.
		 *
		 * "gone": gone until the PC leaves. */
		presence?: "present" | "recovering" | "gone";
		/** If the Ivory Wraith possessed the PC this visit. */
		possessedPc?: boolean;
		/** If the Ivory Wraith made the PC masturbate this visit. */
		madePcMasturbate?: boolean;
		/** If the Ivory Wraith has put a slime in the PC's ear during this fight, so it doesn't put in a second one. */
		putEarSlimeInPc?: true;
	}

	/** The Schism vision, where the PC lives the Ivory Wraith's past as Clánha. It can be reached from the underwater prison or the scene viewer. */
	export interface IvoryWraithSchism {
		/** If the PC drowned in the vision and became the spirit. Unset when the PC wakes up. */
		pcDrowned?: true;
		/** How many times the PC has struggled in "Schism Struggle".
		 * From 2 the struggling is senseless. At 4 the PC can't struggle any more. Reaches 5 after the last round. Unset when the struggle ends. */
		struggleRound?: 0 | 1 | 2 | 3 | 4 | 5;
	}

	/** The Ivory Wraith's once-a-day flags, stored in `$daily.ivoryWraith`. */
	export interface IvoryWraithDaily {
		/** If the Ivory Wraith's face has flashed on the sidebar picture today. */
		flashedOnSidebar?: true;
		/** If the Ivory Wraith's voice answered the PC confessing at the temple today. */
		spokeDuringPcConfession?: true;
		/** If the Ivory Wraith sang in the orphanage nursery today. */
		sangInNursery?: true;
	}

	/** The Ivory Wraith's once-a-week flags, stored in `$weekly.ivoryWraith`. */
	export interface IvoryWraithWeekly {
		/** If the Ivory Wraith came to the PC's confession booth this week. */
		cameToPcConfessionBooth?: true;
	}
}

export {};
