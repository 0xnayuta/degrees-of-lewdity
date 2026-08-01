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
	}
}

declare global {
	export interface Pregnancy {
		pregnancyId: number;
		carrier: string;
		carrierSpecies: string;
		donor: string;
		donorSpecies: string;
		possibleDonors: PossibleDonor[];
		conceivedDate: number;
		conceivedLocation: string;
		orifice: "vagina" | "anus";
		hatchDelay?: number;
		deliveredDate: number | null;
		deliveredLocation: string | null;
		waterBreaking?: boolean;
		birthInProgress?: boolean;
		termEffectsDone?: boolean;
		awareOfPregnancy: string[];
		awareOfCarrier: string[];
		awareOfDonor: string[];
		awareOfMultiple?: boolean;
		talkedAbout: Record<string, boolean>;
		playerLearnedFrom: string | null;
	}

	export interface PossibleDonor {
		name: string;
		species: string;
	}

	export interface Child {
		childId: number;
		pregnancyId: number;
		species: string;
		features: Features;
		gender: "m" | "f" | "h";
		identical: number | null;
		development: Development;
		bornDate: number | null;
		name: string | null;
		coParents: string[];
		awareOfChild: string[];
		awareOfGender: string[];
	}

	export interface Features {
		monster?: "monster";
		size?: string;
		hairColour?: string;
		eyeColour?: string;
		skinColour?: string;
		beastTransform?: "cat" | "cow" | "wolf" | "bird" | "fox" | null;
		divineTransform?: "angel" | "fallen" | "demon" | null;
	}

	export interface Development {
		location?: string;
		birthLocation?: string;
		activity?: string | null;
		event?: boolean;
		activityDay?: number;
		activityHour?: number;
		crawling?: number;
		talking?: number;
		toy?: string | null;
		acceptsDummy?: boolean;
		firstWord?: string | null;
		interactions?: number;
		interactionsTotal?: number;
	}

	export interface Load {
		donor: string;
		donorSpecies: string;
		time: number;
		weight: number;
		canWash: boolean;
		lifespan: number;
		location: string;
	}

	export interface PendingPregnancy {
		carrierSpecies: string;
		donor: string;
		donorSpecies: string;
		possibleDonors: PossibleDonor[];
		conceivedDate: number;
		conceivedLocation: string;
	}

	export type MorningAfterPillResult = "notPregnant" | "success" | "aLittleLate" | "late" | "tooLate";

	function pushPregnancyRecord(fields: Partial<Pregnancy>): number;
	function pushChildRecord(fields: Partial<Child>): number;
	function createPregnancy(
		carrier: string,
		carrierSpecies: string,
		donor: string,
		donorSpecies: string,
		possibleDonors: PossibleDonor[],
		conceivedDate: number,
		orifice: "vagina" | "anus",
		conceivedLocation: string
	): number;
	function createChild(pregnancyId: number, species: string, features: Features, gender: "m" | "f" | "h", identical: number | null): number;
	function gestationSeconds(species: string): number;
	function getDueDate(pregnancy: Pregnancy): number;
	function getHatchDate(pregnancy: Pregnancy): number;
	function pregnancyProgress(pregnancy: Pregnancy): number;
	function recordDelivery(pregnancyId: number, deliveredLocation: string): void;
	function recordBirth(childId: number): void;
	function checkLabour(): void;
	function addEggCare(pregnancyId: number, seconds: number): void;

	function setKnowsPregnancy(pregnancyId: number, who: string): void;
	function setPlayerLearnedFrom(pregnancyId: number, source: string): void;
	function setKnowsCarrier(pregnancyId: number, who: string): void;
	function setKnowsDonor(pregnancyId: number, who: string): void;
	function setKnowsChild(childId: number, who: string): void;
	function setKnowsGender(childId: number, who: string): void;
	function knowsPregnancy(pregnancyId: number, who: string): boolean;
	function knowsCarrier(pregnancyId: number, who: string): boolean;
	function knowsDonor(pregnancyId: number, who: string): boolean;
	function knowsChild(childId: number, who: string): boolean;
	function knowsGender(childId: number, who: string): boolean;
	function hasTalkedAbout(pregnancyId: number, who: string): boolean;
	function markTalkedAbout(pregnancyId: number, who: string): void;
	function couldBeDonor(pregnancy: Pregnancy, name: string): boolean;
	function resolvePaternity(pregnancyId: number): void;

	function getActivePregnancy(carrier: string, orifice: "vagina" | "anus"): Pregnancy | undefined;
	function getActivePregnancies(carrier: string): Pregnancy[];
	function getLabouringPregnancy(carrier: string): Pregnancy | undefined;
	function getLabouringLitter(carrier: string): Child[];
	function getPregnancyOf(child: Child): Pregnancy;
	function getChildrenOf(pregnancyId: number): Child[];
	function getSiblingsOf(child: Child): Child[];
	function getIdenticalTwinsOf(child: Child): Child[];
	function childIsBorn(child: Child): boolean;
	function childIsUnhatchedEgg(child: Child): boolean;
	function getBornChildren(): Child[];
	function getChildrenAt(location: string): Child[];
	function childAgeOf(child: Child): number;
	function beginRearing(child: Child, location: string, birthLocation: string): void;
	function birthRecordedLitter(pregnancyId: number, birthLocation: string, location: string): boolean;

	function migrateChildrenToRecords(): Record<string, number>;
	function applyLegacyPregnancyState(carrier: string, oldBirthId: number, pregnancyId: number): void;
	function migrateChildFeatures(oldFeatures: object): Features;
	function migrateInflightPregnanciesToRecords(): void;
	function migrateNpcInflightPregnanciesToRecords(): void;

	function inseminate(
		orifice: "vagina" | "anus",
		donor: string,
		donorSpecies: string,
		depth: "outside" | "imminent" | "deep",
		location: string,
		potency: number,
		lifespan: number | null
	): Load | null;
	function recordLoad(
		orifice: "vagina" | "anus",
		donor: string,
		donorSpecies: string,
		weight: number,
		canWash: boolean,
		lifespan: number,
		location: string
	): Load;
	function loadIsLive(load: Load): boolean;
	function trimExpiredLoads(): void;
	function washLoads(): void;
	function hourlyPregnancyUpdate(): void;
	function rollAndRecordConception(orifice: "vagina" | "anus"): void;
	function hourlyConceptionChance(perEncounter: number): number;
	function recordPendingPregnancy(orifice: "vagina" | "anus", load: Load): void;
	function startDuePregnancies(): void;
	function fetishPregnancyRoll(load: Load): Load | null;
	function takeMorningAfterPill(): MorningAfterPillResult;

	function childBaseSpecies(donorSpecies: string): "human" | "wolf" | "hawk";
	function isMonsterPerson(donorSpecies: string): boolean;
	function rollLitterSize(base: string, boost?: { twin: number; triplet: number }): number;
	function playerLitterBoost(): { twin: number; triplet: number };
	function resolveChildParent(name: string): { gender: string | null; hairColour: string | null; eyeColour: string | null; skinColour: string | null };
	function rollChildGender(carrierParent: { gender: string | null }, donorParent: { gender: string | null }, sameParent: boolean): "m" | "f" | "h";
	function pcHeritage(): { beast: string | null; divine: string | null };
	function rollChildColours(
		base: string,
		carrierParent: { hairColour: string | null; eyeColour: string | null; skinColour: string | null },
		donorParent: { hairColour: string | null; eyeColour: string | null; skinColour: string | null },
		wolfFur: string[]
	): { hairColour: string; eyeColour: string; skinColour: string };
	function generateChildren(pregnancyId: number): void;
	function playerKnowsLitterSpecies(pregnancy: Pregnancy): boolean;
	function playerConceivedWith(name: string): boolean;

	function combatInseminate(slot: number, beast?: boolean): Load | null;
	function sceneInseminate(
		orifice: "vagina" | "anus",
		donor: string,
		donorSpecies: string,
		depth: "outside" | "imminent" | "deep",
		quantity?: number,
		days?: number | null
	): Load | null;
	function fetishConception(orifice: "vagina" | "anus", load: Load): void;
	function npcPregnancyRoll(
		carrier: string,
		carrierSpecies: string,
		donor: string,
		donorSpecies: string,
		orifice: "vagina" | "anus",
		depth?: "outside" | "imminent" | "deep",
		location?: string
	): number | null;

	function canConceive(orifice: "vagina" | "anus", donorSpecies: string, carrier: string, infertile: boolean): boolean;
	function carrierHasWomb(carrier: string): boolean;
}

export {};
