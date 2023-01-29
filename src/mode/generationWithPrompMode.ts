import * as vscode from "vscode";
import { templates } from "../param/configures";
import { templateExplanation } from "../templates/explanation";
import codeGenByTemplate from "../utils/codeGenByTemplate";
import readTemplate from "../utils/readTemplate";

export async function generateWithPromptMode(
    myStatusBarItem: vscode.StatusBarItem,
    g_isLoading: boolean,
    editor: vscode.TextEditor
) {
    var items: vscode.QuickPickItem[] = [];

    const keys = Object.keys(templates);

    items.push({
        label: "explanation",
        description: "Explain the selection line by line",
    });
    let custom_prompts = {};
    for (let key of keys) {
        if (key != "explanation") {
            try {
                // @ts-ignore
                custom_prompts[key] = await readTemplate(templates[key]);
                items.push({ label: key, description: "" });
            } catch (err) {
                console.log(err);
            }
        }
    }

    vscode.window.showQuickPick(items).then((selection) => {
        if (!selection) {
            return;
        }
        let e = vscode.window.activeTextEditor;
        let d = e?.document;
        let sel = e?.selections;

        switch (selection.label) {
            case "explanation":
                codeGenByTemplate(
                    editor,
                    templateExplanation,
                    myStatusBarItem,
                    g_isLoading
                );
                break;

            default:
                if (keys.indexOf(selection.label) !== -1) {
                    // @ts-ignore
                    let templateStr = custom_prompts[selection.label];
                    console.log("templateStr:");
                    console.log(templateStr);
                    codeGenByTemplate(
                        editor,
                        templateStr,
                        myStatusBarItem,
                        g_isLoading
                    );
                } else {
                    // console.log("no selection")
                }
                break;
        }
    });
}
