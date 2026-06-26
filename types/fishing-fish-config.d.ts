declare module "twine-sugarcube" {
	export interface SugarCubeSetupObject {
		fishingFish: Dict<FishingFishConfigItem>;
	}
}

declare global {
	export type FishingFishKey =
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
		| "grayling";
	export type FishingCatchStrategy = "steadyPressure" | "pumpAndWind" | "letItRun";
	export type FishingFishPreferredTime = "dawn" | "day" | "dusk" | "night" | "bloodMoon";
	export type FishingFishPreferredWeather =
		| "clear"
		| "lightClouds"
		| "heavyClouds"
		| "lightPrecipitation"
		| "heavyPrecipitation"
		| "storm"
		| "thunderstorm";

	export interface FishingFishConfigItem {
		minSize: number; // Minimum fish size.
		maxSize: number; // Maximum fish size.
		catchDifficulty: number; // Relative difficulty to catch.
		catchStrategy: FishingCatchStrategy; // Correct response option during the bite minigame.

		// Preferred params are where/how to catch the largest size of the fish, and does not affect catch frequency.
		preferredSeason: Season[];
		preferredTime: FishingFishPreferredTime[];
		preferredLocation: FishingLocationKey[];

		// Preferred weather is also used to weight the spawning of fish with that preferred weather
		preferredWeather: FishingFishPreferredWeather[];
	}
}

export {};
