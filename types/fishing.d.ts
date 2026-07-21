type FishingLocationKey = "beach" | "pier" | "coastPath" | "forestLake" | "moor";

declare module "twine-sugarcube" {
	export interface SugarCubeSetupObject {
		fishing: FishingSetup;
	}

	export interface SugarCubeStoryVariables {
		fishing: FishingState;
		fishingHookedFish: FishingHookedFish | undefined;
		fishingTrash: FishingTrashCatch | undefined;
		fishingClothingName: string | undefined;
		fishingReelAttempts: number;
	}
}

declare global {
	/* ---- setup.fishing ---- */

	interface FishingSetup {
		lootTables: FishingLootTables;
		reelFightMinSize: number;
	}

	interface FishingLootTables {
		fish: Record<string, FishConfig>;
		magnetLoot: Record<string, MagnetLootConfig>;
		trash: Record<string, TrashConfig>;
		clothing: Record<string, ClothingConfig>;
	}

	interface FishConfig {
		minSize: number;
		maxSize: number;
		preferredSeason: string[];
		preferredTime: string[];
		preferredLocation: FishingLocationKey[];
		preferredWeather: string[];
		locations: Partial<Record<FishingLocationKey, number>>;
		cookable: boolean;
		icon: string;
	}

	interface MagnetLootConfig {
		name: string;
		value: number;
		weight: number;
		big?: true;
		locations?: FishingLocationKey[];
	}

	interface TrashConfig {
		weight: number;
		isLitter?: boolean;
		locations?: FishingLocationKey[];
	}

	interface ClothingConfig {
		weight: number;
		locations?: FishingLocationKey[];
	}
}

export {};
