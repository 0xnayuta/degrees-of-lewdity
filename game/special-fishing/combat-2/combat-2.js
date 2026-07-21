/*
My best attempt at a text-based system. Each fish has a behavior, and each behavior has a state machine that determines what the fish does based on what the player does, what the last fish action was, and how much stamina the fish has. The goal is to try to guess what the fish is going to do, and avoid doing things that will make catching the fish harder. There are a general set of rules such as: 
- Picking to reel while the fish will be running on its next turn will cost you stamina
- Picking to reel while the fish will be idle next turn is good
- If your arm fatigue gets too high, you are at risk of getting pulled in or losing your rod, so you want to cut your line if you get to that point

So for example, the Charger behavior always thrashes on the turn before running. So you would want to always hold when you see a thrash from a runner, since holding is the best thing to do when a fish is running. 

The issue with this combat was that it is too hard to predict what the fish will do. There should probably be fewer behaviors, but at the end of the day it's just a game of picking the correct option, and the only decision making the player can make is how dangerous they want to be with their arm fatigue. And that mechanically boils down to the basic *repeated athletics roll to see if you catch a fish over and over again, player betting on if they are going to get lucky and won't lose the minigame*

I feel like this was the closest I got to making a fun text minigame, but alas. 

*/
setup.combat2Fish = {
	haddock: { name: "haddock", size: 90, maxStamina: 4, combatBehavior: "runner" },
	salmon: { name: "salmon", size: 120, maxStamina: 5, combatBehavior: "sprinter" },
	trout: { name: "trout", size: 80, maxStamina: 3, combatBehavior: "bluffer" },
	mackerel: { name: "mackerel", size: 50, maxStamina: 3, combatBehavior: "distractable" },
	bass: { name: "bass", size: 95, maxStamina: 5, combatBehavior: "brawler" },
	perch: { name: "perch", size: 60, maxStamina: 3, combatBehavior: "tense" },
	chub: { name: "chub", size: 80, maxStamina: 4, combatBehavior: "headstrong" },
	pike: { name: "pike", size: 130, maxStamina: 6, combatBehavior: "charger" },
	eel: { name: "eel", size: 110, maxStamina: 6, combatBehavior: "dogged" },
};

