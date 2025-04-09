const merge = require('lodash.merge');
const Clipboard = require("clipboard");
const {v4: uuidv4} = require('uuid');
const defaultOptions = {
    iconStyle: 'font-size: 21px; opacity: 0.4;',
    iconClass: 'mdi mdi-content-copy',
    buttonStyle: 'position: absolute; top: 7.5px; right: 6px; cursor: pointer; outline: none;',
    buttonClass: '',
    element: ''
};

function renderCode(origRule, options, id) {
    options = merge(defaultOptions, options);
    return (...args) => {
        const [tokens, idx] = args;
        const content = tokens[idx].content
            .replaceAll('"', '&quot;')
            .replaceAll("'", "&apos;");
        const origRendered = origRule(...args);

        if (content.length === 0)
            return origRendered;

        return `
<div style="position: relative">
	${origRendered}
	<button class="markdown-it-code-copy binding-${id} ${options.buttonClass}" data-clipboard-text="${content}" style="${options.buttonStyle}" title="Copy">
		<span style="${options.iconStyle}" class="${options.iconClass}">${options.element}</span>
	</button>
</div>
`;
    };
}

module.exports = (md, options) => {
    let clipboard = null;
    let id = uuidv4();
    try {
        // Node js will throw an error
        this === window;

        const Clipboard = require('clipboard');
        clipboard = new Clipboard('.markdown-it-code-copy.binding-' + id);
    } catch (_err) {
    }
    if (clipboard) {
        if (options.onSuccess) {
            clipboard.on("success", options.onSuccess);
        }
        if (options.onError) {
            clipboard.on("error", options.onError);
        }
    }

    md.renderer.rules.code_block = renderCode(md.renderer.rules.code_block, options, id);
    md.renderer.rules.fence = renderCode(md.renderer.rules.fence, options, id);
};
