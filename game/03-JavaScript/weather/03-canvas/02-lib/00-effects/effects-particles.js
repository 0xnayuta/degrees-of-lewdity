Weather.Renderer.Effects.add({
	name: "multiSmoke",

	defaultParameters: {
		particles: [],

		// smoke defaults
		emissionRate: 10,
		x: 70,
		y: 110,

		riseSpeed: 10, // constant upward speed
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
		console.log("SMOKES", smokes);
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
					shape: "rect",
					size: { w: cfg.size, h: cfg.size },
					color: cfg.color,
					alpha: 1,
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
					};
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

	draw() {
		this.canvas.clear();
		for (const em of this.emitters) em.draw();
	},
});

Weather.Renderer.Effects.add({
	name: "fire",
	defaultParameters: {
		particles: [], // from your bindings
		x: null, // fallback origin.x
		y: null, // fallback origin.y
		flameRate: 30,
		sparkRate: 60,
		baseRadius: 30,
		riseSpeed: 3, // positive = px/sec up
		sparkGravity: 0.1,
		flameFade: 0.8,
		sparkFade: 1.0,
		colorFlame: "#ffdd99",
		colorSpark: "#ffdd99",
		sideOffset: 1, // max horizontal jitter
		driftX: 1, // small random drift
		// glow…
		glowColor: "rgba(255,200,100,0.5)",
		glowRadius: 50,
		glowBlur: 2,
		glowScaleX: 2.5,
		glowOffsetY: 20,
	},

	async init() {
		// grab only your .type==="fire" configs
		const fires = (this.particles || []).filter(p => p.type === "fire");
		this.emitters = [];

		for (const raw of fires) {
			// merge instance‐parameters (this.x,this.y, etc) + raw override
			const cfg = {
				x: this.x ?? this.canvas.element.width * 0.5,
				y: this.y ?? this.canvas.element.height * 0.75,
				...this, // pull in any other this.* defaults
				...raw,
			};

			const ox = cfg.origin?.[0] ?? cfg.x;
			const oy = cfg.origin?.[1] ?? cfg.y;
			const flameLife = cfg.flameFade * 2;
			const sparkLife = cfg.sparkFade * 2;

			// ——— 1) Flames ———
			const flame = new Weather.Renderer.ParticleEmitter(this.canvas.ctx, {
				origin: { x: ox, y: oy },
				maxParticles: Math.ceil(cfg.flameRate * flameLife),
				spawnRate: cfg.flameRate,
				preWarm: true,
				initialSettings: {
					shape: "circle",
					size: { w: cfg.baseRadius * 2, h: 0 },
					color: cfg.colorFlame,
					alpha: 1,
					fade: true,
					fadeStart: flameLife * 0.3,
					fadeTime: flameLife * 0.7,
					lifetime: flameLife,
				},
				generator: () => {
					// horizontal jitter around center:
					const xOff = (Math.random() * 2 - 1) * cfg.sideOffset;
					const yOff = (Math.random() * 2 - 1) * (cfg.baseRadius * 0.2);

					// where we actually start:
					const x0 = ox + xOff;
					const y0 = oy + yOff;

					// “how far off center” in [0..1]
					const t = Math.min(1, Math.abs(xOff / cfg.sideOffset));

					// slower in center, faster at edges
					const speedScale = 0.75 + 0.5 * t;
					const vy = -cfg.riseSpeed * speedScale; // NEGATIVE → up
					const vx = (Math.random() * 2 - 1) * cfg.driftX;

					// blend hue/lightness from yellow→red
					const hue = lerp(50, 10, t);
					const lightness = lerp(90, 50, t);
					const color = `hsl(${hue},100%,${lightness}%)`;

					// random radius
					const r = cfg.baseRadius * (Math.random() * 0.5 + 0.5);

					return {
						x: x0,
						y: y0,
						velocity: { x: vx, y: vy },
						size: { w: r * 2, h: 0 },
						color,
					};
				},
				animationGroup: this.parentLayer.animationGroup,
			});
			flame.enable();

			// ——— 2) Sparks ———
			const spark = new Weather.Renderer.ParticleEmitter(this.canvas.ctx, {
				origin: { x: ox, y: oy },
				maxParticles: Math.ceil(cfg.sparkRate * sparkLife),
				spawnRate: cfg.sparkRate,
				preWarm: false,
				initialSettings: {
					shape: "line",
					size: { w: 1, h: 1 },
					color: cfg.colorSpark,
					alpha: 1,
					fade: true,
					fadeTime: cfg.sparkFade,
					gravity: cfg.sparkGravity,
					lifetime: sparkLife,
				},
				generator: () => {
					const θ = Math.random() * Math.PI * 2;
					const speed = Math.random() * 4 + 2;
					return {
						x: ox,
						y: oy,
						velocity: { x: Math.cos(θ) * speed, y: -Math.sin(θ) * speed },
					};
				},
				animationGroup: this.parentLayer.animationGroup,
			});
			spark.enable();

			this.emitters.push({ emitter: flame, kind: "flame", cfg });
			this.emitters.push({ emitter: spark, kind: "spark", cfg });
		}
	},

	draw() {
		const ctx = this.canvas.ctx;
		this.canvas.clear();

		// elliptical glow
		for (const { kind, cfg } of this.emitters) {
			if (kind !== "flame") continue;
			const [ox, oy] = cfg.origin || [cfg.x, cfg.y];
			ctx.save();
			ctx.globalCompositeOperation = "lighter";
			ctx.filter = `blur(${cfg.glowBlur}px)`;
			ctx.translate(ox, oy - cfg.glowOffsetY);
			ctx.scale(cfg.glowScaleX, 1);
			const g = ctx.createRadialGradient(0, 0, 0, 0, 0, cfg.glowRadius);
			g.addColorStop(0, "rgba(0,0,0,0)");
			g.addColorStop(1, cfg.glowColor);
			ctx.fillStyle = g;
			ctx.beginPath();
			ctx.arc(0, 0, cfg.glowRadius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.restore();
		}

		// draw flame blobs
		ctx.globalCompositeOperation = "overlay";
		for (const { emitter, kind } of this.emitters) {
			if (kind === "flame") emitter.draw();
		}

		// draw sparks
		ctx.globalCompositeOperation = "lighter";
		for (const { emitter, kind } of this.emitters) {
			if (kind === "spark") emitter.draw();
		}

		// back to normal
		ctx.globalCompositeOperation = "source-over";
		ctx.filter = "none";
	},
});

// simple linear‐interpolator
function lerp(a, b, t) {
	return a + (b - a) * t;
}