setup.combat2StateMachines = {
	/*
	 * runner: runs until its stamina is gone, idles to recover, then runs again.
	 * Reel while it idles to gain the most line.
	 */
	runner: {
		initialAction: "run",
		nextAction(lastAction, stamina, _playerAction) {
			if (lastAction === "run") {
				if (stamina <= 0) {
					return [[{ action: "idle", staminaDelta: +1 }, 100]];
				}
				if (stamina > 0) {
					return [
						[{ action: "run", staminaDelta: -1 }, 80],
						[{ action: "idle", staminaDelta: +1 }, 20],
					];
				}
			}
			if (lastAction === "idle") {
				if (stamina < 3) {
					return [[{ action: "idle", staminaDelta: +1 }, 100]];
				}
				if (stamina >= 3) {
					return [
						[{ action: "run", staminaDelta: -1 }, 80],
						[{ action: "idle", staminaDelta: +1 }, 20],
					];
				}
			}
			throw new Error(`runner nextAction: unexpected lastAction "${lastAction}"`);
		},
	},
	/*
	 * charger: cycles run, then idle, then thrash to recover stamina, then run again.
	 * A thrash always comes before a run, so hold or slack during the thrash and reel during the idle.
	 */
	charger: {
		initialAction: "run",
		nextAction(lastAction, stamina, _playerAction) {
			if (lastAction === "run") {
				if (stamina <= 0) {
					return [[{ action: "idle", staminaDelta: 0 }, 100]];
				}
				if (stamina > 0) {
					return [
						[{ action: "run", staminaDelta: -1 }, 80],
						[{ action: "idle", staminaDelta: 0 }, 20],
					];
				}
			}
			if (lastAction === "idle") {
				return [
					[{ action: "idle", staminaDelta: 0 }, 50],
					[{ action: "thrash", staminaDelta: +1 }, 50],
				];
			}
			if (lastAction === "thrash") {
				if (stamina < 2) {
					return [[{ action: "thrash", staminaDelta: +1 }, 100]];
				}
				if (stamina >= 2) {
					return [[{ action: "run", staminaDelta: -1 }, 100]];
				}
			}
			throw new Error(`charger nextAction: unexpected lastAction "${lastAction}"`);
		},
	},
	/*
	 * brawler: mostly thrashes, losing stamina as it does, and runs if reeled during a thrash.
	 * Hold or slack to let it thrash its stamina down, then reel once it idles.
	 */
	brawler: {
		initialAction: "thrash",
		nextAction(lastAction, stamina, playerAction) {
			if (lastAction === "thrash") {
				if (playerAction === "reel") {
					return [[{ action: "run", staminaDelta: 0 }, 100]];
				}
				if (stamina <= 0) {
					return [[{ action: "idle", staminaDelta: +1 }, 100]];
				}
				if (stamina > 0) {
					return [
						[{ action: "thrash", staminaDelta: -1 }, 70],
						[{ action: "idle", staminaDelta: +1 }, 30],
					];
				}
			}
			if (lastAction === "run") {
				if (stamina <= 0) {
					return [[{ action: "idle", staminaDelta: +1 }, 100]];
				}
				if (stamina > 0) {
					return [
						[{ action: "run", staminaDelta: -1 }, 60],
						[{ action: "thrash", staminaDelta: -1 }, 40],
					];
				}
			}
			if (lastAction === "idle") {
				if (stamina < 3) {
					return [[{ action: "idle", staminaDelta: +1 }, 100]];
				}
				if (stamina >= 3) {
					return [
						[{ action: "thrash", staminaDelta: -1 }, 80],
						[{ action: "idle", staminaDelta: +1 }, 20],
					];
				}
			}
			throw new Error(`brawler nextAction: unexpected lastAction "${lastAction}"`);
		},
	},
	/*
	 * sprinter: keeps running if reeled during a run, idles if held or slacked, and recovers
	 * stamina quickly while idle.
	 * Hold or slack until it idles, then reel as much as possible during each idle.
	 */
	sprinter: {
		initialAction: "run",
		nextAction(lastAction, stamina, playerAction) {
			if (lastAction === "run") {
				if (stamina <= 0) {
					return [[{ action: "idle", staminaDelta: +1 }, 100]];
				}
				if (playerAction === "reel") {
					return [[{ action: "run", staminaDelta: -1 }, 100]];
				}
				if (stamina > 0) {
					return [
						[{ action: "run", staminaDelta: -1 }, 40],
						[{ action: "idle", staminaDelta: +1 }, 60],
					];
				}
			}
			if (lastAction === "idle") {
				if (stamina < 3) {
					return [[{ action: "idle", staminaDelta: +1 }, 100]];
				}
				if (stamina === 3) {
					return [
						[{ action: "run", staminaDelta: -1 }, 50],
						[{ action: "idle", staminaDelta: +1 }, 50],
					];
				}
				if (stamina > 3) {
					return [
						[{ action: "run", staminaDelta: -1 }, 90],
						[{ action: "idle", staminaDelta: +1 }, 10],
					];
				}
			}
			throw new Error(`sprinter nextAction: unexpected lastAction "${lastAction}"`);
		},
	},
	/*
	 * bluffer: its thrash never leads to a run; it always idles next turn regardless of the
	 * player's action.
	 * Reel straight through the thrash; holding or slacking (the right response to a charger's
	 * thrash) only wastes the turn here.
	 */
	bluffer: {
		initialAction: "run",
		nextAction(lastAction, stamina, _playerAction) {
			if (lastAction === "run") {
				if (stamina <= 0) {
					return [[{ action: "thrash", staminaDelta: 0 }, 100]];
				}
				if (stamina > 0) {
					return [
						[{ action: "run", staminaDelta: -1 }, 70],
						[{ action: "thrash", staminaDelta: 0 }, 30],
					];
				}
			}
			if (lastAction === "thrash") {
				return [[{ action: "idle", staminaDelta: +1 }, 100]];
			}
			if (lastAction === "idle") {
				if (stamina < 3) {
					return [[{ action: "idle", staminaDelta: +1 }, 100]];
				}
				if (stamina >= 3) {
					return [
						[{ action: "run", staminaDelta: -1 }, 80],
						[{ action: "idle", staminaDelta: +1 }, 20],
					];
				}
			}
			throw new Error(`bluffer nextAction: unexpected lastAction "${lastAction}"`);
		},
	},
	/*
	 * headstrong: holding during a run sends it to idle, slacking during a run leaves its stamina
	 * unchanged so it runs indefinitely, and reeling during a run lowers its stamina slowly.
	 * Hold during runs, then reel during the idle.
	 */
	headstrong: {
		initialAction: "run",
		nextAction(lastAction, stamina, playerAction) {
			if (lastAction === "run") {
				if (stamina <= 0) {
					return [[{ action: "idle", staminaDelta: +1 }, 100]];
				}
				if (playerAction === "hold") {
					return [[{ action: "idle", staminaDelta: +1 }, 100]];
				}
				if (playerAction === "reel") {
					return [
						[{ action: "run", staminaDelta: -1 }, 80],
						[{ action: "idle", staminaDelta: +1 }, 20],
					];
				}
				if (playerAction === "slack") {
					return [[{ action: "run", staminaDelta: 0 }, 100]];
				}
				throw new Error(`headstrong nextAction: unexpected playerAction "${playerAction}"`);
			}
			if (lastAction === "idle") {
				if (stamina < 3) {
					return [[{ action: "idle", staminaDelta: +1 }, 100]];
				}
				if (stamina >= 3) {
					return [
						[{ action: "run", staminaDelta: -1 }, 80],
						[{ action: "idle", staminaDelta: +1 }, 20],
					];
				}
			}
			throw new Error(`headstrong nextAction: unexpected lastAction "${lastAction}"`);
		},
	},
	/*
	 * dogged: its runs lose 1 stamina per turn until it's spent, then it takes one idle turn
	 * before running again, and reeling that idle turn gives it 2 stamina back.
	 * Reel during its runs to gain line, but never reel an idle turn or you undo your progress.
	 */
	dogged: {
		initialAction: "run",
		nextAction(lastAction, stamina, playerAction) {
			if (lastAction === "run") {
				if (stamina > 0) {
					return [[{ action: "run", staminaDelta: -1 }, 100]];
				}
				if (stamina <= 0) {
					return [[{ action: "idle", staminaDelta: 0 }, 100]];
				}
			}
			if (lastAction === "idle") {
				if (playerAction === "reel") {
					return [[{ action: "run", staminaDelta: +2 }, 100]];
				}
				if (playerAction === "hold" || playerAction === "slack") {
					return [[{ action: "run", staminaDelta: 0 }, 100]];
				}
				throw new Error(`dogged nextAction: unexpected playerAction "${playerAction}"`);
			}
			throw new Error(`dogged nextAction: unexpected lastAction "${lastAction}"`);
		},
	},
	/*
	 * tense: runs, then thrashes once its stamina is gone or sometimes mid-run, going to idle if
	 * slacked during a thrash and into another run if reeled or held during a thrash.
	 * Wait for the thrash, then slack.
	 */
	tense: {
		initialAction: "run",
		nextAction(lastAction, stamina, playerAction) {
			if (lastAction === "run") {
				if (stamina <= 0) {
					return [[{ action: "thrash", staminaDelta: 0 }, 100]];
				}
				if (stamina > 0) {
					return [
						[{ action: "run", staminaDelta: -1 }, 60],
						[{ action: "thrash", staminaDelta: 0 }, 40],
					];
				}
			}
			if (lastAction === "thrash") {
				if (playerAction === "slack") {
					return [[{ action: "idle", staminaDelta: +1 }, 100]];
				}
				if (playerAction === "reel" || playerAction === "hold") {
					return [[{ action: "run", staminaDelta: -1 }, 100]];
				}
				throw new Error(`tense nextAction: unexpected playerAction "${playerAction}"`);
			}
			if (lastAction === "idle") {
				if (stamina < 3) {
					return [[{ action: "idle", staminaDelta: +1 }, 100]];
				}
				if (stamina >= 3) {
					return [
						[{ action: "run", staminaDelta: -1 }, 80],
						[{ action: "idle", staminaDelta: +1 }, 20],
					];
				}
			}
			throw new Error(`tense nextAction: unexpected lastAction "${lastAction}"`);
		},
	},
	/*
	 * distractable: reeling during a run keeps it running, holding or slacking during a run
	 * usually makes it thrash, reeling during a thrash sends it to idle, and holding or slacking
	 * during a thrash sends it back into a run.
	 * Hold or slack to bring on a thrash, then reel it.
	 */
	distractable: {
		initialAction: "run",
		nextAction(lastAction, stamina, playerAction) {
			if (lastAction === "run") {
				if (stamina <= 0) {
					return [[{ action: "thrash", staminaDelta: 0 }, 100]];
				}
				if (playerAction === "reel") {
					return [[{ action: "run", staminaDelta: -1 }, 100]];
				}
				if (stamina > 0) {
					return [
						[{ action: "run", staminaDelta: -1 }, 30],
						[{ action: "thrash", staminaDelta: 0 }, 70],
					];
				}
			}
			if (lastAction === "thrash") {
				if (playerAction === "reel") {
					return [[{ action: "idle", staminaDelta: +1 }, 100]];
				}
				if (playerAction === "hold" || playerAction === "slack") {
					return [[{ action: "run", staminaDelta: -1 }, 100]];
				}
				throw new Error(`distractable nextAction: unexpected playerAction "${playerAction}"`);
			}
			if (lastAction === "idle") {
				if (stamina < 3) {
					return [[{ action: "idle", staminaDelta: +1 }, 100]];
				}
				if (stamina >= 3) {
					return [[{ action: "run", staminaDelta: -1 }, 100]];
				}
			}
			throw new Error(`distractable nextAction: unexpected lastAction "${lastAction}"`);
		},
	},
};

