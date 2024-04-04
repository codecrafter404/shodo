<script lang="ts">
  import MarkdownReader from "./components/MarkdownReader.svelte";
  import TreeNode from "./components/TreeNode.svelte";

  let node: FileTreeNode = {
    name: "hello",
    icon: "/icons/folder.svg",
    path: "/",
    children: [
      {
        name: "world",
        icon: "/icons/folder.svg",
        path: "/world/",
        children: [
          {
            name: "world",
            icon: "/icons/folder.svg",
            path: "/world/",
            children: [
              {
                name: "world",
                icon: "/icons/folder.svg",
                path: "/world/",
                children: [],
              },
            ],
          },
        ],
      },
      {
        name: "world",
        icon: "/icons/folder.svg",
        path: "/world/",
        children: [
          {
            name: "world",
            icon: "/icons/folder.svg",
            path: "/world/",
            children: [
              {
                name: "world",
                icon: "/icons/folder.svg",
                path: "/world/",
                children: [],
              },
            ],
          },
        ],
      },
      {
        name: "world",
        icon: "/icons/folder.svg",
        path: "/world/",
        children: [
          {
            name: "world",
            icon: "/icons/folder.svg",
            path: "/world/",
            children: [
              {
                name: "world",
                icon: "/icons/folder.svg",
                path: "/world/",
                children: [],
              },
            ],
          },
        ],
      },
      {
        name: "world",
        icon: "/icons/folder.svg",
        path: "/world/",
        children: [
          {
            name: "world",
            icon: "/icons/folder.svg",
            path: "/world/",
            children: [
              {
                name: "world",
                icon: "/icons/folder.svg",
                path: "/world/",
                children: [],
              },
            ],
          },
        ],
      },
    ],
  };
</script>

<!-- <MarkdownReader /> -->
<TreeNode {node} />

<style>
</style>
