/*
====== Main Fishing Todo ======  
- Test screaming for gwa rescue in forest fishing attack
- Add npc fisher catch events for the beach, same as on the pier.
- The beach npc fisher has no rescue events, so a huge fish dragging the PC into the surf resolves without them. Maybe give them a save + coercion chain like the pier fisher has.
- Old, smelly, rundown store on the pier where you can buy dead worms (basic bait, not as good as foodstuff bait) and also where you can buy a fishing rod and a magnet for fishing (or maybe move the magnet somewhere else). Maybe you can get fishing tips there too.
- Revisit fish size system
- Journal stars fish are squished, revisit how fishing journal is constructed
- Move fishing records to the pier shack? 
- Test all fishing events to make sure that they make sense with the new no-minigame fishing system
- Investigate reusing a passage for the heavy magnet events
- Slip events should have a warning, and should be mitigated by having good shoes.
- Keep a tally of how many fish you caught in a sitting, let you use fish to avoid cat encounters when walking back from the moor. Use fish as payment for hitchhiking.
- Walking around with fresh fish in the forest or moor could attract things
- Throw fresh fish at something attacking you to get it to go away
- The odds of negative events in general need a pass, it's pretty dangerous to fish even though there isn't that much reward.
- Remove fish from the market?
- Add Gwylan request
- Rename files to catch-fish, catch-clothing...
- Normalize fish order in journal
- See if I can use fewer inline events in fishing-text and in general
- Normalize my usages of <<=...>>, <<print ...>> and ... inline
- Do a pass over magnet fishing wording. Maybe make the result of magnet fishing be placed in the wait ambiant?

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
- Fix hawk rescue code is duplicated too much
- Leave-fishing-rod-behind to fish system.
- Add the ability to put a conch shell you find into your aquarium at home.
- Make magnet fishing something that you need to stumble on? Make it an "oh shit a whole new part of fishing"
- Lurker attack bait and switch for moor
- "I've heard tale of a monster fish off the cliff, catch it and I'll buy it from you for $$$" -> catching would be a "pick-the-correct-option" minigame over maybe 3 rounds, with the player having to recognize what to do in order to catch this big, unique fish.
- Make the fish contents of the market be randomized each week 
- Add icon for what fish you've got hooked when you hook a fish

====== Random fishing notes ====
- Avery: yacht fishing location, unique?
- Robin: Game of raising or lowering dom based on the fish caught comparisons?
- High dom Robin, corrupt sydney, maybe Alex, maybe Avery: Distract PC while trying to fish?
- Descriptions of how fish-populated the fishing spots are, meaning that if you want to fish, you can look around a bit
- The Whitney Pier should have text that appears if you've run into it before. A friend could say "oh I like this game", or something
- Kylar: Your lines get caught together. "that could be us"

*/

function rollFishSize(bus, fishKey) {
	const fishConfig = setup.fishing.lootTables.fish[fishKey];
	let preferredMatchCount = 0;

	if (fishConfig.preferredLocation.includes(bus)) {
		preferredMatchCount++;
	}
	if (fishConfig.preferredWeather.includes(Weather.name)) {
		preferredMatchCount++;
	}
	if (fishConfig.preferredTime.includes(Weather.dayState)) {
		preferredMatchCount++;
	}
	if (Time.isBloodMoon() && fishConfig.preferredTime.includes("bloodMoon")) {
		preferredMatchCount++;
	}
	if (fishConfig.preferredSeason.includes(Time.season)) {
		preferredMatchCount++;
	}

	const slope = Math.clamp(preferredMatchCount, 0, 4) - 2;
	const rand = State.random();
	const sizeRoll = slope === 0 ? rand : (slope / 2 - 1 + Math.sqrt((1 - slope / 2) ** 2 + 2 * slope * rand)) / slope;
	const size = lerp(sizeRoll, fishConfig.minSize, fishConfig.maxSize);

	// Rounds 98%+ sized to 100% so people don't get fish that are super super close to max size, but aren't the max size.
	if (size >= fishConfig.minSize + 0.98 * (fishConfig.maxSize - fishConfig.minSize)) {
		return fishConfig.maxSize;
	}
	return size;
}

