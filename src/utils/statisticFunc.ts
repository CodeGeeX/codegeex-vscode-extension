import * as vscode from "vscode";
import axios from "axios";
import * as os from "os";
//import welcomePage from './welcomePage';
import { apiHerf, extensionId, extensionVersion } from "../param/constparams";

const privacy = vscode.workspace.getConfiguration("Codegeex").get("Privacy");

export function getOpenExtensionData(): Promise<string> {
    return new Promise((resolve) => {
        try {
            axios
                .post(`${apiHerf}/tracking/insertVscodeStartRecord`, {
                    vscodeMachineId: vscode.env.machineId,
                    vscodeSessionId: vscode.env.sessionId,
                    platformVersion: os.release(),
                    systemOs: os.type(),
                    extensionId: extensionId,
                    extensionVersion: extensionVersion,
                    nodeArch: os.arch(),
                    isNewAppInstall: vscode.env.isNewAppInstall,
                    vscodeVersion: vscode.version,
                    product: vscode.env.appHost,
                    uikind: vscode.env.uiKind,
                    remoteName: vscode.env.remoteName,
                })
                .then((res) => {
                    console.log(res);
                    resolve(res.data.msg);
                })
                .catch((err) => {
                    resolve("error");
                });
        } catch (e) {
            resolve("error");
        }
    });
}
export function getStartData(
    inputText: string,
    prompt: string,
    lang: string,
    mode?: string
): Promise<string> {
    return new Promise((resolve) => {
        const startParam = {
            vscodeMachineId: vscode.env.machineId,
            vscodeSessionId: vscode.env.sessionId,
            requestPhase: "start",
            inputContent: privacy ? inputText : null,
            prompt: privacy ? prompt : null,
            lang: lang,
            mode: mode ? mode : null,
        };
        try {
            axios
                .post(`${apiHerf}/tracking/vsCodeOperationRecord`, startParam)
                .then((res) => {
                    console.log("开始请求测试", res);
                    let commandid = res.data.data.id || "";
                    resolve(commandid);
                });
        } catch (err) {
            resolve("");
        }
    });
}
export function getEndData(
    commandid: string,
    message: string,
    isAdopted: string,
    acceptItem?: string | null,
    completions?: Array<string> | string
): Promise<string> {
    return new Promise((resolve) => {
        let endparam = {
            id: commandid,
            requestPhase: "end",
            outputContent: privacy ? acceptItem : null,
            modelStatus: -1,
            message: message, //err.message,
            num: privacy ? completions?.length : 0,
            numContent: privacy ? completions?.toString() : null,
            whetherAdopt: isAdopted,
        };
        axios
            .post(`${apiHerf}/tracking/vsCodeOperationRecord`, endparam)
            .then((res) => {
                console.log("测试结束埋点", res);
                resolve("");
            })
            .catch((e) => {
                console.log("结束埋点错误", e);
                resolve("");
            });
    });
}
