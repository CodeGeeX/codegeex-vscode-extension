import * as vscode from "vscode";
import { localeTag } from "../param/constparams";

export const codelensProvider = new (class {
    codelenses: vscode.CodeLens[];
    constructor() {
        this.codelenses = [];
    }
    addEl(lineNum: number, text: string, commandid: string, mode?: string) {
        let range;
        range = new vscode.Range(lineNum, 0, lineNum, 0);

        this.codelenses.push(
            new vscode.CodeLens(range, {
                title: localeTag.useCode,
                command: "CodeGeeX.chooseCandidate",
                arguments: [text, mode, commandid],
                tooltip: localeTag.chooseThisSnippet,
            })
        );
    }
    clearEls() {
        this.codelenses = [];
    }

    provideCodeLenses() {
        return this.codelenses;
    }
})();
