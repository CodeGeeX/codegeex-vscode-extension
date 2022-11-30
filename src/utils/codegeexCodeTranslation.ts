import getDocumentLangId from "./getDocumentLangId";
import { Uri } from "vscode";
import { navUri } from "./navUri";
import { addSignal, andSignal, myScheme } from "../param/constparams";

//generate uri for translation mode
export const codegeexCodeTranslation = async (
    dstLang: string,
    translationRes: string,
    commandid: string
) => {
    let documentLangId;
    documentLangId = getDocumentLangId(dstLang);
    let uri = Uri.parse(
        `${myScheme}:CodeGeeX_translation?loading=false&mode=translation&commandid=${commandid}&translation_res=${translationRes
            .replaceAll("+", addSignal)
            .replaceAll("&", andSignal)}`,
        true
    );

    await navUri(uri, documentLangId, "CodeGeeX_translation");
};
