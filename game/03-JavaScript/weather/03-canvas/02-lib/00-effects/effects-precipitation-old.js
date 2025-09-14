// Weather.Renderer.Effects.add({
// 	name: "proceduralPrecipitation2",
// 	defaultParameters: {
// 		precipitation: "rain", // "rain" or "snow"

// 		dropCount: 300,
// 		minDistance: 12,
// 		dropLength: 3,
// 		dropWidth: 1,
// 		dropSpeed: 1,
// 		windAngle: 0.4,
// 		baseAlpha: 1,

// 		// Lighting
// 		sunTint: "#ffffffbb",
// 		moonTint: "#7895c4",
// 		dawnDuskTint: "#dbb695",
// 		backgroundTint: "#FFD27F",
// 		backgroundLight: false,
// 		bgTintRange: 100,

// 		groundDayTint: "#ffffffbb",
// 		groundNightTint: "#7895c4",
// 		groundDawnDuskTint: "#a08160",

// 		enableCollision: false,
// 		enableSplashes: false,
// 		collisionThreshold: 3,
// 		splashLifetime: 0.8, // seconds, for snow fade
// 		splashMaxRadius: 5, // px, for rain
// 		splashLineWidth: 0.5, // px

// 		// Snow
// 		wobbleAmplitude: 0.5, // px
// 		wobbleFrequency: 2, // cycles per second
// 		glareThreshold: 0.8, // min sunFactor to allow glare
// 		glareDuration: 0.35, // sec each flake stays full-white
// 		glareInterval: 15, // avg sec between glare attempts
// 	},

// 	async init() {
// 		const width = this.canvas.element.width;
// 		const height = this.canvas.element.height;
// 		if (!this.snowGlare) this.glareInterval = 0;
// 		this.alpha = this.baseAlpha;

// 		this.bgTint = this.backgroundTint;

// 		// gravity
// 		this.vx0 = this.dropSpeed * Math.sin(this.windAngle);
// 		this.vy0 = this.dropSpeed * Math.cos(this.windAngle);

// 		const lifeDist = height + this.dropLength;
// 		// horizontal offset needed so drops spawned off‐screen move correctly into view
// 		this.hDrift = Math.abs(lifeDist * Math.tan(this.windAngle));

// 		// Create drops
// 		this.drops = [];
// 		for (let i = 0; i < this.dropCount; i++) {
// 			const drop = {
// 				x: 0,
// 				y: 0,
// 				wobblePhase: Math.random() * Math.PI * 2,
// 				nextSplashY: null,
// 				nextGlare: this.glareInterval ? Math.random() * this.glareInterval : 0,
// 				glareTimer: 0,
// 			};

// 			// Try to spread them apart
// 			let tries = 0;
// 			do {
// 				drop.x = Math.random() * (width + this.hDrift) - this.hDrift;
// 				drop.y = Math.random() * height;
// 				tries++;
// 			} while (tries < 10 && this.drops.some(other => Math.abs(other.x - drop.x) < this.minDistance));
// 			this.drops.push(drop);
// 		}

// 		// Ticker - uses same animation timings as location-images
// 		// Since we're not working with images, we only need a dummy canvas
// 		const interval = this.parentLayer.animationGroup.updateRate;
// 		const ticker = new Weather.Renderer.Animation({
// 			image: new BaseCanvas(1, 1).element,
// 			canvas: this.canvas,
// 			numFrames: 1,
// 			frameDelay: interval,
// 			offset: 0,
// 			alwaysDisplay: false,
// 		});
// 		this.parentLayer.animationGroup.add(${this.id}_ticker, ticker);
// 		ticker.enable();

// 		this.timer = 0;
// 		this.deltaTime = interval / 1000;
// 		this.splashes = [];
// 	},

// 	draw() {
// 		const ctx = this.canvas.ctx;
// 		const width = this.canvas.element.width;
// 		const height = this.canvas.element.height;

// 		this.bgLight = this.backgroundLight ? 1 : 0;
// 		this.timer += this.deltaTime;
// 		ctx.clearRect(0, 0, width, height);

// 		// compute time‐of‐day tint once
// 		const nightPhaseTint = ColourUtils.interpolateColor("#000000", this.moonTint, this.moonFactor);
// 		const timeOfDayTint = ColourUtils.interpolateTripleColor(nightPhaseTint, this.dawnDuskTint, this.sunTint, this.sunFactor);
// 		const groundNightPhase = ColourUtils.interpolateColor("#000000", this.groundNightTint, this.moonFactor);
// 		const groundTimeOfDayTint = ColourUtils.interpolateTripleColor(groundNightPhase, this.groundDawnDuskTint, this.groundDayTint, this.sunFactor);

// 		const collisionY = height - this.collisionThreshold;
// 		const splashesEnabled = this.enableSplashes;

// 		// update & draw drops
// 		for (const drop of this.drops) {
// 			// Snow glare
// 			if (this.precipitation === "snow" && this.glareInterval) {
// 				if (drop.glareTimer > 0) {
// 					drop.glareTimer = Math.max(0, drop.glareTimer - this.deltaTime);
// 				} else if (this.sunFactor >= this.glareThreshold) {
// 					drop.nextGlare -= this.deltaTime;
// 					if (drop.nextGlare <= 0) {
// 						drop.glareTimer = this.glareDuration;
// 						drop.nextGlare = Math.random() * this.glareInterval;
// 					}
// 				}
// 			}

// 			// Snow wobble
// 			const wobble = this.precipitation === "snow" ? Math.sin(drop.wobblePhase + this.timer * this.wobbleFrequency) * this.wobbleAmplitude : 0;

