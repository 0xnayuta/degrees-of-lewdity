function getIntegrityInfo(integrity) {
	if (integrity >= 900) return [7, "green"];
	if (integrity >= 500) return [6, "teal"];
	if (integrity >= 200) return [5, "lblue"];
	if (integrity >= 100) return [4, "blue"];
	if (integrity >= 50) return [3, "purple"];
	if (integrity >= 20) return [2, "pink"];
	return [1, "red"];
}
window.getIntegrityInfo = getIntegrityInfo;

function getRevealInfo(reveal) {
	if (reveal >= 900) return [7, "red"];
	if (reveal >= 700) return [6, "pink"];
	if (reveal >= 500) return [5, "purple"];
	if (reveal >= 300) return [4, "blue"];
	if (reveal >= 200) return [3, "lblue"];
	if (reveal >= 100) return [2, "teal"];
	return [1, "green"];
}
window.getRevealInfo = getRevealInfo;

function getWarmthInfo(warmth) {
	// Factor is 1-10. warmth of 7-9 will all have 7 dots, but different colours
	const factor = (warmth - 5.5) / 4.5;
	return "background-color:" + ColourUtils.interpolateTripleColor("#62c6ff", "#ffee3b", "#ff481b", factor);
}
window.getWarmthInfo = getWarmthInfo;

// for outfits it adds the lower piece's warmth too
function getTrueWarmth(item) {
	let warmth = item.warmth || 0;

	if (item.outfitPrimary) {
		// sum of warmth of every secondary piece
		// outfitPrimary looks like this {'lower': 'item_name', 'head': 'item_name'}
		warmth += Object.keys(item.outfitPrimary) // loop through secondary items list
			.filter(x => item.outfitPrimary[x] !== "broken" && item.outfitPrimary[x] !== "split") // filter out broken pieces
			.map(x => setup.clothes[x].find(z => z.name === item.outfitPrimary[x] && z.modder === item.modder)) // find items in setup.clothes
			.reduce((sum, x) => sum + (x.warmth || 0), 0); // calculate sum of their warmth field
	}

	if (item.outfitSecondary) {
		if (item.outfitSecondary.length % 2 !== 0) console.log("WARNING: " + item.name + " has bad .outfitSecondary data!");

		// outfitSecondary looks like this ['upper', 'item_name', 'head', 'item_name']
		item.outfitSecondary.forEach((x, i) => {
			if (i % 2 === 0 && item.outfitSecondary[i + 1] !== "broken" && item.outfitSecondary[i + 1] !== "split") {
				warmth += setup.clothes[x].find(z => z.name === item.outfitSecondary[i + 1] && z.modder === item.modder).warmth || 0;
			}
		});
	}

	return warmth;
}
window.getTrueWarmth = getTrueWarmth;

function clothingSlotToIconName(slotName, outfits) {
	switch (slotName) {
		case "over_upper":
			return "overoutfit";
		case "upper":
			return outfits ? "outfit" : "upper";
		case "under_upper":
			return outfits ? "underoutfit" : "underupper";
		case "under_lower":
			return "underlower";
		default:
			return slotName;
	}
}
window.clothingSlotToIconName = clothingSlotToIconName;

// Make .divs-links clickable as if they're anchors
function linkifyDivs(parentSelector = "") {
	$(() => {
		$(parentSelector + " .div-link").click(function (e) {
			$(this).find("a").first().click();
		});
	});
	$(() => {
		$(parentSelector + " .div-link a").click(function (e) {
			e.stopPropagation();
		});
	});
}
window.linkifyDivs = linkifyDivs;

