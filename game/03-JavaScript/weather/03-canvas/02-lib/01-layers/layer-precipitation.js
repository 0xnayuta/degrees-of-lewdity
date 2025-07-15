Weather.Renderer.Layers.add({
	name: "precipitation",
	zIndex: 10,
	animation: { updateRate: 50 },
	effects: [
		
		// {
		// 	effect: "particleRain",
		// 	drawCondition() {
		// 		return true;//Weather.isOvercast && Weather.precipitation === "rain" && Weather.precipitationIntensity > 0;
		// 	},
		// 	params: {},
		// 	bindings: {
		// 		// dynamically drive intensity, speed, tint, etc.
		// 		dropCount() {
		// 			return Weather.precipitationIntensity * 200;
		// 		},
		// 		dropSpeed() {
		// 			return 1 + Weather.precipitationIntensity * 0.5;
		// 		},
		// 		windAngle() {
		// 			return ((0 ?? 0) * Math.PI) / 180;
		// 		},
		// 		color() {
		// 			return ColourUtils.interpolateColor(
		// 				// from sky tint → ground tint
		// 				"#ffffff",
		// 				"#aabbcc",
		// 				Weather.precipitationIntensity
		// 			);
		// 		},
		// 	},
		// },
		// {
		// 	effect: "proceduralPrecipitation",
		// 	drawCondition() {
		// 		return !this.renderInstance.skyDisabled && Weather.isOvercast && Weather.precipitationIntensity > 0 && Weather.precipitation === "rain";
		// 	},
		// 	params: {
		// 		precipitation: "rain",

		// 		dropLength: 4.2,
		// 		dropWidth: 0.3,
		// 		dropSpeed: 1.8,
		// 		minDistance: 8,
		// 		windAngle: 0.15,
		// 		baseAlpha: 1,
		// 		sunTint: "#121700",
		// 		moonTint: "#5076b5",
		// 		dawnDuskTint: "#5e4425",
		// 		groundDayTint: "#dce8ca",
		// 		groundNightTint: "#5076b5",
		// 		groundDawnDuskTint: "#e6b487",
		// 		bgTint: "#f7d088ee",
		// 		bgTintRange: 60,

		// 		enableCollision: true,
		// 		collisionThreshold: 3,

		// 		splashMaxRadius: 3.2,
		// 		splashLineWidth: 0.3,
		// 	},
		// 	bindings: {
		// 		dropSpeed() {
		// 			const base = 1.8;
		// 			return base * (Weather.type.precipitationSpeed ?? 1);
		// 		},
		// 		dropCount() {
		// 			return Weather.precipitationIntensity * 200 - 150;
		// 		},
		// 		backgroundLight() {
		// 			if (Weather.bloodMoon || !(Time.hour >= setup.SkySettings.lightsTime.on || Time.hour < setup.SkySettings.lightsTime.off)) {
		// 				return false;
		// 			}
		// 			// Placeholder
		// 			const locations = [
		// 				"alley",
		// 				"brothel",
		// 				"canal",
		// 				"compound",
		// 				"dance_studio",
		// 				"dilapitaded_shop",
		// 				"estate",
		// 				"factory",
		// 				"home",
		// 				"hospital",
		// 				"kylar_manor",
		// 				"landfill",
		// 				"market",
		// 				"museum",
		// 				"office",
		// 				"park",
		// 				"police_station",
		// 				"pool",
		// 				"pub",
		// 				"school",
		// 				"sewers",
		// 				"shopping_centre",
		// 				"spa",
		// 				"studio",
		// 				"strip_club",
		// 				"temple",
		// 				"town",
		// 			];
		// 			return locations.includes(V.location);
		// 		},
		// 		backgroundTint() {
		// 			return Weather.bloodMoon ? "#eb3b2fee" : "#f7d088aa";
		// 		},
		// 		enableSplashes() {
		// 			const location = setup.Locations.get();
		// 			return !!setup.LocationImages[location].splashes;
		// 		},
		// 		collisionThreshold() {
		// 			const location = setup.Locations.get();
		// 			return setup.LocationImages[location].splashes?.collisionThreshold ?? 0;
		// 		},
		// 		sunFactor() {
		// 			return this.renderInstance.orbitals.sun.factor;
		// 		},
		// 		moonFactor() {
		// 			return this.renderInstance.orbitals.moon.factor;
		// 		},
		// 	},
		// },
		// {
		// 	effect: "proceduralPrecipitation",
		// 	drawCondition() {
		// 		return !this.renderInstance.skyDisabled && Weather.isOvercast && Weather.precipitationIntensity > 0 && Weather.precipitation === "snow";
		// 	},
		// 	params: {
		// 		precipitation: "snow",
		// 		dropWidth: 1,
		// 		minDistance: 8,
		// 		windAngle: 0.4,
		// 		baseAlpha: 1,
		// 		wobbleAmplitude: 0.2,
		// 		wobbleFrequency: 5,
		// 		sunTint: "#ffffffee",
		// 		moonTint: "#88a3cf",
		// 		dawnDuskTint: "#dbb695",
		// 		bgTint: "#f7d088aa",
		// 		bgTintRange: 50,
		// 		glareThreshold: 0.8,
		// 		glareDuration: 0.3,
		// 		glareInterval: 60,
		// 		splashLifetime: 0.8,
		// 		enableCollision: true,
		// 	},
		// 	bindings: {
		// 		baseAlpha() {
		// 			const factor = this.renderInstance.orbitals.sun.factor;
		// 			const minAlpha = 0.6;
		// 			const maxAlpha = 1;
		// 			// Always maxAlpha alpha when sun is up. Otherwise lerp it down to minAlpha
		// 			return factor >= 0 ? maxAlpha : lerp(factor + 1, minAlpha, maxAlpha);
		// 		},
		// 		dropCount() {
		// 			return Weather.precipitationIntensity * 300 - 100;
		// 		},
		// 		dropSpeed() {
		// 			return (Weather.precipitationIntensity * 0.2 + 0.4) * (Weather.type.precipitationSpeed ?? 1);
		// 		},
		// 		snowGlare() {
		// 			return Weather.precipitation === "snow" && Weather.precipitationIntensity <= 1 && Weather.overcast < 0.8;
		// 		},
		// 		backgroundLight() {
		// 			return Weather.bloodMoon || Time.hour >= setup.SkySettings.lightsTime.on || Time.hour < setup.SkySettings.lightsTime.off;
		// 		},
		// 		backgroundTint() {
		// 			return Weather.bloodMoon ? "#eb3b2fee" : "#f7d088aa";
		// 		},
		// 		enableSplashes() {
		// 			const location = setup.Locations.get();
		// 			return !!setup.LocationImages[location].splashes;
		// 		},
		// 		collisionThreshold() {
		// 			const location = setup.Locations.get();
		// 			return setup.LocationImages[location].splashes?.collisionThreshold ?? 0;
		// 		},
		// 		sunFactor() {
		// 			return this.renderInstance.orbitals.sun.factor;
		// 		},
		// 		moonFactor() {
		// 			return this.renderInstance.orbitals.moon.factor;
		// 		},
		// 	},
		// },
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
