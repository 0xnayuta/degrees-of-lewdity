window.overlayShowHide = function (elementId) {
	var div = document.getElementById(elementId);
	if (div != undefined) {
		div.classList.toggle("hidden");
		if (elementId === "debugOverlay") {
			SugarCube.State.variables.debugMenu[0] = !SugarCube.State.variables.debugMenu[0];
		}
	}
}

window.overlayMenu = function (elementId, type) {
	switch (type) {
		case "debug":
			var debug = ["debugMain", "debugCharacter", "debugEvents"]
			for (var i = 0, l = debug.length; i < l; i++) {
				var div = document.getElementById(debug[i]);
				if (div != undefined) {
					SugarCube.State.variables.debugMenu[1] = elementId;
					if (elementId === debug[i]) {
						div.classList.remove("hidden");
					} else {
						div.classList.add("hidden");
					}
				}
			}
			break;
	}
}

/*Sidebar swipe*/
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(evt) {
	return evt.touches ||			 // browser API
		evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
	var firstTouch = getTouches(evt)[0];
	xDown = firstTouch.clientX;
	yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
	if (!xDown || !yDown) {
		return;
	}

	/**
	 * Activate the swipe only when finger near the UI Bar.
	 * 50px - +/- width of unstowed UI Bar
	 * 280px - +/- width of unstowed UI bar
	 */
	if (isUIBarStowed()) {
		if (xDown > 50) {
			return;
		}
	} else {
		if (xDown > 280) {
			return;
		}
	}

	var xUp = evt.touches[0].clientX;
	var yUp = evt.touches[0].clientY;

	var xDiff = xDown - xUp;
	var yDiff = yDown - yUp;

	if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
		if (xDiff > 0) {
			UIBar.stow();/* left swipe */
		} else {
			UIBar.unstow();/* right swipe */
		}
	} else {
		if (yDiff > 0) {
			/* up swipe */
		} else {
			/* down swipe */
		}
	}
	/* reset values */
	xDown = null;
	yDown = null;
};

function isUIBarStowed() {
	return $('#ui-bar').hasClass('stowed');
}

var disableNumberifyInVisibleElements = [
	'#passage-testing-room',
	'#passage-diary-edit',
];

// Number-ify links
window.Links = window.Links || {};
Links.currentLinks = [];

function getPrettyKeyNumber(counter) {
	var str = "";

	if (counter > 10 && State.variables.useAbcLinks) {
		if (counter > 288) {
			str = "";
			console.warn("Too many links(" + counter + ") to numberify.");
		}
		else {
			if (counter > 252)
				str = "Ctrl + Alt + Shift + ";
			else if (counter > 216)
				str = "Ctrl + Alt +";
			else if (counter > 180)
				str = "Ctrl + Shift + ";
			else if (counter > 144)
				str = "Alt + Shift + ";
			else if (counter > 108)
				str = "Ctrl + ";
			else if (counter > 72)
				str = "Alt + ";
			else if (counter > 36)
				str = "Shift + ";

			if (counter % 36 === 0) // replace 0 with Z
				str += "Z"; // could also use String.fromCharCode(90)
			else if (counter % 36 === 10) // replace 10 with 0
				str += "0";
			else if (counter % 36 <= 10) // get 1 to 9
				str += (counter % 36);
			else // get A to Y
				str += String.fromCharCode(65 - 11 + (counter % 36));
		}
	}
	else if (counter > 80) {
		str = "";
		console.warn("Too many links(" + counter + ") to numberify.");
	}
	else {
		if (counter > 70)
			str = "Ctrl + Alt + Shift + ";
		else if (counter > 60)
			str = "Ctrl + Alt";
		else if (counter > 50)
			str = "Ctrl + Shift + ";
		else if (counter > 40)
			str = "Alt + Shift + ";
		else if (counter > 30)
			str = "Ctrl + ";
		else if (counter > 20)
			str = "Alt + ";
		else if (counter > 10)
			str = "Shift + ";

		if (counter % 10 === 0)// replace 10 with 0
			str += "0";
		else if (counter < 10)
			str += counter;
		else {
			var c = Math.floor(counter / 10); // set c to first number in a 2 digit number
			str += (counter - (10 * c)).toString(); // get 0-9 by subtracting c*10
			// not sure if there's a reason to not use counter % 10 here too.
		}
	}
	return str;
}


