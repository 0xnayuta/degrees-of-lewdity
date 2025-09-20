/*
NOTES:
- NEVER use random() or its derivatives, such as either(), pluck(), or randomFloat()
	Instead, use Newspaper.instance.rngInstance.random() (or its derivatives)
	This is because we use a seeded approach to random, which changes each week (each new newspaper)
- Title, content (short/main), image, or caption may either be a string or a function.
- condition is optional, but must be a function. (defaults to always true)
- id is not strictly required, but is highly recommended, in case we want to change the order
- The layout engine may split long articles across columns; it avoids orphaning a title or a single short line.

Priority:
- Higher priority numbers are more likely to appear.
- One main article (with main defined) is chosen by priority, then RNG among top priority ties.
- Short articles are bucketed by priority and shuffled within buckets.
- Ads and town updates are placed after normal articles; ads are limited to max 2 per weekly edition. (But may be omitted if higher priority short articles exist that week)

Article fields:
- title
- content (short/main) - Receives init() return value as argument, if it exists
- image
- caption
- condition: optional function
- id
- repeatable: if false, the article is expires after it appears once
- priority: higher values are placed earlier among short articles.
- init(obj) (optional):
	- Called ONCE per included article for the current newspaper edition, the first time its content is resolved during build.
		It does NOT rerun on re-renders or opening the paper again. Results are cached for that edition.
	- It is given a shallow clone of Newspaper.modifiers
	- Return value: whatever init() returns is passed into your content functions (short/main) as their argument
		The return value of init() will also be merged into Newspaper.modifiers and become available globally (for the rest of the week)
		If the return value is not an object, it will NOT be merged into Newspaper.modifiers (but still passed to main/short functions)
	- For an example, look at adNewspaper in ads.js (Creates a global discounted clothing item in the shop)

Newspaper.modifiers:
 - Becomes available globally as soon as the initial newspaper build completes.
 - Contains the return values of all init() functions from included articles.
 - The return value of init() must be an object in order to be merged properly.
 - Persists for the entire edition (week). Can also access with V.newspaper.modifiers.
 - Resets when a new edition is generated via Newspaper.reset()/clear() (weekly)
*/
Newspaper.addArticles(
	{
		category: "townUpdate",
		id: "worldCorruptionLure",
		priority: 3,
		title: "Business Update",
		condition: () => V.bird?.upgrades?.decor >= 5,
		short: `Elk Street compound sees supply chain woes as Remy estate falls short of projected wildlife rehabilitation. This comes fresh after reports of a theft of a key piece of equipment used to sedate small animals, by "two big fucking birds," according to an employee of the Remy estate.`,
	},
	{
		category: "townUpdate",
		id: "worldCorruptionSydneyCorrupt",
		priority: 3,
		title: "Community Update",
		condition: () => V.sydneySeen?.includes("corruptroom"),
		short: `Services at the temple on Wolf Street become somber as a malaise falls over the flock. When asked for comment, the bishop's attendants said only "A bold pair forgot to close the door behind them, and something escaped." The bishop was asked for comment directly following this, who said "The temple's line of succession may need to be amended."`,
	},
	{
		category: "townUpdate",
		id: "worldCorruptionSydneyPure",
		priority: 3,
		title: "Community Update",
		condition: () => V.templePromised === "Sydney",
		short: `The temple on Wolf Street sees high energy and an influx of new initiates, as a pair of the faithful are joined in a ceremony known as the 'Rite of Promise' for the first time in years.`,
	},
	/* Repeating weekly world corruption article if no events from above fire off */
	{
		category: "townUpdate",
		id: "worldCorruptionNotif",
		repeatable: true,
		priority: 1,
		title: "Business Update",
		short: () => {
			if (V.world_corruption_hard <= 0)
				return `Violet Elk Ltd. sees stocks plummet as all current projects freeze. Executives scramble for solutions as emergency funding from an anonymous benefactor keeps the company afloat for the forseeable future.`;
			if (V.world_corruption_hard <= 1)
				return `Violet Elk Ltd. reports below-average start to the week as setbacks pile up, but ensures investors that a rebound is imminent.`;
			if (V.world_corruption_hard <= 3)
				return `Violet Elk Ltd. reports steady progress and growth, driving investor confidence up. The mayor continues to hold special interest, although rumours of private funding and insider trading remain unsubstantiated.`;
			return `Violet Elk Ltd. eagerly shows off new projects in research and development. A swell of volunteers for the testing of new substances, a lack of red tape, and generous funding from independant sources, are cited as the reasons for rapid progress.`;
		},
	}
);

/* Helper functions for the articles */
