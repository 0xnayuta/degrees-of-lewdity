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
		minVel: 3, // px/sec
		maxVel: 6, // px/sec
		opacity: 1,

		// sprite scaling
		scale: 2.5,
		scaleVariance: 0.5,

		// initial spawn
		margin: 15, // px outside canvas
		groundBias: 1, // >1 skew spawn Y toward bottom

		// wandering
		wanderRadius: 80, // px max from original
		// rotation
		rotationFactor: 0.015, // base rad/sec per unit speed
		rotationVariance: 0.7, // ±50% random variation
	},

	init() {
		const interval = this.parentLayer.animationGroup.updateRate;
		const ticker = new Weather.Renderer.Animation({
			image: new BaseCanvas(1, 1).element,
			canvas: this.canvas,
			numFrames: 1,
			frameDelay: interval,
			offset: 0,
			alwaysDisplay: false,
		});
		this.parentLayer.animationGroup.add(`${this.id}_ticker`, ticker);
		ticker.enable();

		this.deltaTime = interval / 1000;
		const canvasWidth = this.canvas.element.width;
		const canvasHeight = this.canvas.element.height;
		const maxX = canvasWidth + 2 * this.margin;
		const fogImage = this.images.fog;
		const velocityRange = this.maxVel - this.minVel;

		const particles = [];
		for (let i = 0; i < this.particleCount; i++) {
			const scale = this.scale + (Math.random() * 2 - 1) * this.scaleVariance;
			const particleW = fogImage.width * scale;
			const particleH = fogImage.height * scale;

			const originX = -this.margin + Math.random() * maxX - particleW / 2;
			const originY = canvasHeight * (1 - Math.pow(Math.random(), this.groundBias)) - particleH / 2;

			const angle = Math.random() * Math.PI * 2;
			const distance = Math.random() * this.wanderRadius;
			const targetX = originX + Math.cos(angle) * distance;
			const targetY = originY + Math.sin(angle) * distance;

			const speed = this.minVel + Math.random() * velocityRange;
			const spinDir = Math.random() < 0.5 ? -1 : +1;
			const spinVar = 1 + (Math.random() * 2 - 1) * this.rotationVariance;
			const angularSpeed = spinDir * speed * this.rotationFactor * spinVar;

			const startAngle = Math.random() * Math.PI * 2;

			particles.push({
				origX: originX,
				origY: originY,
				x: originX,
				y: originY,
				width: particleW,
				height: particleH,
				speed,
				targetX,
				targetY,
				spinDir,
				angle: startAngle,
				angularSpeed,
			});
		}

		this.particles = particles;
	},

	draw() {
		const ctx = this.canvas.ctx;
		const width = this.canvas.element.width;
		const height = this.canvas.element.height;
		const img = this.images.fog;

		ctx.save();
		ctx.globalAlpha = this.opacity;

		for (const particle of this.particles) {
			// Move toward a point
			let dx = particle.targetX - particle.x;
			let dy = particle.targetY - particle.y;
			let dist = Math.hypot(dx, dy);
			const step = particle.speed * this.deltaTime;

			if (dist <= step) {
				// Re-pick a new point to move to
				const angle = Math.random() * 2 * Math.PI;
				const radius = Math.random() * this.wanderRadius;
				particle.targetX = particle.origX + Math.cos(angle) * radius;
				particle.targetY = particle.origY + Math.sin(angle) * radius;
				particle.speed = Math.random() * (this.maxVel - this.minVel) + this.minVel;

				const spinVar = 1 + (Math.random() * 2 - 1) * this.rotationVariance;
				particle.angularSpeed = particle.spinDir * particle.speed * this.rotationFactor * spinVar;

				dx = particle.targetX - particle.x;
				dy = particle.targetY - particle.y;
				dist = Math.hypot(dx, dy);
			}

			if (dist > 1e-6) {
				const ratio = step / dist;
				particle.x += dx * ratio;
				particle.y += dy * ratio;
			}

			particle.x = Math.clamp(particle.x, -this.margin, width + this.margin);
			particle.y = Math.clamp(particle.y, -this.margin, height + this.margin);

			// Rotation
			particle.angle = (particle.angle + particle.angularSpeed * this.deltaTime) % (2 * Math.PI);

			const cos = Math.cos(particle.angle);
			const sin = Math.sin(particle.angle);
			ctx.setTransform(cos, sin, -sin, cos, particle.x + particle.width / 2, particle.y + particle.height / 2);
			ctx.drawImage(img, -particle.width / 2, -particle.height / 2, particle.width, particle.height);

			// ctx.save();
			// ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform to default
			// ctx.globalAlpha = 0.8;
			// ctx.fillStyle = "red";
			// ctx.beginPath();
			// ctx.arc(particle.x + particle.width / 2, particle.y + particle.height / 2, 2, 0, 2 * Math.PI);
			// ctx.fill();
			// ctx.restore();
		}

		ctx.restore();
	},
});
