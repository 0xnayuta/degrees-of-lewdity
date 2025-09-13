Macro.add("newspaper", {
	async handler() {
		if (!V.newspaper) return;

		const $newspaper = $("<div>").addClass("newspaper-container");
		const $scaleWrapper = $("<div>")
			.addClass("newspaper-scaleWrapper")
			.on("click", e => e.stopPropagation());
		$newspaper.append($scaleWrapper);
		this.output.append($newspaper[0]);

		if (!Newspaper.instance?.cachedPaper) {
			const $loading = $("<div>").addClass("newspaper-loading").text("Loading...");
			$scaleWrapper.append($loading);
			await Newspaper.init();
			$loading.remove();
		}

		if (V.debug) {
			if (!(Newspaper.debug instanceof Newspaper.Debug)) {
				Newspaper.debug = new Newspaper.Debug();
			}
			await Newspaper.debug.init(this.output, $scaleWrapper);
			return;
		}

		$scaleWrapper.append(Newspaper.instance.render());
	},
});

Macro.add("newspaperButton", {
	handler() {
		if (!V.newspaper) return;
		const $link = $("<button id='newspaper-button'>").addClass("link-internal macro-button").text("NEWSPAPER");
		this.output.append($link[0]);

		requestAnimationFrame(() => {
			if (!V.newspaper.bought) {
				Newspaper.disableLink();
			} else {
				Newspaper.enableLink();
			}
		});
	},
});
