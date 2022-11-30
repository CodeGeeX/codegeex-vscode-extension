import { window } from "vscode";

export async function showQuickPick(list: Array<string>, description: string) {
    const result = await window.showQuickPick(list, {
        placeHolder: description,
        onDidSelectItem: (item) => {
            //window.showInformationMessage(`You've chosen ${item}`)
        },
    });
    return result;
}
