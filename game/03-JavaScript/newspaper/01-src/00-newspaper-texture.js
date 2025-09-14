/*
	Creates a paper texture once, on load, based on a seed. (will generate the same texture for the same seed)
*/
setup.NewspaperTexture = (() => {
	const sepia = { r: 112, g: 84, b: 46 };

	const defaultOptions = {
		width: 924,
		height: 1250,
		noiseIntensity: 0.08,
		fiberCount: 250,
		fiberIntensity: 0.08,
		fiberThickness: [1, 3.5],
		fiberLength: [3, 25],
	};

	function draw(canvas, opts = {}) {
		const { noiseIntensity, fiberCount, fiberIntensity, fiberThickness, fiberLength } = defaultOptions;
		const ctx = canvas.ctx;
		const [width, height] = [canvas.element.width, canvas.element.height];
		const rng = new PRNG(Newspaper.wrapSeed(V.newspaper.seed + V.newspaper.total * 0.0001));

		// base sepia noise
		const img = ctx.createImageData(width, height);
		for (let i = 0; i < img.data.length; i += 4) {
			img.data[i] = sepia.r;
			img.data[i + 1] = sepia.g;
			img.data[i + 2] = sepia.b;
			img.data[i + 3] = (rng.random() * noiseIntensity * 255) | 0;
		}
		ctx.putImageData(img, 0, 0);

		// fibers
		ctx.lineCap = "round";
		for (let i = 0; i < fiberCount; i++) {
			const x1 = rng.random() * width;
			const y1 = rng.random() * height;
			const ang = rng.random() * Math.PI * 2;
			const len = fiberLength[0] + rng.random() * (fiberLength[1] - fiberLength[0]);
			ctx.lineWidth = fiberThickness[0] + rng.random() * (fiberThickness[1] - fiberThickness[0]);
			ctx.strokeStyle = `rgba(${sepia.r}, ${sepia.g}, ${sepia.b}, ${(rng.random() * fiberIntensity).toFixed(3)})`;
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x1 + Math.cos(ang) * len, y1 + Math.sin(ang) * len);
			ctx.stroke();
		}
	}

	function init({ width = 924, height = 1250 } = {}) {
		const canvas = new BaseCanvas(width, height);
		draw(canvas);
		const dataURL = canvas.element.toDataURL();

		// Save the texture to a css variable
		// Vignette is handled in css
		$("html").css("--paper-texture", `url(${dataURL})`);
	}

	return { init };
})();
