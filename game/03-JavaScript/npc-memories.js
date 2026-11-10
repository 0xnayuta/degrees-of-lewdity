/**
 * Named NPC memories, stored in V.npcMemories by NPC name.
 * Please add memories here with a description. If it's not listed, adding, checking, or deleting the memory will throw.
 */
const VALID_MEMORIES = {
	Robin: [
		// If Bailey went after Robin because the PC wouldn't pay rent
		// Used so later rent collections involve Robin tied up whenever Robin is home, for Robin's "no matter what happens" line, and so the first fight doesn't repeat
		"baileyUsedRobinAsLeverage",
		// If the PC and Robin helped bandage another orphan
		// Not currently used
		"bandagedOrphan",
		// If the PC comforted Robin after the Avery school pickup
		// Used so Robin stays away from later pickups
		"comfortedAfterAveryPickup",
		// If the PC read Robin's confession note
		// Used so the note only appears once, to unlock accepting the confession, and so Robin acts hurt until then
		"confessionNoteRead",
		// If Robin has confronted the PC at the brothel before
		// Used to change Robin's lines when they catch PC again
		"confrontedPcAtBrothel",

		// If the PC asked Robin about the strange orphanage photo and Robin cried at it
		// Used to hide the option to ask again and for Robin to tell the PC about their dream
		"criedAtOrphanagePhoto",
		// If Robin told the PC about their dream about the orphanage photo
		// Used so the dream only plays once, and to let the PC ask Gwylan about the Seabird's Lullaby during the ritual
		"toldOrphanagePhotoDream",

		// If Robin drank PC's milk in the forest
		// Used to add a line to Robin's encounter speech
		"drankPcMilkInForest",
		// If the first Robin cat headpats scene has played
		// Used so later headpats skip the intro
		"firstCatHeadpats",

		// If Robin has shown the PC the new console
		// Used so the intro only plays the first time
		"firstConsoleReveal",
		// If Robin lost the console because of debt
		// Used so the scene only plays the first time
		"lostConsole",

		// If Robin's first debt punishment has started
		// Used so the intro only plays the first time
		"firstDebtPunishment",
		// If the PC has visited Robin's hot chocolate stand
		// Used so the intro and free drink are only for the first visit
		"firstHotChocolateStandVisit",
		// If Robin has shown the lemonade stand sign
		// Used so the scene only plays the first time
		"firstLemonadeSign",
		// If the PC has visited Robin's lemonade stand
		// Used so the intro and free drink are only for the first visit
		"firstLemonadeStandVisit",
		// If Robin has given the PC their savings for the first time after the PC took on their debt
		// Used so the explanation only plays once
		"firstSavingsPayout",
		// If Robin has flaunted their vagina to the PC
		// Used so Robin's first-time line only plays once
		"flauntedVagina",

		// If the PC found Robin's punishment at the docks
		// Used to hide the docks search and journal hint once Robin is found, and to unlock uncomfortable prostitution
		"foundAtDocks",
		// If Robin joked "I'm a mummy!" at the hospital after the docks
		// Used so Robin remembers it when the PC dresses as a mummy for Halloween
		"mummyJoke",
		// If the PC rescued Robin from the docks alone, either by fighting the crew or taking Robin's place
		// Used for an encounter line
		"rescuedFromDocksAlone",
		// If the PC rescued Robin from the docks with the dock workers' help
		// Used for an encounter line
		"rescuedFromDocksWithDockers",

		// If the PC found Robin at the landfill with the purple mist
		// Used to hide the journal hint once Robin is found
		"foundAtLandfill",
		// If Robin, under the landfill mist, raped the PC
		// Used so Robin apologises in later scenes
		"rapedPcUnderLandfillMist",

		// If Robin talked about the PC rescuing them from the docks alone during an encounter
		// Used so talking about it only takes trauma off Robin once
		"healedDocksAlone",
		// If Robin talked about the PC and the dockers rescuing them from the docks during an encounter
		// Used so talking about it only takes trauma off Robin once
		"healedDocksWithDockers",
		// If Robin talked about the mansion party during an encounter
		// Used so talking about it only takes trauma off Robin once
		"healedMansion",
		// If Robin talked about the landfill mist during an encounter
		// Used so talking about it only takes trauma off Robin once
		"healedMist",
		// If Robin talked about the PC rescuing them from the pillory during an encounter
		// Used so talking about it only takes trauma off Robin once
		"healedPilloryRescue",
		// If Robin talked about the underground brothel double punishment during an encounter
		// Used so talking about it only takes trauma off Robin once
		"healedUbDouble",
		// If Robin talked about escaping the underground brothel during an encounter
		// Used so talking about it only takes trauma off Robin once
		"healedUbEscape",
		// If Robin talked about the underground brothel machine during an encounter
		// Used so talking about it only takes trauma off Robin once
		"healedUbMachine",
		// If Robin talked about the metal cuffs and tentacles scene during an encounter
		// Used so talking about it only takes trauma off Robin once
		"healedUbMetal",

		// If Robin hit Avery with a school bag to protect the PC
		// Used to change Avery's pickups and drop-offs, Avery's and Robin's lines, and unlock a Sydney library scene
		"hitAveryWithBag",
		// If Robin came with the rescuers to Avery's skyscraper
		// Used so Robin finds the PC and speaks in the rescue scene
		"joinedSkyscraperRescue",
		// If the PC and Robin made flower crowns in the garden
		// Used to unlock the flower crown at Gwylan's shop and an asylum comfort line
		"madeFlowerCrowns",
		// If Robin has offered to water the PC's garden
		// Used to unlock asking Robin to start or stop watering
		"offeredToWaterGarden",

		// If the PC has broken down crying on Robin before
		// Used so, at love 40 or more, Robin reacts to later breakdowns as happening again
		"pcBrokeDownCrying",
		// If Robin went to Bailey for help after the PC broke down crying
		// Used so Robin stays with the PC in later breakdowns instead of running off for help, and so Robin later apologises
		"toldBaileyAboutPcBreakdown",
		// If Robin apologised for telling Bailey about the PC's breakdown
		// Used so the apology only plays once
		"apologisedForTellingBailey",

		// If the PC found Robin sobbing under the covers in their room, whether or not they went in
		// Used so it only plays the first time
		"pcHeardRobinCrying",
		// If the PC lashed out at Robin in a panic during an encounter
		// Used to change Robin's line when Robin is hit
		"pcHitRobinInPanic",
		// If the PC knows Robin pays Bailey
		// Used to unlock taking on Robin's debt, stop Robin's night visit that reveals it, and change lines about rent
		"pcKnowsRobinPaysBailey",
		// If the PC unwrapped Robin at Christmas
		// Used to unlock the gift wrap outfit at Gwylan's shop
		"pcUnwrappedRobin",
		// If the PC has visited Robin's room naked
		// Used so later naked visits skip the first-time reaction
		"pcVisitedRoomNaked",
		// If Robin promised in the infirmary to protect PC
		// Used so Robin steps in during lunch fights and mentions the promise
		"promisedToProtectPc",
		// If Robin has seen the PC's big breasts during an encounter
		// Used so Robin's surprised line only plays the first time
		"sawPcBigBreasts",
		// If Robin has seen the PC's chastity device during an encounter
		// Used so Robin's reaction only plays the first time
		"sawPcChastity",
		// If Robin has seen the PC's huge penis during an encounter
		// Used so Robin's surprised line only plays the first time
		"sawPcHugePenis",
		// If Robin has noticed the PC's sex skill during consensual sex
		// Used so Robin's surprised line only plays the first time
		"sawPcSexSkill",

		// If Robin was stripped naked in the pillory
		// Used to change Robin's pillory encounter lines
		"strippedInPillory",
		// If the PC rescued Robin from the pillory
		// Used for an encounter line
		"rescuedFromPillory",

		// If Robin has thanked the PC "For everything."
		// Used so the line only plays the first time
		"thankedForEverything",
		// If Robin told the PC in the garden that their favourite flowers are daisies
		// Used so the question is only asked the first time
		"toldFavouriteFlower",

		// If Robin and the PC were punished together at the underground brothel
		// Used for an encounter line
		"ubPunishedTogether",
		// If Robin and the PC went through the underground brothel machine
		// Used for an encounter line
		"ubMachineTogether",
		// If Robin begged the machine to go slower (faster for the PC)
		// Used for an encounter line
		"ubBeggedMachineSlower",
		// If Robin and the PC went through the metal cuffs and tentacles scene
		// Used for an encounter line
		"ubMetalTogether",
		// If Robin and the PC escaped through the metal cuffs and tentacles scene
		// Used for an encounter line
		"ubEscapedFromMetal",
		// If Robin and the PC escaped the underground brothel through the Hunt
		// Used for an encounter line
		"ubEscapedThroughHunt",
		// If Robin and the PC escaped the underground brothel together
		// Used for an encounter line
		"ubEscapedTogether",
		// If Robin escaped the underground brothel without the PC
		// Used for an encounter line
		"ubEscapedAlone",

		// If Robin has been to the forest shop with the PC
		// Used to skip the first-time text on later forest trips and on the Halloween costume trip
		"visitedForestShop",
	],
	Sirris: [
		// If the PC saw Sirris carrying a box to their car after school, hinting at the adult shop opening
		// Used so the hint only plays once
		"adultShopIntro",
	],
	Bailey: [
		// If the PC helped another orphan fight off an attacker at the orphanage
		// Used so Bailey only reacts and gains respect the first time
		"homeScream",
		// If Bailey took the PC to the docks after winning Avery's card game
		// Used so Bailey drives straight to the orphanage in later games
		"cardsDocks",
	],
	Leighton: [
		// If Leighton has been put in the pillory
		// Used for a Bailey line about Leighton after Avery's card game
		"pillory",
	],
};

