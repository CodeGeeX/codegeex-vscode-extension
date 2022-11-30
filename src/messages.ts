import { window } from "vscode";

export type MessageOptions = {
    messageId: string;
    messageText: string;
    buttonText: string;
    action: () => void;
};

export default async function showMessage(
    options: MessageOptions
): Promise<void> {
    await window
        .showInformationMessage(options.messageText, options.buttonText)
        .then((selected) => {
            if (selected === options.buttonText) {
                options.action();
            }
        });
}
