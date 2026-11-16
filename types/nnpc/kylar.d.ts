declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** Kylar's variables, see KylarState. */
		kylar: KylarState;
	}
}

declare global {
	/**
	 * Kylar's states and variables:
	 * - `school`: at school
	 * - `orphanage`: visits to the orphanage
	 * - `park`: at the park
	 * - `visit`: the current conversation with Kylar
	 * - `stalking`: Kylar following the PC around town
	 * - `abduction`: Kylar holding the PC in the manor basement
	 * - `altar`: the story of Kylar's parents, and the PC's research into the altar behind the manor
	 * - `sex`: Kylar's sex and encounters
	 * - `christmas`, `halloween`: reset when the holiday ends
	 */
	export interface KylarState {
		/** Set to true once Kylar is someone the PC can set as a love interest. Set by the knife scene in English class, kissing after cuddling in PC's bed, or cheats. */
		romance?: true;
		/** If Kylar's Stockholm syndrome is active.
		 * Set to true when the abduction's `stockholmProgress` reaches 5. */
		stockholm?: boolean;
		/**
		 * The owl plushie with a hidden camera that Kylar gives the PC. Unset until Kylar offers it, at love 90+.
		 * - `"offered"`: gift offered, but not opened.
		 * - `"opened"`: gift opened, but not accepted.
		 * - `"accepted"`: camera placed on top of PC's wardrobe
		 * - `"givenToOrphan"`: the PC gave it to another orphan and it got confiscated to Bailey's office.
		 * - `"pcSawBedroomFootage"`: the PC kept the plushie and then saw footage of their bedroom on Kylar's computer during the abduction. Lets the PC decide what to do with the camera in their bedroom.
		 * - `"pcSawLivingRoomFootage"`: the PC saw the footage of the orphans in the orphanage living room on Kylar's computer during the abduction. Lets the PC find the plushie in the living room and decide what to do with it.
		 * - `"removed"`: the PC stomped on the camera.
		 * - `"leftInPlace"`: the PC kept or moved the camera to their wardrobe after finding out its a camera.
		 */
		owlCamera?: "offered" | "opened" | "accepted" | "givenToOrphan" | "pcSawBedroomFootage" | "pcSawLivingRoomFootage" | "removed" | "leftInPlace";
		/** How far Kylar has got in bringing up the lewd pictures of the PC going around.
		 * Kylar brings them up when `$fame.sex` is 100+, 300+ and then 500+. */
		lewdPictureStage: 0 | 1 | 2;
		/** How much Kylar's parents trust the PC, 0 to 100. Goes up by 1 with each of the four once-a-day chores (trimming the hedges, soothing the parents, cleaning the lab or the kitchen), which stop once it's 100.
		 * During the chores, the parents' unseen presence gets friendlier at 20, 40, 60 and 80. At 100 the manor is tidy, and the PC can tell Kylar so, which starts `altar.storyStage`.
		 * The manor's look in the English play also changes at 40 and 80. Set back to 0 when Kylar abducts the PC. */
		parentsTrust: number;
		/**
		 * The riddle the PC told Kylar while chatting. Unset when there's no riddle.
		 * - `"toldToday"`: the PC told Kylar a riddle today.
		 * - `"toldYesterday"`: Kylar gives an answer next time the PC talks to them, which unsets it.
		 *
		 * At midnight, `"toldToday"` moves to `"toldYesterday"`. An unanswered `"toldYesterday"` is unset.
		 */
		pcRiddle?: "toldToday" | "toldYesterday";
		/** If Kylar is looking for the PC after the PC escaped the underground farm or the underground brothel while Kylar's love was 50+.
		 *
		 * Kylar's reunion scene can play in the school hallways or on the street. Unset when it plays, when the PC first meets Kylar in prison, or when they break out of prison. */
		searchingForPc?: true;
		/** Kylar at school. */
		school: {
			/**
			 * Where Kylar sits in English. Unset until the PC's first English lesson with Kylar.
			 * - 0: across the room, staring at the PC.
			 * - 1: after $kylar.romance, ready to move next to the PC once Kylar's love is 60+.
			 * - 2: next to the PC.
			 */
			englishSeat?: 0 | 1 | 2;
			/**
			 * Where Kylar is in the current English lesson. Set at the start of each lesson.
			 * - `"acrossRoom"`: staring at the PC from across the classroom.
			 * - `"nextToPc"`: sitting next to the PC.
			 * - `"absent"`: not in class.
			 */
			englishClassStatus?: "acrossRoom" | "nextToPc" | "absent";
			/** The chance of Kylar's hallway event, out of 100. Rises by 10 plus a quarter of Kylar's lust each day. Goes back to 0 when the event plays. */
			hallwayEventChance: number;
			/**
			 * What Kylar does when the PC leaves the canteen after lunch. Changes the text when the PC leaves, then unset.
			 * - `"jealousOfRobin"`: Kylar saw the PC say goodbye to Robin. Kylar will either glare at Robin or kiss the PC if the PC is dating Robin.
			 * - `"jealousOfRobinAndSydney"`: same as the above, but after Sydney kissed the PC on the cheek. Kylar's line will be about both Robin and Sydney
			 * - `"druggedPc"`: Kylar drugged the PC's lunch and abducts to the manor
			 * - `"druggedPcInFrontOfRobin"`: same as above, but Robin sees it happen
			 */
			canteenGoodbye?: "jealousOfRobin" | "jealousOfRobinAndSydney" | "druggedPc" | "druggedPcInFrontOfRobin";
			/** Which school toilets the PC took Kylar to.
			 * Unset when they leave. */
			toiletsUsed?: "m" | "f";
		};
		/** Kylar's visits to the orphanage. */
		orphanage: {
			/** If Kylar is sleeping in the PC's bed tonight. */
			inPcBedTonight?: boolean;
			/** If Kylar snuck into the PC's room while they were asleep tonight, rather than being invited. Changes the wake up text. Unset when the PC wakes up or tells Kylar to leave. */
			sneakedInTonight?: boolean;
			/** How close Kylar is to visiting the PC's bedroom. Rises by 10 plus a quarter of Kylar's lust each day.
			 * At 100+, Kylar will visit. */
			bedroomVisitProgress: number;
			/** Days until Kylar can leave the PC another letter. Set to 30 when a letter is left, then counts down each day. */
			daysUntilNextLetter?: number;
			/** Naps with Kylar before Kylar says "I love you", before `$kylar.romance`. Starts at 0, goes down by 1 each nap and can go below 0.
			 * Set to 2 to 5 if the PC berates Kylar for saying it. */
			napsUntilNextLoveConfession: number;
			/**
			 * How Kylar's night break-in for the PC's love locket went. Changes what Kylar says about the locket.
			 * - `"added"`: Kylar put their own photo in the locket.
			 * - `"took"`: Kylar took the locket.
			 * - `"self"`: the locket already had Kylar's photo in it.
			 * - `"other"`: the locket had someone else's photo in it.
			 * - `"confronted"`: the PC confronted Kylar for it.
			 */
			locketBreakIn?: "added" | "took" | "self" | "other" | "confronted";
			/** If Kylar saw another love interest's bodywriting on the PC while chatting. Lets Kylar's bath visit play. Unset after. */
			sawRivalBodywriting?: boolean;
			/** The underwear Kylar stole from the PC's wardrobe.
			 * Not read anywhere yet. */
			underwearStolenFromPc?: ClothesItem;
		};
		/** Kylar at the park. */
		park: {
			/** If Kylar is at the fountain today instead of on the bench. The chance of Kylar being here goes up after making a wish at the fountain.
			 * Also set to true if the PC chooses to stay at the fountain after a park walk. */
			atFountainToday?: boolean;
			/** Kylar's clothes, saved before Kylar strips during the park encounter. If the PC loses, Kylar dresses them in these. Unset when the encounter ends. */
			clothesToGivePc?: NpcClothes;
		};
		/** The current conversation with Kylar. */
		visit: {
			/**
			 * The last thing the PC did with Kylar. Unset when the PC leaves or takes Kylar somewhere.
			 * - `"walk"`: walked in the park. Lets the PC kiss Kylar.
			 * - `"tease"`: flirted. Lets the PC take it further.
			 * - `"loft"`: told Kylar about the orphanage loft. Hides that option.
			 * - `"stop"`: Kylar grabbed the PC's wrist as they tried to leave. The PC has to shake Kylar off.
			 * - `"gift"`, `"milkshake"`, `"shake"`, `"underwear"`, `"chat"`, `"game"`: not read.
			 */
			lastAction?: "walk" | "tease" | "loft" | "stop" | "gift" | "milkshake" | "shake" | "underwear" | "chat" | "game";
			/** If the PC just walked up to Kylar. Shows Kylar's greeting. Unset when it's shown. */
			pcJustApproached?: true;
			/** If the PC has played a game with Kylar since entering the arcade. Changes how the PC asks to play. */
			pcPlayedArcadeGame?: boolean;
		};
		/** Kylar following the PC around town. */
		stalking: {
			/** If Kylar is following the PC right now. The PC feels watched, and Kylar's street events can play. */
			inProgress?: boolean;
			/** Hours left before Kylar stops following the PC. Set to 2 when it starts, and goes down each hour. Kylar's street events also lower it by 1 or set it to 0.
			 * Set back to 2 when the PC praises Kylar after catching Kylar following them, so Kylar keeps following. */
			hoursLeft?: number;
			/** The chance of Kylar starting to follow the PC on the street. Rises by 10 plus a quarter of Kylar's lust each day. Kylar starts following when it's at least 65 plus `$rng`, and it goes back to 0. */
			chance: number;
			/** If Kylar will abduct the PC the next time Kylar follows them, if stockholm syndrome is not set. Unset when the abduction starts.
			 * Set by scenes where Kylar sees the PC have sex with someone else and if the PC sides with Whitney instead of Kylar during Halloween. */
			willAbductPc?: boolean;
			/** The colour of the PC's clothes that Kylar tore off while following them. If the PC chases the torn fabric and catches it, they wrap it round themselves as a towel skirt in this colour. */
			tornClothesColour?: string;
		};
		/** Kylar holding the PC in the manor basement. Most of these are unset when the abduction ends. */
		abduction: {
			/** How tight the PC's binds are. Set to 100 when the abduction starts or Kylar recaptures the PC or 50 when Kylar re-ties them loosely. Loosens when the PC struggles. Unset when the abduction ends. */
			bindsTightness?: number;
			/**
			 * The manor's lawn, which PC can see from the basement window.
			 * - `"pcSawOvergrown"`: the PC saw overgrown grass blocking the view. Lets the PC tell Kylar to mow it.
			 * - `"kylarMowed"`: Kylar mowed it after the PC asked.
			 */
			grass?: "pcSawOvergrown" | "kylarMowed";
			/** If the PC found out the manor is on Danube Street. Either from the basement window once the grass is mown or from the front door when released or sneaking around.
			 * Lets the PC email Bailey from Kylar's computer. Kept for the next abduction. */
			pcKnowsManorLocation?: true;
			/** If the PC found the key while exploring the basement. Unset when the abduction ends. */
			pcFoundKey?: boolean;
			/** If the PC found the torch while exploring the basement. Unset when the abduction ends. */
			pcFoundTorch?: boolean;
			/** If the PC found Kylar's computer password while exploring the basement. Unset when the abduction ends. */
			pcFoundPassword?: boolean;
			/** If the PC emailed Bailey from Kylar's computer. Bailey comes to the manor with Jordan to rescue them. Unset when the abduction ends. */
			pcEmailedBailey?: boolean;
			/** If Kylar called the PC stupid. Lets the PC accuse Kylar of insulting their intelligence. Unset when it's used or the abduction ends. */
			calledPcStupid?: boolean;
			/** How Kylar has decorated their knife. Goes up by 1 each time the PC says the knife isn't pretty. Kylar shows new decorations at every stage.
			 * At 5, the next showing sets it back to 0 so Kylar has a plain knife again. Unset when the abduction ends. */
			knifeDecoration?: 0 | 1 | 2 | 3 | 4 | 5;
			/** The outfit the PC told Kylar to wear. Unset for Kylar's usual clothes, and when the abduction ends. */
			outfit?: "formal" | "goth" | "swimsuit";
			/** If the PC just asked Kylar to change outfits. Kylar shows it off next time they come in. Unset when shown or the abduction ends. */
			pcJustAskedForOutfit?: boolean;
			/** How many times Kylar's hypnosis has failed on the PC, 0 to 3. On the fourth try Kylar gives up and it goes back to 0. */
			timesHypnosisFailed?: 0 | 1 | 2 | 3;
			/** How close the PC is to Stockholm syndrome. Set to 0 when the abduction starts and goes up by 1 at a time. Kylar's events at 1 to 4 play while Kylar's lust is 100+.
			 * At 5+, the PC's Stockholm syndrome starts and this is unset. */
			stockholmProgress?: number;
		};
		/** The PC uncovering the story of what happened to Kylar's parents at the stone altar in the woods behind Kylar's manor. */
		altar: {
			/**
			 * How far the PC has got into the story.
			 * - 1: the PC told Kylar the manor is clean, and found a monstrance upstairs with Kylar.
			 * - 2: the PC asked Jordan about the monstrance at the temple. A bishop will accost the PC on the street.
			 * - 3: the bishop told the PC how Kylar's parents were punished at the altar. Starts the altar research.
			 */
			storyStage?: 1 | 2 | 3;
			/**
			 * Each step of the research the PC has done, in order:
			 * - `"library"`: finished researching in the school library.
			 * - `"temple"`: searched the temple scriptorium for the missing pages.
			 * - `"tape"`: watched the video tape with Kylar.
			 *
			 * TODO: Hi Vrelnir! This is where you would add a fourth step for showing the pages to Kylar's parents.
			 */
			researchDone?: ("library" | "temple" | "tape")[];
			/** How far the PC has got researching in the school library, 0 to 100. Unset once the library step is done. */
			libraryProgress?: number;
			/** If the PC told Sydney "Another time" when offered the forbidden room. Lets the PC ask Sydney to take them there. */
			sydneyOfferedForbiddenRoom?: true;
		};
		/** Halloween with Kylar. Unset from November 2nd. */
		halloween: {
			/** If Kylar invited the PC to the park on Halloween night. */
			invitedPcToPark?: boolean;
			/** If Kylar, in costume, met the PC in the park on Halloween night. Kylar's Halloween scene only plays once a year. */
			metPcInPark?: boolean;
			/** If Kylar went upstairs with the PC in the mansion during Kylar's Halloween scene. Stops Whitney's Halloween scene. */
			wentUpstairsWithPc?: boolean;
			/** Who the PC said they wanted to win during the pumpkin carving competition. */
			pcPumpkinWish?: "pcWin" | "kylarWin";
		};
		/** Christmas with Kylar. Reset when Christmas ends. */
		christmas: {
			/** Kylar's Christmas night visit: `"tonight"` once it's been set up while the PC sleeps, `"done"` once it's played. */
			visit?: "tonight" | "done";
		};
		/** Kylar's sex and encounters. */
		sex: {
			/** Which of Kylar's combat lines comes next, 0 to 9. */
			combatLineCycle?: number;
			/** How many times Kylar has raped the PC.
			 * Not read anywhere yet. */
			timesRapedPc: number;
		};
	}

	/** Kylar's once-a-day flags, stored in `$daily.kylar`. */
	export interface KylarDaily {
		/** The underwear Kylar is wearing today, picked by `<<kylarRandomUnderwear>>` when it has no `desc`.
		 * Set to an empty object when Kylar gives it to the PC. */
		underwear?: {
			id?: number;
			desc?: string;
			simpleDesc?: string;
			colourDesc?: string;
			hasAcc?: boolean;
			colour?: string;
			colourAcc?: string;
		};
		/** If Kylar commented on the PC's bodywriting. */
		commentedOnPcBodywriting?: true;
		/** If Kylar brought up the PC's lewd pictures. */
		broughtUpLewdPictures?: true;
		/** If Kylar attacked Leighton to save the PC in the library at lunch. Keeps Kylar out of the library for the rest of the day. */
		attackedLeightonForPc?: true;
		/**
		 * Kylar's jealousy of Sydney in the library today.
		 * - `"pcNoticedGlaring"`: the PC walked up to Kylar while Kylar glared at Sydney. Kylar's jealous line plays when the PC next chats with or teases Kylar there.
		 * - `"jealousLinePlayed"`: that line has played.
		 */
		libraryJealousy?: "pcNoticedGlaring" | "jealousLinePlayed";
		/** If Kylar is in the library at lunch to watch the PC. Rolled each day. */
		stalkingPcInLibrary?: boolean;
		/** If the PC complained to Kylar about the state of the manor. */
		pcComplainedAboutManor?: true;
		/** If Kylar fought off someone trying to rape the PC in their sleep. Changes how the PC and Kylar are holding each other in the morning. */
		foughtOffPcSleepRapist?: true;
		/** If Kylar's school toilets event played. */
		toiletsEventPlayed?: true;
		/** If Kylar gave the PC their underwear. */
		gavePcUnderwear?: true;
		/** If the PC and Kylar walked in the park. */
		walkedInPark?: true;
		/** If the PC kissed Kylar at the end of their park walk. */
		pcKissedOnWalk?: true;
		/** If the PC trimmed the manor hedges. */
		pcTrimmedManorHedges?: true;
		/** If the PC soothed Kylar's parents. */
		pcSoothedParents?: true;
		/** If the PC cleaned the manor lab. */
		pcCleanedManorLab?: true;
		/** If the PC cleaned the manor kitchen. */
		pcCleanedManorKitchen?: true;
		/** If the PC picked mushrooms in the manor garden. */
		pcPickedManorMushrooms?: true;
		/** If the PC chatted with Kylar in prison. Also unset at the start of each prison day. */
		chattedInPrison?: true;
		/** If the PC took their flirting with Kylar further. */
		pcTookFlirtingFurther?: true;
		/** If Kylar invited the PC somewhere private at the park or arcade. */
		invitedPcSomewherePrivate?: true;
		/** If the PC winked at Kylar's owl plushie after masturbating so Kylar only gains lust from it once a day. */
		pcWinkedAtOwlPlushie?: true;
	}

	/** Kylar's once-a-week flags, stored in `$weekly.kylar`. */
	export interface KylarWeekly {
		/** If one of Kylar's high rage night visits to the PC's room played. Either Kylar creeping in while Kylar's rage is 70+ and love is 49 or less, or the PC finding Kylar asleep on their floor while Kylar's rage and love are both 50+. */
		highRageNightVisitPlayed?: true;
		/** If Kylar gave the PC a pepper spray charge. */
		gavePcSprayCharge?: true;
		/** If Kylar's orphanage bath visit played. */
		hadOrphanageBathEvent?: true;
		/** If Kylar noticed the PC wearing a love locket. */
		noticedPcLoveLocket?: true;
		/** If Kylar broke in at night for the PC's love locket. */
		brokeInForLocket?: true;
	}

	/** Kylar in prison, stored in `$prison.kylar`. */
	export interface KylarPrison {
		/**
		 * Unset while Kylar isn't in the PC's block.
		 * - `"withPc"`: Kylar is in the PC's block. The PC can chat with Kylar and call Kylar for help.
		 * - `"inSolitary"`: the PC called Kylar to save them from a guard and Kylar was sent to solitary.
		 */
		state?: "withPc" | "inSolitary";
		/** Days until Kylar joins the PC's block. Goes down by 1 each midnight.
		 * Set to 2 when the PC is sent to prison while Kylar is in prison, and Kylar turns up at the first morning roll call after it reaches 0.
		 * Set to 3 when Kylar is put in solitary, and Kylar comes back after it reaches 0. Unset when Kylar joins the PC. */
		daysUntilJoinsPc?: 0 | 1 | 2 | 3;
	}
}

export {};
