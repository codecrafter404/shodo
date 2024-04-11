import { fs } from "@tauri-apps/api"
import { getMatches } from "@tauri-apps/api/cli";
import { normalize_path } from "./FileUtils";
// import { BaseDirectory } from "@tauri-apps/api/fs"

interface FileLoader {
    getFileForPath(path: string): Promise<string>
    listDirectory(path: string): Promise<[string, boolean][]>
}
class LocalFileLoader implements FileLoader {
    async getFileForPath(path: string): Promise<string> {
        let content = await fs.readTextFile(`${path}`)
        // let content = await fs.readTextFile(`${path}`,{dir: BaseDirectory.Document})
        return content;
    }
    async listDirectory(path: string): Promise<[string, boolean][]> {
        let content = await fs.readDir(path);
        let res: [string, boolean][] = content.map((x)=>[x.name || "", x.children !== undefined]);
        return res;
    }
}

export async function loadFile(path: string): Promise<string> {
    let fileLoader = new LocalFileLoader();
    let content = await fileLoader.getFileForPath(path);
    return content;
}
export async function load_files(path: string): Promise<[string, boolean][]> {
    let fileLoader = new LocalFileLoader();
    let content = await fileLoader.listDirectory(path);
    return content;
}
export async function get_workspace(): Promise<string> {
    let matches = await getMatches();
    let base = matches.args["path"].value?.toString() || "";
    return normalize_path(base);
}