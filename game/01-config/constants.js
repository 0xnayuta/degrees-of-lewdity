const constants = {
	penisSize: {
		max: 6,
		min: 0,
	},
	// To be replaced with "C.state.fatigue.max"
	tiredness: {
		max: 2000,
		min: 0,
	},
	weather: {
		fogParticles: {
			// Caps for fog particle counts after location band scaling. The area where fog can spawn is larger in some locations than others,
			// so the number of fog particles needs to be adjusted based on that, or else fog density will be inconsistent across different
			// locations, even when there is the same amount of Weather.fog.
			globalLocationCapMax: 40,
			globalLocationCapMin: 10,
		},
	},
	badEndTimeRules: {
		badEndsWithTimeObfuscation: ["Underground Farm", "Wolf Cave", "Underground Dungeon", "Mines"],
		hoursToLoseMinutes: 2,
		hoursToLoseTime: 8,
	},

	/**
	 * Minimum and maximum values for the player's stats
	 * 
	 * Stored in alphabetical order
	 * 
	 * Use the C.variable_path.max and C.variable_path.min constants when adjusting a stat's value.
	 * 
	 * When checking if the player's stats reach a certain threshold, treat it as a percentage of the stat's maximum value.
	 * So, if a passage needs the player's alcohol to be over 80%, then the if statement should say:
	 *   "$alcohol gte $alcoholmax * 0.8"
	 * Instead of:
	 *   "$alcohol gte 800"
	 * 
	 * And if a function needs the player's alcohol to be over 80%, then the if statement should say:
	 *   "V.alcohol >= C.state.alcohol.max * 0.8"
	 * Instead of:
	 *   "V.alcohol >= 800"
	 * 
	 * Code that changes a stat based on the value of another stat will be changed to say:
	 * 	"V.arousal += C.state.alcohol * 0.1 * C.state.arousal.max / C.state.alcohol.max"
	 * Instead of:
	 * 	"V.arousal += C.state.alcohol * 0.1"
	 * 
	 * This allows any changes to either stat's max or min values to automatically scale how much either stat will be
	 * influenced by the other.
	 * 
	 * The "$wraith.will" variable will need to be adjusted to depend on a proportion of willpower.max.
	 */

	// Character State Constants
	/**
	 * Variable name: "drunk"
	 */
	alcohol: {
		max: 1000,
		min: 0,
	},
	arousal: {
		max: 10000,
		min: 0,
	},
	control: {
		max: 1000,
		min: 0,
	},
	/**
	 * Variable name: "drugged"
	 */
	drugs: {
		max: 1000,
		min: 0,
	},
	/**
	 * Variable name: "tiredness"
	 */
	fatigue: {
		max: 2000,
		min: 0,
	},
	/**
	 * Variable name: "hallucinogen"
	 */
	hallucinogens: {
		max: 1000,
		min: 0,
	},
	pain: {
		max: 200,
		min: 0,
	},
	stress: {
		max: 10000,
		min: 0,
	},
	trauma: {
		max: 5000,
		min: 0,
	},

	// Core Characteristic Constants
	/**
	 * Awareness has a negative range where it turns into Innocence. "Base" will refer to 0 Awareness.
	 */
	awareness: {
		max: 1000,
		base: 0,
		min: -200,
	},
	beauty: {
		max: 10000,
		min: 0,
	},
	deviancy: {
		max: 100,
		min: 0,
	},
	exhibitionism: {
		max: 100,
		min: 0,
	},
	/**
	 * The player's body can currently be 1 of 4 sizes:
	 * 
	 * Tiny, Small, Normal, and Large
	 */
	physique: {
		absoluteMax: 20000,
		largeMax: 15000,
		normalMax: 12000,
		smallMax: 9000,
		tinyMax: 6000,
		min: 0,
	},
	promiscuity: {
		max: 100,
		min: 0,
	},
	purity: {
		min: 0,
		nonVirginMax: 999,
		virginMax: 1000,
	},
	willpower: {
		max: 1000,
		min: 0,
	},

	// Secondary Characteristic Constants
	fringeLength: {
		max: 1000,
		min: 0,
	},
	grace: {
		max: 100,
		min: 0,
	},
	hairLength: {
		max: 1000,
		min: 0,
	},
	masochism: {
		max: 1000,
		min: 0,
	},
	sadism: {
		max: 1000,
		min: 0,
	},
	/**
	 * Variable name: "submissive"
	 */
	submissiveness: {
		max: 2000,
		min: 0,
	},
	
	// Fluid Production Constants
	milkVolume: {
		cowMax: 6000,
		normalMax: 3000,
		min: 0,
	},
	semenVolume: {
		cowMax: 6000,
		normalMax: 3000,
		min: 0,
	},
	/**
	 * It seems there's no upper limit on the amount of fluid a vagina can produce when it orgasms. May be added in
	 * a future update.
	 * 
	 * See "game\base-system\orgasm.twee" for more details.
	 */

	// Core Skill Constants
	athletics: {
		max: 1000,
		min: 0,
	},
	/**
	 * Variable name: "danceskill"
	 */
	dance: {
		max: 1000,
		min: 0,
	},
	housekeeping: {
		max: 1000,
		min: 0,
	},
	skulduggery: {
		max: 1000,
		min: 0,
	},
	/**
	 * Variable name: "swimmingskill"
	 */
	swimming: {
		max: 1000,
		min: 0,
	},
	tending: {
		max: 1000,
		min: 0,
	},

	// School Skill Constants
	english: {
		max: 1000,
		min: 0,
	},
	history: {
		max: 1000,
		min: 0,
	},
	maths: {
		max: 1000,
		min: 0,
	},
	science: {
		max: 1000,
		min: 0,
	},

	// Sex Skill Constants
	/**
	 * Variable name: "analskill"
	 */
	anal: {
		max: 1000,
		min: 0,
	},
	/**
	 * Variable name: "bottomskill"
	 */
	buttocks: {
		max: 1000,
		min: 0,
	},
	/**
	 * Variable name: "chestskill"
	 */
	chest: {
		max: 1000,
		min: 0,
	},
	/**
	 * Variable name: "feetskill"
	 */
	feet: {
		max: 1000,
		min: 0,
	},
	/**
	 * Variable name: "handskill"
	 */
	hands: {
		max: 1000,
		min: 0,
	},
	/**
	 * Variable name: "oralskill"
	 */
	oral: {
		max: 1000,
		min: 0,
	},
	/**
	 * Variable name: "seductionskill"
	 */
	seduction: {
		max: 1000,
		min: 0,
	},
	/**
	 * Variable name: "thighskill"
	 */
	thighs: {
		max: 1000,
		min: 0,
	},
	/**
	 * Variable name: "vaginalskill"
	 */
	vaginal: {
		max: 1000,
		min: 0,
	},

	// Negative Fame Constants
	bestiality: {
		max: 2000,
		min: 0,
	},
	exhibitionism: {
		max: 2000,
		min: 0,
	},
	/**
	 * Variable name: "impreg"
	 */
	impregnation: {
		max: 2000,
		min: 0,
	},
	pimp: {
		max: 2000,
		min: 0,
	},
	pregnancy: {
		max: 2000,
		min: 0,
	},
	prostitution: {
		max: 2000,
		min: 0,
	},
	rape: {
		max: 2000,
		min: 0,
	},
	sex: {
		max: 2000,
		min: 0,
	},

	// Positive Fame Constants
	business: {
		max: 2000,
		min: 0,
	},
	/**
	 * Variable name: "scrap"
	 */
	combat: {
		max: 2000,
		min: 0,
	},
	/**
	 * Variable name: "good"
	 */
	kindness: {
		max: 2000,
		min: 0,
	},
	model: {
		max: 2000,
		min: 0,
	},
	/**
	 * Variable name: "social"
	 */
	socialite: {
		max: 2000,
		min: 0,
	},
	
	// Crime Fame Constants
	/**
	 * Original values obtained from "game\03-JavaScript\alias2.js"
	 */
	crime: {
		max: 10000,
		min: 0,
		/**
		 * If the player commits too much of the same type of crime in one day, they leave behind more evidence.
		 * 
		 * The dawnCheck() function in "game\03-JavaScript\time.js" will increase the player's crime by an additional
		 * 10% if their daily crime stat is creater than "spree".
		 */
		spree: 1000,
	},
};

/* Hoist Constants to the top (For statevars.js) */
// eslint-disable-next-line no-var
var Constants = ConstantsLoader.init(constants);
window.Constants = Constants;
