<script lang="ts">
  import MarkdownRenderer from "./components/MarkdownRenderer.svelte";
  import { loadFile } from "./lib/FileLoader";
</script>

<main class="container">
  {#await loadFile("test.md")}
    <!-- promise is pending -->
    <p>Loading...</p>
  {:then content}
    <!-- promise was fulfilled -->
    <MarkdownRenderer markdown_text={content} />
  {:catch error}
    <!-- promise was rejected -->
    <p>{error}</p>
  {/await}

  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
  </script>
</main>

<style>
  .container {
    margin: auto;
  }
</style>
