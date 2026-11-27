declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** Alex's farm, see AlexFarmState. */
		alexFarm: AlexFarmState;
	}
}

declare global {
	/** An upgrade the PC can order at Alex's desk.
	 * "irrigation" can be ordered once per field. */
	export type AlexFarmBuild =
		| "wall 1"
		| "wall 2"
		| "wall 3"
		| "wall 4"
		| "tower 1"
		| "tower 2"
		| "woodland 1"
		| "woodland 2"
		| "woodland 3"
		| "kennel 1"
		| "barn 1"
		| "barn 2"
		| "stable 1"
		| "coop 1"
		| "coop 2"
		| "parasites 1"
		| "parasites 2"
		| "irrigation"
		| "nursery";

	/** What Alex is doing during the work day.
	 * "panic" is Alex calming all the animals. */
	export type AlexFarmTask =
		| "admin"
		| "border"
		| "cattle_in"
		| "cattle_milked"
		| "cattle_out"
		| "cattle_panic"
		| "chicken_eggs"
		| "chickens_fed"
		| "chickens_in"
		| "chickens_out"
		| "chickens_panic"
		| "clearing"
		| "dogs_fed"
		| "dogs_panic"
		| "fence_damage"
		| "hay"
		| "horses_brushed"
		| "horses_in"
		| "horses_out"
		| "horses_panic"
		| "panic"
		| "pigs_fed"
		| "pigs_in"
		| "pigs_out"
		| "pigs_panic"
		| "relax"
		| "shower"
		| "still"
		| "tending"
		| "woodland"
		| "yard"
		| "pubSulk";

	/** Alex's farm. Hourly wage up to `stage` 6, then PC co-owns the farm with Alex from `stage` 7 on. */
	export interface AlexFarmState {
		/**
		 * The farm's story progress.
		 * - 0: The PC hasn't asked about farm work.
		 * - 1: Alex met, farm work explained. The PC hasn't accepted yet.
		 * - 2: Farm work accepted. 1 field cleared.
		 * - 3: Remy sends a visitor once the PC had worked 6 hours or half the field was cleared.
		 * - 4: 2 fields cleared. Alex offered booze.
		 * - 5: 3 fields cleared. Remy threatened Alex, and Alex sent them away.
		 * - 6: 4 fields cleared. Alex's parent visited.
		 *
		 * - 7: 3 days after the parent's visit or after half the next field is cleared, Remy's thugs will burn Alex's fields with Bailey's help and lock the PC in for the shed fight.
		 *
		 *   PC can now live and sleep at the cottage. Alex offers the PC half the farm. The PC is no longer paid by hourly wages but through `yieldOwedToPc`, and can now tend fields (4 to start), saddle steeds, and order upgrades.
		 *
		 *   Alex can confess to the PC after 3 days, at 50+ love.
		 *
		 * - 8: 5 fields cleared. More upgrades can be ordered.
		 * - 9: 6 fields cleared. The lurker lab opens.
		 * - 10: 7 fields cleared. The PC can catch lurkers with "Hurl net" for the lab.
		 * - 11: 8 fields cleared. Strange flowers can be grown.
		 * - 12: All 9 fields cleared. Remy threatens Alex again.
		 */
		stage: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
		/** How much of the current field is left to clear, from 100.
		 *
		 * The next `stage` plays at 0 or lower, or at <=50 during `stage` 2 and 6. */
		clearingLeft: number;
		/**
		 * Remy's encroachment on the farm, 0 to 100. Set to 0 at `stage` 5. Rises 5 (or 10 at stage 7) each day. More if the PC refused to pay Bailey at the farm.
		 * The wall upgrade, watchtower, guard, and the kennel slows the rise. Sabotaging Remy lowers it.
		 * Trigger various farm events and dialogue options as it rises.
		 */
		remyEncroachment: number;
		/** Pounds paid per hour of farm work.
		 * 15 at the start.
		 * 30 at stage 4.
		 * 45 at stage 5.
		 * 60  at stage 6.
		 * Hourly wages stop after stage 6. */
		hourlyWage: 15 | 30 | 45 | 60;
		/**
		 * Bonus pay Alex owes the PC for good farm work.
		 * Midnight adds that day's `$daily.alexFarm.yieldToday`.
		 * When negative, Alex doesn't pay it.
		 * At 1+, Alex pays up and it's unset:
		 *
		 * £9 per point at `C.npc.Alex.dom` 30+.
		 *
		 * £24 per point at `C.npc.Alex.dom` -30.
		 *
		 * £18 otherwise.
		 */
		yieldOwedToPc?: number;
		/** If the PC is working naked.
		 * Before `stage` 7, unset at midnight.
		 * After `stage` 7, unset when the PC enters the cottage or leaves the farm. */
		pcWorkingNaked?: true;
		/** Dog treats kept at the farm for the kennel. */
		dogTreats: number;
		/** Total minutes the PC has worked at the farm.
		 * 360 starts `stage` 3. */
		totalMinutesWorked: number;
		/** Cows the PC has milked in total. */
		totalCattleMilked: number;
		/** Days until the `stage` 7 fire.
		 * Set to 3 at `stage` 6, and unset when the fire starts. */
		daysUntilFire?: 0 | 1 | 2 | 3;
		/** Days until Bailey can come to the cottage about overdue rent. Set to 7 at `stage` 7, and unset when Bailey knocks. Once unset, Bailey comes whenever rent is overdue. */
		daysUntilBaileyVisits?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
		/** If the PC has been to the kennel, so its intro only plays once. */
		pcSawKennelIntro?: true;
		/** How much each kind of animal respects the PC, -30 to 30. Events and text change at -20, -5, 5 and 20. */
		animalRespect: {
			cattle: number;
			dogs: number;
			horses: number;
			pigs: number;
		};
		upgrades: AlexFarmUpgrades;
		stock: AlexFarmStock;
		towerGuard: AlexFarmTowerGuard;
		milking: AlexFarmMilking;
		lab: AlexFarmLab;
		assault: AlexFarmAssault;
		/** Unset outside of a work day. */
		workday?: AlexFarmWorkday;
		shedFight: AlexFarmShedFight;
		woodlandForage: AlexFarmWoodlandForage;
	}

	/** The farm's upgrades. Ordered by PC at Alex's desk after `stage` 7. Each level is set at midnight when it finishes building. */
	export interface AlexFarmUpgrades {
		/** The wall around the farm. Higher levels slow attacking teams and cut fence damage. */
		wall: 0 | 1 | 2 | 3 | 4;
		/** The watchtower.
		 * - 1 lets the PC hire a guard at the pub.
		 * - 2 adds searchlights. */
		tower: 0 | 1 | 2;
		/** The woodland.
		 * - 1 makes truffles.
		 * - 2 lets the PC forage once a day.
		 * - 3 makes more truffles and allows two forages. */
		woodland: 0 | 1 | 2 | 3;
		/** 1 once the kennel is built and the PC can train the dogs. */
		kennel: 0 | 1;
		/** The cattle barn. Each level makes more milk and cream. */
		barn: 0 | 1 | 2;
		/** 1 once the stable is built.
		 * Steed rides between town and the farm take 15 minutes instead of 30. */
		stable: 0 | 1;
		/** The chicken coop. Each level makes more eggs. */
		coop: 0 | 1 | 2;
		/** The barn for parasites the PC has birthed.
		 * 1 lets the PC keep them at the farm.
		 * 2 holds more and stores food. */
		parasiteBarn: 0 | 1 | 2;
		/** How many fields are watered each day.
		 * Unset until the first irrigation is built. */
		irrigatedFields?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
		/** The upgrade being built.
		 * Unset at midnight when it finishes. */
		buildInProgress?: AlexFarmBuild;
		/** Days until `buildInProgress` finishes at midnight.
		 * Helping the builders takes days off. */
		daysUntilBuilt?: number;
		/** Finished upgrades whose scene hasn't played yet. */
		finishedUnseen: AlexFarmBuild[];
	}

	/** Food the farm makes for the PC to take from the cottage after stage 7. Loses 10% each day. */
	export interface AlexFarmStock {
		/** From the woodland upgrade. */
		truffles: number;
		/** From the barn upgrade. */
		milk: number;
		/** From the coop upgrade. */
		eggs: number;
		/** From the barn upgrade. */
		cream: number;
	}

	/** The guard the PC hired at the pub to staff the watchtower. The guard NPC is `$per_npc.farm_tower_guard`.
	 * Emptied when they quit or Alex fires them. */
	export interface AlexFarmTowerGuard {
		/** Set when the PC hires them. */
		name?: string;
		/** A copy of the guard NPC's `skills.security`, 0 to 1000.
		 * Goes up 20 for each week paid. */
		skill?: number;
		/** In pence: £300 plus £1 per point of `skill`.
		 * Also set for guards the PC interviews but doesn't hire. */
		weeklyWage?: number;
		/** Weeks not paid for.
		 * 1 when hired. 0 when paid.
		 * At 2+ the guard asks for their pay. */
		weeksUnpaid?: number;
	}

	/** The PC milking themself in the barn at night, and Alex catching them. */
	export interface AlexFarmMilking {
		/** The chance that Alex catches the PC, 0 to 100.
		 * Goes up with each milking and down each day. */
		catchChance: number;
		/** If Alex will catch the PC the next time they milk themself at night. */
		alexWillCatchPc: boolean;
		/** If Alex has caught the PC. */
		alexCaughtPcAtNight: boolean;
		/** If Alex lets the PC milk themself during work hours.
		 * Set when Alex catches them. */
		alexAllowsDayMilking: boolean;
	}

	/** The lurker lab acquired at `stage` 9. */
	export interface AlexFarmLab {
		/** Lurkers waiting in the cages. */
		lurkersCaged: number;
		/** Phials waiting for the PC to take. */
		phialsStored: number;
		/** Days until the next phial. Only counts down while a lurker is caged.
		 * Unset until the first lurker is caged. */
		daysUntilNextPhial?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
		/** If a monk PC has felt the dread at the phials, so it only plays once. */
		monkPcDreadedPhials?: true;
		/** Days until the next accident.
		 * Unset until the stage 9 (lab unlock) is obtained. */
		daysUntilNextAccident: number;
	}

	/** Remy's attacks on the farm, after `stage` 7. */
	export interface AlexFarmAssault {
		/** Days until the next attack:
		 *
		 * 30 for the first.
		 *
		 * 17 to 24 after each assault. */
		daysUntilNext?: number;
		/** If an attack happened without the PC so they see the damage when they return. */
		happenedWhilePcAway?: true;
		/** Fields burnt. 0 is the first field. */
		burntFields: number[];
		/** If an attack ran out of planted fields to burn. Picks the attack's ending and Alex's line after it.
		 * Set by an attack while the PC was away, or at the end of one the PC was in. */
		noFieldsLeftToBurn?: true;
		/** If the PC still has to see the fields the `stage` 7 assault burned. */
		fireDamageToShow?: true;
		/** Unset when the PC isn't in an attack. */
		fight?: AlexFarmAssaultFight;
	}

	/** An attack the PC is taking part in. */
	export interface AlexFarmAssaultFight {
		/**
		 * What Alex is doing.
		 * - `"patrol"`: looking for a team.
		 * - `"fighting"`: fighting the team at `alexTeamIndex`.
		 * - `"bound"`: tied up by Bailey's thugs.
		 */
		alexState?: "patrol" | "fighting" | "bound";
		/** Where the team Alex is fighting is in `teams`. Unset unless `alexState` is `"fighting"`. */
		alexTeamIndex?: 0 | 1 | 2 | 3 | 4 | 5;
		/** Turns until Alex gets free after being tied up. */
		alexBindings?: 0 | 1 | 2 | 3;
		/** Struggles until the PC is free after being tied up. */
		pcBindings?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
		/** How many more teams the dogs can take on.
		 * Goes up to 2 with the kennel upgrade. */
		dogTeamsLeft?: 0 | 1 | 2;
		/**
		 * The dogs.
		 * - `"guarding"`: waiting for the next team.
		 * - `"fighting"`: on a team.
		 * - `"defeated"`: out of the attack.
		 */
		dogsState?: "defeated" | "fighting" | "guarding";
		/** Planted fields no team has picked yet. */
		freeFieldsForTeams?: number[];
		/** How the PC moved, for the opening line of the next turn. */
		movement?: "climb" | "field" | "none" | "struggle" | "tower" | "wait";
		/**
		 * The attacking teams. How many of Remy's depends on `stage`.
		 * - 7: 2 teams.
		 * - 8 and 9: 3 teams.
		 * - 10 and 11: 4 teams.
		 * - 12: 5 teams.
		 *
		 * Bailey's thugs are added to the list if the PC refused Bailey at the farm.
		 */
		teams?: AlexFarmAssaultTeam[];
		/**
		 * The watchtower.
		 * - `"empty"`: no guard hired.
		 * - `"manned"`: the guard is on watch.
		 * - `"attacked"`: a team is going for it.
		 * - `"defeated"`: the guard is out for the rest of the attack.
		 */
		towerState?: "attacked" | "defeated" | "empty" | "manned";
		/** Where the Ivory Wraith's team is in `teams`. Unset if the Ivory Wraith didn't join. */
		wraithTeamIndex?: 0 | 1 | 2 | 3 | 4;
		/** If the PC has already lost stress this attack from watching the Ivory Wraith leave. */
		pcLostStressToWraith?: true;
	}

	/** One team of attackers. */
	export interface AlexFarmAssaultTeam {
		/**
		 * Who the team is.
		 * - `"remy"`: Remy's thugs.
		 * - `"bailey"`: Bailey's thugs, an extra team when the PC refused Bailey at the farm. Harder to beat.
		 * - `"wraith"`: the Ivory Wraith, which can take the place of one of Remy's teams.
		 */
		type: "remy" | "bailey" | "wraith";
		/**
		 * Where the team is.
		 * - 0 to 8: the field it comes in through, and burns if something is planted there.
		 * - `"tower"`: attacking the watchtower.
		 * - `"done"`: beaten, fled or finished. The attack ends when every team is "done".
		 */
		location?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "tower" | "done";
		/**
		 * What the team is doing. Unset until its first turn.
		 * - `"wall"`: getting through the wall.
		 * - `"entry"`: just got in.
		 * - `"dogs"`, `"dogs_recover"`: caught by the dogs. Bailey's thugs regroup. Remy's team flee.
		 * - `"approach"`, `"climb"`, `"fight"`: attacking the watchtower.
		 * - `"field"`: setting its field on fire.
		 * - `"celebrate"`: its field just burnt.
		 */
		state?: "approach" | "wall" | "climb" | "entry" | "field" | "fight" | "dogs" | "dogs_recover" | "celebrate";
		/** Thugs left in the team: 3 at the start, 1 for the Ivory Wraith. The team flees at 0. */
		thugsLeft: number;
		/** How far the team has got through the wall. It gets in once this reaches `upgrades.wall`. */
		wallProgress: 0 | 1 | 2 | 3 | 4;
		/** How far the team has got setting its field on fire. The field burns the turn after this reaches 4. */
		fieldProgress: 0 | 1 | 2 | 3 | 4 | 5;
		/** Only for the Ivory Wraith. Fields it has burnt this attack. It leaves once this reaches `Math.floor(C.npc["Ivory Wraith"].lust / 4)`. */
		fieldsTorched?: number;
	}

	/**
	 * The day's farm work. Created on the first farm visit of the day, at any hour, and deleted at midnight.
	 * Alex does one task per work slot, from slot 1 at 6:00 to 46 at 21:00. Three slots pass for every `Time.hour`.
	 */
	export interface AlexFarmWorkday {
		/** What Alex is doing now. Unset until Alex's first task. */
		alexTask?: AlexFarmTask;
		/** Breaks Alex has taken under the tree today, up to 3. */
		alexRests: 0 | 1 | 2 | 3;
		/** The work slot Alex's tasks are done up to, 0 to 46. */
		lastUpdateSlot: number;
		/** Minutes the PC has worked today.
		 * 660+  unlocks the "Dawn to Dusk" feat. */
		minutesWorked: number;
		/** The day's random event plays once `minutesWorked` reaches this, 60 to 300. */
		eventAfterMinutes: number;
		/** If Alex has had their morning shower. */
		alexShowered: boolean;
		/** If someone has checked the border today. */
		borderChecked: boolean;
		/** If the yard has been cleared today. */
		yardCleared: boolean;
		/** Times Alex has gone into the old stone building today, up to 3. It becomes the lab (`AlexFarmLab`) at `stage` 9. */
		stillVisits: 0 | 1 | 2 | 3;
		/** Times Alex has been on the phone today. Up to 6, with no cap at `stage` 12. */
		adminCalls: number;
		/** Seasonal hay jobs Alex has done today, up to 6. */
		hayJobs: 0 | 1 | 2 | 3 | 4 | 5 | 6;
		/** Times the crops have been tended today by Alex or the PC. Done at 6, 10, 14 or 18 by `stage`. Not used from `stage` 7. */
		cropsTended: number;
		/** Times the woodland has been tended today, up to `upgrades.woodland`.
		 * Unset without a woodland upgrade. */
		woodlandTended?: 0 | 1 | 2 | 3;
		/** Times the PC has foraged today.
		 * Unset without a woodland upgrade. */
		timesForaged?: 0 | 1 | 2;
		/** If the chickens have been fed today. */
		chickensFed: boolean;
		/** 0 in, 1 out, 2 brought back in. */
		chickensOut: 0 | 1 | 2;
		/** Times the pigs have been fed today. Full at 6. */
		pigsFed: number;
		/** 0 in, 1 out, 2 brought back in. */
		pigsOut: 0 | 1 | 2;
		/** Horses brushed today. Done at 6. */
		horsesBrushed: number;
		/** 0 in, 1 out, 2 brought back in. */
		horsesOut: 0 | 1 | 2;
		/** Times the PC has sexually relieved the horses today.
		 * The options go away at 6. */
		horsesSatisfied: number;
		/** 0 in, 1 out, 2 brought back in. */
		cattleOut: 0 | 1 | 2;
		/** Cows milked today, by Alex or the PC. */
		cattleMilked: number;
		/** Cows still waiting to be milked. */
		cattleNeed: number;
		/** Meals the dogs have had today, up to 2. */
		dogsFed: 0 | 1 | 2;
		/** If Alex has gathered the eggs today. */
		eggsCollected?: true;
		/** How damaged the perimeter is, 0 to 100. Alex or the PC repairs 1 at a time. Unset on some days before `stage` 5. */
		fenceDamage?: number;
		chickensPanicking?: boolean;
		pigsPanicking?: boolean;
		horsesPanicking?: boolean;
		cattlePanicking?: boolean;
		dogsPanicking?: boolean;
		/** Which line after hand milking a cow plays next, cycles 0 to 4. */
		handMilkingLine?: 0 | 1 | 2 | 3 | 4;
		/** The price of Alex's shopping in pence, £20 to £60. */
		alexShoppingMoney?: number;
		dog: AlexFarmAnimal;
		pig: AlexFarmAnimal;
		horse: AlexFarmAnimal;
		cattle: AlexFarmAnimal;
	}

	/** A species of farm animal. */
	export interface AlexFarmAnimal {
		/** Today's roll for the animal being a monster person. */
		monsterRoll: boolean;
		/** If the animal is a monster person right now. */
		monster: boolean;
		/** The animal's gender, from the beast gender settings. */
		gender: "m" | "f";
		/** The gender for text about the whole group: "m" or "f" if the settings only allow one, "b" for both. */
		genderPlural: "m" | "f" | "b";
		/** The animal's genitals. */
		genitals: "penis" | "vagina";
	}

	/** The `stage` 7 farm shed fight, where the PC is locked in Alex's tool shed. Emptied when it ends. */
	export interface AlexFarmShedFight {
		/**
		 * What the PC does on the next turn. Unset after it plays.
		 * - `"bash"`, `"hammer"`: hit the door, with fists or the hammer.
		 * - `"unscrew"`: take out a screw.
		 * - `"inspectChainsaw"`: try to work out the chainsaw.
		 * - `"refuel"`: fuel the chainsaw.
		 * - `"chainsaw"`: cut the door down.
		 * - `"breasts"`, `"chest"`, `"bottom"`, `"penis"`, `"vagina"`: body parts they flashed at the thugs to distract them.
		 */
		action?: "bash" | "bottom" | "breasts" | "chainsaw" | "chest" | "hammer" | "inspectChainsaw" | "penis" | "refuel" | "unscrew" | "vagina";
		/** Turns Alex has fought the thugs. The PC can flash the thugs once this is as 2 to stop it from going up for that turn. Alex is knocked to the ground from 9. */
		round?: number;
		/** Turns the thugs stay distracted after a flash, 2 down to 0. */
		distraction?: 0 | 1 | 2;
		/** How much the door can take before it breaks, 14 down to 0. */
		doorStrength?: number;
		/** Screws still holding the door, 10 down to 0. */
		screws?: number;
		/** What the PC used on the door and holds when they break through. */
		weapon?: "chainsaw" | "fists" | "hammer" | "screwdriver";
		/**
		 * The chainsaw!!!
		 * - `1`: the PC knows it needs fuel.
		 * - `2`: fuelled, ready to cut the door.
		 */
		chainsaw?: 1 | 2;
		/** The parts of the shed the PC has searched. */
		searched?: {
			shelf?: true;
			toolbox?: true;
			cupboard?: true;
			rakes?: true;
			sheet?: true;
		};
		/** What the PC flashed through the window.
		 * Each can only be flashed once. */
		flashed?: {
			chest?: true;
			bottom?: true;
			genitals?: true;
		};
	}

	/** A forage in the woodland. Emptied when it ends. */
	export interface AlexFarmWoodlandForage {
		/** How much of each `$foodstuff` was found.
		 * Fruit or fungi, depending on `type`. */
		basket?: { strawberry: number; peach: number; plum: number } | { mushroom: number; truffle: number };
		/** Foraging turns left, 3 at the start. */
		attemptsLeft?: number;
		/** What the PC forages for. */
		type?: "fruit" | "fungi";
		/** If `animalRespect.pigs` is -20 on, the pigs leads PC deep into the woods. */
		pigsLedPcDeep?: boolean;
		/**
		 * What the PC gives the pigs at the end of a forage.
		 * - `"potato"`, `"carrot"`, `"apple"`: `rewardQuantity` of that food
		 * - `"basket"`: the harvest
		 * - `"body"`: sex with the pigs
		 * - `"nothing"`: nothing. The pigs may attack.
		 */
		rewardType?: "apple" | "basket" | "body" | "carrot" | "nothing" | "potato";
		/** How much food the pigs want. */
		rewardQuantity?: number;
		/** How the PC is caught when a pig goes for them. */
		position?: "prone" | "standing";
		/** If the PC chose to reward the pig that helped them. */
		rewardedHelpfulPig?: boolean;
		/** The gender of the pig in `rewardedHelpfulPig`. */
		helpfulPigGender?: "m" | "f";
		/** If the PC can stop the pig sex, which sets `$noFinish`. */
		pcCanStopSex?: boolean;
		/** If the PC submitted to the pigs or fought them. */
		response?: "defiant" | "submissive";
		/** Where the pig sex happens.
		 * At the treeline, Alex might hear. */
		location?: "treeline" | "woodland";
		/** The genders of the other pigs watching during a pig rape. */
		watchingPigGenders?: ("m" | "f")[];
	}

	/** Alex's farm's once-a-day values, stored in `$daily.alexFarm`. */
	export interface AlexFarmDaily {
		/** Minutes worked since the last payment.
		 * Each 60 pays `hourlyWage`. */
		minutesTowardsWage?: number;
		/** If Alex has finished work for the day (21:00).
		 * The farm then swap to after work options. */
		alexEndedWorkday?: true;
		/** If the day's random farm work event has played. */
		workEventPlayed?: true;
		/** If the PC used the kennel today. Hides it until tomorrow. */
		pcUsedKennelToday?: true;
		/** Today's extra yield, added to `yieldOwedToPc` for the PC's extra pay. Can be negative. */
		yieldToday?: number;
		/** If Alex is sulking in the pub after raping pc in the lab*/
		alexIsPubSulk?: true;
	}

	/** Alex's farm's once-a-week flags, stored in `$weekly.alexFarm`. */
	export interface AlexFarmWeekly {
		/** If the watchtower guard agreed to wait for this week's pay. */
		guardAgreedToWait?: true;
		/** If a pregnant PC felt nauseous while feeding the pigs this week. */
		pcFeltNauseous?: true;
	}
}

export {};
