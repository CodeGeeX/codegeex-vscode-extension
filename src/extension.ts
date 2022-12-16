process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import * as vscode from "vscode";
import { localeTag, myScheme } from "./param/constparams";
import { checkPrivacy } from "./utils/checkPrivacy";
import { getEndData, getOpenExtensionData, getTotalRequestNum } from "./utils/statisticFunc";
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
import { enableExtension } from "./param/configures";
import changeIconColor from "./utils/changeIconColor";
import { isCurrentLanguageDisable } from "./utils/isCurrentLanguageDisable";
import survey from "./utils/survey";

let g_isLoading = false;
let originalColor: string | vscode.ThemeColor | undefined;
let myStatusBarItem: vscode.StatusBarItem;

export async function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "CodeGeeX" is now active!');
    try{

        await getOpenExtensionData();
    }catch(err){
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
            disableEnable(myStatusBarItem, g_isLoading, originalColor);
        })
    );
    // create a new status bar item that we can now manage
    myStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    myStatusBarItem.command = statusBarItemCommandId;
    context.subscriptions.push(myStatusBarItem);
    //initialiser statusbar
    changeIconColor(enableExtension, myStatusBarItem, originalColor,isCurrentLanguageDisable());
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
                vscode.window.showInformationMessage(
                    localeTag.noEditorInfo
                );
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
                vscode.window.showInformationMessage(
                    localeTag.noEditorInfo
                );
                return;
            }
            generateWithPromptMode(myStatusBarItem, g_isLoading, editor);
        })
    );
    context.subscriptions.push(
        vscode.workspace.registerTextDocumentContentProvider(
            myScheme,
            textDocumentProvider(myStatusBarItem,g_isLoading)
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
                try{

                    await getEndData(id, "", "Yes", acceptItem, completions);
                }catch(err){
                    console.log(err)
                }
            }
        )
    );
    context.subscriptions.push(
        vscode.languages.registerInlineCompletionItemProvider(
            { pattern: "**" },
            inlineCompletionProvider(g_isLoading, myStatusBarItem, false,originalColor)
        )
    );
    context.subscriptions.push(
        vscode.commands.registerCommand("codegeex.new-completions", () => {
            vscode.languages.registerInlineCompletionItemProvider(
                { pattern: "**" },
                inlineCompletionProvider(g_isLoading, myStatusBarItem, true,originalColor)
            );
        })
    );
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(e=>{
        const editor = vscode.window.activeTextEditor;
        if(editor){
            changeIconColor(true,myStatusBarItem,originalColor,isCurrentLanguageDisable(),true)
            
        }
    }))
    
}
export function deactivate() {}
