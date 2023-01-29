import * as vscode from "vscode";

export const navUri = async (
    uri: vscode.Uri,
    language: string,
    mode: string
) => {
    const doc = await vscode.workspace.openTextDocument(uri);

    await vscode.window.showTextDocument(doc, {
        viewColumn: vscode.ViewColumn.Beside,
        preview: true,
        preserveFocus: true,
    });
    vscode.languages.setTextDocumentLanguage(doc, language);
};
