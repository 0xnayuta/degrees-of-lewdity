declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** Gwylan's variables, see GwylanState. */
		gwylan: GwylanState;
	}
}

declare global {
	export interface GwylanState {
		/** Whether or not PC has annoyed Gwylan.
		 * Is reset to false after ritual. */
		annoyed: boolean;

		/** Has Gwylan woken PC up to go to the cafe with them? */
		cafeWake: boolean;

		/** Has PC refused to walk with Gwylan to the cafe? */
		cafeWalkRefused: boolean;

		/** Why Gwylan is hunting PC */
		hunting: "meetupMissed" | "ritualMissed" | "ritualMissedRomanceState";

		/** Is Gwylan in the pet bed with PC? */
		inBed: boolean;

		/** The milestone of love that has been reached
		 * Rarely used
		 * 0 is 0 - 9
		 * 1 is 10 - 24
		 * 2 is 25 - 49
		 * 3 is 50 - 74
		 * 4 is 75 - 99
		 * 5 is 100
		 */
		loveMilestone: 0 | 1 | 2 | 3 | 4 | 5;

		/** Time to pass when talking to Gwylan about clothing */
		passTime: number;

		/** Hidden variable to track some of the suffering PC has endured that Gwylan knows about */
		progress: number;

		/** How many rituals PC has done with Gwylan */
		purged: number;

		/** Gwylan's current request */
		request: object;

		/** How many of Gwylan's requests PC has done */
		requestCount: number;

		/** Has request been completed? */
		requestDone: boolean;

		/** Gwylan's previous request */
		requestLast: object;

		/** Seed that the request is generated with */
		requestSeed: number;

		/** Gwylan rescue stats */
		rescue: object;

		/** Has PC missed the ritual? */
		ritualMissed: boolean;

		/** Gwylan's interest stat for Robin */
		robinInterest: number;

		/** Has PC refused to walk with Gwylan to school */
		schoolWalkRefused: boolean;

		/** How many times PC has watched the sea with Gwylan */
		seaWatchedCount: number;

		/** Has PC stolen, is reset on reunion and when the shop punishes PC */
		steal: boolean;

		/** How many times has PC has Gwylan's tea */
		tea: number;

		/** Various timers for Gwylan's events */
		timer: object;

		/** Why PC keeps going */
		triumph:
			| "spite"
			| "survival"
			| "optimism"
			| "child"
			| "children"
			| "orphans"
			| "kind"
			| "special"
			| "revenge"
			| "divine"
			| "lust"
			| "innocent"
			| "curiosity"
			| "unknown"
			| "desolate"
			| "Gwylan";

		/** Request tutorial mushroom count */
		tutorialShrooms: number;

		/** Array to keep comments unique in combat */
		uniqueComment: string[];

		/** How wary Gwylan is of PC
		 * Normally reduced when doing rituals */
		wary: number;

		/** Will Gwylan climb into doggy bed? */
		wake: boolean;

		/** Status of the letter Gwylan sent after sulking */
		yearningLetter: "sent" | "seen";

		/** Exit Link for yearning letter scene */
		yearningLetterExit: string;

		/** What PC said the kiss meant */
		yearnResponse: "nothing" | "important";
	}

	export interface GwylanDaily {
		/** Prevents progress on Gwylan's storyline for that day */
		preventProgress: boolean;

		/** Prevents Gwylan from showing up at the cafe that day */
		cafeSkip: boolean;

		/** Has Gwylan been to the cafe today? */
		cafe: boolean;

		/** Prevents Gwylan from hunting */
		noHunt: boolean;

		/** Prevents PC from being able to talk with Gwylan that day*/
		noTalk: boolean;

		/** The forest shop is locked for the day */
		shopLocked: boolean;

		/** Has Gwylan orgasmed today?
		 * Not used currently */
		orgasm: boolean;

		/** How many times PC talked to Gwylan about a clothing set that day (apart from date unlock conditions)
		 * Is set with Gwylan's talk options at the forest shop, a value of 3 prevents talking about other sets that day */
		clothesTalk: 0 | 1 | 2 | 3;

		/** Gwylan's intro played this day */
		firstMet: boolean;

		/** Gwylan spied on PC that day
		 * Prevents them from doing it multiple times a day */
		spy: boolean;

		/** Gwylan failed to rescue PC from Eden after they also came to rescue PC that day */
		edenRescueFailed: boolean;

		/** PC talked to Gwylan about a traumatic memory */
		traumaTalk: boolean;

		/** PC changed their mind about doing the ritual with Gwylan */
		eventCancelled: boolean;

		/** Has PC found Gwylan in the shop that day? */
		foundInShop: boolean;

		/** Has Gwylan seen PC that day? */
		seenToday: boolean;

		/** Has PC declined Gwylan's offer to walk them to school? */
		skipSchool: boolean;

		/** Has Gwylan talked about the weather that day?
		 * Prevents them from mentioning it multiple times a day */
		weatherTalk: boolean;

		/** Has PC asked for the Brown Fox that day? */
		askedForBrownFox: boolean;

		/** Watched the sea with Gwylan that day */
		watchedSea: boolean;

		/** Done hypnosis that day */
		hypnosis: boolean;

		/** Kissed Gwylan that day */
		kiss: boolean;

		/** Has PC finished a request that day? */
		requestCompleted: boolean;

		/** Unlocked the jasper necklace that day */
		jasper: boolean;

		/** How many times PC has asked to (un)lock the collar that day */
		collarLock: 1 | 2;

		/** PC asked to do the ritual before breakfast that day */
		ritualRequestBlocked: boolean;

		/** Has done the ritual that day */
		ritual: boolean;

		/** Has seen a shop event that day */
		eventShop: boolean;

		/** Declined Gwylan's offer to go to the cafe with them that day */
		cafeOfferDeclined: boolean;

		/** Has Gwylan declined to talk about another clothing set */
		enoughTalk: boolean;

		/** Has PC served Gwylan at the cafe that day */
		cafeServe: boolean;

		/** Has Gwylan ran into PC on danube or domus */
		streetMeetup: boolean;
	}

	export interface GwylanWeekly {
		/** Disables heat */
		noHeat: boolean;

		/** Prevents Gwylan from hunting */
		noHunt: boolean;

		/** Prevents Gwylan from luring PC */
		noLure: boolean;

		/** Makes Gwylan ask about the cream buns only once in a week */
		cafeConfront: boolean;

		/** Makes Gwylan only talk to Robin about their crossdressing once a week
		 * Inaccessible, TODO: Gwybin */
		robinCrossdressingTalk: boolean;

		/** Makes sublime devotion scene happen once a week */
		deepestDevotion: boolean;

		/** Makes Gwylan bringing out the pet bed for a high fatigue PC without doing a request happen once a week */
		petBedException: boolean;

		/** Makes high trauma scene in forest shop only happen once a week */
		trauma: boolean;

		/** Makes Gwylan ask to go to the promenade only once a week */
		promenade: boolean;

		/** Makes Gwylan ask about PC's school classes only once a week */
		schoolClassesTalk: boolean;
	}
}

export {};
