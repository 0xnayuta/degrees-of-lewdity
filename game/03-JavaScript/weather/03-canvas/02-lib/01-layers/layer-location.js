Weather.Renderer.Layers.add({
	name: "location",
	zIndex: 9,
	animation: {
		updateRate: 50, // Updates every 50ms
	},
	// blur: {
	// 	max: 2,
	// 	factor: () => Weather.overcast,
	// },
	blur: 1.5,
	effects: [
		{
			effect: "locationImage",
			params: {
				path: "img/misc/locations",
				key: "base",
			},
			bindings: {
				location() {
					const location = setup.Locations.get();
					return setup.LocationImages[location];
				},
			},
		},
		{
			effect: "locationEmissive",
			drawCondition() {
				return setup.LocationImages[setup.Locations.get()].emissive;
			},
			params: {
				path: "img/misc/locations",
				key: "emissive",
			},
			bindings: {
				location() {
					const location = setup.Locations.get();
					return setup.LocationImages[location];
				},
			},
		},
		{
			effect: "locationReflective",
			drawCondition() {
				return V.options.reflections && !!setup.LocationImages[setup.Locations.get()].reflective;
			},
			params: {
				images: {
					mask: "img/misc/sky/effects/masks/gradient.png",
				},
				path: "img/misc/locations",
				key: "reflective",
			},
			bindings: {
				location() {
					const location = setup.Locations.get();
					return setup.LocationImages[location];
				},
			},
		},
		// Fallback only if reflections are disabled
		{
			effect: "locationImage",
			drawCondition() {
				return !V.options.reflections && !!setup.LocationImages[setup.Locations.get()].reflective;
			},
			params: {
				name: "fallback",
				path: "img/misc/locations",
				key: "reflective",
			},
			bindings: {
				location() {
					const location = setup.Locations.get();
					return setup.LocationImages[location];
				},
			},
		},
		// Draw on top
		{
			effect: "locationImage",
			drawCondition() {
				return setup.LocationImages[setup.Locations.get()].layerTop;
			},
			params: {
				path: "img/misc/locations",
			},
			bindings: {
				location() {
					const location = setup.Locations.get();
					return setup.LocationImages[location];
				},
				key() {
					return "layerTop";
				},
			},
		},
	],
});

// Weather.Renderer.Layers.add({
// 	name: "smoke",
// 	animation: { updateRate: 50 },
// 	zIndex: 10,
// 	compositeOperation: "source-over",
// 	effects: [
// 		{
// 			effect: "smokeStack",
// 			drawCondition() {
// 				return true; //Weather.isOvercast && Weather.precipitation === "rain" && Weather.precipitationIntensity > 0;
// 			},
// 			params: {
// 				emissionRate: 5,
// 				x: 20,
// 				y: 69,
// 				speed: 3.2,
// 				direction: -Math.PI / 2,
// 				spread: Math.PI / 8,
// 				gravity: -1,

// 				// riseSpeed: 4.5,
// 				// riseRandomness: 1.1,
// 				// riseAcceleration: 0,
// 				color: "#55555599",
// 				particleSize: 1.5,
// 				windStrength: 1.5,
// 				windAngle: 1,
// 				minFadeDistance: 1,
// 				maxFadeDistance: 20,
// 				fadeTime: 1.2,

// 				driftAmplitude: 0,
// 				driftWavelength: 0,