function startCombat2(fishKey) {
	const fish = setup.combat2Fish[fishKey];
	const behavior = fish.combatBehavior;
	V.combat2 = {
		fishKey,
		fishName: fish.name,
		fishSize: fish.size,
		huge: false,
		combatBehavior: behavior,
		startingStamina: fish.maxStamina,
		fishStamina: fish.maxStamina,
		fishDistance: 10,
		fishAction: setup.combat2StateMachines[behavior].initialAction,
		armFatigue: 0,
		playerAction: "",
	};
}
window.startCombat2 = startCombat2;

function endCombat2() {
	V.combat2 = {};
}
window.endCombat2 = endCombat2;


function combat2ResolveTurn() {
	const combat = V.combat2;

	// First render (no action yet) and cut both skip turn resolution.
	if (combat.playerAction === "" || combat.playerAction === "cut") {
		return;
	}

	const previousAction = combat.fishAction;

	const { action, staminaDelta } = weightedRandom(
		...setup.combat2StateMachines[combat.combatBehavior].nextAction(previousAction, combat.fishStamina, combat.playerAction)
	);
	combat.fishAction = action;
	combat.fishStamina = Math.clamp(combat.fishStamina + staminaDelta, 0, combat.startingStamina);

	combat2ApplyTurnEffects();
}
window.combat2ResolveTurn = combat2ResolveTurn;

