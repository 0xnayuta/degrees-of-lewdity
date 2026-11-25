declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		worn: {
			butt_plug?: SexToy;
		} & {
			[x in ClothedSlots]: ClothesItem;
		};
		store: {
			[x in ClothedSlots]: ClothesItem[];
		};
		tryOn: {
			autoReset: boolean;
			ownedStored: {
				[x in ClothedSlots]: ClothesItem?;
			};
			tryingOn: {
				[x in ClothedSlots]: ClothesItem?;
			};
			showEquip: {
				[x: string]: any;
			};
			showUnderEquip: {
				[x: string]: any;
			};
			type: any;
			value: number;
		};
		carried: {
			[x in ClothedSlots]: ClothesItem;
		};
		wardrobe: Wardrobe;
		wardrobes: {
			shopReturn: string;
			wardrobe: {
				NOTE: string;
				name: string;
				unlocked: boolean;
				shopSend: boolean;
				transfer: boolean;
			};
			changingRoom: Wardrobe;
			edensCabin: Wardrobe;
			asylum: Wardrobe;
			alexFarm: Wardrobe;
			stripClub: Wardrobe;
			brothel: Wardrobe;
			schoolBoys: Wardrobe;
			schoolGirls: Wardrobe;
			prison: Wardrobe;
			temple: Wardrobe;
			pirate: Wardrobe;
			officeBuilding: Wardrobe;
			birdTower: Wardrobe;
			avery_mansion: Wardrobe;
		};
		outfit: ClothingSet[];
		lowerwetstage: number;
		underlowerwetstage: number;
		specialClothes: specialClothesItem[];
		wardrobe_location: WardrobeLocation;
		lastWardrobeSlot: ClothedSlots | "all";
		wardrobeDefaults: {
			showTraits: boolean;
			showExtraInfo: boolean;
			sort: WardrobeSort;
			itemsPerPage: number;
		};
		shopName: string;
		clothingShopSlot: ClothedSlots | "all";
		shopItemSlot?: ClothedSlots;
		clothes_choice?: number;
		colouraction?: string;
		accessorycolouraction?: string;
		customColors: ShopCustomColours;
		shopPage: number;
		shopItemsPerPage: number;
		showMannequins?: 0 | 1;
		shopDefaults: {
			color: string;
			colorSet: string | null;
			secColor: string;
			secColorSet: string | null;
			stayOnItemAfterBuying: boolean;
			alwaysShowBackToShop: boolean;
			hideHelp: boolean;
			hideTraits: boolean;
			highContrastEnabled: boolean;
			mannequinGender: "same" | "opposite" | "male" | "female";
			useClothingGenderForMannequin: boolean;
			colourItems: "disable" | "random" | "default";
			compactModeEnabled: boolean;
			hideUnavailable: boolean;
			hideAvailable: boolean;
		};
	}

	export interface SugarCubeSetupObject {
		clothes: {
			[x in ClothesSlots]: ClothesItem[];
		} & {
			/** Every item from every slot, built by init.js. */
			all: ClothesItem[];
		};
		moddedClothes: {
			[x in ClothesSlots]: ClothesItem[];
		};
		clothes_all_slots: ClothedSlots[];
		clothingStates: ZeroedClothingStates[];
		specialClothes: SpecialClothesSetup[];
		specialClothesSets: {
			[x: string]: SpecialClothesSetsSetup;
		};
		sextoys: SexToy[];
		propDefaults: PropSetup;
		props: {
			[x: string]: PropSetup;
		};
		moddedProps: {
			[x: string]: PropSetup;
		};
		clothingLayer: Record<"all" | "body" | "torso" | "torso_inner" | "torso_outer" | "over" | "upper" | "lower", ClothedSlots[]>;
		shopDetails: Record<string, { name: string; desc?: string; details?: string }>;
	}

	export interface SugarCubeTemporaryVariables {
		wardrobeView?: WardrobeView;
		shopView?: ShopView;
		hairMirrorView?: HairMirrorView;
	}
}

