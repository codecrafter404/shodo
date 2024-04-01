import type MarkdownIt from "markdown-it/lib"
import type StateCore from "markdown-it/lib/rules_core/state_core"

/**
 * An link plugin that adds a target = _blank to all external links
 */
export default function link_plugin(md: MarkdownIt): void {
    var defaultRender = md.renderer.rules.link_open || this.defaultRender;
    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {

        let link = tokens[idx];
        let href = link.attrGet("href") || "";
        let url = new URL(href, "https://localhost/");

        if (url.hostname !== "localhost") {
            tokens[idx].attrSet("target", "_blank");
        }
        // pass token to default renderer.
        return defaultRender(tokens, idx, options, env, self);
    };
}
link_plugin.defaultRender = function (
    tokens: any,
    idx: any,
    options: any,
    env: any,
    self: any,
) {
    return self.renderToken(tokens, idx, options);
};