$(document).on(':passagerender', function (ev) {
	Links.currentLinks = [];

	if (passage() == "GiveBirth") {
		$(ev.content).find("[type=checkbox]").on('propertychange change', function () {
			new Wikifier(null, '<<resetPregButtons>>');
			Links.generateLinkNumbers(ev.content);
		});
	}

	Links.generateLinkNumbers(ev.content);
});

// matches with a string(linktext in this case) that starts with ( followed by any number of anything but ) followed by )
Links.keyNumberMatcher = /^\([^\)]+\)/

Links.generateLinkNumbers = function generateLinkNumbers(content) {
	if (!State.variables.numberify_enabled || !StartConfig.enableLinkNumberify)
		return;

	for (var i = 0; i < disableNumberifyInVisibleElements.length; i++) {
		if ($(content).find(disableNumberifyInVisibleElements[i]).length || $(content).is(disableNumberifyInVisibleElements[i]))
			return; // simply skip this render
	}

	// wanted to use .macro-link, but wardrobe and something else doesn't get selected, lmao
	// I'd like this to find .macro-cycle too to potentially make diary writing stuff use them but can't be bothered to figure out how to do it even if it seems like it should be pretty simple.
	Links.currentLinks = $(content)
		.find(".link-internal") 
		.not(".no-numberify *, .no-numberify");
	
	$(Links.currentLinks).each(function (i, el) {
		if (Links.keyNumberMatcher.test(el.innerHTML)) { 
			el.innerHTML = el.innerHTML.replace(Links.keyNumberMatcher, `(${getPrettyKeyNumber(i + 1)})`) // if there's a a valid link like [[(whatever)link|$passage]] replace whatever with an appropriate numberify text
		} else {
			$(el).html("(" + getPrettyKeyNumber(i + 1) + ") " + $(el).html());
		}
	});
}
Links.generate = () => Links.generateLinkNumbers(document.getElementsByClassName("passage")[0] || document);

$(document).on('keyup', function (ev) {
	/*
	if ((ev.keyCode >= 65 && ev.keyCode <= 90))
		console.log("Pressed " + String.fromCharCode(ev.keyCode) + "(" + ev.keyCode + ")");
	*/
	if (!State.variables.numberify_enabled || !StartConfig.enableLinkNumberify || State.variables.tempDisable)
		return;

	if ((ev.keyCode >= 48 && ev.keyCode <= 57) || (ev.keyCode >= 96 && ev.keyCode <= 105) || (ev.keyCode >= 65 && ev.keyCode <= 90)) { // 48 to 57 are 0-9, 96 to 105 are numpad 0-9 and 65 to 90 are A to Z

		if (State.variables.useAbcLinks) {
			if (ev.keyCode < 60)
				var fixedKeyIndex = ev.keyCode - 48; // 0 to 9 are 1 to 10
			else if (ev.keyCode >= 96)
				var fixedKeyIndex = ev.keyCode - 96; // numpad 0 to 9 are 1 to 10
			else if (ev.keyCode >= 65 && ev.keyCode <= 90)
				var fixedKeyIndex = ev.keyCode - 55; // a to z are 11 to 36
			
			var requestedLinkIndex = [
				9,0,1,2,3,4,5,6,7,8,
				10,11,12,13,14,15,16,17,18,19,
				20,21,22,23,24,25,26,27,28,29,
				30,31,32,33,34,35
			][fixedKeyIndex]; // set requestedLinkIndex to fixedKeyIndexth number in this array
			
			if (ev.shiftKey && ev.altKey && ev.ctrlKey)
				requestedLinkIndex += 252;
			else if (ev.altKey && ev.ctrlKey)
				requestedLinkIndex += 216;
			else if (ev.shiftKey && ev.ctrlKey)
				requestedLinkIndex += 180;
			else if (ev.shiftKey && ev.altKey)
				requestedLinkIndex += 144;
			else if (ev.ctrlKey)
				requestedLinkIndex += 108;
			else if (ev.altKey)
				requestedLinkIndex += 72;
			else if (ev.shiftKey)
				requestedLinkIndex += 36;
		}
		else {
			var fixedKeyIndex = (ev.keyCode < 60 ? ev.keyCode - 48 : ev.keyCode - 96); // get 0 to 9 regardless of if using numpad or not from the currently pressed key by subtracting keycode of 0 from it
			var requestedLinkIndex = [
			9,0,1,2,3,4,5,6,7,8
			][fixedKeyIndex];
			
			if (ev.shiftKey && ev.altKey && ev.ctrlKey)
				requestedLinkIndex += 70;
			else if (ev.altKey && ev.ctrlKey)
				requestedLinkIndex += 60;
			else if (ev.shiftKey && ev.ctrlKey)
				requestedLinkIndex += 50;
			else if (ev.shiftKey && ev.altKey)
				requestedLinkIndex += 40;
			else if (ev.ctrlKey)
				requestedLinkIndex += 30;
			else if (ev.altKey)
				requestedLinkIndex += 20;
			else if (ev.shiftKey)
				requestedLinkIndex += 10;
		}

		if ($(Links.currentLinks).length >= requestedLinkIndex + 1) { 
			$(Links.currentLinks[requestedLinkIndex]).click();
		}
	}
});

