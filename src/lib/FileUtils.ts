
export function normalize_path(path: string): string {
    return path.replaceAll("\\", "/");
}
export function concat_paths(p1: string, p2: string): string{
    p1 = normalize_path(p1);
    p2 = normalize_path(p2);
    if(!p1.endsWith("/")) {
        p1 += "/";
    }
    if(p2.startsWith("/")) {
        p2 = p2.slice(1);
    }
    return p1 + p2
}