// Hook custom colour sliders and preset dropdowns
function attachCustomColourHooks(slot = "") {
	$(() => {
		// throttling for smoother experience
		let updating = false;
		$(".custom-colour-sliders.primary input[type=range]").on("input change", () => {
			if (updating) return;
			updating = true;
			requestAnimationFrame(() => {
				updating = false;
				updateCustomColour("primary", slot);
				updateMannequin(slot);
			});
		});
		$(".custom-colour-sliders.secondary input[type=range]").on("input change", () => {
			if (updating) return;
			updating = true;
			requestAnimationFrame(() => {
				updating = false;
				updateCustomColour("secondary", slot);
				updateMannequin(slot);
			});
		});
		$(".custom-colour.primary > .custom-colour-presets > .presets-dropdown > select").on("change", () => {
			loadCustomColourPreset("primary");
			Wikifier.wikifyEval("<<updateclotheslist>>");
		});
		$(".custom-colour.secondary > .custom-colour-presets > .presets-dropdown > select").on("change", () => {
			loadCustomColourPreset("secondary");
			Wikifier.wikifyEval("<<updateclotheslist>>");
		});

		$(".custom-colour-sliders.primary > .colour-slider > div > input").on("input", e => {
			V.customColors.sepia.primary = 0;
		});
		$(".custom-colour-sliders.secondary > .colour-slider > div > input").on("input", e => {
			V.customColors.sepia.secondary = 0;
		});
	});
}
window.attachCustomColourHooks = attachCustomColourHooks;

function updateCustomColour(type, slot) {
	$(".colour-options-div." + type + " > .colour-button > .bg-custom").css("filter", getCustomColourStyle(type, true));
	const model = Renderer.locateModel("main", "shop");
	if (model) {
		const customColors = V.customColors;
		model.options.filters["worn_" + slot + (type === "primary" ? "_custom" : "_acc_custom")] = getCustomClothesColourCanvasFilter(
			customColors.color[type],
			customColors.saturation[type],
			customColors.brightness[type],
			customColors.contrast[type]
		);
	}
}
window.updateCustomColour = updateCustomColour;

function updateMannequin(slot = "") {
	Wikifier.wikifyEval("<<updatemannequin '" + slot + "'>>");
}
window.updateMannequin = updateMannequin;

function getCustomColourStyle(type, valueOnly = false) {
	if (type !== "primary" && type !== "secondary") return;
	return (
		(valueOnly ? "" : "filter: ") +
		"hue-rotate(" +
		V.customColors.color[type] +
		"deg) saturate(" +
		V.customColors.saturation[type] +
		") brightness(" +
		V.customColors.brightness[type] +
		") contrast(" +
		V.customColors.contrast[type] +
		")" +
		(valueOnly ? "" : ";")
	);
}
window.getCustomColourStyle = getCustomColourStyle;

function saveCustomColourPreset(slot = "primary") {
	const setName = prompt("Enter new colour preset name", "New preset");
	if (setName != null) {
		if (Object.keys(V.customColors.presets).includes(setName)) {
			alert("Preset '" + setName + "' already exists!");
			return;
		}

		V.customColors.presets[setName] = {
			ver: 3,
			color: V.customColors.color[slot],
			value: V.customColors.value[slot],
			brightness: V.customColors.brightness[slot],
			saturation: V.customColors.saturation[slot],
			contrast: V.customColors.contrast[slot],
		};
	}
}
window.saveCustomColourPreset = saveCustomColourPreset;

const colourPickerShopCustom = {};

function loadCustomColourPreset(slot = "primary") {
	const setName = T.preset_choice[slot];
	const preset = V.customColors.presets[setName];
	if (preset) {
		// ver 3 includes property "value" which is used to set the position of the "value"(aka brightness) custom slider at shop, see here : https://i.imgur.com/hmbFT4U.png
		if (preset.ver >= 3) {
			V.customColors.value[slot] = preset.value;
			// this effectively set the different sliders values
			colourPickerShopCustom[slot].color.hue = preset.color;
			colourPickerShopCustom[slot].color.saturation = (((preset.saturation / 32) * 100) / 4) * 100;
			colourPickerShopCustom[slot].color.value = preset.value;
		}
		// new version of preset (has only one set of colour parameters and doesn't have sepia)
		if (preset.ver >= 2) {
			V.customColors.color[slot] = preset.color;
			V.customColors.brightness[slot] = preset.brightness;
			V.customColors.saturation[slot] = preset.saturation;
			V.customColors.contrast[slot] = preset.contrast;
			V.customColors.sepia[slot] = 0;
		}
		// legacy preset (has both primary and secondary colours information)
		else {
			V.customColors.color.primary = preset.color.primary;
			V.customColors.brightness.primary = preset.brightness.primary;
			V.customColors.saturation.primary = preset.saturation.primary;
			V.customColors.contrast.primary = preset.contrast.primary;
			V.customColors.sepia.primary = preset.sepia.primary;

			V.customColors.color.secondary = preset.color.secondary;
			V.customColors.brightness.secondary = preset.brightness.secondary;
			V.customColors.saturation.secondary = preset.saturation.secondary;
			V.customColors.contrast.secondary = preset.contrast.secondary;
			V.customColors.sepia.secondary = preset.sepia.secondary;
		}
	}
}
window.loadCustomColourPreset = loadCustomColourPreset;

