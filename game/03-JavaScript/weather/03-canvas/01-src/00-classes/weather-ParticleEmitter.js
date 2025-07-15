/**
 * Usage:
 * Grab your canvas context and the layer animationGroup:
 * 		const ctx = document.querySelector("canvas").getContext("2d");
 * 		const group = myWeatherLayer.animationGroup;
 *
 * Construct an emitter:
 * 		const emitter = new Weather.Renderer.ParticleEmitter(ctx, {
 *   		origin:         { x: 100, y: -10 },     // start just above the top
 *   		maxParticles:   500,                    // fail‑safe cap
 *
 * Continuous stream:
 *   		spawnRate:      200,                    // particles per second
 *   		spawnInterval: 0.01,                 	// OR: fixed delay between spawns
 *
 * Initial settings passed to each particle upon reset:
 *   		initialSettings: {
 *     			shape:        "line",
 *     			size:         { w: 3, h: 1 },
 *     			color:        "#ffffff",
 *     			lifetime:     2,      // seconds until death
 *     			gravity:      50,     // Downward acceleration
 *     			fade:         true,   // start fade after fadeStart
 *     			fadeStart:    1.5,    // seconds before fading begins
 *     			fadeTime:     0.5,    // fade duration
 *   		},
 *
 * Per-particle overrides: (Can override any particle property - during generation phase)
 *   		generator:      () => ({
 *     			velocity: {
 *       			x: (Math.random() - 0.5) * 20, // E.g. randomise velocity
 *       			y: 100 + Math.random() * 50
 *     			}
 *   		}),
 *
 * Callback for when a particle dies
 *  		 onDestroy: (particle) => {
 *     			// e.g. add a splash (rain)
 *     			spawnSplash(particle.position);
 *   		},
 *
 *    		preWarm:        true,    // immediately populate the canvas (Otherwise the particles will begin emitting on load)
 *   		animationGroup: group,   // The layer animationGroup
 *
 * IF we don't want a continuous spawn (one-time burst):
 *   		spawnRate:      null,
 *   		spawnInterval:  null,
 *   		autoDestroy:    true,   // emitter destroys itself when empty - otherwise need to destroy it manually to allow GC to work
 *
 * });
 *
 *
 * Options:
 *   origin (x, y)     // spawn point
 *   maxParticles      // hard cap
 *   spawnRate         // particles/sec
 *   spawnInterval     // seconds between spawns
 *   initialSettings   // Particle reset options (See Particle class)
 *   generator         // per-particle overrides
 *   onDestroy         // callback when particle dies
 *   curve             // global horizontal acceleration (curve)
 *   preWarm           // fill canvas immediately
 *   autoDestroy       // remove emitter when done
 *   animationGroup    // Weather.Renderer.AnimationGroup
 */
Weather.Renderer.ParticleEmitter = class ParticleEmitter {
	static #instances = new Set();
	static #ticker = null;
	static #group = null;
	static #key = "particleTicker";

	#spawnAccumulator = 0;
	#spawnTimer = 0;
	pool = [];
	particles = [];

	/*
	 * Dummy ticker
	 */
	static #setTicker(group) {
		if (this.#ticker && this.#group === group) return;
		this.#group = group;
		const frameDelay = group.updateRate;
		const offscreen = new BaseCanvas(1, 1);
		this.#ticker = new Weather.Renderer.Animation({
			name: this.#key,
			image: offscreen.element,
			canvas: offscreen,
			numFrames: 1,
			frameDelay,
			alwaysDisplay: true,
		});
		group.add(this.#key, this.#ticker);
		this.#ticker.enable();

		const original = group.onUpdate.bind(group);
		group.onUpdate = () => {
			const dt = frameDelay / 1000;
			for (const em of Weather.Renderer.ParticleEmitter.#instances) {
				em.update(dt);
				em.draw();
			}
			original();
		};
	}

	constructor(
		ctx,
		{
			origin = { x: 0, y: 0 },
			maxParticles = 100,
			spawnRate = null,
			spawnInterval = null,
			initialSettings = {},
			generator = () => ({}),
			onCollision = null,
			onDestroy = null,
			curve = 0,
			preWarm = false,
			autoDestroy = false,
			animationGroup = null,
		} = {}
	) {
		this.ctx = ctx;
		this.origin = origin;
		this.maxParticles = maxParticles;
		this.spawnRate = spawnRate;
		this.spawnInterval = spawnInterval;
		this.initialSettings = initialSettings;
		this.generator = generator;
		this.onCollision = onCollision;
		this.onDestroy = onDestroy;
		this.curve = curve;
		this.autoDestroy = autoDestroy;

		Weather.Renderer.ParticleEmitter.#instances.add(this);
		if (animationGroup) ParticleEmitter.#setTicker(animationGroup);
		if (preWarm) this.#preWarm();
	}

	#preWarm() {
		const time = this.initialSettings.lifetime ?? 0;

		// spawn enough to fill the canvas
		let count = this.spawnRate != null ? Math.min(this.maxParticles, Math.ceil(this.spawnRate * time)) : this.maxParticles;

		while (count-- > 0) this.#spawnParticle();

		// scatter them in that interval
		for (const p of this.particles) {
			p.update(Math.random() * time);
		}
	}

	update(dt) {
		// spawn by rate or interval
		if (this.spawnRate != null) {
			this.#spawnAccumulator += dt * this.spawnRate;
			const toSpawn = Math.floor(this.#spawnAccumulator);
			this.#spawnAccumulator -= toSpawn;
			for (let i = 0; i < toSpawn; i++) this.#spawnParticle();
		} else if (this.spawnInterval != null) {
			this.#spawnTimer += dt;
			while (this.#spawnTimer >= this.spawnInterval) {
				this.#spawnParticle();
				this.#spawnTimer -= this.spawnInterval;
			}
		}

		// update & cull
		const next = [];
		for (const p of this.particles) {
			const prevAge = p.age;
			p.update(dt);
			if (this.onCollision && p.collisionTime != null && prevAge < p.collisionTime && p.age >= p.collisionTime) {
				this.onCollision(p);
			}
			if (p.isAlive) next.push(p);
			else {
				this.pool.push(p);
				this.onDestroy?.(p);
			}
		}
		this.particles = next;

		// auto‑destroy
		if (this.autoDestroy && this.spawnRate == null && this.particles.length === 0) {
			this.destroy();
		}
	}

	#spawnParticle() {
		if (this.particles.length >= this.maxParticles) return;
		const p = this.pool.pop() ?? new Weather.Renderer.Particle();

		p.reset({
			x: this.origin.x,
			y: this.origin.y,
			curve: this.curve,
			...this.initialSettings,
			...this.generator(),
		});
		this.particles.push(p);
	}

	draw() {
		for (const p of this.particles) {
			p.draw(this.ctx);
		}
	}

	enable() {
		ParticleEmitter.#ticker?.enable();
	}

	disable() {
		ParticleEmitter.#ticker?.disable();
	}

	destroy() {
		ParticleEmitter.#instances.delete(this);
	}
};
