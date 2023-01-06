import { codelensProvider } from "../provider/codelensProvider";
import { updateStatusBarItem } from "./updateStatusBarItem";
import { StatusBarItem } from "vscode";

export const getGPTCode = (
    candidateList: Array<string>,
    commandid: string,
    myStatusBarItem: StatusBarItem,
    g_isLoading: boolean
) => {
    codelensProvider.clearEls();
    let content = "";
    //let content = `/* ${localeTag.candidateList} */\n`;
    if (candidateList.length === 0) {
        updateStatusBarItem(
            myStatusBarItem,
            g_isLoading,
            false,
            " No Suggestion"
        );
        return content;
    }
    let allCandidates = [];
    for (let i = 0; i < candidateList.length; i++) {
        allCandidates.push([candidateList[i], "CodeGeeX"]);
    }

    allCandidates.sort(function (a, b) {
        return b[0].length - a[0].length;
    });

    for (let i = 0; i < allCandidates.length; i++) {
        content += `\n/* Generate by ${allCandidates[i][1]} */\n`;
        const lineNum = content.split("\n").length;
        codelensProvider.addEl(
            lineNum,
            allCandidates[i][0],
            allCandidates[i][1] === "CodeGeeX" ? commandid : ""
        );

        if (allCandidates[i][0][0] === "\n") {
            content += allCandidates[i][0];
        } else {
            content += "\n" + allCandidates[i][0];
        }
        if (
            i <
            allCandidates.length - 1 /*&& candidateList[i].slice(-1) != '\n'*/
        ) {
            content += "\n";
            content += "###########################";
        }
    }
    updateStatusBarItem(myStatusBarItem, g_isLoading, false, " Done");
    return content;
};
