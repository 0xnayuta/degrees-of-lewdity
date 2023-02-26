/**
 * Input: ITweeContent[].
 * Output: string containing <tw-passagedata>
 *
 * Created by aimozg on 20.02.2023.
 */

module.exports = function(source) {

	let chunks = [];
	let pid = 1;

	function escapeXml(n) {
		return n.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}
	function processPassage(passage) {
		if (passage.special) return;
		chunks.push(`<tw-passagedata pid="${pid++}" name="${escapeXml(passage.name)}" tags="${escapeXml(passage.tags.join(" "))}">${escapeXml(passage.text)}</tw-passagedata>`);
	}

	function processScript(script) {
		chunks.push(`<script role="script" type="twine-user-script" type="text/twine-javascript">${script.text}</script>`);
	}

	for (let content of source) {
		switch (content.type) {
			case 'wiki':
				processPassage({
					type: 'passage',
					name: content.name,
					tags: content.tags,
					text: content.content.map(c=>c.text).join('')
				})
				break;
			case 'passage':
				processPassage(content);
				break;
			case 'script':
				processScript(content);
				break;
			default:
				throw new Error("Unexpected object "+content);
		}
	}

	return chunks.join('\n');
}
