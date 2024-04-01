import type MarkdownIt from "markdown-it/lib"
import type StateCore from "markdown-it/lib/rules_core/state_core"

/**
 * An mermaid plugin that adds a div with class mermaid around the code block
 */
export default function mermaid_plugin(md: MarkdownIt): void {
    var defaultRender = md.renderer.rules.fence || this.defaultRender;
	md.renderer.rules.fence = (tokens, idx, options, env, self) => {
		const token = tokens[idx];
		if (token.info === 'mermaid') {
			const code = token.content.trim();
			return `<pre class="mermaid">${code}</pre>`;
		}
		
		// Other languages
		return defaultRender(tokens, idx, options, env, self);
	};
}
mermaid_plugin.defaultRender = function (
    tokens: any,
    idx: any,
    options: any,
    env: any,
    self: any,
) {
    return self.renderToken(tokens, idx, options);
};