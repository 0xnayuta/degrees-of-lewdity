/*
====== Main Fishing Todo ======  
- Test screaming for gwa rescue in forest fishing attack
- Add npc fisher catch events for the beach, same as on the pier.
- Either unify the two npc fisher events and make them reuse code, or justify their separation by adding specific location descriptions
- The beach npc fisher has no rescue events, so a huge fish dragging the PC into the surf resolves without them. Maybe give them a save + coercion chain like the pier fisher has.
- The magnet fishing rod isn't a rod, it's just a big magnet on a rope. Needs new art.
- Fishing bait system. Some foodstuff can be used for bait, and can be used to catch fish. You can also catch baitfish on the non-cliff locations, and then use the baitfish to catch big fish. 
- Old, smelly, rundown store on the pier where you can buy dead worms (basic bait, not as good as foodstuff bait) and also where you can buy a fishing rod and a magnet for fishing (or maybe move the magnet somewhere else). Maybe you can get fishing tips there too.
- Revisit fish size system
- Journal stars fish are squished, revisit how fishing journal is constructed
- Move fishing records to the pier shack? 
- Test all fishing events to make sure that they make sense with the new no-minigame fishing system
- Investigate reusing a passage for the heavy magnet events

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
	const size = round(lerp(sizeRoll, fishConfig.minSize, fishConfig.maxSize), 2);

	// Rounds 98%+ sized to 100% so people don't get fish that are super super close to max size, but aren't the max size.
	if (size >= fishConfig.minSize + 0.98 * (fishConfig.maxSize - fishConfig.minSize)) {
		return fishConfig.maxSize;
	}
	return size;
}

function rollFish(bus) {
	const options = [];
	for (const [fishKey, fishConfig] of Object.entries(setup.fishing.lootTables.fish)) {
		const locationWeight = fishConfig.locations[bus];
		if (locationWeight > 0) {
			const weight = fishConfig.preferredWeather.includes(Weather.name) ? locationWeight * 2 : locationWeight * 0.5;
			options.push([fishKey, weight]);
		}
	}
	const fishKey = weightedRandom(...options);
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

function fishingUsingMagnetRod() {
	return V.worn.handheld.type.includes("fishing_rod_magnet");
}
window.fishingUsingMagnetRod = fishingUsingMagnetRod;

function fishingTriggersReelFight(fish) {
	// Fishing todo: Make this take into account athletics
	return fish.size >= setup.fishing.reelFightMinSize;
}
window.fishingTriggersReelFight = fishingTriggersReelFight;

function rollFishingLootKey(lootTable, bus) {
	const options = [];
	for (const [lootKey, loot] of Object.entries(lootTable)) {
		if (loot.locations && !loot.locations.includes(bus)) {
			continue;
		}
		// Heavy single-catch items live on the scrap table for value/name lookups, but are
		// only ever obtained through their own inline events.
		if (loot.big) continue;
		options.push([lootKey, loot.weight]);
	}
	return weightedRandom(...options);
}
window.rollFishingLootKey = rollFishingLootKey;

function rollMagnetScrap(bus) {
	const lootKey = rollFishingLootKey(setup.fishing.lootTables.magnetScrap, bus);
	const loot = setup.fishing.lootTables.magnetScrap[lootKey];
	return { type: lootKey, name: loot.name, value: loot.value };
}
window.rollMagnetScrap = rollMagnetScrap;

// A one-off antique inline event should only fire while its antique hasn't been found yet.
function fishingAntiqueAvailable(antiqueKey) {
	const status = V.museumAntiques?.antiques?.[antiqueKey];
	return !status || status === "notFound";
}
window.fishingAntiqueAvailable = fishingAntiqueAvailable;

function rollFishingTrash(bus) {
	return { type: rollFishingLootKey(setup.fishing.lootTables.fishingTrash, bus) };
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
	// return !pcAreArmsBound("any") && V.worn.handheld.type.includes("fishing_rod");

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
	delete V.fishingReelAttempts;
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
	V.bus = "fishingBeach";
	V.fishing.beach ??= {};
	V.daily.fishing ??= {};
	V.daily.fishing.magnetLootCaught ??= 0;
	V.daily.fishing.trashCaught ??= 0;
	V.daily.fishing.beach ??= {};
	V.daily.fishing.beach.fisher ??= {};
	V.daily.fishing.beach.fisher.drunk ??= 0;
	resetFishingCatchState();
}
window.initFishingBeach = initFishingBeach;

function initFishingCoastPath() {
	V.bus = "fishingCoastPath";
	V.fishing.coastPath ??= {};
	V.daily.fishing ??= {};
	V.daily.fishing.magnetLootCaught ??= 0;
	V.daily.fishing.trashCaught ??= 0;
	V.daily.fishing.coastPath ??= {};
	resetFishingCatchState();
}
window.initFishingCoastPath = initFishingCoastPath;

function initFishingForestLake() {
	V.bus = "fishingForestLake";
	V.fishing.forestLake ??= {};
	V.fishing.forestLake.event ??= "none";
	V.fishing.forestLake.eventDanger ??= 0;
	V.daily.fishing ??= {};
	V.daily.fishing.magnetLootCaught ??= 0;
	V.daily.fishing.trashCaught ??= 0;
	V.daily.fishing.forestLake ??= {};
	resetFishingCatchState();
}
window.initFishingForestLake = initFishingForestLake;

function initFishingMoor() {
	V.bus = "fishingMoor";
	V.fishing.moor ??= {};
	V.fishing.moor.event ??= "none";
	V.fishing.moor.eventDanger ??= 0;
	V.daily.fishing ??= {};
	V.daily.fishing.magnetLootCaught ??= 0;
	V.daily.fishing.trashCaught ??= 0;
	V.daily.fishing.moor ??= {};
	V.daily.fishing.moor.fox ??= {};
	V.daily.fishing.moor.hikers ??= {};
	V.daily.fishing.moor.hikers.drinkCount ??= 0;
	if (V.moor_hunt >= 1) {
		V.fishing.moor.event = "none";
		V.fishing.moor.eventDanger = 0;
		if (["sit", "campfire"].includes(V.daily.fishing.moor.hikers?.phase)) {
			V.daily.fishing.moor.hikers.phase = "finished";
			wikifier("clearNPC", "moor_hiker_1");
			wikifier("clearNPC", "moor_hiker_2");
		}
	}
	resetFishingCatchState();
}
window.initFishingMoor = initFishingMoor;

function initFishingPier() {
	V.bus = "fishingPier";
	V.fishing.pier ??= {};
	V.fishing.whitney ??= {};
	V.daily.fishing ??= {};
	V.daily.fishing.magnetLootCaught ??= 0;
	V.daily.fishing.trashCaught ??= 0;
	V.daily.fishing.pier ??= {};
	V.daily.fishing.pier.fisher ??= {};
	V.daily.fishing.pier.fisher.drunk ??= 0;
	V.daily.fishing.pier.whitney ??= {};
	V.daily.fishing.pier.whitney.pcCider ??= 0;
	V.daily.fishing.pier.whitney.pcCiderTotal ??= 0;
	resetFishingCatchState();
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
			return [undefined, "finished"].includes(V.daily?.fishing?.moor?.hikers?.phase);
		case "fishingCoastPath":
			return true;
		case "fishingForestLake":
			return true;
	}
}
window.isPlayerFishingAlone = isPlayerFishingAlone;

function startFishingProp() {
	if (V.worn.handheld.type.includes("fishing_rod") || V.worn.handheld.type.includes("fishing_rod_magnet")) {
		V.worn.handheld.holdPosition = "right_cover";
		wikifier("updatesidebarimg");
	}
}
window.startFishingProp = startFishingProp;

// Some events are reused for fishing, such as some events on the beach that can also happen while fishing on the beach. So if you see this somewhere in an event that is unrelated to fishing, it is there for the case where you get into that event through fishing.
function stopFishingProp() {
	if (V.worn.handheld.type.includes("fishing_rod") || V.worn.handheld.type.includes("fishing_rod_magnet")) {
		V.worn.handheld.holdPosition = 0;
		wikifier("updatesidebarimg");
	}
}
window.stopFishingProp = stopFishingProp;

function canEatFishTf(fish) {
	return V.cat >= 5 && fish.size <= 20;
}
window.canEatFishTf = canEatFishTf;

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

// Used to scale the likelihood of dangerous fishing events. x1 at allure <2000 (arbitrary), x2 at max allure (8000).
function fishingDangerEventWeight(defaultEventWeight) {
	const allureMultiplier = Math.clamp(1 + (V.allure - 2000) / 6000, 1, 2);
	return defaultEventWeight * allureMultiplier;
}
window.fishingDangerEventWeight = fishingDangerEventWeight;

// Used to scale the likelihood of catching a fish. x2 when teeming, x0.5 when quiet, 1 otherwise.
function fishingCatchEventWeight(location, defaultEventWeight) {
	const population = V.daily.fishing[location]?.fishPopulation;
	const multiplier = population === "teeming" ? 2 : population === "quiet" ? 0.5 : 1;
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
