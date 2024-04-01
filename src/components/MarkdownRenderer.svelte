<script lang="ts">
    import MarkdownIt from "markdown-it";
    import multimdTable from "markdown-it-multimd-table";
    import highlightjs from "markdown-it-highlightjs";
    import ancher from "markdown-it-anchor";
    import "../markdown.scss";
    import link_plugin from "../markdown-it-plugins/LinkPlugin";
    import mermaid_plugin from "../markdown-it-plugins/MermaidPlugin";
    import mermaid from "mermaid";
    
    


    const md = new MarkdownIt();
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
    export let markdown_text = "";
    let renderedMarkdown = md.render(markdown_text);

</script>

<div class="markdown-body">
    {@html renderedMarkdown}
</div>

<style>
</style>