/**
 * Without bait of any sort, you are more likely to catch baitfish than other fish.
 * With foodstuff bait that isn't baitfish, you are less likely to catch baitfish and more likely to catch normal fish.
 * While using baitfish as bait, you are able to catch Bass (saltwater), Pike (freshwater) and Eel (moor), which require those baitfish to catch.
 *
 * @param {string} fishKey
 */
function fishingBaitWeightMultiplier(fishKey) {
	const bait = V.fishing.currentBait;
	const fishInfo = setup.fishing.lootTables.fish[fishKey];

	if (!bait) {
		if (fishInfo.requiresBaitFish) {
			return 0;
		} else if (fishInfo.isBaitFish) {
			return 1;
		} else {
			return 0.5;
		}
	} else if (bait === "baitfish") {
		if (fishInfo.requiresBaitFish) {
			return 1;
		} else if (fishInfo.isBaitFish) {
			return 0;
		} else {
			return 1;
		}
	} else {
		if (fishInfo.requiresBaitFish) {
			return 0.1;
		} else if (fishInfo.isBaitFish) {
			return 0.5;
		} else {
			return 1;
		}
	}
}
window.fishingBaitWeightMultiplier = fishingBaitWeightMultiplier;

/**
 * Rolls a per-day, per-location weighting for each fish available at the location.
 *
 * @param {string} location
 */
function rollLocalFishPoolModifiers(location) {
	V.daily.fishing[location].fishPoolModifiers = {};
	for (const [fishKey, fishConfig] of Object.entries(setup.fishing.lootTables.fish)) {
		const locationWeight = fishConfig.locations[location];
		if (locationWeight > 0) {
			V.daily.fishing[location].fishPoolModifiers[fishKey] = [0.2, 1, 1, 1, 1.4].random();
		}
	}
}
window.rollLocalFishPoolModifiers = rollLocalFishPoolModifiers;

/**
 * Rolls how populated the location is today.
 *
 * @param {string} location
 */
function rollFishPopulation(location) {
	const roll = random(1, 100);
	if (roll <= 10) {
		V.daily.fishing[location].fishPopulation = "teeming";
	} else if (roll <= 30) {
		V.daily.fishing[location].fishPopulation = "quiet";
	} else {
		V.daily.fishing[location].fishPopulation = "normal";
	}
}
window.rollFishPopulation = rollFishPopulation;

/**
 * Ensures today's per-location fishing pool has been rolled.
 *
 * @param {string} location
 */
function ensureFishingDailyPool(location) {
	V.daily.fishing ??= {};
	V.daily.fishing[location] ??= {};
	if (V.daily.fishing[location].fishPoolModifiers === undefined) {
		rollLocalFishPoolModifiers(location);
		rollFishPopulation(location);
	}
}
window.ensureFishingDailyPool = ensureFishingDailyPool;

function rollFish(bus) {
	ensureFishingDailyPool(bus);
	const possibleFish = [];
	for (const [fishKey, fishConfig] of Object.entries(setup.fishing.lootTables.fish)) {
		const locationWeight = fishConfig.locations[bus];
		if (locationWeight > 0) {
			const weatherMultiplier = fishConfig.preferredWeather.includes(Weather.name) ? 2 : 0.5;
			const poolModifier = V.daily.fishing[bus].fishPoolModifiers[fishKey];
			const baitMultiplier = fishingBaitWeightMultiplier(fishKey);

			possibleFish.push([fishKey, locationWeight * weatherMultiplier * poolModifier * baitMultiplier]);
		}
	}
	const fishKey = weightedRandom(...possibleFish);
	const fishConfig = setup.fishing.lootTables.fish[fishKey];
	const size = Math.ceil(rollFishSize(bus, fishKey));
	const aboveAverageSize = size > (fishConfig.minSize + fishConfig.maxSize) / 2;
	return {
		type: fishKey,
		size,
		aboveAverageSize,
	};
}
window.rollFish = rollFish;

