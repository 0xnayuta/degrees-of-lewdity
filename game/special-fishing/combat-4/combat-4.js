// UI based fishing where the movement of the fish is determined by a state machine, rather than a function. I believe that I was close here, but I can't get it to be fun. 

const COMBAT4_CATCH_BOX_HEIGHT = 86;
const COMBAT4_PAUSE_SECONDS_RANGE = [0.35, 0.8];
const COMBAT4_PAUSE_SPEED = 28;
const COMBAT4_PAUSE_ACCELERATION = 260;
const COMBAT4_EDGE_BOUNCE = 0.3;

setup.combat4Minigame = {
	moves: {
		// The catch box descends at about the hook's fall speed, making it easy to gain progress while it's falling.
		sink: { direction: 1, speedRange: [170, 200], accelerationRange: [400, 650], durationRange: [0.5, 1.1] },
		driftUp: { direction: -1, speedRange: [90, 150], accelerationRange: [350, 550], durationRange: [0.5, 1.0] },
		dartUp: { direction: -1, speedRange: [300, 420], accelerationRange: [900, 1300], durationRange: [0.15, 0.35] },
	},
	// The state machine behaviors. The first row is the weights of the actions that could be took in the top 1/5th of the catch box, the second row is in the next 1/5th down, and so on.
	behaviors: {
		steady: [
			{ sink: 7, driftUp: 1 },
			{ sink: 6, driftUp: 2 },
			{ sink: 4, driftUp: 4 },
			{ sink: 2, driftUp: 6 },
			{ driftUp: 7, dartUp: 1 },
		],
		sluggish: [
			{ sink: 6, driftUp: 1 },
			{ sink: 5, driftUp: 2 },
			{ sink: 3, driftUp: 3 },
			{ sink: 1, driftUp: 5 },
			{ driftUp: 6 }],
		erratic: [
			{ sink: 4, driftUp: 2 },
			{ sink: 4, driftUp: 3, dartUp: 1 },
			{ sink: 3, driftUp: 3, dartUp: 2 },
			{ sink: 2, driftUp: 4, dartUp: 2 },
			{ driftUp: 5, dartUp: 3 },
		],
		darting: [
			{ sink: 3, driftUp: 3 },
			{ sink: 2, driftUp: 3, dartUp: 3 },
			{ sink: 2, driftUp: 3, dartUp: 4 },
			{ sink: 1, driftUp: 3, dartUp: 4 },
			{ driftUp: 4, dartUp: 4 },
		],
	},
	config: {
		containerWidth: 76,
		containerHeight: 450,
		catchBoxBehavior: "sluggish",
		hookRadius: 13,
		hookClickAccelerationUp: 2000,
		hookMaxUpSpeed: 700,
		hookBoostTargetSpeed: 525,
		hookDownAcceleration: 850,
		hookMaxDownSpeed: 200,
		requiredCatchSeconds: 5,
		roofFlashSeconds: 0.18,
	},
	fishConfigs: {
		perch: { catchBoxBehavior: "steady" },
		carp: { catchBoxBehavior: "sluggish" },
		trout: { catchBoxBehavior: "erratic" },
		pike: { catchBoxBehavior: "darting" },
	},
	state: null,
};

function combat4RandomInRange([min, max]) {
	return Math.random() * (max - min) + min;
}

function combat4PickWeightedMove(zone) {
	const entries = Object.entries(zone);
	const total = entries.reduce((sum, [, weight]) => sum + weight, 0);

	let roll = Math.random() * total;
	for (const [moveName, weight] of entries) {
		roll -= weight;
		if (roll < 0) {
			return moveName;
		}
	}
	return entries[entries.length - 1][0];
}

function combat4ZoneIndex(current, min, max, zoneCount) {
	const fraction = (current - min) / (max - min);
	return Math.clamp(Math.floor(fraction * zoneCount), 0, zoneCount - 1);
}

