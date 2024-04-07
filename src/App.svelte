<script lang="ts">
  import { getMatches } from "@tauri-apps/api/cli";
  import MarkdownRenderer from "./components/MarkdownRenderer.svelte";
  import { loadFile } from "./lib/FileLoader";
    import { apply_color_scheme } from "./lib/ColorUtil";
    import { concat_paths } from "./lib/FileUtils";
  // color scheme
  apply_color_scheme();


  async function getMarkdonwn(): Promise<[string, string]> {
    let matches = await getMatches();
    let base = matches.args["path"].value?.toString() || "";
    let path = window.location.pathname;
    let file = concat_paths(base, path);
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
