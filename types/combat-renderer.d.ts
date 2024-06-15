declare global {
	interface Window {
		CombatRenderer?: CanvasCombatRenderer;
		PlayerCombatMapper?: PlayerCanvasCombatMapper;
	}
}

export {};
