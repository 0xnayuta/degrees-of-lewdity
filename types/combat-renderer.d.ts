declare global {
	interface Window {
		CombatRenderer?: typeof CombatRenderer;
		PlayerCombatMapper?: typeof PlayerCombatMapper;
	}
}

export {};
