declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** Briar's variables, see BriarState. */
		briar: BriarState;
	}
}

declare global {
	export interface BriarState {
		/** Briar's score on the PC's reports on Darryl's strip club. Starts at 1 when Briar asks the PC to spy on Darryl.
		 *
		 * - Accurate report: +1
		 * - Exaggerating Darryl's power, and Briar believes it: -2
		 * - Underplaying Darryl's power, and Briar believes it: -1
		 * - Caught lying either way: +2
		 *
		 * Not currently read. */
		darrylRivalryScore?: number;
		/** Days until Briar's goon waits outside the strip club for the PC's next report. Set to 7 when Briar asks the PC to spy on Darryl and after each report, and goes down by 1 each day.
		 *
		 * The goon waits at 0 or less, so it can go below 0 until the PC visits. */
		daysUntilGoonAtStripClub?: number;
		/** Briar's punishment in a brothel cell, at the gloryhole or the wall hole. */
		punishment: BriarPunishment;
	}

	/** Briar's punishment in a brothel cell, at the gloryhole or the wall hole. */
	export interface BriarPunishment {
		/** How many customers the PC owes Briar after getting caught hacking Briar's laptop.
		 *
		 * 3 if the PC slipped out
		 *
		 * 5 if they fled through the window.
		 *
		 * Starts the punishment on the next brothel visit, and is unset once it starts or if the PC fights free. */
		customersOwed?: 3 | 5;
		/** How many customers are left in a punishment before Briar lets the PC go.
		 *
		 * Starts at 3 or 5 or 10 depending on what PC is being punished for and goes down by 1 per customer. Goes back up by 1 when a customer is hurt and Briar moves the PC to the wall.
		 *
		 * At 5, Briar mocks the PC. At 0, Briar lets the PC go. */
		customersLeft?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
		/** Why Briar is punishing the PC, which picks Briar's parting line.
		 * Unset after it. */
		reason?: "pcHackedLaptop" | "pcSoldSexOutsideBrothel";
	}
}

export {};
