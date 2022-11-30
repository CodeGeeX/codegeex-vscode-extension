import * as vscode from "vscode";

export default function changeIconColor(
    isEnable: boolean,
    myStatusBarItem: vscode.StatusBarItem,
    originalColor: string | vscode.ThemeColor | undefined
): void {
    myStatusBarItem.show();
    if (isEnable) {
        myStatusBarItem.backgroundColor = originalColor;
    } else {
        originalColor = myStatusBarItem.backgroundColor;
        // myStatusBarItem.backgroundColor = "#7B5F00";
        myStatusBarItem.backgroundColor = new vscode.ThemeColor(
            "statusBarItem.warningBackground"
        );
    }
}
