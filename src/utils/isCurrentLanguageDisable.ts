import * as vscode from "vscode";
import { disabledFor } from "../param/configures";

export const isCurrentLanguageDisable = () => {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return false;
    } else {
        const languageId = editor.document.languageId;
        if (
            (disabledFor as any)[languageId] === true ||
            (disabledFor as any)[languageId] === "true"
        ) {
            return true;
        } else {
            return false;
        }
    }
};