declare global {
	export type ClothingStates = "chest" | "midriff" | "waist" | "thighs" | "knees" | "ankles" | "totheside" | "worn";

	export type ZeroedClothingStates = 0 | ClothingStates;

	export type TotalClothingStates = ZeroedClothingStates | "default" | "full" | "bound" | "handjob" | "up" | "down" | "footjob" | "neck" | "worn";

	export type ClothesSlots = "clothes_all_slots" | ClothedSlots;

	export type ClothedSlots =
		| "over_upper"
		| "over_lower"
		| "upper"
		| "lower"
		| "under_upper"
		| "under_lower"
		| "over_head"
		| "head"
		| "face"
		| "neck"
		| "hands"
		| "handheld"
		| "legs"
		| "feet"
		| "genitals";

	export type SexToySlots = "strap-on" | "vibrator" | "dildo" | "butt_plug" | "lube" | "stroker" | "aphrodisiacpill" | "breastpump";

	export interface SexToy {
		index: number;
		name: string;
		name_cap: string;
		name_underscore: string;
		description: string;
		cost: number;
		wearable: 0 | 1;
		size: number;
		shape?: string;
		category: SexToySlots;
		type: string[];
		icon: string;
		colour: 0 | 1;
		colour_options: string[];
		default_colour: string[];
		owned: setup.sextoyFunctions.owned;
		isCarried: setup.sextoyFunctions.isCarried;
		isWorn: setup.sextoyFunctions.isWorn;
		unWear: setup.sextoyFunctions.unWear;
		unCarry: setup.sextoyFunctions.unCarry;
		shop: string[];
		display_condition: function;
	}
	export interface ClothesItem {
		index: number;
		slot: ClothedSlots;
		name: string;
		name_cap: string;
		name_simple?: string;
		/**
		 * Folder name
		 */
		variable: string;
		/**
		 *
		 */
		combat?: {
			reference?: string;
			renderType?: CombatClothingTypes;
			hasMainImg?: boolean;
			hasSleeves?: boolean;
			hasSleevesAcc?: boolean;
			hasBreasts?: boolean;
			hasBreastsAcc?: boolean;
			hasJoinedLimbs?: boolean;
			hasJoinedLimbsAcc?: boolean;
			accessory?: boolean;
			mainColour?: string;
			accColour?: string;
			sleeveAccColour?: string;
			sleeveColour?: string;
			boundable?: boolean;
			pattern?: boolean;
		};
		/**
		 * Flimsy <20
		 *
		 * Fragile >=20 e.g. babydoll lingerie
		 *
		 * Delicate >=50 e.g. crop top
		 *
		 * Fine >=100
		 *
		 * Firm >=200
		 *
		 * Sturdy >=500
		 *
		 * Tough >=900 e.g. chastity belts
		 *
		 * Exception: gold chastity belt 6000
		 */
		integrity?: number;
		integrity_max?: number;
		/**
		 * Unassuming 0-100
		 *
		 * Smart 100-200
		 *
		 * Tasteful 200-300
		 *
		 * Comfy 300-500
		 *
		 * Seductive 500-700
		 *
		 * Risque 700-900
		 *
		 * Lewd 900-
		 */
		reveal?: number;
		/**Breast size modifier e.g. chest wrap*/
		bustresize?: number;
		/**
		 * 1 for a piece of an outfit, 0 for anything else.
		 *
		 * "split" once the outfit is cut into separate pieces
		 *
		 * "broken" once another of its pieces was destroyed.
		 */
		one_piece?: 0 | 1 | "split" | "broken";
		/**For uppers, text flag like 'untie the strap behind your neck.'*/
		strap?: number;
		/** Combat related */
		open?: number;
		/**
		 * a: A skirt.
		 *
		 * n: Pyjamas.
		 *
		 * an: An outfit.
		 */
		word: "a" | "n" | "an";
		/** Combat related */
		state: ZeroedClothingStates;
		state_base: 0 | string;
		state_top?: 0 | string;
		state_top_base?: 0 | string;
		/** Whether it's a skirt */
		skirt?: 0 | 1;
		skirt_down?: 0 | 1;
		/**
		 * 0 - Not exposed.
		 *
		 * 1 - For under_lower, this is fully exposed genitals. For under_upper, this is fully exposed breasts.
		 *
		 * 2 - Fully exposed for all else.
		 */
		exposed?: 0 | 1 | 2;
		/** Whether the item is plural */
		plural: number;
		/** Starting number of exposed */
		exposed_base?: number;
		vagina_exposed?: number;
		vagina_exposed_base?: number;
		anus_exposed?: number;
		anus_exposed_base?: number;
		type: string[];
		set?: string;
		gender?: string;
		femininity?: number;
		warmth: number;
		cost?: number;
		description: string;
		shop?: string[];
		/**
		 * key in setup.colours.prefilters identifying preprocessing required for canvas renderer.
		 * default is "clothes"
		 */
		prefilter?: string;
		colour: 0 | string;
		colour_options?: string[];
		colour_sidebar?: 0 | 1 | "primary";
		/**
		 * if 1, then sidebar image and colour array reference special sprites (ex. one "jar of jam" prop with images right_apple.png, right_blackberry.png, etc. and a colour array of ["apple", "blackberry"...]) instead of separate "jar of apple jam", "jar of blackberry jam", etc. items"
		 */
		colour_combat?: 0 | string;
		colourCustom?: string;
		pattern?: 0 | string;
		pattern_options?: string[];
		pattern_name?: string;
		pattern_caption?: boolean;
		pattern_layer?: "primary" | "secondary" | "tertiary";
		pattern_integrity?: boolean;
		accessory: number;
		accessory_colour?: 0 | string;
		accessory_colour_options?: string[];
		accessory_colour_sidebar?: 0 | 1 | string;
		accessory_colour_combat?: 0 | string;
		accessory_colourCustom?: string;
		/**
		 * if 1, then accessory files are integrity-dependent "acc_(tattered|torn|frayed|full).png"
		 */
		accessory_integrity_img?: 0 | 1;
		/**
		 * if 1, then accessory files layer under breast sprites
		 */
		accessory_layer_under?: 0 | 1;
		high_img?: 0 | 1;
		back_img?: 0 | 1 | "combat";
		back_integrity_img?: 0 | 1;
		back_img_acc?: 0 | 1 | "combat";
		back_img_acc_colour?: string;
		/**
		 * Recolouring of back image
		 * * "" (default) - depending on colour_sidebar
		 * * "no" - do not recolour image
		 * * "primary" - use primary/main colour
		 * * "secondary" - use secondary/accessory colour
		 */
		back_img_colour?: "" | "no" | "primary" | "secondary";
		/**
		 * (For upper, over_upper, under_upper slots)
		 * 1 if has sleeve images, named (left|right)[_cover].png".
		 * Colouring depends on sleeve_colour property.
		 */
		sleeve_img?: number;
		/**
		 * (For upper, over_upper, under_upper slots)
		 * 1 if has sleeve accessory images, named (left|right)[_cover]_acc.png".
		 * These images are not colored.
		 * Requires sleeve_img: 1.
		 */
		sleeve_acc_img?: number;
		/**
		 * (For upper, over_upper, under_upper slots)
		 * 1 if has sleeve pattern images, named (left|right)[_cover][_pattern].png".
		 * These images are not colored.
		 * Requires sleeve_img: 1.
		 * Requires main body pattern.
		 */
		sleeve_pattern?: 0 | 1;
		/**
		 * (For upper, over_upper, under_upper slots)
		 * Recolouring of sleeve accessory images:
		 * * "" (default) - depending on accessory_colour_sidebar
		 * * "primary" - use primary/main colour
		 * * "secondary" - use secondary/accessory colour
		 * * "tertiary" - do not recolour image
		 */
		sleeve_acc_colour?: 0 | "primary" | "secondary" | "tertiary" | "pattern";
		/**
		 * (For upper, over_upper, under_upper slots)
		 * Recolouring of sleeves images:
		 * * "" (default) - depending on colour_sidebar
		 * * "pattern" - apply pattern to sleeves using pattern_layer colour (primary, secondary, or tertiary)
		 * * "primary" - use primary/main colour
		 * * "secondary" - use secondary/accessory colour
		 * * "tertiary" - do not recolour image
		 */
		sleeve_colour?: "" | "pattern" | "primary" | "secondary" | "tertiary";
		/**
		 * * 1 if has breast sprites and a unique image for every breast sprite
		 * * 0 if no breast sprites
		 * * Key represents breast size tier 0..6.
		 * * Value represents the image used:
		 *     - null if no clothed breast image exists for that breast size.
		 *     - 0..6 for clothed breast image used for that breast size.
		 */
		breast_img?: object | 1 | 0;
		cursed?: number;
		location?: number;
		iconFile?: 0 | string;
		accIcon?: 0 | string;
		detailIcon?: 0 | string;
		/** The other pieces of this outfit, including their slot and the name of the piece in it. A separated or broken piece's name is "split" or "broken". */
		outfitPrimary?: Partial<Record<ClothedSlots, string>>;
		outfitSecondary?: string[];
		notuck?: number | "tie";
		/**
		 * * 0 for no collar
		 * * 1 for normal collar
		 * * 2 for high collar
		 */
		has_collar?: 0 | 1 | 2;
		/**
		 * (For head slots)
		 * if 1, this item has mask.png image to cut out hair & animal ears layers
		 */
		mask_img?: 0 | 1 | "combat";
		collared?: 0 | 1;
		rearresize?: number;
		short?: 0 | 1;
		mainImage?: 0 | string;
		shopGroup?: string;
		pregType?: 0 | string;
		formfitting?: 1;
		// Parts that exclude form formfitting, available options: "acc" "sleeve_acc"
		formfittingDisabled?: string[];
		oldVariable?: {
			name: string;
			variable: string;
		}[];
		breast_acc_img?: object | 1 | 0;
		breast_acc_alt?: 0 | 1;
		breast_pattern?: boolean;
		accImage?: 0 | 1;
		breast_combat?: 0 | 1;
		anal_shield?: 0 | 1 | null;
		penis_img?: 0 | 1;
		penis_acc_img?: 0 | 1;
		no_aside?: 0 | 1;
		hideUnderLower?: string[];
		size?: number;
		altsleeve?: string;
		altposition?: string;
		altdisabled?: string[];
		zip?: 0 | 1;
		hoodposition?: "down" | "up";
		altDamage?: "metal" | "plastic" | "parasite";
		penisSize?: boolean;
		zIndex?: string;
		hood?: 0 | 1;
		// Handheld item held over head, or alternate limb position used
		holdPosition?: ArmPosition;
		coverBackImage?: 0 | 1;
		coverImage?: 0 | 1;
		leftImage?: 0 | 1;
		rightImage?: 0 | 1;
		mask_img_ponytail?: 0 | 1;
		head_type?: "veil" | "hat";
		isFavourite?: boolean;
		// Modded clothing only
		modder?: string;
		// TODO list and document other options
	}

	export interface Wardrobe {
		over_upper: ClothesItem[];
		over_lower: ClothesItem[];
		upper: ClothesItem[];
		lower: ClothesItem[];
		under_upper: ClothesItem[];
		under_lower: ClothesItem[];
		over_head: ClothesItem[];
		head: ClothesItem[];
		face: ClothesItem[];
		neck: ClothesItem[];
		hands: ClothesItem[];
		handheld: ClothesItem[];
		legs: ClothesItem[];
		feet: ClothesItem[];
		genitals: ClothesItem[];
		space: number;
		isolated: boolean;
		locationRequirement: string[];
		name: string;
		unlocked: boolean;
		shopSend: boolean;
		transfer: boolean;
	}

	export interface specialClothesItem {
		name: string;
		unlocked: number;
	}
	export interface SpecialClothesSetup {
		name: string;
		sets: string[];
		requirements?(): boolean;
		hint?: string;
	}
	export interface PropSetup {
		folder?: string;
		armPosition?: ArmPosition;
		zIndex?: string;
		hasAccessory?: boolean;
		hasBackAcc?: boolean;
		hasCoverImg?: boolean;
		hasLevels?: boolean;
		overUnderSplit?: boolean;
		overUnderAccSplit?: boolean;
		colour?: string[];
		accColour?: string[];
		animation?: string;
	}
	export interface SpecialClothesSetsSetup {
		text: string;
		requirements?(): boolean;
		hint?: string;
		shop: string[];
		subsetOf?: string[];
		feat: boolean;
		featCost?: number;
		icon: string;
		iconSlot?: string;
		iconIndex?: number;
		iconColor?: string;
		iconAccColor?: string;
	}
	export type ArmPosition = "right_cover" | "right_idle" | "right_hold" | "left_cover" | "left_idle" | "cover_both" | "idle_both" | "clutch" | "handsfree";

	function getCustomClothesColourCanvasFilter(hue: number, saturation: number, brightness: number, contrast: number, sepia = 0): CompositeLayerSpec;

	function getCustomClothesColourCanvasFilter(filter: string): CompositeLayerSpec;

	type WardrobeSortProperty = "none" | "name" | "colour" | "reveal" | "integrity" | "warmth" | "outfit";

	type ShopSortProperty = "none" | "price" | "protection" | "reveal" | "warmth";

	type ClothingSortProperty = WardrobeSortProperty | ShopSortProperty;

	interface ClothingListSort {
		property: ClothingSortProperty;
		isDescending: boolean;
	}

	interface WardrobeSort extends ClothingListSort {
		property: WardrobeSortProperty;
	}

	interface ShopSort extends ClothingListSort {
		property: ShopSortProperty;
	}

	interface ClothingListRange {
		from: number | null;
		to: number | null;
	}

	interface ClothingListFilters {
		search: string;
		colours: string[];
		traits: string[];
		reveal: ClothingListRange;
		gender: string[];
		warmth: ClothingListRange;
		clothingSetIndex: number | null;
	}

	type ClothingFilterName = Exclude<keyof ClothingListFilters, "search">;

	interface ClothingListEntry {
		name: string;
		patterns: string[];
		colours: string[];
		traits: string[];
		reveal: number;
		warmth: number;
		gender: string;
	}

	interface WardrobeEntry extends ClothingListEntry {
		slot: ClothedSlots;
		index: number;
		isFavourite: boolean;
		integrityRatio: number;
		isBroken: boolean;
		outfitStatus: ClothesItem["one_piece"];
	}

	interface ShopEntry extends ClothingListEntry {
		item: ClothesItem;
		price: number;
		protection: number;
	}

	type WardrobeSortComparers = Record<Exclude<WardrobeSortProperty, "none">, (a: WardrobeEntry, b: WardrobeEntry) => number>;

	type ShopSortComparers = Record<Exclude<ShopSortProperty, "none">, (a: ShopEntry, b: ShopEntry) => number>;

	interface ClothingFilterOption {
		value: string;
		label: string;
	}

	interface WardrobeRow {
		slot: ClothedSlots;
		index: number;
	}

	interface WardrobeView extends ClothingListFilters {
		isPanelOpen: boolean;
		page: number;
		openRow: WardrobeRow | null;
		openClothingSetIndex: number | null;
		isRenamingClothingSet: boolean;
		isSelectingMultiple: boolean;
		ticked: WardrobeRow[];
	}

	interface ShopView extends ClothingListFilters {
		sort: ShopSort;
		isPanelOpen: boolean;
		showOutfitsOnly: boolean;
		pageCount: number;
	}

	type WardrobeLocation =
		| "wardrobe"
		| "changingRoom"
		| "edensCabin"
		| "asylum"
		| "alexFarm"
		| "stripClub"
		| "brothel"
		| "schoolBoys"
		| "schoolGirls"
		| "prison"
		| "temple"
		| "pirate"
		| "officeBuilding"
		| "birdTower"
		| "avery_mansion";

	/** The set types offered when saving or editing a clothing set. */
	type ClothingSetType = "normal" | "sleep" | "swim" | "school";

	/** A clothing set in $outfit. */
	interface ClothingSet extends ClothingSetItems {
		name: string;
		location?: WardrobeLocation;
		colors: false | ClothingSetColours;
		type: ClothingSetType[];
		hairStyle?: string;
		facevariant?: string;
		defaultSidebarMouth?: "smile" | "neutral";
		positions?: ClothingSetPositions;
	}

	interface HairStyle {
		name: string;
		name_cap: string;
		variable: string;
		type: string[];
		shop: string[];
		hasCombatImg?: boolean;
		alt?: string;
		alt_head_type?: string[];
	}

	interface WardrobeTab {
		id: ClothedSlots | "all";
		label: string;
		icon?: string;
		isDebugOnly?: boolean;
	}

	type ClothingSetColours = Partial<Record<ClothedSlots | `${ClothedSlots}custom`, (0 | string | undefined)[]>>;

	type ClothingSetPositions = Partial<Record<ClothedSlots | "sleeves", string>>;

	/** The name of the clothing item in each slot of a clothing set. */
	type ClothingSetItems = { [x in ClothedSlots]: string };

	type ShopCustomColourSetting = "color" | "saturation" | "brightness" | "contrast" | "value" | "sepia";

	interface ShopCustomColourPair {
		primary: number;
		secondary: number;
	}

	interface ShopCustomColourPreset {
		ver?: number;
		color: number | ShopCustomColourPair;
		saturation: number | ShopCustomColourPair;
		brightness: number | ShopCustomColourPair;
		contrast: number | ShopCustomColourPair;
		value?: number;
		sepia?: ShopCustomColourPair;
	}

	interface ShopCustomColours extends Record<ShopCustomColourSetting, ShopCustomColourPair> {
		presets: Record<string, ShopCustomColourPreset>;
		action: string;
		currentType: string;
	}

	interface HairMirrorView {
		traitFilters: string[];
		page: number;
		category: "sides" | "fringe";
	}

	interface WardrobeDiscardUndo {
		entries: { index: number; item: ClothesItem }[];
	}

	interface ClothingSetDeleteUndo {
		index: number;
		clothingSet: ClothingSet;
	}

	interface Window {
		hairTraitGroups: { heading: string; traits: string[] }[];
		revealLevels: { label: string; from: number; to: number }[];
		wardrobeItemsPerPageOptions: number[];
		wardrobeSeparateOutfitMinutes: number;
		wardrobeSortProperties: WardrobeSortProperty[];
		wardrobePanelFilters: ClothingFilterName[];
		shopPanelFilters: ClothingFilterName[];
		shopSortProperties: ShopSortProperty[];
		shopItemsPerPageOptions: number[];
		clothingFilterLabels: Record<ClothingFilterName | "sort", string>;
		clothingSortLabels: Record<ClothingSortProperty, string>;
		clothingGenderOptions: ClothingFilterOption[];
	}
}

export {};
