/* Turns a new pregnancy record into its children/litter. */

/**
 * The child body base a donor's species produces: "human", "wolf", or "hawk".
 *
 * generateChildren calls this to set the litter's body from the donor.
 * resolvePaternity calls this to test a suspected donor's species against the litter.
 *
 * @param {string} donorSpecies the donor's species: "human", "wolf", "wolfboy", "wolfgirl", "hawk", or "harpy"
 * @returns {"human"|"wolf"|"hawk"}
 */
function childBaseSpecies(donorSpecies) {
	switch (donorSpecies) {
		case "human":
			return "human";
		case "wolf":
		case "wolfboy":
		case "wolfgirl":
			return "wolf";
		case "hawk":
		case "harpy":
			return "hawk";
		default:
			throw new Error(`unknown donor species "${donorSpecies}"`);
	}
}
window.childBaseSpecies = childBaseSpecies;

/**
 * Whether the donor is a monster person, which gives the child the "monster" trait.
 * A monster person's species name always differs from their base species name.
 *
 * @param {string} donorSpecies
 * @returns {boolean}
 */
function isMonsterPerson(donorSpecies) {
	return childBaseSpecies(donorSpecies) !== donorSpecies;
}
window.isMonsterPerson = isMonsterPerson;

/**
 * Litter size for a species. Fertility items nudge this up.
 *
 * Human litters are almost always one. Twins ~8%, triplets ~0.16%.
 *
 * Wolf litters are 4 or 8 pups 10% of the time, 5 or 7 pups 20%, 6 pups 40%.
 *
 * Hawk clutches are 2 or 3 eggs 40% of the time, 1 or 4 eggs 10%.
 *
 * @param {string} base child base species: "human", "wolf", or "hawk"
 * @param {{twin: number, triplet: number}} [boost] fertility boosts from items
 * @returns {number}
 */
function rollLitterSize(base, boost = { twin: 0, triplet: 0 }) {
	const c = PregnancyConstants.childGen;
	if (base === "wolf") return bumpLitter(weightedRandom(...c.wolfLitterWeights), boost.twin, c.wolfLitterMax);
	if (base === "hawk") return bumpLitter(weightedRandom(...c.hawkLitterWeights), boost.twin, c.hawkLitterMax);
	let count = bumpLitter(1, c.humanTwinPercent + boost.twin, 2);
	if (count === 2) count = bumpLitter(count, c.humanTripletPercent + boost.triplet, 3);
	return count;
}
window.rollLitterSize = rollLitterSize;

/**
 * Maybe adds one more child to the litter. Rolls chancePercent out of 100, never past max litter size.
 * Used for human twins, triplets, and the fertility bump on wolf and hawk litters.
 *
 * @param {number} count how many children so far
 * @param {number} chancePercent the % chance of adding one more
 * @param {number} max the most the litter can reach
 * @returns {number} the litter size or the litter size +1
 */
function bumpLitter(count, chancePercent, max) {
	if (count < max && random(1, 100) <= chancePercent) count++;
	return count;
}

/**
 * Fertility boosters and the magic pregnancy tattoo give the PC a litter bump.
 *
 * @returns {{twin: number, triplet: number}} extra percentage points for the twin and triplet rolls
 */
function playerLitterBoost() {
	const c = PregnancyConstants.litterBoost;
	const doses = Math.clamp(V.sexStats.pills.pills["fertility booster"].doseTaken || 0, 0, PregnancyConstants.fertilityMaxDoses);
	let twin = doses * c.fertilityTwinPercentPerDose;
	let triplet = doses * c.fertilityTripletPercentPerDose;
	if (V.skin.pubic.pen === "magic" && V.skin.pubic.special === "pregnancy") {
		twin += c.pregnancyTattooTwinPercent;
		triplet += c.pregnancyTattooTripletPercent;
	}
	return { twin, triplet };
}
window.playerLitterBoost = playerLitterBoost;

/**
 * A parent's gender and colours, read live from their name.
 * The parent is the PC, a known NPC, or an unknown generated donor with no stored details.
 *
 * @param {string} name an NPC's name, or "pc"
 * @returns {{gender: "m"|"f"|"h"|null, hairColour: string|null, eyeColour: string|null, skinColour: string|null}}
 */
