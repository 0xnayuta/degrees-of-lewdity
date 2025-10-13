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
	},
	{
		category: "article",
		title: "Prison Supply Contract Awarded",
		priority: 0,
		short: `The island prison has awarded a new supply contract for laundry equipment and bedding, officials announced. Delivery is scheduled in stages to minimise disruption.
        
            	The prison remains closed to public visits. No tours are available.`,
	},
	{
		category: "article",
		title: "Faint Lights Above High Street",
		priority: 0,
		short: `Late shoppers on High Street described faint points of light gliding above the shopping centre roof on monday night. Officials attributed the sighting to atmospheric reflections.`,
	},
	{
		category: "article",
		title: "Gas Odour in Industrial Alley",
		priority: 0,
		short: `A reported smell of gas in the industrial alleyways off Elk Street prompted a brief evacuation on tuesday. Engineers traced the source to a corroded valve, now replaced. No injuries were reported.
        
            	Residents are reminded not to light fires near ventilation grates and to report odours immediately.`,
	},
	{
		category: "article",
		title: "Cargo Inspection at Mer Street Docks",
		priority: 0,
		short: `Dock supervisors have begun a week-long inspection of incoming cargo at Mer Street following complaints about missing consignments. Workers are asked to keep identification visible and to use the main gate after dusk.
        
            	Management expects minor delays during unloading while counts are reconciled.`,
	},
	{
		category: "article",
		title: "Hunters Report Wolf Activity",
		priority: 0,
		short: `Several hunters travelling the southern approaches to the lake reported fresh tracks and distant howls before sunrise. Town hall advise walkers to keep to marked paths and to avoid the lake's edge at dusk.
        
            	Officials stress there is no increased risk within town limits.`,
	},
	{
		category: "article",
		title: "Dredging Along Barb Street Canal",
		priority: 0,
		short: `A short section of the old canal on Barb Street will undergo dredging this week to assess silt depth and wall stability. Pedestrians are asked not to lean over the railings during the work window.
        
            	Police cautions that the adjacent footpath can become slippery and advise detours where possible.`,
	},
	{
		category: "article",
		title: "Night Patrols Increased on Starfish Street",
		priority: 0,
		short: `Residents along Starfish Street reported an uptick in evening patrols following complaints of disturbances along the beach and near the dogpound.
        
            	Residents are advised to secure bins and avoid leaving food waste outdoors overnight.`,
	},
	{
		category: "article",
		condition: () => Time.days > 30,
		title: "Red Sheen After Dusk",
		priority: 0,
		short: `Residents across the residential quarter described a subtle red cast on window glass shortly after dusk, most visible on upper panes. Meteorologists cited particulate drift, though the effect was not recorded on street cameras.`,
	},
	{
		category: "article",
		title: "Rare Seagull Sighted",
		priority: 0,
		short: `A seagull with golden plumage was sighted by pedestrians near the promenade on Starfish Street. The rare breed of uncertain origin was first spotted in 1927, and has come to be associated with good luck.`,
	},
	{
		category: "article",
		title: "Rockfall on Cliff Street",
		priority: 0,
		short: `Residents of Barb Street were awoken by a portion of the nearby cliff collapsing into the sea. There were no injuries or property damage. Residents are reminded to keep clear of the cliff edge, and to not enter fenced-off areas.`,
	},
	{
		category: "article",
		title: "Statue Unveiled",
		priority: 0,
		short: `A statue on Cliff Street has been unveiled by mayor Quinn, following its refurbishment. The statue dates back two centuries, and depicts a woodland spirit from folklore.`,
	},
	{
		category: "article",
		title: "False Alarm",
		priority: 0,
		short: `A block of flats on Barb Street was evacuated in the middle of the night, following the triggering of multiple fire alarms. The source of the smoke turned out to be a light soot rising from the old mine. Officials claim the soot is harmless, and the alarms have been adjusted.`,
	},
	{
		category: "article",
		title: "Orphans Paint Mural",
		priority: 0,
		short: `Residents of the orphanage on Domus Street painted a mural to raise money. The orphanage caretaker, Bailey, has praised their creativity, and thanked everyone who donated.`,
	},
	{
		category: "article",
		title: "Party in Disarray",
		priority: 0,
		short: `A party on Danube Street was crashed this week by an unlikely guest. An ape, thought to have escaped from a zoo, swung into the premises from a neighbouring vineyard. None of the zoos nearby have reported a disappearance.`,
	},
	{
		category: "article",
		title: "Noisy Hymns Spark Complaint",
		priority: 0,
		short: `A resident of Wolf Street reported their neighbours to police, claiming they were creating an antisocial clamour. When police arrived to investigate however, they found that the neighbours in question were clergy in the nearby temple. The temple released an apology to the resident, but stated that they were bound by scripture to reach certain decibels.
		
		One priest told us that noise dampeners are being considered, but another stated that "the noise is the point."`,
	},
	{
		category: "article",
		title: "Connudatus Streaker",
		priority: 0,
		short: `A streaker was spotted on Connudatus Street, covered only by fruit snatched from one of the market stalls. The streaker's identity is unknown.
		
		Police want to remind everyone that such behaviour is a criminal offence.`,
	},
	{
		category: "article",
		title: "Drug Raid",
		priority: 0,
		short: `A club on Connudatus Street was raided, and several arrested on suspicion of distributing drugs. The raid comes after a lengthy investigation. Critics point out that such raids have become commonplace, but have done nothing to stop the flow of illicit substances into town.`,
	},
	{
		category: "article",
		title: "Moor Termites Found",
		priority: 0,
		short: `A Lorry was impounded on Harvest Street, following the discovery of a species of termite found on the moor. The stowaways had boarded alongside the crop. Residents are advised to report sightings of unusual creatures, termite or otherwise, to the authorities.`,
	},
	{
		category: "article",
		title: "Mermaid sighting",
		priority: 0,
		short: `A short clip taken on Mer Street has gone viral, appearing to show a humanoid figure with a fish tail swimming not far from the dock. The figure waves, then dives beneath the surface. Comments range from "What else are they hiding from us?" to "It's literally a random swimmer. You just put 'mermaid' in the title and people lost their minds." A statement from the police indicates there will be no investigation.`,
	},
	{
		category: "article",
		title: "Shop Window Shattered",
		priority: 0,
		short: `The window of a charity shop on the high street was shattered overnight. Police have asked for anyone with information to come forward.`,
	},
	{
		category: "article",
		title: "Storm Drain Explodes",
		priority: 0,
		short: `A storm drain "exploded," at least according to eye-witness accounts. The grate was flung several stories into the air, before landing on the roof of the nearby school. According to the mayor's office, such occurrence, while rare, are nothing to worry about.`,
	},
	{
		category: "article",
		title: "Dog Walkers Fined",
		priority: 0,
		short: `Police report an uptick in the number of dog walkers failing to clean up after their charges. They would like to remind dog owners that such behaviour carries a fine of up to £200, and that cleaner streets are better streets.`,
	},
	{
		category: "article",
		title: "Mysterious Graffiti",
		priority: 0,
		short: `Shop owners have complained of a mysterious graffiti appearing on their walls at night. They claim that washing it off is no use, as it'll reappear the following day. Police have suggested concerned residents install their own CCTV.`,
	},
	{
		category: "article",
		title: "Endangered Bats",
		priority: 0,
		short: `An endangered species of bat has found a home along the forest's edge. The diminuative rodent can be seen at dusk, particularly on Wolf Street, skimming along the edge of the forest. Residents are reminded that the bats eat biting insects, and shouldn't be interfered with.`,
	},
	{
		category: "article",
		title: "Survey Team Missing",
		priority: 0,
		short: `A survey team from the capital has been reported missing. They entered the forest last Tuesday on what was supposed to be a day's trip, but haven't been seen since. The police have asked anyone with information to come forward.`,
	},
	{
		category: "article",
		title: "Egg Race Turns Rotten",
		priority: 0,
		short: `An egg race took an ugly turn when a fight broke out. Seven were hospitalised. Criticism of the culture around egg racing has been renewed, with critics pointing out the high rates of substance abuse among enthusiasts.`,
	},
	{
		category: "article",
		title: "New Sea Route Found",
		priority: 0,
		short: `A new safe naval route to town has been discovered, at least according to one captain.
		
		The town is infamously difficult to reach by sea due to the numerous reefs, combined with the violent, unpredictable currents. It is hoped this will cut down on logistical expenses, and lead to fewer accidents off the coast.`,
	},
	{
		category: "article",
		title: "Beach Closed",
		priority: 0,
		short: `A fence has been erected around a small beach east of town, following the disappearance of a swimmer. The beach was popular among locals who wanted somewhere with fewer tourists, but the tall, jagged rocks revealed at low tied have led some to question its safety. The beach is closed until the missing person is found, or the cause of the disappearance determined.`,
	},
	{
		category: "article",
		condition: () => Time.season != "winter",
		title: "Roses Bloom",
		priority: 0,
		short: `A remarkable patch of wild roses has been found on the moor, becoming an impromptu tourist hotspot. The roses span an area half the size of a football pitch.`,
	},
	{
		category: "article",
		title: "Temple Requests Donations",
		priority: 0,
		short: `The temple has announced a request for donations. "It's an old building," said one priest. "It needs constant, expensive, upkeep. It would be a shame if we had to leave it to ruin."
		
		The temple will bless anyone who donates.`,
	},
	{
		category: "article",
		title: "Umbrellas in Fashion",
		priority: 0,
		short: `A strange trend has emerged. Youths sporting umbrellas, regardless of the weather. Headmaster Leighton says there are no regulations governing the sort of patterns pupils can have on their umbrellas, but nonetheless asks parents to ensure that such accessories fit "the spirit of the school uniform."`,
	},
	{
		category: "article",
		title: "Salacious Cabaret",
		priority: 0,
		short: `A club has receive criticism following the launch of a new cabaret act. One critic called it "salacious", and added that it "violates all known standards of decency." The club manager responded by pointing out the many other clubs that would be happy for their custom, if their cabaret didn't suit.`,
	},
	{
		category: "article",
		title: "Harvest Street Roadworks",
		priority: 0,
		short: `Roadworks are being performed on Harvest street. Traffic can proceed, but drivers should be prepared for delays at rush hour.`,
	},
	{
		category: "article",
		title: "Threatre Production Dazzles",
		priority: 0,
		short: `A local theatre troop's rendition of Raul and Janet has drawn critical acclaim, and a standing ovation. This comes after criticism of the troop's use of a tamer version of the story.`,
	},
	{
		category: "article",
		title: "Dog Attack",
		priority: 0,
		short: `Concern about the number of stray dogs in town resurfaced after a resident was attacked. Residents are advised to report dangerous animals to the pound on Mer Street, `,
	},
	{
		category: "article",
		title: "Who Killed the Tulips?",
		priority: 0,
		short: `Park groundskeepers have discovered a series of shocking decapitations among the tulips. They ask pedestrians to keep their dogs on leads near the flowers.`,
	},
	{
		category: "article",
		title: "Rogue Clown on Loose!",
		priority: 0,
		short: `A teacher from the local school has been dressing like a clown after hours, to raise money for charity. The teacher's identity is concealed by a big red nose, but they've been sighted in and around the park, performing tricks and stunts.`,
	},
	{
		category: "article",
		title: "Wolves Sighted",
		priority: 0,
		short: `Wolves in the nearby forest usually keep to themselves, but reports to the police are on the rise. Residents are advised to stay away from any wild animals from the forest, and to contact police, rather than the local pound, if they cause any problems. The pound is equipped for dogs, not wolves.`,
	},
	{
		category: "article",
		title: "Not in My Backyard",
		priority: 0,
		short: `Plans for a series of windmills in the farmlands east of town have been thwarted, following protests by residents, who suggested an off-shore site instead. The mayor was not available for comment.`,
	},
	{
		category: "article",
		title: "Naval Remembrance",
		priority: 0,
		short: `A remembrance ceremony is being held at the town hall to honour those lost in the disappearance of the SS Nemo off the coast of town. It's the largest vessel to ever legally land at the town's dock`,
	},
	{
		category: "article",
		title: "Spider Infestation",
		priority: 0,
		short: `It's normal to find spider nests in your loft, but one resident of Danube Street was disturbed to find a nest numbering in the tens of thousands. Specialists were called in, and the nest dealt with without causing trouble for neighbours. The spiders weren't available for comment.`,
	},
	{
		category: "article",
		title: "New Bakery Opens",
		condition: () => V.chef_state === 9,
		priority: 0,
		short: `A new bakery has opened, hoping to take advantage of the town's growing reputation for cream buns. It's not known how they intend to separate themselves from the pack, but with the town's thriving tourism and baking industries, perhaps it's not necessary.`,
	},
	{
		category: "article",
		title: "Robbery at Amusements",
		priority: 0,
		short: `A claw machine at the amusements on Starfish Street has been broken into, and the contents absconded with. The monetary value of the theft is low, and police suspect a crime of passion.`,
	},
	{
		category: "article",
		title: "Ruin Refurbishment",
		priority: 0,
		short: `The remains of the old wall on Cliff Street are being renovated. Residents are reminded that damaging any of the ruins around town is a crime, punishable with up to two years in prison. Removing stones counts as inflicting damage.`,
	},
	{
		category: "article",
		title: "Shark Scare",
		priority: 0,
		short: `A large shark was allegedly seen near the beach. This sighting has not been confirmed however, and the Board of Tourism wants to inform visitors that man-eating sharks have never been found in nearby waters.`,
	},
	{
		category: "article",
		title: "Water Rationing Considered",
		condition: () => Time.monthName === "August",
		priority: 0,
		short: `The mayor's office is considering a water ration, due to the extended heat. Residents are advised to be sparing with their use of water, particularly in gardens.`,
	},
	{
		category: "article",
		title: "Moonlit Vigil",
		condition: () => Time.monthName === "October",
		priority: 0,
		short: `A moonlit vigil is to be held at the old churchyard, by adherants of "the old religion." The churchyard is managed by the temple clergy. They have refused to comment.`,
	},
	{
		category: "article",
		title: "Firework Warning",
		condition: () => Time.monthName === "November",
		priority: 0,
		short: `Many residents have been shocked to receive letters from the mayor's office, reminding them that fireworks are not to be launched after 10pm.`,
	},
	{
		category: "article",
		title: "Dangerous Waters",
		condition: () => Time.monthName === "December",
		priority: 0,
		short: `Residents and visitors alike should be advised that the water is particularly dangerous at this time of year, and to excercise caution when going for a swim. If in doubt, remain within the boundaries set by lifeguards.`,
	},
	/* Based on increased world corruption */
	{
		category: "article",
		condition: () => V.world_corruption_soft >= 20,
		title: "Whispers in the Connadatus Tunnels",
		priority: 0,
		short: `Stallholders on Connadatus Street complained of faint whispers rising through drain grates after closing. Engineers chalked the reports up to air pressure shifts.
        
            	Several traders say the voices fall silent the moment lids are lifted.`,
	},
	{
		category: "article",
		condition: () => V.world_corruption_soft >= 20,
		title: "Lantern Seen Beneath the Lake",
		priority: 0,
		short: `Travelers wandering the forest lake before sunrise described a single lantern moving under the surface, drifting parallel to the shore. There were no boats and no ripples, only a dim glow that vanished near the submerged ruins.`,
	},
	{
		category: "article",
		condition: () => V.world_corruption_soft >= 20,
		title: "Pillory Chains Rattle at Noon",
		priority: 0,
		short: `Cliff Street shopkeepers reported a brief rattle of chain from the pillory precisely at noon, with no one nearby. A seabird took flight and the sound ceased.
        
            	The mayor's office dismissed the event as a gust of wind — though the flags outside their building, just three blocks away, reportedly hung still throughout`,
	},
	{
		category: "article",
		condition: () => V.world_corruption_soft >= 20,
		title: "Shadows Cross Oxford Street Roofs",
		priority: 0,
		short: `Several students observed a line of shadows crossing the Oxford Street rooftops against the sun's direction. The shapes were narrow, like chimney stacks on the move, and left the pavement cold beneath for minutes after.`,
	},
	{
		category: "article",
		condition: () => V.world_corruption_soft >= 20 && Town.projects.bridge.isComplete,
		title: "Silt Writes Names in the Canal",
		priority: 0,
		short: `Following recent rain, shallow water receded from the mostly drained canal, revealing patterns in the exposed silt beneath the new footbridge, loosely spelling several surnames.
		
				A town official who noticed the markings reportedly erased them, yet a new set appeared hours later, different and incomplete. Town hall has not yet issued a statement.`,
	},
	{
		category: "article",
		condition: () => V.world_corruption_soft >= 20,
		title: "Red Edge to the Moon",
		priority: 0,
		short: `Amateur observers noted a faint rim of red on the moon's lower edge during last full-moon. A veil of thin cloud was blamed, though the air remained still and stars were plainly visible above and below.`,
	},
	{
		category: "article",
		title: "Homeowner Complaints",
		condition: () => V.world_corruption_soft >= 20,
		priority: 0,
		short: `Residents of Elk Street have sent an official complaint to the mayor's office, after finding the value of their homes drop due to their proximity to the landfill.
		
		"It shouldn't smell that bad," said one resident. "Someone's putting something there they ought'nt." The mayor's office is yet to respond.`,
	},
	{
		category: "article",
		condition: () => V.world_corruption_soft >= 40,
		title: "Unmarked Van Seen Near School",
		priority: 1,
		short: `Caretakers of the school grounds reported an unmarked white van idling with lights off near the rear gate after dismissal. The vehicle left when approached and did not return during the evening sweep.
        
            	Students are reminded to use the main entrance and to report suspicious activity to staff immediately.`,
	},
	{
		category: "article",
		condition: () => V.world_corruption_soft >= 40,
		title: "Pale Things Along the Canal",
		priority: 0,
		short: `A caretaker working the old Barb Street canal claims to have seen white shapes clinging inside a grate at low water, withdrawing as his lantern neared. Engineers inspecting the bars found scrape marks on the inner side only.`,
	},
	{
		category: "article",
		condition: () => V.world_corruption_soft >= 40,
		title: "Wharf Lights Fail in Sequence",
		priority: 0,
		short: `At Mer Street, a row of lamps failed one by one from the seaward end, then relit in reverse order without intervention. Dockworkers paused unloading while the phenomenon ran its course.`,
	},
	{
		category: "article",
		condition: () => V.world_corruption_soft >= 40,
		title: "Knocks Beneath Cliff Street",
		priority: 0,
		short: `Shopkeepers on Cliff Street reported three knocks sounding from below the paving stones at closing time. The pillar outside the town hall trembled once, then stood still.`,
	},
	{
		category: "article",
		condition: () => V.world_corruption_soft >= 40,
		title: "Missing Posters Swapped Overnight",
		priority: 0,
		short: `Posters for two missing orphans along High Street were found replaced with blank paper overnight. Several shopkeepers confirmed the posters were intact at closing time. By morning, new sheets had appeared bearing faint impressions, as if the images had been erased rather than removed.`,
	},
	{
		category: "article",
		condition: () => V.world_corruption_soft >= 40,
		title: "Dragmarks in the Industrial Alley",
		priority: 0,
		short: `Security on Harvest Street reported a scuff trail that began at a shuttered loading bay and ended at a culvert gate, with no prints in between. A padlock was found inside the grate, hooked closed from within.`,
	},
	{
		category: "article",
		condition: () => V.world_corruption_soft >= 40,
		title: "Footsteps Over Domus Roofs",
		priority: 0,
		short: `Residents on Domus Street heard a measured crossing over slate roofs that did not disturb the frost. A glimpse of white fabric was reported at the alley turn, described as “a sheet with a shape to it,” gone by the second glance.`,
	},
	{
		category: "article",
		condition: () => V.world_corruption_soft >= 40,
		title: "Arcade Mirrors Hold After Closing",
		priority: 0,
		short: `Night staff at the Starfish Arcade reported cabinet mirrors that continued to reflect silhouettes after the building had emptied. The images did not align to the corridor and could not be approached.`,
	},
	{
		category: "article",
		condition: () => V.world_corruption_soft >= 40,
		title: "Straps Found at Bus Stop",
		priority: 1,
		short: `A set of worn leather straps was found at a shelter off Cliff Street, neatly looped and threaded through the bench slats. No owner has come forward. The transit authority removed them and declined further comment.`,
	},
	{
		category: "article",
		condition: () => V.world_corruption_soft >= 40,
		title: "Low Singing From the Sewers",
		priority: 0,
		short: `Residents near the park reported a low, wordless singing rising through gratings between two and three in the morning. The tone held steady until a distant bell note was heard, after which the sound folded into silence.`,
	},
	{
		category: "article",
		condition: () => V.world_corruption_soft >= 40,
		title: "Low Singing From the Sewers",
		priority: 0,
		short: `Residents near the park reported a low, wordless singing rising through gratings between two and three in the morning. The tone held steady until a distant bell note was heard, after which the sound folded into silence.`,
	}
);