/**
 * @param {NpcNames} npcName
 * @param {string} memory
 * @returns {boolean}
 */
function isMemoryValid(npcName, memory) {
	return VALID_MEMORIES[npcName].includes(memory);
}

/**
 * @param {NpcNames} npcName
 * @param {string} memory
 */
function addMemory(npcName, memory) {
	if (!isMemoryValid(npcName, memory)) {
		throw new Error(`"${memory}" is not a valid ${npcName} memory.`);
	}
	V.npcMemories[npcName].pushUnique(memory);
}

/**
 * @param {NpcNames} npcName
 * @param {string} memory
 * @returns {boolean}
 */
function hasMemory(npcName, memory) {
	if (!isMemoryValid(npcName, memory)) {
		throw new Error(`"${memory}" is not a valid ${npcName} memory.`);
	}
	return V.npcMemories[npcName].includes(memory);
}

/**
 * @param {NpcNames} npcName
 * @param {string} memory
 */
function deleteMemory(npcName, memory) {
	if (!isMemoryValid(npcName, memory)) {
		throw new Error(`"${memory}" is not a valid ${npcName} memory.`);
	}
	V.npcMemories[npcName].delete(memory);
}

const Memories = {
	Robin: {
		add: memory => addMemory("Robin", memory),
		has: memory => hasMemory("Robin", memory),
		delete: memory => deleteMemory("Robin", memory),
	},
	Sirris: {
		add: memory => addMemory("Sirris", memory),
		has: memory => hasMemory("Sirris", memory),
		delete: memory => deleteMemory("Sirris", memory),
	},
	Bailey: {
		add: memory => addMemory("Bailey", memory),
		has: memory => hasMemory("Bailey", memory),
		delete: memory => deleteMemory("Bailey", memory),
	},
	Leighton: {
		add: memory => addMemory("Leighton", memory),
		has: memory => hasMemory("Leighton", memory),
		delete: memory => deleteMemory("Leighton", memory),
	},
};
window.Memories = Memories;
