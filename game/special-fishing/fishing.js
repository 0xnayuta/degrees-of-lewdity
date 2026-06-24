/*
====== Main Fishing Todo ======  
- Test screaming for gwa rescue in forest fishing attack
- Sort out the location of the pier
- Investigate fish size calculations
- Fix fishing minigame. 
	- Add +fatigue when you reel in hard
	- Smaller fish can just be reeled in with no minigame?
	- Smaller fish don't give you any sort of accomplishment, so maybe they don't give -stress?
	- Maybe you need to figure out if it's a small fish or not first? That could be just annoying though.


====== Fishing Nice to haves ====
- You should be able to add fish you caught today to your fishing tank
- Forest and moor: Alternate events where a plant person saves you from another hostile event
- Moor: Plant person attack
- Forest and moor: Alternate events where a plant person saves you from another hostile event
- Cliff location should have large waves that make it more difficult to fish, to account for the lack of danger there.
- Use nested eventpools to make it so that the wait ambient text is better weighted. For example, rain, which adds more ambient events, shouldn't make seeing danger events less likely.
- Fishing lake: You see some people leave their spot and start walking towards you, could turn into encounter, or a wholesome interaction. 
- Beach night event: You hear somebody saying "next time... distracted", then next time you start fishing, you get attacked after 2-3 rounds.
- Whitney bet event: If the fish is small, you should be able to eat it. At which whitney laughs hard, everyone else looks at you confused and shocked, and you're let go if you want.
- Whitney friends: Throw small fish at you to make fun of your insecurities. "hey, it reminds me of you"
- The great hawk rescue event is reused and duplicated a bunch in the fishing code, and that's bad. 
- When exposed on the fishing rock, add an event where people walk up and gawk at you, maybe attack.
- Hawk rescue code is duplicated too much

====== Random fishing notes ====
- Avery: yacht fishing location, unique?
- Robin: Game of raising or lowering dom based on the fish caught comparisons?
- High dom Robin, corrupt sydney, maybe Alex, maybe Avery: Distract PC while trying to fish?
- Descriptions of how fish-populated the fishing spots are, meaning that if you want to fish, you can look around a bit
- The Whitney Pier should have text that appears if you've run into it before. A friend could say "oh I like this game", or something
- Kylar: Your lines get caught together. "that could be us"


====== Needed images ======
Caught fish handheld props:
- /img/clothes/props/fish/caught-haddock.png
- /img/clothes/props/fish/caught-salmon.png
- /img/clothes/props/fish/caught-trout.png
- /img/clothes/props/fish/caught-cod.png
- /img/clothes/props/fish/caught-whiting.png
- /img/clothes/props/fish/caught-mackerel.png
- /img/clothes/props/fish/caught-sole.png
- /img/clothes/props/fish/caught-roach.png
- /img/clothes/props/fish/caught-perch.png
- /img/clothes/props/fish/caught-chub.png
- /img/clothes/props/fish/caught-pike.png
- /img/clothes/props/fish/caught-grayling.png

Ingredient handheld props:
- /img/clothes/props/ingredient/herring.png
- /img/clothes/props/ingredient/whiting.png
- /img/clothes/props/ingredient/mackerel.png
- /img/clothes/props/ingredient/flounder.png
- /img/clothes/props/ingredient/sole.png
- /img/clothes/props/ingredient/bass.png
- /img/clothes/props/ingredient/roach.png
- /img/clothes/props/ingredient/perch.png
- /img/clothes/props/ingredient/chub.png
- /img/clothes/props/ingredient/pike.png
- /img/clothes/props/ingredient/eel.png
- /img/clothes/props/ingredient/grayling.png

Caught fish UI icons for the journal:
- /img/misc/icon/fish/haddock.png
- /img/misc/icon/fish/salmon.png
- /img/misc/icon/fish/trout.png
- /img/misc/icon/fish/cod.png
- /img/misc/icon/fish/herring.png
- /img/misc/icon/fish/whiting.png
- /img/misc/icon/fish/mackerel.png
- /img/misc/icon/fish/flounder.png
- /img/misc/icon/fish/sole.png
- /img/misc/icon/fish/bass.png
- /img/misc/icon/fish/roach.png
- /img/misc/icon/fish/perch.png
- /img/misc/icon/fish/chub.png
- /img/misc/icon/fish/pike.png
- /img/misc/icon/fish/eel.png
- /img/misc/icon/fish/grayling.png

Foodstuff UI icons:
- /img/misc/icon/tending/herring.png
- /img/misc/icon/tending/whiting.png
- /img/misc/icon/tending/mackerel.png
- /img/misc/icon/tending/flounder.png
- /img/misc/icon/tending/bass.png
- /img/misc/icon/tending/roach.png
- /img/misc/icon/tending/perch.png
- /img/misc/icon/tending/chub.png
- /img/misc/icon/tending/pike.png
- /img/misc/icon/tending/eel.png

Fishing rod clothing trait icon
- /img/ui/clothes/traits/fishing-rod.png

Fishing location images + link icon
- Pier
- Bottom of a cliff with an old, small, broken pier and a path leading back up to the top of the cliff.

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
	if (fishConfig.preferred_time.includes(Weather.dayState)) {
		preferredMatchCount++;
	}
	if (Time.isBloodMoon() && fishConfig.preferred_time.includes("bloodMoon")) {
		preferredMatchCount++;
	}
	if (fishConfig.preferred_season.includes(Time.season)) {
		preferredMatchCount++;
	}

	const preferenceFactor = Math.clamp(preferredMatchCount / 4, 0, 1);
	const rollExp = interpolate(2.6, 1.4, preferenceFactor);
	const sizeRoll = randomExp(rollExp);
	const size = round(lerp(sizeRoll, fishConfig.min_size, fishConfig.max_size), 2);
	const range = fishConfig.max_size - fishConfig.min_size;

	// Rounds 98% to 100% and 2% to 0% so people don't get fish that are super super close to max/min size, but doesn't count.
	if (size >= fishConfig.min_size + 0.98 * range) return fishConfig.max_size;
	return size;
}

function rollFish(locationKey) {
	const pool = [];
	let totalWeight = 0;
	for (const [fishKey, fishConfig] of Object.entries(setup.fishing_fish)) {
		const locationWeight = fishConfig.locations[locationKey];
		if (locationWeight > 0) {
			const weight = fishConfig.preferred_weather.includes(Weather.name) ? locationWeight * 2 : locationWeight;
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
	V.fishing.record ??= {};
	V.fishing.record[fishKey] ??= {
		num_caught: 0,
		largest: fishSize,
		found_in: [],
	};

	const fishRecord = V.fishing.record[fishKey];
	fishRecord.num_caught += 1;
	fishRecord.largest = Math.max(fishRecord.largest, fishSize);
	if (!fishRecord.found_in.includes(locationKey)) {
		fishRecord.found_in.push(locationKey);
	}
}
window.updateFishRecord = updateFishRecord;

function numberOfFishCaught() {
	if (!V.fishing?.record) return 0;
	return Object.values(V.fishing.record).reduce((sum, r) => sum + r.num_caught, 0);
}
window.numberOfFishCaught = numberOfFishCaught;

function canCookFish(fishKey, fishSize) {
	const eatableFish = ["trout", "perch", "pike", "chub", "salmon", "bass", "haddock", "cod"];
	if (!eatableFish.includes(fishKey)) return false;
	const fishConfig = setup.fishing_fish[fishKey];
	return fishSize >= fishConfig.max_size - 0.15 * (fishConfig.max_size - fishConfig.min_size) && fishSize >= 80;
}
window.canCookFish = canCookFish;

function canStartFishing() {
	// fishing todo
	// return !pcAreArmsBound("any") && V.worn.handheld.type.includes("fishing_rod");

	return true;
}
window.canStartFishing = canStartFishing;

function debugDiscoverAllFishing() {
	V.fishing ??= {};
	V.fishing.locationsFound = ["pier", "beach", "forestLake", "moor", "coastPath"];
	V.fishing.record ??= {};
	V.daily.fishing ??= {};

	for (const [fishKey, fishConfig] of Object.entries(setup.fishing_fish)) {
		const locationKeys = Object.keys(fishConfig.locations);
		if (random(1, 2) === 1) {
			updateFishRecord(fishKey, Math.ceil((fishConfig.min_size + fishConfig.max_size) / 2), locationKeys[0]);
		} else {
			updateFishRecord(fishKey, fishConfig.min_size, locationKeys[0]);
			updateFishRecord(fishKey, fishConfig.max_size, locationKeys[0]);
		}
		V.fishing.record[fishKey].found_in = locationKeys;
	}
}
window.debugDiscoverAllFishing = debugDiscoverAllFishing;

function initFishingBeach() {
	V.bus = "fishingBeach";
	V.fishing ??= {};
	V.fishing.locationsFound ??= [];
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
	V.fishing.locationsFound ??= [];
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
	V.fishing.locationsFound ??= [];
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
	V.fishing.locationsFound ??= [];
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
	if (V.moor_hunt >= 1) {
		V.fishing.moor.event = "none";
		V.fishing.moor.eventDanger = 0;
		if (["sit", "campfire"].includes(V.daily.fishing.moor.hikers?.phase)) {
			V.daily.fishing.moor.hikers.phase = "finished";
			wikifier("clearNPC", "moor_hiker_1");
			wikifier("clearNPC", "moor_hiker_2");
		}
	}
	V.fishingCombatActive = false;
	delete V.fishingHookedFish;
}
window.initFishingMoor = initFishingMoor;

function initFishingPier() {
	V.bus = "fishingPier";
	V.fishing ??= {};
	V.fishing.locationsFound ??= [];
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

function isPlayerFishingAlone() {
	switch (V.bus) {
		case "fishingBeach":
			return [undefined, "finished"].includes(V.daily?.fishing?.beach?.fisher?.phase);
		case "fishingPier":
			return (
				[undefined, "finished"].includes(V.daily?.fishing?.pier?.fisher?.phase) &&
				[undefined, "finished"].includes(V.daily?.fishing?.pier?.whitney?.phase)
			);
		case "fishingMoor":
			return (
				[undefined, "finished"].includes(V.daily?.fishing?.moor?.fox?.phase) && [undefined, "finished"].includes(V.daily?.fishing?.moor?.hikers?.phase)
			);
		case "fishingCoastPath":
			return true;
		case "fishingForestLake":
			return true;
	}
}
window.isPlayerFishingAlone = isPlayerFishingAlone;

function startFishingCombat(locationKey) {
	V.fishing.combat = {
		location: locationKey,
		fishStamina: V.fishingHookedFish.startingStamina,
		lineHealth: 3,
		fishDistance: 20 + random(-5, 10),
		fishAction: "",
		playerAction: "",
		fishDepth: random(1, 3),
	};
	V.fishingCombatActive = true;
}
window.startFishingCombat = startFishingCombat;

function startFishingProp() {
	if (V.worn.handheld.type.includes("fishing_rod")) {
		V.worn.handheld.holdPosition = "right_cover";
		wikifier("updatesidebarimg");
	}
}
window.startFishingProp = startFishingProp;

// Some events are reused for fishing, such as some events on the beach that can also happen while fishing on the beach. So if you see this somewhere in an event that is unrelated to fishing, it is there for the case where you get into that event through fishing.
function stopFishingProp() {
	if (V.worn.handheld.type.includes("fishing_rod")) {
		V.worn.handheld.holdPosition = 0;
		wikifier("updatesidebarimg");
	}
}
window.stopFishingProp = stopFishingProp;

function endFishingCombat() {
	V.fishing.combat = {};
	V.fishingCombatActive = false;
	stopFishingProp();
}
window.endFishingCombat = endFishingCombat;

function canEatFishTf(fish) {
	return V.cat >= 5 && fish.size <= 20;
}
window.canEatFishTf = canEatFishTf;

function fishingCombatEffects() {
	const combat = V.fishing.combat;

	if (combat.fishAction === "rest") {
		combat.fishStamina = Math.min(combat.fishStamina + 1, V.fishingHookedFish.startingStamina + 1);
		if (combat.playerAction === "reel") {
			combat.fishDistance -= 15;
		}
	} else if (combat.fishAction === "thrash") {
		combat.fishStamina -= 1;
		combat.lineHealth -= random(0, 1);
		if (combat.playerAction === "reel") {
			combat.fishDistance -= 5;
			combat.fishDepth = Math.max(combat.fishDepth - 1, 1);
		}
	} else if (combat.fishAction === "dive") {
		combat.fishStamina -= 1;
		if (combat.playerAction === "reel") {
			combat.lineHealth -= 1;
		} else if (combat.playerAction === "slack") {
			combat.fishDistance += 5;
		} else if (combat.playerAction === "hold") {
			combat.lineHealth -= 1;
		}
		combat.fishDepth = Math.min(combat.fishDepth + 1, 3);
	} else if (combat.fishAction === "swim") {
		combat.fishStamina -= 1;
		if (combat.playerAction === "reel") {
			combat.fishDistance -= 5;
			combat.lineHealth -= 1;
			combat.fishDepth = Math.max(combat.fishDepth - 1, 1);
		} else if (combat.playerAction === "slack") {
			combat.fishDistance += 5;
		}
	}

	let eventDanger = 0;
	if (combat.location === "moor") {
		eventDanger = V.fishing.moor.eventDanger;
	} else if (combat.location === "forestLake" && V.fishing.lake.event !== "plantPerson") {
		eventDanger = V.fishing.lake.eventDanger;
	}
	if (random(1, 100) <= eventDanger) {
		T.fishingDangerEventTriggered = true;
	}
}
window.fishingCombatEffects = fishingCombatEffects;

// Decides what the fish does this turn based on its stamina and depth.
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

// Used to scale the likelihood of dangerous fishing events. x1 at allure <2000 (arbitrary), x2 at max allure (8000).
function fishingDangerEventWeight(defaultEventWeight) {
	const allureMultiplier = Math.clamp(1 + (V.allure - 2000) / 6000, 1, 2);
	return defaultEventWeight * allureMultiplier;
}
window.fishingDangerEventWeight = fishingDangerEventWeight;

// Used to scale the likelihood of catching a fish. x2 when teeming, x0.5 when quiet, 1 otherwise.
function fishingCatchEventWeight(defaultEventWeight, location) {
	const population = V.daily.fishing[location]?.fishPopulation;
	const multiplier = population === "teeming" ? 2 : population === "quiet" ? 0.5 : 1;
	return defaultEventWeight * multiplier;
}
window.fishingCatchEventWeight = fishingCatchEventWeight;
