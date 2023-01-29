import * as vscode from "vscode";
import { getCodeCompletions } from "./getCodeCompletions";
import getDocumentLanguage from "./getDocumentLanguage";
import { localeTag } from "../param/constparams";
import { updateStatusBarItem } from "./updateStatusBarItem";
import { apiKey, apiSecret } from "../localconfig";

export default async function codeGenByTemplate(
    editor: vscode.TextEditor,
    templateStr: string,
    myStatusBarItem: vscode.StatusBarItem,
    g_isLoading: boolean
) {
    let prompt_input = "";
    let document = editor.document;
    let sel = editor.selections;
    for (var x = 0; x < sel.length; x++) {
        let txt: string = document.getText(
            new vscode.Range(sel[x].start, sel[x].end)
        );
        prompt_input += txt;
    }
    var selection = editor.selection;
    let rs: any;
    let prompt = "";
    let lang = "";
    try {
        let promptInputArr = prompt_input.split("\n");
        const re = /<INPUT(:.+)?>/g;
        let iter = re.exec(templateStr);
        prompt = templateStr;
        while (iter) {
            if (iter[0] == "<INPUT>") {
                prompt = prompt.replace(iter[0], prompt_input);
            } else if (iter[0].indexOf(":") != -1) {
                if (iter[0].indexOf(",") != -1) {
                    let rangeStr = iter[0].split(":")[1];
                    rangeStr = rangeStr.slice(0, -1);
                    let fromLine = Number(rangeStr.split(",")[0]);
                    let toLine = Number(rangeStr.split(",")[1]);
                    prompt = prompt.replace(
                        iter[0],
                        promptInputArr.slice(fromLine, toLine).join("\n")
                    );
                } else {
                    let rangeStr = Number(iter[0].split(":")[1].slice(0, -1));
                    prompt = prompt.replace(
                        iter[0],
                        promptInputArr.slice(rangeStr).join("\n")
                    );
                }
            } else {
                vscode.window.showInformationMessage(
                    localeTag.errorInInputMarkup
                );
                return;
            }
            iter = re.exec(templateStr);
        }
        console.log("about to request");
        lang = getDocumentLanguage(editor);
        updateStatusBarItem(myStatusBarItem, g_isLoading, true, "");
        rs = await getCodeCompletions(
            prompt,
            1,
            lang,
            apiKey,
            apiSecret,
            "prompt"
        );
    } catch (err) {
        updateStatusBarItem(
            myStatusBarItem,
            g_isLoading,
            false,
            " No Suggestion"
        );

        return;
    }

    if (rs && rs.completions.length > 0) {
        editor.edit(function (edit: any) {
            let pos = selection.end;
            edit.insert(
                new vscode.Position(pos.line + 3, 0),
                `${rs.completions[0]}`
            );
        });
        updateStatusBarItem(myStatusBarItem, g_isLoading, false, " Done");
    } else {
        updateStatusBarItem(
            myStatusBarItem,
            g_isLoading,
            false,
            " No Suggestion"
        );
    }
}
