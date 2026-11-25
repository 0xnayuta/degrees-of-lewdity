/**
 * Spends VrelCoins on a feat boost
 *
 * @param {string} upgradeName Key in V.featsBoosts.upgrades
 * @param {number} cost VrelCoins to spend, negative to refund
 */
function addFeatBoostCost(upgradeName, cost) {
	V.featsBoosts.upgrades[upgradeName] += cost;
	V.featsBoosts.pointsUsed += cost;
}
window.addFeatBoostCost = addFeatBoostCost;

/**
 * Greys out the special clothing sets and seeds that can't be afforded and switches their tooltips to "Not enough VrelCoins!"
 */
function disableUnaffordableFeatBoostUnlocks() {
	const coinsLeft = V.feats.allSaves.points - V.featsBoosts.pointsUsed;
	$("[data-feat-cost]").each(function () {
		const $checkbox = $(this).find("input[type=checkbox]");
		const $name = $(this).find(".feat-boost-unlock-name");
		const canAfford = $checkbox.prop("checked") || Number(this.dataset.featCost) <= coinsLeft;
		if (canAfford) {
			$checkbox.tooltip({ message: $checkbox.attr("data-tooltip-message") }).tooltip($checkbox.prop("disabled") ? "enable" : "disable");
		} else {
			$checkbox.prop("disabled", true).tooltip({ message: this.dataset.tooltipUnaffordable });
		}
		const nameTooltip = canAfford ? this.dataset.tooltipAffordable : this.dataset.tooltipUnaffordable;
		if (nameTooltip) {
			$name.addClass("tooltip-anchor").tooltip({ message: nameTooltip });
		} else {
			$name.removeClass("tooltip-anchor").tooltip("disable").removeAttr("tooltip").css("cursor", "");
		}
	});
}
window.disableUnaffordableFeatBoostUnlocks = disableUnaffordableFeatBoostUnlocks;

$(document).on("change.featBoostUnlock", "[data-feat-cost] input[type=checkbox]", function () {
	const unlock = this.closest("[data-feat-cost]");
	const cost = Number(unlock.dataset.featCost);
	addFeatBoostCost(unlock.dataset.upgradeName, this.checked ? cost : -cost);
	$("#featsPurchasedBoosts").empty().wiki("<<featsPurchasedBoosts>>");
	disableUnaffordableFeatBoostUnlocks();
});

$(document).on("change.featBoostJump", "#listbox--upgradenameid", function () {
	$("#featsPointsMenu").empty().wiki("<<featsPointsMenu>>");
});
