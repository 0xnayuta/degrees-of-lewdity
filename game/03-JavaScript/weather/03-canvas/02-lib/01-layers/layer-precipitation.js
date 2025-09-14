Weather.Renderer.Layers.add({
	name: "precipitation",
	zIndex: 10,
	animation: { updateRate: 50 },
	effects: [
		{
			effect: "particleRain",
			drawCondition() {
				return Weather.isOvercast && Weather.precipitation === "rain" && Weather.precipitationIntensity > 0;
			},
			params: {
				sunTint: "#ffffffbb",
				moonTint: "#38517a",
				dawnDuskTint: "#dbb695",
				groundDayTint: "#ffffffbb",
				groundNightTint: "#38517a",
				groundDawnDuskTint: "#a08160",
				groundTownColor: "#d98cffff",

				dropLength: 2.5,
				dropWidth: 0.3,
				baseAlpha: 1,
				windStrength: 1,
				windAngle: 0.2,
				splashTriggerTop: 20,
				splashTriggerBottom: 1,
			},
			bindings: {
				dropCount() {
					return Weather.precipitationIntensity * 200 - 170;
				},
				dropSpeed() {
					return 30;
				},
				topColor() {
					const sunF = this.renderInstance.orbitals.sun.factor;
					const moonF = this.renderInstance.orbitals.moon.factor;
					const nightPhase = ColourUtils.interpolateColor("#000000", this.moonTint, moonF);
					return ColourUtils.interpolateTripleColor(nightPhase, this.dawnDuskTint, this.sunTint, sunF);
				},
				bottomColor() {
					const sunF = this.renderInstance.orbitals.sun.factor;
					const moonF = this.renderInstance.orbitals.moon.factor;
					const nightPhase = ColourUtils.interpolateColor("#000000", this.groundNightTint, moonF);
					return ColourUtils.interpolateTripleColor(nightPhase, this.groundDawnDuskTint, this.groundDayTint, sunF);
				},
				backgroundLight() {
					if (Weather.bloodMoon || !(Time.hour >= setup.SkySettings.lightsTime.on || Time.hour < setup.SkySettings.lightsTime.off)) {
						return false;
					}
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
				backgroundTint() {
					return Weather.bloodMoon ? "#eb3b2fee" : "#f7d088aa";
				},
				// Override based on per-location config
				splashTriggerTop() {
					const location = setup.Locations.get();
					const threshold = setup.LocationImages[location]?.splashes?.collisionThreshold;
					if (typeof threshold === "number") return threshold;
					return this.params?.splashTriggerTop ?? 20;
				},
				splashTriggerBottom() {
					const location = setup.Locations.get();
					const threshold = setup.LocationImages[location]?.splashes?.collisionThreshold;
					if (typeof threshold === "number") return 1;
					return this.params?.splashTriggerBottom ?? 0;
				},
			},
		},
		{
			effect: "particleSnow",
			drawCondition() {
				return Weather.isOvercast && Weather.precipitation === "snow" && Weather.precipitationIntensity > 0;
			},
			params: {
				sunTint: "#ffffff",
				moonTint: "#7895c4bb",
				dawnDuskTint: "#dbb695bb",
				groundDayTint: "#ffffff",
				groundNightTint: "#7895c4bb",
				groundDawnDuskTint: "#dbb695bb",
				groundTownColor: "#ffd27fbb",
				windStrength: 0.4,
				windAngle: 0.1,
				dropSize: 0.6,
				baseAlpha: 0.9,
				dropSpeed: 8,

				pileTriggerTop: 1,
				pileTriggerBottom: 0,

				wobbleAmplitude: 0.2,
				wobbleFrequency: 0.5,

				pixelFadeTime: 0.7,
			},
			bindings: {
				dropCount() {
					return Weather.precipitationIntensity * 60 - 35;
				},
				topColor() {
					const sunF = this.renderInstance.orbitals.sun.factor;
					const moonF = this.renderInstance.orbitals.moon.factor;

					const nightPhase = ColourUtils.interpolateColor("#000000", this.moonTint, moonF);
					return ColourUtils.interpolateTripleColor(nightPhase, this.dawnDuskTint, this.sunTint, sunF);
				},
				backgroundLight() {
					if (Weather.bloodMoon || !(Time.hour >= setup.SkySettings.lightsTime.on || Time.hour < setup.SkySettings.lightsTime.off)) {
						return false;
					}
					return true;
				},
				bottomColor() {
					if (this.backgroundLight) return this.groundTownColor;

					const sunF = this.renderInstance.orbitals.sun.factor;
					const moonF = this.renderInstance.orbitals.moon.factor;

					const nightPhase = ColourUtils.interpolateColor("#000000", this.groundNightTint, moonF);
					return ColourUtils.interpolateTripleColor(nightPhase, this.groundDawnDuskTint, this.groundDayTint, sunF);
				},
			},
		},
		{
			effect: "particleSnow",
			drawCondition() {
				return Weather.isOvercast && Weather.precipitation === "snow" && Weather.precipitationIntensity > 0;
			},
			params: {
				sunTint: "#ffffff",
				moonTint: "#7895c4bb",
				dawnDuskTint: "#dbb695bb",
				groundDayTint: "#ffffff",
				groundNightTint: "#7895c4bb",
				groundDawnDuskTint: "#dbb695bb",
				groundTownColor: "#ffd27fbb",
				windStrength: 0.4,
				windAngle: 0.1,
				dropSize: 1,
				baseAlpha: 1,
				dropSpeed: 11,

				pileTriggerTop: 20,
				pileTriggerBottom: 1,

				wobbleAmplitude: 0.3,
				wobbleFrequency: 0.7,

				pixelFadeTime: 0.7,
			},
			bindings: {
				dropCount() {
					return Weather.precipitationIntensity * 60 - 35;
				},
				topColor() {
					const sunF = this.renderInstance.orbitals.sun.factor;
					const moonF = this.renderInstance.orbitals.moon.factor;

					const nightPhase = ColourUtils.interpolateColor("#000000", this.moonTint, moonF);
					return ColourUtils.interpolateTripleColor(nightPhase, this.dawnDuskTint, this.sunTint, sunF);
				},
				backgroundLight() {
					if (Weather.bloodMoon || !(Time.hour >= setup.SkySettings.lightsTime.on || Time.hour < setup.SkySettings.lightsTime.off)) {
						return false;
					}
					return true;
				},
				bottomColor() {
					if (this.backgroundLight) return this.groundTownColor;

					const sunF = this.renderInstance.orbitals.sun.factor;
					const moonF = this.renderInstance.orbitals.moon.factor;

					const nightPhase = ColourUtils.interpolateColor("#000000", this.groundNightTint, moonF);
					return ColourUtils.interpolateTripleColor(nightPhase, this.groundDawnDuskTint, this.groundDayTint, sunF);
				},
				// Override based on per-location config
				pileTriggerTop() {
					const location = setup.Locations.get();
					const threshold = setup.LocationImages[location]?.splashes?.collisionThreshold;
					if (typeof threshold === "number") return threshold;
					return this.params?.splashTriggerTop ?? 20;
				},
				pileTriggerBottom() {
					const location = setup.Locations.get();
					const threshold = setup.LocationImages[location]?.splashes?.collisionThreshold;
					if (typeof threshold === "number") return 1;
					return this.params?.splashTriggerBottom ?? 0;
				},
			},
		},
		{
			effect: "imageOverlay",
			drawCondition() {
				return !this.renderInstance.skyDisabled && Weather.overcast > 0.5 && Weather.precipitationIntensity >= 1 && Weather.precipitation !== "none";
			},
			compositeOperation: "destination-out",
			params: {
				images: {
					overlay: "img/misc/sky/effects/masks/4.png",
				},
				movement: {
					speed: 0.5,
				},
				baseAlpha: 0.95,
			},
		},
	],
});