function getOwnedClothingCount(index, type) {
	const wardrobe = V.wardrobes.shopReturn === "wardrobe" ? V.wardrobe : V.wardrobes[V.wardrobes.shopReturn] || V.wardrobe;
	return wardrobe[type].reduce((p, c) => p + Number(c.index === index), 0);
}
window.getOwnedClothingCount = getOwnedClothingCount;

function importCustomColour(acc) {
	const setName = prompt("Enter custom code", "");
	if (setName != null) {
		let color;
		try {
			color = JSON.parse(window.atob(setName));
		} catch (e) {
			document.getElementById("export-custom-colour-box").outerHTML = `
			<div id="export-custom-colour-box">
				<span class="export-custom-colour-error">Invalid string, make sure you copied it correctly without any spaces around it.</span>
			</div>`;
			return;
		}
		const colourProperties = Object.getOwnPropertyNames(color);

		if (colourProperties.sort().join(",") === ["color", "saturation", "value", "brightness", "contrast"].sort().join(",")) {
			V.customColors.color[acc] = color.color;
			V.customColors.saturation[acc] = color.saturation;
			V.customColors.value[acc] = color.value;
			V.customColors.contrast[acc] = color.contrast;
			V.customColors.brightness[acc] = color.brightness;
			colourPickerShopCustom[acc].color.hue = color.color;
			colourPickerShopCustom[acc].color.saturation = (((color.saturation / 32) * 100) / 4) * 100;
			colourPickerShopCustom[acc].color.value = color.value;
			document.getElementById("numberslider-input-customcolorscontrastprimary").value = color.contrast.toString();
			document.getElementById("numberslider-value-customcolorscontrastprimary").innerText = color.contrast.toString();
			document.getElementById("export-custom-colour-box").outerHTML = `
			<div id="export-custom-colour-box">
				<span class="export-custom-colour-alert">Imported!</span>
			</div>`;
			window.setTimeout(() => {
				if (document.getElementById("export-custom-colour-box"))
					document.getElementById("export-custom-colour-box").classList.add("successfully-exported");
			}, 100);
			updateMannequin();
		} else {
			document.getElementById("export-custom-colour-box").outerHTML = `
			<div id="export-custom-colour-box">
				<span class="export-custom-colour-error">Invalid code.</span>
			</div>`;
		}
	}
}
window.importCustomColour = importCustomColour;

function exportCustomColour(acc) {
	const obj = {
		color: V.customColors.color[acc],
		saturation: V.customColors.saturation[acc],
		value: V.customColors.value[acc],
		brightness: V.customColors.brightness[acc],
		contrast: V.customColors.contrast[acc],
	};

	navigator.clipboard.writeText(window.btoa(JSON.stringify(obj)));
	document.getElementById("export-custom-colour-box").outerHTML = `
	<div id="export-custom-colour-box">
		<span class="export-custom-colour-alert">Copied to clipboard!</span>
	</div>`;
	window.setTimeout(() => {
		if (document.getElementById("export-custom-colour-box")) document.getElementById("export-custom-colour-box").classList.add("successfully-exported");
	}, 100);
}
window.exportCustomColour = exportCustomColour;

