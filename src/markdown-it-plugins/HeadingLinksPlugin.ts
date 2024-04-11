import type MarkdownIt from "markdown-it";
import type { RuleCore } from "markdown-it/lib/parser_core";
import type StateBlock from "markdown-it/lib/rules_block/state_block";
import type StateCore from "markdown-it/lib/rules_core/state_core";
import Token from "markdown-it/lib/token";
import { ParseResultType, parseDomain } from "parse-domain";
import { normalize_path } from "../lib/FileUtils";
import { domain_mappings, file_logo, file_mappings, link_logo, protocol_mappings } from "../lib/Mappings";

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


        if (links.children !== null) {
            let i = 0;
            while (i < links.children.length) {
                let x = links.children[i];
                if (x.type === "link_open") {
                    x.attrJoin("class", "heading-link-item")

                    let url = x.attrGet("href") || "/";
                    let uri = new URL(url, "http://localhost/");

                    let img = "";
                    let is_full_image = false;
                    let is_web = uri.hostname !== "localhost";
                    let proto = protocol_mappings.find((x) => x[0] === uri.protocol);

                    if (proto !== undefined) {
                        img = proto[2];
                        is_full_image = proto[1];
                        console.log(uri);
                    } else if (is_web) {
                        img = link_logo;
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
                        img = file_logo;
                        let path = normalize_path(uri.pathname);
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
                    if (text.type === "link_close") { // no text
                        if (!is_web || (proto !== undefined)) {
                            let url = x.attrGet("href") || "/";
                                url = normalize_path(url);
                            let uri = new URL(url, "http://localhost/");
                            let filename_arr = uri.pathname.split("/");
                            if (filename_arr.length > 0) {
                                let filename = filename_arr[filename_arr.length - 1];
                                filename = decodeURIComponent(filename);
                                if (filename.trim() !== "") {
                                    let token = new Token("text", "", 0);
                                    token.content = filename;
                                    links.children.splice(i + 1, 0, token);
                                }
                            }
                        } else if (is_web) {
                            let token = new Token("text", "", 0);
                            token.content = url;
                            links.children.splice(i + 1, 0, token);
                        }
                    } else if (text.type === "text") {
                        if (proto !== undefined) {
                            let url = x.attrGet("href") || "/";
                            url = url.replaceAll("\\", "/");
                            let uri = new URL(url, "http://localhost/");
                            let files = uri.pathname.split("/");
                            if (files.length > 0) {
                                let name = files[files.length - 1];
                                name = decodeURIComponent(name);
                                text.content = name;
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