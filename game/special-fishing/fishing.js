/*
====== Main Fishing Todo ======  
- Add rods to shop
- Make it so that the fishing link doesn't appear unless you are holding a fishing rod
- While fishing on pier: whitney and co can sneak up on you and set up
- Whitney and co can be on the pier to begin with
- Implement fishing chain lock
- Is orgasmFishing correctly used everywhere? I recall there is some text for the campfire teens cheering for you if you orgasm, and the hikers should do the same on the moor, and the Fisher should do something as well on the beach and pier.
- Should the ambient descriptions, of the hikers, ducks, ducklings, go inline with the weather description?
- Test screaming for gwa rescue in forest fishing attack
- Different rod tiers. If fishing on the cliff face, you need the highest tier of rod or else it will break.
- Bug: When you flirt with the hikers, and have sex with one, but don't pull the other in, there is a full audience.
- Passout scenes? Passout functionality?
- Go through and find places to put stress/trauma changes
- Chatting or sipping instead of waiting for a bite prevents npcs from leaving
- Throw back passages, and any passages that have "wait for a bite" and "return to the X" need to either be on the main fishing wait passage, or be changed to have next as their link
- Hawk rescue can happen too often
- Many "back to fishing" + "leave" link pairs should be changed to either link to the wait loop or just be replaced with "next" links 


====== Random fishing notes ====
- Avery: yacht fishing location, unique?
- Robin: Game of raising or lowering dom based on the fish caught comparisons
- High dom Robin, corrupt sydney, maybe Alex, maybe Avery: Distract PC while trying to fish
- Descriptions of how fish-populated the fishing spots are, meaning that if you want to fish, you can look around a bit
- The Whitney Pier should have text that appears if you've run into it before. A friend could say "oh I like this game", or something
- Kylar: Your lines get caught together. "that could be us"


====== Fishing Nice to haves ====
- You should be able to add fish you caught today to your fishing tank
- Forest and moor: Alternate events where a plant person saves you from another hostile event
- Moor: Plant person attack
- Be able to wade out into the water while fishing on the beach, greater likelyhood of tentacle attack and other ocean attacks, better fish odds.
- Forest and moor: Alternate events where a plant person saves you from another hostile event
- Cliff location should have large waves that make it more difficult to fish, to account for the lack of danger there.
- Use nested eventpools to make it so that the wait ambient text is better weighted. For example, rain, which adds more ambient events, shouldn't make seeing danger events less likely.
- Fishing lake: You see some people leave their spot and start walking towards you, could turn into encounter, or a wholesome interaction. 
- Lake: Ducks land on the lake, just flavor. Can watch them chill, then watch them leave.
- Costal Path fishing spot should be a long walk to and from either side of the costal path
- Beach night event: You hear somebody saying "next time... distracted", then next time you start fishing, you get attacked after 2-3 rounds.
- Whitney bet event: If the fish is small, you should be able to eat it. At which whitney laughs hard, everyone else looks at you confused and shocked, and you're let go if you want.
- Whitney friends: Throw small fish at you to make fun of your insecurities. "hey, it reminds me of you"
- The great hawk rescue event is reused and duplicated a bunch in the fishing code, and that's bad. 
- Add some passage links to the forest to make climbing up onto the fishing rock possible 
- Same for the docks

*/

function rollFishSize(locationKey, fishKey) {
	const fishConfig = setup.fishing_fish[fishKey];
	let preferredMatchCount = 0;

	if (fishConfig.preferred_location.includes(locationKey)) {
		preferredMatchCount++;
	}
	if (fishConfig.preferred_weather.includes(Weather.name)) {
		preferredMatchCount++;
	}
	if (fishConfig.preferred_time.includes(Time.dayState)) {
		preferredMatchCount++;
	}
	if (Time.isBloodMoon() && fishConfig.preferred_time.includes("bloodMoon")) {
		preferredMatchCount++;
	}
	if (fishConfig.preferred_season.includes(Time.season)) {
		preferredMatchCount++;
	}

	const preferenceFactor = preferredMatchCount / 4;
	const rollExp = lerp(preferenceFactor, 2, 1.2);
	const sizeRoll = randomExp(rollExp);
	const size = round(lerp(sizeRoll, fishConfig.min_size, fishConfig.max_size), 2);
	const range = fishConfig.max_size - fishConfig.min_size;

	// Rounds 98% to 100% and 2% to 0% so people don't get fish that are super super close to max/min size, but doesn't count.
	if (size >= fishConfig.min_size + 0.98 * range) return fishConfig.max_size;
	if (size <= fishConfig.min_size + 0.02 * range) return fishConfig.min_size;
	return size;
}

