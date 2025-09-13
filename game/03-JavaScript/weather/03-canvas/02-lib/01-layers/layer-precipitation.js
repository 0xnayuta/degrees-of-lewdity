Weather.Renderer.Layers.add({
	name: "precipitation",
	zIndex: 10,
	animation: { updateRate: 50 },
	effects: [
		{
			effect: "particleRain",
			drawCondition() {
				return true; // Weather.isOvercast && Weather.precipitation === "rain" && Weather.precipitationIntensity > 0;
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
				windAngle: 0.15,
				splashTriggerTop: 20,
				splashTriggerBottom: 10,
			},
			bindings: {
				// dynamically drive intensity, speed, tint, etc.
				dropCount() {
					return Weather.precipitationIntensity * 50;
				},
				dropSpeed() {
					return 2 + Weather.precipitationIntensity * 1;
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
				// Override splash triggers based on per-location config
				splashTriggerTop() {
					const location = setup.Locations.get();
					const threshold = setup.LocationImages[location]?.splashes?.collisionThreshold;
					if (typeof threshold === "number") return threshold;
					return this.params?.splashTriggerTop ?? 20;
				},
				splashTriggerBottom() {
					const location = setup.Locations.get();
					const threshold = setup.LocationImages[location]?.splashes?.collisionThreshold;
					if (typeof threshold === "number") return 0;
					return this.params?.splashTriggerBottom ?? 10;
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
