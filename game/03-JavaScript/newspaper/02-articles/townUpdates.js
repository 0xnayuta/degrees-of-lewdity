/*
NOTES:
- Use category: "townUpdate"

- NEVER use random() or its derivatives, such as either(), pluck(), or randomFloat()
	Instead, use Newspaper.instance.rngInstance.random() (or its derivatives)
	This is because we use a seeded approach to random, which changes each week (each new newspaper)
- Title, content, image, or caption may either be a string or a function.
- condition is optional, but must be a function. (defaults to always true)
- id is not strictly required, but is highly recommended, in case we want to change the order

*/
Newspaper.addArticles(
	{
		category: "townUpdate",
		id: "townUpdate",
		priority: 3,
		title: "Town Update",
		short: `1Elk Street compound sees supply chain woes as Remy estate falls short of projected wildlife rehabilitation. This comes fresh after reports of a theft of a key piece of equipment used to sedate small animals, by "two big fucking birds," according to an employee of the Remy estate.`,
	},
	{
		category: "townUpdate",
		id: "townUpdate",
		priority: 3,
		title: "Town Update",
		short: `2Elk Street compound sees supply chain woes as Remy estate falls short of projected wildlife rehabilitation. This comes fresh after reports of a theft of a key piece of equipment used to sedate small animals, by "two big fucking birds," according to an employee of the Remy estate.`,
	}
);

/* Helper functions for the articles */
