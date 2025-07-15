Weather.Renderer.Effects.add({
	name: "lightning",
	defaultParameters: {
		enableLightning: true,
		lightningInterval: 4, // seconds between strikes
		boltFadeDuration: 0.5, // sec fade-out after complete
		spawnPadding: 10, // px outside canvas on X
		size: 1.1, // pixel scale

		// branching
		branchChance: 0.015,
		maxBranches: 3,
		maxRecursion: 1,
		branchLengthMin: 0.1,
		branchLengthMax: 0.5,
		branchAngleOff: Math.PI / 6,
		branchAngleRange: Math.PI / 3,
		branchScale: 0.66,

		// jitter on trunk
		jitterBase: Math.PI / 8,
		jitterRange: Math.PI / 4,

		// speed
		boltStepsPerFrame: 5,
		boltSpeedFactor: 5,

		// hold bright on completion
		flashHoldDuration: 0.1,

		// optional manual endpoint
		boltTargetX: 87,
		boltTargetY: 87,
		boltStartOffsetX: 0,
		boltStartOffsetY: 20,
		boltStartY: null,

		generateImpact: true, // turn on/off impact generation
		impactType: "regular",
	},

	init() {
		// 1) ticker so draw() runs each tick
		const rate = this.parentLayer.animationGroup.updateRate;
		const ticker = new Weather.Renderer.Animation({
			image: new BaseCanvas(1, 1).element,
			canvas: this.canvas,
			numFrames: 1,
			frameDelay: rate,
			offset: 0,
			alwaysDisplay: false,
		});
		this.parentLayer.animationGroup.add(`${this.id}_ticker`, ticker);
		ticker.enable();

		// 2) state
		this._timer = 0;
		this._bolts = [];
		this.renderInstance.lightningPulses = this.renderInstance.lightningPulses || [];

		// 3) helper → build main trunk backwards, then reverse
		this._genMainTrunk = (x0, y0, endX, endY, length) => {
			const dx = endX - x0;
			const dy = endY - y0;
			const dirFwd = Math.atan2(-dy, dx);
			let dir = dirFwd + Math.PI; // shoot “backwards”
			let x = endX;
			let y = endY;
			let rem = Math.floor(length);
			const back = [];

			while (rem-- > 0) {
				back.push({ x: Math.floor(x), y: Math.floor(y), dirBack: dir });
				// jitter
				dir += -this.jitterBase + Math.random() * this.jitterRange;
				dir = ((dir % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
				if (dir < Math.PI) dir += Math.PI;
				x -= Math.cos(dir);
				y += Math.sin(dir);
			}
			// reverse & convert to forward segments
			return back.reverse().map((s, i) => ({
				x: s.x,
				y: s.y,
				size: this.size,
				isMain: true,
				isMainEnd: i === back.length - 1,
				dir: s.dirBack + Math.PI,
				recursion: 0,
			}));
		};

		// 4) helper → generate one branch forward, clamped at endY
		this._genBranch = (bx, by, dir, length, recursion, endY) => {
			const branchSize = this.size * this.branchScale;
			let rem = Math.floor(length);
			let x = bx;
			let y = by;
			const segs = [
				{
					x: bx,
					y: by,
					size: branchSize,
					isMain: false,
					isBranchStart: true,
					dir,
					recursion,
				},
			];

			while (rem-- > 0) {
				// angle wander
				dir += -this.branchAngleOff + Math.random() * this.branchAngleRange;
				dir = ((dir % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
				if (dir < Math.PI) dir += Math.PI;

				x += Math.cos(dir);
				y -= Math.sin(dir);
				if (y > endY) break; // never go below target
				segs.push({ x: Math.floor(x), y: Math.floor(y), size: branchSize, isMain: false, isBranchStart: false, dir, recursion });
			}
			return segs;
		};
	},

	draw() {
		const now = performance.now();
		if (!this.enableLightning) return;
		const dt = this.parentLayer.animationGroup.updateRate / 1000;
		const steps = Math.ceil(this.boltStepsPerFrame * this.boltSpeedFactor);
		const W = this.canvas.element.width;
		const H = this.canvas.element.height;

		// → spawn new bolt?
		this._timer += dt;
		if (this._timer >= this.lightningInterval) {
			this._timer -= this.lightningInterval;

			const x0 = -this.spawnPadding + Math.random() * (W + 2 * this.spawnPadding);
			let y0;
			if (this.boltStartY != null) {
				// pinned Y ± offset
				y0 = this.boltStartY + (Math.random() * 2 - 1) * this.boltStartOffsetY;
			} else if (this.boltTargetY != null) {
				// legacy: relative to target
				y0 = this.boltTargetY * 0.1;
			} else {
				// auto-pick somewhere near top third
				y0 = 5 + (Math.random() * H) / 3;
			}

			// pick the end (ground/horizon) point
			const endX = this.boltTargetX != null ? this.boltTargetX : x0 + 0; // straight down if no X target
			const endY = this.boltTargetY != null ? this.boltTargetY : H - 20; // default 20px above bottom

			const x = endX - x0;
			const y = endY - y0;
			const L = Math.sqrt(x * x + y * y);

			// offscreen canvas
			const off = new BaseCanvas(W, H);
			const oc = off.ctx;
			oc.shadowColor = "rgba(255,255,255,0.7)";
			oc.shadowBlur = 10;
			oc.shadowOffsetX = oc.shadowOffsetY = 0;

			// build just the trunk
			const trunk = this._genMainTrunk(x0, y0, endX, endY, L);

			this._bolts.push({
				canvas: off,
				ctx: oc,
				trunk, // <-- just the main‐bolt path
				trunkPos: 0, // <-- how far we’ve drawn
				branches: [], // <-- will hold { segments, pos }
				endY,
				done: false,
				mainLength: L,
				flashHold: this.flashHoldDuration,
				fade: this.boltFadeDuration,
				branchCount: 0,
			});
		}

		// nothing active?
		if (!this._bolts.length) return;

		const ctx = this.canvas.ctx;

		// animate each bolt
		// — update & render each bolt —
		for (let bi = this._bolts.length - 1; bi >= 0; bi--) {
			const B = this._bolts[bi];

			// 1) advance the trunk by up to `steps` pixels:
			for (let st = 0; st < steps && B.trunkPos < B.trunk.length; st++, B.trunkPos++) {
				const seg = B.trunk[B.trunkPos];
				// draw main bolt pixel:
				B.ctx.fillStyle = "#fff";
				B.ctx.fillRect(seg.x, seg.y, seg.size, seg.size);

				// maybe spawn a brand‐new branch from this trunk‐segment?
				if (!B.done && Math.random() < this.branchChance && B.branchCount < this.maxBranches) {
					const blen = B.mainLength * (this.branchLengthMin + Math.random() * (this.branchLengthMax - this.branchLengthMin));
					const bdir = seg.dir + (-this.branchAngleOff + Math.random() * this.branchAngleRange);
					// generate the branch *once*, clamped at B.endY:
					const brSegs = this._genBranch(seg.x, seg.y, bdir, blen, 1, B.endY);
					// add it to our branches list:
					B.branches.push({ segments: brSegs, pos: 0 });
					B.branchCount++;

					// fire your “pulse” for that branch:
					const last = brSegs[brSegs.length - 1];
					this.renderInstance.lightningPulses.push({
						startX: seg.x,
						startY: seg.y,
						endX: last.x,
						endY: last.y,
						time: 0,
						length: brSegs.length,
						strength: 0.7,
					});
				}

				// when we hit the trunk’s final segment:
				if (seg.isMainEnd) {
					B.done = true;
				}

				if (seg.isMainEnd && this.generateImpact) {
					// pick one queue based on the single flag
					const bucket = this.impactType === "water" ? "waterImpacts" : "regularImpacts";

					// make sure it exists
					this.renderInstance[bucket] = this.renderInstance[bucket] || [];

					// push a single impact event
					this.renderInstance[bucket].push({
						x: seg.x,
						y: seg.y,
						time: 0,
					});
				}
			}

			// 2) now step *every* branch by the same number of pixels:
			for (const br of B.branches) {
				for (let st = 0; st < steps && br.pos < br.segments.length; st++, br.pos++) {
					const s = br.segments[br.pos];
					B.ctx.fillStyle = "#fff";
					B.ctx.fillRect(s.x, s.y, s.size, s.size);
				}
			}
			// drop any fully‐drawn branches:
			B.branches = B.branches.filter(br => br.pos < br.segments.length);

			// 3) composite & fade
			if (!B.done) {
				ctx.drawImage(B.canvas.element, 0, 0);
			} else if (B.flashHold > 0) {
				B.flashHold = Math.max(0, B.flashHold - dt);
				ctx.drawImage(B.canvas.element, 0, 0);
			} else {
				B.fade -= dt;
				const alpha = Math.max(0, B.fade / this.boltFadeDuration);
				if (alpha > 0) {
					ctx.save();
					ctx.globalAlpha = alpha;
					ctx.drawImage(B.canvas.element, 0, 0);
					ctx.restore();
				} else {
					this._bolts.splice(bi, 1);
				}
			}
		}

		//console.log("lightning draw:", performance.now() - now, "ms");
	},
});

Weather.Renderer.Effects.add({
	name: "lightningPulse",
	defaultParameters: {
		duration: 0.3, // seconds
		blur: 40, // px
		color: "#ffffff",
		maxWidth: null, // px minor-axis radius
	},

	init() {
		// register our ticker so draw() runs every animationGroup tick
		const rate = this.parentLayer.animationGroup.updateRate;
		const ticker = new Weather.Renderer.Animation({
			image: new BaseCanvas(1, 1).element,
			canvas: this.canvas,
			numFrames: 1,
			frameDelay: rate,
			offset: 0,
			alwaysDisplay: false,
		});
		this.parentLayer.animationGroup.add(`${this.id}_ticker`, ticker);
		ticker.enable();
	},

	draw() {
		const pulses = this.renderInstance.lightningPulses || [];
		if (!pulses.length) return; // early out if nothing to draw

		const ctx = this.canvas.ctx;
		const dt = this.parentLayer.animationGroup.updateRate / 1000;
		const cfg = this; // holds duration, blur, color, maxWidth

		ctx.save();
		ctx.filter = `blur(${cfg.blur}px)`;
		ctx.fillStyle = cfg.color;

		for (let i = pulses.length - 1; i >= 0; i--) {
			const p = pulses[i];
			p.time = Math.min(p.time + dt, cfg.duration);

			const tFrac = p.time / cfg.duration;
			if (tFrac >= 1) {
				pulses.splice(i, 1);
				continue;
			}

			const alpha = (p.strength ?? 1) * (1 - tFrac);

			const dx = p.endX - p.startX;
			const dy = p.endY - p.startY;
			const θ = Math.atan2(dy, dx);
			const L = Math.sqrt(dx * dx + dy * dy);
			const mx = p.startX + dx * tFrac;
			const my = p.startY + dy * tFrac;
			const minor = this.maxWidth ?? 2 * L;

			ctx.globalAlpha = alpha;
			ctx.translate(mx, my);
			ctx.rotate(θ);
			ctx.beginPath();
			ctx.ellipse(0, 0, L / 2, minor, 0, 0, 2 * Math.PI);
			ctx.fill();
			ctx.resetTransform();
		}

		ctx.restore();
	},
});

Weather.Renderer.Effects.add({
	name: "lightningImpact",
	defaultParameters: {
		// water‐oval
		waterColor: "rgba(132, 121, 194, 0.5)",
		waterDuration: 1, // sec
		// water splashes
		splashLifetime: 0.5, // sec
		splashMaxRadius: 15,
		splashLineWidth: 2,

		// regular sparks
		sparkColor: "rgb(222, 230, 195)",
		sparkGravity: 20, // px/sec²

		sparkCount: 10, // how many sparks per impact
		sparkSize: 1, // px radius
		sparkSpeedMin: 6, // px/sec
		sparkSpeedMax: 17, // px/sec
		sparkDuration: 1.2, // sec total life
		sparkFadeDurationMin: 0.2, // sec minimum individual fade
		sparkFadeDurationMax: 0.7,
		sparkBaseAngle: (3 * Math.PI) / 4, // central angle (upwards)
		sparkAngleVariance: Math.PI / 4, // ± range around base

		lingerColor: "#f3a255",
		lingerDuration: 3,
	},

	init() {
		// ticker so draw() runs every tick
		const rate = this.parentLayer.animationGroup.updateRate;
		const ticker = new Weather.Renderer.Animation({
			image: new BaseCanvas(1, 1).element,
			canvas: this.canvas,
			numFrames: 1,
			frameDelay: rate,
			offset: 0,
			alwaysDisplay: false,
		});
		this.parentLayer.animationGroup.add(`${this.id}_ticker`, ticker);
		ticker.enable();
	},

	draw() {
		const ctx = this.canvas.ctx;
		const W = this.canvas.element.width;
		const H = this.canvas.element.height;
		const dt = this.parentLayer.animationGroup.updateRate / 1000;
		const cfg = this;

		// grab the two queues (or empty if none)
		const waterQ = this.renderInstance.waterImpacts || [];
		const regularQ = this.renderInstance.regularImpacts || [];

		// --- water impacts ---
		const waterBand = 20;
		for (let i = waterQ.length - 1; i >= 0; --i) {
			const imp = waterQ[i];
			// 0) accumulate real seconds
			imp.time = (imp.time || 0) + dt;
			// 1) if we’ve out-lived our duration, kill it
			if (imp.time >= cfg.waterDuration) {
				waterQ.splice(i, 1);
				continue;
			}

			// 2) compute size & fade by fraction of waterDuration
			const tFrac = imp.time / cfg.waterDuration;
			const rawLen = tFrac * cfg.splashMaxRadius;
			const alpha = 1 - tFrac;
			const splashD = H - imp.y;
			const depthF = Math.max(0, Math.min((waterBand - splashD) / waterBand, 1));
			const len = rawLen * depthF * 1.2; // a touch bigger

			// draw ripple
			ctx.save();
			ctx.strokeStyle = cfg.waterColor;
			ctx.globalAlpha = alpha;
			ctx.lineWidth = cfg.splashLineWidth;
			ctx.beginPath();
			ctx.moveTo(imp.x - len, imp.y);
			ctx.lineTo(imp.x + len, imp.y);
			ctx.stroke();
			ctx.restore();

			// draw splash‐pixels
			const count = Math.max(1, 3 - Math.floor(splashD / (waterBand / 3)));
			for (let k = 0; k < count; k++) {
				const px = (Math.random() * 0.4 - 0.2) * len;
				const py = -len * 0.4;
				ctx.save();
				ctx.fillStyle = cfg.waterColor;
				ctx.globalAlpha = alpha * 0.3;
				ctx.fillRect(imp.x + px, imp.y + py, 1, 1);
				ctx.restore();
			}
		}

		// --- regular spark impacts ---
		for (let i = regularQ.length - 1; i >= 0; i--) {
			const imp = regularQ[i];

			// lazy‐init this impact’s spark particles
			if (!imp._initialized) {
				imp._initialized = true;
				imp.time = 0;
				imp.particles = [];
				for (let j = 0; j < cfg.sparkCount; j++) {
					// pick direction & speed
					const angle = cfg.sparkBaseAngle + (Math.random() * 2 - 1) * cfg.sparkAngleVariance;
					const speed = cfg.sparkSpeedMin + Math.random() * (cfg.sparkSpeedMax - cfg.sparkSpeedMin);
					const fadeDur = cfg.sparkFadeDurationMin + Math.random() * (cfg.sparkFadeDurationMax - cfg.sparkFadeDurationMin);
					imp.particles.push({
						x: imp.x,
						y: imp.y,
						vx: Math.cos(angle) * speed,
						vy: Math.sin(angle) * speed,
						t: 0,
						size: cfg.sparkSize,
						fadeDuration: fadeDur,
					});
				}
			}

			// advance impact timer & remove if fully life’d
			imp.time += dt;
			imp.centerTime = (imp.centerTime || 0) + dt;

			// (…spark‐particle loop here…)

			// draw the lingering center pixel
			if (imp.centerTime <= cfg.lingerDuration) {
				const a = 1 - imp.centerTime / cfg.lingerDuration;
				ctx.save();
				ctx.fillStyle = cfg.sparkColor;
				ctx.globalAlpha = a;
				// draw a 2×2 px square centered on the hit
				ctx.shadowColor = cfg.sparkColor;
				ctx.shadowBlur = 6;
				ctx.fillRect(imp.x - 1, imp.y - 1, 2, 2);
				ctx.restore();
			}

			// only remove once both sparks and linger have finished
			if (imp.time >= cfg.sparkDuration && imp.centerTime >= cfg.lingerDuration) {
				regularQ.splice(i, 1);
			}

			// update & draw each spark
			for (let j = imp.particles.length - 1; j >= 0; j--) {
				const p = imp.particles[j];
				p.t += dt;
				if (p.t >= cfg.sparkDuration) {
					imp.particles.splice(j, 1);
					continue;
				}

				// physics
				p.vy += cfg.sparkGravity * dt;
				p.x += p.vx * dt;
				p.y += p.vy * dt;

				// fade‐out starts after (duration – fadeDuration)
				let alpha = 1;
				const fadeStart = cfg.sparkDuration - p.fadeDuration;
				if (p.t > fadeStart) {
					alpha = 1 - (p.t - fadeStart) / p.fadeDuration;
				}

				// draw
				ctx.save();
				ctx.fillStyle = cfg.sparkColor;
				ctx.shadowColor = cfg.sparkColor;
				ctx.shadowBlur = 4;
				ctx.globalAlpha = alpha;
				ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
				ctx.restore();
			}
		}
	},
});