function combat2ApplyTurnEffects() {
	const combat = V.combat2;
	const player = combat.playerAction;

	if (combat.fishAction === "idle") {
		if (player === "reel") {
			combat.fishDistance -= 3;
			return;
		}
		if (player === "slack") {
			combat.armFatigue = Math.max(0, combat.armFatigue - random(0, 1));
			return;
		}
		if (player === "hold") {
			combat.armFatigue = Math.max(0, combat.armFatigue - random(0, 1));
			return;
		}
		throw new Error(`combat2ApplyTurnEffects: unexpected playerAction "${player}"`);
	}

	if (combat.fishAction === "run") {
		if (player === "reel") {
			combat.fishDistance -= 1;
			combat.armFatigue += 1;
			return;
		}
		if (player === "slack") {
			combat.fishDistance += 2;
			combat.armFatigue = Math.max(0, combat.armFatigue - random(0, 1));
			return;
		}
		if (player === "hold") {
			combat.fishDistance += 1;
			combat.armFatigue = Math.max(0, combat.armFatigue - random(0, 2) - 1);
			return;
		}
		throw new Error(`combat2ApplyTurnEffects: unexpected playerAction "${player}"`);
	}

	if (combat.fishAction === "thrash") {
		if (player === "reel") {
			combat.fishDistance -= 1;
			return;
		}
		if (player === "slack") {
			combat.armFatigue = Math.max(0, combat.armFatigue - random(0, 1));
			return;
		}
		if (player === "hold") {
			combat.armFatigue = Math.max(0, combat.armFatigue - random(0, 1));
			return;
		}
		throw new Error(`combat2ApplyTurnEffects: unexpected playerAction "${player}"`);
	}

	throw new Error(`combat2ApplyTurnEffects: unexpected fishAction "${combat.fishAction}"`);
}
window.combat2ApplyTurnEffects = combat2ApplyTurnEffects;
