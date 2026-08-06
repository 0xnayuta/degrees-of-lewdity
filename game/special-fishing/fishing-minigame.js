// Fishing todo: Figure out how to remove the duplication of state changes without breaking how things need to be ordered
const fishingMinigameDefaultBehavior = {
	playerActionResultDuringRun(playerAction, athleticsSuccess) {
		if (playerAction === "reel") {
			if (athleticsSuccess) {
				return {
					armFatigueDelta: [0, 1].random(),
					fishDistanceDelta: -1,
					fishEscapeTimerDelta: 0, // Additional change on top of the timer ticking down normally
					fishStaminaDelta: 0,
				};
			} else {
				return {
					armFatigueDelta: [0, 1].random(),
					fishDistanceDelta: 1,
					fishEscapeTimerDelta: -1,
					fishStaminaDelta: 0,
				};
			}
		} else if (playerAction === "hold") {
			if (athleticsSuccess) {
				return {
					armFatigueDelta: 1,
					fishDistanceDelta: 0,
					fishEscapeTimerDelta: 0,
					fishStaminaDelta: 0,
				};
			} else {
				return {
					armFatigueDelta: 1,
					fishDistanceDelta: 1,
					fishEscapeTimerDelta: -1,
					fishStaminaDelta: 0,
				};
			}
		} else if (playerAction === "slack") {
			return {
				armFatigueDelta: 0,
				fishDistanceDelta: 2,
				fishEscapeTimerDelta: 0,
				fishStaminaDelta: 0,
			};
		}
		throw new Error(`playerActionResultDuringRun: unexpected playerAction "${playerAction}"`);
	},
	playerActionResultDuringIdle(playerAction) {
		if (playerAction === "reel") {
			return {
				armFatigueDelta: 0,
				fishDistanceDelta: -1,
				fishEscapeTimerDelta: 0,
				fishStaminaDelta: 0,
			};
		} else if (playerAction === "hold" || playerAction === "slack") {
			return {
				armFatigueDelta: 0,
				fishDistanceDelta: 0,
				fishEscapeTimerDelta: 0,
				fishStaminaDelta: 0,
			};
		}
		throw new Error(`playerActionResultDuringIdle: unexpected playerAction "${playerAction}"`);
	},
	playerActionResultDuringThrash(playerAction, athleticsSuccess) {
		if (playerAction === "reel") {
			if (athleticsSuccess) {
				return {
					armFatigueDelta: 0,
					fishDistanceDelta: -2,
					fishEscapeTimerDelta: 0,
					fishStaminaDelta: 0,
				};
			} else {
				return {
					armFatigueDelta: 0,
					fishDistanceDelta: 0,
					fishEscapeTimerDelta: -1,
					fishStaminaDelta: 0,
				};
			}
		} else if (playerAction === "hold") {
			if (athleticsSuccess) {
				return {
					armFatigueDelta: 0,
					fishDistanceDelta: 0,
					fishEscapeTimerDelta: 0,
					fishStaminaDelta: -1,
				};
			} else {
				return {
					armFatigueDelta: 0,
					fishDistanceDelta: 0,
					fishEscapeTimerDelta: -1,
					fishStaminaDelta: 0,
				};
			}
		} else if (playerAction === "slack") {
			return {
				armFatigueDelta: 0,
				fishDistanceDelta: 0,
				fishEscapeTimerDelta: 0,
				fishStaminaDelta: 0,
			};
		}
		throw new Error(`playerActionResultDuringThrash: unexpected playerAction "${playerAction}"`);
	},
	staminaDeltaDuringIdle(_playerAction) {
		return +1;
	},
	nextActionFromIdle(stamina, maxStamina, _fishDistance, _playerAction) {
		if (stamina < maxStamina) {
			return [["idle", 100]];
		} else {
			return [["run", 100]];
		}
	},
};

