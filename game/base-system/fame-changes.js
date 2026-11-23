/* global paramError */

/*
	Always use these fame functions rather than modifying the $fame var directly. Always use the specific fame functions / widgets rather than the generic Fame.change() function if you know what kind of fame you need to change.
*/

/**
 * If the PC can be recognised, meaning their face isn't covered or masked and they aren't at a gloryhole.
 *
 * @returns {boolean}
 */
function playerRecognisable() {
	return V.face !== "covered" && !V.worn.face.type.includes("mask") && !V.gloryhole;
}

/**
 * Changes exhibitionism fame, unless the PC can't be recognised or they're alone with an NNPC who won't gossip.
 * Used when people catch the PC exposed or being lewd, such as flashing people or orgasming in public.
 *
 * @param {number} amount
 * @param {boolean} [force] Forces the change regardless of the normal guards
 */
function fameExhibitionism(amount, force) {
	if (V.statFreeze) return;
	if (!Number.isFinite(amount)) paramError("Fame.exhibitionism", "amount", amount, "Expected a number.");
	if (amount !== 0) {
		if ((playerRecognisable() && !(V.npc.length === 1 && ["Eden", "Robin", "Kylar", "Sydney", "Gwylan", "Morgan"].includes(V.npc[0]))) || force) {
			V.fame.exhibitionism += amount;
			V.fame.exhibitionism = Math.clamp(V.fame.exhibitionism, 0, 2000);
		}
	}
}
DefineMacro("fameexhibitionism", fameExhibitionism);

/**
 * Changes prostitution fame, unless the PC can't be recognised.
 * Used when the PC sells sex, such as at the brothel.
 *
 * @param {number} amount
 * @param {boolean} [force] Forces the change regardless of the normal guards
 */
function fameProstitution(amount, force) {
	if (V.statFreeze) return;
	if (!Number.isFinite(amount)) paramError("Fame.prostitution", "amount", amount, "Expected a number.");
	if (amount !== 0) {
		if (playerRecognisable() || force) {
			V.fame.prostitution += amount;
			V.fame.prostitution = Math.clamp(V.fame.prostitution, 0, 2000);
		}
	}
}
DefineMacro("fameprostitution", fameProstitution);

/**
 * Changes bestiality fame, unless the PC can't be recognised.
 * Used when having sex with animals or monsters.
 *
 * @param {number} amount
 * @param {boolean} [force] Forces the change regardless of the normal guards
 */
function fameBestiality(amount, force) {
	if (V.statFreeze) return;
	if (!Number.isFinite(amount)) paramError("Fame.bestiality", "amount", amount, "Expected a number.");
	if (amount !== 0) {
		if (playerRecognisable() || force) {
			V.fame.bestiality += amount;
			V.fame.bestiality = Math.clamp(V.fame.bestiality, 0, 2000);
		}
	}
}
DefineMacro("famebestiality", fameBestiality);

/**
 * Changes rape fame, unless the PC can't be recognised or they're alone with an NNPC who won't gossip.
 * Used when having non-consensual sex in public.
 *
 * @param {number} amount
 * @param {boolean} [force] Forces the change regardless of the normal guards
 */
function fameRape(amount, force) {
	if (V.statFreeze) return;
	if (!Number.isFinite(amount)) paramError("Fame.rape", "amount", amount, "Expected a number.");
	if (amount !== 0) {
		if ((playerRecognisable() && !(V.npc.length === 1 && ["Eden", "Robin", "Kylar", "Sydney", "Gwylan", "Morgan"].includes(V.npc[0]))) || force) {
			V.fame.rape += amount;
			V.fame.rape = Math.clamp(V.fame.rape, 0, 2000);
		}
	}
}
DefineMacro("famerape", fameRape);

/**
 * Changes sex fame, unless the PC can't be recognised or they're alone with an NNPC who won't gossip.
 * Used when having consensual sex in public.
 *
 * @param {number} amount
 * @param {boolean} [force] Forces the change regardless of the normal guards
 */