function rollFish(locationKey) {
	const pool = [];
	let totalWeight = 0;
	for (const [fishKey, config] of Object.entries(setup.fishing_fish)) {
		const weight = config.locations[locationKey];
		if (weight > 0) {
			pool.push({ key: fishKey, weight });
			totalWeight += weight;
		}
	}
	let r = Math.random() * totalWeight;
	let fishKey = pool[pool.length - 1].key;
	for (const entry of pool) {
		r -= entry.weight;
		if (r <= 0) {
			fishKey = entry.key;
			break;
		}
	}
	const fishConfig = setup.fishing_fish[fishKey];
	const size = Math.ceil(rollFishSize(locationKey, fishKey));
	const hugeThreshold = fishConfig.min_size + 0.8 * (fishConfig.max_size - fishConfig.min_size);
	const isHuge = size >= hugeThreshold;
	return {
		type: fishKey,
		size,
		isHuge,
		startingStamina: isHuge ? fishConfig.max_stamina + 1 : fishConfig.max_stamina,
	};
}
window.rollFish = rollFish;

function updateFishRecord(fishKey, fishSize, locationKey) {
	V.fishingRecord ??= {};
	V.fishingRecord[fishKey] ??= {
		num_caught: 0,
		largest: fishSize,
		smallest: fishSize,
		found_in: [],
	};

	const fishRecord = V.fishingRecord[fishKey];
	fishRecord.num_caught += 1;
	fishRecord.largest = Math.max(fishRecord.largest, fishSize);
	fishRecord.smallest = Math.min(fishRecord.smallest, fishSize);
	if (!fishRecord.found_in.includes(locationKey)) {
		fishRecord.found_in.push(locationKey);
	}

	if (fishKey === "sea_bass") {
		// Fishing Todo: why error????
		earnFeat("Nice Bass");
	}

	const fishKeys = Object.keys(setup.fishing_fish);
	if (fishKeys.every(key => V.fishingRecord[key]?.num_caught > 0)) {
		earnFeat("Wet Rod");
	}

	if (
		fishKeys.every(key => {
			const fishConfig = setup.fishing_fish[key];
			const fishRecord = V.fishingRecord[key];
			if (!fishRecord) return false;
			const largestSizePercent = (fishRecord.largest - fishConfig.min_size) / (fishConfig.max_size - fishConfig.min_size);
			const smallestSizePercent = (fishRecord.smallest - fishConfig.min_size) / (fishConfig.max_size - fishConfig.min_size);
			return largestSizePercent >= 0.98 && smallestSizePercent <= 0.02;
		})
	) {
		earnFeat("Master Baiter");
	}
}
window.updateFishRecord = updateFishRecord;

function canCookFish(fishKey, fishSize) {
	const eatableFish = ["trout", "perch", "pike", "chub", "salmon", "sea_bass", "haddock", "cod"];
	if (!eatableFish.includes(fishKey)) return false;
	const fishConfig = setup.fishing_fish[fishKey];
	return fishSize >= fishConfig.max_size - 0.15 * (fishConfig.max_size - fishConfig.min_size) && fishSize >= 80;
}
window.canCookFish = canCookFish;

function canStartFishing() {
	return !pcAreArmsBound("any");
}
window.canStartFishing = canStartFishing;

function discoverFishingLocation(locationKey) {
	V.fishing.locationsFound ??= [];
	if (!V.fishing.locationsFound.includes(locationKey)) {
		V.fishing.locationsFound.push(locationKey);
	}
}
window.discoverFishingLocation = discoverFishingLocation;

function debugDiscoverAllFishing() {
	V.fishing ??= {};
	V.fishing.locationsFound = ["pier", "beach", "forestLake", "moor", "coastPath"];
	V.fishingRecord ??= {};
	V.daily.fishing ??= {};

	for (const [fishKey, fishConfig] of Object.entries(setup.fishing_fish)) {
		const locationKeys = Object.keys(fishConfig.locations);
		if (random(1, 2) === 1) {
			updateFishRecord(fishKey, Math.ceil((fishConfig.min_size + fishConfig.max_size) / 2), locationKeys[0]);
		} else {
			updateFishRecord(fishKey, fishConfig.min_size, locationKeys[0]);
			updateFishRecord(fishKey, fishConfig.max_size, locationKeys[0]);
		}
		V.fishingRecord[fishKey].found_in = locationKeys;
	}
}
window.debugDiscoverAllFishing = debugDiscoverAllFishing;