setup.fishingMinigame = {
	behaviors: {
		/*
		 * Behavior: Runs. Hold reduces its stamina during a run, but reel and slack do not. At 0 stamina it goes idle and recovers stamina each turn until full, then runs again.
		 *
		 * To win: Hold during runs to bring its stamina to 0. Reel during idle to reduce distance before its stamina refills.
		 */
		runner: Object.assign(Object.create(fishingMinigameDefaultBehavior), {
			initialAction: "run",
			staminaDeltaDuringRun(playerAction) {
				if (playerAction === "hold") {
					return [-1, -2].random();
				} else {
					return 0;
				}
			},
			staminaDeltaDuringIdle(_playerAction) {
				return 1;
			},
			nextActionFromRun(stamina, _maxStamina, _fishDistance, _playerAction) {
				if (stamina <= 0) {
					return [["idle", 100]];
				} else {
					return [["run", 100]];
				}
			},
		}),
		/*
		 * Behavior: Runs. Hold reduces its stamina during a run, but reel and slack do not. At 0 stamina it goes idle to recover. During idle it runs again if distance is below 3 and its stamina is above 0, otherwise it recovers stamina until full.
		 *
		 * To win: Hold during runs to bring its stamina to 0 before reeling distance below 3. Reel during idle to reduce distance.
		 */
		darter: Object.assign(Object.create(fishingMinigameDefaultBehavior), {
			initialAction: "run",
			staminaDeltaDuringRun(playerAction) {
				if (playerAction === "hold") {
					return [-1, -2].random();
				} else {
					return 0;
				}
			},
			staminaDeltaDuringIdle(_playerAction) {
				return 1;
			},
			nextActionFromRun(stamina, _maxStamina, _fishDistance, _playerAction) {
				if (stamina <= 0) {
					return [["idle", 100]];
				} else {
					return [["run", 100]];
				}
			},
			nextActionFromIdle(stamina, maxStamina, fishDistance, _playerAction) {
				if (fishDistance < 3 && stamina > 0) {
					return [["run", 100]];
				}
				if (stamina < maxStamina) {
					return [["idle", 100]];
				}
				return [["run", 100]];
			},
		}),
		/*
		 * Behavior: Runs. Reel during a run keeps it running and does not reduce its stamina. Hold or slack during a run reduces its stamina and usually sends it to idle.
		 *
		 * To win: Hold or slack during runs to reduce its stamina and send it to idle. Reel during idle to reduce distance.
		 */
		bolter: Object.assign(Object.create(fishingMinigameDefaultBehavior), {
			initialAction: "run",
			staminaDeltaDuringRun(playerAction) {
				if (playerAction === "reel") {
					return 0;
				} else {
					return -1;
				}
			},
			staminaDeltaDuringThrash(_playerAction) {
				return -1;
			},
			nextActionFromRun(stamina, _maxStamina, _fishDistance, playerAction) {
				if (stamina <= 0) {
					return [["idle", 100]];
				}
				if (playerAction === "reel") {
					return [["run", 100]];
				}
				if (playerAction === "hold" || playerAction === "slack") {
					return [
						["run", 10],
						["thrash", 20],
						["idle", 70],
					];
				}
				throw new Error(`bolter nextActionFromRun: unexpected playerAction "${playerAction}"`);
			},
			nextActionFromThrash(stamina, _maxStamina, _fishDistance, _playerAction) {
				if (stamina <= 0) {
					return [["idle", 100]];
				}
				return [
					["run", 10],
					["thrash", 20],
					["idle", 70],
				];
			},
		}),
		/*
		 * Behavior: Runs, losing little stamina. Hold during a run usually provokes a thrash. Reel during a thrash reduces its stamina and reduces distance. Reel during a run does not reduce its stamina.
		 *
		 * To win: Hold during a run to provoke a thrash, then reel during the thrash to reduce its stamina and reduce distance.
		 */
		thrasher: Object.assign(Object.create(fishingMinigameDefaultBehavior), {
			initialAction: "run",
			staminaDeltaDuringRun(_playerAction) {
				return [0, -1].random();
			},
			staminaDeltaDuringThrash(playerAction) {
				if (playerAction === "reel") {
					return -1;
				} else {
					return 0;
				}
			},
			nextActionFromRun(stamina, _maxStamina, _fishDistance, playerAction) {
				if (stamina <= 0) {
					return [
						["idle", 50],
						["thrash", 50],
					];
				}

				if (playerAction === "hold") {
					return [
						["thrash", 85],
						["run", 15],
					];
				} else if (playerAction === "slack" || playerAction === "reel") {
					return [["run", 100]];
				}
			},
			nextActionFromThrash(stamina, maxStamina, _fishDistance, playerAction) {
				if (stamina === maxStamina) {
					return [
						["run", 85],
						["thrash", 15],
					];
				} else if (stamina <= 0) {
					return [["idle", 100]];
				}

				if (playerAction === "slack") {
					return [["idle", 100]];
				} else if (playerAction === "reel") {
					return [
						["thrash", 85],
						["run", 15],
					];
				} else if (playerAction === "hold") {
					return [
						["run", 85],
						["thrash", 15],
					];
				}
			},
		}),
		/*
		 * Behavior: Runs. Hold during a run reduces its stamina, but reel during a run provokes a thrash. At 0 stamina it thrashes. During a thrash, reel and hold both add heavy arm fatigue, and slack sends it to idle.
		 *
		 * To win: Hold during runs to reduce its stamina. When it thrashes, slack to send it to idle rather than reel or hold. Reel during idle to reduce distance.
		 */
		slipper: Object.assign(Object.create(fishingMinigameDefaultBehavior), {
			initialAction: "run",
			playerActionResultDuringThrash(playerAction, athleticsSuccess) {
				const result = fishingMinigameDefaultBehavior.playerActionResultDuringThrash(playerAction, athleticsSuccess);
				if (playerAction === "reel" || playerAction === "hold") {
					result.armFatigueDelta += [1, 2, 3].random();
				}
				return result;
			},
			staminaDeltaDuringRun(playerAction) {
				if (playerAction === "hold") {
					return -1;
				} else {
					return 0;
				}
			},
			staminaDeltaDuringIdle(_playerAction) {
				return [0, 1, 1].random();
			},
			staminaDeltaDuringThrash(_playerAction) {
				return -1;
			},
			nextActionFromRun(stamina, _maxStamina, _fishDistance, playerAction) {
				if (stamina <= 0) {
					return [["thrash", 100]];
				}
				if (playerAction === "reel") {
					return [["thrash", 100]];
				}
				return [["run", 100]];
			},
			nextActionFromThrash(stamina, maxStamina, _fishDistance, playerAction) {
				if (stamina >= maxStamina) {
					return [["run", 100]];
				} else if (stamina === 0) {
					return [
						["thrash", 30],
						["idle", 70],
					];
				}

				if (playerAction === "slack") {
					return [["idle", 100]];
				} else if (playerAction === "hold") {
					return [
						["thrash", 30],
						["run", 70],
					];
				} else if (playerAction === "reel") {
					return [
						["thrash", 70],
						["run", 30],
					];
				}
			},
		}),
		/*
		 * Behavior: Runs. Reel during a run adds heavy arm fatigue, and hold during a run reduces its stamina. At 0 stamina it thrashes, recovering stamina each thrash turn. Reel during a thrash reduces distance sharply and can send it to idle.
		 *
		 * To win: Hold during runs to reduce its stamina, and do not reel during runs. At 0 stamina it thrashes: reel the thrash to reduce distance and send it to idle, then reel during idle. Arm fatigue is added to the difficulty of every hold check, so when it is high the holds you need to reduce its stamina start failing, and each failed hold adds distance and ticks the escape timer down. Slacking during a run can be fine since it only gains 1 dis
		 */
		anchor: Object.assign(Object.create(fishingMinigameDefaultBehavior), {
			initialAction: "run",
			playerActionResultDuringRun(playerAction, athleticsSuccess) {
				if (playerAction === "reel") {
					if (athleticsSuccess) {
						return {
							armFatigueDelta: [2, 3, 4].random(),
							fishDistanceDelta: -1,
							fishEscapeTimerDelta: 0,
							fishStaminaDelta: 0,
						};
					} else {
						return {
							armFatigueDelta: [2, 3, 4].random(),
							fishDistanceDelta: 1,
							fishEscapeTimerDelta: -1,
							fishStaminaDelta: 0,
						};
					}
				}
				if (playerAction === "slack") {
					return {
						armFatigueDelta: 0,
						fishDistanceDelta: 1,
						fishEscapeTimerDelta: 0,
						fishStaminaDelta: 0,
					};
				}
				return fishingMinigameDefaultBehavior.playerActionResultDuringRun(playerAction, athleticsSuccess);
			},
			playerActionResultDuringThrash(playerAction, athleticsSuccess) {
				if (playerAction === "reel") {
					if (athleticsSuccess) {
						return {
							armFatigueDelta: 0,
							fishDistanceDelta: -3,
							fishEscapeTimerDelta: 0,
							fishStaminaDelta: 0,
						};
					} else {
						return {
							armFatigueDelta: 0,
							fishDistanceDelta: 0,
							fishEscapeTimerDelta: -1,
							fishStaminaDelta: 0,
						};
					}
				}
				return fishingMinigameDefaultBehavior.playerActionResultDuringThrash(playerAction, athleticsSuccess);
			},
			staminaDeltaDuringRun(playerAction) {
				if (playerAction === "hold" || playerAction === "reel") {
					return [-2, -3].random();
				} else if (playerAction === "slack") {
					return -2;
				}
			},
			staminaDeltaDuringThrash(_playerAction) {
				return [0, 0, 1].random();
			},
			nextActionFromRun(stamina, _maxStamina, _fishDistance, _playerAction) {
				if (stamina <= 0) {
					return [["thrash", 100]];
				} else {
					return [["run", 100]];
				}
			},
			nextActionFromThrash(stamina, _maxStamina, _fishDistance, playerAction) {
				if (stamina > 0) {
					return [
						["thrash", 30],
						["run", 70],
					];
				}

				if (playerAction === "reel" || playerAction === "slack") {
					return [
						["idle", 50],
						["thrash", 50],
					];
				} else if (playerAction === "hold") {
					return [
						["thrash", 30],
						["run", 70],
					];
				}
			},
		}),
	},
};

