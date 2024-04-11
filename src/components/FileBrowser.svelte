<script lang="ts">
    import { get_workspace, load_files } from "../lib/FileLoader";
    import { concat_paths } from "../lib/FileUtils";
    import { file_logo, file_mappings, folder_logo } from "../lib/Mappings";

    async function list(): Promise<[string, boolean, string][]> {
        let base = await get_workspace();
        let path = window.location.pathname;
        let file = concat_paths(base, path);
        let files = await load_files(file);
        let res: [string, boolean, string][] = files.map(
            ([file, is_folder]) => {
                if (is_folder) {
                    return [file, false, folder_logo];
                }
                let ext = file.split(".");
                if (ext.length >= 1) {
                    let e = ext[ext.length - 1];
                    let mapping = file_mappings.find((x) => x[0] === e);
                    if (mapping !== undefined) {
                        return [file, mapping[1], mapping[2]];
                    } else {
                        return [file, false, file_logo];
                    }
                } else {
                    return [file, false, file_logo];
                }
            },
        );
        return res;
    }
</script>

<div class="">
    {#await list()}
        <p>Loading files</p>
    {:then list}
        <ul>
            {#each list as listing}
                <li>
                    <a
                        href={concat_paths(
                            document.location.pathname,
                            listing[0],
                        )}
                        class={listing[1] ? "full-image" : "mask-image"}
                        style={`--icon: url(${listing[2]})`}>{listing[0]}</a
                    >
                </li>
            {/each}
        </ul>
    {:catch e}
        <p>{e}</p>
    {/await}
</div>

<style lang="scss">
    .mask-image::before,
    .full-image::before {
        content: "";
        padding-left: 1.4rem;
        margin-right: 0.25rem;
    }
    .mask-image {
        &::before {
            background-color: var(--primary-accent-color);
            mask-image: var(--icon);
            mask-size: contain;
            mask-repeat: no-repeat;
            mask-position: center center;
        }
    }

    .full-image {
        &::before {
            background-image: var(--icon);
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center center;
        }
    }
</style>
