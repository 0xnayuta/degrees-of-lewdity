declare module "twine-sugarcube" {
	export interface SugarCubeSetupObject {
		fishing_fish: Dict<FishingFishConfigItem>;
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
		| "sea_bass"
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
		min_size: number; // Minimum fish size.
		max_size: number; // Maximum fish size.
		catch_difficulty: number; // Relative difficulty to catch.
		catch_strategy: FishingCatchStrategy; // Correct response option during the bite minigame.
		
		// Preferred params are where/how to catch the largest size of the fish, and does not affect catch frequency.
		preferred_season: Season[];
		preferred_time: FishingFishPreferredTime[];
		preferred_location: FishingLocationKey[];
		preferred_weather: FishingFishPreferredWeather[];
	}
}

export {};