// 			drop.x += this.vx0 + wobble;
// 			drop.y += this.vy0;

// 			const size = this.precipitation === "snow" ? this.dropWidth : this.dropLength;
// 			const bottomY = drop.y + size;

// 			// Collision / determine splashes
// 			if (drop.nextSplashY === null && drop.y >= collisionY) {
// 				const threshold = this.enableCollision ? height - Math.random() * 20 : height;
// 				drop.nextSplashY = threshold + size;
// 			}
// 			if (drop.nextSplashY !== null && bottomY >= drop.nextSplashY) {
// 				if (splashesEnabled) {
// 					this.splashes.push({ x: drop.x, y: drop.y + this.dropWidth, frame: 0, type: this.precipitation });
// 				}
// 				drop.y = -this.dropLength;
// 				drop.x = Math.random() * (width + 2 * this.hDrift) - this.hDrift;
// 				drop.nextSplashY = null;
// 				continue;
// 			}

// 			// Bottom tint
// 			const yFactor = Math.clamp(drop.y / height, 0, 1);
// 			const verticalTint = ColourUtils.interpolateColor(timeOfDayTint, groundTimeOfDayTint, yFactor);

// 			const blend = Math.clamp((bottomY - (height - this.bgTintRange)) / this.bgTintRange, 0, 1);
// 			const alpha = Math.clamp(this.alpha + (1 - this.alpha) * blend * this.bgLight, 0, 1);
// 			ctx.globalAlpha = Math.min(1, alpha);
// 			const bottomHex = ColourUtils.interpolateColor(verticalTint, this.bgTint, blend * this.bgLight);

// 			if (this.precipitation === "rain") {
// 				const angle = Math.atan2(this.vx0, this.vy0);
// 				const x1 = drop.x;
// 				const y1 = drop.y;
// 				const x2 = x1 + this.dropLength * Math.sin(angle);
// 				const y2 = y1 + this.dropLength * Math.cos(angle);

// 				const grad = ctx.createLinearGradient(x1, y1, x2, y2);
// 				grad.addColorStop(0, verticalTint);
// 				grad.addColorStop(1, bottomHex);

// 				ctx.strokeStyle = grad;
// 				ctx.lineWidth = this.dropWidth;
// 				ctx.beginPath();
// 				ctx.moveTo(x1, y1);
// 				ctx.lineTo(x2, y2);
// 				ctx.stroke();
// 			} else {
// 				// snow
// 				ctx.save();
// 				if (drop.glareTimer > 0) {
// 					const glareSize = this.dropWidth * 1.5;
// 					ctx.fillStyle = bottomHex;
// 					ctx.shadowColor = bottomHex;
// 					ctx.shadowBlur = glareSize * 2.4;
// 					ctx.shadowOffsetX = 0;
// 					ctx.shadowOffsetY = 0;
// 					ctx.fillRect(drop.x - glareSize / 2, drop.y - glareSize / 2, glareSize, glareSize);
// 				} else {
// 					ctx.fillStyle = bottomHex;
// 					ctx.fillRect(drop.x, drop.y, this.dropWidth, this.dropWidth);
// 				}
// 				ctx.restore();
// 			}
// 		}

// 		// splashes / snow fades
// 		if (splashesEnabled) {
// 			for (let i = this.splashes.length - 1; i >= 0; --i) {
// 				const s = this.splashes[i];
// 				s.frame++;

// 				ctx.save();

// 				// Ripple + splash
// 				if (s.type === "rain") {
// 					const rawLen = s.frame * 0.5;
// 					const cappedLen = Math.min(rawLen, this.splashMaxRadius);
// 					const alpha = Math.max(0, 1 - cappedLen / this.splashMaxRadius) * this.alpha;
// 					const splashDepth = height - s.y;
// 					const depthFactor = Math.max(0, Math.min((30 - splashDepth) / 30, 1));
// 					const len = cappedLen * depthFactor;

// 					ctx.strokeStyle = groundTimeOfDayTint;
// 					ctx.globalAlpha = alpha;
// 					ctx.lineWidth = this.splashLineWidth * depthFactor;
// 					ctx.beginPath();
// 					ctx.moveTo(s.x - len, s.y);
// 					ctx.lineTo(s.x + len, s.y);
// 					ctx.stroke();

// 					// Splash pixels
// 					ctx.globalAlpha = alpha * 0.3;
// 					ctx.fillStyle = groundTimeOfDayTint;
// 					const count = Math.max(1, 3 - Math.floor(splashDepth / (30 / 3)));
// 					for (let k = 0; k < count; ++k) {
// 						const px = (Math.random() * 0.4 - 0.2) * len;
// 						const py = -len * 0.4;
// 						ctx.fillRect(s.x + px, s.y + py, 0.5, 0.5);
// 					}

// 					if (rawLen >= this.splashMaxRadius) this.splashes.splice(i, 1);
// 				} else {
// 					// Snow just fades out
// 					const alpha = Math.max(0, 1 - (s.frame * this.deltaTime) / this.splashLifetime);
// 					if (alpha <= 0) {
// 						this.splashes.splice(i, 1);
// 					} else {
// 						ctx.fillStyle = groundTimeOfDayTint;
// 						ctx.globalAlpha = alpha;
// 						ctx.fillRect(s.x - this.dropWidth / 2, s.y - this.dropWidth / 2, this.dropWidth, this.dropWidth);
// 					}
// 				}
// 				ctx.restore();
// 			}
// 		}
// 	},
// });
