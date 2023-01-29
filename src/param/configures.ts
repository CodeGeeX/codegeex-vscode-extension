import { workspace } from "vscode";

const configuration = workspace.getConfiguration("Codegeex", undefined);

export const generationPreference = configuration.get("GenerationPreference");
export const disabledFor = configuration.get("DisabledFor", new Object());

export const disabledLangs = () => {
    const disabledFor = configuration.get("DisabledFor", new Object());
    let disabledLangs = [];
    const keys = Object.keys(disabledFor);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (
            (disabledFor as any)[key] === true ||
            (disabledFor as any)[key] === "true"
        ) {
            disabledLangs.push(key);
        }
    }
    return disabledLangs;
};

const defaultConfig = {
    temp: 0.8,
    topp: 0.95,
    topk: 0,
};
const modelConfig = configuration.get("DecodingStrategies", defaultConfig);
export const temp = modelConfig.temp;
export const topk = modelConfig.topk;
export const topp = modelConfig.topp;
//get number of candidates
const candidateNum_str = String(configuration.get("CandidateNum", "1"));
export const candidateNum = parseInt(candidateNum_str);
export const needGuide = configuration.get("NeedGuide");
export const translationInsertMode = configuration.get("Translation");
export const enableExtension = configuration.get("EnableExtension", true);
export const acceptedsurvey = configuration.get("Survey", null);
export const completionDelay = configuration.get("CompletionDelay", 0.5);
export const templates = configuration.get("PromptTemplates(Experimental)", {});
export const onlyKeyControl = configuration.get("OnlyKeyControl");
export const controls = {
    interactiveMode: {
        mac: "Control + Enter",
        win: "Ctrl + Enter",
    },
    promptMode: {
        mac: "Option + T",
        win: "Ctrl + T",
    },
    translationMode: {
        mac: "Option + Control + T",
        win: "Alt + Ctrl + T",
    },
    nextSuggestion: {
        mac: "Option + ]",
        win: "Alt + ]",
    },
    previousSuggestion: {
        mac: "Option + [",
        win: "Alt + [",
    },
    newSuggestion: {
        mac: "Option + N",
        win: "Alt + N",
    },
};
