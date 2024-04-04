<script lang="ts">
    import { getMatches } from "@tauri-apps/api/cli";
    import MarkdownRenderer from "./MarkdownRenderer.svelte";
    import { getFileLocation, loadFile } from "../lib/FileLoader";

    async function getMarkdonwn(): Promise<[string, string]> {
        let [file, base] = await getFileLocation();
        let content = await loadFile(file);
        return [content, base];
    }
</script>

<main class="container">
    {#await getMarkdonwn()}
        <!-- promise is pending -->
        <p>Loading...</p>
    {:then [content, workspace]}
        <!-- promise was fulfilled -->
        <MarkdownRenderer markdown_text={content} {workspace} />
    {:catch error}
        <!-- promise was rejected -->
        <p>{error}</p>
    {/await}
</main>

<style>
    .container {
        margin: auto;
    }
</style>