function adaptSliderWidth() {
	if (window.innerWidth > 787) return 400;
	else if (window.innerWidth > 710) return 350;
	else if (window.innerWidth > 667) return 300;
	else if (window.innerWidth > 600) return 230;
	else if (window.innerWidth > 519) return 350;
	else if (window.innerWidth > 463) return 300;
	else return 250;
}

function shopClothCustomColorWheel(acc) {
	const container = document.createElement("label");
	colourPickerShopCustom[acc] = new iro.ColorPicker(container, {
		color: { h: 61, s: 47, v: 100 },
		width: adaptSliderWidth(),
		layout: [
			{
				component: iro.ui.Slider,
				options: {
					sliderType: "hue",
				},
			},
			{
				component: iro.ui.Slider,
				options: {
					sliderType: "saturation",
				},
			},
			{
				component: iro.ui.Slider,
				options: {
					sliderType: "value",
				},
			},
		],
	});
	colourPickerShopCustom[acc].color.hue = V.customColors.color[acc];
	colourPickerShopCustom[acc].color.saturation = (((V.customColors.saturation[acc] / 32) * 100) / 4) * 100;
	colourPickerShopCustom[acc].color.value = V.customColors.value[acc];
	//
	colourPickerShopCustom[acc].on(["color:init", "color:change"], function (color) {
		V.customColors.color[acc] = Math.round(color.hue);
		V.customColors.saturation[acc] = (((color.saturation * 32) / 100) * 4) / 100;
		V.customColors.brightness[acc] = (color.hsl.l * 4) / 100;
		V.customColors.value[acc] = color.value;
		if (document.getElementById("mannequin")) updateMannequin();
	});
	return container;
}
window.shopClothCustomColorWheel = shopClothCustomColorWheel;

function updateHueSlider(newValue, acc) {
	colourPickerShopCustom[acc].color.hue = newValue;
}
window.updateHueSlider = updateHueSlider;

/**
 * Whether the primary and secondary colours picked for the clothing item open in the shop can be swapped.
 *
 * @returns {boolean}
 */
function canSwapShopItemColours() {
	const item = setup.clothes[V.shopItemSlot][V.clothes_choice];
	return item.accessory_colour_options.includes(V.colouraction) && item.colour_options.includes(V.accessorycolouraction);
}
window.canSwapShopItemColours = canSwapShopItemColours;

/**
 * Picks a colour for the clothing item open in the shop.
 *
 * @param {"primary" | "secondary"} colourType
 * @param {string} colour
 */
function pickShopItemColour(colourType, colour) {
	$(`.colour-options-div.${colourType} > .colour-button > .bg-${colour.replace(/ /g, "-")} > a`).trigger("click");
}

/**
 * Swaps the primary and secondary custom colour settings in the shop and moves their sliders to match.
 */
function swapShopCustomColourSettings() {
	const primaryWheelColour = colourPickerShopCustom.primary.color.hsv;
	colourPickerShopCustom.primary.color.hsv = colourPickerShopCustom.secondary.color.hsv;
	colourPickerShopCustom.secondary.color.hsv = primaryWheelColour;

	for (const setting of ["contrast", "sepia"]) {
		[V.customColors[setting].primary, V.customColors[setting].secondary] = [V.customColors[setting].secondary, V.customColors[setting].primary];
	}
	for (const colourType of ["primary", "secondary"]) {
		$(`#numberslider-input-customcolorscontrast${colourType}`).val(V.customColors.contrast[colourType]);
		$(`#numberslider-value-customcolorscontrast${colourType}`).text(V.customColors.contrast[colourType]);
		updateCustomColour(colourType, V.shopItemSlot);
	}
}

/**
 * Swaps the primary and secondary colours picked for the clothing item open in the shop, along with their custom colour settings.
 */
function swapShopItemColours() {
	const primaryColour = V.colouraction;
	const secondaryColour = V.accessorycolouraction;
	swapShopCustomColourSettings();
	pickShopItemColour("primary", secondaryColour);
	pickShopItemColour("secondary", primaryColour);
}
window.swapShopItemColours = swapShopItemColours;