function fameSex(amount, force) {
	if (V.statFreeze) return;
	if (!Number.isFinite(amount)) paramError("Fame.sex", "amount", amount, "Expected a number.");
	if (amount !== 0) {
		if ((playerRecognisable() && !(V.npc.length === 1 && ["Eden", "Robin", "Sydney", "Gwylan", "Morgan"].includes(V.npc[0]))) || force) {
			V.fame.sex += amount;
			V.fame.sex = Math.clamp(V.fame.sex, 0, 2000);
		}
	}
}
DefineMacro("famesex", fameSex);

/**
 * Changes pregnancy fame, unless the PC can't be recognised or their belly isn't visible.
 * Used when npcs comment on the PC's pregnancy, or when the PC gives birth.
 *
 * @param {number} amount
 * @param {boolean} [force] Forces the change regardless of the normal guards
 */
function famePregnancy(amount, force) {
	if (V.statFreeze) return;
	if (!Number.isFinite(amount)) paramError("Fame.pregnancy", "amount", amount, "Expected a number.");
	if (amount !== 0 && (playerBellyVisible() || force)) {
		if (playerRecognisable() || force) {
			V.fame.pregnancy += amount;
			V.fame.pregnancy = Math.clamp(V.fame.pregnancy, 0, Math.clamp(playerNormalPregnancyTotal() + 1, 1, 8) * 250);
		}
	}
}
DefineMacro("famepregnancy", famePregnancy);

/**
 * Changes impreg fame, unless the PC can't be recognised.
 * Used when word gets out that the PC has fathered children, such as a classmate confronting them about it.
 *
 * @param {number} amount
 * @param {boolean} [force] Forces the change regardless of the normal guards
 */
function fameImpreg(amount, force) {
	if (V.statFreeze) return;
	if (!Number.isFinite(amount)) paramError("Fame.impreg", "amount", amount, "Expected a number.");
	if (amount !== 0) {
		if (playerRecognisable() || force) {
			V.fame.impreg += amount;
			V.fame.impreg = Math.clamp(V.fame.impreg, 0, 2000);
		}
	}
}
DefineMacro("fameimpreg", fameImpreg);

/**
 * Changes good fame, unless the PC can't be recognised.
 * Used when the PC does good deeds, such as helping at the soup kitchen.
 *
 * @param {number} amount
 * @param {boolean} [force] Forces the change regardless of the normal guards
 */
function fameGood(amount, force) {
	if (V.statFreeze) return;
	if (!Number.isFinite(amount)) paramError("Fame.good", "amount", amount, "Expected a number.");
	if (amount !== 0) {
		if (playerRecognisable() || force) {
			V.fame.good += amount;
			V.fame.good = Math.clamp(V.fame.good, 0, 2000);
		}
	}
}
DefineMacro("famegood", fameGood);

/**
 * Changes business fame, unless the PC can't be recognised.
 * Used when the PC promotes a business, such as the cafe.
 *
 * @param {number} amount
 * @param {boolean} [force] Forces the change regardless of the normal guards
 */
function fameBusiness(amount, force) {
	if (V.statFreeze) return;
	if (!Number.isFinite(amount)) paramError("Fame.business", "amount", amount, "Expected a number.");
	if (amount !== 0) {
		if (playerRecognisable() || force) {
			V.fame.business += amount;
			V.fame.business = Math.clamp(V.fame.business, 0, 2000);
		}
	}
}
DefineMacro("famebusiness", fameBusiness);

/**
 * Changes scrap fame, unless the PC can't be recognised.
 * Used when the PC fights back against an attacker.
 *
 * @param {number} amount
 * @param {boolean} [force] Forces the change regardless of the normal guards
 */
