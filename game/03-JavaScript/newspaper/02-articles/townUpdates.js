/*
NOTES:
- NEVER use random() or its derivatives, such as either(), pluck(), or randomFloat()
	Instead, use Newspaper.instance.rngInstance.random() (or its derivatives)
	This is because we use a seeded approach to random, which changes each week (each new newspaper)
- Title, content, image, or caption may either be a string or a function.
- condition is optional, but must be a function. (defaults to always true)
- id is not strictly required, but is highly recommended, in case we want to change the order

-  init(obj) (optional):
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
		id: "townUpdate",
		priority: 3,
		title: "Town Update",
		short: `Elk Street compound sees supply chain woes as Remy estate falls short of projected wildlife rehabilitation. This comes fresh after reports of a theft of a key piece of equipment used to sedate small animals, by "two big fucking birds," according to an employee of the Remy estate.`,
	},
	{
		category: "townUpdate",
		id: "townUpdate",
		priority: 3,
		title: "Town Update",
		short: `Elk Street compound sees supply chain woes as Remy estate falls short of projected wildlife rehabilitation. This comes fresh after reports of a theft of a key piece of equipment used to sedate small animals, by "two big fucking birds," according to an employee of the Remy estate.`,
	}
);

/* Helper functions for the articles */
