type FishingLocationKey = "fishingBeach" | "fishingPier" | "fishingCoastPath" | "fishingForestLake" | "fishingMoor";

type FishingFishKey =
	| "haddock"
	| "salmon"
	| "trout"
	| "cod"
	| "herring"
	| "whiting"
	| "mackerel"
	| "flounder"
	| "sole"
	| "bass"
	| "roach"
	| "perch"
	| "chub"
	| "pike"
	| "eel"
	| "grayling"
	| "minnow"
	| "sprat";
type FishingFishPreferredTime = "dawn" | "day" | "dusk" | "night" | "bloodMoon";
type FishingFishPreferredWeather = "clear" | "lightClouds" | "heavyClouds" | "lightPrecipitation" | "heavyPrecipitation" | "storm" | "thunderstorm";

declare module "twine-sugarcube" {
	export interface SugarCubeSetupObject {
		fishing: FishingSetup;
	}
}

declare global {
	interface FishingSetup {
		lootTables: FishingLootTables;
		reelFightMinSize: number;
	}

	interface FishingLootTables {
		fish: Record<FishingFishKey, FishConfig>;
		magnetScrap: Record<string, MagnetScrapConfig>;
		fishingTrash: Record<string, TrashConfig>;
		fishingClothing: Record<string, ClothingConfig>;
	}

	interface FishConfig {
		minSize: number;
		maxSize: number;
		// Preferred params are where/how to catch the largest size of the fish, and does not affect catch frequency.
		preferredSeason: Season[];
		preferredTime: FishingFishPreferredTime[];
		preferredLocation: FishingLocationKey[];
		// Preferred weather is also used to weight the spawning of fish with that preferred weather.
		preferredWeather: FishingFishPreferredWeather[];
		locations: Partial<Record<FishingLocationKey, number>>;
		requiresBaitFish?: true;
		isBaitFish?: true;
		cookable: boolean;
		icon: string;
	}

	interface MagnetScrapConfig {
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