function resolveChildParent(name) {
	if (name === "pc") {
		return { gender: V.player.sex, hairColour: V.naturalhaircolour, eyeColour: V.eyeselect, skinColour: Skin.color.natural };
	}
	const npc = C.npc[name];
	if (npc) {
		const hasVagina = npc.vagina !== "none";
		const hasPenis = npc.penis !== "none";
		let gender;
		if (hasVagina && hasPenis) gender = "h";
		else if (hasVagina) gender = "f";
		else if (hasPenis) gender = "m";
		else throw new Error(`parent "${name}" has no genitals`);
		let skinColour = npc.skincolour;
		if (skinColour === "black") skinColour = "dark";
		else if (skinColour === "white") skinColour = "light";
		return { gender, hairColour: npc.hairColour, eyeColour: npc.eyeColour, skinColour };
	}
	// an unknown generated donor has nothing stored to inherit from
	return { gender: null, hairColour: null, eyeColour: null, skinColour: null };
}
window.resolveChildParent = resolveChildParent;

/**
 * A child's gender. Even 50/50 male/female split.
 * A herm parent gives a 1/4 chance of a herm child, or 100% chance for herm self-pregnancy.
 *
 * @param {{gender: string|null}} carrierParent
 * @param {{gender: string|null}} donorParent
 * @param {boolean} sameParent
 * @returns {"m"|"f"|"h"}
 */
function rollChildGender(carrierParent, donorParent, sameParent) {
	const parentIsHerm = carrierParent.gender === "h" || donorParent.gender === "h";
	if (parentIsHerm && (sameParent || random(1, 100) <= PregnancyConstants.childGen.hermChildPercent)) return "h";
	return random(1, 100) <= 50 ? "m" : "f";
}
window.rollChildGender = rollChildGender;

/**
 * The PC's beast and divine transformations, passed to their litter.
 *
 * @returns {{beast: "cat"|"cow"|"wolf"|"bird"|"fox"|null, divine: "angel"|"fallen"|"demon"|null}}
 */
function pcHeritage() {
	let beast = null;
	if (V.cat >= 6) beast = "cat";
	else if (V.cow >= 6) beast = "cow";
	else if (V.wolfgirl >= 6) beast = "wolf";
	else if (V.harpy >= 6) beast = "bird";
	else if (V.fox >= 6) beast = "fox";

	// Fallen needs to be checked before angel
	let divine = null;
	if (V.fallenangel >= 4) divine = "fallen";
	else if (V.angel >= 6) divine = "angel";
	else if (V.demon >= 6) divine = "demon";

	return { beast, divine };
}
window.pcHeritage = pcHeritage;

/**
 * A child's size, weighted toward the pc's build. Half the time it matches, otherwise it's a step
 * smaller or larger. NPC carriers with no build roll evenly.
 *
 * @param {number|undefined} bodySize the carrier's build, 0-3, or undefined
 * @returns {string} "tiny", "small", "normal", or "large"
 */
function rollChildSize(bodySize) {
	const childSizes = PregnancyConstants.genePool.childSize;
	if (bodySize === undefined) return childSizes.random();
	const roll = random(1, 100);
	const step = roll <= PregnancyConstants.childGen.childSizeSameMax ? 0 : roll <= PregnancyConstants.childGen.childSizeSmallerMax ? -1 : 1;
	return childSizes[Math.clamp(bodySize + step, 0, childSizes.length - 1)];
}

/**
 * A child's trait, taken from one parent at random, with a fallback when that parent has none (an unknown donor).
 *
 * @param {*} carrierVal the carrier parent's value for this trait
 * @param {*} donorVal the donor parent's value for this trait
 * @param {Function} fallback produces a value when the donor is not known
 * @returns {*} the inherited trait, or fallback() trait if donor is not known
 */
function inheritTrait(carrierVal, donorVal, fallback) {
	const inherited = random(0, 1) === 0 ? carrierVal : donorVal;
	return inherited || fallback();
}

/**
 * A child's colours. Eye and human hair inherit from a parent, or a colour pool for an unknown parent.
 * Skin inherits or falls back to darkSkinChance. Wolf and hawk hair is fur or feathers.
 *
 * @param {"human"|"wolf"|"hawk"} base
 * @param {object} carrierParent carrier parent
 * @param {object} donorParent donor parent
 * @param {string[]} wolfFur the fur colours a wolf pup can be this litter
 * @returns {{hairColour: string, eyeColour: string, skinColour: string}}
 */
