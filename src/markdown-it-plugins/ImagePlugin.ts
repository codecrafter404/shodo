import { convertFileSrc } from "@tauri-apps/api/tauri";
import type MarkdownIt from "markdown-it/lib"
import type StateCore from "markdown-it/lib/rules_core/state_core"


interface ImagePluginOptions{
    workspace: string
}

/**
 * An image plugin that translates the image path to an tauri asset path
 */
export default function image_plugin(md: MarkdownIt, opts: ImagePluginOptions): void {
    var defaultRender = md.renderer.rules.image || this.defaultRender;
    md.renderer.rules.image = function (tokens, idx, options, env, self) {

        let image = tokens[idx];
        let href = image.attrGet("src") || "";
        let url = new URL(href, "https://localhost/");
        console.log(url);

        if (url.hostname === "localhost") {
            let path = opts.workspace + url.pathname;
            let src = convertFileSrc(path);
            image.attrSet("src", src);
        }
        // pass token to default renderer.
        return defaultRender(tokens, idx, options, env, self);
    };
}
image_plugin.defaultRender = function (
    tokens: any,
    idx: any,
    options: any,
    env: any,
    self: any,
) {
    return self.renderToken(tokens, idx, options);
};