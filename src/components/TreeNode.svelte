<script lang="ts">
    export let node: FileTreeNode;
    export let level: number = 0;
</script>

<div class="pl-6">
    <details open>
        <summary class="cursor-pointer flex">
            <img src={node.icon} alt={node.icon} />
            <span>{node.name}</span>
        </summary>
        {#if node.children}
            <div>
                {#each node.children as child}
                    <div>
                        <svelte:self node={child} level={level + 1}/>
                    </div>
                {/each}
            </div>
        {/if}
    </details>
</div>

<style style="scss">
    details > summary {
        list-style: none;
    }
</style>
