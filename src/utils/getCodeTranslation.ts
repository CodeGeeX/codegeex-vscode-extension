import axios from "axios";
import * as https from "https";
import { apiKey, apiSecret } from "../localconfig";
import { temp, topk, topp } from "../param/configures";
export type GetCodeTranslation = {
    translation: Array<string>;
};
export function getCodeTranslation(
    prompt: string,
    src_lang: string,
    dst_lang: string
): Promise<GetCodeTranslation> {
    const API_URL = `https://tianqi.aminer.cn/api/v2/multilingual_code_translate`;

    return new Promise((resolve, reject) => {
        let payload = {};
        payload = {
            prompt: prompt,
            n: 1,
            src_lang: src_lang,
            dst_lang: dst_lang,
            stop: [],
            userid: "",
            apikey: apiKey,
            apisecret: apiSecret,
            temperature: temp,
            top_p: topp,
            top_k: topk,
        };
        const agent = new https.Agent({
            rejectUnauthorized: false,
        });

        axios
            .post(API_URL, payload, { proxy: false, timeout: 120000 })
            .then((res) => {
                if (res?.data.status === 0) {
                    let codeArray = res?.data.result.output.code;
                    const translation = Array<string>();
                    for (let i = 0; i < codeArray.length; i++) {
                        const translationStr = codeArray[i]; //.trimStart()
                        let tmpstr = translationStr;
                        if (tmpstr.trim() === "") continue;

                        translation.push(translationStr);
                    }
                    resolve({ translation });
                } else {
                    console.log(res);
                    reject("failed");
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}
