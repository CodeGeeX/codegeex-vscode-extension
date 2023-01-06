import * as vscode from "vscode";
import { disabledFor, enableExtension } from "./param/configures";
import { localeTag } from "./param/constparams";
import changeIconColor from "./utils/changeIconColor";
import { updateStatusBarItem } from "./utils/updateStatusBarItem";

let g_isEnable = enableExtension;
export default async function disableEnable(
    myStatusBarItem: vscode.StatusBarItem,
    g_isLoading: boolean,
    originalColor: string | vscode.ThemeColor | undefined,
    context: vscode.ExtensionContext
) {
    const lang = vscode.window.activeTextEditor?.document.languageId || "";
    if (g_isEnable) {
        if (
            (disabledFor as any)[lang] ||
            (disabledFor as any)[lang] === "true"
        ) {
            const answer = await vscode.window.showInformationMessage(
                localeTag.disableInfo,
                localeTag.disableGlobally,
                `${localeTag.enable} ${lang}`
            );
            if (answer === localeTag.disableGlobally) {
                // Run function
                changeIconColor(false, myStatusBarItem, originalColor);
                g_isEnable = false;
                const configuration = vscode.workspace.getConfiguration(
                    "Codegeex",
                    undefined
                );
                configuration.update("EnableExtension", false);
                await context.globalState.update("EnableExtension", false);
            }
            if (answer === `${localeTag.enable} ${lang}`) {
                // Run function
                const configuration = vscode.workspace.getConfiguration(
                    "Codegeex",
                    undefined
                );
                (disabledFor as any)[lang] = false;
                configuration.update("DisabledFor", disabledFor);
                changeIconColor(true, myStatusBarItem, originalColor);
            }
        } else {
            const answer = await vscode.window.showInformationMessage(
                localeTag.disableInfo,
                localeTag.disableGlobally,
                `${localeTag.disable} ${lang}`
            );

            if (answer === localeTag.disableGlobally) {
                // Run function
                changeIconColor(false, myStatusBarItem, originalColor);
                const configuration = vscode.workspace.getConfiguration(
                    "Codegeex",
                    undefined
                );
                g_isEnable = false;
                configuration.update("EnableExtension", false);
                await context.globalState.update("EnableExtension", false);
            }
            if (answer === `${localeTag.disable} ${lang}`) {
                // Run function
                const configuration = vscode.workspace.getConfiguration(
                    "Codegeex",
                    undefined
                );
                (disabledFor as any)[lang] = true;
                configuration.update("DisabledFor", disabledFor);
                updateStatusBarItem(myStatusBarItem, g_isLoading, false, "");
                changeIconColor(true, myStatusBarItem, originalColor, true);
            }
        }
    } else {
        const answer = await vscode.window.showInformationMessage(
            localeTag.enableInfo,
            localeTag.enableGlobally
        );
        if (answer === localeTag.enableGlobally) {
            // Run function
            if (
                (disabledFor as any)[lang] ||
                (disabledFor as any)[lang] === "true"
            ) {
                changeIconColor(true, myStatusBarItem, originalColor, true);
            } else {
                changeIconColor(true, myStatusBarItem, originalColor);
            }
            const configuration = vscode.workspace.getConfiguration(
                "Codegeex",
                undefined
            );
            g_isEnable = true;
            configuration.update("EnableExtension", true);
            await context.globalState.update("EnableExtension", true);
        }
    }
}
