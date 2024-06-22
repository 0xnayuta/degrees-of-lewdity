// @ts-check
/* globals MultiCanvasModel */

class CombatEditor {
	static createCanvasCombatEditor() {
		console.warn("createCanvasCombatEditor initiated");

		const fragment = document.createDocumentFragment();

		const para = document.createElement("div");
		para.classList.add("mytest");
		para.append(
			this.createButton("Refresh Combat", () => {
				console.warn("Button callback called: Recompiling, and refreshing.");
				this.recompileCombatCanvas();
			})
		);
		fragment.append(para);

		console.warn("createCanvasCombatEditor finished", fragment);
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

	static recompileCombatCanvas() {
		console.debug("refreshCanvas");

		MultiCanvasModel.ensureStorage();
		const model = T.multiCombatModels.combatMain;
		if (model != null) {
			model.refresh();
		}
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
		CombatEditor.addLayerElements();
	},
});
