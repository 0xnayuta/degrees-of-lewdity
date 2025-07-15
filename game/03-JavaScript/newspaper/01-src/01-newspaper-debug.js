Newspaper.Debug = class {
	snapshots = {};
	weekOffset = 0;
	$scaleWrap = null;
	$outer = null;
	$debugPanel = null;
	$testOverlay = null;
	articles = setup.NewspaperData?.articles ?? [];
	testArticle = {
		title: "",
		content: "",
		position: "1",
		image: false,
	};

	async init(output, $scaleWrapper) {
		this.output = output;
		this.$scaleWrap = $scaleWrapper;
		this.snapshots[0] = null;

		// scaffold outer container
		this.$outer = $("<div>")
			.addClass("newspaper-debugOuter")
			.on("click", e => e.stopPropagation());

		// build panels
		this.$debugPanel = this.buildDebugPanel();
		this.$testOverlay = this.buildTestOverlay();

		this.$outer.append(this.$debugPanel, this.$testOverlay);
		$(this.output).append(this.$outer);

		this.buildArticleControls();
		this.buildOverlayInputs();

		// initial render & snapshot
		this.$scaleWrap.append(Newspaper.instance.render());
		this.snapshotWeek();
		this.wireCoreHandlers();
		this.wireOverlayHandlers();
		this.wireWeekNav();
	}

	buildDebugPanel() {
		const $debugPanel = $("<div>").attr("id", "newspaper-debug").addClass("newspaper-debug");
		const $header = $("<div>")
			.addClass("newspaper-debugHeader")
			.append($("<h3>").text("Debug"))
			.append(
				$("<a>")
					.addClass("newspaper-debugHide")
					.text("Hide")
					.on("click", () => this.$outer.hide())
			);
		return $debugPanel.append($header);
	}

	buildTestOverlay() {
		return $("<div>").addClass("newspaper-testOverlay").hide();
	}

	buildArticleControls() {
		// selects
		this.$articleSelect = $("<select>").attr("id", "debug-article-select").append('<option value="">- Select an article -</option>');
		this.articles.forEach(({ id, title, category }) => {
			const label = `${id}: ${typeof title === "string" ? title : `[${category}]`}`;
			this.$articleSelect.append($("<option>").val(id).text(label));
		});
		this.$positionSelect = $("<select>").attr("id", "debug-position-select").prop("disabled", true);

		// buttons
		this.$applyButton = $("<button>").attr("id", "newspaper-debugApply").text("Apply").prop("disabled", true);
		this.$resetButton = $("<button>").attr("id", "newspaper-debugReset").text("Reset");
		this.$advanceButton = $("<button>").attr("id", "newspaper-debugAdvanceWeek").text("Advance Week");
		this.$rewindButton = $("<button>").attr("id", "newspaper-debugRewindWeek").text("Rewind Week").prop("disabled", true);
		this.$openEditorButton = $("<button>").attr("id", "newspaper-debugOpenEditor").text("Test Article");

		// assemble into debugPanel
		this.$debugPanel
			.append(this.$articleSelect)
			.append($("<label>").attr("for", "debug-position-select").text("Position: "), this.$positionSelect, "<br>")
			.append(this.$applyButton, this.$resetButton)
			.append($("<hr>"))
			.append(
				$("<h5>").addClass("newspaper-debugSectionHeader").text("Lookahead"),
				$("<p>").addClass("newspaper-debugSectionDesc").text("Temporarily advance or rewind the week.")
			)
			.append(this.$advanceButton, " ", this.$rewindButton)
			.append($("<hr>"))
			.append(this.$openEditorButton);
	}

	buildOverlayInputs() {
		const $overlay = this.$testOverlay;

		// title input
		this.$titleInput = $("<input>").attr({ id: "newspaper-testTitle", type: "text" }).addClass("newspaper-testTitle").val(this.testArticle.title);

		// content area
		this.$contentArea = $("<textarea>").attr({ id: "newspaper-testText", rows: 5 }).addClass("newspaper-testText").val(this.testArticle.content);

		// position dropdown
		this.$overlayPos = $("<select>")
			.attr("id", "debug-test-position")
			.addClass("newspaper-testPosition")
			.append([...Array(7).keys()].map(i => $("<option>").val(i).text(i)))
			.val(this.testArticle.position)
			.trigger("change");

		// placeholder-image checkbox
		this.$imagePlaceholderCheckbox = $("<input>", { type: "checkbox", id: "debug-image-placeholder" }).prop("checked", this.testArticle.image);
		const $imagePlaceholderLabel = $("<label>").attr("for", "debug-image-placeholder").text(" Image placeholder");

		// buttons
		this.$submitButton = $("<button>").attr("id", "newspaper-testSubmit").text("Submit");
		this.$copyButton = $("<button>").attr("id", "newspaper-testCopy").text("Copy");
		this.$resetOverlay = $("<button>").attr("id", "newspaper-testResetOverlay").text("Clear input");
		this.$buttonBar = $("<div>").addClass("newspaper-testButtons").append(this.$submitButton, this.$copyButton, this.$resetOverlay);

		// assemble overlay
		$overlay
			.append($("<h3>").text("Test Article"), this.$titleInput)
			.append($("<p>").addClass("newspaper-testDisclaimer").text("Inject a temporary article to preview the layout."))
			.append($("<label>").attr("for", "newspaper-testTitle").text("Title:"), this.$titleInput)
			.append($("<label>").attr("for", "newspaper-testText").html("Content: <i>(some HTML allowed)</i>"), this.$contentArea)
			.append($("<label>").attr("for", "debug-test-position").text("Position: "), this.$overlayPos)
			.append(this.$imagePlaceholderCheckbox, $imagePlaceholderLabel)
			.append($("<p>").addClass("newspaper-testDisclaimer").text("Note: Test content is temporary and will be lost if you refresh the page."))
			.append(this.$buttonBar);
	}

	wireCoreHandlers() {
		this.$articleSelect.on("change", () => {
			const chosen = this.$articleSelect.val();
			this.$positionSelect.empty();
			this.$applyButton.prop("disabled", !chosen);
			if (!chosen) {
				this.$positionSelect.prop("disabled", true);
				return;
			}
			const art = this.articles.find(a => String(a.id) === chosen);
			if (!art) return;
			if (art.category === "main") {
				this.$positionSelect.append($("<option>").val(0).text(0)).val(0).prop("disabled", true);
			} else {
				for (let i = 1; i <= 6; i++) this.$positionSelect.append($("<option>").val(i).text(i));
				this.$positionSelect.val(1).prop("disabled", false);
			}
		});

		this.$applyButton.on("click", async () => {
			const artId = this.$articleSelect.val();
			const idx = Number(this.$positionSelect.val());
			if (!artId || isNaN(idx)) return;

			const layout = [...Newspaper.instance.layout.filter(id => id !== artId)];
			layout.splice(idx, 0, artId);
			await this.rerenderLayout(layout);
			this.restoreSnapshot();
		});

		this.$resetButton.on("click", () => {
			this.$articleSelect.val("");
			this.$positionSelect.empty().prop("disabled", true);
			this.$applyButton.prop("disabled", true);
			this.restoreSnapshot();
			this.$scaleWrap.empty().append(Newspaper.instance.render());
			this.weekOffset = 0;
			this.$rewindButton.prop("disabled", true);
		});

		this.$openEditorButton.on("click", () => this.$testOverlay.toggle());
	}

	wireWeekNav() {
		this.$advanceButton.on("click", async () => {
			this.weekOffset++;
			const base = this.snapshots[0].state.date;
			const newTs = new DateTime(base).addDays(7 * this.weekOffset).timeStamp;
			const prev = this.snapshots[this.weekOffset - 1].state.date;
			V.newspaper.date = newTs;
			V.newspaper.seed += (newTs - prev) * 0.01;
			Newspaper.instance = new Newspaper.Page(newTs);
			V.newspaper.forecast = Newspaper.instance.generateForecast();
			V.newspaper.queue = Newspaper.instance.generateWeeklyQueue();
			console.log("queue", V.newspaper.queue);
			V.newspaper.layout = [];
			await Newspaper.init();
			console.log("layout", V.newspaper.layout);
			this.$scaleWrap.empty().append(Newspaper.instance.render());
			this.snapshots[this.weekOffset] = { state: V.newspaper.deepCopy(), page: Newspaper.instance };
			this.$rewindButton.prop("disabled", false);
		});

		this.$rewindButton.on("click", () => {
			if (this.weekOffset <= 0) return;
			this.weekOffset--;
			this.restoreSnapshot(this.weekOffset);
			this.$scaleWrap.empty().append(Newspaper.instance.render());
			this.$rewindButton.prop("disabled", this.weekOffset === 0);
		});
	}

	wireOverlayHandlers() {
		this.$overlayPos.on("change", () => {
			const isMain = this.$overlayPos.val() === "0";
			this.$imagePlaceholderCheckbox.prop("disabled", !isMain).prop("checked", isMain);
		});

		this.$copyButton.on("click", () => navigator.clipboard.writeText(this.$contentArea.val()));
		this.$resetOverlay.on("click", () => {
			this.$titleInput.val("");
			this.$contentArea.val("");
			this.$overlayPos.val("1");
			this.testArticle = {
				title: "",
				content: "",
				position: "1",
				image: false,
			};
		});

		this.$submitButton.on("click", async () => {
			const rawTitle = this.$titleInput.val().trim() || "Test Article";
			const escapedTitle = $("<div>").text(rawTitle).html();
			const rawContent = this.$contentArea.val();
			const safeContent = sanitizeHtml(rawContent);
			if (!safeContent) {
				console.error("blocked");
				return;
			}

			const pos = Number(this.$overlayPos.val());
			const debugId = "_debug";

			const tempArt = {
				id: debugId,
				title: escapedTitle,
				category: "article",
				...(pos === 0 ? { main: safeContent } : { short: safeContent }),
			};
			if (this.$imagePlaceholderCheckbox.prop("checked")) {
				tempArt.image = "";
				tempArt.caption = "Placeholder";
			}

			setup.NewspaperData.articles.push(tempArt);

			const layout = [...Newspaper.instance.layout.filter(id => id !== debugId)];
			layout.splice(pos, 0, debugId);
			await this.rerenderLayout(layout);

			// cleanup
			setup.NewspaperData.articles = setup.NewspaperData.articles.filter(a => a.id !== debugId);
			this.restoreSnapshot();
		});

		this.$titleInput.on("input", () => {
			this.testArticle.title = this.$titleInput.val();
		});

		this.$contentArea.on("input", () => {
			this.testArticle.content = this.$contentArea.val();
		});

		this.$overlayPos.on("change", () => {
			const isMain = this.$overlayPos.val() === "0";
			this.$imagePlaceholderCheckbox.prop("disabled", !isMain).prop("checked", isMain);
			this.testArticle.position = this.$overlayPos.val();
			this.testArticle.image = this.$imagePlaceholderCheckbox.prop("checked");
		});

		this.$imagePlaceholderCheckbox.on("change", () => {
			this.testArticle.image = this.$imagePlaceholderCheckbox.prop("checked");
		});
	}

	snapshotWeek() {
		this.snapshots[0] = { state: V.newspaper.deepCopy(), page: Newspaper.instance };
	}

	restoreSnapshot(idx = 0) {
		const snap = this.snapshots[idx];
		if (!snap) return;
		V.newspaper = snap.state.deepCopy();
		Newspaper.instance = snap.page;
	}

	async rerenderLayout(layout) {
		V.newspaper.queue = layout;
		V.newspaper.layout = [];
		Newspaper.instance = null;
		await Newspaper.init();
		this.$scaleWrap.empty().append(Newspaper.instance.render());
	}
};
