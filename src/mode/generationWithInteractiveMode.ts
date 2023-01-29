import * as vscode from "vscode";
import { codegeexCodeGen } from "../utils/codegeexCodeGen";
import { updateStatusBarItem } from "../utils/updateStatusBarItem";

const addSignal = "<|add|>";
const andSignal = "<|and|>";
const hash = "<|hash|>";

export default async function generationWithInteractiveMode(
    editor: vscode.TextEditor,
    myStatusBarItem: vscode.StatusBarItem,
    g_isLoading: boolean
) {
    const document = editor.document;
    let selection: vscode.Selection;

    const cursorPosition = editor.selection.active;
    selection = new vscode.Selection(
        0,
        0,
        cursorPosition.line,
        cursorPosition.character
    );
    let code_block = document.getText(selection);
    if (
        cursorPosition.character === 0 &&
        code_block[code_block.length - 1] !== "\n"
    ) {
        code_block += "\n";
    }
    code_block = code_block
        .replaceAll("#", hash)
        .replaceAll("+", addSignal)
        .replaceAll("&", andSignal);
    updateStatusBarItem(myStatusBarItem, g_isLoading, true, "");
    await codegeexCodeGen(code_block)
        .then(() =>
            updateStatusBarItem(myStatusBarItem, g_isLoading, false, "Done")
        )
        .catch((err) => {
            console.log(err);
            updateStatusBarItem(
                myStatusBarItem,
                g_isLoading,
                false,
                "No Suggestion"
            );
        });
}
