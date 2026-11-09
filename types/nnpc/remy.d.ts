declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** Remy's variables, see RemyState. */
		remy: RemyState;
	}
}

declare global {
	export interface RemyState {
		/** What Remy is riding when chasing the PC after an escape from the Underground Farm. Rolled by `<<livestock_horse>>`.
		 * Picks the horse's sex if Remy punishes the PC with it once caught. Unset after the chase. */
		escapeSteed?: "centaur" | "stallion" | "mare";
		/** Where the PC last met Remy.
		 * Only `undergroundFarm` is read right now for Remy's greeting at the riding school. */
		lastMetAt?: "alexFarm" | "undergroundFarm" | "ridingSchool" | "afterAveryCardGame";
	}

	/** Remy's once-a-day flags, stored in `$daily.remy`. */
	export interface RemyDaily {
		/** If the PC saw Remy pick out a horse with a bridle at the Underground Farm.
		 * Stops the event from rolling again today. */
		pcSawBridlingHorse?: true;
	}
}

export {};
