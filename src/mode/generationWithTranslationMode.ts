import * as vscode from "vscode";
import { hash, languageList, localeTag } from "../param/constparams";
import { codegeexCodeTranslation } from "../utils/codegeexCodeTranslation";
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
            (await showQuickPick(languageList, localeTag.chooseLanguage)) || "";
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
            let commandid: string;
            try {
                commandid = await getStartData(
                    text,
                    text,
                    `${srcLang}->${dstLang}`,
                    "translation"
                );
            } catch (err) {
                commandid = "";
            }
            translation = await getCodeTranslation(text, srcLang, dstLang).then(
                async (res) => {
                    await codegeexCodeTranslation(
                        dstLang,
                        res.translation[0].replaceAll("#", hash),
                        commandid
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
            vscode.window.showInformationMessage(localeTag.chooseLanguage);
        }
        if (languageList.indexOf(dstLang) < 0) {
            vscode.window.showInformationMessage(
                localeTag.languageNotSupported
            );
        }
    } else {
        vscode.window.showInformationMessage(localeTag.selectCode);
    }
}
