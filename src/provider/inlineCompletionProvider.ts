import * as vscode from "vscode";
import { apiKey, apiSecret } from "../localconfig";
import {
    candidateNum,
    completionDelay,
    disabledFor,
} from "../param/configures";
import { Trie } from "../trie";
import { getCodeCompletions } from "../utils/getCodeCompletions";
import getDocumentLanguage from "../utils/getDocumentLanguage";
import { updateStatusBarItem } from "../utils/updateStatusBarItem";

let lastRequest = null;
let trie = new Trie([]);
let prompts: string[] = [];
let someTrackingIdCounter = 0;
let delay: number = completionDelay * 1000;
// let timeExecute: number = 2500;
// let last5ExecuteTime  = [2500,2500,2500,2500,2500];

function middleOfLineWontComplete(editor: any, document: any) {
    const cursorPosition = editor.selection.active;
    let currentLine = document?.lineAt(cursorPosition.line);
    let lineEndPosition = currentLine?.range.end;
    let selectionTrailingString: vscode.Selection;

    selectionTrailingString = new vscode.Selection(
        cursorPosition.line,
        cursorPosition.character,
        cursorPosition.line,
        lineEndPosition.character + 1
    );
    let trailingString = document.getText(selectionTrailingString);
    var re = /^[\]\{\}\); \n\r\t\'\"]*$/;
    if (re.test(trailingString)) {
        return false;
    } else {
        return true;
    }
}

function isAtTheMiddleOfLine(editor: any, document: any) {
    const cursorPosition = editor.selection.active;
    let currentLine = document?.lineAt(cursorPosition.line);
    let lineEndPosition = currentLine?.range.end;
    let selectionTrailingString: vscode.Selection;

    selectionTrailingString = new vscode.Selection(
        cursorPosition.line,
        cursorPosition.character,
        cursorPosition.line,
        lineEndPosition.character + 1
    );
    let trailingString = document.getText(selectionTrailingString);
    let trimmed = trailingString.trim();
    return trimmed.length !== 0;
}

function removeTrailingCharsByReplacement(
    completion: string,
    replacement: string
) {
    for (let ch of replacement) {
        if (!isBracketBalanced(completion, ch)) {
            completion = replaceLast(completion, ch, "");
        }
    }
    return completion;
}

function replaceLast(str: string, toReplace: string, replacement: string) {
    let pos = str.lastIndexOf(toReplace);
    if (pos > -1) {
        return (
            str.substring(0, pos) +
            replacement +
            str.substring(pos + toReplace.length)
        );
    } else {
        return str;
    }
}

function isBracketBalanced(str: string, character: string) {
    let count = 0;
    for (let ch of str) {
        if (ch === character) {
            count++;
        }
        if (
            (character === "{" && ch === "}") ||
            (character === "[" && ch === "]") ||
            (character === "(" && ch === ")") ||
            (character === "}" && ch === "{") ||
            (character === "]" && ch === "[") ||
            (character === ")" && ch === "(")
        ) {
            count--;
        }
    }
    return count === 0;
}

