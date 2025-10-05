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
			let result = `The museum on Oxford Street suffered a bold break-in during opening hours. The sole target of the theft was an iron bell, known in local legends as the 'Sonorous Bell.' This artefact had been recently recovered from the ruins of the castle in the moorlands to the east.

				The identity of the thief remains unknown. ${mr}. Winter, the museum's caretaker, was quoted as saying "Such thefts aren't uncommon. It's a sad fact of life that the respect for history dwindles as it ages in many groups." Witnesses reported a sense of crushing dread as the bell tolled several times during the resulting chase.`;
			if (V.museumAntiques.antiques.antiquebell === "stolen") {
				result += `The whereabouts of the perpetrator and the bell, as well as the motive of the attack, remain unknown.`;
			} else {
				result += `A brave patron of the museum chased down the thief and recovered the bell, returning it to its rightful place to ${mr}. Winter's gratitude.`;
			}
			return result;
		},
		short: () => {
			const mr = C.npc.Winter.pronoun === "f" ? "Mrs" : "Mr";
			let result = `The museum on Oxford Street suffered a bold break-in during opening hours. The sole target of the theft was an iron bell, known in local legends as the 'Sonorous Bell.' This artefact had been recently recovered from the ruins of the castle in the moorlands to the east.

				The identity of the thief remains unknown. ${mr}. Winter, the museum's caretaker, was quoted as saying "Such thefts aren't uncommon. It's a sad fact of life that the respect for history dwindles as it ages in many groups." Witnesses reported a sense of crushing dread as the bell tolled several times during the resulting chase.`;
			if (V.museumAntiques.antiques.antiquebell === "stolen") {
				result += `The whereabouts of the perpetrator and the bell, as well as the motive of the attack, remain unknown.`;
			} else {
				result += `A brave patron of the museum chased down the thief and recovered the bell, returning it to its rightful place to ${mr}. Winter's gratitude.`;
			}
			return result;
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
		condition: () => V.auriga_artefact === "Avery",
		main: `A relic was allegedly stolen from the temple last month. A temple spokesperson claims the artefact was the preserved wrist bones of a deceased saint, and he culprit is a deprived youth from the orphanage on Domus Street.
		
			According to the temple, the relic gives strength to whoever possesses it, and has been held by the temple for centuries. However, independent investigations found no evidence of the relic ever existing, and the police have released a statement confirming that no evidence of theft has been found.
			
			We contacted the orphanage caretaker, Bailey, who had this to say:
			"I have a lot of respect for the temple, but if they believe one of my wards to be responsible for this theft, they are mistaken. The orphanage fosters a caring and supportive environment antithetical to such sacrilege. I wish the temple luck in their search."
			
			The temple has yet to comment on Bailey's response.`,
		short: `A relic was allegedly stolen from the temple last month. Worshippers claim the artefact was the preserved wrist bones of a deceased saint. Independent investigations found no evidence of the relic ever existing, and the temple's claim has been discredited by multiple sources.`,
	},
	{
		category: "article",
		id: "tower_built_1",
		title: "Skyscraper To Be Built",
		priority: 2,
		condition: () => V.avery_tower && V.avery_tower.stage === 1,
		main: `Elk Industries announced the construction of a skyscraper, following a fierce political battle to remove regulations on the height of buildings. 

		These regulations date back centuries, originally implemented due to religious pressure. They've been relaxed over the years, but their removal has prompted criticism from the temple and more conservative citizens, who maintain that such buildings are forbidden by scripture.
		
		CFO of Elk Industries, Avery, has been described as the force behind the building's construction. We asked Avery for comment:
		"The temple is free to follow its own rules, but it cannot expect others to conform. This is a wonderful town, hamstrung by red tape and dogma. Elk Industries will bring jobs and wealth in, as long as it can construct freely."
		
		The ambitious construction is to be built on Elk Street, and is set to dwarf every other in town when finished.`,
		short: `The construction of a skyscraper has been announced, following the removal of regulations forbidding taller buildings.`,
	},
	{
		category: "article",
		id: "tower_built_2",
		title: "New Skyscraper Amazes",
		priority: 2,
		condition: () => V.avery_tower && V.avery_tower.stage === 2,
		main: `The controversial Elk Industries skyscraper became the centre of attention this week, and it isn't even finished. A prolific human rights activist from London visited town, and called the construction an "eyesore."

		"They're draining the town dry." The activist said when asked for a comment. "I've seen it before, time and again. They say they give back, but they never do. They just dress up in strange outfits and perform rituals."

		"It's envy," responds Avery, CFO of Elk Industries and the brains behind the construction. "They can't imagine building something like this, so they try to stop those who can. This town languished in an economic slump for decades, and we've my company, along with mayor Quinn's foresight, to thank for fixing it."
		
		The temple has released a statement in support of the human rights activist.`,
		short: `Construction of the Elk Industries skyscraper has attracted renewed criticism this week, following a comment by a prolific human rights activist.`,
	},
	{
		category: "article",
		id: "tower_built_3",
		title: "New Skyscraper Finished",
		priority: 2,
		condition: () => V.avery_tower && V.avery_tower.stage === 3 && !V.avery_fate,
		main: `The town's first skyscraper has been completed, intended to serve as the headquarters of Elk Industries. An opening ceremony is to be held, but the date is yet to be decided.
		
		CFO of Elk Industries, Avery, has gone on record referring to it as "their" skyscraper. We asked them for comment:
		"The construction would not have gone ahead without me, that much is true. This town has been very good to me. I pushed for the construction hoping to give something back, and I want to thank everyone involved for making it a reality. This building marks the dawn of a new era of prosperity for the town."
		
		Not all are happy however, with complaints ranging from an alleged violation of temple scripture, to the claim that it ruins the town's skyline.`,
		short: `The town's first skyscraper has been completed.	Detractors have called it an "eyesore", and "irreligious," while others have claimed it marks the dawn of a new era of prosperity for the town. An opening ceremony is to be held, the date yet to be decided.`,
	},
	{
		category: "article",
		id: "avery_fate_ascended",
		title: "Skyscraper Opening Stuns",
		priority: 2,
		condition: () => V.avery_fate === "ascended",
		main: `A ceremony was held to officially open the town's new, and first, skyscraper. The guestlist included the mayor, as well as many visitors from out of town. Avery, CFO of Elk Industries, gave a short speech:
		"Thank you all for joining me. I recognise many of you from outside town. I remember how I felt when I arrived ten years ago, I thought I'd made a mistake. But I made my fortune here. And there's more to be had. Much more. Here's to the future."
		
		Avery's speech, and the lack of locals invited to the party, has prompted renewed criticism of Elk Industries. Detractors claim they build "enclaves", and hire few locals, exploiting the town's infrastructure and resources while giving nothing in return. Elk Industries maintains that they invest in the town, and point out that many of the local farms produce for them directly.
		
		Mayor Quinn backs up the company. According to the mayor, the Danube spa, as well as other luxury locations, have benefited considerably from their acquisition by Elk Industries.`,
		short: `A ceremony was held to officially open the town's new, and first, skyscraper. Mayor Quinn was in attendance, as well as many vistors from out of town.`,
	},
	{
		category: "article",
		id: "skyscraper_protest_ascended",
		title: "Protest Outside Skyscraper",
		priority: 2,
		condition: () => V.avery_fate === "ascended",
		main: `A protest outside the new skyscraper reached its zenith after weeks of persistent action. One allged member of the temple broke into the building, wearing rolls of toilet paper. According to multiple eyewitnesses, the protester stated a "pillar of fire" would claim the building. Security handed them to police, who released them with a warning. We were unable to find the culprit for comment.
		
		According to the temple, the aforementioned protester was an employee of Elk Industries, meant to discredit their protest. Elk Industries released a statement denouncing the temple's claim as a conspiracy theory.
		
		The rest of the protest was peaceful, and dispersed following the end of the opening ceremony.`,
		short: `A protest outside the new skyscraper has drawn attention, thanks in part to one alleged member of the temple who broke into the building to harass people during the party. The temple claims no connection with this individual.`,
	},
	{
		category: "article",
		id: "avery_fate_fallen",
		title: "Tragedy at Skyscraper Opening",
		priority: 2,
		condition: () => V.avery_fate === "fallen" || V.avery_fate === "kicked",
		main: `Tragedy struck at the opening ceremony of the town's first skyscraper. A fire broke out, believed to have been caused by faulty wiring. A number of people were present during the fire, including the skyscraper's owner and CFO, Avery.
		
		Hospital staff confirm a few dozen injuries, but we've been unable to ascertain an exact casuality count. There are conflicting reports of individuals wearing unmarked uniforms taking bags away from the scene. A police spokesperson has dismissed these reports as hysteria.
		
		The mayor's office released a statement, describing the fire as an "unforseeable tragedy", and praising the town's firefighters:
		"This unforeseeable tragedy has shaken me to my core. I gave a speech at the opening ceremony, and could have been there when the fire broke out, had I not been drawn away by my mayoral duties. I take solace in the bravery of our town's firefighters, without whom this inferno could have claimed more than a single building. My thoughts and prayers are with those affected, and their families."
		
		The same night, a fire erupted in CFO Avery's home on Danube Street. Avery is not thought to have been present, but their current whereabouts, and the cause of the fire, are unknown. Police do not believe the two fires are related, but have requested anyone with information come forward.`,
		short: `Tragedy struck at the opening ceremony of the town's first skyscraper. A fire broke out, believed to have been caused by falty wiring. A number of people were present during the fire, including the skyscraper's owner and CFO of Elk Industries, Avery. Casualty reports are conflicting, but hospital staff confirm dozens of injured.`,
	},
	{
		category: "article",
		id: "skyscraper_protest_fallen",
		title: "Protest Boils Over",
		priority: 2,
		condition: () => V.avery_fate === "fallen" || V.avery_fate === "kicked",
		main: `A protest against the skyscraper's construction reached boiling point, following weeks of persistent action by temple adherents.
		
		Several were injured in a clash between protesters and security personnel, shortly after one protester broke through security and harassed people within the building. Multiple eyewitnesses claim the protester stated a "pillar of fire" would take the building. That same evening, a fire would indeed break out. This protester has been charged with breaking and entering, and several others have been questioned. Despite this, a police spokesperson has stated that no link between the protest and fire has been established.
		
		According to the temple, the troublemakers are not part of their order. They released a statement comdemning all violence, and claiming a strict adherence to the law.`,
		short: `Several injured as a protest against the skyscraper's construction reached boiling point. Police have charged one protester, and questioned several others, but no link with the recent fire has been established.`,
	},
);
