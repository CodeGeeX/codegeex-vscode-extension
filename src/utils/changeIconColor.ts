import * as vscode from "vscode";
import { updateStatusBarItem } from "./updateStatusBarItem";

let g_isEnable: boolean;
export default function changeIconColor(
    isEnable: boolean,
    myStatusBarItem: vscode.StatusBarItem,
    originalColor: string | vscode.ThemeColor | undefined,
    isLangDisabled?: boolean,
    switchTab?: boolean
): void {
    myStatusBarItem.show();
    updateStatusBarItem(myStatusBarItem, false, false, "");
    if (switchTab) {
        if (g_isEnable) {
            myStatusBarItem.backgroundColor = originalColor;
            if (isLangDisabled) {
                myStatusBarItem.backgroundColor = new vscode.ThemeColor(
                    "statusBarItem.warningBackground"
                );
            }
        } else {
            originalColor = myStatusBarItem.backgroundColor;
            // myStatusBarItem.backgroundColor = "#7B5F00";
            myStatusBarItem.backgroundColor = new vscode.ThemeColor(
                "statusBarItem.warningBackground"
            );
        }
    } else {
        g_isEnable = isEnable;
        if (isEnable) {
            myStatusBarItem.backgroundColor = originalColor;
            if (isLangDisabled) {
                myStatusBarItem.backgroundColor = new vscode.ThemeColor(
                    "statusBarItem.warningBackground"
                );
            }
        } else {
            originalColor = myStatusBarItem.backgroundColor;
            // myStatusBarItem.backgroundColor = "#7B5F00";
            myStatusBarItem.backgroundColor = new vscode.ThemeColor(
                "statusBarItem.warningBackground"
            );
        }
    }
}
