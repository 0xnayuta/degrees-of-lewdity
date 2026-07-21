// Very basic fishing system, essentially my first draft. The goal is to correctly react to the current of the fish, but this turned into a pick-the-correct-option game, which gets boring fast. At one point the goal was to control the depth of the fish, since having the fish at the surface would make it thrash -> thrashing would make noise -> noise attracts bad attention. But that was janky, and so I dropped it.
setup.combat1Fish = {
	herring: { name: "herring", size: 45, maxStamina: 2 },
	perch: { name: "perch", size: 60, maxStamina: 3 },
	haddock: { name: "haddock", size: 90, maxStamina: 4 },
	salmon: { name: "salmon", size: 120, maxStamina: 5 },
	cod: { name: "cod", size: 140, maxStamina: 5 },
	pike: { name: "pike", size: 130, maxStamina: 6 },
};

function startCombat1(fishKey, huge) {
	const fish = setup.combat1Fish[fishKey];
	const startingStamina = huge ? fish.maxStamina + 1 : fish.maxStamina;
	V.combat1 = {
		fishKey,
		fishName: fish.name,
		fishSize: fish.size,
		huge,
		fishStamina: startingStamina,
		startingStamina,
		lineHealth: 3,
		fishDistance: 20 + random(-5, 10),
		fishAction: "",
		playerAction: "",
		fishDepth: random(1, 3),
	};
}
window.startCombat1 = startCombat1;

function endCombat1() {
	V.combat1 = {};
}
window.endCombat1 = endCombat1;

function combat1Effects() {
	const combat = V.combat1;

	if (combat.fishAction === "rest") {
		combat.fishStamina = Math.min(combat.fishStamina + 1, combat.startingStamina);
		if (combat.playerAction === "reel") {
			combat.fishDistance -= 15;
		}
	} else if (combat.fishAction === "thrash") {
		combat.fishStamina -= 1;
		combat.lineHealth -= random(0, 1);
		if (combat.playerAction === "reel") {
			combat.fishDistance -= 5;
			combat.fishDepth = Math.max(combat.fishDepth - 1, 1);
		}
	} else if (combat.fishAction === "dive") {
		combat.fishStamina -= 1;
		if (combat.playerAction === "reel") {
			combat.lineHealth -= 1;
		} else if (combat.playerAction === "slack") {
			combat.fishDistance += 5;
		} else if (combat.playerAction === "hold") {
			combat.lineHealth -= 1;
		}
		combat.fishDepth = Math.min(combat.fishDepth + 1, 3);
	} else if (combat.fishAction === "swim") {
		combat.fishStamina -= 1;
		if (combat.playerAction === "reel") {
			combat.fishDistance -= 5;
			combat.lineHealth -= 1;
			combat.fishDepth = Math.max(combat.fishDepth - 1, 1);
		} else if (combat.playerAction === "slack") {
			combat.fishDistance += 5;
		}
	}
}
window.combat1Effects = combat1Effects;

function combat1Action() {
	const combat = V.combat1;

	if (combat.fishStamina === 0) {
		combat.fishAction = "rest";
	} else if (combat.fishStamina === 1 && random(1, 3) === 1) {
		combat.fishAction = "rest";
	} else if (combat.fishDepth === 3) {
		combat.fishAction = either("swim", "rest");
	} else if (combat.fishDepth === 1 && combat.playerAction === "reel") {
		combat.fishAction = "thrash";
	} else {
		combat.fishAction = either("dive", "swim");
	}
}
window.combat1Action = combat1Action;