function initFishingBeach() {
	V.bus = "fishingBeach";
	V.fishing ??= {};
	V.fishing.beach ??= {};
	V.daily.fishing ??= {};
	V.daily.fishing.beach ??= {};
	V.daily.fishing.beach.fisher ??= {};
	V.daily.fishing.beach.fisher.drunk ??= 0;
	V.fishingCombatActive = false;
	delete V.fishingHookedFish;
}
window.initFishingBeach = initFishingBeach;

function initFishingCoastPath() {
	V.bus = "fishingCoastPath";
	V.fishing ??= {};
	V.fishing.coastPath ??= {};
	V.daily.fishing ??= {};
	V.daily.fishing.coastPath ??= {};
	V.fishingCombatActive = false;
	delete V.fishingHookedFish;
}
window.initFishingCoastPath = initFishingCoastPath;

function initFishingForestLake() {
	V.bus = "fishingForestLake";
	V.fishing ??= {};
	V.fishing.lake ??= {};
	V.fishing.lake.event ??= "none";
	V.fishing.lake.eventDanger ??= 0;
	V.daily.fishing ??= {};
	V.daily.fishing.lake ??= {};
	V.fishingCombatActive = false;
	delete V.fishingHookedFish;
}
window.initFishingForestLake = initFishingForestLake;

function initFishingMoor() {
	V.bus = "fishingMoor";
	V.fishing ??= {};
	V.fishing.moor ??= {};
	V.fishing.moor.event ??= "none";
	V.fishing.moor.eventDanger ??= 0;
	V.fishing.moor.playerShooed = false;
	V.daily.fishing ??= {};
	V.daily.fishing.moor ??= {};
	V.daily.fishing.moor.fox ??= {};
	V.daily.fishing.moor.hikers ??= {};
	V.daily.fishing.moor.hikers.spike ??= false;
	V.daily.fishing.moor.hikers.drinkCount ??= 0;
	V.daily.fishing.moor.hikers.drinkOffered ??= false;
	V.daily.fishing.moor.hikers.flirt ??= false;
	V.daily.fishing.moor.hikers.leaveChance ??= 0;
	V.fishingCombatActive = false;
	delete V.fishingHookedFish;
}
window.initFishingMoor = initFishingMoor;

function initFishingPier() {
	V.bus = "fishingPier";
	V.fishing ??= {};
	V.fishing.pier ??= {};
	V.fishing.whitney ??= {};
	V.daily.fishing ??= {};
	V.daily.fishing.pier ??= {};
	V.daily.fishing.pier.fisher ??= {};
	V.daily.fishing.pier.fisher.drunk ??= 0;
	V.daily.fishing.pier.whitney ??= {};
	V.daily.fishing.pier.whitney.pcCider ??= 0;
	V.daily.fishing.pier.whitney.pcCiderTotal ??= 0;
	V.daily.fishing.pier.whitney.fishKiss ??= false;
	V.fishingCombatActive = false;
	delete V.fishingHookedFish;
}
window.initFishingPier = initFishingPier;

function startFishingCombat(locationKey) {
	V.fishing.combat = {
		location: locationKey,
		fishStamina: V.fishingHookedFish.startingStamina,
		lineHealth: 3,
		fishDistance: 20 + random(-5, 10),
		fishAction: "",
		playerAction: "",
		playerAttention: false,
		fishDepth: random(1, 3),
	};
	V.fishingCombatActive = true;
}
window.startFishingCombat = startFishingCombat;

function endFishingCombat() {
	V.fishing.combat = {};
	V.fishingCombatActive = false;
}
window.endFishingCombat = endFishingCombat;

function canEatFishTf(fish) {
	return V.cat >= 5 && fish.size <= 20;
}
window.canEatFishTf = canEatFishTf;

