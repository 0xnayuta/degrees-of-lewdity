Weather.Renderer.Effects.add({
	name: "multiSmoke",

	defaultParameters: {
		particles: [],

		// smoke defaults
		emissionRate: 10,
		x: 70,
		y: 110,

		riseSpeed: 5, // constant upward speed (slower default)
		windSpeed: 0, // px/s max horizontal
		windDirection: 0, // degrees

		spread: 15, // degrees fan‑out

		// fade
		minFadeDistance: 0,
		maxFadeDistance: 50,
		fadeTime: 1.5,

		// optional wiggle
		driftAmplitude: 4,
		driftWavelength: 50,

		// look
		particleSize: 1,
		color: "#333333",
	},

	async init() {
		// Clean up old emitters if reinitialising
		if (Array.isArray(this.emitters)) {
			for (const em of this.emitters) {
				if (em && em.destroy) em.destroy();
			}
		}
		this.deltaTime = this.parentLayer.animationGroup.updateRate / 1000;
		this.emitters = [];

		const defaults = {
			rate: this.emissionRate,
			origin: [this.x, this.y],

			riseSpeed: this.riseSpeed,
			windSpeed: this.windSpeed,
			windDirection: this.windDirection,
			spread: this.spread,

			minFade: this.minFadeDistance,
			maxFade: this.maxFadeDistance,
			fadeTime: this.fadeTime,

			driftAmplitude: this.driftAmplitude,
			driftWavelength: this.driftWavelength,

			size: this.particleSize,
			color: this.color,
		};

		const smokes = (this.particles || []).filter(cfg => cfg.type === "smoke");
		for (const raw of smokes) {
			if (raw.type !== "smoke") return;
			const cfg = { ...defaults, ...raw };

			// total life so pre‑warm works
			const life = cfg.maxFade / cfg.riseSpeed + cfg.fadeTime;

			// horizontal direction of the wind vector (only for initial accel sign)
			const wRad = degToRad(cfg.windDirection);
			const timeToMax = cfg.maxFade / cfg.riseSpeed;

			// horizontal accel needed: v = a·t  ⇒  a = v/t
			const accelX = (Math.cos(wRad) * cfg.windSpeed) / timeToMax;
			// build the emitter
			const em = new Weather.Renderer.ParticleEmitter(this.canvas.ctx, {
				origin: { x: cfg.origin[0], y: cfg.origin[1] },
				maxParticles: Math.ceil(cfg.rate * life * 1.5),
				spawnRate: cfg.rate,
				preWarm: true,

				// **this is the horizontal acceleration** (px/s²),
				// we’ll clamp afterwards to ±cfg.windSpeed
				curve: accelX,

				initialSettings: {
					shape: cfg.shape,
					src: cfg.image,
					size: { w: cfg.size, h: cfg.size },
					color: cfg.color,
					alpha: cfg.alpha,
					gravity: 0, // constant rise only in gen
					fade: true,
					fadeTime: cfg.fadeTime,
					sinDriftAmplitude: cfg.driftAmplitude,
					sinDriftWavelength: cfg.driftWavelength,
					lifetime: life,
				},

				generator: () => {
					// initial horizontal = 0, vertical = -riseSpeed
					let vx = 0;
					let vy = -cfg.riseSpeed;

					// apply spread in degrees
					if (cfg.spread) {
						const off = (Math.random() * 2 - 1) * degToRad(cfg.spread);
						const c = Math.cos(off);
						const s = Math.sin(off);
						[vx, vy] = [vx * c - vy * s, vx * s + vy * c];
					}

					// fade‑start somewhere between min/max
					const dist = cfg.minFade + Math.random() * (cfg.maxFade - cfg.minFade);
					const fadeStart = dist / cfg.riseSpeed;

					return {
						velocity: { x: vx, y: vy },
						fadeStart,
						lifetime: fadeStart + cfg.fadeTime,
						rotation: {
							angle: Math.random() * 360, // Any rotation
							speed: (Math.random() - 0.5) * 0.2, //
						},
					};
				},
				onUpdate: p => {
					const t = p.age / p.lifetime;
					const size = 2 + 12 * t;
					p.size.w = size;
					p.size.h = size;

					// // 2) fade out in the last 25% of life
					// if (t > 0.75) {
					// 	p.alpha = 1 - (t - 0.75) / 0.25;
					// }
				},

				animationGroup: this.parentLayer.animationGroup,
			});

			// clamp velocity.x to ±cfg.windSpeed every update
			const origUpdate = em.update.bind(em);
			em.update = dt => {
				origUpdate(dt);
				for (const p of em.particles) {
					p.velocity.x = Math.max(-cfg.windSpeed, Math.min(cfg.windSpeed, p.velocity.x));
				}
			};

			em.enable();
			this.emitters.push(em);
		}
	},

	onDisable() {
		if (Array.isArray(this.emitters)) {
			for (const em of this.emitters) {
				if (em && em.destroy) em.destroy();
			}
		}
		this.emitters = [];
	},

	draw() {
		this.canvas.clear();
		for (const em of this.emitters) em.draw();
	},
});
