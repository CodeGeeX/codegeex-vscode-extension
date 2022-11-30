import * as vscode from "vscode";
import { myScheme } from "../param/constparams";
import { navUri } from "./navUri";

//generate uri for interactive mode
export const codegeexCodeGen = async (code_block: string) => {
    let loading = vscode.Uri.parse(
        `${myScheme}:CodeGeeX?loading=true&mode=gen&code_block=${code_block}`,
        true
    );
    await navUri(loading, "python", "CodeGeeX");
    let uri = vscode.Uri.parse(
        `${myScheme}:CodeGeeX?loading=false&mode=gen&code_block=${code_block}`,
        true
    );
    await navUri(uri, "python", "CodeGeeX");
};
