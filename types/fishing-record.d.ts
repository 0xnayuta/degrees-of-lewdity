declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		fishing: FishingState;
		fishingRecord: Dict<FishingRecordItem>;
	}
}

declare global {
	export interface FishingState {
		locationsFound: FishingLocationKey[];
		[key: string]: any;
	}

	export interface FishingRecordItem {
		num_caught: number; // Total number caught for this fish.
		largest: number; // Largest size caught.
		smallest: number; // Smallest size caught.
		found_in: FishingLocationKey[]; // Locations where this fish has been caught.
	}
}

export {};
