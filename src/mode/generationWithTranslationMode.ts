import * as vscode from "vscode";
import { hash, languageList } from "../param/constparams";
import { codegeexCodeTranslation } from "../utils/codegeexCodeTranslation";
import { getCommentSignal } from "../utils/commentCode";
import { getCodeTranslation } from "../utils/getCodeTranslation";
import getDocumentLanguage from "../utils/getDocumentLanguage";
import { showQuickPick } from "../utils/showQuickPick";
import { getStartData } from "../utils/statisticFunc";
import { updateStatusBarItem } from "../utils/updateStatusBarItem";

export default async function generationWithTranslationMode(
    myStatusBarItem: vscode.StatusBarItem,
    g_isLoading: boolean,
    targetEditor: vscode.TextEditor
) {
    let dstLang = getDocumentLanguage(targetEditor);
    const document = targetEditor.document;
    let selection: vscode.Selection;

    const cursorPosition = targetEditor.selection.active;
    const anchorPosition = targetEditor.selection.anchor;
    selection = new vscode.Selection(anchorPosition, cursorPosition);
    //vscode.commands.executeCommand('editor.action.addCommentLine')

    let text = document.getText(selection);
    if (text && text.trim().length > 0) {
        let srcLang =
            (await showQuickPick(
                languageList,
                "Please choose the language to be translated."
            )) || "";
        let translation;
        if (
            languageList.indexOf(srcLang) >= 0 &&
            languageList.indexOf(dstLang) >= 0
        ) {
            updateStatusBarItem(
                myStatusBarItem,
                g_isLoading,
                true,
                " Translating"
            );
            let commandid = getStartData(
                text,
                text,
                `${srcLang}->${dstLang}`,
                "translation"
            );
            translation = await getCodeTranslation(text, srcLang, dstLang).then(
                async (res) => {
                    await codegeexCodeTranslation(
                        dstLang,
                        res.translation[0].replaceAll("#", hash),
                        await commandid
                    ).then(() => {
                        updateStatusBarItem(
                            myStatusBarItem,
                            g_isLoading,
                            false,
                            " Done"
                        );
                    });
                }
            );
        }
        if (languageList.indexOf(srcLang) < 0) {
            vscode.window.showInformationMessage(
                "Please choose the language to be translated."
            );
        }
        if (languageList.indexOf(dstLang) < 0) {
            vscode.window.showInformationMessage(
                "Sorry, the target language is not supported."
            );
        }
    } else {
        vscode.window.showInformationMessage(
            "Please select some code to be translated"
        );
    }
}
