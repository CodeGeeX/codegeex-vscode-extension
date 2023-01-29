// Get access to the VS Code API from within the webview context
const vscode = acquireVsCodeApi();
// Just like a regular webpage we need to wait for the webview
// DOM to load before we can reference any of the HTML elements
// or toolkit components
window.addEventListener("load", main);

// Main function that gets executed once the webview DOM loads
function main() {
    const tranlateButton = document.getElementById("translate-button");
    tranlateButton.addEventListener("click", () => {
        const original = document.getElementById("original").value;
        if (original.length > 0) {
            const srcLang = document.getElementById("srcLang").value;
            const dstLang = document.getElementById("dstLang").value;
            const translateButton = document.getElementById("translate-button");
            translateButton.disabled = true;
            // Passes a message back to the extension context with the location that
            // should be searched for and the degree unit (F or C) that should be returned
            vscode.postMessage({
                command: "code.translate",
                original: original,
                srcLang: srcLang,
                dstLang: dstLang,
            });
        } else {
            vscode.postMessage({
                command: "code.translate.inputError",
            });
        }
    });
    const insertButton = document.getElementById("insert-button");
    insertButton.addEventListener("click", () => {
        const result = document.getElementById("test");
        vscode.postMessage({
            command: "code.insert",
            result: result.innerText,
        });
    });
    const original = document.getElementById("original");
    // const dstLangOption = document.getElementById("dstLang");
    // dstLangOption.addEventListener("change", () => {
    //     const dstLang = dstLangOption.value;
    //     displayData('',dstLang)
    // })
    setVSCodeMessageListener();
}

function tranlate() {
    const original = document.getElementById("original").value;
    if (original.length > 0) {
        const srcLang = document.getElementById("srcLang").value;
        const dstLang = document.getElementById("dstLang").value;
        const translateButton = document.getElementById("translate-button");
        translateButton.disabled = true;
        // Passes a message back to the extension context with the location that
        // should be searched for and the degree unit (F or C) that should be returned
        vscode.postMessage({
            command: "code.translate",
            original: original,
            srcLang: srcLang,
            dstLang: dstLang,
        });
    } else {
        vscode.postMessage({
            command: "code.translate.inputError",
        });
    }
}
function insert() {
    const original = document.getElementById("original").value;
    // Passes a message back to the extension context with the location that
    // should be searched for and the degree unit (F or C) that should be returned
    vscode.postMessage({
        command: "code.insert",
        original: original,
    });
}

// Sets up an event listener to listen for messages passed from the extension context
// and executes code based on the message that is recieved
function setVSCodeMessageListener() {
    window.addEventListener("message", (event) => {
        const command = event.data.command;

        switch (command) {
            case "code.translate":
                const data = event.data.payload;
                const lang = event.data.lang;
                displayData(data, lang);
                break;
            case "code.changeDstLang":
                const dstLang = document.getElementById("dstLang");
                if (dstLang.value !== event.data.dstLang) {
                    dstLang.value = event.data.dstLang;
                    //displayData('',dstLang);
                }
        }
    });
}

function displayData(data, lang) {
    const summary = document.getElementById("test");
    summary.className = lang;

    if (summary.childNodes) {
        let len = summary.childNodes.length;
        for (let i = 0; i < len; i++) {
            summary.removeChild(summary.childNodes[0]);
        }
    }
    summary.append("\n");
    summary.append(data);
    highlight();
    const translateButton = document.getElementById("translate-button");
    translateButton.disabled = false;
}
