setup.fishingMinigame = {
	config: {
		containerWidth: 76,
		containerHeight: 450,
		catchBoxMovement: fishEquation1,
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
	fishConfigs: {},
	state: null,
};

function fishEquation1(timeSeconds) {
	return Math.sin((Math.PI * 2 * timeSeconds) / 5);
}

// function fishEquation2(timeSeconds) {
// 	return Math.floor(timeSeconds / 3.5) % 2 === 0 ? -1 : 1;
// }

function getFishingMinigameConfig(fishName) {
	return Object.assign({}, setup.fishingMinigame.config, setup.fishingMinigame.fishConfigs[fishName] || {});
}

function createFishingMinigame(root, fishName, barCanvas) {
	const config = getFishingMinigameConfig(fishName);
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
	setup.fishingMinigame.state = state;

	function syncCanvasWidth() {
		const width = Math.round(canvas.getBoundingClientRect().width);
		if (canvas.width === width && canvas.height === containerHeight) return;
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

		if (state.clickBoostActive && state.hookVelocity <= -config.hookBoostTargetSpeed) state.clickBoostActive = false;

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
			if (state.hookVelocity < 0) state.hookVelocity = 0;
			state.clickBoostActive = false;
			if (hitRoof) {
				state.noiseScore += 1;
				state.roofFlashSecondsLeft = config.roofFlashSeconds;
			}
		} else if (next >= max) {
			state.hookPosition = max;
			if (state.hookVelocity > 0) state.hookVelocity = 0;
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

		// Containing bar
		ctx.fillStyle = "#2f89ba";
		ctx.fillRect(containerLeft, 0, config.containerWidth, containerHeight);

		// Roof
		ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
		ctx.fillRect(containerLeft, 0, config.containerWidth, 4);

		// Roof flash
		if (state.roofFlashSecondsLeft > 0) {
			ctx.fillStyle = "rgba(220, 40, 40, 0.82)";
			ctx.fillRect(containerLeft, 0, config.containerWidth, 8);
		}

		// Catch zone
		ctx.fillStyle = hookInsideCatchBox() ? "rgba(79, 193, 112, 0.56)" : "rgba(241, 203, 91, 0.5)";
		ctx.fillRect(containerLeft + 5, catchBoxTop, config.containerWidth - 10, config.catchBoxHeight);

		// Fishing line
		ctx.strokeStyle = "#473629";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(containerCenterX, 0);
		ctx.lineTo(containerCenterX, state.hookPosition);
		ctx.stroke();

		// Bob
		ctx.fillStyle = "#d79c42";
		ctx.beginPath();
		ctx.arc(containerCenterX, state.hookPosition, config.hookRadius, 0, Math.PI * 2);
		ctx.fill();

		drawCatchProgressIndicator(containerLeft);
	}

	function start() {
		const frame = time => {
			if (!state.lastUpdateTime) state.lastUpdateTime = time;
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
				disposeFishingMinigame();
				Engine.play("Bedroom");
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
	$root.on("mousedown.fishingMinigame touchstart.fishingMinigame", handlePointerDown);
	start();
	return state;
}

Macro.add("fishingMinigame", {
	handler() {
		const fishName = this.args[0];
		const config = getFishingMinigameConfig(fishName);
		const root = document.createElement("div");
		const barCanvas = new BaseCanvas(1, config.containerHeight);

		root.className = "fishing-bar";
		root.style.setProperty("--fishing-minigame-height", `${config.containerHeight}px`);
		barCanvas.element.classList.add("fishing-bar-canvas");
		barCanvas.element.setAttribute("aria-label", "Fishing minigame");

		this.output.append(root);
		root.append(barCanvas.element);
		disposeFishingMinigame();
		createFishingMinigame(root, fishName, barCanvas);
	},
});

function disposeFishingMinigame() {
	const state = setup.fishingMinigame.state;
	if (!state) return;

	state.stop();
	$(state.root).off(".fishingMinigame");

	setup.fishingMinigame.state = null;
}

$(document).on(":passageinit", function () {
	disposeFishingMinigame();
});
