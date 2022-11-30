export default function getDocumentLangId(lang: string) {
    let id;
    lang = lang.replace("++", "pp").replace("#", "sharp");
    switch (lang) {
        case "Cuda":
            id = "cuda-cpp";
            break;
        case "Shell":
            id = "shellscript";
            break;
        default:
            id = lang.toLowerCase();
    }
    return id;
}
