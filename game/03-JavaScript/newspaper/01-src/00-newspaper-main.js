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
		#fitsAtFontSize(el, text, fontPx, parentWidth) {
			const ctx = this._offscreenCanvas.ctx;
			const cs = getComputedStyle(el);

			const fontStyle = cs.fontStyle;
			const fontWeight = cs.fontWeight;
			const fontFamily = cs.fontFamily;

			const canvasFont = `${fontStyle} ${fontWeight} ${fontPx}px ${fontFamily}`;

			ctx.font = canvasFont;
			const metrics = ctx.measureText(text);
			return metrics.width <= parentWidth;
		}

		/*
			Resizes the headlines by fitting the whole width, or scaling it down until it fits
		*/
		#fitTitle($h, { minSize, maxSize, step = 1, allowTwoLines = false }) {
			const el = $h[0];
			const originalText = $h.text().trim();
			const parentWidth = el.parentElement.clientWidth;

			// Try to fit it in a single line first
			for (let size = maxSize; size >= minSize; size -= step) {
				if (this.#fitsAtFontSize(el, originalText, size, parentWidth)) {
					$h.css({ fontSize: `${size}px` });
					return;
				}
			}
			if (!allowTwoLines) {
				$h.css({ fontSize: `${minSize}px` });
				return;
			}

			// If we need 2 lines
			const words = originalText.split(/\s+/);
			if (words.length < 2) {
				$h.text(originalText).css({ fontSize: `${minSize}px` });
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
				const fits1 = this.#fitsAtFontSize(el, line1, size, parentWidth);
				const fits2 = this.#fitsAtFontSize(el, line2, size, parentWidth);
				if (fits1 && fits2) {
					$h.html(`${line1}<br>${line2}`).css({
						fontSize: `${size}px`,
						whiteSpace: "nowrap",
						textAlignLast: "auto",
					});
					return;
				}
			}

			// Don't make it smaller than the minsize
			$h.html(`${line1}<br>${line2}`).css({
				fontSize: `${minSize}px`,
				whiteSpace: "nowrap",
			});
		}

		/*
			Create the normal article block, and return it
		*/
		#createArticleBlock({ artId, title = null, contentHTML = "", $parentColumn }) {
			const $block = $("<div>").addClass("dynamic-item normal");
			$block.attr("data-art-id", artId);

			let $h = null;
			if (title !== null) {
				$h = $("<h3>").text(title).appendTo($block);
			}
			if (contentHTML.trim().length > 0) {
				$("<p>").html(contentHTML).appendTo($block);
			}

			$parentColumn.append($block);

			if ($h) {
				this.#fitTitle($h, {
					minSize: 18,
					maxSize: 36,
					step: 1,
					allowTwoLines: true,
				});
			}
			return $block;
		}

		/*
			Create the -main- article block, and return it.
			Optionally we use an image with a caption
		*/
		#createMainBlock(art) {
			const $ms = $('<div class="main-story">');
			$("<h3>").text(this.#resolve(art.title, art, "title")).appendTo($ms);

			if (art.image) {
				const $fig = $("<figure>").appendTo($ms);
				$("<img>").attr("src", art.image).css("height", "256px").appendTo($fig);
				if (art.caption) {
					$("<figcaption>").text(art.caption).appendTo($fig);
				}
			}

			const $txt = $('<div class="text">')
				.addClass(art.image ? "two" : "three")
				.appendTo($ms);
			$("<p>")
				.html(this.#normalizeContent(this.#resolveContent(art, true)))
				.appendTo($txt);

			return $ms;
		}

		#createTownUpdateBlock(art) {
			const $w = $('<div class="dynamic-item townUpdate">');
			$("<h4>").text(this.#resolve(art.title, art, "title")).appendTo($w);
			$("<p>").html(this.#resolveContent(art)).appendTo($w);
			return $w;
		}

		#createAdBlock(art) {
			return $("<div>").addClass("dynamic-item advertisement").html(this.#resolveContent(art));
		}

		#resolve(value, art, label, defaultValue = "") {
			try {
				return resolveValue(value, defaultValue);
			} catch (e) {
				console.error(`Error resolving ${label} for article "${art.id}":`, e);
				this.errorArticles.add(art.id);
				return defaultValue;
			}
		}

		/*
		 	Resolves the content, calling optional init() functions, and providing content() with a parameter (if it's a function)
		*/
		#resolveContent(art, isMain = false) {
			if (!this.tempModifiers[art.id] && typeof art.init === "function") {
				try {
					const clone = { ...(V.newspaper.modifiers || {}) };
					const returnValue = art.init(clone);
					this.tempModifiers[art.id] = { clone, returnValue };
				} catch (e) {
					console.error(`Error in init() for article ${art.id}:`, e);
					this.errorArticles.add(art.id);
					return "";
				}
			}
			const param = this.tempModifiers[art.id]?.returnValue ?? null;
			const content = isMain ? art.main : art.short;

			try {
				return typeof content === "function" ? content(param) : content;
			} catch (e) {
				console.error(`Error in content() for article ${art.id}:`, e);
				this.errorArticles.add(art.id);
				return "";
			}
		}

		#garbleWord(word) {
			if (word.length < 4) return word;

			const middle = word.slice(1, -1).split("");
			for (let i = middle.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[middle[i], middle[j]] = [middle[j], middle[i]];
			}
			return word[0] + middle.join("") + word[word.length - 1];
		}

		#garbleText(text, ratio = 0.8) {
			return text.replace(/\b\w+\b/g, word => {
				return Math.random() < ratio ? this.#garbleWord(word) : word;
			});
		}

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
				let classes = [effect];
				let styles = [];

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

		// 🔍 Overlay: Random scale
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
			const artId = item.artId;
			const $rCol = this.columns[colIndex];
			const domCol = $rCol[0];

			// Try to place the whole article without splitting
			const fullBlock = this.#createArticleBlock({
				artId,
				title: item.title,
				contentHTML: item.contentHTML,
				$parentColumn: $rCol,
			});
			if (!this.#isOverflowing(domCol)) {
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
					artId,
					title: item.title,
					contentHTML: rawHTML,
					$parentColumn: $rCol,
				});

				const fits = !this.#isOverflowing(domCol);
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

				this._titleCache = null;
				const partialBlock = this.#createArticleBlock({
					artId,
					title: item.title,
					contentHTML: rawHTML,
					$parentColumn: $rCol,
				});

				partialBlock.addClass("truncated");

				// Move the whole column to the next column if there is only a single line
				const $p = partialBlock.children("p");
				if ($p.length) {
					const lineH = parseFloat(getComputedStyle($p[0]).lineHeight);
					const contentH = $p[0].offsetHeight;
					if (contentH <= lineH * 1.1) {
						partialBlock.remove();
						return { artId, title: item.title, contentHTML: item.contentHTML };
					}
				}

				// Move the remainder only
				const remainder = tokens
					.slice(bestN)
					.join("")
					.replace(/^(?:<br\s*\/?>)+/, "");
				return { artId, title: null, contentHTML: remainder };
			}

			// If the title is alone at the end of a column - we don't want that
			const titleOnlyBlock = this.#createArticleBlock({
				artId,
				title: item.title,
				contentHTML: "",
				$parentColumn: $rCol,
			});
			if (!this.#isOverflowing(domCol)) {
				titleOnlyBlock.remove();
				return { artId, title: item.title, contentHTML: item.contentHTML };
			}
			titleOnlyBlock.remove();

			// Move the entire article to next column - nothing fits
			return { artId, title: item.title, contentHTML: item.contentHTML };
		}

		#placeFullArticle(item, colIndex) {
			const artId = item.artId;
			const $rCol = this.columns[colIndex];
			const domCol = $rCol[0];

			const fullBlock = this.#createArticleBlock({
				artId,
				title: item.title,
				contentHTML: item.contentHTML,
				$parentColumn: $rCol,
			});
			$rCol.append(fullBlock);
			if (!this.#isOverflowing(domCol)) {
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
			const $sec = $inner.find("#dynamic-section").empty();
			const dynH = $sec[0].clientHeight;

			const queue = this.layout.length ? this.layout : V.newspaper.queue;

			const lookup = Object.fromEntries(this.articles.articles.map(a => [a.id, a]));
			const queueObjects = Array.isArray(queue) ? queue.map(id => lookup[id]).filter(a => a !== undefined) : this.articles.articles;

			const mainArt = queueObjects.shift();
			let $mainBlock = null;
			if (mainArt?.main != null) {
				$mainBlock = this.#createMainBlock(mainArt).appendTo($sec);
				this.#fitTitle($mainBlock.find("h3"), { minSize: 32, maxSize: 92, step: 1, allowTwoLines: false });
				// divider under main
				$('<hr class="main-divider">').appendTo($mainBlock);
			}

			// Get avaliable height
			const mainH = $mainBlock ? $mainBlock[0].getBoundingClientRect().height : 0;
			const availH = Math.max(0, dynH - mainH);

			const $columnsWrapper = $('<div class="columns-wrapper">')
				.css({ height: `${availH}px` })
				.appendTo($sec);

			// Hardcoded into 3 columns. Maybe change later
			for (let i = 0; i < 3; i++) {
				const $col = $('<div class="column">').appendTo($columnsWrapper);
				this.columns.push($col);
			}

			const usedIds = new Set();
			let lastRemovedArticle = null;
			let stop = false;

			// Shuffle and place, until it overflows
			// If it overflows, remove the last article
			for (const art of queueObjects) {
				if (stop) break;

				if (art.category === "article" && art.short) {
					let item = {
						artId: art.id,
						title: this.#resolve(art.title, art, "title"),
						contentHTML: this.#normalizeContent(this.#resolveContent(art)),
					};
					let colIndex = 0;

					while (item && colIndex < 3) {
						if (colIndex < 2) {
							const remainder = this.#placeSplitableArticle(item, colIndex);
							if (remainder === null) {
								usedIds.add(art.id);
								break;
							} else {
								item = remainder;
								colIndex++;
							}
						} else {
							// Last column
							const fits = this.#placeFullArticle(item, colIndex);
							usedIds.add(art.id);
							if (!fits) {
								lastRemovedArticle = art;
								// Remove any partial blocks from all columns
								this.columns.forEach($col => {
									$col.children(".dynamic-item")
										.filter((_, el) => $(el).attr("data-art-id") == art.id)
										.remove();
								});
								usedIds.delete(art.id);
								stop = true;
							}
							break;
						}
					}
					continue;
				}

				// Ads and townUpdate get added after normal articles - to ensure they are added
				let $block;
				if (art.category === "advertisement") {
					$block = this.#createAdBlock(art);
				} else if (art.category === "townUpdate") {
					$block = this.#createTownUpdateBlock(art);
				} else {
					continue;
				}

				for (let col = 0; col < 3; col++) {
					$block.appendTo(this.columns[col]);
					if (!this.#isOverflowing(this.columns[col][0])) {
						usedIds.add(art.id);
						break;
					}
					$block.remove();
					if (col === 2) {
						//
					}
				}
			}

			// If an article has been removed at the end - check it's length
			// Then try to add smaller articles instead. If there are no more articles to pick from, don't add anything.
			if (lastRemovedArticle) {
				const removedLen = this.#resolveContent(lastRemovedArticle).length;
				const remaining = queueObjects
					.filter(a => a.category === "article" && a.short && !usedIds.has(a.id) && a.id !== lastRemovedArticle.id)
					.map(a => ({ art: a, length: this.#resolveContent(a).length }))
					.sort((a, b) => b.length - a.length);

				for (const { art, length } of remaining) {
					if (length < removedLen) {
						const fullHTML = this.#normalizeContent(this.#resolveContent(art));
						const fits = this.#placeFullArticle({ artId: art.id, title: this.#resolve(art.title, art, "title"), contentHTML: fullHTML }, 2);
						if (fits) {
							usedIds.add(art.id);
							break;
						}
					}
				}
			}

			this.layout = Array.from([queue[0], ...usedIds]);

			if (V.newspaper.layout.length === 0) {
				this.#setExpired();
			}
		}

		#setExpired() {
			// Merge the modifiers
			const lookup = new Map(this.articles.articles.map(a => [a.id, a]));

			for (const id of this.layout) {
				const art = lookup.get(id);
				if (!art) continue;

				// merge clone if init ran
				const entry = this.tempModifiers[id];
				if (entry) {
					Object.assign(V.newspaper.modifiers, entry.clone);
				}

				V.newspaper.layout.push(id);
				if (!art.repeatable && !V.newspaper.expired.includes(id)) {
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

				const $day = $("<div>").addClass("forecast-day");
				const $hdr = $("<div>")
					.addClass("forecast-header")
					.append($("<span>").addClass("date").text(dateStr))
					.append($("<span>").addClass("day").text(dayStr));

				const $info = $("<div>").addClass("info").append(icons[iconKey]);
				const $tempWrap = $("<div>").addClass("forecast-temperature");
				$tempWrap.append($("<span>").addClass("tempHigh").text(`${temperature}`));

				$info.append($tempWrap);
				$day.append($hdr, $info);
				$forecast.append($day);
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

			const result = [];
			for (let i = 0; i < daysToGenerate; i++) {
				const dayStartTs = this.date.timeStamp + i * TimeConstants.secondsPerDay;

				let freqMap = new Map();
				let sumBase = 0;
				let sumSun = 0;
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
						sumBase = null;
						sumSun = null;
						break;
					}
					sumBase += Weather.Temperature.interpolateDailyTemperature(date);
					sumSun += Weather.activeRenderer.orbitals.sun.getFactor(date) ?? 0;
				}

				// If heavy clouds or precipitation (2+), we prioritise it over clear/light clouds (0-1)
				let type = null;
				let typeDef = null;
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
					typeDef = Weather.genSettings.weatherTypes[type];
				}

				// Get average precipitation
				const precipMod = typeDef?.precipitationIntensity * setup.WeatherTemperature.precipitationEffect ?? 0;
				// Get average overcast
				const overcast = Math.pow(typeDef?.value / 4, 2) ?? 0;

				// Factors to generate correct average temperatures
				const maxVar = setup.WeatherTemperature.maxDiurnalVariation * 0.5;
				const minVar = setup.WeatherTemperature.minDiurnalVariation * 0.5;
				const weatherMod = interpolate(minVar, maxVar, 1 - overcast);
				const dayModSum = weatherMod * sumSun;

				// Final average temperature - add +3 extra (due to being in town)
				const avgTemp = sumBase === null ? "???" : round((sumBase + dayModSum) / sampleHours.length + precipMod + 3, 2);

				result.push({ type, avgTemp });
			}
			return result;
		}

		async buildPaperAsync() {
			await document.fonts.ready;
			const perf = performance.now();
			const $off = $("<div>").css({ position: "absolute", left: "-9999px", top: 0, width: 924, height: 1250, visibility: "hidden" }).appendTo("body");

			const $inner = $('<div class="newspaper-inner">').appendTo($off);

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
			$off.remove();
			console.warn("Performance newspaper: (build)", performance.now() - perf, "ms");
		}

		render() {
			const $clone = this.cachedPaper.clone(true, true);

			if (V.drunktest) {
				$clone.find("h3, h4, p, span").each((_, el) => {
					const $el = $(el);
					if ($el.children().length === 0) {
						$el.text(this.#garbleText($el.text(), 1));
					} else {
						$el.contents().each((_, node) => {
							if (node.nodeType === Node.TEXT_NODE) {
								node.textContent = this.#garbleText(node.textContent, 1);
							}
						});
					}
				});
			}

			if (V.hallutest) {
				$clone.find("h3, h4, p, span").each((_, el) => {
					const $el = $(el);
					if ($el.children().length === 0) {
						$el.html(this.#hallucinateText($el.text(), 0.8));
					} else {
						$el.contents().each((_, node) => {
							if (node.nodeType === Node.TEXT_NODE) {
								$(node).replaceWith(this.#hallucinateText(node.textContent, 0.8));
							}
						});
					}
				});
			}

			return $clone;
		}

		generateWeeklyQueue() {
			const all = this.articles.articles;
			const expired = new Set(V.newspaper.expired);

			// Only articles with passed conditions - which haven't expired (been displayed before)
			const eligible = all.filter(a => !expired.has(a.id) && (typeof a.condition !== "function" || a.condition()));

			// Shuffle main articles
			const mains = eligible.filter(a => a.main);
			let mainId = null;
			if (mains.length > 0) {
				const maxPri = Math.max(...mains.map(a => a.priority ?? 0));
				const top = mains.filter(a => (a.priority ?? 0) === maxPri);
				this.rngInstance.shuffle(top);
				mainId = top[0].id;
			}

			// Exclude short article if it's main property was picked above
			const shorts = eligible.filter(a => a.short && a.id !== mainId);

			// Sort by priority
			const byPriority = shorts.reduce((map, art) => {
				const p = art.priority ?? 0;
				if (!map.has(p)) map.set(p, []);
				map.get(p).push(art);
				return map;
			}, new Map());

			const sortedShortIds = [...byPriority.keys()]
				.sort((a, b) => b - a)
				.flatMap(p => {
					const bucket = byPriority.get(p);
					this.rngInstance.shuffle(bucket);
					return bucket.map(a => a.id);
				});

			// Build initial queue
			const queue = [...(mainId != null ? [mainId] : []), ...sortedShortIds];

			// Shuffle indexes 1–4
			if (queue.length > 1) {
				const slice = queue.slice(1, 5);
				this.rngInstance.shuffle(slice);
				queue.splice(1, slice.length, ...slice);
			}

			// Limit advertisements to max 2
			const byId = new Map(all.map(a => [a.id, a]));
			let adCount = 0;
			const finalQueue = queue.filter(id => {
				const art = byId.get(id);
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
		V.newspaper.seed += Time.days * 0.01;
		V.newspaper.forecast = [];
		V.newspaper.queue = [];
		V.newspaper.modifiers = {};
		generate();
	}

	function clear() {
		const startSunday = new DateTime(Time.date.weekDay === 1 ? Time.date : Time.date.getPreviousWeekdayDate(1));
		startSunday.toTimestamp(startSunday.year, startSunday.month, startSunday.day, 0, 0, 0);
		V.newspaper = {
			seed: randomFloat(0, 1, true),
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
		Uses promise to preload the layout on page-load, and to prevent race-conditions
	*/
	async function init() {
		if (Newspaper.instance?.cachedPaper) return;
		if (initPromise) return initPromise;

		initPromise = (async () => {
			try {
				if (!Newspaper.instance) {
					Newspaper.instance = new Newspaper.Page(V.newspaper.date);
				}
				if (!Newspaper.queue) {
					Newspaper.queue = V.newspaper.queue;
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
		get modifiers() {
			return V.newspaper.modifiers;
		},
	};
})();
window.Newspaper = Newspaper;

// const img = new Image();
// img.onload = function () {
//     const canvas = document.createElement("canvas");
//     canvas.width = this.width;
//     canvas.height = this.height;
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(this, 0, 0);
//     const pixel = ctx.getImageData(0, 0, 1, 1).data;
//     console.log("pixel:", pixel);
// };
// img.src = window.NormalMap["img/misc/locations/home/test_n.png"];
