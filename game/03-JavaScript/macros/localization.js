Macro.add("t", {
	handler() {
		if (this.args.length === 0) return;

		const key = this.args[0];

		let translatedText = setup.t(key);

		if (typeof translatedText !== "string") {
			translatedText = String(translatedText);
		}

		/* eslint-disable-next-line no-unused-vars */
		const _wikifier = new Wikifier(this.output, translatedText);
	},
});
