import { getTotalRequestNum } from "./statisticFunc";
import * as vscode from "vscode";
import { localeTag, surveyUrl } from "../param/constparams";
import { acceptedsurvey } from "../param/configures";

let totolRequestNum: number;
export default async function survey() {
    try {
        totolRequestNum = await getTotalRequestNum();
    } catch (err) {
        console.error(err);
        totolRequestNum = 0;
    }
    let configuration = vscode.workspace.getConfiguration(
        "Codegeex",
        undefined
    );
    if (totolRequestNum >= 2000 && acceptedsurvey === null) {
        const selection = await vscode.window.showInformationMessage(
            localeTag.surveyInfo,
            localeTag.surveyYes,
            localeTag.surveyNo
        );
        if (selection === localeTag.surveyYes) {
            configuration.update("Survey", true, true);
            let uri = vscode.Uri.parse(surveyUrl);
            vscode.env.openExternal(uri);
        }
        if (selection === localeTag.surveyNo) {
            configuration.update("Survey", false, true);
        }
    }
}
