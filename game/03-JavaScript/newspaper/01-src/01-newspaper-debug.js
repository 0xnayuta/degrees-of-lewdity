Newspaper.Debug = class {
	snapshots = {};
	weekOffset = 0;
	$scaleWrapper = null;
	$outerContainer = null;
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
		this.$scaleWrapper = $scaleWrapper;
		this.snapshots[0] = null;

		// scaffold outer container
		this.$outerContainer = $("<div>")
			.addClass("newspaper-debugOuter")
			.on("click", e => e.stopPropagation());

		// build panels
		this.$debugPanel = this.buildDebugPanel();
		this.$testOverlay = this.buildTestOverlay();

		this.$outerContainer.append(this.$debugPanel, this.$testOverlay);
		$(this.output).append(this.$outerContainer);

		this.buildArticleControls();
		this.buildOverlayInputs();

		// initial render & snapshot
		this.$scaleWrapper.append(Newspaper.instance.render());
		this.snapshotWeek();
		this.bindControl();
		this.bindOverlay();
		this.bindWeekNav();
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
					.on("click", () => this.$outerContainer.hide())
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
		this.$overlayPositionSelect = $("<select>")
			.attr("id", "debug-test-position")
			.addClass("newspaper-testPosition")
			.append([...Array(7).keys()].map(i => $("<option>").val(i).text(i)))
			.val(this.testArticle.position);

		// placeholder-image checkbox
		this.$imagePlaceholderCheckbox = $("<input>", { type: "checkbox", id: "debug-image-placeholder" }).prop("checked", this.testArticle.image);
		const $imagePlaceholderLabel = $("<label>").attr("for", "debug-image-placeholder").text(" Image placeholder");

		// buttons
		this.$submitButton = $("<button>").attr("id", "newspaper-testSubmit").text("Submit");
		this.$copyButton = $("<button>").attr("id", "newspaper-testCopy").text("Copy");
		this.$resetOverlayButton = $("<button>").attr("id", "newspaper-testResetOverlay").text("Clear input");
		this.$buttonBar = $("<div>").addClass("newspaper-testButtons").append(this.$submitButton, this.$copyButton, this.$resetOverlayButton);

		// assemble overlay
		$overlay
			.append($("<h3>").text("Test Article"))
			.append($("<p>").addClass("newspaper-testDisclaimer").text("Inject a temporary article to preview the layout."))
			.append($("<label>").attr("for", "newspaper-testTitle").text("Title:"), this.$titleInput)
			.append($("<label>").attr("for", "newspaper-testText").html("Content: <i>(some HTML allowed)</i>"), this.$contentArea)
			.append($("<label>").attr("for", "debug-test-position").text("Position: "), this.$overlayPositionSelect)
			.append(this.$imagePlaceholderCheckbox, $imagePlaceholderLabel)
			.append($("<p>").addClass("newspaper-testDisclaimer").text("Note: Test content is temporary and will be lost if you refresh the page."))
			.append(this.$buttonBar);
	}

	bindControl() {
		this.$articleSelect.on("change", () => {
			const selectedId = this.$articleSelect.val();
			const $pos = this.$positionSelect.empty().prop("disabled", true);
			this.$applyButton.prop("disabled", !selectedId);
			if (!selectedId) return;

			const article = this.articles.find(a => String(a.id) === selectedId);
			if (!article) return;

			const hasMain = Object.hasOwn(article, "main") && article.main != null;
			const hasShort = Object.hasOwn(article, "short") && article.short != null;
			const positions = [...(hasMain ? [0] : []), ...(hasShort ? [1, 2, 3, 4, 5, 6] : [])];

			const enabled = positions.length > 0;
			this.$applyButton.prop("disabled", !enabled);
			$pos.prop("disabled", !enabled);
			if (!enabled) return;

			$pos.append(positions.map(i => $("<option>").val(i).text(i)));
			$pos.val(hasMain ? 0 : 1);
		});

		this.$applyButton.on("click", async () => {
			const articleId = this.$articleSelect.val();
			const index = Number(this.$positionSelect.val());
			if (!articleId || isNaN(index)) return;

			const layout = [...Newspaper.instance.layout.filter(id => id !== articleId)];
			layout.splice(index, 0, articleId);
			await this.rerenderLayout(layout);
			this.restoreSnapshot();
		});

		this.$resetButton.on("click", () => {
			this.$articleSelect.val("");
			this.$positionSelect.empty().prop("disabled", true);
			this.$applyButton.prop("disabled", true);
			this.restoreSnapshot();
			this.$scaleWrapper.empty().append(Newspaper.instance.render());
			this.weekOffset = 0;
			this.$rewindButton.prop("disabled", true);
		});

		this.$openEditorButton.on("click", () => this.$testOverlay.toggle());
	}

	bindWeekNav() {
		this.$advanceButton.on("click", async () => {
			this.weekOffset++;
			const baseTimestamp = this.snapshots[0].state.date;
			const newTimestamp = new DateTime(baseTimestamp).addDays(7 * this.weekOffset).timeStamp;
			const previousTimestamp = this.snapshots[this.weekOffset - 1].state.date;
			V.newspaper.date = newTimestamp;
			V.newspaper.seed = Newspaper.wrapSeed((newTimestamp - previousTimestamp) * 0.01);
			Newspaper.instance = new Newspaper.Page(newTimestamp);
			V.newspaper.forecast = Newspaper.instance.generateForecast();
			V.newspaper.queue = Newspaper.instance.generateWeeklyQueue();
			V.newspaper.layout = [];
			await Newspaper.init();;
			this.$scaleWrapper.empty().append(Newspaper.instance.render());
			this.snapshots[this.weekOffset] = { state: V.newspaper.deepCopy(), page: Newspaper.instance };
			this.$rewindButton.prop("disabled", false);
		});

		this.$rewindButton.on("click", () => {
			if (this.weekOffset <= 0) return;
			this.weekOffset--;
			this.restoreSnapshot(this.weekOffset);
			this.$scaleWrapper.empty().append(Newspaper.instance.render());
			this.$rewindButton.prop("disabled", this.weekOffset === 0);
		});
	}

	bindOverlay() {
		this.$copyButton.on("click", () => navigator.clipboard.writeText(this.$contentArea.val()));
		this.$resetOverlayButton.on("click", () => {
			this.$titleInput.val("");
			this.$contentArea.val("");
			this.$overlayPositionSelect.val("1");
			this.testArticle = {
				title: "",
				content: "",
				position: "1",
				image: false,
			};
		});

		this.$submitButton.on("click", async () => {
			const inputTitle = this.$titleInput.val().trim() || "Test Article";
			const escapedTitle = $("<div>").text(inputTitle).html();
			const inputContent = this.$contentArea.val();
			const safeContent = sanitizeHtml(inputContent);
			if (!safeContent) {
				console.error("blocked");
				return;
			}

			const position = Number(this.$overlayPositionSelect.val());
			const debugId = "_debug";

			const tempArticle = {
				id: debugId,
				title: escapedTitle,
				category: "article",
				...(position === 0 ? { main: safeContent } : { short: safeContent }),
			};
			if (this.$imagePlaceholderCheckbox.prop("checked")) {
				tempArticle.image = "";
				tempArticle.caption = "Placeholder";
			}

			setup.NewspaperData.articles.push(tempArticle);

			const layout = [...Newspaper.instance.layout.filter(id => id !== debugId)];
			layout.splice(position, 0, debugId);
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

		// Keep UI and state in sync when position changes
		this.$overlayPositionSelect
			.on("change", () => {
				const isMain = this.$overlayPositionSelect.val() === "0";
				this.$imagePlaceholderCheckbox.prop("disabled", !isMain).prop("checked", isMain);
				this.testArticle.position = this.$overlayPositionSelect.val();
				this.testArticle.image = this.$imagePlaceholderCheckbox.prop("checked");
			})
			.trigger("change");

		this.$imagePlaceholderCheckbox.on("change", () => {
			this.testArticle.image = this.$imagePlaceholderCheckbox.prop("checked");
		});
	}

	snapshotWeek() {
		this.snapshots[0] = { state: V.newspaper.deepCopy(), page: Newspaper.instance };
	}

	restoreSnapshot(index = 0) {
		const snapshot = this.snapshots[index];
		if (!snapshot) return;
		V.newspaper = snapshot.state.deepCopy();
		Newspaper.instance = snapshot.page;
	}

	async rerenderLayout(layout) {
		V.newspaper.queue = layout;
		V.newspaper.layout = [];
		Newspaper.instance = null;
		await Newspaper.init();
		this.$scaleWrapper.empty().append(Newspaper.instance.render());
	}
};