/**
 * Initializes the fishing minigame state.
 *
 * @param {string} fishKey
 */
function fishingMinigameStart(fishKey) {
	const minigame = setup.fishing.lootTables.fish[fishKey].minigame;
	V.fishingMinigame = {
		fishName: fishKey,
		behavior: minigame.behavior,
		maxStamina: minigame.maxStamina,
		fishStamina: minigame.maxStamina,
		fishDistance: 5,
		fishEscapeTimer: 20,
		fishAction: setup.fishingMinigame.behaviors[minigame.behavior].initialAction,
		armFatigue: 0,
		armFatigueDifficulty: minigame.armFatigueDifficulty,
	};
}
window.fishingMinigameStart = fishingMinigameStart;

/**
 * Whether the given player action against the fish's current action requires an athletics check.
 *
 * @param {string} playerAction
 * @returns {boolean}
 */
function fishingMinigameActionRequiresAthletics(playerAction) {
	const fishAction = V.fishingMinigame.fishAction;
	if (fishAction === "run" || fishAction === "thrash") {
		if (playerAction === "reel" || playerAction === "hold") {
			return true;
		}
		if (playerAction === "slack") {
			return false;
		}
		throw new Error(`fishingMinigameActionRequiresAthletics: unexpected action "${playerAction}"`);
	}
	if (fishAction === "idle") {
		if (playerAction === "reel" || playerAction === "hold" || playerAction === "slack") {
			return false;
		}
		throw new Error(`fishingMinigameActionRequiresAthletics: unexpected action "${playerAction}"`);
	}
	throw new Error(`fishingMinigameActionRequiresAthletics: unexpected fishAction "${fishAction}"`);
}
window.fishingMinigameActionRequiresAthletics = fishingMinigameActionRequiresAthletics;

