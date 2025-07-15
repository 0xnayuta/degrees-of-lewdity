/* eslint-disable no-eval */
/* Use the most compatible code possible for this script, it should serve as the first script to load on the page, so should have total precedence. */
(() => {
	"use strict";

	let hasErrored = false;
	let resp = "";
	try {
		eval(`
			let foo = {}; foo?.bar; foo ??= [];
			class FooX { static { this.foo = "bar"; } };
			Object.hasOwn({ x: 1 }, "x");
		`);
	} catch (e) {
		hasErrored = true;
		resp += "This browser does not meet the minimum requirements for DoL (ES2022).\n";
	}
	if (hasErrored) {
		/* Calculate how the user should upgrade. */
		const segments = navigator.userAgent.split(" ");
		const android = segments.find(s => s.startsWith("Android"));
		const chrome = segments.find(s => s.startsWith("Chrome"));
		const firefox = segments.find(s => s.startsWith("Firefox"));
		if (android) {
			resp += "\nUpdate your Android WebView System app. Requires at least version 102. \nCurrent version: " + android.slice(8);
		} else if (chrome) {
			resp += "\nUpdate your Chrome browser.\nVersion: " + android.chrome(7);
		} else if (firefox) {
			resp += "\nUpdate your Firefox browser.\nVersion: " + firefox.slice(8);
		} else {
			resp += "\nUpdate your browser.";
		}
		alert(resp);
		console.debug(resp);
	}
})();
