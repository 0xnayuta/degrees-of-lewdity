Macro.add("t", {
	tags: null,
	handler() {
		const defaultLang = "en-US";
		const defaultText = this.payload[0].contents;
		const translationKey = this.args[0];
		let text;

		if (V.options.language === defaultLang) {
			text = defaultText;
		} else {
			if (translationKey) {
				const translated = setup.t(defaultText, translationKey);
				text = translated !== undefined && translated !== null ? String(translated) : defaultText;
			} else {
				text = defaultText;
			}
		}

		/* eslint-disable-next-line no-unused-vars */
		const _wikifier = new Wikifier(this.output, text);
	},
});
