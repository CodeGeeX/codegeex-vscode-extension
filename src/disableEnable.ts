import * as vscode from "vscode";
import { disabledFor, enableExtension } from "./param/configures";
import changeIconColor from "./utils/changeIconColor";
import { updateStatusBarItem } from "./utils/updateStatusBarItem";

let g_isEnable = enableExtension;
export default async function disableEnable(
    myStatusBarItem: vscode.StatusBarItem,
    g_isLoading: boolean,
    originalColor: string | vscode.ThemeColor | undefined
) {
    if (g_isEnable) {
        const lang = vscode.window.activeTextEditor?.document.languageId || "";
        if (
            (disabledFor as any)[lang] ||
            (disabledFor as any)[lang] === "true"
        ) {
            const answer = await vscode.window.showInformationMessage(
                "Would you like to disable CodeGeeX?",
                "Disable Globally",
                `Enable for ${lang}`
            );
            if (answer === "Disable Globally") {
                // Run function
                changeIconColor(false, myStatusBarItem, originalColor);
                g_isEnable = false;
                const configuration = vscode.workspace.getConfiguration(
                    "Codegeex",
                    undefined
                );
                configuration.update("EnableExtension", false);
                console.log(configuration);
            }
            if (answer === `Enable for ${lang}`) {
                // Run function
                const configuration = vscode.workspace.getConfiguration(
                    "Codegeex",
                    undefined
                );
                (disabledFor as any)[lang] = false;
                configuration.update("DisabledFor", disabledFor);
            }
        } else {
            const answer = await vscode.window.showInformationMessage(
                "Would you like to disable CodeGeeX?",
                "Disable Globally",
                `Disable for ${lang}`
            );

            if (answer === "Disable Globally") {
                // Run function
                changeIconColor(false, myStatusBarItem, originalColor);
                const configuration = vscode.workspace.getConfiguration(
                    "Codegeex",
                    undefined
                );
                g_isEnable = false;
                configuration.update("EnableExtension", false);
            }
            if (answer === `Disable for ${lang}`) {
                // Run function
                const configuration = vscode.workspace.getConfiguration(
                    "Codegeex",
                    undefined
                );
                (disabledFor as any)[lang] = true;
                configuration.update("DisabledFor", disabledFor);
                updateStatusBarItem(myStatusBarItem, g_isLoading, false, "");
            }
        }
    } else {
        const answer = await vscode.window.showInformationMessage(
            "Would you like to enable CodeGeeX?",
            "Enable Globally"
        );
        if (answer === "Enable Globally") {
            // Run function
            changeIconColor(true, myStatusBarItem, originalColor);
            const configuration = vscode.workspace.getConfiguration(
                "Codegeex",
                undefined
            );
            g_isEnable = true;
            configuration.update("EnableExtension", true);
        }
    }
}
