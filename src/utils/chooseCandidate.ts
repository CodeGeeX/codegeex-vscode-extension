import * as vscode from "vscode";
import { translationInsertMode } from "../param/configures";
import { comment } from "../param/constparams";
import commentCode, { getCommentSignal } from "./commentCode";
import { getEndData } from "./statisticFunc";

//function to insert code when user click 'use code'
export default function chooseCandidate(
    targetEditor: vscode.TextEditor,
    fn: string,
    mode: string,
    commandid: string
) {
    if (!targetEditor) return;
    try {
        targetEditor
            .edit(async (editBuilder) => {
                var s = targetEditor.selection;
                if (s.start.character == 0 && fn.slice(0, 1) == "\n") {
                    fn = fn.slice(1);
                }
                if (mode === "translation") {
                    let selection = new vscode.Selection(s.start, s.end);
                    const text = targetEditor.document.getText(selection);
                    const lang = targetEditor.document.languageId;
                    const commentSignal = getCommentSignal(lang);
                    if (translationInsertMode === "comment") {
                        const commentedText = commentCode(
                            text,
                            lang,
                            "line"
                        ).replaceAll(comment, commentSignal.line || "#");
                        editBuilder.replace(s, commentedText + "\n" + fn);
                    } else {
                        editBuilder.replace(s, fn);
                    }
                } else {
                    editBuilder.replace(s, fn);
                }
                try {
                    if (commandid.length !== 0) {
                        await getEndData(commandid, "", "Yes", fn);
                    }
                } catch (err) {
                    console.log(err);
                }
            })
            .then((success) => {
                var postion = targetEditor.selection.end;
                targetEditor.selection = new vscode.Selection(postion, postion);
            });
    } catch (e) {
        console.log(e);
    }
}
