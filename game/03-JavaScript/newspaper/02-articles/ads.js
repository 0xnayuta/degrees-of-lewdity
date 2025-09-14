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
		category: "advertisement",
		repeatable: true,
		id: "adNewspaper",
		priority: 1,
		init: obj => {
			// Top 20 most expensive
			const topExpensive = setup.clothes.all
				.filter(item => Array.isArray(item.shop) && item.shop.includes("clothing"))
				.sort((a, b) => b.cost - a.cost)
				.slice(0, 20);
			// Get a random one
			const result = Newspaper.instance.rngInstance.either(...topExpensive);
			const discount = 0.5;

			const item = { variable: result.variable, discount };
			obj.discountedClothing = item;
			return item;
		},
		short: item => {
			const rng = Newspaper.instance.rngInstance;
			const discountedClothing = setup.clothes.all.find(obj => obj.variable === item.variable && (!obj.one_piece || obj.outfitPrimary));

			const adjectives = new Set([
				"Stylish",
				"Durable",
				"Comfortable",
				"Elegant",
				"Trendy",
				"Bold",
				"Soft",
				"Rugged",
				"Timeless",
				"Versatile",
				"Sleek",
				"Modern",
				"High-Quality",
			]);
			const typeAdjectives = {
				formal: {
					add: ["Elegant", "Refined", "Classic"],
					remove: ["Durable", "Versatile", "Sleek"],
				},
				costume: {
					add: [],
					remove: ["Durable", "Versatile", "Sleek"],
				},
				athletic: {
					add: ["Breathable", "Flexible", "Sporty"],
					remove: ["Elegant"],
				},
				riding: {
					add: ["Sturdy", "Secure", "Rugged"],
					remove: ["Bold", "Modern"],
				},
				cool: {
					add: ["Iconic", "Popular"],
					remove: ["Comfortable", "Durable"],
				},
				mask: {
					add: ["Concealing", "Mysterious", "Disguised"],
					remove: ["Elegant", "Stylish", "Trendy", "Soft"],
				},
				stealthy: {
					add: ["Silent", "Shadowy", "Tactical"],
					remove: ["Elegant", "Stylish", "Trendy", "Soft", "Modern"],
				},
				swim: {
					add: ["Lightweight", "Hydrodynamic"],
					remove: ["Elegant", "Stylish", "Trendy", "Soft", "Bold", "Modern"],
				},
				diving: {
					add: ["Sealed", "Insulated"],
					remove: ["Elegant", "Stylish", "Trendy", "Soft", "Bold", "Modern"],
				},
			};

			// Remove and add adjectives
			for (const type of discountedClothing.type) {
				const mod = typeAdjectives[type];
				if (!mod) continue;

				if (mod.remove?.length) {
					for (const r of mod.remove) adjectives.delete(r);
				}

				if (mod.add?.length) {
					for (const a of mod.add) adjectives.add(a);
				}
			}

			const randomAjectives = rng.shuffle([...adjectives]).slice(0, 3);

			return `
					<div class="fit">${discountedClothing.name.toUpperFirst()}</div><hr>
					<p>${randomAjectives.join(" • ")}</p>
					<h2>${(rng.either("Now on sale", `${item.discount}% discount`), "Weekly discount")}</h2>
					<h3>Visit the clothing shop now</h3>
				`;
		},
	},
	{
		category: "advertisement",
		repeatable: true,
		id: "adHairSalon",
		priority: 0,
		short: `
			  ${setup.NewspaperImages.ads.shop1}
			  <h1 class="fit">Hair Haven</h1>
			  <hr>
			  <h2>Stylists for men, women & kids</h2>
			`,
	}
);

/* Helper functions for the articles */
