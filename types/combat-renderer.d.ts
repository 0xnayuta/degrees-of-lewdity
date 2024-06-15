declare global {
	interface Window {
		CombatRenderer?: typeof CanvasCombatRenderer;
		PlayerCombatMapper?: typeof PlayerCanvasCombatMapper;
	}
}

export {};