/**
 * Returns the maximum of the athletics roll range for the given action.
 *
 * @param {string} playerAction
 * @returns {number} The upper bound of the athletics check.
 */
function fishingMinigameAthleticsCheckDifficulty(playerAction) {
	const combat = V.fishingMinigame;
	let base;
	if (combat.fishAction === "run") {
		if (playerAction === "reel") {
			base = 260;
		} else if (playerAction === "hold") {
			base = 150;
		} else {
			throw new Error(`fishingMinigameAthleticsCheckDifficulty: unexpected action "${playerAction}" for a running fish`);
		}
	} else if (combat.fishAction === "thrash") {
		if (playerAction === "reel") {
			base = 190;
		} else if (playerAction === "hold") {
			base = 130;
		} else {
			throw new Error(`fishingMinigameAthleticsCheckDifficulty: unexpected action "${playerAction}" for a thrashing fish`);
		}
	} else {
		throw new Error(`fishingMinigameAthleticsCheckDifficulty: unexpected fishAction "${combat.fishAction}"`);
	}

	if (combat.fishStamina === combat.maxStamina) {
		return base + combat.armFatigue * combat.armFatigueDifficulty + 200;
	}
	return base + combat.armFatigue * combat.armFatigueDifficulty + 20 * (combat.fishStamina - combat.maxStamina);
}
window.fishingMinigameAthleticsCheckDifficulty = fishingMinigameAthleticsCheckDifficulty;

/**
 * Gets the status of the minigame at the start of a turn to decide what should happen on that turn.
 *
 * @returns {string}
 */
function fishingMinigameTurnOutcome() {
	const combat = V.fishingMinigame;
	if (combat.fishDistance <= 0) {
		return "caught";
	}
	if (combat.lossReason) {
		return "lost";
	}
	return "fighting";
}
window.fishingMinigameTurnOutcome = fishingMinigameTurnOutcome;

/**
 * Resolves the current turn and applies the player's action against the fish's action, then advances the fish to its next action, then records a loss reason if that turn lost the fish. fishingMinigameTurnOutcome() picks up that loss reason at the start of the next turn so the minigame loop can display the correct stuff.
 *
 * @param {string} playerAction
 */
