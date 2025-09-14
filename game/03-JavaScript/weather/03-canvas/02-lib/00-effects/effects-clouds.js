Weather.Renderer.Effects.add({
	name: "clouds",
	defaultParameters: {
		clouds: [],
		targetCloudCount: {},
		layerIndex: 0,
		currentWeather: null,
		overlapLimit: 0.4,
	},
	init() {
		if (!this.weatherType) return;
		const bottomY = this.bottomY * this.renderInstance.settings.scale;
		const movementSpeed = this.movement.baseSpeed * this.renderInstance.settings.scale;
		const leaveSpeed = this.movement.leaveSpeed * this.renderInstance.settings.scale;

		const updateTargetCount = () => {
			if (this.currentWeather === this.weather.name) return;
			this.currentWeather = this.weather.name;

			for (const key in this.weatherType.cloudCount) {
				if (Object.hasOwn(this.weatherType.cloudCount, key)) {
					this.targetCloudCount[key] = this.weatherType.cloudCount[key]();
				}
			}
		};

		this.generateClouds = (offScreen = true, randomPosition = false) => {
			const allClouds = this.clouds.flat();
			const cloudsByType = allClouds.reduce((acc, cloud) => {
				(acc[cloud.type] = acc[cloud.type] || []).push(cloud);
				return acc;
			}, {});

			// Reset movement speed of all clouds
			allClouds.forEach(cloud => {
				cloud.movementSpeed = movementSpeed;
			});

			Object.entries(this.targetCloudCount).forEach(([type, targetCount]) => {
				const allCloudsOfType = cloudsByType[type] || [];
				const currentCount = allCloudsOfType.length;
				const cloudsNeeded = targetCount - currentCount;

				if (cloudsNeeded <= 0) {
					if (cloudsNeeded < 0) {
						// Increase movement for excessive clouds to make them leave the canvas faster
						// in case of a weather change
						allCloudsOfType.slice(-cloudsNeeded).forEach(cloud => {
							cloud.movementSpeed = leaveSpeed;
						});
					}
					return;
				}

				// Shuffle sprites to reduce duplicates (same sprite generating twice in a row)
				const shuffledSprites = this.renderInstance.rng.shuffle([...this.types[type]]);

				// Add cloud to the least populated layer, starting with layer 0 - for a more even spread
				for (let i = 0; i < cloudsNeeded; i++) {
					const layerIndex = this.clouds
						.map((layer, index) => ({ index, count: layer.length }))
						.reduce((minLayer, layer) => (layer.count < minLayer.count ? layer : minLayer), { index: 0, count: Infinity }).index;
					const spriteIndex = i % shuffledSprites.length;
					const sprite = this.images[shuffledSprites[spriteIndex]];
					const layerSettings = this.layers[layerIndex];

					let cloud = null;
					let attempts = 0;

					do {
						let x = offScreen ? -sprite.width : this.renderInstance.rng.randomInt(0, this.canvas.element.width) - sprite.width / 2;
						if (offScreen && randomPosition) {
							x -= this.renderInstance.rng.randomInt(0, this.canvas.element.width / 2);
						}
						const y = this.renderInstance.rng.randomInt(
							layerSettings.height.min * this.renderInstance.settings.scale,
							Math.min(layerSettings.height.max * this.renderInstance.settings.scale, bottomY - sprite.height)
						);
						cloud = { sprite, type, x, y, z: layerIndex, movementSpeed, width: sprite.width, height: sprite.height };
						attempts++;
					} while (attempts < 5 && Weather.Renderer.Sky.isOverlappingAny(cloud, this.clouds[layerIndex], this.overlapLimit));

					this.clouds[layerIndex].push(cloud);
				}
			});
		};

		this.elapsedTime = () => {
			if (!this.currentDate) {
				this.currentDate = new DateTime(Time.date);
			}
			return this.currentDate?.compareWith(Time.date, true) / TimeConstants.secondsPerMinute;
		};

		this.reset = () => {
			this.clouds = [];
		};

		updateTargetCount();
		if (!this.clouds.length || this.elapsedTime() >= 3 * Time.minutesPerHour) {
			for (let i = 0; i < this.layers.length; i++) {
				this.clouds[i] = [];
			}
			this.currentDate = new DateTime(Time.date);
			this.generateClouds(false);
			return;
		}
		this.generateClouds(true, true);
	},
	draw() {
		const elapsedTime = this.elapsedTime();
		this.currentDate = new DateTime(Time.date);
		let cloudGeneration = false;

		for (let layerIndex = this.layers.length - 1; layerIndex >= 0; layerIndex--) {
			const cloudLayer = this.clouds[layerIndex];
			if (!cloudLayer || cloudLayer.length === 0) {
				continue;
			}
			const cloudCanvas = new this.renderInstance.Canvas();
			const layerSettings = this.layers[layerIndex];
			let i = 0;
			while (cloudLayer[i]) {
				const cloud = cloudLayer[i];
				cloud.x += (cloud.movementSpeed / (1 + layerIndex * layerSettings.speedFactor)) * elapsedTime;

				// Remove off-screen clouds
				if (cloud.x > cloudCanvas.element.width) {
					cloudLayer.splice(i, 1);
					cloudGeneration = true;
					continue;
				}

				cloudCanvas.ctx.drawImage(cloud.sprite, Math.round(cloud.x), Math.round(cloud.y), cloud.sprite.width, cloud.sprite.height);
				i++;
			}
			cloudCanvas.ctx.globalAlpha = layerSettings.alpha;
			cloudCanvas.ctx.fillStyle = layerSettings.color;
			cloudCanvas.ctx.globalCompositeOperation = "source-atop";
			cloudCanvas.fillRect();
			this.canvas.drawImage(cloudCanvas.element);
		}

		if (cloudGeneration) this.generateClouds();
	},
});

