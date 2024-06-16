function createCanvasCombatEditor() {
	console.warn("createCanvasCombatEditor initiated");

	const fragment = document.createDocumentFragment();

	const para = document.createElement("div");
	para.classList.add("mytest");
	fragment.append(para);

	console.warn("createCanvasCombatEditor finished", fragment);
	return fragment;
}

Macro.add("canvasCombatEditor", {
	handler() {
		const fragment = createCanvasCombatEditor();
		this.output.append(fragment);
	},
});

function refreshCanvas() {
	console.debug("refreshCanvas");
}

Macro.add("refreshCanvas", {
	handler() {
		refreshCanvas();
	},
});

function addLayerElements(layer) {
	const fragment = document.createDocumentFragment();

	return fragment;
}

Macro.add("addLayerElements", {
	handler() {
		addLayerElements();
	},
});
