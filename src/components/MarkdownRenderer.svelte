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
</script>

<div class="markdown-body">
    {@html renderedMarkdown}
</div>

<style>
</style>
