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
		category: "article",
		title: "Crime Rates Down",
		priority: 0,
		short: `Latest figures released by the constabulary indicate a marked drop in minor offences across the Barb Street quarter, a trend authorities attribute to increased patrols.

				Our Chief Inspector praised the support of municipal leadership, noting that "success begins at the top." The Crier's Chariot encourages all residents to continue supporting our peacekeepers.`,
	},
	{
		category: "article",
		id: "soupKitchen",
		condition: () => V.soup_kitchen_known,
		priority: 1,
		title: "Soup Kitchen Opens Early",
		short: `Brother Jordan of the Temple has confirmed the soup kitchen will operate from 6 a.m. all week due to a shipment of preserved lentils from the coast. The public is once again welcomed with open arms, whether it be to receive food or aid in preparation.`,
	},
	{
		category: "article",
		priority: 0,
		title: "Incident at the Arcade",
		short: `Several glass panels were shattered during a disturbance at the Starfish Arcade late Friday evening. Management declined to comment, though witnesses say the guard on duty "did not intervene." The guard has since been reassigned.`,
	},
	{
		category: "article",
		priority: 0,
		title: "Connadatus Market Fire",
		short: `A minor blaze broke out among the market stalls on Connadatus Street early Tuesday. Authorities report no injuries. Fire crews arrived swiftly from the industrial quarter and doused the flames within the hour. No stalls were seriously damaged, though several crates of smoked paprika were lost.`,
	},
	{
		category: "article",
		title: "Whispers from the Bog",
		priority: 0,
		short: `Several travelers claim to have seen faint lights moving between the trees on the edge of the eastern bog. Officials caution against speculation, calling it "seasonal mist."`,
	},
	{
		category: "article",
		title: "Pub cleared of charges",
		priority: 0,
		short: `Following last month's surprise inspection, the Harvest Street pub has been officially cleared of all allegations regarding alleged "non-standard employee practices." The proprietress described the situation as "a regrettable misunderstanding," and thanked her legal team and "certain trusted friends in municipal services."`,
	},
	{
		category: "article",
		title: "Hospital Opens New Wing",
		priority: 0,
		short: `The town hospital on Nightingale Street unveiled a new general care wing. No official announcement preceded the development, and hospital administration has declined to comment, stating only that the area is "under evaluation for specialised care initiatives."
			
			When pressed for details, one staff member, speaking under condition of anonymity, described the area as "not for general patients." The mayor's office referred all inquiries back to hospital officials.`,
	},
	{
		category: "article",
		title: "Mysterious Lights Over the Moor",
		priority: 0,
		short: `Residents on the edge of town have reported strange flickering lights above the moor late Wednesday night. A farmer from the outer farms claims to have seen silhouettes moving without sound."
			
				Town authorities maintain there is no cause for concern and attribute the incident to atmospheric interference. A reporter sent to investigate returned early, citing "bad air and personal unease." The matter is considered closed.`,
	},
	{
		category: "article",
		title: "Crate Delivered to Orphanage",
		priority: 0,
		short: `On Tuesday morning, staff at the Domus Street Orphanage accepted delivery of an unmarked wooden crate with no paperwork and no return address. Witnesses say the crate was brought by a man in a black coat. When asked, the caretaker declined to comment on the contents, stating simply, "No comment." Attempts by The Crier's Chariot to follow up were met with silence and the sound of something heavy being dragged behind a closed door.`,
	},
	{
		category: "article",
		title: "Mayor Unavailable for Comment",
		priority: 0,
		short: `A scheduled public appearance by Mayor Quinn at the Ocean Breeze Café was cancelled without notice. Staff at the café instead offered discounted tea.`,
	},
	{
		category: "article",
		title: "New Locks Installed in town Scool",
		priority: 0,
		short: `In an impressive display of efficiency, new privacy locks have been installed on all changing rooms at the town School. Management assures this is purely preventative and not a response to last month's "incident," which remains unrecorded and unofficial.`,
	},
	{
		category: "article",
		title: "Connadatus Market Quiet",
		priority: 0,
		short: `Foot traffic at Connadatus Street's market stalls has declined sharply. Vendors attribute this to "bad weather," despite clear skies.`,
	},
	{
		category: "article",
		title: "Arcade Announces New Machine",
		priority: 0,
		short: `The popular Starfish Arcade will unveil a new game next week titled Bucket Master II. Officials insist it complies with local decibel regulations.`,
	},
	{
		category: "article",
		title: "Unusual Sounds from the Sewers",
		priority: 0,
		short: `Several reports have emerged of rhythmic thumping from beneath Harvest and Elk streets. City engineers suggest it is likely water pressure. Investigations are not currently scheduled.`,
	},
	{
		category: "article",
		id: "elkClosed",
		title: "Elk Street Shopfront Closed",
		condition: () => !V.adultshopstate || V.adultshopstate === "closed",
		priority: 1,
		short: `After years of half-hearted attempts at commerce, the shuttered shop on Elk Street has been officially sealed. Local children are reportedly less interested now that the windows are no longer breakable.`,
	},
	{
		category: "article",
		id: "forecast",
		title: "New Weather Forecast",
		priority: 3,
		condition: () => V.newspaper.total <= 1,
		short: `Readers will now find a daily weather forecast at the bottom of the front page, offering a convenient glance at expected conditions across the coming eight days. Each day's forecast includes the dominant weather type, as well as the average temperature during daylight hours.
		
			The forecast is prepared by the town's meteorological office, whose continued efforts aim to provide dependable information for everyday planning.`,
	},
	{
		category: "article",
		id: "dogEscape",
		title: "Dogs Escape Starfish Pound",
		priority: 0,
		short: `Chaos erupted on Starfish Street after several aggressive dogs escaped from the local pound, apparently due to a latch malfunction. The animals roamed the beach and adjacent market stalls for over an hour, overturning a lemonade stand and scattering pedestrians. While most of the dogs were eventually rounded up by the pound staff, a couple of them remain unaccounted for. One student was reportedly assaulted during the panic, though no serious injuries were sustained. Pound officials have issued an apology and promised a full review of containment procedures.`,
	},
	{
		category: "article",
		id: "livestockRaid",
		title: "Thugs Raid Livestock Farm",
		priority: 0,
		short: `A farm along the town's eastern fringe was attacked late friday night by a group of thugs. Witnesses describe masked figures setting fire to one of the fields before fleeing across the landscape. No injuries were reported, though livestock were scattered and one cow remains missing. The mayor's office has condemned the incident, and rural patrols have been bolstered in response. The affected farmer described the event as "another reminder that help always comes after the damage is done."`,
	},
	{
		category: "article",
		id: "moorRuins",
		title: "Ruins Emerge in Moor",
		priority: 0,
		short: `A newly exposed section of ruins has been sighted near the edge of the moor, revealed by recent windstorms. The site features stone walls, fragments of carved columns, and an iron-bound door partially buried in mud. Few dare approach the area due to its reputation, but a surveyor reportedly documented the find from a distance. The museum has urged caution and requested that no one attempt to enter or remove objects from the site. A team led by Winter is expected to assess the location later this week.`,
	},
	{
		category: "article",
		id: "policeBreakin",
		title: "Police Building Breached",
		priority: 0,
		short: `An unidentified individual managed to access restricted areas within the Barb Street Police Station earlier this week. Authorities confirmed that a secure terminal was “briefly interacted with” before the suspect evaded capture. The breach has raised renewed concerns about station security, with officials declining to comment on how entry was gained. The individual remains at large, and investigations are ongoing.`,
	},
	{
		category: "article",
		id: "forestMarkings",
		title: "Strange Markings in Forest",
		priority: 0,
		short: `Walkers on the southern forest trail have reported the appearance of spiral symbols carved into trees. Officials dismissed the carvings as vandalism, but advised caution to anyone traveling beyond the lake.`,
	},
	{
		category: "article",
		id: "pillorCleaned",
		title: "Pillory Cleaned After Incident",
		priority: 0,
		short: `Maintenance staff were seen scrubbing the pillory on Cliff Street early Monday morning following what was described as an "enthusiastic punishment session". No comment was offered by the mayor's office. The stocks have since returned to regular use.`,
	},
	{
		category: "article",
		id: "adriftBoat",
		title: "Unmarked Boat Found Adrift",
		priority: 0,
		short: `Workers at the Mer Street docks towed in an empty rowboat discovered floating near the mooring posts late Friday night. The boat bore no registration and was partially filled with damp blankets and what appeared to be a hand-carved wooden spear, wrapped in reeds. The vessel's origin remains unclear.`,
	},
	{
		category: "article",
		id: "lakeLight",
		title: "Strange Light on the Lake",
		priority: 0,
		short: `Campers near the forest lake reported a pale white shimmer rising from beneath the water shortly before midnight. The mayor's office has dismissed the sighting as "natural phosphorescence." Residents are advised not to approach the lakeshore after dark.`,
	},
	{
		category: "article",
		id: "powerOutage",
		title: "High Street Power Outage",
		priority: 0,
		short: `Shoppers were left in the dark thursday evening after a brief but total blackout affected the High Street shopping centre. No explanation has been provided. One clerk claimed the lights returned "faster than they should've."`,
	},
	{
		category: "article",
		id: "townWolves",
		title: "Wolf Howls Near Town",
		priority: 0,
		short: `Several residents along the forest border reported distant howling around midnight. While initially dismissed as wolves, some claim the sound was deeper than expected. Town officials urge residents to avoid forest paths until further notice, though they stress there is no immediate danger.`,
	},
	{
		category: "article",
		id: "landfillFire",
		title: "Fire at Landfill",
		priority: 0,
		short: `A small fire broke out near the centre of the Elk Street landfill, extinguished before it reached any hazardous materials. One worker claimed to see someone running from the scene but gave no further details."`,
	},
	{
		category: "article",
		id: "vanishedBus",
		title: "Nighttime Bus Vanishes",
		priority: 0,
		short: `A town bus departing the Harvest Street station on tuesday evening failed to arrive at its intended stop - or any subsequent stop. Security footage confirms it left on time with four passengers and a single driver aboard.

				Search efforts along the route turned up no signs of wreckage or deviation. The transit authority has suspended all late-night service until further notice, citing "mechanical problems."`,
	},
	{
		category: "article",
		id: "asylumClock",
		title: "Asylum Clock Moves Forward",
		priority: 0,
		short: `Staff at the old forest asylum reported an unexplained shift in the time displayed on the clocktower overlooking the grounds. Though no one touched the mechanism, the hands were found in a different position than the night before, once again ahead of schedule.
			
				Orderlies say the clock has been adjusting itself sporadically for years, always forward, never back. Engineers brought in from town claim the mechanism is intact, albeit weathered, and insist there is no reason it should be moving at all.`,
	}
);
