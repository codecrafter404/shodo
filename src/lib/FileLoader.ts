import { fs } from "@tauri-apps/api"
import { getMatches } from "@tauri-apps/api/cli";
// import { BaseDirectory } from "@tauri-apps/api/fs"

interface FileLoader {
    getFileForPath(path: string): Promise<string>
}
class LocalFileLoader implements FileLoader {
    async getFileForPath(path: string): Promise<string> {
        let content = await fs.readTextFile(`${path}`)
        // let content = await fs.readTextFile(`${path}`,{dir: BaseDirectory.Document})
        return content;
    }
}

export async function loadFile(path: string): Promise<string> {
    let fileLoader = new LocalFileLoader();
    let content = await fileLoader.getFileForPath(path);
    return content;
}