Weather.Renderer.Effects.add({
	name: "cirrus",
	defaultParameters: {
		clouds: [],
		targetCount: 0,
		currentWeather: null,
		overlapLimit: 0.3,
	},
	init() {
		const movementSpeed = this.movement.speed * this.renderInstance.settings.scale;
		const updateTargetCount = () => {
			if (this.currentWeather === this.weather.name) return;
			this.currentWeather = this.weather.name;
			this.targetCount = this.renderInstance.rng.randomInt(this.count.min, this.count.max);
		};

		this.generateClouds = (offScreen = true, randomPosition = false) => {
			const currentCount = this.clouds.length;
			const cloudsNeeded = this.targetCount - currentCount;

			// Shuffle sprites to reduce duplicates (same sprite generating twice in a row)
			const shuffledSprites = this.renderInstance.rng.shuffle(Object.values(this.images));

			for (let i = 0; i < cloudsNeeded; i++) {
				const spriteIndex = i % shuffledSprites.length;
				const sprite = shuffledSprites[spriteIndex];

				let cloud = null;
				let attempts = 0;

				do {
					let x = offScreen ? -sprite.width : this.renderInstance.rng.randomInt(-sprite.width, this.canvas.element.width - sprite.width / 2);
					if (offScreen && randomPosition) {
						x -= this.renderInstance.rng.randomInt(0, this.canvas.element.width / 2);
					}
					const y = this.renderInstance.rng.randomInt(
						this.height.min * this.renderInstance.settings.scale,
						this.height.max * this.renderInstance.settings.scale
					);
					cloud = { sprite, x, y, movementSpeed, width: sprite.width, height: sprite.height };
					attempts++;
				} while (attempts < 5 && Weather.Renderer.Sky.isOverlappingAny(cloud, this.clouds, this.overlapLimit));

				this.clouds.push(cloud);
			}
		};

		this.elapsedTime = () => {
			if (!this.currentDate) {
				this.currentDate = new DateTime(Time.date);
			}
			return this.currentDate?.compareWith(Time.date, true) / TimeConstants.secondsPerMinute;
		};

		updateTargetCount();
		if (!this.clouds.length || this.elapsedTime() >= 3 * Time.minutesPerHour) {
			this.currentDate = new DateTime(Time.date);
			this.generateClouds(false);
			return;
		}
		this.generateClouds(true, true);
	},
	draw() {
		const elapsedTime = this.elapsedTime();
		this.currentDate = new DateTime(Time.date);
		let cloudGeneration = false;

		if (!this.clouds.length) {
			return;
		}

		let i = 0;
		while (this.clouds[i]) {
			const cloud = this.clouds[i];
			cloud.x += cloud.movementSpeed * elapsedTime;

			// Remove off-screen clouds
			if (cloud.x > this.canvas.element.width) {
				this.clouds.splice(i, 1);
				cloudGeneration = true;
				continue;
			}

			this.canvas.ctx.globalAlpha = this.factor * this.baseAlpha;
			this.canvas.ctx.drawImage(cloud.sprite, Math.round(cloud.x), Math.round(cloud.y), cloud.sprite.width, cloud.sprite.height);
			i++;
		}

		if (cloudGeneration) this.generateClouds();
	},
});

