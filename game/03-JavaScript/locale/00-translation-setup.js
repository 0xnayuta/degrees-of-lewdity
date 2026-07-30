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
	if (lang !== "en-US" && setup.i18n && setup.i18n["en-US"] && setup.i18n["en-US"][key] !== undefined) {
		return setup.i18n["en-US"][key];
	}

	// Key isn't present
	return key;
};