interface MyInlineCompletionItem extends vscode.InlineCompletionItem {
    trackingId: number;
}
export default function inlineCompletionProvider(
    g_isLoading: boolean,
    myStatusBarItem: vscode.StatusBarItem,
    reGetCompletions: boolean,
    originalColor: string | vscode.ThemeColor | undefined,
    extensionContext: vscode.ExtensionContext
) {
    const provider: vscode.InlineCompletionItemProvider = {
        provideInlineCompletionItems: async (
            document,
            position,
            context,
            token
        ) => {
            console.log("new event!");
            const enableExtension = await extensionContext.globalState.get(
                "EnableExtension"
            );
            const disableInlineCompletion =
                await extensionContext.globalState.get(
                    "DisableInlineCompletion"
                );
            //= vscode.workspace
            // .getConfiguration("Codegeex", undefined)
            // .get("EnableExtension", undefined);
            if (!enableExtension || disableInlineCompletion) {
                return;
            }
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showInformationMessage(
                    "Please open a file first to use CodeGeeX."
                );
                return;
            }
            let selection: vscode.Selection;
            const languageId = editor.document.languageId || "undefined";
            if (
                (disabledFor as any)[languageId] === true ||
                (disabledFor as any)[languageId] === "true" ||
                !enableExtension
            ) {
                return;
            }
            const cursorPosition = editor.selection.active;
            selection = new vscode.Selection(
                0,
                0,
                cursorPosition.line,
                cursorPosition.character
            );
            let textBeforeCursor = document.getText(selection);
            if (
                cursorPosition.character === 0 &&
                textBeforeCursor[textBeforeCursor.length - 1] !== "\n"
            ) {
                textBeforeCursor += "\n";
            }
            if (vscode.window.activeNotebookEditor) {
                const cells =
                    vscode.window.activeNotebookEditor.notebook.getCells();
                const currentCell =
                    vscode.window.activeNotebookEditor.selection.start;
                let str = "";
                for (let i = 0; i < currentCell; i++) {
                    str += cells[i].document.getText().trimEnd() + "\n";
                }
                textBeforeCursor = str + textBeforeCursor;
            }
            if (textBeforeCursor.trim() === "") {
                updateStatusBarItem(myStatusBarItem, g_isLoading, false, "");
                return { items: [] };
            }

            //解决光标之后有除括号空格之外内容，仍然补充造成的调用浪费
            let selectionNextChar: vscode.Selection;

            selectionNextChar = new vscode.Selection(
                cursorPosition.line,
                cursorPosition.character,
                cursorPosition.line,
                cursorPosition.character + 1
            );
            // let nextChar = document.getText(selectionNextChar);
            // const checkString = "]}) \n\t'\"";
            // if (!checkString.includes(nextChar)) {
            if (middleOfLineWontComplete(editor, document)) {
                console.log("不进行补充");
                updateStatusBarItem(myStatusBarItem, g_isLoading, false, "");
                return;
            } else {
                console.log("continue");
            }
            if (true && !reGetCompletions) {
                for (let prompt of prompts) {
                    if (textBeforeCursor.trimEnd().indexOf(prompt) != -1) {
                        let completions;
                        completions = trie.getPrefix(textBeforeCursor);
                        let useTrim = false;
                        if (completions.length === 0) {
                            completions = trie.getPrefix(
                                textBeforeCursor.trimEnd()
                            );
                            useTrim = true;
                        }
                        if (completions.length == 0) {
                            break;
                        }
                        let items = new Array<MyInlineCompletionItem>();
                        let lastLine = document.lineAt(document.lineCount - 1);
                        for (
                            let i = 0;
                            i <
                            Math.min(
                                Math.min(completions.length, candidateNum) + 1,
                                completions.length
                            );
                            i++
                        ) {
                            let insertText = useTrim
                                ? completions[i].replace(
                                      textBeforeCursor.trimEnd(),
                                      ""
                                  )
                                : completions[i].replace(textBeforeCursor, "");
                            console.log(insertText);
                            let needRequest = ["", "\n", "\n\n"];
                            if (
                                needRequest.includes(insertText) ||
                                insertText.trim() === ""
                            ) {
                                continue;
                            }
                            if (useTrim) {
                                const lines = insertText.split("\n");
                                let nonNullIndex = 0;
                                while (lines[nonNullIndex].trim() === "") {
                                    nonNullIndex++;
                                }
                                let newInsertText = "";
                                for (
                                    let j = nonNullIndex;
                                    j < lines.length;
                                    j++
                                ) {
                                    newInsertText += lines[j];
                                    if (j !== lines.length - 1) {
                                        newInsertText += "\n";
                                    }
                                }
                                if (
                                    textBeforeCursor[
                                        textBeforeCursor.length - 1
                                    ] === "\n" ||
                                    nonNullIndex === 0
                                ) {
                                    insertText = newInsertText;
                                } else {
                                    insertText = "\n" + newInsertText;
                                }
                            }

                            items.push({
                                insertText,
                                range: new vscode.Range(
                                    position.translate(0, completions.length),
                                    position
                                ),
                                // range: new vscode.Range(endPosition.translate(0, completions.length), endPosition),
                                trackingId: someTrackingIdCounter++,
                            });
                            if (useTrim) {
                                trie.addWord(
                                    textBeforeCursor.trimEnd() + insertText
                                );
                            } else {
                                trie.addWord(textBeforeCursor + insertText);
                            }
                        }
                        if (items.length === 0) {
                            continue;
                        } else {
                            updateStatusBarItem(
                                myStatusBarItem,
                                g_isLoading,
                                false,
                                " Done"
                            );
                            return items;
                        }
                    }
                }
            }
            if (enableExtension && textBeforeCursor.length > 8) {
                console.log("try to get");
                let requestId = new Date().getTime();
                lastRequest = requestId;
                await new Promise((f) => setTimeout(f, delay));
                if (lastRequest !== requestId) {
                    return { items: [] };
                }
                console.log("real to get");
                console.log("new command");
                let rs;
                let lang = "";
                const configuration = vscode.workspace.getConfiguration(
                    "Codegeex",
                    undefined
                );
                const num_str = String(configuration.get("CandidateNum", "1"));
                const num = parseInt(num_str);
                try {
                    if (editor) {
                        lang = getDocumentLanguage(editor);
                    }
                    updateStatusBarItem(myStatusBarItem, g_isLoading, true, "");
                    let timestart = new Date().getTime();
                    rs = await getCodeCompletions(
                        textBeforeCursor,
                        num,
                        lang,
                        apiKey,
                        apiSecret,
                        "inlinecompletion"
                    );
                    let timeend = new Date().getTime();
                    console.log("time execute", timeend - timestart);
                } catch (err) {
                    if (err) {
                        console.log("intended error");
                        console.log(err);
                    }
                    updateStatusBarItem(
                        myStatusBarItem,
                        g_isLoading,
                        false,
                        " No Suggestion"
                    );
                    return { items: [] };
                }
                if (rs === null) {
                    updateStatusBarItem(
                        myStatusBarItem,
                        g_isLoading,
                        false,
                        " No Suggestion"
                    );
                    return { items: [] };
                }
                prompts.push(textBeforeCursor);
                // Add the generated code to the inline suggestion list
                let items = new Array<MyInlineCompletionItem>();
                let cursorPosition = editor.selection.active;
                for (let i = 0; i < rs.completions.length; i++) {
                    let completion = rs.completions[i];
                    if (isAtTheMiddleOfLine(editor, document)) {
                        const cursorPosition = editor.selection.active;
                        let currentLine = document?.lineAt(cursorPosition.line);
                        let lineEndPosition = currentLine?.range.end;
                        let selectionTrailingString: vscode.Selection;

                        selectionTrailingString = new vscode.Selection(
                            cursorPosition.line,
                            cursorPosition.character,
                            cursorPosition.line,
                            lineEndPosition.character + 1
                        );
                        let trailingString = document.getText(
                            selectionTrailingString
                        );
                        completion = removeTrailingCharsByReplacement(
                            completion,
                            trailingString
                        );
                        if (
                            completion.trimEnd().slice(-1) === "{" ||
                            completion.trimEnd().slice(-1) === ";" ||
                            completion.trimEnd().slice(-1) === ":"
                        ) {
                            completion = completion
                                .trimEnd()
                                .substring(0, completion.length - 1);
                        }
                    }
                    items.push({
                        // insertText: completion,
                        insertText: rs.completions[i],
                        // range: new vscode.Range(endPosition.translate(0, rs.completions.length), endPosition),
                        range: new vscode.Range(
                            cursorPosition.translate(0, rs.completions.length),
                            cursorPosition
                        ),
                        trackingId: someTrackingIdCounter++,
                    });
                    trie.addWord(textBeforeCursor + rs.completions[i]);
                }
                for (let j = 0; j < items.length; j++) {
                    items[j].command = {
                        command: "verifyInsertion",
                        title: "Verify Insertion",
                        arguments: [
                            rs.commandid,
                            rs.completions,
                            items[j].insertText,
                        ],
                    };
                }
                if (rs.completions.length === 0) {
                    updateStatusBarItem(
                        myStatusBarItem,
                        g_isLoading,
                        false,
                        " No Suggestion"
                    );
                } else {
                    updateStatusBarItem(
                        myStatusBarItem,
                        g_isLoading,
                        false,
                        " Done"
                    );
                }
                return items;
            }
            updateStatusBarItem(
                myStatusBarItem,
                g_isLoading,
                false,
                " No Suggestion"
            );
            return { items: [] };
        },
    };
    return provider;
}
