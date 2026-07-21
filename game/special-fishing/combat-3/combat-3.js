// UI based fishing where the movement of the catch box is controlled by a function. My issue with this one is that it is too predictable and cyclical. The roof of the catch container turning red is a leftover from other ideas (hitting the roof -> noise -> attract attention? Hitting the roof damages line, could cause fail state?)

// Each equation takes elapsed seconds and returns a position in [-1, 1] (-1 = top, +1 = bottom);
// getCatchBoxCenter maps that onto the bar.
function combat3Sine(timeSeconds) {
	return Math.sin((Math.PI * 2 * timeSeconds) / 5);
}

function combat3SlowSine(timeSeconds) {
	return Math.sin((Math.PI * 2 * timeSeconds) / 8);
}

function combat3Triangle(timeSeconds) {
	const x = timeSeconds / 5;
	return 2 * Math.abs(2 * (x - Math.floor(x + 0.5))) - 1;
}

function combat3Compound(timeSeconds) {
	return 0.6 * Math.sin((Math.PI * 2 * timeSeconds) / 5) + 0.4 * Math.sin((Math.PI * 2 * timeSeconds) / 1.7);
}

setup.combat3Minigame = {
	config: {
		containerWidth: 76,
		containerHeight: 450,
		catchBoxMovement: combat3Sine,
		catchBoxHeight: 86,
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
		perch: { catchBoxMovement: combat3Sine },
		carp: { catchBoxMovement: combat3SlowSine },
		trout: { catchBoxMovement: combat3Triangle },
		eel: { catchBoxMovement: combat3Compound },
	},
	state: null,
};

function combat3GetConfig(fishName) {
	return Object.assign({}, setup.combat3Minigame.config, setup.combat3Minigame.fishConfigs[fishName]);
}

function combat3Create(root, fishName, barCanvas) {
	const config = combat3GetConfig(fishName);
	const catchBoxMovement = config.catchBoxMovement;
	const containerHeight = config.containerHeight;

	const $root = $(root);
	const canvas = barCanvas.element;

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
	};

	let ctx = barCanvas.ctx;
	setup.combat3Minigame.state = state;

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
		return state.hookPosition >= getCatchBoxCenter() - config.catchBoxHeight / 2 && state.hookPosition <= getCatchBoxCenter() + config.catchBoxHeight / 2;
	}

	function getCatchBoxCenter() {
		const fishValue = Math.clamp(catchBoxMovement(state.elapsedSeconds), -1, 1);
		const min = config.catchBoxHeight / 2;
		const max = containerHeight - config.catchBoxHeight / 2;
		const mid = (min + max) / 2;
		const amplitude = (max - min) / 2;
		return mid - fishValue * amplitude;
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
		const catchBoxTop = getCatchBoxCenter() - config.catchBoxHeight / 2;
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
		ctx.fillRect(containerLeft + 5, catchBoxTop, config.containerWidth - 10, config.catchBoxHeight);

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
			updateRoofFlash(dtSeconds);

			if (hookInsideCatchBox()) {
				state.catchSeconds += dtSeconds;
			}

			if (catchIsComplete()) {
				V.combat3CaughtFish = state.fishName;
				combat3Dispose();
				Engine.play("Combat 3 Caught");
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
	$root.on("mousedown.combat3Minigame touchstart.combat3Minigame", handlePointerDown);
	start();
	return state;
}

Macro.add("combat3Minigame", {
	handler() {
		const fishName = this.args[0];
		const config = combat3GetConfig(fishName);
		const root = document.createElement("div");
		const barCanvas = new BaseCanvas(1, config.containerHeight);

		root.className = "fishing-bar";
		root.style.setProperty("--fishing-minigame-height", `${config.containerHeight}px`);
		barCanvas.element.classList.add("fishing-bar-canvas");
		barCanvas.element.setAttribute("aria-label", "Fishing minigame");

		this.output.append(root);
		root.append(barCanvas.element);
		combat3Dispose();
		combat3Create(root, fishName, barCanvas);
	},
});

function combat3Dispose() {
	const state = setup.combat3Minigame.state;
	if (!state) {
		return;
	}

	state.stop();
	$(state.root).off(".combat3Minigame");

	setup.combat3Minigame.state = null;
}
window.combat3Dispose = combat3Dispose;

$(document).on(":passageinit", function () {
	combat3Dispose();
});
