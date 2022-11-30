import * as vscode from "vscode";
export default async function readTemplate(path: string) {
    const readData = await vscode.workspace.fs.readFile(vscode.Uri.parse(path));
    return Buffer.from(readData).toString("utf8");
}
