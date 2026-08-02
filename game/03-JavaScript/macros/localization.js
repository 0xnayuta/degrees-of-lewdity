Macro.add("t", {
	tags: null,
	handler() {
		const defaultLang = "en-US";
		let text;

		if (V.options.language === defaultLang) {
			text = this.payload[0].contents;
		} else {
			if (this.args.length !== 1) {
				return;
			}

			text = setup.t(this.args[0]);

			if (typeof text !== "string") {
				text = String(text);
			}
		}

		/* eslint-disable-next-line no-unused-vars */
		const _wikifier = new Wikifier(this.output, text);
	},
});
