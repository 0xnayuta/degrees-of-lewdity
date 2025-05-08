// rename-ts-output.js
import { existsSync, renameSync } from "node:fs";
import { globSync } from "glob"; // Requires: npm install glob -D

console.log("Starting TypeScript output renaming...");

// Find all .js files under ./game/ that were likely generated from .ts files
// and don't already have the .tsc-output.js suffix.
const files = globSync("./game/**/*.js", {
	ignore: [
		"./game/**/*.tsc-output.js", // Don't process already renamed files
		"**/node_modules/**",
	],
	nodir: true, // Ensure we only get files
});

files.forEach(file => {
	const tsFile = file.substring(0, file.length - 3) + ".ts"; // Check for corresponding .ts file

	if (existsSync(tsFile)) {
		const newName = file.substring(0, file.length - 3) + ".tsc-output.js";
		try {
			renameSync(file, newName);
			console.log(`Renamed: ${file} -> ${newName}`);
		} catch (err) {
			console.error(`Error renaming ${file}:`, err);
		}
	} else {
		// console.log(`Skipping ${file}, no corresponding .ts file found.`);
	}
});

console.log("Renaming complete.");