function fameScrap(amount, force) {
	if (V.statFreeze) return;
	if (!Number.isFinite(amount)) paramError("Fame.scrap", "amount", amount, "Expected a number.");
	if (amount !== 0) {
		if (playerRecognisable() || force) {
			V.fame.scrap += amount;
			V.fame.scrap = Math.clamp(V.fame.scrap, 0, 2000);
		}
	}
}
DefineMacro("famescrap", fameScrap);

/**
 * Changes social fame, unless the PC can't be recognised.
 * Used when the PC mingles with the elite, such as at Avery's events.
 *
 * @param {number} amount
 * @param {boolean} [force] Forces the change regardless of the normal guards
 */
function fameSocial(amount, force) {
	if (V.statFreeze) return;
	if (!Number.isFinite(amount)) paramError("Fame.social", "amount", amount, "Expected a number.");
	if (amount !== 0) {
		if (playerRecognisable() || force) {
			V.fame.social += amount;
			V.fame.social = Math.clamp(V.fame.social, 0, 2000);
		}
	}
}
DefineMacro("famesocial", fameSocial);

/**
 * Changes model fame, unless the PC can't be recognised.
 * Used when the PC models, such as at the photography studio.
 *
 * @param {number} amount
 * @param {boolean} [force] Forces the change regardless of the normal guards
 */
function fameModel(amount, force) {
	if (V.statFreeze) return;
	if (!Number.isFinite(amount)) paramError("Fame.model", "amount", amount, "Expected a number.");
	if (amount !== 0) {
		if (playerRecognisable() || force) {
			V.fame.model += amount;
			V.fame.model = Math.clamp(V.fame.model, 0, 2000);
		}
	}
}
DefineMacro("famemodel", fameModel);

/**
 * Changes the input fameType's fame. Always use the specific fame functions / widgets if you know what kind of fame is being modified.
 *
 * @param {FameTypes} fameType
 * @param {number} amount
 * @param {boolean} [force] Forces the change regardless of the normal guards
 */
function changeFame(fameType, amount, force) {
	switch (fameType) {
		case "exhibitionism":
			fameExhibitionism(amount, force);
			break;
		case "prostitution":
			fameProstitution(amount, force);
			break;
		case "bestiality":
			fameBestiality(amount, force);
			break;
		case "rape":
			fameRape(amount, force);
			break;
		case "sex":
			fameSex(amount, force);
			break;
		case "pregnancy":
			famePregnancy(amount, force);
			break;
		case "impreg":
			fameImpreg(amount, force);
			break;
		case "good":
			fameGood(amount, force);
			break;
		case "business":
			fameBusiness(amount, force);
			break;
		case "scrap":
			fameScrap(amount, force);
			break;
		case "social":
			fameSocial(amount, force);
			break;
		case "model":
			fameModel(amount, force);
			break;
		default:
			throw new Error(`Fame.change: unexpected fameType "${fameType}"`);
	}
}
DefineMacro("fame", changeFame);

/**
 * Returns the total of all of the PC's fame.
 *
 * @returns {number}
 */
function fameTotal() {
	let result = 0;
	for (const key in V.fame) {
		result += V.fame[key];
	}
	return result;
}

/**
 * Returns the total of the input fame types.
 *
 * @param {...FameTypes} fameTypes
 * @returns {number}
 */
function fameSum(...fameTypes) {
	let result = 0;
	fameTypes.forEach(fameType => (result += V.fame[fameType]));
	return result;
}

const Fame = {
	exhibitionism: fameExhibitionism,
	prostitution: fameProstitution,
	bestiality: fameBestiality,
	rape: fameRape,
	sex: fameSex,
	pregnancy: famePregnancy,
	impreg: fameImpreg,
	good: fameGood,
	business: fameBusiness,
	scrap: fameScrap,
	social: fameSocial,
	model: fameModel,
	change: changeFame,
	total: fameTotal,
	sum: fameSum,
};
window.Fame = Fame;
