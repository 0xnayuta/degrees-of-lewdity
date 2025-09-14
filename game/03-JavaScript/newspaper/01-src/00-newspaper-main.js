const Newspaper = (() => {
	let initPromise = null;
	class Page {
		constructor(timestamp) {
			this.date = new DateTime(timestamp);
			this.articles = setup.NewspaperData;
			this.images = setup.NewspaperImages;
			this.cachedPaper = null;
			this.rngInstance = new PRNG(V.newspaper.seed);
			this.columns = [];
			this.layout = [];
			this.tempModifiers = {};
			this.modifiers = { ...V.newspaper.modifiers };
			this.errorArticles = new Set();

			this._offscreenCanvas = new BaseCanvas();
		}

		/*
			- Trims whitespace
			- Removes single line-breaks, and replaces them with spaces.
			- Converts double line-breaks into <br><br>
		*/
		#normalizeContent(str) {
			return str
				.split(/\n\s*\n+/)
				.map(p => p.replace(/\s*\n\s*/g, " ").trim())
				.join("<br><br>");
		}

		/*
			Splits an HTML string into tokens.
			Used during column layout when an article is too tall to fit, to allow it to be split up into multiple chunks.
		*/
		#tokenizeHTML(contentHTML) {
			const regex = /<br\s*\/?>|[^<>\s]+|\s+/gi;
			return Array.from(contentHTML.matchAll(regex), m => m[0]);
		}

		#isOverflowing(el) {
			return el.scrollHeight > el.clientHeight;
		}

		/*
			Determines if a string fits within a specified width.
			Used to dynamically scale title text within an element.
		*/
		#fitsAtFontSize(element, text, fontPx, parentWidth) {
			const context = this._offscreenCanvas.ctx;
			const computedStyle = getComputedStyle(element);

			const fontStyle = computedStyle.fontStyle;
			const fontWeight = computedStyle.fontWeight;
			const fontFamily = computedStyle.fontFamily;

			const fontSpec = `${fontStyle} ${fontWeight} ${fontPx}px ${fontFamily}`;

			context.font = fontSpec;
			const textMetrics = context.measureText(text);
			return textMetrics.width <= parentWidth;
		}

		/*
			Resizes the headlines by fitting the whole width, or scaling it down until it fits
		*/
		#fitTitle($heading, { minSize, maxSize, step = 1, allowTwoLines = false }) {
			const element = $heading[0];
			const originalText = $heading.text().trim();
			const parentWidth = element.parentElement.clientWidth;

			// Try to fit it in a single line first
			for (let size = maxSize; size >= minSize; size -= step) {
				if (this.#fitsAtFontSize(element, originalText, size, parentWidth)) {
					$heading.css({ fontSize: `${size}px` });
					return;
				}
			}
			if (!allowTwoLines) {
				$heading.css({ fontSize: `${minSize}px` });
				return;
			}

			// If we need 2 lines
			const words = originalText.split(/\s+/);
			if (words.length < 2) {
				$heading.text(originalText).css({ fontSize: `${minSize}px` });
				return;
			}

			// Try to balance the word count between 2 lines (needs a rework)
			let bestIndex = 1;
			let bestDiff = Infinity;
			for (let i = 1; i < words.length; i++) {
				const firstLine = words.slice(0, i).join(" ");
				const secondLine = words.slice(i).join(" ");
				const diff = Math.abs(firstLine.length - secondLine.length);
				if (diff < bestDiff) {
					bestDiff = diff;
					bestIndex = i;
				}
			}

			const line1 = words.slice(0, bestIndex).join(" ");
			const line2 = words.slice(bestIndex).join(" ");

			// Try to scale both lines to fit (scale equally)
			for (let size = maxSize; size >= minSize; size -= step) {
				const fits1 = this.#fitsAtFontSize(element, line1, size, parentWidth);
				const fits2 = this.#fitsAtFontSize(element, line2, size, parentWidth);
				if (fits1 && fits2) {
					$heading.html(`${line1}<br>${line2}`).css({
						fontSize: `${size}px`,
						whiteSpace: "nowrap",
						textAlignLast: "auto",
					});
					return;
				}
			}

			// Don't make it smaller than the minsize
			$heading.html(`${line1}<br>${line2}`).css({
				fontSize: `${minSize}px`,
				whiteSpace: "nowrap",
			});
		}

		/*
			Create the normal article block, and return it
		*/
		#createArticleBlock({ artId: articleId, title = null, contentHTML = "", $parentColumn }) {
			const $articleBlock = $("<div>").addClass("dynamic-item normal");
			$articleBlock.attr("data-art-id", articleId);

			let $heading = null;
			if (title !== null) {
				$heading = $("<h3>").text(title).appendTo($articleBlock);
			}
			if (contentHTML.trim().length > 0) {
				$("<p>").html(contentHTML).appendTo($articleBlock);
			}

			$parentColumn.append($articleBlock);

			if ($heading) {
				this.#fitTitle($heading, {
					minSize: 18,
					maxSize: 36,
					step: 1,
					allowTwoLines: true,
				});
			}
			return $articleBlock;
		}

		/*
			Create the -main- article block, and return it.
			Optionally we use an image with a caption
		*/
		#createMainBlock(article) {
			const $mainStory = $('<div class="main-story">');
			$("<h3>").text(this.#resolve(article.title, article, "title")).appendTo($mainStory);

			if (article.image) {
				const $figure = $("<figure>").appendTo($mainStory);
				$("<img>").attr("src", article.image).css("height", "256px").appendTo($figure);
				if (article.caption) {
					$("<figcaption>").text(article.caption).appendTo($figure);
				}
			}

			const $text = $('<div class="text">')
				.addClass(article.image ? "two" : "three")
				.appendTo($mainStory);
			$("<p>")
				.html(this.#normalizeContent(this.#resolveContent(article, true)))
				.appendTo($text);

			return $mainStory;
		}

		#createTownUpdateBlock(article) {
			const $wrapper = $('<div class="dynamic-item townUpdate">');
			$("<h4>").text(this.#resolve(article.title, article, "title")).appendTo($wrapper);
			$("<p>").html(this.#resolveContent(article)).appendTo($wrapper);
			return $wrapper;
		}

		#createAdBlock(article) {
			return $("<div>").addClass("dynamic-item advertisement").html(this.#resolveContent(article));
		}

		#resolve(value, article, label, defaultValue = "") {
			try {
				return resolveValue(value, defaultValue);
			} catch (e) {
				console.error(`Error resolving ${label} for article "${article.id}":`, e);
				this.errorArticles.add(article.id);
				return defaultValue;
			}
		}

		/*
		 	Resolves the content, calling optional init() functions, and providing content() with a parameter (if it's a function)
		*/
		#resolveContent(article, isMain = false) {
			if (!this.tempModifiers[article.id] && typeof article.init === "function") {
				try {
					const clone = { ...(V.newspaper.modifiers || {}) };
					const returnValue = article.init(clone);
					this.tempModifiers[article.id] = { clone, returnValue };
				} catch (e) {
					console.error(`Error in init() for article ${article.id}:`, e);
					this.errorArticles.add(article.id);
					return "";
				}
			}
			const param = this.tempModifiers[article.id]?.returnValue ?? null;
			const content = isMain ? article.main : article.short;

			try {
				return typeof content === "function" ? content(param) : content;
			} catch (e) {
				console.error(`Error in content() for article ${article.id}:`, e);
				this.errorArticles.add(article.id);
				return "";
			}
		}

		/*
			Shuffles the middle letters for a drunken effect
		*/
		#garbleWord(word) {
			if (word.length < 4) return word;

			const middle = word.slice(1, -1).split("");
			for (let i = middle.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[middle[i], middle[j]] = [middle[j], middle[i]];
			}
			return word[0] + middle.join("") + word[word.length - 1];
		}

		/*
			Replaces random words with garbled versions
		*/
		#garbleText(text, ratio = 0.8) {
			return text.replace(/\b\w+\b/g, word => {
				return Math.random() < ratio ? this.#garbleWord(word) : word;
			});
		}

		/*
			Adds a random hallucination effect to random words
		*/
		#hallucinateText(text, ratio = 0.5) {
			const weightedEffects = [
				["hallucinate-upside-down", 5],
				["hallucinate-blur", 0.3],
				["hallucinate-blob", 3],
				["hallucinate-wobble", 2],
				["hallucinate-jitter", 2],
				["hallucinate-spin", 1],
			];

			return text.replace(/\b(\w+)\b/g, match => {
				if (Math.random() > ratio) return match;

				const effect = weightedRandom(...weightedEffects);
				let replacement = match;
				const classes = [effect];
				const styles = [];

				switch (effect) {
					case "hallucinate-backwards":
						replacement = match.split("").reverse().join("");
						break;
					case "hallucinate-wobble": {
						const delay = (Math.random() * 1.5).toFixed(2);
						const duration = (0.4 + Math.random() * 0.6).toFixed(2);
						styles.push(`animation-delay:${delay}s`, `animation-duration:${duration}s`);
						break;
					}
					case "hallucinate-spin": {
						const duration = (1 + Math.random() * 2).toFixed(2);
						const direction = Math.random() < 0.5 ? "normal" : "reverse";
						styles.push(`animation-duration:${duration}s`, `animation-direction:${direction}`);
						break;
					}
				}

				if (Math.random() < 0.8) {
					classes.push("hallucinate-color");
					const offset = (Math.random() * 3).toFixed(2); // desync delay
					styles.push(`animation-delay:${offset}s`);
				}

				// Random scale
				if (Math.random() < 0.5) {
					classes.push("hallucinate-scale");
					const scale = (1 + (Math.random() * 0.4 - 0.2)).toFixed(2); // 0.8–1.2
					styles.push(`--hallucinate-scale:${scale}`);
				}

				const classStr = classes.join(" ");
				const styleStr = styles.length > 0 ? ` style="${styles.join(";")}"` : "";
				return `<span class="${classStr}"${styleStr}>${replacement}</span>`;
			});
		}

		/*
		 * Attempts to insert the entire article
		 *  - If it fits, fine
		 *  - Otherwise, try to split it up into chunks, and move some of it to the next column
		 * 	- If nothing fits, move the entire article to the next column
		 * Prevent orphaned blocks:
		 *  - If only a title would remain alone (orphaned), move the entire article to the next column
		 *  - If only a single line of content is orphaned, also move it (together with the remainder) to the next column
		 */
		#placeSplitableArticle(item, colIndex) {
			const articleId = item.artId;
			const $currentColumn = this.columns[colIndex];
			const domColumn = $currentColumn[0];

			// Try to place the whole article without splitting
			const fullBlock = this.#createArticleBlock({
				artId: articleId,
				title: item.title,
				contentHTML: item.contentHTML,
				$parentColumn: $currentColumn,
			});
			if (!this.#isOverflowing(domColumn)) {
				return null;
			}
			// It did not fit
			fullBlock.remove();

			// Split it into tokens, since it didn't fit
			const tokens = this.#tokenizeHTML(item.contentHTML);
			let low = 0;
			let high = tokens.length;
			let bestN = 0;

			// Test if the (truncated) article block fits in the column
			const testBlock = n => {
				const rawHTML = tokens
					.slice(0, n)
					.join("")
					.replace(/(?:<br\s*\/?>)+$/, "");

				const block = this.#createArticleBlock({
					artId: articleId,
					title: item.title,
					contentHTML: rawHTML,
					$parentColumn: $currentColumn,
				});

				const fits = !this.#isOverflowing(domColumn);
				if (!fits) block.remove();
				return { fits, block };
			};

			// Search for the largest that fits
			while (low <= high) {
				const mid = Math.floor((low + high) / 2);
				const { fits, block } = testBlock(mid);

				if (fits) {
					// If it fits, keep it and move low upward.
					bestN = mid;
					block.remove();
					low = mid + 1;
				} else {
					// If it doesn't fit, remove it, and move high down
					block.remove();
					high = mid - 1;
				}
			}

			// Commit to it if bestN > 0
			if (bestN > 0) {
				let rawHTML = tokens.slice(0, bestN).join("");
				rawHTML = rawHTML.replace(/(?:<br\s*\/?>)+$/, "");

				const partialBlock = this.#createArticleBlock({
					artId: articleId,
					title: item.title,
					contentHTML: rawHTML,
					$parentColumn: $currentColumn,
				});

				partialBlock.addClass("truncated");

				// Move the whole column to the next column if there is only a single line
				const $paragraph = partialBlock.children("p");
				if ($paragraph.length) {
					const lineHeight = parseFloat(getComputedStyle($paragraph[0]).lineHeight);
					const contentHeight = $paragraph[0].offsetHeight;
					if (contentHeight <= lineHeight * 1.1) {
						partialBlock.remove();
						return { artId: articleId, title: item.title, contentHTML: item.contentHTML };
					}
				}

				// Move the remainder only
				const remainder = tokens
					.slice(bestN)
					.join("")
					.replace(/^(?:<br\s*\/?>)+/, "");
				return { artId: articleId, title: null, contentHTML: remainder };
			}

			// If the title is alone at the end of a column - we don't want that
			const titleOnlyBlock = this.#createArticleBlock({
				artId: articleId,
				title: item.title,
				contentHTML: "",
				$parentColumn: $currentColumn,
			});
			if (!this.#isOverflowing(domColumn)) {
				titleOnlyBlock.remove();
				return { artId: articleId, title: item.title, contentHTML: item.contentHTML };
			}
			titleOnlyBlock.remove();

			// Move the entire article to next column - nothing fits
			return { artId: articleId, title: item.title, contentHTML: item.contentHTML };
		}

		#placeFullArticle(item, colIndex) {
			const articleId = item.artId;
			const $renderColumn = this.columns[colIndex];
			const domColumn = $renderColumn[0];

			const fullBlock = this.#createArticleBlock({
				artId: articleId,
				title: item.title,
				contentHTML: item.contentHTML,
				$parentColumn: $renderColumn,
			});
			if (!this.#isOverflowing(domColumn)) {
				return true;
			}

			fullBlock.remove();
			return false;
		}

		/*
			- Renders the main article at the top
			- Attempt to place or split normal articles across columns
			- If the last column overflows, the last article is removed and layout stops
			- Advertisements & town updates are then added randomly.
			- Finally, try to add smaller articles to the end, using up as much space as possible.
		*/
		#layoutDynamicSection($inner) {
			// Start fresh
			this.columns = [];
			const $section = $inner.find("#dynamic-section").empty();
			const dynamicHeight = $section[0].clientHeight;

			const queue = this.layout.length ? this.layout : V.newspaper.queue;

			const articleLookup = Object.fromEntries(this.articles.articles.map(a => [a.id, a]));
			const queueArticles = Array.isArray(queue) ? queue.map(id => articleLookup[id]).filter(a => a !== undefined) : this.articles.articles;

			const mainArticle = queueArticles.shift();
			let $mainArticleBlock = null;
			if (mainArticle?.main != null) {
				$mainArticleBlock = this.#createMainBlock(mainArticle).appendTo($section);
				this.#fitTitle($mainArticleBlock.find("h3"), { minSize: 32, maxSize: 92, step: 1, allowTwoLines: false });
				// divider under main
				$('<hr class="main-divider">').appendTo($mainArticleBlock);
			}

			// Get available height
			const mainHeight = $mainArticleBlock ? $mainArticleBlock[0].getBoundingClientRect().height : 0;
			const availableHeight = Math.max(0, dynamicHeight - mainHeight);

			const $columnsWrapper = $('<div class="columns-wrapper">')
				.css({ height: `${availableHeight}px` })
				.appendTo($section);

			// Hardcoded into 3 columns. Maybe change later
			for (let i = 0; i < 3; i++) {
				const $column = $('<div class="column">').appendTo($columnsWrapper);
				this.columns.push($column);
			}

			const usedArticleIds = new Set();
			let lastRemovedArticle = null;
			let stopLayout = false;

			// Shuffle and place, until it overflows
			// If it overflows, remove the last article
			for (const article of queueArticles) {
				if (stopLayout) break;

				if (article.category === "article" && article.short) {
					let item = {
						artId: article.id,
						title: this.#resolve(article.title, article, "title"),
						contentHTML: this.#normalizeContent(this.#resolveContent(article)),
					};
					let colIndex = 0;

					while (item && colIndex < 3) {
						if (colIndex < 2) {
							const remainder = this.#placeSplitableArticle(item, colIndex);
							if (remainder === null) {
								usedArticleIds.add(article.id);
								break;
							} else {
								item = remainder;
								colIndex++;
							}
						} else {
							// Last column
							const fits = this.#placeFullArticle(item, colIndex);
							usedArticleIds.add(article.id);
							if (!fits) {
								lastRemovedArticle = article;
								// Remove any partial blocks from all columns
								this.columns.forEach($col => {
									$col.children(".dynamic-item")
										.filter((_, el) => $(el).attr("data-art-id") === String(article.id))
										.remove();
								});
								usedArticleIds.delete(article.id);
								stopLayout = true;
							}
							break;
						}
					}
					continue;
				}

				// Ads and townUpdate get added after normal articles - to ensure they are added
				let $blockElement;
				if (article.category === "advertisement") {
					$blockElement = this.#createAdBlock(article);
				} else if (article.category === "townUpdate") {
					$blockElement = this.#createTownUpdateBlock(article);
				} else {
					continue;
				}

				for (let col = 0; col < 3; col++) {
					$blockElement.appendTo(this.columns[col]);
					if (!this.#isOverflowing(this.columns[col][0])) {
						usedArticleIds.add(article.id);
						break;
					}
					$blockElement.remove();
					if (col === 2) {
						//
					}
				}
			}

			// If an article has been removed at the end - check its length
			// Then try to add smaller articles instead. If there are no more articles to pick from, don't add anything.
			if (lastRemovedArticle) {
				const removedLen = this.#resolveContent(lastRemovedArticle).length;
				const remainingCandidates = queueArticles
					.filter(a => a.category === "article" && a.short && !usedArticleIds.has(a.id) && a.id !== lastRemovedArticle.id)
					.map(a => ({ article: a, contentLength: this.#resolveContent(a).length }))
					.sort((a, b) => b.contentLength - a.contentLength);

				for (const { article, contentLength } of remainingCandidates) {
					if (contentLength < removedLen) {
						const fullHTML = this.#normalizeContent(this.#resolveContent(article));
						const fits = this.#placeFullArticle(
							{ artId: article.id, title: this.#resolve(article.title, article, "title"), contentHTML: fullHTML },
							2
						);
						if (fits) {
							usedArticleIds.add(article.id);
							break;
						}
					}
				}
			}

			this.layout = Array.from([queue[0], ...usedArticleIds]);

			if (V.newspaper.layout.length === 0) {
				this.#setExpired();
			}
		}

		#setExpired() {
			// Merge the modifiers
			const articleMap = new Map(this.articles.articles.map(a => [a.id, a]));

			for (const id of this.layout) {
				const article = articleMap.get(id);
				if (!article) continue;

				// merge clone if init ran
				const initEntry = this.tempModifiers[id];
				if (initEntry) {
					Object.assign(V.newspaper.modifiers, initEntry.clone);
				}

				V.newspaper.layout.push(id);
				if (!article.repeatable && !V.newspaper.expired.includes(id)) {
					V.newspaper.expired.push(id);
				}
			}
		}

		/*
			Renders the weekly weather forecast	
		*/
		#layoutForecast($inner) {
			const $forecast = $inner.find("#forecast").empty();

			const icons = this.images.weather;

			V.newspaper.forecast.forEach(({ type, avgTemp }, i) => {
				const date = new DateTime(this.date).addDays(i);
				const dateStr = `${date.monthName} ${date.day}`;
				const dayStr = date.weekDayName.slice(0, 3);

				let temperature = "???";
				let iconKey = 0;
				if (type !== null && typeof avgTemp !== "string") {
					if (Newspaper.instance.rngInstance.randomInt(0, 9999)) {
						const weatherType = setup.WeatherGeneration.weatherTypes[type].name;
						iconKey = type === 3 || type === 4 ? weatherType.replace("Precipitation", avgTemp < 0 ? "Snow" : "Rain") : weatherType;
					}
					temperature = Weather.toSelectedString(avgTemp, 0);
				}

				const $dayElement = $("<div>").addClass("forecast-day");
				const $header = $("<div>")
					.addClass("forecast-header")
					.append($("<span>").addClass("date").text(dateStr))
					.append($("<span>").addClass("day").text(dayStr));

				// Append icon if available; otherwise use a placeholder square showing the iconKey
				let iconContent = icons ? icons[iconKey] : null;
				if (iconContent == null) {
					iconContent = $("<div>").addClass("weather-placeholder").text(String(iconKey));
				}
				const $info = $("<div>").addClass("info").append(iconContent);

				const $temperatureWrapper = $("<div>").addClass("forecast-temperature");
				$temperatureWrapper.append($("<span>").addClass("tempHigh").text(`${temperature}`));

				$info.append($temperatureWrapper);
				$dayElement.append($header, $info);
				$forecast.append($dayElement);
			});
		}

		/*
		Generates 8 days of weather forecast. Only samples daytime hours.
		- Prioritizes heavy clouds/precipitation if it appears at least twice.
		- Otherwise, selects the most frequent weather type during the day (average)
		- Temperature uses daytime averages combined with the normal modifiers.
		*/
		generateForecast() {
			const daysToGenerate = 8; // Number of days to forecast
			const sampleHours = [6, 9, 12, 15, 18, 21]; // Interval of hours to check daily averages (e.g. every 3 hours) - only check daytime hours

			const forecast = [];
			for (let i = 0; i < daysToGenerate; i++) {
				const dayStartTs = this.date.timeStamp + i * TimeConstants.secondsPerDay;

				let freqMap = new Map();
				let baseTempSum = 0;
				let sunFactorSum = 0;
				for (const hour of sampleHours) {
					const date = new DateTime(dayStartTs + hour * TimeConstants.secondsPerHour);

					// Get weather index
					const weatherIndex = Weather.index(date);
					if (weatherIndex === null) {
						freqMap = null;
						break;
					}
					freqMap.set(weatherIndex, (freqMap.get(weatherIndex) || 0) + 1);

					// Get temperature
					const temp = Weather.Temperature.interpolateDailyTemperature(date);
					if (temp === null) {
						baseTempSum = null;
						sunFactorSum = null;
						break;
					}
					baseTempSum += Weather.Temperature.interpolateDailyTemperature(date);
					sunFactorSum += Weather.activeRenderer.orbitals.sun.getFactor(date) ?? 0;
				}

				// If heavy clouds or precipitation (2+), we prioritise it over clear/light clouds (0-1)
				let type = null;
				let typeDefinition = null;
				let count = 0;
				if (freqMap !== null) {
					for (const [t, cnt] of freqMap) {
						if (t >= 3 && cnt >= 2 && cnt > count) {
							count = cnt;
							type = t;
						}
					}

					// If no 2+ types are found, use the highest average
					if (type === null) {
						let bestCount = -1;
						for (const [t, cnt] of freqMap) {
							if (cnt > bestCount) {
								bestCount = cnt;
								type = t;
							}
						}
					}
					typeDefinition = Weather.genSettings.weatherTypes[type];
				}

				// Get average precipitation
				const precipitationModifier = typeDefinition?.precipitationIntensity * setup.WeatherTemperature.precipitationEffect ?? 0;
				// Get average overcast
				const overcast = Math.pow(typeDefinition?.value / 4, 2) ?? 0;

				// Factors to generate correct average temperatures
				const maxVariation = setup.WeatherTemperature.maxDiurnalVariation * 0.5;
				const minVariation = setup.WeatherTemperature.minDiurnalVariation * 0.5;
				const weatherVariation = interpolate(minVariation, maxVariation, 1 - overcast);
				const daylightModifierSum = weatherVariation * sunFactorSum;

				// Final average temperature - add +3 extra (due to being in town)
				const avgTemp = baseTempSum === null ? "???" : round((baseTempSum + daylightModifierSum) / sampleHours.length + precipitationModifier + 3, 2);

				forecast.push({ type, avgTemp });
			}
			return forecast;
		}

		async buildPaperAsync() {
			await document.fonts.ready;
			const startMs = performance.now();
			const $offscreenContainer = $("<div>")
				.css({ position: "absolute", left: "-9999px", top: 0, width: 924, height: 1250, visibility: "hidden" })
				.appendTo("body");

			const $inner = $('<div class="newspaper-inner">').appendTo($offscreenContainer);

			// Header
			$inner.append(`
				<div class="static-top">
				<hr class="rule rule-large">
				<header class="newspaper-header"><h1 class="newspaper-title">The Crier's ${this.images.logo} Chariot</h1></header>
				<hr class="rule rule-large">
				<div class="newspaper-sub">
					<span class="date">${this.date.weekDayName}, ${this.date.monthName} ${this.date.day}, ${this.date.year}</span>
					<span class="motto">Let truth ride swift</span>
					<span class="issue">Price £${setup.NewspaperSettings.price}</span>
				</div>
				<hr class="rule rule-dotted">
				</div>`);

			// Content
			$inner.append('<div id="dynamic-section" class="dynamic-section"></div>');

			// Footer
			$inner.append(`
				<div class="static-bottom">
				<hr class="rule rule-large">
				<div class="forecast-title"><div class="weather-title">The Weather</div></div>
				<div id="forecast" class="forecast"></div>
				</div>`);

			this.#layoutDynamicSection($inner);
			this.#layoutForecast($inner);
			this.cachedPaper = $inner.clone(true, true);
			$offscreenContainer.remove();
			console.warn("Performance newspaper: (build)", performance.now() - startMs, "ms");
		}

		render() {
			const $clone = this.cachedPaper.clone(true, true);

			// experimental drunken or hallucination effects
			if (V.drunktest || V.hallutest) {
				const applyDrunk = !!V.drunktest;
				const applyHallucinate = !!V.hallutest;
				const transformText = text => {
					let out = text;
					if (applyDrunk) out = this.#garbleText(out, 1);
					return applyHallucinate ? this.#hallucinateText(out, 0.8) : out;
				};

				$clone.find("h3, h4, p, span").each((_, el) => {
					const $element = $(el);
					if ($element.children().length === 0) {
						const result = transformText($element.text());
						if (applyHallucinate) $element.html(result);
						else $element.text(result);
					} else {
						$element.contents().each((_, node) => {
							if (node.nodeType !== Node.TEXT_NODE) return;
							const result = transformText(node.textContent);
							if (applyHallucinate) $(node).replaceWith(result);
							else node.textContent = result;
						});
					}
				});
			}

			return $clone;
		}

		generateWeeklyQueue() {
			const allArticles = this.articles.articles;
			const expired = new Set(V.newspaper.expired);

			// Only articles with passed conditions - which haven't expired (been displayed before)
			const eligible = allArticles.filter(a => !expired.has(a.id) && (typeof a.condition !== "function" || a.condition()));

			// Shuffle main articles
			const mainArticles = eligible.filter(a => a.main);
			let mainId = null;
			if (mainArticles.length > 0) {
				const maxPri = Math.max(...mainArticles.map(a => a.priority ?? 0));
				const top = mainArticles.filter(a => (a.priority ?? 0) === maxPri);
				this.rngInstance.shuffle(top);
				mainId = top[0].id;
			}

			// Exclude short article if its main property was picked above
			const shortArticles = eligible.filter(a => a.short && a.id !== mainId);

			// Sort by priority
			const priorityBuckets = shortArticles.reduce((map, art) => {
				const p = art.priority ?? 0;
				if (!map.has(p)) map.set(p, []);
				map.get(p).push(art);
				return map;
			}, new Map());

			const sortedShortIds = [...priorityBuckets.keys()]
				.sort((a, b) => b - a)
				.flatMap(p => {
					const bucket = priorityBuckets.get(p);
					this.rngInstance.shuffle(bucket);
					return bucket.map(a => a.id);
				});

			// Build initial queue
			const articleQueue = [...(mainId != null ? [mainId] : []), ...sortedShortIds];

			// Shuffle indexes 1–4
			if (articleQueue.length > 1) {
				const slice = articleQueue.slice(1, 5);
				this.rngInstance.shuffle(slice);
				articleQueue.splice(1, slice.length, ...slice);
			}

			// Limit advertisements to max 2
			const byIdMap = new Map(allArticles.map(a => [a.id, a]));
			let adCount = 0;
			const finalQueue = articleQueue.filter(id => {
				const art = byIdMap.get(id);
				if (art.category === "advertisement") {
					if (adCount < 2) {
						adCount++;
						return true;
					}
					return false;
				}
				return true;
			});
			return finalQueue;
		}
	}

	if (!setup.NewspaperData) setup.NewspaperData = {};
	if (!setup.NewspaperData.articles) setup.NewspaperData.articles = [];
	function addArticles(...entries) {
		const articles = setup.NewspaperData.articles;
		const newArticles = entries.flat();

		newArticles.forEach(article => {
			if (article.id == null) {
				article.id = articles.length;
			}

			const existingIndex = articles.findIndex(a => a.id === article.id);
			if (existingIndex !== -1) {
				console.warn(`Duplicate article id "${article.id}". Overwriting.`);
				articles[existingIndex] = article;
			} else {
				articles.push(article);
			}
		});
	}

	function wrapSeed(value) {
		const min = 0.25;
		const max = 0.99;
		const span = max - min;
		if (!Number.isFinite(value)) return min;
		let normalized = (value - min) % span;
		if (normalized < 0) normalized += span;
		return min + normalized;
	}

	function enableLink() {
		if (!V.newspaper.date) return;
		const date = new DateTime(V.newspaper.date);
		$("#newspaper-button")
			.prop("disabled", false)
			.on("click", () => {
				wikifier("overlayReplace", "newspaper");
			})
			.tooltip({
				message: `This edition of the newspaper is dated <span class="yellow">${date.monthName} ${date.day}</span>.
					<br>A new edition is out every <span class="yellow">Sunday.</span>`,
				cursor: "pointer",
				delay: 200,
			});
	}

	function disableLink() {
		$("#newspaper-button")
			.prop("disabled", true)
			.on("click", e => e.preventDefault())
			.tooltip({
				message: `You haven't purchased this week's newspaper. Visit the newspaper stall to buy a copy.`,
			});
	}

	function buy() {
		if (V.newspaper.bought) return;
		enableLink();
		statChange.money(-setup.NewspaperSettings.price * 10, "newspaper");
		V.newspaper.total++;
		V.newspaper.bought = true;
	}

	function reset() {
		disableLink();
		V.newspaper.bought = false;
		if (Newspaper.instance) Newspaper.instance.layout = [];
		V.newspaper.seed = wrapSeed(Time.days * 0.01);
		V.newspaper.forecast = [];
		V.newspaper.queue = [];
		V.newspaper.modifiers = {};
		generate();
	}

	function clear() {
		const startSunday = new DateTime(Time.date.weekDay === 1 ? Time.date : Time.date.getPreviousWeekdayDate(1));
		startSunday.toTimestamp(startSunday.year, startSunday.month, startSunday.day, 0, 0, 0);
		V.newspaper = {
			seed: randomFloat(0.25, 0.99, true),
			date: startSunday.timeStamp,
			bought: false,
			total: 0,
			modifiers: {},
			queue: [],
			forecast: [],
			expired: [],
		};
		generate();
	}

	function generate() {
		const startSunday = new DateTime(Time.date.weekDay === 1 ? Time.date : Time.date.getPreviousWeekdayDate(1));
		startSunday.toTimestamp(startSunday.year, startSunday.month, startSunday.day, 0, 0, 0);
		V.newspaper.date = startSunday.timeStamp;

		Newspaper.instance = new Newspaper.Page(V.newspaper.date);
		V.newspaper.forecast = Newspaper.instance.generateForecast();
		V.newspaper.queue = Newspaper.instance.generateWeeklyQueue();
		V.newspaper.layout = [];
	}

	/*
		Use promise to preload the layout on page-load, and to prevent race-conditions
		- Loads after the page and UI is loaded.
		- If the newspaper is opened before it's ready, it waits for the loading to finish.
		- Otherwise, it loads in the background without slowing down the load time.
		- (Takes ~50ms to populate once)
	*/
	async function init() {
		if (Newspaper.instance?.cachedPaper) return;
		if (initPromise) return initPromise;

		initPromise = (async () => {
			try {
				if (!Newspaper.instance) {
					Newspaper.instance = new Newspaper.Page(V.newspaper.date);
				}
				await Newspaper.instance.buildPaperAsync();
			} finally {
				initPromise = null;
			}
		})();

		return initPromise;
	}

	return {
		Page,
		instance: null,
		addArticles,
		init,
		buy,
		reset,
		clear,
		generate,
		enableLink,
		disableLink,
		wrapSeed,
		get modifiers() {
			return V.newspaper.modifiers;
		},
	};
})();
window.Newspaper = Newspaper;
