import * as vscode from "vscode";

export const codelensProvider = new (class {
    codelenses: vscode.CodeLens[];
    constructor() {
        this.codelenses = [];
    }
    addEl(lineNum: number, text: string, commandid: string, mode?: string) {
        let range;
        console.log(text[0] === "\n");

        range = new vscode.Range(lineNum, 0, lineNum, 0);

        this.codelenses.push(
            new vscode.CodeLens(range, {
                title: "Use code",
                command: "CodeGeeX.chooseCandidate",
                arguments: [text, mode, commandid],
                tooltip: "Choose this snippet",
            })
        );
        console.log(this.codelenses);
    }
    clearEls() {
        this.codelenses = [];
    }

    provideCodeLenses() {
        return this.codelenses;
    }
})();
