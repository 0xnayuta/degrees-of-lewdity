declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** Named NPC memories by NPC name. Read and write them with `Memories.<Npc>.add/has/delete`, which checks each memory against the list in npc-memories.js. */
		npcMemories: Partial<Record<NpcNames, string[]>>;
		/** The last batch of NNPC cleanup save migrations that ran on this save. New games start at the latest batch.
		 * - 1: Bailey, Sirris, Robin, Quinn, Niki, the Night Monster, Zephyr, Morgan, Leighton, Jordan, Darryl, Charlie, Briar, Remy, Sam, Winter (+ the museum), the Ivory Wraith, Doren, River, Mason, Landry, Wren, Harper, the Black Wolf (+ the wolf pack), Kylar and Alex. */
		nnpcCleanupBatchDone?: 1;
	}
}

export {};
