declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/* === STATE === */

		/** Robin's general state, see RobinState for more info. */
		robin: RobinState;
	}
}

declare global {
	/**
	 * Robin's states and variables:
	 * - `hurt`: Robin being upset with the PC
	 * - `money`: Robin's savings and the balloon stand's effect on them
	 * - `rent`: Robin's rent to Bailey
	 * - `punishment`: where Bailey has sent Robin and what happened there
	 * - `room`: in Robin's room
	 * - `orphanage`: at the rest of the orphanage
	 * - `outings`: away from the orphanage and school
	 * - `school`: at school
	 * - `sex`: Robin's sex and encounters
	 * - `reunion`: after PC escapes from UB or asylum
	 * - `ub`: in the underground brothel
	 * - `christmas`, `halloween`: reset when the holiday ends
	 */
	export interface RobinState {
		/** Set to true once the PC and Robin are dating. */
		romance?: true;
		/** Puts Robin in a set location during the listed hours instead of where Robin is normally scheduled to be. Cleared at midnight. */
		locationOverride?: {
			location: "orphanage" | "school" | "sleep";
			during: number[];
		};
		/** Multiplies how much trauma Robin heals. Starts at 1 and drops by 0.1 with each punishment, down to 0.5 at the lowest. */
		traumaHealMultiplier: number;
		/** Robin being upset with the PC. */
		hurt: RobinHurt;
		/** Robin's savings and the balloon stand's effect on them. */
		money: RobinMoney;
		/** Robin's rent to Bailey, how many payments Robin has missed, and who's currently paying it. */
		rent: RobinRent;
		/** Where Bailey has sent Robin for missing rent and what happens there. */
		punishment: RobinPunishment;
		/** Robin's room. `visit` for variables that get unset by the end of the visit. */
		room: RobinRoom;
		/** Robin around the rest of the orphanage: the beds, the kitchen, the bath and the garden. */
		orphanage: RobinOrphanage;
		/** Robin with the PC away from the orphanage and school. */
		outings: RobinOutings;
		/** Robin at school. */
		school: RobinSchool;
		/** Robin's sex and encounters with the PC. */
		sex: RobinSex;
		/** Robin's reunion with the PC after an escape. */
		reunion: RobinReunion;
		/** Robin in the underground brothel. */
		ub: RobinUb;
		/** Robin at Christmas. `time.js` resets it to `{}` when Christmas ends. */
		christmas: RobinChristmas;
		/** Robin at Halloween. `time.js` resets it to `{}` when Halloween ends. */
		halloween: RobinHalloween;
		/** 1: Robin stayed up late tonight.
		 *
		 * 2: Robin is tired the next day. If set when the week rolls over, Robin earns 250 that week instead of 300. */
		stayedUp?: 0 | 1 | 2;
	}

	/** Robin being upset with the PC, stored in `$robin.hurt`. */
	export interface RobinHurt {
		/**
		 * Days Robin stays upset with the PC. While above 0, Robin is cold to the PC and many friendly events are skipped.
		 * "betrayed" at 2 or more and "conflicted" at 1.
		 * On Valentine's Day, Robin forgives it if it's 5 or less.
		 */
		daysLeft: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
		/** Why Robin is upset with the PC.
		 * Reset to "nothing" at midnight once `daysLeft` is 0. */
		reason:
			| "nothing"
			| "the balloon stand situation"
			| "the thing that happened in the infirmary"
			| "what you did while studying"
			| "you having Eden in your love locket"
			| "you kissing Gwylan"
			| "you kissing Kylar"
			| "you saying that you two aren't a couple";
	}

	/** Robin's savings and the balloon stand's effect on them, stored in `$robin.money`. */
	export interface RobinMoney {
		/**
		 * Robin's savings in pounds, earned from their stand sales, minus what Robin spends.
		 * Each week Bailey takes 400 unless the PC pays for Robin. If empty, Robin misses a payment. Then Robin earns 300, or 250 if tired, plus `balloonStandBonus`. Up to 4000.
		 */
		savings: number;
		/** Added to Robin's weekly earnings.
		 * +50 if the PC helped the balloon seller.
		 * -50 if the PC sabotaged them. */
		balloonStandBonus: -50 | 0 | 50;
		/**
		 * Days before Robin can mention the change in their customers after PC helps or sabotages Robin with the balloon seller.
		 * Set to 5 when the PC does either, and goes down 1 each night. At 0, Robin brings it up the next time the PC visits Robin's lemonade or hot chocolate stand.
		 */
		balloonStandDaysUntilTalk: 0 | 1 | 2 | 3 | 4 | 5;
	}

	/** Robin's rent to Bailey, stored in `$robin.rent`. */
	export interface RobinRent {
		/**
		 * If the PC pays Bailey for Robin.
		 * Used so Robin skips rent and the PC loses trauma each day as Robin's protector.
		 */
		pcPaysForRobin?: boolean;
		/** Total weeks the PC has paid Bailey for Robin. Only goes up in weeks the PC pays. Never resets. Robin's will offer to water the garden at 2. */
		weeksPcPaidForRobin?: number;
		/** Rent payments Robin has missed. +1 each time the PC demands Robin's money. At `missedPaymentLimit` (5), Robin is sent to the docks and it resets to 0. */
		missedPayments?: number;
		/** Missed payments before Robin is sent to the docks. Currently 5. At 4, Robin sells their console. */
		missedPaymentLimit?: 5;
		/** If Robin will come to the PC's room tonight and reveal their debt to Bailey. Set while the PC sleeps and cleared when the scene plays. */
		willRevealDebtToPcTonight?: boolean;
		/** If the PC thinks about talking to Bailey about paying for Robin. Set when Robin is punished for debt, and cleared on the next visit to Robin's room or when the PC starts paying. */
		pcThinksOfPayingBaileyForRobin?: boolean;
		/** If the current encounter is "Rent First Robin Fight," thugs hold the PC in place while Bailey threatens Robin. Stops the PC breaking free and adds unique encounter actions. Unset after the encounter. */
		inFightWithBaileyOverRobin?: true;
		/** If Bailey's rent collection is happening in Robin's room because the PC slept there. Changes Bailey's entrance and where the PC ends up after paying. */
		collectedInRobinsRoom?: true;
	}

	/** Where Bailey has sent Robin and what happened there, stored in `$robin.punishment`. */
	export interface RobinPunishment {
		/** Where Robin has been taken as punishment. 0 when Robin is home. */
		current: 0 | RobinPunishmentPlace;
		/** Days left of Robin's current punishment, 0 to 30. Robin comes home at 0, or sooner if the PC rescues Robin. */
		daysLeft?: number;
		/** Robin's most recent punishment.
		 * Used for what Robin says on the PC's first visit afterwards and as talk topics. */
		last?: RobinPunishmentPlace;
		/** Every place Bailey has sent Robin.
		 * Used for Robin's talk topics and encounter lines. */
		placesSentTo: RobinPunishmentPlace[];
		/** If the PC abandoned Robin at the docks. Robin's reaction plays at the orphanage, then it's unset. */
		abandonedByPcAtDocks?: true;
		/**
		 * If Robin was hurt at the docks and hasn't been to hospital.
		 * Used so Robin limps and gives the option to take Robin to the hospital. Unset at the hospital.
		 */
		injuredAtDocks?: true;
		/** If the current encounter is "Robin Mist Fight," with Robin under the landfill mist. Changes Robin's encounter speech and actions. */
		inLandfillMistFight?: true;
		/** If the PC knows Robin was taken to the landfill, from the note under their door. Unlocks a journal hint and the landfill search. Cleared each time Robin is sent there and when the PC rescues Robin. */
		pcKnowsRobinAtLandfill?: true;
		/** If Robin was sold with the PC to the Danube Homes dinner party. The meal ends with Robin's "dinner" punishment. Unset when the meal ends. */
		atDanubeMeal?: boolean;
		/**
		 * Robin's time in the pillory: how bad it's getting for Robin, and the PC's progress towards freeing them.
		 * Set up each time Robin is sent there, and removed when the PC frees Robin or at midnight after a failed rescue.
		 */
		pillory?: RobinPillory;
	}

	/** Robin's room, stored in `$robin.room`. */
	export interface RobinRoom {
		/** If Robin has the games console (true) or has lost it (false).
		 * Unset before the console intro. */
		hasConsole?: boolean;
		/** Times the PC has cried on Robin. Unlocks more reactions. */
		timesPcCried?: number;
		/** If Robin has refused to let the PC be naked in their room.
		 * Unset once Robin agrees. */
		refusedNakedPc?: true;
		/**
		 * If the PC just left Robin's room so they don't walk out and see Robin in another event. Cleared at the end of the Orphanage passage.
		 */
		pcJustLeft?: true;
		/** Where the PC was heading when they stopped at Robin's door and heard them crying ("Robin Trauma Visit"). If the PC closes the door, Leave goes here. */
		whereToGoAfterHearingRobinCrying?: "Bedroom" | "Orphanage" | "Domus Street";
		/** Saves the names of the fictional characters PC and Robin discuss while flirting.
		 * Robin can later bring them up during an encounter. */
		flirtCharacters?: {
			pc: "Lily" | "Rose" | "Basil" | "Petal";
			robin: "Sparrow" | "Jay" | "Heron" | "Penguin";
		};
		/** A visit to Robin's room. `<<endevent>>` resets it to `{}`. */
		visit: RobinRoomVisit;
	}

	/** A visit to Robin's room, stored in `$robin.room.visit`. `<<endevent>>` resets it. */
	export interface RobinRoomVisit {
		/** If the PC is hugging Robin. Hides Hug and changes the watching text. */
		pcHuggingRobin?: boolean;
		/** If Robin has already greeted PC in their room so it doesn't play again. Changes some text. */
		doneGreeting?: boolean;
		/** If the PC chose "Help Robin study" or "Agree" while already in Robin's room. Skips Robin's invite in. Unset when the study ends. */
		pcStartedStudy?: true;
	}

	/** Robin around the rest of the orphanage, stored in `$robin.orphanage`. */
	export interface RobinOrphanage {
		/** If Robin has already climbed into the PC's bed tonight. Reset at noon. */
		climbedIntoPcBed?: boolean;
		/** Which kitchen Robin's morning kitchen scene started in so that PC is returned there when the scene is over. Unset afterwards. */
		kitchenToReturnTo?: "Kitchen" | "Orphanage Loft Kitchen";
		/** If the PC knows Robin is in the bath,  either from seeing the note on Robin's door or from walking in on them.
		 * Adds "Robin is in the bath." to the bathroom link. Unset once Robin is out of the bath. */
		pcKnowsRobinInBath?: true;
		/** If Robin waters the PC's orphanage garden plots. Robin heads out at 4:30pm and waters at 5pm. The PC can ask Robin to start or stop. At trauma 50+, Robin does not water the garden. */
		watersGarden?: boolean;
		/** Whose bed Robin is sleeping in with the PC tonight: "yours" or "theirs". Cleared once Robin is awake. */
		whoseBedTonight?: "yours" | "theirs";
	}

	/** Robin with the PC away from the orphanage and school, stored in `$robin.outings`. */
	export interface RobinOutings {
		/** The amusements outing with Robin in progress. Unset when it ends. */
		amusements?: RobinAmusements;
		/** If a Love Interest Robin can turn up at the town brothel to try and take PC home. Checked when the PC starts dancing at high prostitution fame. Each dance turn can then roll Robin appearing. Unset when Robin appears. */
		canShowUpAtBrothel?: true;
		/** If Robin is at the forest shop with the PC right now.
		 * Keeps Gwylan in the shop and stops other shop events. */
		inForestShop?: true;
		/** If the PC is meeting Robin for the first time at Avery's skyscraper.
		 * Used for a line where the PC recognises Robin's voice. Unset after. */
		firstMeetingAtSkyscraper?: true;
		/** Times the PC has walked home topless with Robin, up to 5. Changes Robin's reaction. */
		timesPcWalkedHomeTopless?: 1 | 2 | 3 | 4 | 5;
	}

	/** Robin at school, stored in `$robin.school`. */
	export interface RobinSchool {
		/**
		 * Robin in History class.
		 *
		 * "active": in class.
		 *
		 * "missing": absent, or sent out by Winter.
		 *
		 * "seat": sitting next to the PC.
		 */
		historyClassStatus?: "active" | "missing" | "seat";
		/** Robin's goodbye line when the PC stays in the canteen.
		 *
		 * "leave"/"library": Robin heads to class.
		 *
		 * "whitney concern"/"whitney leave": after a scene with Whitney. */
		canteenGoodbye?: "library" | "leave" | "whitney concern" | "whitney leave";
		/** If Robin stopped the PC masturbating in History. Gives the PC the option to masturbate during Robin's next study session at promiscuity 4+, then it's set to false. */
		stoppedPcMasturbatingInHistory?: boolean;
		/** Progress of the school infirmary crossdressing scene. Unset when it ends. */
		infirmaryCrossdressingScene?: {
			/** Acts finished so far. */
			acts: 0 | 1 | 2;
			/** Who came in the last act. */
			whoOrgasmed?: "pc" | "robin";
		};
	}

	/** Robin's sex and encounters with the PC, stored in `$robin.sex`. */
	export interface RobinSex {
		/** Stat changes Robin's encounter lines have already given (dom, trauma heal, PC insecurity acceptance, etc.).
		 * Each stat should only be given once per encounter. Unset when the encounter (combat/sex) ends. */
		encounterLinesSaid?: (
			| "bigPenisAcceptance"
			| "bigPenisInsecurityFromFencing"
			| "domFromPcClumsyNippleSucking"
			| "domFromPcMoan"
			| "domFromPcSuckling"
			| "painFromTraumaIdleLine"
			| "smallBreastsAcceptance"
			| "smallPenisInsecurityFromFencing"
			| "traumaHealFromIdleLine"
			| "traumaHealFromPcMoan"
		)[];
		/** Set to 1 when Robin starts watching the PC masturbate, plus one per PC orgasm. Robin gains 3 lust per point, up to 15. Unset when the scene ends. */
		pcOrgasmsWhileWatched?: number;
		/** Times Robin has watched the PC masturbate.
		 * Not currently used. */
		timesWatchedPcMasturbate?: number;
	}

	/** Robin's reunion with the PC after an escape, stored in `$robin.reunion`. */
	export interface RobinReunion {
		/** Which reunion with Robin is waiting. Unset when it plays.
		 *
		 * "asylum": after escaping the asylum.
		 *
		 * "dungeon": after 4+ hours in the underground brothel.
		 *
		 * "dungeonRobin": Robin escaped the brothel without the PC. */
		whichToPlay?: "asylum" | "dungeon" | "dungeonRobin";
		/** If the PC came home from the underground brothel and hasn't told Robin about it yet. Set by the "dungeon" reunion. Unlocks "Tell Robin about your imprisonment", then clears it. */
		pcCanTellAboutUb?: true;
	}

	/** Robin in the underground brothel, stored in `$robin.ub`. Most are unset by the end of the scene they're used in. */
	export interface RobinUb {
		/** Tattoos put on Robin (just "164" in code right now).
		 * Not currently used. */
		tattoos: string[];
		/** If Robin was brought down with the PC but led away for the virginity show. Tells "Underground Intro2" to still put Robin in the cell next to the PC, then it's unset. */
		arrivedWithPc?: true;
		/** The beast type set on the PC and Robin in the UB hunt. Unset when the hunt ends. */
		huntBeast?: string;
		/** How many people approach Robin in the dice scene. Sets how much trauma Robin takes. Unset when the scene ends. */
		numberOfDiceApproachers?: 1 | 2 | 3 | 4 | 5 | 6;
		/** If the kissing encounter is happening right now. Used for Robin's kiss reactions. */
		inKissEncounter?: true;
		/** If Robin is being raped beside the PC right now. Unset when the scene ends. */
		beingRapedBesidePc?: boolean;
		/** Speed of Robin's machine in the machine scene. Goes up when the PC slows their own machine. */
		machineSpeed?: 1 | 2 | 3;
		/** If the metal cuffs and tentacles scene is happening right now. Changes Robin's encounter speech. */
		inMetalScene?: true;
	}

	/** Robin during Christmas, stored in `$robin.christmas`. `time.js` resets it to `{}` when Christmas ends. */
	export interface RobinChristmas {
		/** The Christmas present the PC bought for Robin. Ends in "_unwrapped" until the PC wraps it. */
		giftFromPc?:
			| "shirt_unwrapped"
			| "sundress_unwrapped"
			| "kimono_unwrapped"
			| "tuxedo_set_unwrapped"
			| "gothic_gown_unwrapped"
			| "christmas_unwrapped"
			| "shirt"
			| "sundress"
			| "kimono"
			| "tuxedo"
			| "gothic gown"
			| "christmas";
		/** If the PC has wrapped Robin's present. */
		pcWrappedGift?: true;
		/** If the PC gave Robin their present on Christmas. */
		pcGaveGift?: true;
		/** If the PC found Robin's cookies under the tree on Christmas day. */
		pcFoundCookies?: true;
		/** If Robin has visited the PC on Christmas morning. */
		visitedPcInMorning?: true;
		/** If Robin loved their present asks PC to unwrap them in their room. Unset when the PC goes in. */
		invitedPcToUnwrap?: true;
	}

	/** Robin during Halloween, stored in `$robin.halloween`. `time.js` resets it to `{}` when Halloween ends. */
	export interface RobinHalloween {
		/** If the PC has knocked on Robin's door this Halloween. Unlocks the hint to go trick-or-treating. */
		firstRoomVisit?: true;
		/** Robin's Halloween costume. "ghost" by default, or what the PC bought for them at Gwylan's shop. */
		costumeWorn?: "ghost" | "witch" | "vampire";
		/** The costume the PC is holding up for Robin at Gwylan's shop. Unset when they leave the shop. */
		costumeBeingTriedOn?: {
			name?: "witch" | "vampire";
			/** Who the costume is made for. */
			gender?: "f" | "m";
			/** If the costume is for the opposite gender to Robin's, which changes Robin's lines. */
			crossdressing?: boolean;
			/** If the PC bought it. */
			bought?: true;
		};
		/** If the wraith hallucination easter egg (over Robin under a sheet) has played this Halloween. */
		scarePlayed?: true;
	}

	/** Places Robin can be sent by Bailey. */
	export type RobinPunishmentPlace = "docks" | "landfill" | "dinner" | "pillory" | "mansion" | "underground";

	/**
	 * Robin's time in the pillory, stored in `$robin.punishment.pillory`.
	 * - `danger`, `naked`: how bad it's getting for Robin
	 * - `locks`, `distractions`, `distracted`, `lockpicked`: the PC's progress freeing Robin
	 * - `known`, `active`: whether the PC knows, and whether Robin is on Cliff Street today
	 */
	export interface RobinPillory {
		/** Locks left to pick before Robin is free. Starts at 3. */
		locks?: 0 | 1 | 2 | 3;
		/** Rises each hour Robin is in the pillory from 3pm to 10pm, faster at dusk and night. Robin's hourly trauma and state get worse past 3, 7 and 11, with one extra step at 5 in the rescue scene. */
		danger?: number;
		/** Distractions the PC has already used on the crowd. Each works once. */
		distractions?: ("crime" | "flower" | "fruit" | "money" | "speech")[];
		/** If the PC knows Robin is in the pillory. Unlocks the journal hint and changes the Cliff Street text. */
		known?: boolean;
		/** If Robin is out in the pillory from 3pm. Set at midnight, but not while the PC has been sold by Bailey. */
		active?: true;
		/** If the crowd is distracted right now. Makes the next lock easier to pick. */
		distracted?: boolean;
		/** If the PC has tried a lock this hour. Shows the "too dangerous" text, and resets each hour. */
		lockpicked?: boolean;
		/** If Robin was stripped in the pillory. Changes the scenes after the rescue. */
		naked?: boolean;
		/** If the rescue failed. Midnight removes the whole pillory object. */
		rescueFailed?: true;
		/**
		 * Scene Viewer only. In a normal game the pillory gets worse by the hour, so the scene viewer simulates it. This stores the hour it just simulated. 0 to 23.
		 */
		sceneViewerLastHour?: number;
	}

	/** The amusements outing with Robin, stored in `$robin.outings.amusements` while it's in progress. */
	export interface RobinAmusements {
		/** Games not played yet. */
		games: ("claw" | "coin" | "shooting" | "ring" | "slot" | "dance")[];
		/** Prize tickets won so far. Prizes cost 50, 100, 150, 200 or 300. */
		tickets: number;
		/** The game Robin picked at random from `games`. */
		choice?: RobinAmusements["games"][number];
		/** Slot machine symbols left to draw. */
		slots?: ("starfish" | "sea shell" | "seagull" | "mermaid" | "ship" | "fish" | "squid" | "crab" | "wave")[];
		/** If Robin won £200 on the slots. Robin then offers to take the PC to a cafe. */
		slotWin?: true;
		/** If the PC suggested giving the claw machine toy to an orphan. Adds the detour home to deliver it. */
		toy?: true;
	}

	/** Robin's once-a-day flags, stored in `$daily.robin`. Every flag is unset at midnight. */
	export interface RobinDaily {
		/** If Robin has asked about the PC passing out today. */
		askedAboutPcPassout?: true;
		/** If a traumatized Robin has asked the PC to walk to school with them or stay the night today. */
		askedPcForCompany?: true;
		/**
		 * If Robin asked the PC to leave today after getting upset.
		 * Not currently used.
		 */
		askedPcToLeave?: true;
		/** If Robin has bumped into the PC in the school hallway today. */
		bumpedIntoPcAtSchool?: true;
		/** If Robin's morning kitchen event can still play today. Rolled 1 in 8 each day, and unset when it plays. */
		canHaveKitchenEvent?: true;
		/** If Robin's crossdressing story moved forward today. The next step waits until tomorrow. */
		crossdressingStoryAdvanced?: true;
		/** If the forest walk with Robin is used up for today (by walking to the forest, the cinema, or the forest double vore ending). */
		forestWalkUsed?: true;
		/** If Robin found the PC passed out in the park or at the beach today. */
		foundPcPassedOut?: true;
		/** If Robin has already gained lust today from seeing the PC naked or in underwear in Robin's room. */
		gainedLustFromPcNaked?: true;
		/** If Robin has given the PC a free drink at the lemonade or hot chocolate stand today. While the PC pays for Robin, Robin refuses the PC's money once a day. */
		gavePcFreeDrink?: true;
		/** Inaccessible/Not currently used.
		 * If Robin has had food or a drink at the cafe with Gwylan today. */
		hadCafeFood?: true;
		/**
		 * Robin's homework at 5pm in term time.
		 *
		 * "toldPc": the PC knocked and Robin said they're doing homework, so Robin doesn't repeat it.
		 *
		 * "stoppedForPc": Robin put the homework aside to keep the PC company, so the homework scene is done for today.
		 */
		homework?: "toldPc" | "stoppedForPc";
		/** If Robin stormed off to History class after seeing the PC kiss Kylar.
		 * Cleared when the PC finds Robin crying there. */
		hurtByPcKissingKylar?: boolean;
		/** Inaccessible/Not currently used.
		 * If Robin came to the Ocean Breeze cafe with the PC and Gwylan today. Unset if Robin leaves after the PC kisses Gwylan. */
		inCafe?: true;
		/** If Robin has joined the PC in the garden today. Robin won't offer again that day or come to free the PC from stems encounter. */
		joinedPcGardening?: true;
		/** If the PC has found Robin's door left open at night today, with Robin masturbating inside. Once a day, whether or not the PC peeks. */
		leftDoorOpenMasturbating?: true;
		/** If the PC and Robin have met in the bath today, either way round. Ends Robin's bath early. */
		metPcInBath?: true;
		/** If Robin has noticed the PC's love locket today. */
		noticedPcLoveLocket?: true;
		/** If the PC has asked Bailey about taking on Robin's debt today. Changes Bailey's greeting and reply if the PC comes back. */
		pcAskedBaileyAboutDebt?: true;
		/** If a traumatized PC has blamed Robin today in their room. */
		pcBlamedRobin?: true;
		/** If the PC has chatted with Robin when sitting beside them in History today. */
		pcChattedInHistory?: true;
		/** If the PC has complained to Robin today. Hides both Complain options. */
		pcComplained?: true;
		/** If the PC has cried or broken down in Robin's arms today. Hides options to do it again. */
		pcCried?: true;
		/** If the PC offered the police their body to cover Robin's missing stand permit today. Changes what the PC says when blaming or persecuting Robin later that day. */
		pcOfferedPoliceBody?: true;
		/** If the PC paid the police for Robin's missing stand permit today. Changes what the PC says when blaming Robin later that day. */
		pcPaidPolice?: true;
		/** If a traumatized PC has persecuted Robin today in their room. */
		pcPersecutedRobin?: true;
		/** If the PC has called Robin by a pet name today. While dating with dom under 40, Robin is only flustered by it the first time each day. */
		pcUsedPetName?: true;
		/** If the police have checked Robin's lemonade stand permit today while PC is there. */
		policeCheckedPermit?: true;
		/** If snowballs were thrown at Robin's hot chocolate stand today while the PC is there. */
		snowballsThrownAtStand?: true;
		/** If Robin has cried at the mysterious orphanage photo or told the PC their dream about it today. */
		talkedAboutOrphanagePhoto?: true;
		/** Times the PC has asked Robin to start or stop watering today. The option to ask hides at 2. */
		timesPcAskedAboutWatering?: 0 | 1 | 2;
		/** If Robin has walked in on the PC masturbating at home today. Robin stays to watch if dating with high love and lust. */
		walkedInOnPcMasturbating?: true;
		/** If Robin is walking to History with the PC. Cleared when they arrive. */
		walkingToHistoryClass?: boolean;
		/** If the PC has taken Robin to the cinema or other amusements today. */
		wentOnOuting?: true;
		/** Who watered the orphanage garden today, shown in the garden's status. "alone": Robin did it for the PC. "together": the PC helped Robin. */
		whoWateredGarden?: "alone" | "together";
	}

	/** Robin's once-a-week flags, stored in `$weekly.robin`. Every flag is unset when the week ends. */
	export interface RobinWeekly {
		/** If Robin has turned up at the brothel to get the PC to come home this week. */
		cameToBrothel?: true;
		/** If Robin has handed the PC their savings this week. Only while the PC pays for Robin. */
		gavePcSavings?: true;
		/** If Robin has given the PC a thermos this week, on a weekend morning as the PC leaves the orphanage. Only while the PC pays for Robin. */
		gavePcThermos?: true;
		/** If Robin's visit during the PC's cafe shift has had its chance this week. Set when the visit joins the shift's event list, even if another event is picked. */
		hadCafeVisitChance?: true;
		/** If the PC has seen Robin with the bird in the orphanage garden this week. */
		pcSawRobinWithBird?: true;
		/** If Robin has said a line about a past punishment in an encounter this week. These lines heal some of Robin's trauma. */
		punishmentTalkHealed?: true;
	}
}

export {};
