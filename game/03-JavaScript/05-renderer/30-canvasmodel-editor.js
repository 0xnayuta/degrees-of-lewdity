// @ts-check
/* globals MultiCanvasModel */

class CombatEditor {
	static createCanvasCombatEditor() {
		const fragment = document.createDocumentFragment();

		const para = document.createElement("div");
		para.classList.add("mytest");
		para.append(
			this.createButton("Refresh Combat", () => {
				this.recompileCombatCanvas();
			})
		);
		para.append(
			this.createButton("Refresh Animation", () => {
				this.refreshCombatCanvas();
			})
		);
		fragment.append(para);

		return fragment;
	}

	/**
	 * @param {string} key
	 * @returns {DocumentFragment}
	 */
	static createLayerEditor(key) {
		const fragment = document.createDocumentFragment();

		const container = document.createElement("div");
		container.classList.add("d-flex", "flex-column");
		const layers = this.getModelLayers(key);
		const items = layers.map(layer => {
			const btn = document.createElement("button");
			btn.textContent = layer.name || "Unknown";
			if (layer.show !== true) {
				btn.classList.add("faded");
			}
			btn.addEventListener("click", ev => {
				console.log("Layer", layer.name, "clicked.");
			});
			return btn;
		});
		items.forEach(item => container.append(item));
		fragment.append(container);

		return fragment;
	}

	/**
	 * @param {string} text
	 * @param {function():void} callback
	 */
	static createButton(text, callback) {
		const button = document.createElement("button");
		button.classList.add("btn", "btn-info");
		button.textContent = text;
		button.addEventListener("click", function () {
			callback();
		});
		return button;
	}

	static refreshCombatCanvas() {
		MultiCanvasModel.ensureStorage();
		const model = T.multiCombatModels.combatMain;
		if (model != null) {
			model.refreshAnimation();
		}
	}

	static recompileCombatCanvas() {
		MultiCanvasModel.ensureStorage();
		const model = T.multiCombatModels.combatMain;
		if (model != null) {
			model.refresh();
		}
	}

	/**
	 * @param {string} key
	 * @returns {CompositeLayerSpec[]}
	 */
	static getModelLayers(key) {
		const model = T.multiCombatModels[key];
		return model.layers || [];
	}

	static addLayerElements(layer) {
		const fragment = document.createDocumentFragment();

		return fragment;
	}
}
window.CombatEditor = CombatEditor;

Macro.add("canvasCombatEditor", {
	handler() {
		const fragment = CombatEditor.createCanvasCombatEditor();
		this.output.append(fragment);
	},
});

Macro.add("addLayerElements", {
	handler() {
		const fragment = CombatEditor.createLayerEditor("combatMain");
		this.output.append(fragment);
	},
});
