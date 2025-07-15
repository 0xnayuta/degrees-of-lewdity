/**
 * A single particle that can be reused.
 *
 * Usage:
 *   const p = new Particle({ x:10, y:20, velocity:{x:0,y:-50}, lifetime:2 });
 *   // then each frame:
 *   p.update(dt);
 *   if (p.isAlive) p.draw(ctx);
 *
 * Options (all optional):
 *
 * @property {number} x                      	start X position (px)
 * @property {number} y                     	start Y position (px)
 * @property {{x:number,y:number}} velocity     initial velocity (px/s)
 * @property {number} gravity               	vertical acceleration (px/s^2)
 * @property {number} curve                   	horizontal acceleration (px/s^2)
 * @property {"line"|"rect"} shape       		render shape
 * @property {{w:number,h:number}} size        	dimensions in px
 * @property {string} color         			Hex color string
 * @property {number} alpha                   	starting opacity (0–1)
 * @property {number} lifetime               	total life before death (seconds)
 * @property {boolean} fade              		whether to fade out
 * @property {number} fadeStart            		seconds before fade begins
 * @property {number} fadeTime					fade duration (seconds)
 * @property {number} wobbleAmplitude			wobble amplitude (for e.g. snow)
 * @property {number} wobbleFrequency			wobble cycles per second
 * @property {number} initialWobblePhase 		phase offset for wobble (rad)
 * @property {number} sinDriftAmplitude 		px of horizontal drift (Sine wave based on distance)
 * @property {number} sinDriftWavelength 		vertical px per sine cycle
 */
Weather.Renderer.Particle = class Particle {
	#gravity;
	#curve;
	#wobbleAmplitude;
	#wobbleFrequency;
	#wobblePhase;
	#sinDriftAmplitude;
	#sinDriftWavelength;
	#fadeStart = 0;
	#fadeRate = 0;
	#shrinkStart = Infinity;
	#shrinkDuration = 0;

	// Cache
	#cos = 1;
	#sin = 1;

	constructor(options = {}) {
		this.reset(options);
	}

	reset({
		x = 0,
		y = 0,
		velocity = { x: 0, y: 0 },
		gravity = 0,
		curve = 0,
		shape = "rect",
		size = { w: 1, h: 1 },
		color = "#ffffff",
		alpha = 1,
		lifetime = 1,
		fade = true,
		fadeStart = 0,
		fadeTime = 1,
		wobbleAmplitude = 0,
		wobbleFrequency = 0,
		initialWobblePhase = Math.random() * Math.PI * 2,
		sinDriftAmplitude = 0,
		sinDriftWavelength = 100,
		collisionTime = Infinity,
		shrinkDuration = 0,
	} = {}) {
		this.position = { x, y };
		this.velocity = { ...velocity };
		this.size = { ...size };
		this.length = size.w;
		this.#gravity = gravity;
		this.#curve = curve;
		this.shape = shape;
		this.color = color;
		this.alpha = alpha;
		this.age = 0;
		this.lifetime = lifetime;
		this.fade = fade;
		this.#fadeStart = fadeStart;
		this.#fadeRate = fadeTime > 0 ? alpha / fadeTime : 0;
		this.#wobbleAmplitude = wobbleAmplitude;
		this.#wobbleFrequency = wobbleFrequency;
		this.#wobblePhase = initialWobblePhase;
		this.#sinDriftAmplitude = sinDriftAmplitude;
		this.#sinDriftWavelength = sinDriftWavelength;
		this.collisionTime = collisionTime;
		this.#shrinkDuration = shrinkDuration;
		this.#shrinkStart = this.shape === "line" && shrinkDuration > 0 ? this.lifetime - shrinkDuration : Infinity;

		this.updateRotation();
	}

	/**
	 * @param {number} sec  seconds since last update
	 */
	update(sec) {
		this.velocity.y += this.#gravity * sec;
		this.velocity.x += this.#curve * sec;
		this.position.x += this.velocity.x * sec;
		this.position.y += this.velocity.y * sec;

		// Wobble
		if (this.#wobbleAmplitude && this.#wobbleFrequency) {
			const wobble = Math.sin(this.age * this.#wobbleFrequency + this.#wobblePhase) * this.#wobbleAmplitude;
			const magSqr = this.velocity.y * this.velocity.y + this.velocity.x * this.velocity.x;
			const invMag = magSqr > 0 ? 1 / Math.sqrt(magSqr) : 1;

			this.position.x += -this.velocity.y * invMag * wobble;
			this.position.y += this.velocity.x * invMag * wobble;
		}

		// Fade
		this.age += sec;
		if (this.fade && this.age >= this.#fadeStart) {
			this.alpha = Math.max(0, this.alpha - this.#fadeRate * sec);
		}

		this.updateRotation();
	}

	updateRotation() {
		// Cache the rotation
		const ang = Math.atan2(this.velocity.y, this.velocity.x);
		this.#cos = Math.cos(ang);
		this.#sin = Math.sin(ang);
	}

	draw(ctx) {
		// Drift
		let driftX = 0;
		if (this.#sinDriftAmplitude && this.#sinDriftWavelength) {
			const theta = (this.position.y / this.#sinDriftWavelength) * Math.PI * 2;
			driftX = this.#sinDriftAmplitude * Math.sin(theta);
		}

		ctx.save();

		// Position and rotation
		ctx.setTransform(this.#cos, this.#sin, -this.#sin, this.#cos, this.position.x + driftX, this.position.y);

		ctx.globalAlpha = this.alpha;
		ctx.fillStyle = this.color;
		ctx.strokeStyle = this.color;

		// Shape
		switch (this.shape) {
			case "line":
				this.#drawLine(ctx);
				break;
			case "circle":
				this.#drawCircle(ctx);
				break;
			case "rect":
			default:
				this.#drawRect(ctx);
		}

		ctx.restore();
	}

	#drawLine(ctx) {
		let w = this.size.w;
		if (this.age >= this.#shrinkStart) {
			const t = this.age - this.#shrinkStart;
			const frac = Math.max(0, 1 - t / this.#shrinkDuration);
			w = this.size.w * frac;
		}
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(w, 0);
		ctx.lineWidth = this.size.h;
		ctx.stroke();
	}

	#drawRect(ctx) {
		ctx.fillRect(-this.size.w / 2, -this.size.h / 2, this.size.w, this.size.h);
	}

	#drawCircle(ctx) {
		ctx.beginPath();
		ctx.arc(0, 0, this.size.w / 2, 0, 2 * Math.PI);
		ctx.fill();
	}

	get isAlive() {
		return this.age < this.lifetime && this.alpha > 0;
	}
};
