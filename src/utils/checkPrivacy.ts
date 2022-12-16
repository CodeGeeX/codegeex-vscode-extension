import { workspace, window } from "vscode";
import { localeTag } from "../param/constparams";

//check if the user accept to share codes
export async function checkPrivacy() {
    const configuration = workspace.getConfiguration("Codegeex", undefined);
    let privacy = configuration.get("Privacy");
    if (privacy === null) {
        const selection = await window.showInformationMessage(
            localeTag.privacyInfo,
            localeTag.privacyAccept,
            localeTag.privacyDecline
        );
        if (selection !== undefined && selection === localeTag.privacyAccept) {
            configuration
                .update("Privacy", true, true)
                .then((res) => console.log(res));
        }
        if (selection !== undefined && selection === localeTag.privacyDecline) {
            configuration.update("Privacy", false, true);
        }
    }
}
