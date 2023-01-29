import * as vscode from "vscode";
import axios from "axios";
import * as os from "os";
import { apiHerf, extensionId, extensionVersion } from "../param/constparams";

const privacy = vscode.workspace.getConfiguration("Codegeex").get("Privacy");

export function getOpenExtensionData(): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(
                    `${apiHerf}/tracking/insertVscodeStartRecord`,
                    {
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
                    },
                    { proxy: false }
                )
                .then((res) => {
                    console.log("写入开机信息", res);
                    resolve(res.data.msg);
                })
                .catch((err) => {
                    reject("error");
                });
        } catch (e) {
            reject("error");
        }
    });
}
export function getStartData(
    inputText: string,
    prompt: string,
    lang: string,
    mode?: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        const startParam = {
            vscodeMachineId: vscode.env.machineId,
            vscodeSessionId: vscode.env.sessionId,
            requestPhase: "start",
            inputContent: privacy ? inputText : null,
            prompt: privacy ? prompt : null,
            lang: lang,
            mode: mode ? mode : null,
            extensionId: extensionId,
            extensionVersion: extensionVersion,
        };
        try {
            axios
                .post(`${apiHerf}/tracking/vsCodeOperationRecord`, startParam, {
                    proxy: false,
                    timeout: 1000,
                })
                .then((res) => {
                    console.log("开始请求测试", res);
                    let commandid = res.data.data.id || "";
                    resolve(commandid);
                })
                .catch((err) => {
                    reject("error");
                });
        } catch (err) {
            reject("");
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
    return new Promise((resolve, reject) => {
        if (commandid === "") {
            reject("No command id");
        }
        let endparam = {
            id: commandid,
            requestPhase: "end",
            outputContent: privacy ? acceptItem : null,
            modelStatus: -1,
            message: message, //err.message,
            num: privacy ? completions?.length : 0,
            numContent: privacy ? completions?.toString() : null,
            whetherAdopt: isAdopted,
            extensionId: extensionId,
            extensionVersion: extensionVersion,
        };
        try {
            axios
                .post(`${apiHerf}/tracking/vsCodeOperationRecord`, endparam, {
                    proxy: false,
                    timeout: 1000,
                })
                .then((res) => {
                    console.log("测试结束埋点", res);
                    resolve("");
                })
                .catch((e) => {
                    console.log("结束埋点错误", e);
                    reject("error");
                });
        } catch (e) {
            reject("error");
        }
    });
}
export function getTotalRequestNum(): Promise<number> {
    return new Promise((resolve, reject) => {
        try {
            axios
                .get(
                    `${apiHerf}/tracking/selectByVscodeMachineIdTotal?vscodeMachineId=${vscode.env.machineId}`,
                    { proxy: false }
                )
                .then((res) => {
                    console.log("获取总请求数", res);
                    if (res.data.code === 200 && res.data.data) {
                        resolve(res.data.data);
                    } else {
                        reject("error");
                    }
                });
        } catch (e) {
            console.log(e);
            reject("error");
        }
    });
}
