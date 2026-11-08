declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** Bailey's variables, see BaileyState. */
		bailey: BaileyState;
	}
}

declare global {
	export interface BaileyState {
		/** How many times Bailey has driven the PC home from the hospital. Bailey's lines change each time.
		 * After the 3rd time, Bailey no longer bothers picking the PC up. */
		timesPickedUpPcFromHospital: number;
		/** Tracks how far the PC got with the document from the pound with Bailey's initial on it.
		 * Unset until the PC finds the document or is rescued at the end of the pound show.
		 *
		 * - `found`: the PC found the document.
		 * - `baileyKnows`: the PC confronted Bailey about it if they escaped on their own, or was told about Bailey's past
		 *   dealings with the pound after being rescued.
		 * - `sawAmbulances`: the PC saw the ambulances on Starfish Street after Bailey found out. */
		poundDocument?: "found" | "baileyKnows" | "sawAmbulances";
		/** Bailey's scene waiting at the orphanage after the PC escapes the underground brothel, if Bailey sold them there.
		 * Played and unset when the PC gets home, and also unset if Bailey comes for the PC at the farm. */
		reunionToPlay?: "dungeon";
		/** Tracks the PC beating Bailey in a fight. */
		fights: {
			/** How many times the PC has beaten Bailey by knocking HP to 0. */
			timesPcWon: number;
			/** How many times the PC has beaten Bailey by making them cum.
			 * Also earns "Bailey's Trouble Maker" feat. */
			timesPcMadeBaileyCum: number;
			/** Fights the PC has won since they last paid. Reset to 0 when the PC pays, is sold, or loses a fight to Bailey.
			 *
			 * 1+ = Bailey brings one thug to rent collections and can sell the sleeping PC to a rapist at night (`soldPcWhileAsleep`).
			 *
			 * 2+ = Changes some of Bailey's lines.
			 *
			 * 3+ = Bailey brings two thugs to rent collections and does not allow PC into the youth ward. Changes some of Bailey's lines.
			 * Also one of the ways Bailey starts using Robin as leverage when the PC pays Robin's rent. */
			pcWinsSinceLastPaid: number;
		};
		/** Bailey's thugs will hunt the PC down if they keep dodging rent. Unset until the PC first triggers them. */
		thugs?: {
			/** How angry the thugs are, 0 to 5. Rises by 1 each day while rent is more than a day overdue, up to 4.
			 * Higher anger means more ambushes, tougher thugs and more allure in town. */
			anger: 0 | 1 | 2 | 3 | 4 | 5;
			/** Days before anger can rise again on its own. */
			angerCountdown: 0 | 1 | 2;
			/** Places the thugs are lying in wait, and when they give up. At most 3. */
			traps: Array<{ location: string; endTime: number }>;
		} | null;
		/** Bailey collecting the PC's rent, and what Bailey does when they don't pay. */
		rent: {
			/** Days until Bailey next collects. 0 means rent is due. Below 0 means rent is overdue.
			 * Set to 7 whenever Bailey collects, and goes down by 1 each day, except while Avery is paying or during certain bad ends. */
			daysUntilDue: number;
			/** What Bailey charges per collection (in pence) times the rent cost setting.
			 * Doubled while the PC pays Robin's rent. */
			amount: number;
			/** Starts at 1 and goes up by 1 each time the PC pays.
			 * Picks the next price: £300, £500, £700, £1,000, £1,500. Caps at £2,000. */
			timesRaised: number;
			/** Bailey's extra charge for the PC's children at the orphanage (in pence).
			 * £100 for each child the PC interacted with fewer than 6 times since the last collection, with one child's fee taken off for every 7 milk bottles given to the orphanage. */
			extraForChildren?: number;
			/** Which buyer Bailey sells the PC to next. Cycles 0 to 3.
			 *
			 * - `0`: Danube Street mansion, or tutorial guy if PC has not left the orphanage
			 * - `1`: Eden, or Gwylan if the PC wears the familiar's collar.
			 * - `2`: Remy's farm
			 * - `3`: the underground brothel. */
			nextBuyer?: 0 | 1 | 2 | 3;
			/** Payments the PC has made in a row. Reset to 0 when they refuse or can't pay.
			 * Below 2, or while rent is overdue, Bailey brings Robin to collections if Robin is home and Bailey has already used Robin as leverage.
			 * Unset until the PC first pays, refuses or can't pay. */
			paymentsInARow?: number;
			/** Times the PC has refused or couldn't pay Bailey at safehouses (farm and temple).
			 * Reset to 0 when Bailey is either paid or comes to collect, even if turned away.
			 *
			 * While above 0, Bailey's thugs look for the PC around town and Bailey will approach PC for rent at the orphanage,
			 * unless Avery is paying.
			 *
			 * 3+ blocks access to the youth ward even while Avery is paying. */
			safehouseRefusals: number;
			/** Times the PC has refused Bailey at the farm. Unset when the PC pays, is sold or loses.
			 *
			 * While set, Bailey will help Remy's encroachment, sending a team of thugs and doing 2 more damage.
			 *
			 * Once the farm reaches stage 5, 1 or more raises aggression each day. At 2 or more, aggression rises more with each refusal. */
			timesPcRefusedBaileyAtFarm?: number;
			/** Rent money the PC owes from refusing, from not being able to pay, and from every week the rent is overdue, in pence.
			 * Lowered by a week's rent when Bailey sells the PC.
			 *
			 * TODO: Separate from unpaidRentMoneyLifetime so that we can add an option to pay this debt back to Bailey. */
			unpaidRentMoney: number;
			/** `unpaidRentMoney`, but it never goes down. Shown on the statistics page. */
			unpaidRentMoneyLifetime: number;
			/** How many times Bailey has sold the PC. 1 or more unlocks uncomfortable prostitution and changes some lines.
			 *
			 * 2+ changes even more lines.
			 *
			 * 5+ changes the walk in the orphanage tunnels. */
			timesSoldPc: number;
			/** If Bailey has sold the PC to the underground brothel or farm and they haven't escaped yet.
			 * Unset when they escape. */
			pcCurrentlySold?: true;
			/** If Bailey sold a PC sleeping in their bed or Robin's bed to a rapist. Waking up plays it and sets it back to false. */
			soldPcWhileAsleep?: boolean;
			/** What Bailey confiscated from the PC's room, and the day it was taken.
			 * Returned when the PC pays or wins the fight over it. Pawned and discarded after 8 days. */
			confiscation: {
				items: Array<
					| { source: "clothing"; slot: string; name: string; value: number; item: object }
					| { source: "furniture"; category: string; id: string; name: string; value: number }
				>;
				day: number;
			} | null;
			/** If Bailey pawned the confiscated furniture and clothes.
			 * The notice shows on the next visit to the orphanage and sets it back to false. */
			pawnedConfiscation: boolean;
			/** Which of Bailey's three lines plays in "Rent First Robin Fight". Moves on only when the PC pleads, apologises, screams, or demands.
			 * Set to 0 when Robin is dragged in. */
			robinFightLinesSaid?: 0 | 1 | 2;
			/** How many times the PC's water broke during rent collection.
			 * Changes Bailey's lines. */
			timesPcWentIntoLabour?: number;
			/** What was happening when PC's water broke during rent collection. Unset when the PC comes back from giving birth.
			 *
			 * - `told`: the PC told Bailey their water broke.
			 * - `broke`: water broke while the PC couldn't pay.
			 * - `refused`: water broke while the PC was refusing to pay. */
			labourInterruption?: "told" | "broke" | "refused";
		};
	}

	/** Bailey's once-a-day flags, stored in `$daily.bailey`. */
	export interface BaileyDaily {
		/** How many times the PC has visited Bailey's office today while Bailey was in. Visits 2 and 3 get angrier. The 4th gets the PC beaten.
		 * Later visits are ignored. (There's an easter egg at 101.) */
		timesPcVisitedOffice?: number;
		/** If Bailey knocked on the PC's door at 7 on a school day. */
		wokePcForSchool?: true;
	}

	/** Bailey's once-a-week flags, stored in `$weekly.bailey`. */
	export interface BaileyWeekly {
		/** If the PC heard Bailey coming back to the flats with a partner this week. */
		broughtPartnerToFlats?: true;
	}

	/** Bailey's once-a-month flags, stored in `$monthly.bailey`. */
	export interface BaileyMonthly {
		/** If the PC saw Bailey standing by the lotus pond at night this month. */
		stoodAtLotusPond?: true;
	}
}

export {};
