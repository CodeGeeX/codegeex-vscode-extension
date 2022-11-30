import { workspace, window } from "vscode";

//check if the user accept to share codes
export async function checkPrivacy() {
    const configuration = workspace.getConfiguration("Codegeex", undefined);
    let privacy = configuration.get("Privacy");
    console.log(privacy);
    if (privacy === null) {
        const selection = await window.showInformationMessage(
            "We highly respect the privacy of your code. Do you accept sharing the generated code only for research purposes to make CodeGeeX better? Otherwise, the code won't be stored and is only used to assist your programming.",
            "Accept",
            "Decline"
        );
        if (selection !== undefined && selection === "Accept") {
            configuration
                .update("Privacy", true, true)
                .then((res) => console.log(res));
        }
        if (selection !== undefined && selection === "Decline") {
            configuration.update("Privacy", false, true);
        }
    }
}
