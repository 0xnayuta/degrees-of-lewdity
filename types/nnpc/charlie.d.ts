declare global {
	/** Charlie's once-a-day flags, stored in `$daily.charlie`. */
	export interface CharlieDaily {
		/** If Charlie went to hold the PCs hands during a lesson while PC is a handholding virgin.
		 * Stops the personal attention lesson from rolling again today. */
		reachedForPcHands?: true;
	}
}

export {};
