/**
 * Named NPC memories, stored in V.npcMemories by NPC name.
 * Please add memories here with a description. If it's not listed, adding, checking, or deleting the memory will throw.
 */
const VALID_MEMORIES = {
	Sirris: [
		// If the PC saw Sirris carrying a box to their car after school, hinting at the adult shop opening
		// Used so the hint only plays once
		"adultShopIntro",
	],
	Bailey: [
		// If the PC helped another orphan fight off an attacker at the orphanage
		// Used so Bailey only reacts and gains respect the first time
		"homeScream",
		// If Bailey took the PC to the docks after winning Avery's card game
		// Used so Bailey drives straight to the orphanage in later games
		"cardsDocks",
	],
	Leighton: [
		// If Leighton has been put in the pillory
		// Used for a Bailey line about Leighton after Avery's card game
		"pillory",
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
	Bailey: {
		add: memory => addMemory("Bailey", memory),
		has: memory => hasMemory("Bailey", memory),
		delete: memory => deleteMemory("Bailey", memory),
	},
	Leighton: {
		add: memory => addMemory("Leighton", memory),
		has: memory => hasMemory("Leighton", memory),
		delete: memory => deleteMemory("Leighton", memory),
	},
};
window.Memories = Memories;