/**
 * Fishing locations will roll each day for the rarity fo the different fish at the location. For fish that roll as more common than usual, there is a wait ambient added that shows the player them surfacing.
 *
 * @param {string} location
 */
function fishingSurfacingFish(location) {
	ensureFishingDailyPool(location);
	const modifiers = V.daily.fishing[location].fishPoolModifiers;
	return Object.keys(modifiers).filter(
		fishKey => modifiers[fishKey] === 1.4 && setup.fishing.lootTables.fish[fishKey].preferredWeather.includes(Weather.name)
	);
}
window.fishingSurfacingFish = fishingSurfacingFish;

function fishingUsingMagnetRod() {
	return V.worn.handheld.type.includes("fishing_rod_magnet");
}
window.fishingUsingMagnetRod = fishingUsingMagnetRod;

/**
 * If a fish you just hooked should be caught with the minigame.
 *
 * @param {object} fish
 */
function fishingTriggersReelFight(fish) {
	const fishConfig = setup.fishing.lootTables.fish[fish.type];
	if (fishConfig.requiresBaitFish) {
		return true;
	}

	if (!fishConfig.minigame) {
		return false;
	}

	const athleticsSizeBonus = Math.round(20 * Math.clamp(V.athletics / 1000, 0, 1));
	return fish.size >= setup.fishing.reelFightMinSize + athleticsSizeBonus;
}
window.fishingTriggersReelFight = fishingTriggersReelFight;

function rollFishingLootKey(lootTable, bus) {
	const options = [];
	for (const [lootKey, loot] of Object.entries(lootTable)) {
		if (loot.locations && !loot.locations.includes(bus)) {
			continue;
		}
		options.push([lootKey, loot.weight]);
	}
	return weightedRandom(...options);
}
window.rollFishingLootKey = rollFishingLootKey;

/**
 * Heavy scrap items can only be found caught once, and have their own event in the fishing loop. But since they are scrap, they still need to use the scrap table, since the scrap table is the source of truth for scrap information. So we exclude the big loot from the roll for normal events.
 *
 * @param {string} bus
 */
function rollMagnetScrap(bus) {
	const rollableScrap = Object.fromEntries(Object.entries(setup.fishing.lootTables.magnetScrap).filter(([, loot]) => !loot.big));
	return rollFishingLootKey(rollableScrap, bus);
}
window.rollMagnetScrap = rollMagnetScrap;

function fishingAntiqueAvailable(antiqueKey) {
	const status = V.museumAntiques?.antiques?.[antiqueKey];
	return !status || status === "notFound";
}
window.fishingAntiqueAvailable = fishingAntiqueAvailable;

function rollFishingTrash(bus) {
	return rollFishingLootKey(setup.fishing.lootTables.fishingTrash, bus);
}
window.rollFishingTrash = rollFishingTrash;

function rollFishingClothing(bus) {
	return rollFishingLootKey(setup.fishing.lootTables.fishingClothing, bus);
}
window.rollFishingClothing = rollFishingClothing;

function fishingFindClothingItem(name) {
	for (const [slot, items] of Object.entries(setup.clothes)) {
		const item = items.find(i => i.name === name);
		if (item) {
			const colour = item.colour_options.filter(c => c !== "custom").random();
			return { slot, item, colour };
		}
	}
	throw new Error(`fishingFindClothingItem: no clothing item found with name "${name}"`);
}
window.fishingFindClothingItem = fishingFindClothingItem;

function updateFishRecord(fishKey, fishSize, bus) {
	V.fishing.record[fishKey] ??= {
		numCaught: 0,
		largest: fishSize,
		foundIn: [],
	};

	const fishRecord = V.fishing.record[fishKey];
	fishRecord.numCaught += 1;
	fishRecord.largest = Math.max(fishRecord.largest, fishSize);
	if (!fishRecord.foundIn.includes(bus)) {
		fishRecord.foundIn.push(bus);
	}
}
window.updateFishRecord = updateFishRecord;

