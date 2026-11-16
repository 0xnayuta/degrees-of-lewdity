/**
 * Determine Kylar's location,
 * when Kylar has a centralised scheduling system, we could avoid logic specific to Kylar in the library-functions file.
 *
 * [KylarScheduleRefactor]
 *
 * @returns {"library"|"stalk"|"elsewhere"|"inactive"}
 */
function getKylarLibraryState() {
	// state could be inactive-undefined, active or prison. We only want active.
	if (C.npc.Kylar.state !== "active") return "inactive";

	if (V.schoolstate === "lunch" && V.daily.school.lunchEaten === 1) {
		// During lunch, Kylar currently will only be in the library when raining, or stalking.
		const isRaining = Weather.precipitation !== "none";
		if (isRaining) return "library";
		const isStalking = V.daily.kylar.stalkingPcInLibrary && C.npc.Sydney.init === 1;
		if (isStalking) return "stalk";
	}
	return "elsewhere";
}
window.getKylarLibraryState = getKylarLibraryState;
