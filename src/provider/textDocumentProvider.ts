import * as vscode from "vscode";
import * as https from "https";

import { codelensProvider } from "./codelensProvider";
import { candidateNum } from "../param/configures";
import {
    addSignal,
    andSignal,
    comment,
    hash,
    localeTag,
} from "../param/constparams";
import { getCommentSignal } from "../utils/commentCode";
import getDocumentLanguage from "../utils/getDocumentLanguage";
import { getGPTCode } from "../utils/getGPTCode";
import { getCodeCompletions } from "../utils/getCodeCompletions";
import { apiKey, apiSecret } from "../localconfig";

export function textDocumentProvider(
    myStatusBarItem: vscode.StatusBarItem,
    g_isLoading: boolean
) {
    const textDocumentProvider = new (class {
        async provideTextDocumentContent(uri: vscode.Uri) {
            const params = new URLSearchParams(uri.query);
            if (params.get("loading") === "true") {
                return `/* ${localeTag.generating} */\n`;
            }
            const mode = params.get("mode");

            if (mode === "translation") {
                let transResult = params.get("translation_res") || "";
                transResult = transResult
                    .replaceAll(addSignal, "+")
                    .replaceAll(andSignal, "&");
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    vscode.window.showInformationMessage(
                        localeTag.noEditorInfo
                    );
                    return;
                }
                codelensProvider.clearEls();
                let commandid = params.get("commandid") || "";
                let commentSignal = getCommentSignal(
                    editor.document.languageId
                );
                transResult = transResult
                    .replaceAll(hash, "#")
                    .replaceAll(comment, commentSignal.line || "#");
                codelensProvider.addEl(
                    0,
                    transResult,
                    commandid,
                    "translation"
                );
                return transResult;
            } else {
                let code_block = params.get("code_block") ?? "";

                try {
                    code_block = code_block
                        .replaceAll(hash, "#")
                        .replaceAll(addSignal, "+")
                        .replaceAll(andSignal, "&");
                    // 'lang': 'Python',
                    if (code_block.length > 1200) {
                        code_block = code_block.slice(code_block.length - 1200);
                    }
                    const editor = vscode.window.activeTextEditor;
                    if (!editor) {
                        vscode.window.showInformationMessage(
                            localeTag.noEditorInfo
                        );
                        return;
                    }
                    let payload = {};
                    const num = candidateNum;
                    let lang = getDocumentLanguage(editor);
                    if (lang.length == 0) {
                        payload = {
                            prompt: code_block,
                            n: num,
                            apikey: apiKey,
                            apisecret: apiSecret,
                        };
                    } else {
                        payload = {
                            lang: lang,
                            prompt: code_block,
                            n: num,
                            apikey: apiKey,
                            apisecret: apiSecret,
                        };
                    }
                    // }
                    const agent = new https.Agent({
                        rejectUnauthorized: false,
                    });
                    const { commandid, completions } = await getCodeCompletions(
                        code_block,
                        num,
                        lang,
                        apiKey,
                        apiSecret,
                        "interactive"
                    );
                    if (completions.length > 0) {
                        return getGPTCode(
                            completions,
                            commandid,
                            myStatusBarItem,
                            g_isLoading
                        );
                    } else {
                        return localeTag.noResult;
                    }
                } catch (err) {
                    console.log("Error sending request", err);
                    return `${localeTag.sendingRequestErr}\n` + err;
                }
            }
        }
    })();
    return textDocumentProvider;
}