// 				baseWindStrength: 1.5,
// 			},
// 			bindings: {
// 				particles() {
// 					const loc = setup.Locations.get();
// 					return setup.LocationImages[loc]?.particles;
// 				},
// 				windStrength() {
// 					// `this.deltaTime` is always defined after init()
// 					if (this._wsTimer == null) {
// 						this._wsTimer = 0;
// 						this._wsVal = this.baseWindStrength;
// 					}
// 					this._wsTimer += this.deltaTime;
// 					if (this._wsTimer > 5) {
// 						this._wsTimer -= 5;
// 						// tweak ±0.5 but clamp 0–3
// 						this._wsVal = Math.max(0, Math.min(3, this._wsVal + (Math.random() * 2 - 1) * 0.5));
// 						console.log("new windStrength:", this._wsVal);
// 					}
// 					return this._wsVal;
// 				},
// 			},
// 		},
// 		{
// 			effect: "smokeStack",
// 			drawCondition() {
// 				return true; //Weather.isOvercast && Weather.precipitation === "rain" && Weather.precipitationIntensity > 0;
// 			},
// 			params: {
// 				emissionRate: 5,
// 				x: 3,
// 				y: 71.5,
// 				speed: 3.2,
// 				direction: -Math.PI / 2,
// 				spread: Math.PI / 8,
// 				gravity: -1,

// 				// riseSpeed: 4.5,
// 				// riseRandomness: 0.8,
// 				// riseAcceleration: 0,

// 				color: "#55555599",
// 				particleSize: 1.5,
// 				windStrength: 2,
// 				windAngle: 1,
// 				minFadeDistance: 1,
// 				maxFadeDistance: 25,
// 				fadeTime: 1.2,

// 				driftAmplitude: 0,
// 				driftWavelength: 0,

// 				baseWindStrength: 1.5,
// 			},
// 			bindings: {
// 				windStrength() {
// 					// `this.deltaTime` is always defined after init()
// 					if (this._wsTimer == null) {
// 						this._wsTimer = 0;
// 						this._wsVal = this.baseWindStrength;
// 					}
// 					this._wsTimer += this.deltaTime;
// 					if (this._wsTimer > 5) {
// 						this._wsTimer -= 5;
// 						// tweak ±0.5 but clamp 0–3
// 						this._wsVal = Math.max(0, Math.min(3, this._wsVal + (Math.random() * 2 - 1) * 0.5));
// 						console.log("new windStrength:", this._wsVal);
// 					}
// 					return this._wsVal;
// 				},
// 			},
// 		},
// 	],
// });

Weather.Renderer.Layers.add({
	name: "locationSmoke",
	zIndex: 10,
	animation: { updateRate: 50 },
	effects: [
		{
			effect: "multiSmoke",
			drawCondition() {
				if (!Array.isArray(this.particles)) return false;
				return this.particles.some(obj => typeof obj.type === "string" && obj.type.includes("smoke"));
			},
			params: {},
			bindings: {
				particles() {
					const loc = setup.Locations.get();
					return setup.LocationImages[loc]?.particles || [];
				},
			},
		},
	],
});

Weather.Renderer.Layers.add({
	name: "horizonGlow",
	zIndex: 8,
	effects: [
		// City glow
		{
			effect: "gradiantGlow",
			drawCondition() {
				if (Weather.bloodMoon || !(Time.hour >= setup.SkySettings.lightsTime.on || Time.hour < setup.SkySettings.lightsTime.off)) {
					return false;
				}
				// Placeholder
				const locations = [
					"alley",
					"brothel",
					"canal",
					"compound",
					"dance_studio",
					"dilapitaded_shop",
					"estate",
					"factory",
					"home",
					"hospital",
					"kylar_manor",
					"landfill",
					"market",
					"museum",
					"office",
					"avery_skyscraper",
					"park",
					"police_station",
					"pool",
					"pub",
					"school",
					"sewers",
					"shopping_centre",
					"spa",
					"studio",
					"strip_club",
					"temple",
					"town",
				];
				return locations.includes(V.location);
			},
			params: {
				color: {
					glow: "#c9ba76d0",
					dark: "#c9ba7600",
				},
			},
		},
		// Blood moon glow
		{
			effect: "gradiantGlow",
			drawCondition() {
				return (Time.hour >= setup.SkySettings.lightsTime.on || Time.hour < setup.SkySettings.lightsTime.off) && Weather.bloodMoon;
			},
			params: {
				color: {
					glow: "#eb3b2fee",
					dark: "#eb3b2f00",
				},
			},
		},
	],
});
