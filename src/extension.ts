process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import * as vscode from "vscode";
import { localeTag, myScheme } from "./param/constparams";
import { checkPrivacy } from "./utils/checkPrivacy";
import {
    getEndData,
    getOpenExtensionData,
    getTotalRequestNum,
} from "./utils/statisticFunc";
import { updateStatusBarItem } from "./utils/updateStatusBarItem";
import { generateWithPromptMode } from "./mode/generationWithPrompMode";
import welcomePage from "./welcomePage";
import generationWithTranslationMode from "./mode/generationWithTranslationMode";
import { codelensProvider } from "./provider/codelensProvider";
import generationWithInteractiveMode from "./mode/generationWithInteractiveMode";
import chooseCandidate from "./utils/chooseCandidate";
import disableEnable from "./disableEnable";
import { textDocumentProvider } from "./provider/textDocumentProvider";
import inlineCompletionProvider from "./provider/inlineCompletionProvider";
import { enableExtension, onlyKeyControl } from "./param/configures";
import changeIconColor from "./utils/changeIconColor";
import { isCurrentLanguageDisable } from "./utils/isCurrentLanguageDisable";
import survey from "./utils/survey";
import translationWebviewProvider from "./provider/translationWebviewProvider";
import inlineCompletionProviderWithCommand from "./provider/inlineCompletionProviderWithCommand";

let g_isLoading = false;
let originalColor: string | vscode.ThemeColor | undefined;
let myStatusBarItem: vscode.StatusBarItem;

export async function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "CodeGeeX" is now active!');
    try {
        getOpenExtensionData();
    } catch (err) {
        console.error(err);
    }
    context.subscriptions.push(
        vscode.commands.registerCommand("codegeex.welcome-page", async () => {
            await welcomePage(context);
        })
    );
    if (vscode.env.isNewAppInstall) {
        vscode.commands.executeCommand("codegeex.welcome-page");
    }
    checkPrivacy();
    survey();
    let targetEditor: vscode.TextEditor;

    const statusBarItemCommandId = "codegeex.disable-enable";
    context.subscriptions.push(
        vscode.commands.registerCommand("codegeex.disable-enable", () => {
            disableEnable(myStatusBarItem, g_isLoading, originalColor, context);
        })
    );
    if (enableExtension) {
        context.globalState.update("EnableExtension", true);
    } else {
        context.globalState.update("EnableExtension", false);
    }
    // create a new status bar item that we can now manage
    myStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    myStatusBarItem.command = statusBarItemCommandId;
    context.subscriptions.push(myStatusBarItem);
    //initialiser statusbar
    changeIconColor(
        enableExtension,
        myStatusBarItem,
        originalColor,
        isCurrentLanguageDisable()
    );
    updateStatusBarItem(myStatusBarItem, g_isLoading, false, "");
    //subscribe interactive-mode command
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "codegeex.interactive-mode",
            async () => {
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    vscode.window.showInformationMessage(
                        localeTag.noEditorInfo
                    );
                    return;
                }
                targetEditor = editor;
                generationWithInteractiveMode(
                    editor,
                    myStatusBarItem,
                    g_isLoading
                );
            }
        )
    );
    //subscribe translation-mode command
    context.subscriptions.push(
        vscode.commands.registerCommand("codegeex.translate-mode", async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showInformationMessage(localeTag.noEditorInfo);
                return;
            }
            targetEditor = editor;
            generationWithTranslationMode(
                myStatusBarItem,
                g_isLoading,
                targetEditor
            );
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand("codegeex.prompt-mode", () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showInformationMessage(localeTag.noEditorInfo);
                return;
            }
            generateWithPromptMode(myStatusBarItem, g_isLoading, editor);
        })
    );
    context.subscriptions.push(
        vscode.workspace.registerTextDocumentContentProvider(
            myScheme,
            textDocumentProvider(myStatusBarItem, g_isLoading)
        )
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "CodeGeeX.chooseCandidate",
            (fn, mode, commandid) => {
                chooseCandidate(targetEditor, fn, mode, commandid);
            }
        )
    );

    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider(
            { scheme: myScheme },
            codelensProvider
        )
    );

    //command after insert a suggestion in stealth mode
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "verifyInsertion",
            async (id, completions, acceptItem) => {
                try {
                    getEndData(id, "", "Yes", acceptItem, completions);
                } catch (err) {
                    console.log(err);
                }
            }
        )
    );

    let inlineProvider: vscode.InlineCompletionItemProvider;

    inlineProvider = inlineCompletionProvider(
        g_isLoading,
        myStatusBarItem,
        false,
        originalColor,
        context
    );

    if (onlyKeyControl) {
        context.globalState.update("DisableInlineCompletion", true);
    } else {
        context.globalState.update("DisableInlineCompletion", false);
        context.subscriptions.push(
            vscode.languages.registerInlineCompletionItemProvider(
                { pattern: "**" },
                inlineProvider
            )
        );
    }

    let provider2 = inlineCompletionProviderWithCommand(
        g_isLoading,
        myStatusBarItem,
        originalColor,
        context
    );
    let oneTimeDispo: vscode.Disposable;
    vscode.commands.registerCommand("codegeex.new-completions", () => {
        if (oneTimeDispo) {
            oneTimeDispo.dispose();
        }
        context.globalState.update("isOneCommand", true);
        context.globalState.update("DisableInlineCompletion", true);
        oneTimeDispo = vscode.languages.registerInlineCompletionItemProvider(
            { pattern: "**" },
            provider2
        );
    });
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(async (e) => {
            const editor = vscode.window.activeTextEditor;
            const enableExtension = await context.globalState.get(
                "EnableExtension"
            );
            if (editor) {
                
                changeIconColor(
                    //@ts-ignore
                    enableExtension,
                    myStatusBarItem,
                    originalColor,
                    isCurrentLanguageDisable(),
                    true
                );
            }
        })
    );
    const tranlationProvider = new translationWebviewProvider(
        context.extensionUri
    );
    const translationViewDisposable = vscode.window.registerWebviewViewProvider(
        "codegeex-translate",
        tranlationProvider
    );

    context.subscriptions.push(translationViewDisposable);
}
export function deactivate() {}
