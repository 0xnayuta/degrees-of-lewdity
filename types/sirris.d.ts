declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		/** Sirris's memories, checked with `$sirrisSeen.includes("memory")` and added with `$sirrisSeen.pushUnique("memory")`. */
		sirrisSeen: SirrisMemory[];
	}
}

declare global {
	export type SirrisMemory =
		/** If the PC saw a hint of the adult shop opening(Sirris carrying a box to their car after school). */
		"adultShopIntro";
}

export {};
