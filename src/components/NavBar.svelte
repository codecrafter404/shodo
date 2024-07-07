<script lang="ts">
    import {
        apply_color_scheme,
        is_darkmode,
        switch_darkmode,
    } from "../lib/ColorUtil";
    import { normalize_path } from "../lib/FileUtils";
    let darkmode = is_darkmode();
    function darkmode_switch() {
        darkmode = switch_darkmode();
        apply_color_scheme();
    }
    let path = normalize_path(document.location.pathname);
    path = `root${path}`;
    let segments = path.split("/");
    function navigate(event: PointerEvent) {
        let target = event.target as HTMLSpanElement;
        let i = +(target.getAttribute("pos") || "0");
        i += 1;
        let path = segments.slice(0, i).join("/");
        path = path.substring("root".length);
        if (path === "") path = "/";
        document.location.pathname = path;
    }
    enum PrintMode {
        pdf = "pdf",
        paper = "",
    }
    let current_print_mode: PrintMode = PrintMode.pdf;
    function alternate_print_modes() {
        let modes = [PrintMode.paper, PrintMode.pdf];
        let cidx = modes.findIndex((x) => x == current_print_mode);
        if (cidx + 1 >= modes.length) {
            cidx = 0;
        } else {
            cidx++;
        }
        if (current_print_mode != "") {
            document.documentElement.classList.remove(current_print_mode);
        }
        current_print_mode = modes[cidx];
        if (current_print_mode != "") {
            document.documentElement.classList.add(current_print_mode);
        }
    }
</script>

<div
    class="w-full flex justify-between px-10 py-1 bg-secondary-background items-center nav-bar"
>
    <div class="">
        <img src="/logo.svg" alt="" class="max-h-[4rem]" />
    </div>
    <div class="">
        {#each segments as segment, i}
            <span>/</span>
            <span
                class="text-primary-accent cursor-pointer hover:underline"
                pos={i}
                on:click={navigate}>{segment}</span
            >
            <span> </span>
        {/each}
    </div>
    <div class="flex space-x-2">
        <div class="relative">
            <button
                class="p-2 rounded-[.25rem] button bg-opacity-10 button"
                title="Switch between print modes (PDF/Paper)"
                on:click={alternate_print_modes}
            >
                <div
                    class="scheme-icon"
                    style="--icon: url({current_print_mode == PrintMode.paper
                        ? '/icons/print-mode-selection/printer.svg'
                        : '/icons/print-mode-selection/file-type-pdf.svg'})"
                ></div>
            </button>
        </div>
        <button
            class="p-2 rounded-[.25rem] button bg-opacity-10"
            on:click={darkmode_switch}
        >
            <div
                style="--icon: url({darkmode
                    ? '/icons/color-scheme/moon.svg'
                    : '/icons/color-scheme/sun.svg'})"
                class="scheme-icon"
            ></div>
        </button>
    </div>
</div>

<style lang="scss">
    .button {
        --transparency: 6.25%;
        background-color: color-mix(
            in srgb,
            var(--secondary-accent-color) var(--transparency, 100%),
            transparent
        );
    }
    .button:hover {
        --transparency: 12.5%;
        background-color: color-mix(
            in srgb,
            var(--secondary-accent-color) var(--transparency, 100%),
            transparent
        );
    }
    .scheme-icon {
        background-color: var(--primary-accent-color);
        mask-image: var(--icon); //var(--icon);
        mask-size: contain;
        mask-repeat: no-repeat;
        mask-position: center center;
        width: 1.4rem;
        height: 1.4rem;
    }
</style>
