/**
 * Named NPC memories, stored in V.npcMemories by NPC name.
 * Please add memories here with a description. If it's not listed, adding, checking, or deleting the memory will throw.
 */
const VALID_MEMORIES = {
	Sirris: [
		// If the PC saw a hint of the adult shop opening (Sirris carrying a box to their car after school).
		"adultShopIntro",
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
 * @param {string} memory
 */
function deleteMemory(npcName, memory) {
	if (!isMemoryValid(npcName, memory)) {
		throw new Error(`"${memory}" is not a valid ${npcName} memory.`);
	}
	V.npcMemories[npcName].delete(memory);
}

const Memories = {
	Sirris: {
		add: memory => addMemory("Sirris", memory),
		has: memory => hasMemory("Sirris", memory),
		delete: memory => deleteMemory("Sirris", memory),
	},
};
window.Memories = Memories;
