Macro.add("newcanvasstart", {
	handler() {
		const width = this.args[0];
		const height = this.args[1];
		T.canvas = Renderer.createCanvas(width, height);
		T.layers = [];
		T.model = {};
		T.options = {};
	},
});

Macro.add("newcanvasselect", {
	handler() {
		const name = this.args[0];
		const slot = this.args[1];

		console.warn(this.name, "Name:", name, "Slot:", slot);
		const model = Renderer.locateModel(name, slot);

		T.model = T.model || {};
		T.model[slot] = model;
		T.options = T.options || {};
		T.options[slot] = model.defaultOptions();
	},
});

Macro.add("newcanvascompile", {
	handler() {
		const name = this.args[0];
		const slot = this.args[1];
		const overrides = this.args[2];

		console.warn(this.name, "Slot:", slot, "Overrides", overrides);

		if (typeof slot !== "string") {
			console.error(this.name, "Slot should be a string. Was:", typeof slot);
			return;
		}

		T.model = T.model || {};
		const model = T.model[slot];

		T.options = T.options || {};
		if (overrides != null) {
			console.warn("Overriding options");
			T.options[slot] = overrides;
		}
		const options = T.options[slot];

		if (model == null) {
			console.error("model", slot, "is null");
			return;
		}

		// Need to ask Aim about the model caching, when a layer is "shown", the layer is always "cached", regardless of if it's hidden once more.
		delete Renderer.CanvasModelCaches[name][slot];

		const processedLayers = model.compile(options);

		const layers = T.layers || [];
		if (Array.isArray(layers)) {
			console.warn(this.name, "Pushing layers.");
			layers.push(...processedLayers);
		}
	},
});

Macro.add("newcanvasanimate", {
	handler() {
		console.warn(this.name, T.canvas, T.layers);
		if (V.options.combatAnimations) {
			Renderer.animateLayers(T.canvas, T.layers, Renderer.defaultListener, true);
		} else {
			Renderer.composeLayers(T.canvas, T.layers, 1, Renderer.defaultListener);
		}
		T.canvas.canvas.className = this.args[0];
		this.output.append(T.canvas.canvas);
	},
});

Renderer.CanvasModels.test1 = {
	name: "test1",
	width: 128,
	height: 128,
	frames: 2,
	generatedOptions() {
		console.log("Test1 generating options.");
	},
	defaultOptions() {
		console.log("Test1 generating defaults.");
	},
	preprocess(options) {
		console.log("Test1 preprocessing.");
	},
	layers: {
		base: {
			srcfn(options) {
				return "img/blueblock.png";
			},
			show: true,
			filters: ["body"],
			z: 1,
			animation: "idle",
		},
		top: {
			srcfn(options) {
				return "img/greenblock.png";
			},
			show: true,
			filters: ["body"],
			z: 5,
			animation: "idle",
		},
	},
};

Renderer.CanvasModels.test2 = {
	name: "test2",
	width: 128,
	height: 128,
	frames: 2,
	generatedOptions() {
		console.log("Test2 generating options.");
	},
	defaultOptions() {
		console.log("Test2 generating defaults.");
	},
	preprocess(options) {
		console.log("Test2 preprocessing.");
	},
	layers: {
		base: {
			srcfn(options) {
				return "img/redblock.png";
			},
			show: true,
			filters: ["body"],
			z: 4,
			animation: "idle",
		},
	},
};
