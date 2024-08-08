import { convertFileSrc } from "@tauri-apps/api/tauri";
import type MarkdownIt from "markdown-it/lib"
import type StateCore from "markdown-it/lib/rules_core/state_core"
import { concat_paths } from "../lib/FileUtils";


interface ImagePluginOptions {
    workspace: string
}

/**
 * An image plugin that translates the image path to an tauri asset path
 * Also adds an image size attribute
 */
export default function image_plugin(md: MarkdownIt, opts: ImagePluginOptions): void {
    var defaultRender = md.renderer.rules.image || this.defaultRender;
    md.renderer.rules.image = function(tokens, idx, options, env, self) {

        let image = tokens[idx];
        let href = image.attrGet("src") || "";
        let url = new URL(href, "https://localhost/");

        if (url.hostname === "localhost") {
            let path = concat_paths(opts.workspace, url.pathname);
            let src = convertFileSrc(path);
            image.attrSet("src", src);
        }
        if (image.content != null) {
            let sizes = /=(\d*)x(\d*)$/gm.exec(image.content);
            if (sizes != null) {
                if (sizes[1] != null) {
                    image.attrSet("width", sizes[1]);
                }
                if (sizes[2] != null) {
                    image.attrSet("heigth", sizes[2]);
                }
            }
        }
        // pass token to default renderer.
        return defaultRender(tokens, idx, options, env, self);
    };
}
image_plugin.defaultRender = function(
    tokens: any,
    idx: any,
    options: any,
    env: any,
    self: any,
) {
    return self.renderToken(tokens, idx, options);
};