function combat4GetBehavior(behaviorName) {
	const zones = setup.combat4Minigame.behaviors[behaviorName] || setup.combat4Minigame.behaviors.steady;

	return {
		pickNextMove(current, min, max) {
			const zone = zones[combat4ZoneIndex(current, min, max, zones.length)];
			const move = setup.combat4Minigame.moves[combat4PickWeightedMove(zone)];

			return {
				direction: move.direction,
				speed: combat4RandomInRange(move.speedRange),
				acceleration: combat4RandomInRange(move.accelerationRange),
				durationSeconds: combat4RandomInRange(move.durationRange),
			};
		},
	};
}

function combat4GetConfig(fishName) {
	return Object.assign({}, setup.combat4Minigame.config, setup.combat4Minigame.fishConfigs[fishName]);
}

function combat4Create(root, fishName, barCanvas) {
	const config = combat4GetConfig(fishName);
	const containerHeight = config.containerHeight;

	const $root = $(root);
	const canvas = barCanvas.element;

	const catchBoxMin = COMBAT4_CATCH_BOX_HEIGHT / 2;
	const catchBoxMax = containerHeight - COMBAT4_CATCH_BOX_HEIGHT / 2;
	const catchBoxBehavior = combat4GetBehavior(config.catchBoxBehavior);

	const state = {
		root,
		fishName,
		hookPosition: config.containerHeight / 2,
		hookVelocity: 0,
		clickBoostActive: false,
		catchSeconds: 0,
		noiseScore: 0,
		roofFlashSecondsLeft: 0,
		lastUpdateTime: 0,
		elapsedSeconds: 0,
		animationFrameId: null,
		catchBoxCenter: (catchBoxMin + catchBoxMax) / 2,
		catchBoxVelocity: 0,
		catchBoxDirection: 0,
		catchBoxSpeed: 0,
		catchBoxAcceleration: 0,
		catchBoxPhase: "pause",
		catchBoxPhaseSecondsLeft: 0,
	};

	let ctx = barCanvas.ctx;
	setup.combat4Minigame.state = state;

	function syncCanvasWidth() {
		const width = Math.round(canvas.getBoundingClientRect().width);
		if (canvas.width === width && canvas.height === containerHeight) {
			return;
		}
		barCanvas.resize(width, containerHeight);
		ctx = barCanvas.ctx;
	}

	function handlePointerDown(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		state.clickBoostActive = true;
	}

	function hookInsideCatchBox() {
		return (
			state.hookPosition >= state.catchBoxCenter - COMBAT4_CATCH_BOX_HEIGHT / 2 &&
			state.hookPosition <= state.catchBoxCenter + COMBAT4_CATCH_BOX_HEIGHT / 2
		);
	}

	function startNextCatchBoxMove() {
		const move = catchBoxBehavior.pickNextMove(state.catchBoxCenter, catchBoxMin, catchBoxMax);
		state.catchBoxDirection = move.direction;
		state.catchBoxSpeed = move.speed;
		state.catchBoxAcceleration = move.acceleration;
		state.catchBoxPhase = "move";
		state.catchBoxPhaseSecondsLeft = move.durationSeconds;
	}

	function startCatchBoxPause() {
		state.catchBoxPhase = "pause";
		state.catchBoxPhaseSecondsLeft = combat4RandomInRange(COMBAT4_PAUSE_SECONDS_RANGE);
	}

	function updateCatchBox(dtSeconds) {
		state.catchBoxPhaseSecondsLeft -= dtSeconds;
		if (state.catchBoxPhaseSecondsLeft <= 0) {
			if (state.catchBoxPhase === "move") {
				startCatchBoxPause();
			} else {
				startNextCatchBoxMove();
			}
		}

		let targetVelocity;
		let acceleration;
		if (state.catchBoxPhase === "move") {
			targetVelocity = state.catchBoxDirection * state.catchBoxSpeed;
			acceleration = state.catchBoxAcceleration;
		} else {
			const towardCentre = Math.sign((catchBoxMin + catchBoxMax) / 2 - state.catchBoxCenter) || 1;
			targetVelocity = towardCentre * COMBAT4_PAUSE_SPEED;
			acceleration = COMBAT4_PAUSE_ACCELERATION;
		}

		const step = acceleration * dtSeconds;
		if (state.catchBoxVelocity < targetVelocity) {
			state.catchBoxVelocity = Math.min(state.catchBoxVelocity + step, targetVelocity);
		} else {
			state.catchBoxVelocity = Math.max(state.catchBoxVelocity - step, targetVelocity);
		}

		const next = state.catchBoxCenter + state.catchBoxVelocity * dtSeconds;

		if (next <= catchBoxMin) {
			state.catchBoxCenter = catchBoxMin;
			state.catchBoxVelocity = Math.abs(state.catchBoxVelocity) * COMBAT4_EDGE_BOUNCE;
			if (state.catchBoxPhase === "move") {
				startCatchBoxPause();
			}
		} else if (next >= catchBoxMax) {
			state.catchBoxCenter = catchBoxMax;
			state.catchBoxVelocity = -Math.abs(state.catchBoxVelocity) * COMBAT4_EDGE_BOUNCE;
			if (state.catchBoxPhase === "move") {
				startCatchBoxPause();
			}
		} else {
			state.catchBoxCenter = next;
		}
	}

	function updateHook(dtSeconds) {
		const min = config.hookRadius;
		const max = containerHeight - config.hookRadius;

		if (state.clickBoostActive && state.hookVelocity <= -config.hookBoostTargetSpeed) {
			state.clickBoostActive = false;
		}

		if (state.clickBoostActive) {
			state.hookVelocity -= config.hookClickAccelerationUp * dtSeconds;
		} else {
			state.hookVelocity += config.hookDownAcceleration * dtSeconds;
		}

		state.hookVelocity = Math.clamp(state.hookVelocity, -config.hookMaxUpSpeed, config.hookMaxDownSpeed);
		const next = state.hookPosition + state.hookVelocity * dtSeconds;

		if (next <= min) {
			const hitRoof = next < min && state.hookVelocity < 0;
			state.hookPosition = min;
			if (state.hookVelocity < 0) {
				state.hookVelocity = 0;
			}
			state.clickBoostActive = false;
			if (hitRoof) {
				state.noiseScore += 1;
				state.roofFlashSecondsLeft = config.roofFlashSeconds;
			}
		} else if (next >= max) {
			state.hookPosition = max;
			if (state.hookVelocity > 0) {
				state.hookVelocity = 0;
			}
		} else {
			state.hookPosition = next;
		}
	}

	function updateRoofFlash(dtSeconds) {
		state.roofFlashSecondsLeft = Math.max(0, state.roofFlashSecondsLeft - dtSeconds);
	}

	function catchIsComplete() {
		return state.catchSeconds >= config.requiredCatchSeconds;
	}

	function drawCatchProgressIndicator(containerLeft) {
		const radius = 10;
		const centerX = containerLeft + config.containerWidth + radius + 6;
		const centerY = containerHeight - radius - 6;
		const progress = Math.clamp(state.catchSeconds / config.requiredCatchSeconds, 0, 1);
		const startAngle = -Math.PI / 2;
		const endAngle = startAngle + Math.PI * 2 * progress;

		ctx.fillStyle = "rgba(23, 45, 58, 0.65)";
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
		ctx.fill();

		if (progress > 0) {
			ctx.fillStyle = hookInsideCatchBox() ? "rgba(111, 226, 132, 0.9)" : "rgba(79, 193, 112, 0.72)";
			ctx.beginPath();
			ctx.moveTo(centerX, centerY);
			ctx.arc(centerX, centerY, radius - 2, startAngle, endAngle);
			ctx.closePath();
			ctx.fill();
		}

		ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
		ctx.stroke();
	}

	function drawScene() {
		const catchBoxTop = state.catchBoxCenter - COMBAT4_CATCH_BOX_HEIGHT / 2;
		const containerLeft = Math.round((canvas.width - config.containerWidth) / 2);
		const containerCenterX = containerLeft + config.containerWidth / 2;

		barCanvas.clear();

		ctx.fillStyle = "#2f89ba";
		ctx.fillRect(containerLeft, 0, config.containerWidth, containerHeight);

		ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
		ctx.fillRect(containerLeft, 0, config.containerWidth, 4);

		if (state.roofFlashSecondsLeft > 0) {
			ctx.fillStyle = "rgba(220, 40, 40, 0.82)";
			ctx.fillRect(containerLeft, 0, config.containerWidth, 8);
		}

		ctx.fillStyle = hookInsideCatchBox() ? "rgba(79, 193, 112, 0.56)" : "rgba(241, 203, 91, 0.5)";
		ctx.fillRect(containerLeft + 5, catchBoxTop, config.containerWidth - 10, COMBAT4_CATCH_BOX_HEIGHT);

		ctx.strokeStyle = "#473629";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(containerCenterX, 0);
		ctx.lineTo(containerCenterX, state.hookPosition);
		ctx.stroke();

		ctx.fillStyle = "#d79c42";
		ctx.beginPath();
		ctx.arc(containerCenterX, state.hookPosition, config.hookRadius, 0, Math.PI * 2);
		ctx.fill();

		drawCatchProgressIndicator(containerLeft);
	}

	function start() {
		const frame = time => {
			if (!state.lastUpdateTime) {
				state.lastUpdateTime = time;
			}
			const deltaMs = Math.min(time - state.lastUpdateTime, 50);
			state.lastUpdateTime = time;

			const dtSeconds = deltaMs / 1000;
			state.elapsedSeconds += dtSeconds;

			updateHook(dtSeconds);
			updateCatchBox(dtSeconds);
			updateRoofFlash(dtSeconds);

			if (hookInsideCatchBox()) {
				state.catchSeconds += dtSeconds;
			}

			if (catchIsComplete()) {
				V.combat4CaughtFish = state.fishName;
				combat4Dispose();
				Engine.play("Combat 4 Caught");
				return;
			}

			syncCanvasWidth();
			drawScene();
			state.animationFrameId = requestAnimationFrame(frame);
		};
		state.animationFrameId = requestAnimationFrame(frame);
	}

	function stop() {
		if (state.animationFrameId) {
			cancelAnimationFrame(state.animationFrameId);
			state.animationFrameId = null;
		}
	}

	state.stop = stop;
	$root.on("mousedown.combat4Minigame touchstart.combat4Minigame", handlePointerDown);
	start();
	return state;
}

Macro.add("combat4Minigame", {
	handler() {
		const fishName = this.args[0];
		const config = combat4GetConfig(fishName);
		const root = document.createElement("div");
		const barCanvas = new BaseCanvas(1, config.containerHeight);

		root.className = "fishing-bar";
		root.style.setProperty("--fishing-minigame-height", `${config.containerHeight}px`);
		barCanvas.element.classList.add("fishing-bar-canvas");
		barCanvas.element.setAttribute("aria-label", "Fishing minigame");

		this.output.append(root);
		root.append(barCanvas.element);
		combat4Dispose();
		combat4Create(root, fishName, barCanvas);
	},
});

function combat4Dispose() {
	const state = setup.combat4Minigame.state;
	if (!state) {
		return;
	}

	state.stop();
	$(state.root).off(".combat4Minigame");

	setup.combat4Minigame.state = null;
}
window.combat4Dispose = combat4Dispose;

$(document).on(":passageinit", function () {
	combat4Dispose();
});
