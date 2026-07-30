/* TODO: English uses "is" as a state.
 * It's possible to use "выглядит <наречие/кр. прил.>" everywhere (it's gender-neutral for Russian)
 * but is will be better to make some kind of macros that takes gender and values
 * for different genders. For example: "Он разочарован" and "Она разочарована".
 * For men it uses "разочарован" and "разочарована" for women.
 * See additional "a" at the end of the world. */
Object.assign(setup.i18n["ru-RU"], {
	"base-combat-state-anger-pissed-of": "<<He>> выглядит невероятно разозленным.",
	"base-combat-state-anger-furious": "<<He>> выглядит яростно.",
	"base-combat-state-anger-angry": "<<He>> выглядит злобно.",
	"base-combat-state-anger-frustrated": "<<He>> выглядит разочарованно.",
	"base-combat-state-anger-irritated": "<<He>> выглядит раздражённо.",
	"base-combat-state-anger-tense": "<<He>> выглядит напражённо.",
	"base-combat-state-anger-calm": "<<He>> выглядит спокойно.",
});
