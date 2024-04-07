import type MarkdownIt from "markdown-it/lib"
import type StateCore from "markdown-it/lib/rules_core/state_core"
import { normalize_path } from "../lib/FileUtils";

/**
 * An link plugin that adds a target = _blank to all external links
 */
export default function link_plugin(md: MarkdownIt): void {
    var defaultRender = md.renderer.rules.link_open || this.defaultRender;
    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        let link = tokens[idx];
        let href = link.attrGet("href") || "";
            href = normalize_path(href);
        let url = new URL(href, "https://localhost/");

        const http_schemes = ["http:", "https:"];
        if (url.hostname !== "localhost" && http_schemes.includes(url.protocol)) {
            tokens[idx].attrSet("target", "_blank");
        }else if(url.search === "" && http_schemes.includes(url.protocol) && !url.pathname.endsWith(".md") && url.pathname !== "/") {
            tokens[idx].attrSet("open", "app");
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