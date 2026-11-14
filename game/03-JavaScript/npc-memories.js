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
	Kylar: [
		// If Kylar looked the PC in the eye and greeted them when they approached for the first time
		// Used so the greeting only plays once
		"firstBraveGreeting",
		// If the PC told Kylar to make a wish at the park fountain and tossed a coin in
		// Used so the first wish text only plays once and makes Kylar more likely to wait at the park fountain. It also adds more lines and money to the scene where Whitney digs for change in the fountain.
		"firstFountainWish",
		// If Kylar first has lunch with the PC in the canteen
		// Used so Kylar's thanks for sitting with them only plays the first time
		"firstLunchTogether",
		// If Kylar saw Sydney kiss and write on the PC's face in the library, saw lewd bodywriting from Sydney on the PC, or heard the PC moan Sydney's name during an encounter
		// Used to add new scenes and lines where Kylar is jealous of Sydney
		"jealousOfSydney",
		// If the PC asked Kylar about their desktop wallpaper at the manor
		// Used to hide the option to ask again
		"pcAskedAboutWallpaper",
		// If the PC cleaned the lab in Kylar's manor
		// Used for a line when the PC tells Kylar about the orphanage loft
		"pcCleanedManorLab",
		// If the PC got angry at or teased Kylar after catching Kylar sniffing their bedding
		// Used as one way to unlock asking for Kylar's underwear and Kylar can apologize for it during their firstBraveGreeting
		"pcConfrontedInPcBedroom",
		// If the PC ignored Kylar being bullied in the school hallway
		// Used so the bullying intro doesn't play again and for some lines from Kylar
		"pcIgnoredBeingBullied",
		// If the PC slept in Kylar's bed at the manor and woke up to and Kylar's parents carrying them to a stone altar in the forest
		// Used to hide the option to sleep there again, and to unlock researching the altar in the school library and its journal entry
		"pcSleptAtManor",
		// If the PC took Kylar's underwear and asked Kylar to keep going without
		// Used so Kylar goes commando, to unlock checking for it when flirting, to hide asking for it again, and for various lines and scenes
		"pcToldToGoCommando",
		// If Kylar said "I love you" to the PC during an encounter or on being given a strap-on
		// Used for lines in the orphanage cuddle scene about Kylar having said it before
		"saidLoveToPc",
		// If Kylar saw the park fountain frozen over in winter with the PC
		// Used so Kylar's reaction only plays once
		"sawFrozenFountain",
		// If Kylar found during an encounter that the PC's genitals aren't what their appearance suggests
		// Used so Kylar's reaction only plays once
		"sawPcCrossdressing",
		// If Kylar saw the PC's herm genitals during an encounter
		// Used so Kylar's reaction only plays once
		"sawPcHermGenitals",
		// If Kylar, while in love with and dating the PC ($kylar.romance), found a tattoo of Kylar's writing on the PC while chatting
		// Used so Kylar's overjoyed reaction only plays once
		"sawPcKylarTattoo",
		// If Kylar first noticed the PC wearing a love locket while chatting
		// Used to let Kylar break into the PC's bedroom at night when a love locket is in their wardrobe
		"sawPcLoveLocket",

		// If Kylar went through the PC's orphanage wardrobe and took a pair of underwear, if there were any
		// Used so `Kylar Bedroom 1` only plays once when $kylar.orphanage.bedroomVisitProgress reaches 100, and so `Kylar Bedroom 2` plays next time
		"snoopedInPcWardrobe",
		// If the PC peeked into their bedroom and saw Kylar sniffing their bedding
		// Used so `Kylar Bedroom 2` only plays once
		"sniffedPcBedding",

		// If Kylar told the PC while chatting that Kylar's favourite flower is nightshade and asked for the PC's
		// Used so the question is only asked the first time
		"toldFavouriteFlower",
		// If Kylar broke into the PC's bedroom at night and took the love locket from their wardrobe
		// Not currently used
		"tookPcLoveLocket",
		// If the PC woke up chained in the manor basement after Kylar kidnapped them
		// Used to unlock the rose wedding attire at the forest shop
		"tookPcToBasement",
	],
	"Black Wolf": [
		// If the Black Wolf has taken the PC up the hill to watch the forest
		// Used so later trips skip the walk up the hill and the PC thanks the Black Wolf for bringing them again
		"firstForestWatch",
		// If the Black Wolf has led the PC to the pups' den after a birth
		// Used to show the pups' den in the wolf cave, and so later births skip the den introduction
		"showedPcPupsDen",
	],
	Gwylan: [
		// If Robin has visited the forest shop
		// Mainly used when Gwylan talks to/about Robin, usually asking PC to bring them to the shop again.
		"robinVisitedShop",

		// If Gwylan has seen that PC has both genitals
		// Used so Gwylan's reaction only plays once
		"sawPcHermGenitals",

		// If Gwylan has seen PC crossdressing
		// Used so Gwylan's reaction only plays once
		"sawPcCrossdressing",

		// If Gwylan has walked to cafe with Robin
		// Not yet implemented
		"walkedToCafeWithRobin",

		// If Gwylan Romance state has been reached
		// Not yet implemented
		"romance",

		// If Gwylan is an LI
		"loveInterest",

		// If Yearning has been revealed
		"yearning",

		// If 2nd Ritual has been done
		"ritualSex",

		// If Gwylan has confronted PC about the Auriga Scar
		"aurigaScar",

		// If Gwylan has forgiven PC for siding with the cult
		"aurigaScarForgiven",

		// If seen door to forest shop garden
		"gardenDoor",

		// If Gwylan's TF has been revealed
		// Used by gwylanStatusCheck() to see if Gwylan's TF can be shown
		"gwylanTfRevealed",

		// If Gwylan's fox ears have been seen
		// Used to ask about Gwylan's ears
		"gwylanEarsSeen",

		// If the PC has talked with Gwylan about their fox ears
		// Used to reveal Gwylan's TF after the other parts are talked about
		"gwylanEarsTalk",

		// If Gwylan's fox tail has been seen
		// Used to ask about Gwylan's tail
		"gwylanTailSeen",

		// If the PC has talked with Gwylan about their fox tail
		// Used to reveal Gwylan's TF after the other parts are talked about
		"gwylanTailTalk",

		// If Gwylan's fox fangs have been seen
		// Used to ask about Gwylan's fangs
		"gwylanFangsSeen",

		// If the PC has talked with Gwylan about their fox fangs
		// Used to reveal Gwylan's TF after the other parts are talked about
		"gwylanFangsTalk",

		// If the PC has talked to Gwylan at the pub while they're sulking
		"pubSulk",

		// If the PC has kissed Gwylan at the pub while they're sulking
		"pubSulkKiss",

		// If the PC has has found Gwylan in the shop
		// Used so the intro lines when finding them the first time plays once
		"findGwylanIntro",

		// If the PC has asked Gwylan about the shop
		// Clothing talk scenes are locked behind this
		"clothesTalkIntro",

		// If Gwylan has seen PC drinking during the day at high stress/trauma or low Gwylan love
		"badDayDrinking",

		// If the PC has aiding Gwylan when they were injured
		// Not used yet
		"brownFoxAided",

		// If the PC drank in celebration with Gwylan after failed skyscraper ritual
		// Not used yet
		"brownFoxDrink",

		// If the PC passed the Brown Fox seduction check
		// Not used yet
		"brownFoxFlirted",

		// If the PC told Gwylan that they swapped Harper's mixture
		// Not used yet
		"brownFoxHarperMixtureSwap",

		// If the PC has seen Gwylan's scar
		// Used to prevent PC noticing it multiple times
		"brownFoxScarSeen",

		// If the Brown Fox's identity has been revealed
		"brownFoxRevealed",

		// If the PC has talked Gwylan about the Brown Fox's mask
		"brownFoxMaskTalk",

		// If the PC has seen Gwylan's wound or scar
		"brownFoxWoundedHint",

		// If the PC has blown Gwylan's cover
		"brownFoxCoverBlown",

		// If the PC has seen the charms at the shop before progressing enough to replace them
		// Used to prevent Gwylan from talking about them more than once
		"charms",

		// If the PC has been inside the shop on a blood moon
		// Used to allow PC in the shop without the shop letting PC in as Gwylan
		"bloodMoon",

		// If Gwylan has asked or been to the cafe with PC
		"cafeIntro",

		// If Gwylan has asked PC about the cream buns
		"cafeCreamBunsAsk",

		// If the PC has talked to Gwylan after they learn the secret ingredient of the cream buns
		"cafeCreamBunsTold",

		// If Gwylan was at the cafe reopening
		"atCafeOpening",

		// If the PC saw Gwylan at the cafe reopening
		"seenAtCafeOpening",

		// If the PC talked to Gwylan at the cafe reopening
		"talkedAtCafeOpening",

		// If Gwylan has asked PC to walk with to or from the cafe with them
		"cafeWalk",

		// If the PC has watched Gwylan perform the ritual
		"ritualCaught",

		// If the PC has watched Gwylan perform the ritual without lewdness
		// Happens if wolf sex is disabled or soft world corruption is below 25
		"ritualCaughtNoLewd",

		// If the PC masturbated while watching Gwylan perform the ritual
		"ritualCaughtMasturbate",

		// If the PC chose to distract the beast after interrupting Gwylan's ritual
		"ritualCaughtDistract",

		// If the PC chose to help after interrupting Gwylan's ritual
		"ritualCaughtHelp",

		// If the PC chose to watch after interrupting Gwylan's ritual
		"ritualCaughtWatch",

		// If the PC has done the true mating ritual
		// Not used currently
		"trueMatingRitual",

		// If Gwylan has seen PC wearing a chastity belt outside of combat
		// Not used currently
		"chastityBelt",

		// If Gwylan has removed a gold chastity belt
		// Used to prevent PC talking about it again
		"goldChastityBeltRemoved",

		// If the PC talked about the science behind gold chastity belt removal
		// Used to prevent PC talking about it again
		"goldChastityBeltRemovedScience",

		// If the PC told Gwylan that they left money for a poor family when talking about the christmas clothes
		"leftMoneyForFamily",

		// If the PC tried talking about a clothes item obtained via feats
		// Not used currently
		"featSpecialClothesTalked",

		// If the PC tried talking about a clothes item obtained via cheats
		// Not used currently
		"cheatedSpecialClothesTalked",

		// If the PC tried talking about a clothes item after savescumming
		"savescumSpecialClothesTalked",

		// If the PC has licked cream off of Gwylan
		"creamLickRequest",

		// If Gwylan has pulled out the dog bowl for PC
		"dogBowl",

		// If Gwylan has decorated the dog bowl
		"dogBowlDecorated",

		// If Gwylan has given PC a pet bed in the forest shop
		"petBedIntro",

		// If Gwylan has seen PC's ear slimes
		"earSlime",

		// If Gwylan has noticed PC's ear slime but hasn't actually seen them
		// Usually via a denied orgasm
		"earSlimeIntro",

		// If Gwylan has rescued PC in the forest
		"forestRescue",

		// If the PC has been caught by Gwylan during a safe hunt early during their content
		"caughtDuringSafeHunt",

		// If the PC has visited the forest shop
		"forestShopIntro",

		// If the PC has seen Eden and Gwylan getting along
		"edenFrenemies",

		// If the PC has told Gwylan about their relationship with Eden
		"edenStockholm",

		// If Gwylan has given Eden the bullet necklace
		"edenBulletNecklace",

		// If the PC noticed that Gwylan is pretending to be afraid of Eden
		"edenFearFake",

		// If Gwylan has excised a lesser elkspawn during the second ritual
		// Not used currently
		"ritualElkspawnExcised",

		// If the PC has talked to Gwylan about their fallen angel TF when talking about the succubus outfit
		"fallFromGrace",

		// If the PC fell from sex with Gwylan
		"fallenAngel",

		// If the PC fell from sex during the 1st ritual
		"fallenFault",

		// If Gwylan has given PC the familiar collar
		"familiarCollar",

		// If Whitney has visited the forest shop
		// Not used currently
		"whitneyVisitedShop",

		// If the PC has been directed to the forest shop by the bishop's hand for a chastity parasite
		"jordanChastityParasite",

		// If the PC has been directed to the forest shop by Jordan for an ear slime
		"jordanEarSlime",

		// If the PC told Gwylan about defending the farm from Remy
		"farmDefended",

		// If the PC held Gwylan's hand during the 1st ritual
		"beastRitualHandheld",

		// If the PC got a fox plushie from the promenade event
		"foxPlushie",

		// If the PC bought Gwylan a fox plushie during the promenade event
		"foxPlushieGwylan",

		// If the PC has seen the garden
		"gardenSeen",

		// If the PC has found the garden own their own
		"gardenFound",

		// If Gwylan has knotted the PC
		"gwylanKnottedPlayer",

		// If the PC has knotted Gwylan
		"playerKnottedGwylan",

		// If Gwylan has bitten the player for pulling their hair
		"hairPullBite",

		// If scene where Gwylan makes a new hat
		"newHat",

		// If the PC has noticed the ears on Gwylan's hat matches their hair
		"hatEarColour",

		// If the PC has found Gwylan's hat
		"hatFound",

		// If Gwylan has mentioned horse hooves are similar to human fingers
		// Used to prevent Gwylan talking about it again
		"horseFingers",

		// If the PC has unlocked sublime devotion
		"hypnosisDeepest",

		// If the PC has been hypnotised by Gwylan
		"hypnosisFirst",

		// If the PC has received hypnotic insight
		// Not used currently
		"hypnosisInsight",

		// The possible answers the PC can give during the hypnotic insight scene
		// None of these are used currently
		"hypnosisInsightHoles",
		"hypnosisInsightLots",
		"hypnosisInsightMonsters",
		"hypnosisInsightPlants",
		"hypnosisInsightSlimes",
		"hypnosisInsightTentacles",

		// If Gwylan has introduced their hypnosis to the PC
		"hypnosisIntro",

		// If the PC has received hypnotic peace
		"hypnosisPeace",

		// If Gwylan has removed hypnosis from PC
		"hypnosisRemoval",

		// The hypnosis traits that Gwylan has removed
		// Only suggestion is used currently
		"hypnosisRemovalCover",
		"hypnosisRemovalDeviancy",
		"hypnosisRemovalScream",
		"hypnosisRemovalSuggestion",

		// If the PC has received hypnotic silence
		"hypnosisSilence",

		// If the PC has received hypnotic insight
		"hypnosisSlumber",

		// If the PC has seen the hypnosis text while at sublime devotion
		"hypnosisSublime",

		// If the PC has seen the wolf rush out of the shop
		"intruder",

		// If the PC has seen the hypnosis text from kissing Gwylan
		"kissHypno",

		// If the PC has seen Gwylan getting knotted
		"knotted",

		// If the PC has told Gwylan about Kylar's school kidnapping
		"kylarSchoolKidnap",

		// If the PC has told Gwylan about Kylar's parents
		"kylarParents",

		// If the PC has told Gwylan that they like tentacles
		"likesTentacles",

		// If the PC has told Gwylan that they like wolves
		"likesWolves",

		// If Gwylan told the PC about Seabird's Lullaby
		"lullaby",

		// If the PC got the snowglobe for 'Mickey'
		"mickeySnowglobe",

		// If the PC sunk their fangs into Gwylan's neck
		"neckBite",

		// If the PC has licked nectar off of Gwylan
		"nectarLick",

		// If the PC knows Nobody is Gwylan
		"nobody",

		// If the PC has shown Gwylan the orphanage photo
		"orphanagePhoto",

		// If the PC has been saved by Gwylan after a temperature passout
		// Not used currently
		"temperaturePassout",

		// If the PC has gotten pissed at Gwylan after forced ritual
		"pcResentGwylan",

		// If the PC has seen Gwylan's petplay
		"petplay",

		// If the PC has gotten pink rose seeds from the flower crown scene
		"pinkRose",

		// If Gwylan has given PC the tip on collecting nectar
		"nectarTip",

		// If the PC tells Gwylan about the secret of the cream buns after they taste PC's fluids
		// TODO: implement "playerFluidsTaste"
		"playerFluidsRealisation",

		// If Gwylan has tasted PC's fluids
		// TODO: implement this memory
		"playerFluidsTaste",

		// If Gwylan has acknowledged PC's tf
		"playerTf",

		// If Gwylan has ask to preen PC's bird wings
		"preen",

		// If Gwylan has seen PC's promise ring
		// Not currently used
		"promised",

		// If Gwylan has requested PC bring them a gas mask
		"requestGasMask",

		// If Gwylan has requested PC bring them the gold accessories
		"requestGoldAccessories",

		// If Gwylan has introduced their requests
		"requestIntro",

		// If Gwylan has preened PC
		"requestPreen",

		// If the request tutorial has been completed
		"requestTutorial",

		// If the PC has requested to be bound during the 2nd ritual
		"requestedBondage",

		// If the PC has banished a tentacle during the 1st ritual
		"ritualBanish",

		// If the PC has done the 1st ritual
		"ritualBeast",

		// If Gwylan has drank the poison after the 1st ritual
		"ritualBeastCorruption",

		// If the PC has shared the poison with Gwylan
		"ritualBeastCorruptionShare",

		// If the PC has intimately shared the poison with Gwylan
		"ritualBeastCorruptionShareIntimate",

		// If Gwylan has eaten the poisoned leaves after the 1st ritual
		"ritualDryadCorruption",

		// If the PC has shared the poisoned leaves with Gwylan
		"ritualDryadCorruptionShare",

		// If Gwylan has introduced the 1st ritual
		"ritualSexIntro",

		// If the PC has stayed with Gwylan after the 1st ritual
		"ritualStay",

		// If Gwylan has talked to Robin at the cafe
		// Not used currently
		"robinCafe",

		// If Gwylan has talked to Robin at the cafe at high Robin trauma
		// Not used currently
		"robinCafeTrauma",

		// If Robin has visited the forest shop on halloween
		"robinHalloween",

		// If the PC has mentioned Robin's lemonade stand
		// Not used currently TODO: Gwybin
		"robinLemonade",

		// If Gwylan has tasted Robin's lemonade
		// Unimplemented TODO: Gwybin
		"robinLemonadeGet",

		// If Gwylan has kissed PC when giving them a rose during the 2nd ritual
		"roseKiss",

		// If the PC has completed a fluid sample request
		"sample",

		// If the PC has found the sex toy cabinet in the forest shop
		"sexToys",

		// If Gwylan has been tagged during the shop tag game
		// Unimplemented
		"shopHuntFallPoint",

		// If the PC has stolen from the shop twice
		"stealAgain",

		// If the PC has stolen from the shop
		"stealFirst",

		// If the shop has wrapped the PC in gift wraps
		"stealWrap",

		// If the PC has given Gwylan a strap on
		"strapOnGifted",

		// If Gwylan has talked to PC about their struggles
		"struggles",

		// If the PC has asked about the triquetra tattoo
		"tattoosIntro",

		// If the PC has told Gwylan about tenyclus
		"tenyclus",

		// If the PC has gotten the high trauma scene in the forest shop
		"trauma",

		// If the PC ate the fruit during the high trauma scene
		"traumaEat",

		// If the PC saw the end of the high trauma scene
		"traumaLove",

		// If Gwylan has bound PC for the 2nd ritual
		"vineBondage",

		// If Gwylan has seen PC's virginity
		"virgin",

		// If Gwylan has taken PC's penis virginity
		// Not used currently
		"virginityPenile",

		// If Gwylan has taken PC's vaginal virginity
		// Not used currently
		"virginityVaginal",

		// If the PC has succeeded in the beginning willpower check in the 2nd ritual
		"vision",

		// If Gwylan has asked for a fluid sample from the PC
		// Unimplemented
		"playerSampleRequest",

		// If Gwylan has gotten fluid samples from PC
		// Unimplemented
		"playerSample",

		// If Gwylan has introduced butterfly pea flower tea
		"butterflyPeaFlowerTea",

		// If Gwylan has removed a chastity parasite
		"chastityParasite",

		// If the PC told Gwylan that they're a part of the wolf pack
		"wolvesKnown",

		// If Gwylan brought up people extending their lives with poison after the 1st ritual
		"ritualPoisonTalk",

		// If Gwylan has brought up their sex toy collection
		"toyCollection",
	],
	Alex: [
		// If Alex asked the PC their favourite flower in the sunflowers on the meadow date
		// Used so the question only plays the first time
		"askedFavouriteFlower",
		// If Alex said "God, I love you so much." during oral
		// Not currently used
		"saidLoveDuringOral",
		// If Alex has seen the PC working on the farm naked
		// Used so Alex's flustered first reaction only plays once
		"sawPcWorkingNaked",
		// If the PC has been on the meadow date with Alex
		// Used so Alex skips the riding lesson and teases the PC about riding on later dates
		"wentOnMeadowDate",
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
		// If the PC emailed Bailey from Kylar's laptop during the abduction, and Bailey came to Kylar's manor with Jordan to rescue them
		// Used for Bailey's lines when the PC moans Kylar's name during an encounter
		"rescuedPcFromKylar",
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
	Briar: [
		// If Briar's thugs grabbed the PC for selling sex outside the brothel and drove them to Briar in a van
		// Used so the van only comes once
		"abductedPcFromPub",
		// If Briar had the PC pulled into a car and asked them to keep an eye on Darryl's strip club
		// Used so the car only comes once, and so Briar's goon waits outside the strip club for reports
		"askedPcToSpyOnDarryl",
	],
	Remy: [
		/* These are all the different ways to meet Remy.
		Apart from meeting Remy at riding school, most of these allow you to identify Remy's goons during bird hunt. */
		// If Remy rode into Alex's farm when the farm reached stage 5
		// Used for Remy's greeting at the riding school intro, for PC to think about exposing Remy's crimes
		"cameToAlexFarm",
		// If Remy was the guest at Avery's mansion party
		// Used to tell whether the PC has met Remy
		"guestAtAveryMansionParty",
		// If the PC was taken in and kept as livestock at Remy's Underground Farm
		// Used for the PC to remember when meeting Remy elsewhere
		"keptPcAtUndergroundFarm",
		// If the PC met Remy at the manor party after Avery won the card game
		// Used for Remy's greeting at the riding school intro, and to stop Bailey from taking a detour to the docks after winning the card game
		"metAfterAveryCardGame",
		// If the PC met Remy at the riding school
		// Used so the riding school intro only plays once, for Remy's greeting and invite at Alex's farm, Mickey's directions and the journal
		"metAtRidingSchool",

		// If the PC has seen Remy wearing the white mask after the skyscraper
		// Used so the mask scene only plays once, and so Remy clutches the mask on seeing the PC's familiar collar
		"pcSawMask",
		// If Remy saw the PC arrive at the Underground Farm in the familiar collar
		// Used so the PC can recognise Remy's voice after Avery's card game win
		"sawPcFamiliarCollar",
	],
	Sam: [
		// If the PC has met Sam feeding the ducks in the park
		// Used so the duck intro only plays once, and to show Sam at the park from then on
		"firstParkMeeting",

		// If Sam offered the PC a gift for the orphanage while chatting in the park
		// Used so the offer only comes up once, and to let the PC tell Sam about the loft
		"offeredPcOrphanageGift",

		// If the PC massaged Sam at the spa
		// Used so Sam can bring up PC being their "private masseuse" at the park
		// TODO: Needs a spa scene where the PC massages Sam
		"pcMassagedAtSpa",

		// If the PC told Sam they're in love with Gwylan
		"pcSaidInLoveWithGwylan",
		// If the PC told Sam that they and Robin are lovers
		// Used so Sam is glad the PC's feelings haven't changed when told again, and is left speechless if the PC later says they love Gwylan
		"pcSaidInLoveWithRobin",

		// If Sam saw the PC run past naked while streaking in the park
		// TODO: Not currently used but looks like it was planned. Sam leaves the park before PC can streak.
		"sawPcStreaking",
		// If Sam told the PC how the cafe started
		// Used so Sam only tells the story once
		"toldCafeOrigin",
	],
	Winter: [
		// If Winter asked the PC to look for more paintings after they brought in their first one
		// Used to show the paintings next to the antiques at the museum and in the journal
		"askedPcToFindPaintings",
		// If the PC has visited the museum and met Winter there
		// Used so the intro only plays once, to show the museum's collectibles in the journal, and for Gwylan to compare the PC to an exhibit in Winter's museum
		"firstMuseumVisit",

		// If the PC repeated the 'Breeding Ward' joke to Winter
		// Used so the PC can't keep repeating the joke
		"pcMadeBreedingWardJoke",
		// If the PC told Winter where the ornate gold necklace was found
		// Used so Winter asks if the PC remembers the old structures beneath the lake when they meet at the lake shore
		"pcToldWhereGoldNecklaceWasFound",
		// If the PC told Winter they found the purple diamond in the mines
		// Used so Winter doesn't ask if the PC has been going to the mines when they hand in the rusty pickaxe
		"pcToldWherePurpleDiamondWasFound",
	],
	"Ivory Wraith": [
		// If the PC has met the Ivory Wraith
		// Used to play its first meeting when it catches the PC during a blood moon, to unlock its events and appearances, and to show it in the Social menu and the NPC settings
		"firstEncounter",
		// If the PC has reached the underwater prison beneath the lake
		// Used to unlock the Ivory Wraith's blood moon mirror scenes and to change some prison and Schism vision text
		"foundUnderwaterPrison",
		// If the Ivory Wraith joined Remy's assault on the farm
		// Used to change later farm assaults, and so the PC can tell Gwylan about it
		"joinedFarmAssault",
		// If the PC watched the Schism vision to the end
		// Used to unlock apologising to the Ivory Wraith, its nightmare and its scene viewer entry, to lower its obsession (`C.npc["Ivory Wraith"].lust`), and to change its lines in encounters
		"pcFinishedSchismVision",
		// If the Ivory Wraith possessed the PC and walked them through the Elk compound
		// Not currently used
		"possessedPcAtCompound",
		// If the Ivory Wraith appeared over a living pale offspring and told the PC to keep it safe
		// Used so its first appearance over a living pale offspring always happens, and so the warning only plays once
		"toldPcToKeepOffspringSafe",
	],
	Doren: [
		// If Doren found the PC volunteering at the soup kitchen while dropping off food
		// Used so it only plays once
		"firstSoupKitchenMeeting",
		// If Doren was among the firefighters at Avery's burning skyscraper
		// Used so the PC recognises Doren's voice in the rescue
		"joinedSkyscraperRescue",
		// If the PC asked Doren to shower with them at Doren's flat
		// Used so Doren's horrified first refusal only plays once
		"pcAskedToShowerTogether",

		// If the PC told Doren in English class that they had been attacked
		// Used so Doren stops taking the PC outside to ask if they're alright
		"pcToldAboutAttacks",
		// If Doren took the PC to their flat after the police turned them away
		// Used to unlock Doren's flat, more Doren scenes, change Doren's lines, and generally make Doren more protective of the PC.
		"tookPcToFlat",
	],
	River: [
		// If the PC met River at the soup kitchen
		// Used so the soup kitchen intro only plays once, change the soup kitchen closed text, and so River can visit the PC in the school infirmary
		"firstSoupKitchenMeeting",
		// If River let the PC cook their own food in the soup kitchen
		// Used to replace asking River if they can cook at the soup kitchen with a "Cook your own food" link
		"letPcCookInSoupKitchen",
		// If River tugged the PC's animal ears in maths class
		// Used so River's later tugs ask if the PC is still wearing that "silly headband"
		"tuggedPcEars",
	],
	Mason: [
		// If the PC caught up with Mason swimming naked in the lake
		// Used so later swims skip the chase, and so Mason recognises the PC as the underwear thief in the locker scene
		"pcCaughtMasonSwimmingNaked",
		// If Mason told the PC about the pond by the waterfall where Mason relaxes in the evening
		// Used to add Mason's pond link to the waterfall and to hide "Ask to chat" when swimming out to Mason
		"toldPcAboutPond",
		// If the PC found Mason at the pond for the first time
		// Used so later visits skip the intro scene
		"firstPondVisit",

		// If Mason pulled the PC out from under the ice
		// Used so the PC can glimpse Mason under the water on snowy days, and so Mason pulls the PC out until convinced PC can dive under the ice
		"rescuedPcUnderIce",
		// If the PC convinced Mason they can dive under the ice safely
		// Used so Mason stops pulling the PC out from under the ice
		"letPcDiveUnderIce",
	],
	Landry: [
		// If Landry sold the PC their first pepper spray charge
		// Used so Landry only apologises for the cost the first time
		"firstPepperSpraySale",
		// If Landry met the PC at the pub and offered to buy their stolen goods
		// Used to skip Landry's intro, so Landry steps in when Avery grabs the PC outside the pub, so the PC can name Landry when questioned at the Elk Compound, and for various flavor text during Landry/Mickey's jobs
		"metPcAtPub",
		// If the PC asked Landry for help hiring workers for the loft bay window
		// Used to swap the ask option for handing Landry the money and progressing the loft
		"pcAskedForLoftWorkers",
	],
	Wren: [
		// If Wren carried the PC out of the beach cave while the PC was in labour
		// Used for various Wren lines
		"carriedLabouringPcOutOfBeachCave",
		// If Wren caught the PC going for the catsuit at the docks
		// Used for various Wren greetings and lines
		"caughtPcAtDocksCatsuit",
		// If the PC did the mansion heist with Wren
		// Used so the PC can tell Gwylan about the heist
		"didHeistWithPc",
		// If Wren met the PC at the estate cottage
		// Used so Wren greets the PC as someone they know at the lake and the docks, for the heist offer, and a Gwylan line at Avery's mansion
		"metPcAtEstate",
		// If Wren greeted the PC at the smuggler pub for the first time
		// Used so that meeting only plays once, and so Wren can be found at the bar on weekend evenings
		"metPcAtSmugglerPub",
		// If Wren met the PC in the prison yard
		// Used so the prison meeting only plays once, for Wren's boat and the labour scene on the prison beach, the journal's shark teeth reminder, various Wren lines, and the heist offer
		"metPcInPrison",
		// If the PC met Wren at Winter's lake tent
		// Used for various Wren lines and the PC being able to say Wren helped when showing Winter the Bleeding Ward painting
		"metPcWithWinter",

		// If the PC asked Wren for passage off the prison island
		// Used to show the names Wren still wants
		"pcAskedForPrisonPassage",
		// If the PC gave Wren all four prison names
		// Used so the PC can get passage from Wren's boat, for various Wren lines, and to unlock the heist offer
		"pcGavePrisonNames",

		// If the PC delivered Mickey's letter to Wren
		// Used for various Wren lines
		"pcDeliveredMickeysLetter",
		// If the PC saw Wren's car during the heist
		// Used so the car is only described once
		"pcSawCar",

		// If the PC stole Wren's signed cricket ball at the end of the heist
		// Used so the ball can only be taken once, for Gwylan's reaction to the heist story, and so Wren says the PC owes them
		"pcStoleCricketBall",
		// If Wren told the PC they owe Wren for the stolen cricket ball
		// Used so Wren only says it once
		"mentionedStolenCricketBall",

		// If the PC told Wren about the orphanage loft
		// Used to hide that option and to start the well scene in the orphanage garden
		"pcToldAboutLoft",
		// If the PC found the old well uncovered in the orphanage garden after telling Wren about the loft
		// Used for the well and sewer ladder routes, adds a random orphanage event where an orphan slips away, leaving a damp footprint, and to unlock asking Wren about the well
		"uncoveredOrphanageWell",
		// If the PC asked Wren about the well in the orphanage garden
		// Used to hide that option
		"pcAskedAboutWell",

		// If Wren grabbed the PC's wrist and pulled them back on the high moor
		// Used for Wren's lines the next time, and so the PC only asks what Wren was doing there once
		"pulledPcBackOnHighMoor",
		// If Wren saw the PC on the prison beach by the boat
		// Used so that scene only plays once, and so Wren calls how they get in and out "our" secret instead of "my"
		"sawPcOnPrisonBeach",
		// If Wren told the PC their favourite flower is tulips at the smuggler pub
		// Used so that chat only plays once
		"toldPcFavouriteFlower",
		// If Wren told the PC their name
		// Used for various Wren lines and introductions, for unlocking various Wren scenes, and the heist offer
		"toldPcName",
	],
	Harper: [
		// If Harper declared the PC's asylum treatment finished
		// Used so Harper's office also refills the asylum's prescription pills
		"finishedPcsAsylumTreatment",
		// If the PC had their first appointment in Harper's office
		// Used so the first appointment only plays once, and so PC recognizes Harper in future meetings
		"firstAppointment",
		// If Harper introduced the PC to the first therapy dog
		// Used so the dog's introduction only plays once, and so Harper has different lines during future dog sessions
		"firstTherapyDog",
		// If the PC met Harper as a doctor
		// Used so that introduction only plays once, for various Harper lines, and so Mickey won't warn about Harper
		"metAsDoctor",
		// If the PC met Harper at Avery's mansion party
		// Used for Harper's introductions when they meet again
		"metAtAverysParty",
		// If Harper introduced themselves to the PC at Remy's farm
		// Used for Harper's introductions when they meet again
		"metAtRemysFarm",
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
 * @param {string[]} memories
 * @returns {boolean}
 */
function hasAnyMemory(npcName, memories) {
	memories.forEach(memory => {
		if (!isMemoryValid(npcName, memory)) {
			throw new Error(`"${memory}" is not a valid ${npcName} memory.`);
		}
	});
	return V.npcMemories[npcName].includesAny(memories);
}

/**
 * @param {NpcNames} npcName
 * @param {string[]} memories
 * @returns {boolean}
 */
function hasAllMemories(npcName, memories) {
	memories.forEach(memory => {
		if (!isMemoryValid(npcName, memory)) {
			throw new Error(`"${memory}" is not a valid ${npcName} memory.`);
		}
	});
	return V.npcMemories[npcName].includesAll(memories);
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
		hasAny: (...memories) => hasAnyMemory("Robin", memories),
		hasAll: (...memories) => hasAllMemories("Robin", memories),
		delete: memory => deleteMemory("Robin", memory),
	},
	Kylar: {
		add: memory => addMemory("Kylar", memory),
		has: memory => hasMemory("Kylar", memory),
		delete: memory => deleteMemory("Kylar", memory),
	},
	BlackWolf: {
		add: memory => addMemory("Black Wolf", memory),
		has: memory => hasMemory("Black Wolf", memory),
		hasAny: (...memories) => hasAnyMemory("Black Wolf", memories),
		hasAll: (...memories) => hasAllMemories("Black Wolf", memories),
		delete: memory => deleteMemory("Black Wolf", memory),
	},
	Gwylan: {
		add: memory => addMemory("Gwylan", memory),
		has: memory => hasMemory("Gwylan", memory),
		hasAny: (...memories) => hasAnyMemory("Gwylan", memories),
		hasAll: (...memories) => hasAllMemories("Gwylan", memories),
		delete: memory => deleteMemory("Gwylan", memory),
	},
	Alex: {
		add: memory => addMemory("Alex", memory),
		has: memory => hasMemory("Alex", memory),
		hasAny: (...memories) => hasAnyMemory("Alex", memories),
		hasAll: (...memories) => hasAllMemories("Alex", memories),
		delete: memory => deleteMemory("Alex", memory),
	},
	Sirris: {
		add: memory => addMemory("Sirris", memory),
		has: memory => hasMemory("Sirris", memory),
		hasAny: (...memories) => hasAnyMemory("Sirris", memories),
		hasAll: (...memories) => hasAllMemories("Sirris", memories),
		delete: memory => deleteMemory("Sirris", memory),
	},
	Bailey: {
		add: memory => addMemory("Bailey", memory),
		has: memory => hasMemory("Bailey", memory),
		hasAny: (...memories) => hasAnyMemory("Bailey", memories),
		hasAll: (...memories) => hasAllMemories("Bailey", memories),
		delete: memory => deleteMemory("Bailey", memory),
	},
	Leighton: {
		add: memory => addMemory("Leighton", memory),
		has: memory => hasMemory("Leighton", memory),
		hasAny: (...memories) => hasAnyMemory("Leighton", memories),
		hasAll: (...memories) => hasAllMemories("Leighton", memories),
		delete: memory => deleteMemory("Leighton", memory),
	},
	Quinn: {
		add: memory => addMemory("Quinn", memory),
		has: memory => hasMemory("Quinn", memory),
		hasAny: (...memories) => hasAnyMemory("Quinn", memories),
		hasAll: (...memories) => hasAllMemories("Quinn", memories),
		delete: memory => deleteMemory("Quinn", memory),
	},
	Niki: {
		add: memory => addMemory("Niki", memory),
		has: memory => hasMemory("Niki", memory),
		hasAny: (...memories) => hasAnyMemory("Niki", memories),
		hasAll: (...memories) => hasAllMemories("Niki", memories),
		delete: memory => deleteMemory("Niki", memory),
	},
	NightMonster: {
		add: memory => addMemory("Night Monster", memory),
		has: memory => hasMemory("Night Monster", memory),
		hasAny: (...memories) => hasAnyMemory("Night Monster", memories),
		hasAll: (...memories) => hasAllMemories("Night Monster", memories),
		delete: memory => deleteMemory("Night Monster", memory),
	},
	Zephyr: {
		add: memory => addMemory("Zephyr", memory),
		has: memory => hasMemory("Zephyr", memory),
		hasAny: (...memories) => hasAnyMemory("Zephyr", memories),
		hasAll: (...memories) => hasAllMemories("Zephyr", memories),
		delete: memory => deleteMemory("Zephyr", memory),
	},
	Jordan: {
		add: memory => addMemory("Jordan", memory),
		has: memory => hasMemory("Jordan", memory),
		hasAny: (...memories) => hasAnyMemory("Jordan", memories),
		hasAll: (...memories) => hasAllMemories("Jordan", memories),
		delete: memory => deleteMemory("Jordan", memory),
	},
	Darryl: {
		add: memory => addMemory("Darryl", memory),
		has: memory => hasMemory("Darryl", memory),
		hasAny: (...memories) => hasAnyMemory("Darryl", memories),
		hasAll: (...memories) => hasAllMemories("Darryl", memories),
		delete: memory => deleteMemory("Darryl", memory),
	},
	Charlie: {
		add: memory => addMemory("Charlie", memory),
		has: memory => hasMemory("Charlie", memory),
		hasAny: (...memories) => hasAnyMemory("Charlie", memories),
		hasAll: (...memories) => hasAllMemories("Charlie", memories),
		delete: memory => deleteMemory("Charlie", memory),
	},
	Briar: {
		add: memory => addMemory("Briar", memory),
		has: memory => hasMemory("Briar", memory),
		hasAny: (...memories) => hasAnyMemory("Briar", memories),
		hasAll: (...memories) => hasAllMemories("Briar", memories),
		delete: memory => deleteMemory("Briar", memory),
	},
	Remy: {
		add: memory => addMemory("Remy", memory),
		has: memory => hasMemory("Remy", memory),
		hasAny: (...memories) => hasAnyMemory("Remy", memories),
		hasAll: (...memories) => hasAllMemories("Remy", memories),
		delete: memory => deleteMemory("Remy", memory),
	},
	Sam: {
		add: memory => addMemory("Sam", memory),
		has: memory => hasMemory("Sam", memory),
		hasAny: (...memories) => hasAnyMemory("Sam", memories),
		hasAll: (...memories) => hasAllMemories("Sam", memories),
		delete: memory => deleteMemory("Sam", memory),
	},
	Winter: {
		add: memory => addMemory("Winter", memory),
		has: memory => hasMemory("Winter", memory),
		hasAny: (...memories) => hasAnyMemory("Winter", memories),
		hasAll: (...memories) => hasAllMemories("Winter", memories),
		delete: memory => deleteMemory("Winter", memory),
	},
	IvoryWraith: {
		add: memory => addMemory("Ivory Wraith", memory),
		has: memory => hasMemory("Ivory Wraith", memory),
		hasAny: (...memories) => hasAnyMemory("Ivory Wraith", memories),
		hasAll: (...memories) => hasAllMemories("Ivory Wraith", memories),
		delete: memory => deleteMemory("Ivory Wraith", memory),
	},
	Doren: {
		add: memory => addMemory("Doren", memory),
		has: memory => hasMemory("Doren", memory),
		hasAny: (...memories) => hasAnyMemory("Doren", memories),
		hasAll: (...memories) => hasAllMemories("Doren", memories),
		delete: memory => deleteMemory("Doren", memory),
	},
	River: {
		add: memory => addMemory("River", memory),
		has: memory => hasMemory("River", memory),
		hasAny: (...memories) => hasAnyMemory("River", memories),
		hasAll: (...memories) => hasAllMemories("River", memories),
		delete: memory => deleteMemory("River", memory),
	},
	Mason: {
		add: memory => addMemory("Mason", memory),
		has: memory => hasMemory("Mason", memory),
		hasAny: (...memories) => hasAnyMemory("Mason", memories),
		hasAll: (...memories) => hasAllMemories("Mason", memories),
		delete: memory => deleteMemory("Mason", memory),
	},
	Landry: {
		add: memory => addMemory("Landry", memory),
		has: memory => hasMemory("Landry", memory),
		hasAny: (...memories) => hasAnyMemory("Landry", memories),
		hasAll: (...memories) => hasAllMemories("Landry", memories),
		delete: memory => deleteMemory("Landry", memory),
	},
	Wren: {
		add: memory => addMemory("Wren", memory),
		has: memory => hasMemory("Wren", memory),
		hasAny: (...memories) => hasAnyMemory("Wren", memories),
		hasAll: (...memories) => hasAllMemories("Wren", memories),
		delete: memory => deleteMemory("Wren", memory),
	},
	Harper: {
		add: memory => addMemory("Harper", memory),
		has: memory => hasMemory("Harper", memory),
		hasAny: (...memories) => hasAnyMemory("Harper", memories),
		hasAll: (...memories) => hasAllMemories("Harper", memories),
		delete: memory => deleteMemory("Harper", memory),
	},
};
window.Memories = Memories;
