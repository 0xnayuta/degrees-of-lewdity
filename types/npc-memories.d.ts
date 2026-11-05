declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** Named NPC memories by NPC name. Read and write them with `Memories.<Npc>.add/has/delete`, which checks each memory against the list in npc-memories.js. */
		npcMemories: Partial<Record<NpcNames, string[]>>;
	}
}

export {};
