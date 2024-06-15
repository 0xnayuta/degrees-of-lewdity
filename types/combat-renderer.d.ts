declare global {
	interface Window {
		combatRenderer?: CombatRenderer;
		playerCombatMapper?: PlayerCombatMapper;
	}
}

export {};
