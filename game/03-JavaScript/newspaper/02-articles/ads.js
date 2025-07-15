/*
NOTES:
- NEVER use random() or its derivatives, such as either(), pluck(), or randomFloat()
	Instead, use Newspaper.instance.rngInstance.random() (or its derivatives)
	This is because we use a seeded approach to random, which changes each week (each new newspaper)
- Title, content, image, or caption may either be a string or a function.
- condition is optional, but must be a function. (defaults to always true)
- id is not strictly required, but is highly recommended, in case we want to change the order

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
			console.log("item", item);
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
		id: "ad2",
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