window.addEventListener(
	"resize",
	function (event) {
		for (const cat in colourPickerShopCustom) {
			colourPickerShopCustom[cat].resize(adaptSliderWidth());
		}
	},
	true
);

Macro.add("shopclothingcustomcolourwheel", {
	handler() {
		if (this.args[0]) {
			const resp = shopClothCustomColorWheel(this.args[0], this.args[1]);
			this.output.append(resp.children[0]);
		}
	},
});

window.colourPickerShopCustom = colourPickerShopCustom;

function filterShopGroup(clothingItems) {
	if (!Array.isArray(clothingItems)) return [];
	T.itemGroups = {};
	return clothingItems.filter(item => {
		if (!item.shopGroup) return true;
		T.itemGroups[item.slot] ??= {};
		if (!T.itemGroups[item.slot][item.shopGroup]) {
			T.itemGroups[item.slot][item.shopGroup] = [item.index];
			return true;
		} else {
			T.itemGroups[item.slot][item.shopGroup].push(item.index);
			return false;
		}
	});
}
window.filterShopGroup = filterShopGroup;

/** Body temperatures at the two ends of the warmth bar. */
const warmthScale = { min: 34, max: 40 };

function clothingWarmthScale(element, value) {
	$(() => {
		const positionPercent = normalise(value, warmthScale.max, warmthScale.min) * 100;
		element.css("left", `${positionPercent}%`);
	});
}

function getTargetWarmth(targetTemperature) {
	let low = 0;
	let high = 60;
	let bestWarmth = null;

	while (low <= high) {
		const mid = Math.floor((low + high) / 2);
		const temp = Weather.BodyTemperature.getRestingPoint(8, mid, 37, true);

		if (temp > targetTemperature) {
			bestWarmth = mid;
			high = mid - 1;
		} else {
			low = mid + 1;
		}
	}

	return bestWarmth;
}
window.getTargetWarmth = getTargetWarmth;

DefineMacro("updatewarmthscale", () => {
	$(() => {
		const indicator = $("#warmthIndicator");
		const indicatorNew = $("#warmthIndicatorNew");
		const currentWarmth = Weather.BodyTemperature.getWarmth();
		clothingWarmthScale(indicator, Weather.BodyTemperature.getRestingPoint(8, currentWarmth, 37, true));
		clothingWarmthScale($("#warmthZoneMin"), Weather.tempSettings.comfortableBodyTemperature.min);
		clothingWarmthScale($("#warmthZoneMax, .warmth-scale-dim-hot"), Weather.tempSettings.comfortableBodyTemperature.max);
		$(".warmth-scale-dim-cold").css("width", `${normalise(Weather.tempSettings.comfortableBodyTemperature.min, warmthScale.max, warmthScale.min) * 100}%`);
		$(".warmth-scale-dim-hot").css(
			"width",
			`${(1 - normalise(Weather.tempSettings.comfortableBodyTemperature.max, warmthScale.max, warmthScale.min)) * 100}%`
		);
		const zoneMin = getTargetWarmth(Weather.tempSettings.comfortableBodyTemperature.min);
		const zoneMax = getTargetWarmth(Weather.tempSettings.comfortableBodyTemperature.max);
		$("#warmthZoneMin")
			.text(zoneMin ?? "")
			.toggle(zoneMin !== null);
		$("#warmthZoneMax")
			.text(zoneMax ?? "")
			.toggle(zoneMax !== null);
		indicator.tooltip({
			message: "Warmth: " + currentWarmth,
			delay: 200,
			position: "cursor",
		});
		if (V.clothes_choice && V.shopItemSlot && T.realIndex) {
			const newWarmth = currentWarmth - V.worn[V.shopItemSlot].warmth + setup.clothes[V.shopItemSlot][T.realIndex].warmth;
			if (newWarmth !== currentWarmth) {
				indicatorNew.show();
				clothingWarmthScale(indicatorNew, Weather.BodyTemperature.getRestingPoint(8, newWarmth, 37, true));
				indicator.tooltip({
					message: "New warmth: " + newWarmth,
					delay: 200,
					position: "cursor",
				});
				return;
			}
		}
		indicatorNew.hide();
	});
});