function fishingCombatEffects() {
	const combat = V.fishing.combat;

	/* Capture last turn's noise before resetting. */
	const wasNoisy = combat.playerAttention;
	combat.playerAttention = false;

	if (combat.fishAction === "rest") {
		combat.fishStamina = Math.min(combat.fishStamina + 1, V.fishingHookedFish.startingStamina + 1);
		if (combat.playerAction === "reel") {
			combat.fishDistance -= 15;
		}
	} else if (combat.fishAction === "thrash") {
		combat.fishStamina -= 1;
		combat.playerAttention = true;
		combat.lineHealth -= random(0, 1);
		if (combat.playerAction === "reel") {
			combat.fishDistance -= 5;
			combat.fishDepth = Math.max(combat.fishDepth - 1, 1);
		}
	} else if (combat.fishAction === "dive") {
		combat.fishStamina -= 1;
		if (combat.playerAction === "reel") {
			combat.lineHealth -= 1;
			if (combat.fishDepth === 1) {
				combat.playerAttention = true;
			}
		} else if (combat.playerAction === "slack") {
			combat.fishDistance += 5;
		} else if (combat.playerAction === "hold") {
			combat.lineHealth -= 1;
		}
		combat.fishDepth = Math.min(combat.fishDepth + 1, 3);
	} else if (combat.fishAction === "swim") {
		combat.fishStamina -= 1;
		if (combat.playerAction === "reel") {
			if (combat.fishDepth === 1) {
				combat.playerAttention = true;
			}
			combat.fishDistance -= 5;
			combat.lineHealth -= 1;
			combat.fishDepth = Math.max(combat.fishDepth - 1, 1);
		} else if (combat.playerAction === "slack") {
			combat.fishDistance += 5;
		} else if (combat.playerAction === "hold") {
			if (combat.fishDepth === 1 && random(1, 2) === 1) {
				combat.playerAttention = true;
			}
		}
	}

	if (wasNoisy) {
		let eventDanger = 0;
		if (combat.location === "moor") {
			eventDanger = V.fishing.moor.eventDanger;
		} else if (combat.location === "forestLake") {
			eventDanger = V.fishing.lake.eventDanger;
		}
		if (random(1, 100) <= eventDanger) {
			T.fishingDangerEventTriggered = true;
		}
	}
}
window.fishingCombatEffects = fishingCombatEffects;

/* Decides what the fish does this turn based on its stamina and depth. */
function fishCombatAction() {
	const combat = V.fishing.combat;

	if (combat.fishStamina === 0) {
		combat.fishAction = "rest";
	} else if (combat.fishStamina === 1 && random(1, 3) === 1) {
		combat.fishAction = "rest";
	} else if (combat.fishDepth === 3) {
		combat.fishAction = either("swim", "rest");
	} else if (combat.fishDepth === 1 && combat.playerAction === "reel") {
		combat.fishAction = "thrash";
	} else {
		combat.fishAction = either("dive", "swim");
	}
}
window.fishCombatAction = fishCombatAction;

/* Escalates danger events for the current fishing location when the player makes noise during combat. */
function fishingAttentionCheck() {
	const combat = V.fishing.combat;
	if (!combat.playerAttention) return;

	if (combat.location === "moor") {
		if (V.fishing.moor.event === "none") {
			const validEvents = [];
			if (V.settings.lurkersEnabled) validEvents.push("lurker");
			if (V.settings.bestialityEnabled) validEvents.push("cat", "moorHikers");
			validEvents.push("moorHikers");
			V.fishing.moor.event = validEvents[random(0, validEvents.length - 1)];
		} else {
			V.fishing.moor.eventDanger += 0.25;
		}
	} else if (combat.location === "forestLake") {
		if (V.fishing.lake.event === "none") {
			const validEvents = [];
			if (V.settings.bestialityEnabled) validEvents.push("wolf", "bear", "boar");
			if (V.settings.plantsEnabled) validEvents.push("plantPerson");
			if (V.settings.tentaclesEnabled) validEvents.push("plant");
			if (validEvents.length > 0) {
				V.fishing.lake.event = validEvents[random(0, validEvents.length - 1)];
			}
		} else {
			V.fishing.lake.eventDanger += 0.25;
		}
	}
}
window.fishingAttentionCheck = fishingAttentionCheck;

function fishingLocationWaterBodyName(locationKey) {
	switch (locationKey) {
		case "pier":
			return "sea";
		case "beach":
			return "sea";
		case "forestLake":
			return "lake";
		case "moor":
			return "water";
		case "coastPath":
			return "sea";
		default:
			return "water";
	}
}
window.fishingLocationWaterBodyName = fishingLocationWaterBodyName;