function fishingMinigameResolveTurn(playerAction) {
	const combat = V.fishingMinigame;
	combat.lastPlayerAction = playerAction;
	const recoversFatigue = !fishingMinigameActionRequiresAthletics(playerAction);
	fishingMinigameApplyPlayerAction(playerAction);
	if (recoversFatigue) {
		combat.armFatigue = Math.max(0, combat.armFatigue - 1);
	}

	// The timer should stop the fish combat from lasting too long, but it shouldn't stop the player if they are about to win, or if the fish is not moving.
	if (combat.fishDistance > 2 && (combat.fishAction !== "idle" || combat.lastFishAction !== "idle")) {
		combat.fishEscapeTimer -= 1;
	}
	fishingMinigameAdvanceFish(playerAction);

	if (combat.fishDistance > 0) {
		if (combat.fishDistance > 10) {
			combat.lossReason = "fishTooFar";
		} else if (combat.fishEscapeTimer <= 0) {
			combat.lossReason = "fishOutOfTime";
		}
	}
}
window.fishingMinigameResolveTurn = fishingMinigameResolveTurn;

/**
 * Applies the current player action (V.fishingMinigame.playerAction) against the fish's current
 * action by calling the behavior's playerActionResultDuring*() and applying the returned deltas. For checked
 * actions, V.athleticsSuccess holds the roll made for this turn.
 *
 * When you fail an action, it ticks the escape timer down by one. If you're failing the athletics
 * checks over and over again (which get harder the longer the minigame goes on) that death spiral
 * should be sped up.
 *
 * @param {string} playerAction
 */
function fishingMinigameApplyPlayerAction(playerAction) {
	const combat = V.fishingMinigame;
	const behavior = setup.fishingMinigame.behaviors[combat.behavior];
	let result;
	if (combat.fishAction === "run") {
		result = behavior.playerActionResultDuringRun(playerAction, V.athleticsSuccess);
	} else if (combat.fishAction === "idle") {
		result = behavior.playerActionResultDuringIdle(playerAction);
	} else if (combat.fishAction === "thrash") {
		result = behavior.playerActionResultDuringThrash(playerAction, V.athleticsSuccess);
	} else {
		throw new Error(`fishingMinigameApplyPlayerAction: unexpected fishAction "${combat.fishAction}"`);
	}

	if (result.armFatigueDelta) combat.armFatigue += result.armFatigueDelta;
	if (result.fishDistanceDelta) combat.fishDistance += result.fishDistanceDelta;
	if (result.fishEscapeTimerDelta) combat.fishEscapeTimer += result.fishEscapeTimerDelta;
	if (result.fishStaminaDelta) combat.fishStamina = Math.clamp(combat.fishStamina + result.fishStaminaDelta, 0, combat.maxStamina);
}

/**
 * Advances the fish one step through its behavior state machine: it spends or recovers its own
 * stamina first, then rolls its next move. nextAction* deliberately reads the post-delta stamina —
 * that ordering decides whether an exhausted fish stays in its window or slips out of it.
 *
 * @param {string} playerAction
 */
function fishingMinigameAdvanceFish(playerAction) {
	const combat = V.fishingMinigame;
	const behavior = setup.fishingMinigame.behaviors[combat.behavior];

	let staminaDelta;
	if (combat.fishAction === "run") {
		staminaDelta = behavior.staminaDeltaDuringRun(playerAction);
	} else if (combat.fishAction === "idle") {
		staminaDelta = behavior.staminaDeltaDuringIdle(playerAction);
	} else if (combat.fishAction === "thrash") {
		staminaDelta = behavior.staminaDeltaDuringThrash(playerAction);
	} else {
		throw new Error(`fishingMinigameAdvanceFish: unexpected fishAction "${combat.fishAction}"`);
	}

	combat.lastFishAction = combat.fishAction;
	combat.fishStamina = Math.clamp(combat.fishStamina + staminaDelta, 0, combat.maxStamina);

	let transitions;
	if (combat.lastFishAction === "run") {
		transitions = behavior.nextActionFromRun(combat.fishStamina, combat.maxStamina, combat.fishDistance, playerAction);
	} else if (combat.lastFishAction === "idle") {
		transitions = behavior.nextActionFromIdle(combat.fishStamina, combat.maxStamina, combat.fishDistance, playerAction);
	} else if (combat.lastFishAction === "thrash") {
		transitions = behavior.nextActionFromThrash(combat.fishStamina, combat.maxStamina, combat.fishDistance, playerAction);
	} else {
		throw new Error(`fishingMinigameAdvanceFish: unexpected lastFishAction "${combat.lastFishAction}"`);
	}
	combat.fishAction = weightedRandom(...transitions);
}

function fishingMinigameEnd() {
	delete V.fishingMinigame;
}
window.fishingMinigameEnd = fishingMinigameEnd;
