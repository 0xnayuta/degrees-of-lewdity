// Redraw it when moving through history
$(document).on(":enginego", () => {
	if (!V.newspaper || !Newspaper.instance || V.newspaper.date === Newspaper.instance.date) return;
	Newspaper.instance = null;
	Newspaper.init();
});

// Run it async after UI has been drawn, does not increase load time
$(document).on(":storyready", async () => {
	if (!V.newspaper) return;
	await setup.NewspaperTexture.init();
	Newspaper.init().catch(e => console.warn("Newspaper preload failed:", e));
});
