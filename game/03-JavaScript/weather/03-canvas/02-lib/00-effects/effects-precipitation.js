Weather.Renderer.Effects.add({
	name: "particleRain",

	defaultParameters: {
		sunTint: "#ffffffbb",
		moonTint: "#3b5580",
		dawnDuskTint: "#dbb695",
		groundDayTint: "#ffffffbb",
		groundNightTint: "#7895c4",
		groundDawnDuskTint: "#a08160",
		baseAlpha: 1,

		dropCount: 300,
		dropSpeed: 1,
		windStrength: 1,
		windAngle: 0, // Radians
		dropLength: 3,
		dropWidth: 1,

		enableSplashes: true,
		splashTriggerTop: 20, // px above bottom before splash
		splashTriggerBottom: 0, // bottom border of splash
		splashMaxRadius: 4, // px
		splashLineWidth: 0.5, // px
		splashParticleCount: 2, // how many tiny particles per splash
		splashParticleSpeed: 6, // max initial speed
		splashParticleGravity: 2, // gravity pulling them down
		splashParticleFadeTime: 0.7, // seconds to fade out

		splashMinScale: 0.1, // minimum scale of splashes based on distance from the bottom (hardcoded to 25px to be minimum)
	},

	async init() {
		const { width, height } = this.canvas.element;
		this.splashes = [];
		this.splashEmitters = [];

		// horizontal drift so offscreen spawns drift into view
		const vy0 = this.dropSpeed * Math.cos(this.windAngle);
		const vx0 = this.dropSpeed * this.windStrength * Math.sin(this.windAngle);
		const lifeY = height + this.dropLength;
		const drift = Math.abs((vx0 / vy0) * lifeY);

		const minX = -drift;
		const maxX = width + drift;

		// build & self‑drive the system
		this.particleEmitter = new Weather.Renderer.ParticleEmitter(this.canvas.ctx, {
			origin: { x: 0, y: -this.dropLength },
			maxParticles: this.dropCount * 10,
			spawnRate: this.dropCount,
			preWarm: true,
			curve: 0,
			initialSettings: {
				shape: "line",
				size: { w: this.dropLength, h: this.dropWidth },
				color: this.topColor,
				alpha: this.baseAlpha,
				lifetime: lifeY / vy0,
				gravity: 0,
				fade: false,
			},
			generator: () => {
				const x0 = Math.random() * (maxX - minX) + minX;
				const vy = vy0 + (Math.random() * 0.2 - 0.1);
				const vx = vx0 + (Math.random() * 0.2 - 0.1);

				// determine a random death‑band within your trigger range
				const range = this.splashTriggerTop - this.splashTriggerBottom;
				const offset = this.splashTriggerBottom + Math.random() * range;

				const collisionY = this.canvas.element.height - offset;
				const collisionTime = (collisionY + this.dropLength) / vy;
				const shrinkDuration = this.dropLength / Math.hypot(vx, vy);
				const totalLifetime = collisionTime + shrinkDuration;

				return {
					x: x0,
					velocity: { x: vx, y: vy },
					lifetime: totalLifetime,
					shrinkDuration,
					collisionTime,
				};
			},

			onCollision: p => {
				const v = p.velocity;
				const mag = Math.hypot(v.x, v.y) || 1;
				const dx = v.x / mag;
				const dy = v.y / mag;
				const headX = p.position.x + dx * p.length;
				const headY = p.position.y + dy * p.length;

				// now drop the ripple exactly at the head:
				this.splashes.push({ x: headX, y: headY, frame: 0 });

				if (!this.enableSplashes) return;

				const dist = height - p.position.y;
				const frac = Math.min(Math.max(dist / 25, 0), 1);
				const scale = 1 - frac * (1 - this.splashMinScale);

				// 2) mini splash-particle system
				const splashSys = new Weather.Renderer.ParticleEmitter(this.canvas.ctx, {
					origin: { x: headX, y: headY },
					maxParticles: this.splashParticleCount,
					spawnRate: null,
					spawnInterval: 0.01,
					preWarm: false,
					autoDestroy: true,
					initialSettings: {
						shape: "rect",
						size: { w: scale, h: scale },
						color: this.bottomColor,
						alpha: 1,
						fade: true,
						fadeTime: this.splashParticleFadeTime,
						gravity: this.splashParticleGravity,
					},
					generator: () => ({
						velocity: {
							x: (Math.random() * 2 - 1) * this.splashParticleSpeed * scale,
							y: -Math.random() * this.splashParticleSpeed * scale,
						},
						lifetime: this.splashParticleFadeTime * 1.1,
					}),
					animationGroup: this.parentLayer.animationGroup,
				});

				this.splashEmitters.push(splashSys);
			},
			animationGroup: this.parentLayer.animationGroup,
		});
	},

	onEnable() {
		this.particleEmitter.enable();
	},

	onDisable() {
		this.particleEmitter.disable();
	},

	draw() {
		const perf = performance.now();
		const ctx = this.canvas.ctx;
		const height = this.canvas.element.height;
		const { topColor, bottomColor, splashMinScale, splashMaxRadius, splashLineWidth, baseAlpha } = this;

		this.particleEmitter.initialSettings.color = topColor;

		// 2) tint all existing drops by their y-position
		for (const p of this.particleEmitter.particles) {
			const yFactor = Math.min(Math.max(p.position.y / height, 0), 1);
			p.color = ColourUtils.interpolateColor(topColor, bottomColor, yFactor);
		}
		this.canvas.clear();

		// Drops
		this.particleEmitter.draw();

		// Line-ripples
		for (let i = this.splashes.length - 1; i >= 0; i--) {
			const s = this.splashes[i];
			s.frame++;
			const raw = Math.min(s.frame * 0.5, splashMaxRadius);
			// compute scale
			const dist = height - s.y;
			const frac = Math.min(dist / 25, 1);
			const scale = 1 - frac * (1 - splashMinScale);

			const len = raw * scale;
			const lineWidth = splashLineWidth * scale;
			const alpha = (1 - raw / splashMaxRadius) * baseAlpha;

			ctx.save();
			ctx.strokeStyle = this.bottomColor;
			ctx.lineWidth = lineWidth;
			ctx.globalAlpha = alpha;
			ctx.beginPath();
			ctx.moveTo(s.x - len, s.y);
			ctx.lineTo(s.x + len, s.y);
			ctx.stroke();
			ctx.restore();

			if (raw >= splashMaxRadius) this.splashes.splice(i, 1);
		}

		// Splash-particles
		for (let i = this.splashEmitters.length - 1; i >= 0; i--) {
			const sys = this.splashEmitters[i];
			sys.draw();
			if (sys.particles.length === 0) {
				this.splashEmitters.splice(i, 1);
			}
		}
		console.log("draw performance:", performance.now() - perf);
	},
});

