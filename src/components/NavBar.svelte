<script lang="ts">
    import {apply_color_scheme, is_darkmode, switch_darkmode} from "../lib/ColorUtil";
    import { normalize_path } from "../lib/FileUtils";
    let darkmode = is_darkmode();
    function darkmode_switch() {
        darkmode = switch_darkmode();
        apply_color_scheme();
    }
    let path = normalize_path(document.location.pathname);
        path = `root${path}`
    let segments = path.split("/");
    function navigate(event: PointerEvent) {
        let target = event.target as HTMLSpanElement;
        let i = +(target.getAttribute("pos") || "0");
            i += 1;
        let path = segments.slice(0, i).join("/");
            path = path.substring("root".length)
        if(path === "") path = "/";
        document.location.pathname = path;
    }
</script>

<div
    class="w-full flex justify-between px-10 py-1 bg-secondary-background items-center"
>
    <div class="">
        <img src="/logo.svg" alt="" class="max-h-[4rem]"/>
    </div>
    <div class="">
        {#each segments as segment, i}
            <span>/</span>
            <span class="text-primary-accent cursor-pointer hover:underline" pos={i} on:click={navigate}>{segment}</span>
            <span> </span>
        {/each}
    </div>
    <div>
        <button class="p-2 rounded-[.25rem] button bg-opacity-10" id="button" on:click={darkmode_switch}>
            <div
                style="--icon: url({darkmode
                    ? '/icons/color-scheme/moon.svg'
                    : '/icons/color-scheme/sun.svg'})"
                id="scheme-icon"
            ></div>
        </button>
    </div>
</div>

<style lang="scss">
    #button {
        --transparency: 6.25%;
        background-color: color-mix(
            in srgb,
            var(--secondary-accent-color) var(--transparency, 100%),
            transparent
        );
    }
    #button:hover {
        --transparency: 12.5%;
        background-color: color-mix(
            in srgb,
            var(--secondary-accent-color) var(--transparency, 100%),
            transparent
        );
    }
    #scheme-icon {
        background-color: var(--primary-accent-color);
        mask-image: var(--icon); //var(--icon);
        mask-size: contain;
        mask-repeat: no-repeat;
        mask-position: center center;
        width: 1.4rem;
        height: 1.4rem;
    }
</style>
