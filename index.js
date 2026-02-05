const merge = require('lodash.merge');

let clipboard = null;
try {
	// Node js will throw an error
	this === window;

	const Clipboard = require('clipboard');
	clipboard = new Clipboard('.markdown-it-code-copy');
}
catch (_err) {
}

const defaultOptions = {
	iconStyle: 'font-size: 21px; opacity: 0.4;',
	iconClass: 'mdi mdi-content-copy',
	buttonStyle: 'position: absolute; top: 7.5px; right: 6px; cursor: pointer; outline: none;',
	buttonClass: '',
	element: '',
	removeEndNewline: false
};

function renderCode(origRule, options) {
	options = merge(defaultOptions, options);
	return (...args) => {
		const [tokens, idx] = args;
		let content = tokens[idx].content
			.replaceAll('"', '&quot;')
			.replaceAll("'", "&apos;");

		if (options.removeEndNewline === true) {
			content = content.replace(/(\r\n|\n|\r)+$/, '');
		}

		const origRendered = origRule(...args);

		if (content.length === 0)
			return origRendered;

		return `
<div style="position: relative">
	${origRendered}
	<button class="markdown-it-code-copy ${options.buttonClass}" data-clipboard-text="${content}" style="${options.buttonStyle}" title="Copy">
		<span style="${options.iconStyle}" class="${options.iconClass}">${options.element}</span>
	</button>
</div>
`;
	};
}

module.exports = (md, options) => {
	if (clipboard) {
		if (options.onSuccess) {
			clipboard.on("success", options.onSuccess);
		}
		if (options.onError) {
			clipboard.on("error", options.onError);
		}
	}
	md.renderer.rules.code_block = renderCode(md.renderer.rules.code_block, options);
	md.renderer.rules.fence = renderCode(md.renderer.rules.fence, options);
};