Weather.Renderer.Effects.add({
	name: "particleSnow",

	defaultParameters: {
		// time‑of‑day tints (same as rain)
		sunTint: "#ffffffbb",
		moonTint: "#3b5580",
		dawnDuskTint: "#dbb695",
		groundDayTint: "#ffffffbb",
		groundNightTint: "#7895c4",
		groundDawnDuskTint: "#a08160",

		// snow specifics
		dropCount: 200, // flakes per second
		dropSpeed: 0.5, // slower fall
		windStrength: 0.3,
		windAngle: 0, // straight down
		dropSize: 1,
		baseAlpha: 1,

		wobbleAmplitude: 0.5, // px side‑to‑side
		wobbleFrequency: 1, // cycles/sec

		pileTriggerTop: 20, // max px above bottom that can pile
		pileTriggerBottom: 0, // min px above bottom

		// when flakes “hit,” they become a static pixel fading out
		pixelFadeTime: 1.5, // seconds to fade

		snowGlare: false,
		glareInterval: 50, // avg secs between glints
		glareDuration: 0.5, // secs each glint lasts
		glareBlur: 0.5, // px of blur halo
		glareAlpha: 1, // opacity of the halo
		glareColor: "#ffffff",
	},

	async init() {
		const { width, height } = this.canvas.element;
		this.staticPixels = [];

		// compute horizontal drift from wind
		const curve = this.windStrength * this.dropSpeed * Math.sin(this.windAngle);
		const drift = Math.abs((height + this.dropSize) * Math.tan(this.windAngle));
		const windDir = Math.sign(curve);
		const minX = windDir < 0 ? 0 : -drift;
		const maxX = windDir > 0 ? width : width + drift;

		this.deltaTime = this.parentLayer.animationGroup.updateRate / 1000;

		// single shared emitter for flakes
		this.particleEmitter = new Weather.Renderer.ParticleEmitter(this.canvas.ctx, {
			origin: { x: 0, y: -this.dropSize },
			maxParticles: this.dropCount * 10,
			spawnRate: this.dropCount,
			preWarm: true,
			curve,
			initialSettings: {
				shape: "rect",
				size: { w: this.dropSize, h: this.dropSize },
				color: this.topColor,
				alpha: this.baseAlpha,
				fade: false,
				wobbleAmplitude: this.wobbleAmplitude,
				wobbleFrequency: this.wobbleFrequency,
				lifetime: (height + this.dropSize) / this.dropSpeed,
			},
			generator: () => {
				const x0 = Math.random() * (maxX - minX) + minX;
				// vertical speed ± small jitter
				const vy = this.dropSpeed + (Math.random() * 0.2 - 0.1);
				const vx = this.dropSpeed * this.windStrength * Math.sin(this.windAngle) + (Math.random() * 0.1 - 0.05);

				// pick a random “pile band” between bottom & top triggers
				const range = this.pileTriggerTop - this.pileTriggerBottom;
				const offset = this.pileTriggerBottom + Math.random() * range;
				const collisionY = height - offset;

				// time to collision = distance / vertical speed
				const collisionTime = (collisionY + this.dropSize) / vy;

				return {
					x: x0,
					velocity: { x: vx, y: vy },
					lifetime: collisionTime,
					collisionTime,
				};
			},
			// when a flake “collides”:
			onCollision: p => {
				// record one static‐pixel at the point of collision:
				this.staticPixels.push({
					x: p.position.x,
					y: p.position.y,
					age: 0,
				});
			},
			animationGroup: this.parentLayer.animationGroup,
		});
		this.glareState = new WeakMap();
	},

	onEnable() {
		this.particleEmitter.enable();
	},
	onDisable() {
		this.particleEmitter.disable();
	},

	draw() {
		const ctx = this.canvas.ctx;
		const { topColor, bottomColor, pixelFadeTime, dropSize, snowGlare, glareInterval, glareDuration, glareBlur, glareAlpha, glareColor } = this;

		this.canvas.clear();
		this.particleEmitter.draw();

		// snow glare
		if (snowGlare) {
			ctx.save();

			const halfDur = glareDuration / 2;

			for (const p of this.particleEmitter.particles) {
				let st = this.glareState.get(p);
				if (!st) {
					st = { time: null, next: Math.random() * glareInterval };
					this.glareState.set(p, st);
				}

				if (st.time != null) {
					// in a glare
					st.time += this.deltaTime;
					if (st.time < glareDuration) {
						// fade in/out
						const frac = st.time < halfDur ? st.time / halfDur : (glareDuration - st.time) / halfDur;
						ctx.globalAlpha = frac * glareAlpha;
						ctx.fillStyle = glareColor;
						ctx.shadowColor = glareColor;
						ctx.shadowBlur = dropSize * 2.4;
						ctx.shadowOffsetX = 0;
						ctx.shadowOffsetY = 0;

						ctx.beginPath();
						ctx.arc(p.position.x, p.position.y, dropSize, 0, 2 * Math.PI);
						ctx.fill();
					} else {
						st.time = null;
						st.next = Math.random() * glareInterval;
					}
				} else {
					st.next -= this.deltaTime;
					if (st.next <= 0) {
						st.time = 0;
					}
				}
			}

			ctx.restore();
		}

		// Tint
		for (const p of this.particleEmitter.particles) {
			const yf = Math.max(0, Math.min(1, p.position.y / this.canvas.element.height));
			p.color = ColourUtils.interpolateColor(topColor, bottomColor, yf);
		}

		// Fadeout
		for (let i = this.staticPixels.length - 1; i >= 0; i--) {
			const px = this.staticPixels[i];
			px.age += this.deltaTime;
			const alpha = 1 - px.age / pixelFadeTime;
			if (alpha <= 0) {
				this.staticPixels.splice(i, 1);
				continue;
			}
			const yf = Math.max(0, Math.min(1, px.y / this.canvas.element.height));
			const col = ColourUtils.interpolateColor(topColor, bottomColor, yf);
			ctx.save();
			ctx.globalAlpha = alpha;
			ctx.fillStyle = col;
			ctx.fillRect(px.x, px.y, dropSize, dropSize);
			ctx.restore();
		}
	},
});