function numberOfFishCaught() {
	return Object.values(V.fishing.record).reduce((sum, r) => sum + r.numCaught, 0);
}
window.numberOfFishCaught = numberOfFishCaught;

function canCookFish(fishKey) {
	return Boolean(setup.fishing.lootTables.fish[fishKey]?.cookable);
}
window.canCookFish = canCookFish;

function canStartFishing() {
	// fishing todo
	// return !pcAreArmsBound("any") && (V.worn.handheld.type.includes("fishing_rod") || V.worn.handheld.type.includes("fishing_rod_magnet"););

	return true;
}
window.canStartFishing = canStartFishing;

function debugDiscoverAllFishing() {
	V.fishing.locationsFound = ["fishingPier", "fishingBeach", "fishingCoastPath", "fishingForestLake", "fishingMoor"];
	V.daily.fishing ??= {};

	for (const [fishKey, fishConfig] of Object.entries(setup.fishing.lootTables.fish)) {
		const busValues = V.fishing.locationsFound.filter(loc => fishConfig.locations[loc] > 0);
		if (random(1, 2) === 1) {
			updateFishRecord(fishKey, Math.ceil((fishConfig.minSize + fishConfig.maxSize) / 2), busValues[0]);
		} else {
			updateFishRecord(fishKey, fishConfig.minSize, busValues[0]);
			updateFishRecord(fishKey, fishConfig.maxSize, busValues[0]);
		}
		V.fishing.record[fishKey].foundIn = busValues;
	}
}
window.debugDiscoverAllFishing = debugDiscoverAllFishing;

function resetFishingCatchState() {
	delete V.fishingHookedFish;
	delete V.fishingMagnetScrap;
	delete V.fishingMagnetTrash;
	delete V.fishingTrash;
	delete V.fishingClothingName;
}
window.resetFishingCatchState = resetFishingCatchState;

function scrapInventoryTotal() {
	return V.scrapInventory.reduce((sum, key) => sum + setup.fishing.lootTables.magnetScrap[key].value, 0);
}
window.scrapInventoryTotal = scrapInventoryTotal;

function magnetLootWeight(locationKey, baseWeight) {
	const lootPresent = V.fishing.magnetLoot[locationKey].lootPresent;
	if (lootPresent === 0) return 0;
	return baseWeight * (0.5 + (0.5 * (lootPresent - 1)) / 7);
}
window.magnetLootWeight = magnetLootWeight;

function decrementMagnetLoot(locationKey) {
	V.fishing.magnetLoot[locationKey].lootPresent = Math.max(0, V.fishing.magnetLoot[locationKey].lootPresent - 1);
}
window.decrementMagnetLoot = decrementMagnetLoot;

function initFishingBeach() {
	if (V.bus !== "fishingBeach") delete V.fishing.currentBait;
	V.bus = "fishingBeach";
	V.daily.fishing ??= {};
	V.daily.fishing.magnetLootCaught ??= 0;
	V.daily.fishing.trashCaught ??= 0;
	V.daily.fishing.fishingBeach ??= {};
	V.daily.fishing.fishingBeach.fisher ??= {};
	V.daily.fishing.fishingBeach.fisher.drunk ??= 0;
	V.daily.fishing.fishingBeach.fisherOgle ??= 1;
	resetFishingCatchState();
}
window.initFishingBeach = initFishingBeach;

function initFishingCoastPath() {
	if (V.bus !== "fishingCoastPath") delete V.fishing.currentBait;
	V.bus = "fishingCoastPath";
	V.daily.fishing ??= {};
	V.daily.fishing.magnetLootCaught ??= 0;
	V.daily.fishing.trashCaught ??= 0;
	V.daily.fishing.fishingCoastPath ??= {};
	resetFishingCatchState();
}
window.initFishingCoastPath = initFishingCoastPath;

