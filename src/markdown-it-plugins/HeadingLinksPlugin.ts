import type MarkdownIt from "markdown-it";
import type { RuleCore } from "markdown-it/lib/parser_core";
import type StateBlock from "markdown-it/lib/rules_block/state_block";
import type StateCore from "markdown-it/lib/rules_core/state_core";
import Token from "markdown-it/lib/token";
import { ParseResultType, parseDomain } from "parse-domain";

export default function heading_link_plugin(md: MarkdownIt): void {
    md.core.ruler.push('heading_link', parse);
}
function parse(state: StateCore): boolean {
    console.log(state)
    for (let i = 0; i < state.tokens.length; i++) {
        let currentToken = state.tokens[i];
        if (currentToken.type !== "heading_close") {
            continue;
        }
        // console.log(state.tokens.slice(i + 1));
        let blockquote_open_pos = state.tokens.slice(i + 1).findIndex((x) => x.type !== "html_block");
        if (blockquote_open_pos === -1) continue;
        let blockquote_open = state.tokens[i + blockquote_open_pos + 1];
        if (blockquote_open.type !== "blockquote_open") continue;

        let blockquote_close_pos = state.tokens.slice(i + 1).findIndex((x) => x.type === "blockquote_close");
        if (blockquote_close_pos === -1) continue;
        let blockquote_close = state.tokens[i + blockquote_close_pos + 1];
        if (blockquote_close.type !== "blockquote_close") continue;


        let offset = i + blockquote_open_pos + 2;
        let _links_pos = offset + 1;
        let links_pos = offset + 4;

        if (_links_pos >= state.tokens.length && links_pos >= state.tokens.length) continue;

        let _links = state.tokens[_links_pos];
        let links = state.tokens[links_pos];

        if (_links.content.toLowerCase() !== "_links") continue;

        state.tokens[_links_pos - 1].attrJoin("class", "heading-link-indicator");

        // remove subdomains...
        const domain_mappings: [string, boolean, string][] = [
            ["youtube.com", true, "/icons/heading-links/youtube.svg"],
            ["youtu.be", true, "/icons/heading-links/youtube.svg"],

            ["wikipedia.org", true, "/icons/heading-links/wikipedia.svg"],

            ["github.com", true, "/icons/heading-links/github.svg"],

            ["twitter.com", true, "/icons/heading-links/twitter.svg"],
            ["t.co", true, "/icons/heading-links/twitter.svg"],
            ["x.com", true, "/icons/heading-links/twitter.svg"],
            ["twitter.co", true, "/icons/heading-links/twitter.svg"],

            ["reddit.com", true, "/icons/heading-links/reddit.svg"],
            ["redd.it", true, "/icons/heading-links/reddit.svg"],
            ["redditblog.com", true, "/icons/heading-links/reddit.svg"],
        ]
        const file_mappings: [string, boolean, string][] = [
            ["md", false, "/icons/heading-links/markdown.svg"],

            ["pdf", false, "/icons/heading-links/pdf.svg"],

            ["doc", true, "/icons/heading-links/word.svg"],
            ["docm", true, "/icons/heading-links/word.svg"],
            ["docx", true, "/icons/heading-links/word.svg"],
            ["dot", true, "/icons/heading-links/word.svg"],
            ["dotx", true, "/icons/heading-links/word.svg"],

            ["pot", true, "/icons/heading-links/powerpoint.svg"],
            ["potm", true, "/icons/heading-links/powerpoint.svg"],
            ["potx", true, "/icons/heading-links/powerpoint.svg"],
            ["ppam", true, "/icons/heading-links/powerpoint.svg"],
            ["pps", true, "/icons/heading-links/powerpoint.svg"],
            ["ppsm", true, "/icons/heading-links/powerpoint.svg"],
            ["ppsx", true, "/icons/heading-links/powerpoint.svg"],
            ["ppt", true, "/icons/heading-links/powerpoint.svg"],
            ["pptm", true, "/icons/heading-links/powerpoint.svg"],
            ["pptx", true, "/icons/heading-links/powerpoint.svg"],

            ["xla", true, "/icons/heading-links/excel.svg"],
            ["xlam", true, "/icons/heading-links/excel.svg"],
            ["xll", true, "/icons/heading-links/excel.svg"],
            ["xlm", true, "/icons/heading-links/excel.svg"],
            ["xls", true, "/icons/heading-links/excel.svg"],
            ["xlsm", true, "/icons/heading-links/excel.svg"],
            ["xlsx", true, "/icons/heading-links/excel.svg"],
            ["xlt", true, "/icons/heading-links/excel.svg"],
            ["xltm", true, "/icons/heading-links/excel.svg"],
            ["xltx", true, "/icons/heading-links/excel.svg"],

            ["jpeg", false, "/icons/heading-links/image.svg"],
            ["jpg", false, "/icons/heading-links/image.svg"],
            ["png", false, "/icons/heading-links/image.svg"],
            ["gif", false, "/icons/heading-links/image.svg"],
            ["bmp", false, "/icons/heading-links/image.svg"],
            ["tiff", false, "/icons/heading-links/image.svg"],
            ["svg", false, "/icons/heading-links/image.svg"],

            ["3gp", false, "/icons/heading-links/audio.svg"],
            ["aa", false, "/icons/heading-links/audio.svg"],
            ["aac", false, "/icons/heading-links/audio.svg"],
            ["aax", false, "/icons/heading-links/audio.svg"],
            ["act", false, "/icons/heading-links/audio.svg"],
            ["aiff", false, "/icons/heading-links/audio.svg"],
            ["alac", false, "/icons/heading-links/audio.svg"],
            ["amr", false, "/icons/heading-links/audio.svg"],
            ["ape", false, "/icons/heading-links/audio.svg"],
            ["au", false, "/icons/heading-links/audio.svg"],
            ["awb", false, "/icons/heading-links/audio.svg"],
            ["dss", false, "/icons/heading-links/audio.svg"],
            ["dvf", false, "/icons/heading-links/audio.svg"],
            ["flac", false, "/icons/heading-links/audio.svg"],
            ["gsm", false, "/icons/heading-links/audio.svg"],
            ["iklax", false, "/icons/heading-links/audio.svg"],
            ["ivs", false, "/icons/heading-links/audio.svg"],
            ["m4a", false, "/icons/heading-links/audio.svg"],
            ["m4b", false, "/icons/heading-links/audio.svg"],
            ["m4p", false, "/icons/heading-links/audio.svg"],
            ["mnf", false, "/icons/heading-links/audio.svg"],
            ["movpkg", false, "/icons/heading-links/audio.svg"],
            ["mp3", false, "/icons/heading-links/audio.svg"],
            ["mpc", false, "/icons/heading-links/audio.svg"],
            ["nmf", false, "/icons/heading-links/audio.svg"],
            ["ogg", false, "/icons/heading-links/audio.svg"],
            ["oga", false, "/icons/heading-links/audio.svg"],
            ["mogg", false, "/icons/heading-links/audio.svg"],
            ["opus", false, "/icons/heading-links/audio.svg"],
            ["ra", false, "/icons/heading-links/audio.svg"],
            ["rm", false, "/icons/heading-links/audio.svg"],
            ["rf64", false, "/icons/heading-links/audio.svg"],
            ["sln", false, "/icons/heading-links/audio.svg"],
            ["tta", false, "/icons/heading-links/audio.svg"],
            ["voc", false, "/icons/heading-links/audio.svg"],
            ["vox", false, "/icons/heading-links/audio.svg"],
            ["wav", false, "/icons/heading-links/audio.svg"],
            ["wma", false, "/icons/heading-links/audio.svg"],
            ["wv", false, "/icons/heading-links/audio.svg"],

            ["mp4", false, "/icons/heading-links/video.svg"],
            ["mov", false, "/icons/heading-links/video.svg"],
            ["avi", false, "/icons/heading-links/video.svg"],
            ["wmv", false, "/icons/heading-links/video.svg"],
            ["avchd", false, "/icons/heading-links/video.svg"],
            ["webm", false, "/icons/heading-links/video.svg"],
            ["flv", false, "/icons/heading-links/video.svg"],


        ]


        if (links.children !== null) {
            let i = 0;
            while(i < links.children.length) {
                let x = links.children[i];
                if (x.type === "link_open") {
                    x.attrJoin("class", "heading-link-item")

                    let url = x.attrGet("href") || "/";
                    let uri = new URL(url, "http://localhost/");

                    let img = "";
                    let is_full_image = false;
                    let is_web = uri.hostname !== "localhost";
                    if (is_web) {
                        img = "/icons/heading-links/link.svg";
                        let domain = parseDomain(uri.hostname);
                        switch (domain.type) {
                            case ParseResultType.Listed || ParseResultType.Reserved:
                                let short_domain = `${domain.domain}.${domain.topLevelDomains.join(".")}`
                                let find = domain_mappings.find(([domain, is_full_image, url]) => domain === short_domain);
                                if (find !== undefined) {
                                    let [domain, ifi, url] = find;
                                    img = url;
                                    is_full_image = ifi;
                                }
                                break
                            default:
                                break
                        }
                    } else {
                        img = "/icons/heading-links/file.svg"
                        let path = uri.pathname;
                        let ext = path.split(".");
                        if (ext.length >= 1) {
                            let mapping = file_mappings.find((x) => x[0] === ext[ext.length - 1]);
                            if (mapping !== undefined) {
                                let [ext, ifi, url] = mapping;
                                img = url;
                                is_full_image = ifi;
                            }
                        }
                    }
                    if (is_full_image) {
                        x.attrJoin("class", "full-image")
                        x.attrSet("style", `--background: url(${img})`)
                    } else {
                        x.attrJoin("class", "mask-image")
                        x.attrSet("style", `--background: url(${img})`)
                    }
                    x.attrSet("img-source", img);

                    let text = links.children[i + 1];
                    if(text.type === "link_close") { // no text
                        if(!is_web) {
                            let url = x.attrGet("href") || "/";
                                url = url.replace("\\", "/");
                            let uri = new URL(url, "http://localhost/");
                            let filename_arr = uri.pathname.split("/");
                            if(filename_arr.length > 0) {
                                let filename = filename_arr[filename_arr.length -1];
                                if(filename.trim() !== "") {
                                    let token = new Token("text", "", 0);
                                    token.content = filename;
                                    links.children.splice(i + 1, 0, token);
                                }
                            }
                        }
                    }
                }
                i++;
            }
        }
        blockquote_open.attrJoin("class", "heading-link-blockquote");
    }
    return true
}
function scan_token(token_type: string, tokens: Token[]): [Token, number] | undefined {

    return undefined
}