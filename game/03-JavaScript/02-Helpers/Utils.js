const Utils = (() => {
	function getStack() {
		let output = `:: ${V.passage}`;
		if (DOL.Stack.length >= 1) {
			output += ` [${DOL.Stack.join(", ")}]`;
		}
		return output;
	}

	function defer(func, ...params) {
		if (Engine.isIdle()) {
			$(() => func(...params));
		} else {
			$(document).one(":passageend", () => func(...params));
		}
	}

	function getDatestamp() {
		const now = new Date();
		let MM = now.getMonth() + 1;
		let DD = now.getDate();
		let hh = now.getHours();
		let mm = now.getMinutes();
		let ss = now.getSeconds();

		if (MM < 10) {
			MM = `0${MM}`;
		}
		if (DD < 10) {
			DD = `0${DD}`;
		}
		if (hh < 10) {
			hh = `0${hh}`;
		}
		if (mm < 10) {
			mm = `0${mm}`;
		}
		if (ss < 10) {
			ss = `0${ss}`;
		}

		return `${now.getFullYear()}${MM}${DD}-${hh}${mm}${ss}`;
	}

	return Object.preventExtensions({
		GetStack: getStack,
		Defer: defer,
		GetDatestamp: getDatestamp,
	});
})();

window.Utils = Utils;