function initFishingForestLake() {
	if (V.bus !== "fishingForestLake") delete V.fishing.currentBait;
	V.bus = "fishingForestLake";
	V.fishing.fishingForestLake ??= {};
	V.fishing.fishingForestLake.event ??= "none";
	V.fishing.fishingForestLake.eventDanger ??= 0;
	V.daily.fishing ??= {};
	V.daily.fishing.magnetLootCaught ??= 0;
	V.daily.fishing.trashCaught ??= 0;
	V.daily.fishing.fishingForestLake ??= {};
	resetFishingCatchState();
}
window.initFishingForestLake = initFishingForestLake;

function initFishingMoor() {
	if (V.bus !== "fishingMoor") delete V.fishing.currentBait;
	V.bus = "fishingMoor";
	V.fishing.fishingMoor ??= {};
	V.fishing.fishingMoor.event ??= "none";
	V.fishing.fishingMoor.eventDanger ??= 0;
	V.daily.fishing ??= {};
	V.daily.fishing.magnetLootCaught ??= 0;
	V.daily.fishing.trashCaught ??= 0;
	V.daily.fishing.fishingMoor ??= {};
	V.daily.fishing.fishingMoor.fox ??= {};
	V.daily.fishing.fishingMoor.hikers ??= {};
	V.daily.fishing.fishingMoor.hikers.drinkCount ??= 0;
	if (V.moor_hunt >= 1) {
		V.fishing.fishingMoor.event = "none";
		V.fishing.fishingMoor.eventDanger = 0;
		if (["sit", "campfire"].includes(V.daily.fishing.fishingMoor.hikers.phase)) {
			V.daily.fishing.fishingMoor.hikers.phase = "finished";
			wikifier("clearNPC", "moor_hiker_1");
			wikifier("clearNPC", "moor_hiker_2");
		}
	}
	resetFishingCatchState();
}
window.initFishingMoor = initFishingMoor;

function initFishingPier() {
	if (V.bus !== "fishingPier") delete V.fishing.currentBait;
	V.bus = "fishingPier";
	V.fishing.whitney ??= {};
	V.daily.fishing ??= {};
	V.daily.fishing.magnetLootCaught ??= 0;
	V.daily.fishing.trashCaught ??= 0;
	V.daily.fishing.fishingPier ??= {};
	V.daily.fishing.fishingPier.fisher ??= {};
	V.daily.fishing.fishingPier.fisher.drunk ??= 0;
	V.daily.fishing.fishingPier.fisherOgle ??= 1;
	V.daily.fishing.fishingPier.whitney ??= {};
	V.daily.fishing.fishingPier.whitney.pcCider ??= 0;
	V.daily.fishing.fishingPier.whitney.pcCiderTotal ??= 0;
	resetFishingCatchState();
}
window.initFishingPier = initFishingPier;

function isPlayerFishingAlone() {
	switch (V.bus) {
		case "fishingBeach":
			return [undefined, "finished"].includes(V.daily?.fishing?.fishingBeach?.fisher?.phase);
		case "fishingPier":
			return (
				[undefined, "finished"].includes(V.daily?.fishing?.fishingPier?.fisher?.phase) &&
				[undefined, "finished"].includes(V.daily?.fishing?.fishingPier?.whitney?.phase)
			);
		case "fishingMoor":
			return [undefined, "finished"].includes(V.daily?.fishing?.fishingMoor?.hikers?.phase);
		case "fishingCoastPath":
			return true;
		case "fishingForestLake":
			return true;
		default:
			throw new Error(`isPlayerFishingAlone: unknown bus "${V.bus}"`);
	}
}
window.isPlayerFishingAlone = isPlayerFishingAlone;

function startFishingProp() {
	if (V.worn.handheld.type.includes("fishing_rod")) {
		V.worn.handheld.holdPosition = "right_cover";
		wikifier("updatesidebarimg");
	}
}
window.startFishingProp = startFishingProp;