function rollChildColours(base, carrierParent, donorParent, wolfFur) {
	const { eyeColour: eyeColourPool, hawkFeather: hawkFeatherPool, hairColour: hairColourPool } = PregnancyConstants.genePool;
	const eyeColour = inheritTrait(carrierParent.eyeColour, donorParent.eyeColour, () => eyeColourPool.random());
	const skinColour = inheritTrait(carrierParent.skinColour, donorParent.skinColour, () => (random(1, 100) <= V.settings.darkSkinChance ? "dark" : "light"));
	let hairColour;
	if (base === "wolf") hairColour = wolfFur.random();
	else if (base === "hawk") hairColour = hawkFeatherPool.random();
	else hairColour = inheritTrait(carrierParent.hairColour, donorParent.hairColour, () => hairColourPool.random());
	return { hairColour, eyeColour, skinColour };
}
window.rollChildColours = rollChildColours;

/**
 * Create the child/children for a new pregnancy record. Called once per pregnancy from createPregnancy.
 *
 * @param {number} pregnancyId
 */
function generateChildren(pregnancyId) {
	const pregnancy = V.pregnancies[pregnancyId];
	const base = childBaseSpecies(pregnancy.donorSpecies);
	const isMonster = isMonsterPerson(pregnancy.donorSpecies);
	let litterSize = rollLitterSize(base, pregnancy.carrier === "pc" ? playerLitterBoost() : undefined);
	if (base === "hawk" && pregnancy.carrier === "pc" && V.harpyEggs) {
		litterSize = V.harpyEggs.count;
		delete V.harpyEggs;
	}
	const carrierParent = resolveChildParent(pregnancy.carrier);
	const donorParent = resolveChildParent(pregnancy.donor);
	const sameParent = pregnancy.carrier === pregnancy.donor;
	// The player's beast/divine transformations only pass down when the player is actually a parent.
	const heritage = pregnancy.carrier === "pc" || pregnancy.donor === "pc" ? pcHeritage() : { beast: null, divine: null };
	const bodySize = pregnancy.carrier === "pc" ? V.bodysize : undefined;
	// The Black Wolf's pups are always black. Every other wolf rolls the fur pool.
	const wolfFur = pregnancy.carrier === "Black Wolf" || pregnancy.donor === "Black Wolf" ? ["black"] : PregnancyConstants.genePool.wolfFur;

	// Identical twins/triplets rolling for humans.
	// Self-impregnation births always make identical twins/triplets.
	// Twins have a 1/3 chance of being identical.
	// Triplets have a ~2/3 chance of being all fraternal, ~22% chance of two being identical, and ~11% chance of all being identical.
	let identicalCount = 0;
	if (base === "human" && litterSize > 1) {
		if (sameParent) {
			identicalCount = litterSize;
		} else if (random(1, 100) <= PregnancyConstants.childGen.identicalMultiplePercent) {
			identicalCount = 2;
			if (litterSize > 2 && random(1, 100) <= PregnancyConstants.childGen.identicalMultiplePercent) identicalCount = 3;
		}
	}

	const rollChildTraits = () => {
		const colours = rollChildColours(base, carrierParent, donorParent, wolfFur);
		const features = {
			beastTransform: heritage.beast,
			divineTransform: heritage.divine,
			hairColour: colours.hairColour,
			eyeColour: colours.eyeColour,
			skinColour: colours.skinColour,
			size: rollChildSize(bodySize),
		};
		if (isMonster) features.monster = "monster";
		return { gender: rollChildGender(carrierParent, donorParent, sameParent), features };
	};

	// Identical siblings are copies of one generated child and share an id that links them.
	// Every other child is rolled on its own.
	// identicalCount is 0, 2, or 3 (never exactly 1), so "there are identicals" is a single condition.
	const hasIdenticals = identicalCount > 1;
	const identicalId = hasIdenticals ? pregnancyId : null;
	const original = hasIdenticals ? rollChildTraits() : null;
	for (let i = 0; i < litterSize; i++) {
		if (i < identicalCount) {
			createChild(pregnancyId, base, clone(original.features), original.gender, identicalId);
		} else {
			const child = rollChildTraits();
			createChild(pregnancyId, base, child.features, child.gender, null);
		}
	}
}
window.generateChildren = generateChildren;
