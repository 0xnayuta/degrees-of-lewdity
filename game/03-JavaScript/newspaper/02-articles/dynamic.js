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
		id: "severeHeat",
		repeatable: true,
		condition: () => {
			const baseDate = new DateTime(V.newspaper.date);
			return V.newspaper.forecast.some(({ avgTemp }, i) => {
				const date = new DateTime(baseDate).addDays(i);
				return Weather.Temperature.extremeTemperature(avgTemp - 3, date) > 0;
			});
		},
		title: () => {
			const date = new DateTime(V.newspaper.date);
			const high = Weather.genSettings.months[date.month - 1].temperatureRange.average[1];
			const hardLimit = 30;
			const rng = Newspaper.instance.rngInstance;

			// Skip day 0 and capture indices
			const days = V.newspaper.forecast.slice(1).map((d, i) => ({ ...d, i: i + 1 }));
			const hardDays = days.filter(d => d.avgTemp > hardLimit);
			const normDays = days.filter(d => d.avgTemp > high && d.avgTemp <= hardLimit);

			const seg = i => (i >= 6 ? "Weekend" : i <= 2 ? "Early Week" : i <= 4 ? "Midweek" : "Late Week");

			if (hardDays.length >= 3) {
				const i = hardDays[0].i;
				const choice = rng.either("Heatwave Expected", "Extreme Heat Expected", "Scorching Heatwave");
				return `${seg(i)} ${choice}`;
			}

			if (hardDays.length === 2) {
				const parts = [...new Set(hardDays.map(d => seg(d.i)))];
				if (parts.length === 1) {
					const choice = rng.either("Two-day Heatwave", "Two-day Heat Surge", "Dual Heat Spike");
					return `${parts[0]} ${choice}`;
				} else {
					const choice = rng.either("Two-Day Heatwave This Week", "Heat Surge Over Two Days");
					return choice;
				}
			}

			if (hardDays.length === 1) {
				const { avgTemp, i } = hardDays[0];
				const choice = rng.either("Heat Spike of", "Heat Burst of", "Heat Surge of");
				return `${seg(i)} ${choice} ${Math.round(avgTemp)}°C`;
			}

			if (normDays.length >= 3) {
				const i = normDays[0].i;
				const choice = rng.either("Unseasonably Warm Spell", "Unusually Warm Spell", "Mild Heat Trend");
				return `${seg(i)} ${choice}`;
			}

			if (normDays.length === 2) {
				const parts = [...new Set(normDays.map(d => seg(d.i)))];
				if (parts.length === 1) {
					const choice = rng.either("Unseasonably Warm Days", "Notably Warm Days");
					return `${parts[0]} ${choice}`;
				} else {
					const choice = rng.either("Two Unseasonably Warm Days", "Warm Conditions for Two Days");
					return choice;
				}
			}

			if (normDays.length === 1) {
				const { avgTemp, i } = normDays[0];
				const dev = avgTemp - high;
				const sev =
					dev >= 10
						? rng.either("Notable Warmth", "Marked Warmth")
						: dev >= 5
						? rng.either("Slight Warmth", "Mild Warmth")
						: rng.either("Subtle Warmth", "Gentle Warmth");
				return `${seg(i)} ${sev}`;
			}

			const fallback = rng.either("Warm Weather Expected", "Pleasantly Warm Forecast", "Moderate Temperatures Ahead");
			return fallback;
		},

		priority: 1,
		short: () => {
			const date = new DateTime(V.newspaper.date);
			const averageTemp = Weather.genSettings.months[date.month - 1].temperatureRange.average[1];
			const rng = Newspaper.instance.rngInstance;

			const { hard, norm } = V.newspaper.forecast
				.slice(1)
				.map(({ avgTemp, type }, j) => ({ avgTemp, type, i: j + 1 }))
				.reduce(
					(acc, d) => {
						if (d.avgTemp > 30) acc.hard.push(d);
						else if (d.avgTemp > averageTemp) acc.norm.push(d);
						return acc;
					},
					{ hard: [], norm: [] }
				);

			if (!hard.length && !norm.length) return "";

			const primary = hard.length ? hard : norm;
			const isHard = !!hard.length;
			const first = primary[0];
			const firstDay = new DateTime(date).addDays(first.i).weekDayName;

			const heatDesc = [
				["concerning heatwave", "alarming heatwave", "intense heatwave"],
				["extreme heat", "severe heat", "significant heat"],
				["brief heat spike", "short heat burst", "quick heat surge"],
			];
			const normDesc = [
				["an unseasonably warm spell", "an unusually warm stretch", "a mild heat trend"],
				["notable warmth", "marked warmth", "distinct warmth"],
				["a slightly warm day", "a mildly warm day", "a gentle warmth"],
			];
			const descriptor = isHard
				? rng.either(...heatDesc[Math.min(primary.length - 1, 2)])
				: rng.either(
						...(primary.length > 2
							? normDesc[0]
							: primary.length === 2
							? normDesc[1]
							: primary.length === 1
							? normDesc[2]
							: ["warm weather", "pleasant warmth", "balmy conditions"])
				  );

			const firstTemp = V.newspaper.forecast[first.i].avgTemp;
			const tempString = Weather.toSelectedString(firstTemp, 0);
			const tempText = rng.either(
				rng.either(`, reaching an average of ${tempString}`, `, with averages near ${tempString}`, `, averaging around ${tempString}`),
				""
			);

			const weatherOpts = {
				0: ["clear skies", "sunny skies", "bright skies"],
				1: ["light clouds", "mostly sunny skies"],
				2: ["heavy clouds", "overcast skies", "cloudy conditions"],
				3: [`light rain`, `scattered rain`, `sporadic rain`],
				4: [`heavy rain`, `steady rain`, `driving rain`],
				5: ["storm", "thunderstorms", "severe storms"],
			};
			const weatherDesc = rng.either(...weatherOpts[first.type]);

			const indexes = primary
				.map(d => d.i)
				.slice(1)
				.sort((a, b) => a - b);
			let extra = "";
			if (indexes.length) {
				if (indexes.every(i => i >= 6)) extra = rng.either("during the weekend", "over the weekend");
				else if (indexes.every(i => i <= 2)) extra = rng.either("at the start of the week", "early in the week");
				else if (indexes.every(i => i <= 4)) extra = rng.either("midweek", "in the middle of the week");
				else if (indexes.every(i => i === 5)) extra = rng.either("toward the end of the week", "later in the week");
				else if (indexes.every((v, i, a) => !i || v === a[i - 1] + 1)) {
					const days = [indexes[0], indexes.at(-1)].map(i => new DateTime(date).addDays(i).weekDayName);
					extra = `from ${days[0]} to ${days[1]}`;
				} else {
					extra = indexes.map(i => new DateTime(date).addDays(i).weekDayName).join(indexes.length > 2 ? ", " : " and ");
				}
				extra = rng.either(
					`, and continuing ${isHard ? "hot weather" : "warm temperatures"} ${extra}.`,
					`; expect ${isHard ? "more heat" : "continued warmth"} ${extra}.`
				);
			} else {
				extra = ".";
			}

			const lead = rng.either(
				"The town is expected to experience",
				"Forecasts indicate",
				"This week's forecast suggests",
				"The upcoming week may bring",
				"Conditions are expected to turn",
				"Forecasters predict"
			);
			let summary = `${lead} ${descriptor}${tempText}` + rng.either(` and ${weatherDesc}`, "") + ` on ${firstDay}${extra}`;

			if (isHard && first.type > 2) {
				summary += " Extreme heat combined with heavy rain is highly unusual.";
			}

			const advice = isHard
				? rng.either(
						"Residents are advised to limit outdoor activity during peak hours and stay hydrated.",
						"People should seek shade, hydrate frequently, and avoid outdoor exertion."
				  )
				: "";

			return `${summary}\n\n${advice}The town's meteorological office assures the public that conditions are being closely monitored.`;
		},
	},
	{
		category: "article",
		id: "severeCold",
		repeatable: true,
		condition: () => {
			const baseDate = new DateTime(V.newspaper.date);
			return V.newspaper.forecast.some(({ avgTemp }, i) => {
				const date = new DateTime(baseDate).addDays(i);
				return Weather.Temperature.extremeTemperature(avgTemp + 3, date) < 0;
			});
		},
		title: () => {
			const date = new DateTime(V.newspaper.date);
			const low = Weather.genSettings.months[date.month - 1].temperatureRange.average[0];
			const arr = V.newspaper.forecast;
			const hardLimit = -18;
			const rng = Newspaper.instance.rngInstance;

			// collect days after the first (skip index 0)
			const days = arr.slice(1).map((d, i) => ({ ...d, i: i + 1 }));
			const hardDays = days.filter(d => d.avgTemp < hardLimit);
			const normDays = days.filter(d => d.avgTemp < low && d.avgTemp >= hardLimit);

			const seg = i => (i >= 6 ? "Weekend" : i <= 2 ? "Early Week" : i <= 4 ? "Midweek" : "Late Week");

			// 3+ very cold days
			if (hardDays.length >= 3) {
				const i = hardDays[0].i;
				return `${seg(i)} ` + rng.either("Severe Cold Expected", "Bitter Cold Warning", "Arctic Chill Incoming");
			}

			// exactly 2 very cold days
			if (hardDays.length === 2) {
				const parts = [...new Set(hardDays.map(d => seg(d.i)))];
				return parts.length === 1
					? `${parts[0]} ` + rng.either("Two-Day Cold Snap", "Cold Surge")
					: rng.either("Two-Day Cold Snap This Week", "Cold Surge Over Two Days");
			}

			// 3+ mildly cold days
			if (normDays.length >= 3) {
				const i = normDays[0].i;
				return `${seg(i)} ` + rng.either("Unseasonably Cold Spell", "Unusually Cold Spell", "Extended Chill");
			}

			// exactly 2 mildly cold days
			if (normDays.length === 2) {
				const parts = [...new Set(normDays.map(d => seg(d.i)))];
				return parts.length === 1
					? `${parts[0]} ` + rng.either("Unseasonably Cold Days", "Notable Chill Days")
					: rng.either("Two Unseasonably Cold Days", "Cool Conditions for Two Days");
			}

			// exactly 1 mildly cold day
			if (normDays.length === 1) {
				const { avgTemp, i } = normDays[0];
				const dev = low - avgTemp;
				const sev =
					dev >= 10
						? rng.either("Unusual Cold", "Unseasonably Chill")
						: dev >= 5
						? rng.either("Temperature Dip", "Chill Settles In")
						: rng.either("Slight Cold", "Mild Chill");
				return `${seg(i)} ${sev}`;
			}

			// fallback when no cold days detected
			return rng.either("Cold Weather Expected", "Brisk Conditions Ahead", "Cooler Temperatures Ahead");
		},

		priority: 1,
		short: () => {
			const date = new DateTime(V.newspaper.date);
			const averageTemp = Weather.genSettings.months[date.month - 1].temperatureRange.average[0];
			const rng = Newspaper.instance.rngInstance;

			const { hard, norm } = V.newspaper.forecast
				.slice(1)
				.map(({ avgTemp, type }, j) => ({ avgTemp, type, i: j + 1 }))
				.reduce(
					(acc, d) => {
						if (d.avgTemp < -18) acc.hard.push(d);
						else if (d.avgTemp < averageTemp) acc.norm.push(d);
						return acc;
					},
					{ hard: [], norm: [] }
				);

			if (!hard.length && !norm.length) return "";

			const primary = hard.length ? hard : norm;
			const isHard = hard.length > 0;
			const first = primary[0];
			const count = primary.length;
			const firstDay = new DateTime(date).addDays(first.i).weekDayName;

			const coldDesc = [
				["concerning cold snap", "alarming cold snap", "intense chill"],
				["severe cold", "bitter cold", "extreme chill"],
				["brief cold snap", "short freeze", "quick chill"],
			];
			const normDesc = [
				["unseasonably cold spell", "unusually cool stretch", "mild chill trend"],
				["notable chill", "marked chill", "distinct cool"],
				["slightly cool day", "mildly cool day", "gentle chill"],
			];
			const fallback = ["cool weather", "pleasant coolness", "brisk conditions"];
			const descriptor = isHard
				? rng.either(...coldDesc[Math.min(count - 1, 2)])
				: rng.either(...(count > 2 ? normDesc[0] : count === 2 ? normDesc[1] : count === 1 ? normDesc[2] : fallback));

			const minTemp = Math.round(Math.min(...primary.map(d => d.avgTemp)));
			const tempString = Weather.toSelectedString(minTemp, 0);
			const tempText = rng.either(rng.either(`, dropping to ${tempString}`, `, with lows near ${tempString}`, `, dipping around ${tempString}`), "");

			const fall = minTemp > 0 ? "rain" : "snow";
			const weatherOpts = {
				0: ["clear skies", "sunny skies", "bright skies"],
				1: ["light clouds", "mostly sunny skies"],
				2: ["heavy clouds", "overcast skies", "cloudy conditions"],
				3: [`light ${fall}`, `scattered ${fall}`, `sporadic ${fall}`],
				4: [`heavy ${fall}`, `steady ${fall}`, `driving ${fall}`],
				5: minTemp > 0 ? ["storm", "thunderstorms", "severe storms"] : ["snowstorm", "blizzard", "severe snowstorm"],
			};
			const weatherDesc = rng.either(...weatherOpts[first.type]);

			const indexes = primary
				.map(d => d.i)
				.slice(1)
				.sort((a, b) => a - b);
			let extra = "";
			if (indexes.length) {
				if (indexes.every(i => i >= 6)) extra = rng.either("during the weekend", "over the weekend");
				else if (indexes.every(i => i <= 2)) extra = rng.either("at the start of the week", "early in the week");
				else if (indexes.every(i => i <= 4)) extra = rng.either("midweek", "in the middle of the week");
				else if (indexes.every(i => i === 5)) extra = rng.either("toward the end of the week", "later in the week");
				else if (indexes.every((v, i, a) => !i || v === a[i - 1] + 1)) {
					const days = [indexes[0], indexes.at(-1)].map(i => new DateTime(date).addDays(i).weekDayName);
					extra = `from ${days[0]} to ${days[1]}`;
				} else {
					extra = indexes.map(i => new DateTime(date).addDays(i).weekDayName).join(indexes.length > 2 ? ", " : " and ");
				}
				extra = rng.either(
					`, and remaining ${isHard ? "cold weather" : "cool temperatures"} ${extra}.`,
					`; expect ${isHard ? "more chill" : "continued cool"} ${extra}.`
				);
			} else {
				extra = ".";
			}

			const lead = rng.either(
				"The town is expected to experience",
				"Forecasts indicate",
				"This week's forecast suggests",
				"The upcoming week may bring",
				"Conditions are expected to turn",
				"Forecasters predict"
			);

			const summary = `${lead} ${descriptor} this week${tempText}` + rng.either(` and ${weatherDesc}`, "") + ` on ${firstDay}${extra}`;

			const advice = isHard
				? rng.either(
						"Residents are advised to dress appropriately and limit time outdoors where possible.",
						"People should bundle up, minimize outdoor exposure, and stay warm."
				  )
				: "";

			return `${summary}\n\n${advice}The town's meteorological office assures the public that conditions are being closely monitored.`;
		},
	}
);

/* Helper functions for the articles */
