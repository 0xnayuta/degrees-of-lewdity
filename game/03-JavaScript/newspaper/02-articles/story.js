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
	/* Town projects */
	{
		id: "townProjectBridge",
		category: "article",
		title: "Barb Street Bridge Renewed",
		condition: () => Town.projects.bridge.isComplete,
		priority: 2,
		main: `Mayor Quinn has announced that the Barb Street bridge has finally opened to the public this morning, following its renovation. Spanning the long-drained canal that splits the district, the structure now offers a safer, more dignified crossing for town residents. The renovated design includes widened pedestrian paths and reinforced guardrails intended to reduce accidents.
				
			The completion of the bridge marks a significant achievement for Mayor Quinn, who has once again demonstrated clear-headed leadership and an unwavering commitment to civic progress. Speaking at the ribbon-cutting ceremony, the mayor called the project "a symbol of what can be accomplished when a town dares to believe in itself."

			Though the source of funding remains undisclosed, the Town Hall assures citizens that the budget is secure and that no public funds have been diverted from essential services. Further praise has come from Barb Street residents themselves, many of whom gathered at the canal's edge to witness the first official crossing.`,
		short: `The renovated Barb Street bridge opened this morning, restoring a safer crossing over the long-drained canal with widened paths and reinforced rails. Town Hall maintained that funding remains secure and services unaffected.`,
		image: setup.NewspaperSettings.imgFolder + "articles/bridge.png",
		imagePosition: "right",
		caption: "Bridge over the old canal.",
	},
	{
		id: "lakeRoadOpened",
		category: "article",
		title: "Forest Road to Lake Opens",
		condition: () => Town.projects.road.isComplete,
		priority: 2,
		main: `The new road connecting the town to the forest lake to the south has officially opened to the public, cutting a clear path through the forest and offering a much needed shortcut. The route, which includes a modest bus stop at the lake's edge, has already seen use by students and early morning hikers.
		
			Mayor Quinn, addressing a small crowd at the lake beach, hailed the project as "a victory for access and heritage." The road replaces a series of worn and hazardous footpaths previously used by school students and curious wayfarers.
		
			Local officials note that the area has long lacked reliable infrastructure, with previous visits requiring a detour through muddy trails and dense undergrowth. With the road now complete, both educational trips and tourism to the historic lake are expected to increase.
		
			The mayor's office has taken full credit for the project.`,
		short: `A new shortcut to the southern lake opened this week, replacing hazardous footpaths with a proper roadway and a small bus stop at the lake shore. Officials expect safer trips to the lake and increased visits.`,
		image: setup.NewspaperSettings.imgFolder + "articles/forestRoad.png",
		imagePosition: "right",
		caption: "The new forest road.",
	},
	/* World events */
	{
		category: "article",
		id: "oxfordScience",
		title: "Town Hall to Host School Science Fair",
		condition: () => V.scienceprojectdays >= 1 && V.scienceprojectdays <= 7,
		priority: 2,
		main: () => {
			const mr = C.npc.Leighton.pronoun === "f" ? "Mrs" : "Mr";
			return `Excitement is mounting at Oxford Street School as students gear up for the final stage of this year's Science Fair, scheduled to take place later in theweek at the Town Hall. The event marks the culmination of a 25-day project that has seen students engage in creative problem-solving and practical experiments.

				Under the direction of headteacher ${mr}. Leighton, the Science Fair has become one of the most anticipated events on the school calendar. "While I'm sure the students had fun with their little experiments," ${mr}. Leighton said, "let's not pretend this is groundbreaking science. What matters is that it looks like we're fostering innovation."

				The final round will see the top-scoring student present their projects to a public audience, with attendees including local officials, parents, and science educators from surrounding schools. The judging panel, composed of teachers and guest scientists, will evaluate each entry for creativity, scientific rigor, and clarity of presentation.

				All student projects will be presented together at the Town Hall, where members of the public will have the opportunity to view the full exhibition. Judging will be conducted by headteacher Leighton and the science teacher Sirris, who will assess each project for creativity and clarity of presentation. A grand prize of £500, generously sponsored by the headteacher, will be awarded to the most outstanding project of the evening.`;
		},
		short: () => {
			const mr = C.npc.Leighton.pronoun === "f" ? "Mrs" : "Mr";
			return `Excitement builds as the local school prepares for the final presentations of its much-anticipated Science Fair, set to take place later this coming week at the Town Hall.
		The 25-day project, organised under the guidance of Headteacher Leighton, has drawn participation from across the student body, with curiosity and invention at the fore.

		Finalists will showcase their experiments before a public audience, with the top entry awarded a £500 prize, sponsored by ${mr} Leighton.`;
		},
	},
	/* Museum */
	{
		id: "museumBellStolen",
		category: "article",
		title: () =>
			V.museumAntiques.antiques.antiquebell === "stolen" ? "Religious Artefact Stolen from Museum" : "Attempted Theft of Religious Artefact from Museum",
		condition: () => V.bell_timer === undefined && ["stolen", "museum"].includes(V.museumAntiques?.antiques?.antiquebell),
		priority: 2,
		main: () => {
			const mr = C.npc.Winter.pronoun === "f" ? "Mrs" : "Mr";
			const bellfate =
				V.museumAntiques.antiques.antiquebell === "stolen"
					? "The whereabouts of the perpetrator and the bell, as well as the motive of the attack, remain unknown."
					: `A brave patron of the museum chased down the thief and recovered the bell, returning it to its rightful place to ${mr}. Winter's gratitude.`;
			return `The museum on Oxford Street suffered a bold break-in during opening hours. The sole target of the theft was an iron bell, known in local legends as the 'Sonorous Bell.' This artefact had been recently recovered from the ruins of the castle in the moorlands to the east.

				The identity of the thief remains unknown. ${mr}. Winter, the museum's caretaker, was quoted as saying "Such thefts aren't uncommon. It's a sad fact of life that the respect for history dwindles as it ages in many groups." Witnesses reported a sense of crushing dread as the bell tolled several times during the resulting chase.
				${bellfate}`;
		},
		short: () => {
			const mr = C.npc.Winter.pronoun === "f" ? "Mrs" : "Mr";
			const bellfate =
				V.museumAntiques.antiques.antiquebell === "stolen"
					? "The whereabouts of the perpetrator and the bell, as well as the motive of the attack, remain unknown."
					: `A brave patron of the museum chased down the thief and recovered the bell, returning it to its rightful place to ${mr}. Winter's gratitude.`;
			return `The museum on Oxford Street suffered a bold break-in during opening hours. The sole target of the theft was an iron bell, known in local legends as the 'Sonorous Bell.' This artefact had been recently recovered from the ruins of the castle in the moorlands to the east.

				The identity of the thief remains unknown. ${mr}. Winter, the museum's caretaker, was quoted as saying "Such thefts aren't uncommon. It's a sad fact of life that the respect for history dwindles as it ages in many groups." Witnesses reported a sense of crushing dread as the bell tolled several times during the resulting chase.
				${bellfate}`;
		},
	},
	{
		id: "ivoryNecklaceRecovered",
		category: "article",
		title: "Antique Ivory Necklace Recovered",
		condition: () => ["talk", "museum"].includes(V.museumAntiques?.antiques?.antiqueivorynecklace),
		priority: 2,
		main: () => {
			const mr = C.npc.Winter.pronoun === "f" ? "Mrs" : "Mr";
			const diver =
				V.necklaceThief === "diver"
					? `a contracted diver operating from ${mr}. Winter's newly established field office`
					: `a local student working under ${mr}. Winter`;
			return `Once thought to be a mere legend, an immaculate ivory necklace has at last been found within the temple ruins inside Lake Whiteflower by ${diver}.
			
			Legend holds that the massive sapphire that serves as the ornament's centrepiece was a star that fell from the night sky, into the ocean. It was then swallowed by a whale, which died shortly thereafter. One day, an unfortunate fisherman caught the gemstone alongside some of the whale's bones, and went mad upon seeing his own pale reflection staring back at him. This madness then spurred him into an act of divine inspiration, and the necklace was the result.
			
			In reality, it is agreed upon that the gem was simply an exotic import, although the ivory is now confirmed to indeed be whale bone scrimshaw.
			
			In an unprecedented move, mayor Quinn has purchased the necklace from the museum for use in a personal collection.`;
		},
		short: () => {
			const mr = C.npc.Winter.pronoun === "f" ? "Mrs" : "Mr";
			const diver =
				V.necklaceThief === "diver"
					? `a contracted diver operating from ${mr}. Winter's newly established field office`
					: `a local student working under ${mr}. Winter`;
			return `Once thought to be a mere legend, an immaculate ivory necklace has at last been found within the temple ruins inside Lake Whiteflower by ${diver}.
			
			Legend holds that the massive sapphire that serves as the ornament's centrepiece was a star that fell from the night sky, into the ocean. It was then swallowed by a whale, which died shortly thereafter. One day, an unfortunate fisherman caught the gemstone alongside some of the whale's bones, and went mad upon seeing his own pale reflection staring back at him. This madness then spurred him into an act of divine inspiration, and the necklace was the result.
			
			In reality, it is agreed upon that the gem was simply an exotic import, although the ivory is now confirmed to indeed be whale bone scrimshaw.
			
			In an unprecedented move, mayor Quinn has purchased the necklace from the museum for use in a personal collection.`;
		},
	},
	/* Avery's mansion questline */
	{
		category: "article",
		id: "wishingStones",
		title: "Relic Stolen from the Temple",
		priority: 2,
		short: `A relic was allegedly stolen from the temple last month. Worshippers claim the artefact was the preserved wrist bones of a deceased saint. Independent investigations found no evidence of the relic ever existing, and the temple's claim has been repeatedly discredited by multiple sources.`,
	}
);
