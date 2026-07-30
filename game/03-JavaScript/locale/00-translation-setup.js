setup.i18n = {
	"en-US": {},
	"ru-RU": {},
};

setup.t = function (key) {
	const defaultLang = "en-US";
	const lang = (V.options && V.options.language) || defaultLang;

	if (setup.i18n && setup.i18n[lang] && setup.i18n[lang][key] !== undefined) {
		return setup.i18n[lang][key];
	}

	// No localization key in language - return english variant
	if (lang !== defaultLang && setup.i18n && setup.i18n[defaultLang] && setup.i18n[defaultLang][key] !== undefined) {
		return setup.i18n[defaultLang][key];
	}

	// Key isn't present
	return key;
};
