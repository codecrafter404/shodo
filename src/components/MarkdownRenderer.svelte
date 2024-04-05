<script lang="ts">
    import MarkdownIt from "markdown-it";
    import multimdTable from "markdown-it-multimd-table";
    import highlightjs from "markdown-it-highlightjs";
    import ancher from "markdown-it-anchor";
    import "../markdown.scss";
    import "../../public/katex/katex.css";
    import link_plugin from "../markdown-it-plugins/LinkPlugin";
    import mermaid_plugin from "../markdown-it-plugins/MermaidPlugin";
    import mermaid from "mermaid";
    import { afterUpdate } from "svelte";
    import katex_plugin from "../markdown-it-plugins/KatexPlugin";
    import image_plugin from "../markdown-it-plugins/ImagePlugin";
    import heading_link_plugin from "../markdown-it-plugins/HeadingLinksPlugin";
    import type { MouseEventHandler } from "svelte/elements";
    import { open } from "@tauri-apps/api/shell";
    import { dialog } from "@tauri-apps/api";
    import { message } from "@tauri-apps/api/dialog";

    const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
    });
    md.use(multimdTable, {
        multiline: true,
        rowspan: true,
        headerless: true,
        multibody: true,
        aotolabel: true,
    });
    md.use(highlightjs, { inline: true, auto: true, ignoreIllegals: true });
    md.use(ancher, {});
    md.use(link_plugin);
    md.use(mermaid_plugin);
    md.use(katex_plugin, {});
    export let workspace = "";
    md.use(image_plugin, { workspace: workspace });
    md.use(heading_link_plugin, {});

    export let markdown_text = "";
    let renderedMarkdown = md.render(markdown_text);

    afterUpdate(() => {
        mermaid.initialize({
            startOnLoad: false,
            flowchart: {
                useMaxWidth: true,
            },
        });
        mermaid.run();
    });
    async function on_click(event: PointerEvent) {
        let target = event.target as HTMLElement;
        // event.preventDefault();
        // console.log(event);

        if (target.getAttribute("open") !== "app" || target.nodeName !== "A") {
            if (
                target.parentElement !== null &&
                target.parentElement.getAttribute("open") === "app" &&
                target.parentElement.nodeName === "A"
            ) {
                target = target.parentElement;
            } else {
                return;
            }
        }
        event.preventDefault();
        let path = workspace.replaceAll("\\", "/");
        if (!path.endsWith("/")) {
            path = `${path}/`;
        }
        let link = (target.getAttribute("href") || "/").replaceAll("\\", "/");

        if (link.startsWith("/")) {
            link = link.slice(1);
        }
        let file = path + link;
        console.log(file);
        try {
            await open(file);
        } catch (e: any) {
            console.log(e);
            await message("The file doesn't seem to exist anymore :(", {
                title: "File not found",
                type: "error",
            });
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="markdown-body" on:click={on_click}>
    {@html renderedMarkdown}
</div>

<style>
</style>
