/* TODO: English uses "is" as a state.
 * It's possible to use "выглядит <наречие/кр. прил.>" everywhere (it's gender-neutral for Russian)
 * but is will be better to make some kind of macros that takes gender and values
 * for different genders. For example: "Он разочарован" and "Она разочарована".
 * For men it uses "разочарован" and "разочарована" for women.
 * See additional "a" at the end of the world. */
Object.assign(setup.i18n["ru-RU"], {
	"base-combat-state-look": "выглядят",
	"base-combat-state-looks": "выглядит",
	"base-combat-state-does-not-look": "не выглядит",
	"base-combat-state-do-not-look": "не выглядят",
	// Those are empty cause of Russian grammar (not used).
	"base-combat-state-is": "",
	"base-combat-state-are": "",

	"base-combat-state-anger-pissed-of": "<<He>> в бешенстве.",
	"base-combat-state-anger-furious": "<<He>> _looks яростно.",
	"base-combat-state-anger-angry": "<<He>> _looks злобно.",
	"base-combat-state-anger-frustrated": "<<He>> _looks разочарованно.",
	"base-combat-state-anger-irritated": "<<He>> _looks раздражённо.",
	"base-combat-state-anger-tense": "<<He>> _looks напражённо.",
	"base-combat-state-anger-calm": "<<He>> _looks спокойно.",
});