/**
 * Some events are reused for fishing, such as some events on the beach that can also happen while fishing on the beach. So if you see this somewhere in an event that is unrelated to fishing, it is there for the case where you get into that event through fishing.
 */
function stopFishingProp() {
	if (V.worn.handheld.type.includes("fishing_rod")) {
		V.worn.handheld.holdPosition = 0;
		wikifier("updatesidebarimg");
	}
}
window.stopFishingProp = stopFishingProp;

function openBaitOverlay() {
	if (!T.fishingEditBaitEnabled) return;
	wikifier("overlayReplace", '"bait"');
}
window.openBaitOverlay = openBaitOverlay;

function onBaitLoss() {
	const bait = V.fishing.currentBait;
	delete V.fishing.currentBait;
	if (V.fishing.autoRebait && bait && V.foodstuff[bait]?.amount >= 1) {
		V.foodstuff[bait].amount -= 1;
		V.fishing.currentBait = bait;
	}
}
window.onBaitLoss = onBaitLoss;

function canEatFishTf(fish) {
	return V.cat >= 5 && fish.size <= 30;
}
window.canEatFishTf = canEatFishTf;

/**
 * Records the current in-game time as the arrival of a fishing event NPC so some of their interactions can be gated until some time has elapsed.
 */
function fishingRecordEventArrival() {
	V.daily.fishing.eventArrivalTime = Time.date.timeStamp;
}
window.fishingRecordEventArrival = fishingRecordEventArrival;

/**
 * Whether at least `minutes` of in-game time have elapsed since the last recorded fishing event NPC arrival.
 *
 * @param {number} minutes
 * @returns {boolean}
 */
function fishingArrivalTimePassed(minutes) {
	const arrival = V.daily.fishing.eventArrivalTime;
	if (arrival === undefined) return false;
	return Time.date.timeStamp - arrival >= minutes * 60;
}
window.fishingArrivalTimePassed = fishingArrivalTimePassed;

function fishingLocationWaterBodyName(bus) {
	switch (bus) {
		case "fishingPier":
		case "fishingBeach":
		case "fishingCoastPath":
			return "sea";
		case "fishingForestLake":
			return "lake";
		case "fishingMoor":
			return "water";
		default:
			throw new Error(`fishingLocationWaterBodyName: unknown bus "${bus}"`);
	}
}
window.fishingLocationWaterBodyName = fishingLocationWaterBodyName;

/**
 * Used to scale the likelihood of dangerous fishing events. x1 at allure <2000 (arbitrary), x2 at max allure (8000).
 *
 * @param {number} defaultEventWeight
 */
function fishingDangerEventWeight(defaultEventWeight) {
	const allureMultiplier = Math.clamp(1 + (V.allure - 2000) / 6000, 1, 2);
	return defaultEventWeight * allureMultiplier;
}
window.fishingDangerEventWeight = fishingDangerEventWeight;

/**
 * Used to scale the likelihood of catching a fish. x2 when teeming, x0.5 when quiet, 1 otherwise.
 *
 * @param {string} location
 * @param {number} defaultEventWeight
 */
function fishingCatchEventWeight(location, defaultEventWeight) {
	const population = V.daily.fishing[location]?.fishPopulation;
	let multiplier = 1;
	if (population === "teeming") {
		multiplier = 2;
	} else if (population === "quiet") {
		multiplier = 0.5;
	}
	return defaultEventWeight * multiplier;
}
window.fishingCatchEventWeight = fishingCatchEventWeight;

function fishingLocationDisplayName(locationKey) {
	switch (locationKey) {
		case "fishingBeach":
			return "Beach";
		case "fishingPier":
			return "Pier";
		case "fishingCoastPath":
			return "Coastal Path";
		case "fishingForestLake":
			return "Forest Lake";
		case "fishingMoor":
			return "Moor";
		default:
			throw new Error(`fishingLocationDisplayName: unknown location key "${locationKey}"`);
	}
}
window.fishingLocationDisplayName = fishingLocationDisplayName;