Weather.Renderer.Effects.add({
	name: "overcast",
	effects: [
		{
			effect: "imageOverlay",
			bindings: {
				images() {
					return {
						overlay: this.images.overcast,
					};
				},
				factor() {
					return this.overcastFactor;
				},
			},
		},
	],
	init() {
		if (this.currentWeather === this.weather.name) return;
		this.currentWeather = this.weather.name;
		this.effects[0].init();
	},
	draw() {
		this.effects[0].draw();
		this.canvas.drawImage(this.effects[0].canvas.element);
	},
});

Weather.Renderer.Effects.add({
	name: "fog",
	effects: [
		{
			effect: "imageOverlay",
			bindings: {
				images() {
					return {
						overlay: this.images.fog,
					};
				},
				factor() {
					return this.fogFactor;
				},
			},
		},
	],
	init() {
		this.effects[0].init();
	},
	draw() {
		this.effects[0].draw();
		this.canvas.drawImage(this.effects[0].canvas.element);
	},
});

Weather.Renderer.Effects.add({
	name: "particleFog",
	defaultParameters: {
		// count & appearance
		particleCount: 150,
		minVel: 2, // px/sec
		maxVel: 4, // px/sec
		opacity: 1,

		scale: 160, // sprite width in px
		scaleVariance: 80, // ±px around scale (e.g., 160 ± 80)

		// initial spawn
		margin: 15, // px outside canvas
		groundBias: 1, // >1 skew spawn Y toward bottom

		wanderRadius: 80, // px max from original
		rotationFactor: 0.2, // radians/sec (slow)
		rotationVariance: 0.5, // ±50% variation
	},

	init() {
		// Clean up any previous emitter to avoid duplicates on reinit
		if (this.particleEmitter && this.particleEmitter.destroy) {
			this.particleEmitter.destroy();
			this.particleEmitter = null;
		}

		// Use the particle system to simulate fog as slow, wandering image particles
		const interval = this.parentLayer.animationGroup.updateRate;
		this.deltaTime = interval / 1000;

		const canvasWidth = this.canvas.element.width;
		const canvasHeight = this.canvas.element.height;
		const fogImage = this.images.fog;

		// Per-particle state, kept outside the particle object
		this.fogState = new WeakMap();

		const spawnWidth = canvasWidth + 2 * this.margin;

		this.particleEmitter = new Weather.Renderer.ParticleEmitter(this.canvas.ctx, {
			origin: { x: 0, y: 0 },
			maxParticles: this.particleCount,
			spawnRate: this.particleCount, // quickly fill pool up to maxParticles
			preWarm: true,
			autoDestroy: false,
			initialSettings: {
				shape: "image",
				image: fogImage,
				// Default size (generator will set exact width/height preserving aspect)
				size: { w: this.scale, h: this.scale * (fogImage.height / fogImage.width) },
				alpha: this.opacity,
				gravity: 0,
				fade: false,
				lifetime: Number.POSITIVE_INFINITY,
			},
			generator: () => {
				// Choose width in pixels with ±variance, keep the sprite aspect ratio for height
				const minW = Math.max(1, this.scale - this.scaleVariance);
				const maxW = this.scale + this.scaleVariance;
				const w = minW + Math.random() * (maxW - minW);
				const h = w * (fogImage.height / fogImage.width);

				const originX = -this.margin + Math.random() * spawnWidth - w / 2;
				// Stronger bottom bias: enforce a bottom band based on groundBias
				const minYFrac = Math.max(0, 1 - 0.05 * this.groundBias); // e.g., bias 8 -> bottom 60% band
				let originY = canvasHeight * (1 - Math.pow(Math.random(), this.groundBias)) - h / 2;
				originY = Math.max(originY, canvasHeight * minYFrac - h / 2);

				// Start stationary; onUpdate will steer toward a target
				return {
					position: { x: originX, y: originY },
					velocity: { x: 0, y: 0 },
					size: { w, h },
					// Built-in rotation: slow random spin
					rotation: {
						angle: Math.random() * 360,
						// base speed with variance, random direction
						speed: (Math.random() < 0.5 ? -1 : 1) * this.rotationFactor * (1 + (Math.random() * 2 - 1) * this.rotationVariance),
					},
				};
			},
			onUpdate: p => {
				// Initialize per-particle state on first update
				let st = this.fogState.get(p);
				if (!st) {
					const speed = this.minVel + Math.random() * (this.maxVel - this.minVel);

					// Anchor wandering around original spawn to preserve bottom bias
					const origX = p.position.x;
					const origY = p.position.y;

					// Pick a nearby target within wander radius, constrained to not drift too far upward
					const pickTarget = () => {
						const a = Math.random() * Math.PI * 2;
						const r = Math.random() * this.wanderRadius;
						let tx = origX + Math.cos(a) * r;
						let ty = origY + Math.sin(a) * r;
						// Limit upward wander so fog stays biased toward bottom and within a bottom band
						const minYFrac = Math.max(0, 1 - 0.05 * this.groundBias);
						const bandTopY = canvasHeight * minYFrac;
						const upLimit = Math.max(origY - this.wanderRadius * 0.4, bandTopY);
						if (ty < upLimit) ty = upLimit;
						// Clamp within extended margins
						tx = Math.min(Math.max(tx, -this.margin), canvasWidth + this.margin);
						ty = Math.min(Math.max(ty, -this.margin), canvasHeight + this.margin);
						return { x: tx, y: ty };
					};

					const target = pickTarget();
					st = { speed, origX, origY, pickTarget, target };
					this.fogState.set(p, st);
				}

				// Steering toward target
				const dt = this.deltaTime;
				let dx = st.target.x - p.position.x;
				let dy = st.target.y - p.position.y;
				let dist = Math.hypot(dx, dy);
				const step = st.speed * dt;

				if (dist <= step) {
					// Re-pick a new point to move to
					st.target = st.pickTarget();
					st.speed = Math.random() * (this.maxVel - this.minVel) + this.minVel;

					dx = st.target.x - p.position.x;
					dy = st.target.y - p.position.y;
					dist = Math.hypot(dx, dy);
				}

				if (dist > 1e-6) {
					const ratio = st.speed / dist;
					p.velocity.x = dx * ratio;
					p.velocity.y = dy * ratio;
				} else {
					p.velocity.x = 0;
					p.velocity.y = 0;
				}

				// Keep within extended margins by nudging the target back inside if needed
				const minX = -this.margin;
				const maxX = canvasWidth + this.margin;
				const minY = -this.margin;
				const maxY = canvasHeight + this.margin;
				if (p.position.x < minX || p.position.x > maxX || p.position.y < minY || p.position.y > maxY) {
					st.target = {
						x: Math.min(Math.max(p.position.x, 0), canvasWidth),
						y: Math.min(Math.max(p.position.y, 0), canvasHeight),
					};
				}
			},
			animationGroup: this.parentLayer.animationGroup,
		});

		// Ensure all fog particles are present immediately (no trickle-in)
		if (this.particleEmitter && this.particleEmitter.enable) this.particleEmitter.enable();
		const em = this.particleEmitter;
		if (em && em.update) {
			let guard = 10;
			while (em.particles && em.particles.length < em.maxParticles && guard-- > 0) {
				const remaining = em.maxParticles - em.particles.length;
				const perSec = em.spawnRate || remaining;
				const dt = Math.max(1, Math.ceil(remaining / perSec));
				em.update(dt);
			}
		}

		// (prefill moved below)
	},

	onDisable() {
		// Ensure emitter is destroyed when effect is disabled
		if (this.particleEmitter && this.particleEmitter.destroy) {
			this.particleEmitter.destroy();
			this.particleEmitter = null;
		}
	},

	draw() {
		if (this.particleEmitter && this.particleEmitter.draw) {
			this.particleEmitter.draw();
		}
	},
});
