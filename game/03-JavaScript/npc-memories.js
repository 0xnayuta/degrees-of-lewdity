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

		// If the PC found Robin at the landfill with the purple mist
		// Used to hide the journal hint once Robin is found
		"foundAtLandfill",
		// If Robin, under the landfill mist, raped the PC
		// Used so Robin apologises in later scenes
		"rapedPcUnderLandfillMist",

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
		// If Bailey first came to collect rent from the PC at the temple
		// Used so Bailey's temple intro only plays once. Also a general marker that Bailey and the temple are aware of one another. Bailey "knows" who Sydney is after this, and will have an encounter line for them.
		"firstTempleVisit",
		// If Bailey has met Avery, at the cafe opening or at Avery's card game
		// Used so Avery's handshake introduction at the cafe opening plays if they have not met. Allows Bailey to say an encounter line for them.
		"metAvery",
		// If the PC offered Bailey sex instead of rent money, which Bailey turns down
		// Not accessible. Used for the Seduce option.
		"pcOfferedSexForRent",
		// If the PC saw Bailey kissing a one night stand at the flats
		// Used so the next time it says it's a different partner
		"pcSawWithPartnerAtFlats",
		// If the PC helped another orphan fight off an attacker at the orphanage, with Bailey watching
		// Used so Bailey only reacts and gains respect the first time
		"pcStoppedOrphanAttack",
		// If Bailey took the PC to the docks after winning Avery's card game
		// Used so Bailey drives straight to the orphanage in later games
		"tookPcToDocksAfterCards",
	],
	Leighton: [
		// If Leighton agreed to pay the PC £50 for each photoshoot, whether the PC offered or demanded it when blackmailing Leighton
		// Used to turn the office photoshoot into a paid one, prevents the photos from going up on the notice board, and for journal reminders
		"agreedToPayForPhotoshoots",

		// If Leighton first met the PC working at the brothel
		// Used so the meeting only plays once, so Leighton can turn up as a customer while the PC dances, and to halve the fame needed for Leighton's photo blackmail
		"metPcAtBrothel",

		// If the PC found Leighton's computer password in the maths class envelope delivery
		// Used to let the PC break into Leighton's computer when the office is empty
		"pcFoundComputerPassword",
		// If the PC copied Leighton's photos of Darryl onto a flash drive
		// Used so the PC only breaks into the computer once, lets the PC hand the photos to the police or blackmail Leighton, unlocks the foreign school clothes, and sets relationship text to "has a folder devoted to you"
		"pcCopiedDarrylPhotos",
		// If the PC gave the photos of Darryl to the police
		// Used so it can only happen once, lets the PC frame Leighton on the police computer, and for Gwylan's reply
		"pcGavePhotosToPolice",
		// If the PC blackmailed Leighton with the photos of Darryl
		// Used to hide the blackmail option afterwards, to make Leighton unforgiving in encounters, unlocks some scenes with Leighton at the brothel, used for Leighton's lines when offering money at the brothel and when starting the photo blackmail, and for Gwylan's reply
		"pcBlackmailedWithDarrylPhotos",
		// If the PC took Leighton's watch as the blackmail price
		// Not currently used
		"pcDemandedWatch",
		// If the PC's blackmail price was no more detention
		// Used so Leighton stops enforcing detention at the school gate and when leaving in the afternoon, and for Leighton's, Sydney's and fishing lines about it
		"pcDemandedNoDetention",
		// If the PC's blackmail price was no more photoshoots
		// Used to stop the blackmail photoshoots and the journal reminder, and so the photos never go up on the notice board
		"pcDemandedPhotoshootStop",

		// If the PC punched Leighton in the library to protect Sydney
		// Used so Leighton catches the PC's arm the next time, and so Leighton takes revenge in the library later
		"pcPunchedToProtectSydney",
		// If Leighton punished the PC and Sydney in the library for the punch
		// Used so the revenge only plays once
		"punishedPcAndSydneyForPunch",

		// If the PC refused Leighton's photo blackmail
		// Used so the photos will go up on the notice board
		"pcRefusedPhotoshoots",
		// If Leighton's photos of the PC were put up on the school notice board
		// Used so the board scene only plays once, to stop the blackmail photoshoots, and to hide the PC's photoshoot demands when blackmailing Leighton
		"postedPhotosOnNoticeBoard",

		// If Leighton has been put in the pillory
		// Used for a Bailey line about Leighton after Avery's card game
		"putInPillory",
	],
	Quinn: [
		// If Quinn won Avery's card game and made the PC watch their movies at their mansion
		// Used to unlock praising or insulting Quinn's movies when Quinn is the guest at Avery's party
		"madePcWatchMovies",
	],
	Niki: [
		// If the PC has knocked at Niki's studio and asked for work, or modelled there
		// Used so the PC's photos appear on the studio wall once their model fame is high enough
		"firstStudioVisit",
		// If the PC ran into Briar leaving Niki's studio
		// Used so the scene only plays once
		"pcMetBriarAtStudio",
		// If Niki photographed the PC on display at the adult shop opening
		// Used so Sirris reminds the PC of the opening when Niki turns up at Winter's lake office
		"photographedAdultShopOpening",
		// If Niki photographed the PC at Remy's farm
		// Used so the PC recognises Niki from the farm when they meet again, and so the PC hurries away when Niki pulls up in the street
		"photographedPcAtFarm",
		// If Sam sent the PC to Niki's studio to shoot the cafe advert
		// Used with Niki's other memories to tell whether the PC has met Niki
		"photographedPcForCafeAdvert",
		// If Avery paid Niki to photograph the PC and Avery on the boulevard
		// Used so Niki and Avery greet each other next time
		"photographedPcWithAvery",
		// If Niki pulled up beside the PC in the street and told them about the studio
		// Used with Niki's other memories to tell whether the PC has met Niki
		"stoppedPcInStreet",
		// If Niki came to Winter's lake office as a volunteer
		// Used with Niki's other memories to tell whether the PC has met Niki
		"volunteeredForWinter",
	],
	"Night Monster": [
		// If the Night Monster has carried the PC off to its lair
		// Used to change its lines when it carries the PC off again
		"carriedPcToLair",
		// If the PC looked out of the hole in the Night Monster's lair
		// Used to unlock escaping the lair
		"pcLookedOutOfLair",
	],
	Zephyr: [
		// If Zephyr met PC at the smuggler pub and offered them passage to the island
		// Used so the meeting only plays once, to unlock speaking to Zephyr, and so the PC recognises Zephyr in future scenes
		"metPcAtSmugglerPub",
		// If the Ivory Wraith possessed PC beat Zephyr on deck and took the PC over the railing through the whirlpool
		// Not currently used
		"watchedPossessedPcJumpOverboard",
	],
	Jordan: [
		// If a Fallen Angel PC asked Jordan for forgiveness and was told it takes a £10,000 donation
		// Used to swap "Request forgiveness" for "Buy forgiveness", and so Jordan speaks up for the PC's honesty during Sydney's purity evaluation
		"pcAskedForForgiveness",

		// If the PC crawled into Jordan's room and heard Jordan singing in the shower
		// Used to bring up the song to Gwylan
		"pcHeardSingingInShower",
		// If the PC peeked behind the curtain at Jordan showering
		// Not currently used
		"pcPeekedInShower",
		// If the PC masturbated while watching Jordan shower
		// Not currently used
		"pcMasturbatedWatchingShower",

		// If the PC told Jordan, after Jordan rescued them from Kylar, that Bailey beats and extorts the orphans
		// Used so Jordan starts to question Bailey at Bailey's first temple visit, before the Bishop's Hands stop them
		"pcWarnedAboutBailey",
	],
	Darryl: [
		// If the PC has met Darryl in the strip club office
		// Used so Darryl's introduction and the question about their lost spectacles only play the first time
		"firstOfficeVisit",
	],
	Charlie: [
		// If the PC has had their first class at the dance studio and met Charlie
		// Used so Charlie's introduction plays before the first lesson, so the dance lesson only takes its 20 minutes after it, and so Charlie can offer dance jobs
		"firstLesson",
		// If the PC broke down in Charlie's car and talked about Bailey after breaking down at a dance job
		// Used to unlock asking Charlie for more dangerous work, and so Charlie offers a lift straight away after later break downs.
		"pcToldAboutBailey",
		// If the PC pulled their hands away when Charlie went to hold them in a dance lesson
		// Used so Charlie remembers the PC is shy about it the next time they pull away
		"pcRefusedHandholding",
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
	Quinn: {
		add: memory => addMemory("Quinn", memory),
		has: memory => hasMemory("Quinn", memory),
		delete: memory => deleteMemory("Quinn", memory),
	},
	Niki: {
		add: memory => addMemory("Niki", memory),
		has: memory => hasMemory("Niki", memory),
		delete: memory => deleteMemory("Niki", memory),
	},
	NightMonster: {
		add: memory => addMemory("Night Monster", memory),
		has: memory => hasMemory("Night Monster", memory),
		delete: memory => deleteMemory("Night Monster", memory),
	},
	Zephyr: {
		add: memory => addMemory("Zephyr", memory),
		has: memory => hasMemory("Zephyr", memory),
		delete: memory => deleteMemory("Zephyr", memory),
	},
	Jordan: {
		add: memory => addMemory("Jordan", memory),
		has: memory => hasMemory("Jordan", memory),
		delete: memory => deleteMemory("Jordan", memory),
	},
	Darryl: {
		add: memory => addMemory("Darryl", memory),
		has: memory => hasMemory("Darryl", memory),
		delete: memory => deleteMemory("Darryl", memory),
	},
	Charlie: {
		add: memory => addMemory("Charlie", memory),
		has: memory => hasMemory("Charlie", memory),
		delete: memory => deleteMemory("Charlie", memory),
	},
};
window.Memories = Memories;
