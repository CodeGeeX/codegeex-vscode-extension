const comment = "<|comment|>";

//function to comment code for different language
export default function commentCode(
    input: string,
    lang: string,
    mode?: string
) {
    if (input.trim() === "") {
        return input;
    }
    const commentSignal = getCommentSignal(lang);
    if (
        mode === "block" &&
        commentSignal.blockLeft &&
        commentSignal.blockRight
    ) {
        return commentSignal.blockLeft + input + commentSignal.blockRight;
    }
    if (mode === "line" && commentSignal.line) {
        return comment + input.replaceAll("\n", "\n" + comment);
    }
    if (commentSignal.blockLeft && commentSignal.blockRight) {
        return commentSignal.blockLeft + input + commentSignal.blockRight;
    }
    if (commentSignal.line) {
        return comment + input.replaceAll("\n", "\n" + comment);
    }
    return input;
}
export function getCommentSignal(lang: string) {
    let commentSignal;
    switch (lang) {
        case "javascript":
        case "javascriptreact":
        case "typescriptreact":
        case "typescript":
        case "java":
        case "c":
        case "csharp":
        case "cpp":
        case "cuda-cpp":
        case "objective-c":
        case "objective-cpp":
        case "rust":
        case "go":
            commentSignal = {
                blockLeft: "/*",
                blockRight: "*/",
                line: "//",
            };
            break;
        case "css":
        case "less":
        case "sass":
        case "scss":
            commentSignal = {
                blockLeft: "/*",
                blockRight: "*/",
                line: null,
            };
            break;
        case "python":
            commentSignal = {
                blockLeft: '"""',
                blockRight: '"""',
                line: "#",
            };
            break;
        case "tex":
            commentSignal = {
                blockLeft: null,
                blockRight: null,
                line: "%",
            };
            break;
        case "shellscript":
        case "r":
            commentSignal = {
                blockLeft: null,
                blockRight: null,
                line: "#",
            };
            break;
        case "sql":
            commentSignal = {
                blockLeft: "/*",
                blockRight: "*/",
                line: "--",
            };
            break;
        case "html":
        case "php":
            commentSignal = {
                blockLeft: "<!--",
                blockRight: "-->",
                line: null,
            };
            break;
        default:
            commentSignal = {
                blockLeft: null,
                blockRight: null,
                line: null,
            };
    }
    return commentSignal;
}