var defaultSkinColorRanges = {
	"hStart": 45, "hEnd": 45,
	"sStart": 0.2, "sEnd": 0.4,
	"bStart": 4.5, "bEnd": 0.7,
};

window.skinColor = function (enabled, percent, overwrite) {
	if (enabled === "f") {
		return "";
	}

	var ranges = ensureIsArray(overwrite || defaultSkinColorRanges);
	var totalProgress = percent / 100;

	var scaledProgress = ranges.length * totalProgress;
	var rangeIndex = totalProgress === 1
		? ranges.length - 1
		: Math.floor(scaledProgress);
	var progress = totalProgress === 1
		? 1
		: scaledProgress - rangeIndex;

	var { hStart, hEnd, sStart, sEnd, bStart, bEnd } = ranges[rangeIndex];

	var hue = (hEnd - hStart) * progress + hStart;
	var saturation = (sEnd - sStart) * progress + sStart;
	var brightness = (bEnd - bStart) * progress + bStart;

	var hueCss = `hue-rotate(${hue}deg)`;
	var saturationCss = `saturate(${saturation.toFixed(2)})`;
	var brightnessCss = `brightness(${brightness.toFixed(2)})`;

	return `${hueCss} ${saturationCss} ${brightnessCss}`;
}

window.closeFeats = function (id) {
	var div1 = document.getElementById("feat-" + id);
	var div2 = document.getElementById("closeFeat-" + id);
	div1.style.display = "none";
	div2.style.display = "none";
}

window.filterFeats = function () {
	new Wikifier(null, '<<replace #featsList>><<featsList>><</replace>>');
}

window.getTimeNumber = function (t) {
	var time = new Date(t);
	var result = time.getTime();
	if (isNaN(result)) {
		return 9999999999999999;
	}
	return result;
}

window.extendStats = function () {
	SugarCube.State.variables.extendedStats = !SugarCube.State.variables.extendedStats;
	var captionDiv = document.getElementById('storyCaptionDiv'),
		statsDiv = document.getElementById('stats');
	if (SugarCube.State.variables.extendedStats === true) {
		captionDiv.classList.add("storyCaptionDivExtended");
		statsDiv.classList.add("statsExtended");
	} else {
		captionDiv.classList.remove("storyCaptionDivExtended");
		statsDiv.classList.remove("statsExtended");
	}
	new Wikifier(null, '<<replace #stats>><<statsCaption>><</replace>>');
}

window.customColor = function (color, saturation, brightness, contrast, sepia) {
	return 'filter: hue-rotate(' + color + 'deg) saturate(' + saturation + ') brightness(' + brightness + ') contrast(' + contrast + ') sepia(' + sepia + ')';
}

window.zoom = function (size, set) {
	if (size === undefined) {
		size = document.getElementById("numberslider-input-zoom").value;
	}
	var parsedSize = parseInt(size);
	var body = document.getElementsByTagName("body")[0];
	if (parsedSize >= 50 && parsedSize <= 200 && parsedSize !== 100) {
		body.style.zoom = size + "%";
		if (set === true) {
			SugarCube.State.variables.zoom = size;
		}
	} else {
		body.style.zoom = "";
		if (set === true) {
			SugarCube.State.variables.zoom = 100;
		}
	}
}
