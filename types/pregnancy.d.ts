declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		pregnancies: Pregnancy[];
		childRecords: Child[];

		cumLoads: {
			vagina: Load[];
			anus: Load[];
		};
		pendingPregnancies: {
			vagina: PendingPregnancy | null;
			anus: PendingPregnancy | null;
		};

		sexStats: SexStats;
		pregnancyStats: PregnancyStats;
		storedNPCs: Record<string, { npc: Partial<Npc> }>;
		/** Queued baby introductions at the orphanage by Bailey. Created on first use. */
		babyIntros?: Record<NpcOrPc, BabyIntro[]>;
		harpyEggs?: { count: 1 | 2 | 3 | 4; daysTillLaying: number };
		/** Days before giveHarpyEggs can give the PC eggs again. */
		harpyEggsPrevent?: number;
		childSelected?: Child;
		childViewerPage?: number;
		recentBirthId?: PregnancyId;
	}
}

declare global {
	/** An index into $pregnancies. */
	export type PregnancyId = number;
	/** An index into $childRecords. */
	export type ChildId = number;
	/** "pc", a named NPC's name, a $storedNPCs key, or a generated NPC's description. */
	export type NpcOrPc = string;

	export interface Pregnancy {
		pregnancyId: PregnancyId;
		/** Becomes the generated NPC's description once born, or "cleared" once cleared. */
		carrier: NpcOrPc;
		/** "human" for the PC. */
		carrierSpecies: PregnancySpecies;
		donor: NpcOrPc;
		donorSpecies: PregnancySpecies;
		possibleDonors: PossibleDonor[];
		conceivedDate: TimeStamp;
		/** $location at conception, or "unknown". */
		conceivedLocation: string;
		/** Multiplies the gestation length, 0.9 to 1.1. */
		gestationVariance: number;
		orifice: "vagina" | "anus";
		/** Seconds added to an egg clutch's hatch date. */
		hatchDelay?: number;
		/** Seconds taken off an egg clutch's lay date. */
		layCare?: number;
		/** The birth or lay. null while still carried. */
		deliveredDate: TimeStamp | null;
		deliveredLocation: string | null;
		waterBreaking?: boolean;
		birthInProgress?: boolean;
		litterBorn?: true;
		termEffectsDone?: true;
		ultrasoundDone?: true;
		awareOfMultiple?: true;
		awareOfPregnancy: NpcOrPc[];
		awareOfCarrier: NpcOrPc[];
		awareOfDonor: NpcOrPc[];
		talkedAbout: Record<NpcOrPc, true>;
		playerLearnedFrom: "mirror" | "museum" | "pharmacy" | "pregnancyTest" | "temple" | "wakingUp" | null;
	}

	export interface PossibleDonor {
		name: NpcOrPc;
		species: PregnancySpecies;
	}

	export interface ChildParent {
		gender: "m" | "f" | "h" | null;
		hairColour: string | null;
		eyeColour: string | null;
		skinColour: string | null;
	}

	export type PregnancySpecies = "human" | "wolf" | "wolfboy" | "wolfgirl" | "hawk" | "harpy";
	export type ChildSpecies = "human" | "wolf" | "hawk";
	/** Where a child lives. "unknown" comes from the debug menu. */
	export type ChildLocation = "home" | "wolf_cave" | "tower" | "alex_cottage" | "inventory" | "unknown";

	export interface Child {
		childId: ChildId;
		pregnancyId: PregnancyId;
		species: ChildSpecies;
		features: Features;
		gender: "m" | "f" | "h";
		/** Shared by identical siblings. null if none. */
		identical: PregnancyId | null;
		development: Development;
		/** The birth or hatch. null before it. */
		bornDate: TimeStamp | null;
		name: string | null;
		coParents: NpcOrPc[];
		awareOfChild: NpcOrPc[];
		awareOfGender: NpcOrPc[];
	}

	/** Keys can be missing on adopted hawks and children migrated from old saves. */
	export interface Features {
		/** Set when the donor is a monster person. Adopted hawks and migrated children can hold 0 instead. */
		monster?: "monster";
		size?: "tiny" | "small" | "normal" | "large";
		/** A parent's hair colour, or a fur or feather colour. */
		hairColour?: string;
		eyeColour?: string;
		/** "ghost", "light", "medium", "dark", or the PC's skin colour name. Children migrated from old saves can hold other values. */
		skinColour?: string;
		beastTransform?: "cat" | "cow" | "wolf" | "bird" | "fox" | null;
		divineTransform?: "angel" | "fallen" | "demon" | null;
	}

	export type ChildActivity =
		| "noEvent"
		| "babyRattle"
		| "bathe"
		| "batheSelf"
		| "chewBone"
		| "chewBone2"
		| "chewRope"
		| "chewRope2"
		| "clown"
		| "clownHappy"
		| "crying"
		| "dummy"
		| "dummySucking"
		| "flap"
		| "gnawing"
		| "grumpyChild"
		| "grumpyWolf"
		| "happy"
		| "hungryWolf"
		| "lonely"
		| "lurkerEat"
		| "nappyChange"
		| "perch"
		| "playFighting"
		| "playing"
		| "preen"
		| "reaching"
		| "readingAttempt"
		| "readingCorrected"
		| "restlessSleep"
		| "Robin"
		| "rollBall"
		| "rollBall2"
		| "sleeping"
		| "sleepingWithGreatHawk"
		| "sleepingWithWolf"
		| "squeakyToy"
		| "squeakyToy2"
		| "staringOutside"
		| "talking"
		| "talking2"
		| "teddyBear"
		| "teddyBear2"
		| "thumbSucking"
		| "toyCar"
		| "watchingCurious"
		| "watchingLonging"
		| "Wraith";

	/** Every field is missing until the birth or lay. */
	export interface Development {
		location?: ChildLocation;
		/** Where the birth or lay happened. */
		birthLocation?: string;
		activity?: ChildActivity;
		event?: boolean;
		/** Time.days of the last activity update. */
		activityDay?: number;
		/** Time.hour of the last activity update. */
		activityHour?: number;
		crawling?: number;
		talking?: number;
		toy?: string | null;
		acceptsDummy?: boolean;
		firstWord?: string | null;
		interactions?: number;
		interactionsTotal?: number;
		adoptedDate?: TimeStamp;
	}

	export interface Load {
		donor: NpcOrPc;
		donorSpecies: PregnancySpecies;
		time: TimeStamp;
		/** Conception weight: depth weight times potency. */
		weight: number;
		canWash: boolean;
		/** Seconds it stays fertile. */
		lifespan: number;
		location: string;
		/** The day of the load's own life it last took a conception roll on. Absent until its first roll. */
		rolledDay?: number;
	}

	export interface PendingPregnancy {
		carrierSpecies: "human";
		donor: NpcOrPc;
		donorSpecies: PregnancySpecies;
		possibleDonors: PossibleDonor[];
		conceivedDate: TimeStamp;
		conceivedLocation: string;
	}

	export interface Menstruation {
		currentState: "normal" | "recovering" | "pregnant";
		currentDay: number;
		currentDaysMax: number;
		/** 24 to 38. */
		baseDays: number;
		/** -4 to 4. */
		baseDaysRng: number;
		/** [cycleStart, menstrualEnd, ovulationStart, ovulationEnd] in cycle days. */
		stages: [number, number, number, number];
		/** 5 to 7. */
		fertileLeadDays: number;
		periodEnabled: boolean;
		running: boolean;
		/** Missing until the PC's first birth. */
		awareOfPeriodDelay?: boolean;
		/** null unless recovering. */
		recoveryTime: number | null;
		recoveryTimeStart: number | null;
		/** null unless recovering. */
		recoveryStage: 0 | 1 | 2 | 3 | 4 | null;
	}

	export type PillName =
		| "bottom reduction"
		| "bottom growth"
		| "bottom blocker"
		| "breast reduction"
		| "breast growth"
		| "breast blocker"
		| "penis reduction"
		| "penis growth"
		| "penis blocker"
		| "fertility booster"
		| "contraceptive"
		| "asylum's prescription"
		| "Dr Harper's prescription"
		| "Anti-Parasite Cream"
		| "Hair Growth Formula";

	export interface PillState {
		autoTake: boolean;
		doseTaken: number;
		owned: number;
		overdose: number;
	}

	export type PillBodyEffect = "growth" | "reduction" | "blocker";

	export interface Parasite {
		creature: string;
		fertilised: boolean;
		daysLeft: number;
		/** Minutes until its next event. null until fertilised. */
		timeLeft: number | null;
		stats: {
			growth: number;
			speed: number;
			gender: "Female" | "Male" | "Hermaphrodite";
			/** Hermaphrodites only. Days until it lays another egg. */
			lastEgg?: number;
		};
		/** Set when it is birthed, before the fetus list is filtered. */
		toDelete?: true;
	}

	export interface OrificePregnancyStats {
		fetus: Parasite[];
		type: "parasite" | null;
		givenBirth: number;
		parasiteBirthEvents: number;
		totalBirthEvents: number;
		/** How many parasites fit: 0 is 1, 1 is 2, 2 is 4. */
		motherStatus: 0 | 1 | 2;
		parasiteFeltMovement?: boolean;
		/** @deprecated Left over from the old pregnancy system. */
		awareOf?: string | null;
		/** @deprecated Left over from the old pregnancy system. */
		timer?: number | null;
		/** @deprecated Left over from the old pregnancy system. */
		timerEnd?: number | null;
		/** @deprecated Left over from the old pregnancy system. */
		potentialFathers?: { type: string; source: string }[];
		/** @deprecated Left over from the old pregnancy system. */
		waterBreaking?: boolean;
		/** @deprecated Left over from the old pregnancy system. */
		waterBreakingTimer?: number | null;
	}

	export interface CreampieCounts {
		anus: number;
		mouth: number;
		vagina: number;
	}

	export interface SexStats {
		breasts: { playedWith: number };
		creampie: { self: CreampieCounts; npc: CreampieCounts };
		pills: {
			pills: Record<PillName, PillState> & { "anti-parasite"?: PillState };
			boughtOnce: boolean;
			lastTaken: {
				bottom: PillBodyEffect | "";
				breast: PillBodyEffect | "";
				penis: PillBodyEffect | "";
				pregnancy: "fertility booster" | "contraceptive" | "";
				parasite?: "Anti-Parasite Cream";
				hair?: "Hair Growth Formula";
				asylum?: undefined;
				harper?: undefined;
			};
			mostTaken: {
				bottom: PillBodyEffect | "";
				breast: PillBodyEffect | "";
				penis: PillBodyEffect | "";
				pregnancy?: "";
				parasite?: undefined;
				hair?: undefined;
				asylum?: undefined;
				harper?: undefined;
			};
		};
		vagina: { pregnancy: OrificePregnancyStats; menstruation: Menstruation };
		anus: { pregnancy: OrificePregnancyStats };
	}

	export interface NpcPregnancyCycle {
		enabled: boolean;
		/** 24 to 32, 12 to 16 for the Great Hawk. */
		cycleDaysTotal: number;
		cycleDay: number;
		/** 10, or cycleDaysTotal - 4 for the Great Hawk. */
		cycleDangerousDay: number;
		/** 5 to 7. */
		fertileLeadDays: number;
		analEnabled: boolean;
		pills: "fertility" | "contraceptive" | null;
	}

	export interface BabyIntro {
		birthId: PregnancyId;
		/** The pregnancy's carrier. */
		mother: NpcOrPc;
		/** Litter size. */
		children: number;
		/** Set for carriers who are not named NPCs. */
		description?: "stranger";
	}

	export interface PregnancyStats {
		playerChildren: number;
		humanChildren: number;
		wolfChildren: number;
		hawkChildren: number;
		npcChildren: number;
		npcChildrenUnrelatedToPlayer: number;
		npcTotalBirthEvents: number;
		humanToysUnlocked: boolean;
		wolfToysUnlocked: boolean;
		hawkToysUnlocked: boolean;
		aftermorningpills: number;
		pregnancyTestsTaken: number;
		parasiteBook: 0 | 1 | 2 | 3;
		parasiteDoctorEvents: 0 | 1 | 2 | 3 | 4;
		morningSicknessGeneral: 0 | 1;
		/** 0 none, 1 moderate, 2 severe. */
		morningSicknessWaking: 0 | 1 | 2;
		childInteractions: number;
		childBreastfedInteractions: number;
		childBottlefedInteractions: number;
		childFirstWordInteractions: number;
		orphanageInteractions: number;
		orphanageMilkBottles: number;
		orphanageMilkBottlesTotal: number;
		playerVirginBirths: PregnancyId[];
		/** Goes up by 0.5 twice a day, at noon and midnight. */
		totalDaysPregnant: number;
		/** Goes up by 0.5 twice a day while the PC knows they are pregnant. */
		totalDaysPregnancyKnown: number;
		parasiteTypesSeen: string[];
		parasiteVariantsSeen: string[];
		heatStillEnabled?: boolean;
		namesParasitesChild?: boolean;
		/** @deprecated Old saves only. Read and deleted by the pregnancy records migration. */
		awareOfBirthId?: Record<string, (number | "pc")[]>;
		/** @deprecated Old saves only. Read and deleted by the pregnancy records migration. */
		talkedAboutPregnancy?: Record<string, Record<string, number>>;
	}

	export type MorningAfterPillResult = "notPregnant" | "success" | "aLittleLate" | "late" | "tooLate";
}

export {};
