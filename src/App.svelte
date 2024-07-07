<script lang="ts">
  import { getMatches } from "@tauri-apps/api/cli";
  import MarkdownRenderer from "./components/MarkdownRenderer.svelte";
  import { get_workspace, loadFile } from "./lib/FileLoader";
  import { apply_color_scheme } from "./lib/ColorUtil";
  import { concat_paths } from "./lib/FileUtils";
  import "./main_style.scss";
  import NavBar from "./components/NavBar.svelte";
  import FileBrowser from "./components/FileBrowser.svelte";
  import { apply_print_mode } from "./lib/PrintModeUtils";
  // color scheme
  apply_color_scheme();
  apply_print_mode();

  async function getMarkdonwn(): Promise<[string, string]> {
    let base = await get_workspace();
    let path = window.location.pathname;
    let file = concat_paths(base, path);
    let content = await loadFile(file);
    return [content, base];
  }
</script>

<div>
  <NavBar />
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
      <FileBrowser />
    {/await}
  </main>
</div>

<style>
  .container {
    margin: auto;
  }
</style>
