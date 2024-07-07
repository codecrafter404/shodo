<script lang="ts">
    import MarkdownIt from "markdown-it";
    import multimdTable from "markdown-it-multimd-table";
    import highlightjs from "markdown-it-highlightjs";
    import ancher from "markdown-it-anchor";
    import "../../public/katex/katex.css";
    import link_plugin from "../markdown-it-plugins/LinkPlugin";
    import mermaid_plugin from "../markdown-it-plugins/MermaidPlugin";
    import mermaid from "mermaid";
    import { afterUpdate, onDestroy } from "svelte";
    import katex_plugin from "../markdown-it-plugins/KatexPlugin";
    import image_plugin from "../markdown-it-plugins/ImagePlugin";
    import heading_link_plugin from "../markdown-it-plugins/HeadingLinksPlugin";
    import type { MouseEventHandler } from "svelte/elements";
    import { open } from "@tauri-apps/api/shell";
    import { dialog } from "@tauri-apps/api";
    import { message } from "@tauri-apps/api/dialog";
    import { concat_paths } from "../lib/FileUtils";

    // print optimization
    window.document.title = "‎";

    function on_key_press(event: KeyboardEvent) {
        if (event.ctrlKey && event.code == "KeyP") {
            event.preventDefault();
            let url = window.location.href.slice(window.location.origin.length);
            history.replaceState(history.state, "", "/");
            print();
            history.replaceState(history.state, "", url);
        }
    }
    window.document.documentElement.addEventListener("keydown", on_key_press);

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
        let link = target.getAttribute("href") || "/";
        let file = concat_paths(workspace, link);
        // console.log(file);
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
    afterUpdate(() => {
        if (window.location.hash !== "") {
            let elem = document.querySelector(window.location.hash);
            if (elem != null) {
                elem.scrollIntoView();
            }
        }
        let current_pos = window.location;
        setTimeout(() => {
            if (current_pos === window.location) {
                let pos = sessionStorage.getItem("scrollpos");
                if (pos !== null) {
                    window.scrollTo(0, parseInt(pos));
                }
            }
        }, 300); //TODO: not hardcode
    });
    onDestroy(() => {
        window.document.documentElement.removeEventListener(
            "keydown",
            on_key_press,
        );
    });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="markdown-body" on:click={on_click}>
    {@html renderedMarkdown}
</div>

<style>
</style>
