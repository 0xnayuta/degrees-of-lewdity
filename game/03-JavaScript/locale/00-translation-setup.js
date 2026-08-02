setup.i18n = {
	"ru-RU": {},
};

setup.t = function (key) {
	const lang = V.options && V.options.language;

	if (setup.i18n && setup.i18n[lang] && setup.i18n[lang][key] !== undefined) {
		return setup.i18n[lang][key];
	}

	// Key isn't present
	return key;
};
