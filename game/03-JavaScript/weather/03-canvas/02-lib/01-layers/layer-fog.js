Weather.Renderer.Layers.add({
	name: "fog",
	animation: { updateRate: 50 },
	zIndex: 15,
	compositeOperation: "source-over",
	effects: [
		{
			effect: "particleFog",
			drawCondition() {
				return !this.renderInstance.skyDisabled && (Weather.fog || Weather.precipitationIntensity >= 0);
			},
			params: {
				groundBias: 3,
				scale: 0.5,
				scaleVariance: 1,
				wanderRadius: 10,
				minVel: 0.6, // px/sec
				maxVel: 1.2,
				images: {
					fog: "img/misc/sky/clouds/fog/smoke3.png",
				},
			},
			bindings: {
				particleCount() {
					return Weather.fog * 20 + Weather.precipitationIntensity * 5;
				},
			},
		},
		{
			effect: "colorOverlay",
			drawCondition() {
				return !this.renderInstance.skyDisabled && (Weather.fog || Weather.precipitationIntensity >= 0);
			},
			compositeOperation: "source-atop",
			params: {
				color: {
					nightDark: "#4e305c",
					nightBright: "#603d70",
					day: "#fffffc",
					dawnDusk: "#ba7f49",
					bloodMoon: "#380101",
				},
			},
			bindings: {
				sunFactor() {
					return this.renderInstance.orbitals.sun.factor;
				},
				moonFactor() {
					return this.renderInstance.moonBrightnessFactor;
				},
				bloodMoon() {
					return Weather.bloodMoon;
				},
			},
		},
	],
});

// Weather.Renderer.Layers.add({
// 	name: "fog2",
// 	zIndex: 13,
// 	blur: false,
// 	effects: [
// 		{
// 			effect: "fog",
// 			drawCondition() {
// 				return !this.renderInstance.skyDisabled;
// 			},
// 			params: {
// 				images: {
// 					fog: "img/misc/sky/clouds/fog/0.png",
// 				},
// 				movement: {
// 					speed: 0.4,
// 				},
// 				baseAlpha: 0.9,
// 			},
// 			bindings: {
// 				fogFactor() {
// 					return Weather.fog;
// 				},
// 				weather() {
// 					return Weather.current;
// 				},
// 			},
// 		},
// 		{
// 			effect: "colorOverlay",
// 			compositeOperation: "source-atop",
// 			params: {
// 				color: {
// 					nightDark: "#000412ee",
// 					nightBright: "#000412dd",
// 					day: "#97a9e8e5",
// 					dawnDusk: "#7a511895",
// 					bloodMoon: "#4a0505ee",
// 				},
// 			},
// 			bindings: {
// 				sunFactor() {
// 					return this.renderInstance.orbitals.sun.factor;
// 				},
// 				moonFactor() {
// 					return this.renderInstance.moonBrightnessFactor;
// 				},
// 				bloodMoon() {
// 					return Weather.bloodMoon;
// 				},
// 			},
// 		},
// 	],
// });
