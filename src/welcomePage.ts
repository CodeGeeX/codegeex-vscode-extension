import { EventEmitter } from "stream";
import { ExtensionContext, WebviewPanel, window } from "vscode";
import createWebView from "./utils/createWebView";
import { controls } from "./param/configures";

let panel: WebviewPanel | undefined = undefined;
export default async function welcomePage(
    context: ExtensionContext
): Promise<void> {
    const content = `
    <div style='padding: 30px; margin-left: 10px; margin-right:10px;text-align: left; text-align: center;min-width:500px' >
        <div style ='background: linear-gradient(135deg, #374199 0%, #2090E3 50%, #515BBA 100%);filter: blur(500px); width: 317px; height:266px; position: absolute; left: calc(50% - 158px); z-index: -1; opacity:1'></div>
        <style>
            .slice {
                position: absolute; 
                width: 218px; 
                height:119px; 
                top: 0; 
                left: max(15px, 50vw - 275px);
                z-index: -1;
            }
        </style>
        <img src='https://lfs.aminer.cn/misc/wangshan/pretrain/codegeex/static/Slice_1.png' alt='' class='slice'/>
        <div style='font-size: 40px; display: flex; flex-direction: row; justify-content: center;align-items:center'><img src='https://lfs.aminer.cn/misc/wangshan/pretrain/codegeex/codegeex_icon.png?123' alt='' style='width: 65px; height: 65px;'/>Welcome to CodeGeex
        </div>
        <br/>
        <div>A Free Code Generation and Completion Tool</div>
        <br/>
        <div>CodeGeeX is an AI code assistant tool for developers which makes coding easier and faster. CodeGeeX supports 20+ different programming languages, including Python, C++, Java, JavaScipt, Go, C, C#, Cuda, Objective-C/C++, PHP, HTML, TypeScript, Rust, Shell, SQL, TeX, etc.</div>
        <br/>
        <style>
            .button {
                background: rgba(0,0,0,0.25); 
                margin:10px;
                color: white;
                border-radius: 9px 9px 9px 9px;
                opacity: 1;
                border: 2px solid rgba(31, 70, 146, 1);
                font-size: 11px;
                width: 115px;
                height: 30px;
            }
            .gif {
                opacity: 1;
                margin-top: 10px;
            }
            .keycommand {
                height: 20px;
                border:1px solid gray;
                background: white;
                border-radius: 3px 3px 3px 3px;
                color: gray;
            }
        </style>
        <div>
            <button onclick='switchTo(1)' class='button' id='btn1'>Stealth Mode</button>
            <button onclick='switchTo(2)' class='button' id='btn2'>Interactive Mode</button>
            <button onclick='switchTo(3)' class='button' id='btn3'>Translation Mode</button>
            <button onclick='switchTo(4)' class='button' id='btn4'>Prompt Mode</button>
        </div>
        <br/>
        <div style='border: 2px solid rgba(31, 70, 146, 1); margin-left: 5vw;margin-right: 5vw;border-radius:9px 9px 9px 9px; padding: 20px; font-size: 12px'>
            <div id="show1">
                <div>Keep CodeGeeX activated, it will start generating codes when you stop writing (the icon at the bottom of VSCode starts spinning). When the generated code is shown in gray, just press <span class='keycommand'>&nbsp;Tab&nbsp;</span>  to insert the generated codes. You can also press <span class='keycommand'>&nbsp;Alt/Option+[ or ]&nbsp;</span> to change between candidates.  And you can press <span class='keycommand'>&nbsp;Alt/Option+N&nbsp;</span> to get new suggestions if you are not satisfied with the current. </div>
                <img src='https://lfs.aminer.cn/misc/wangshan/pretrain/codegeex/bubble_sort_go.gif' alt=''class='gif'/>
            </div>
            <div id='show2'>
                <div>Press <span class='keycommand'>&nbsp;Ctrl+Enter&nbsp;</span> to activate the interactive mode, CodeGeeX will generate X candidates and show them in the right panel (X can be modified in extension settings Candidate Num). Then, select the best candidate by clicking on it.</div>
                <img src='https://lfs.aminer.cn/misc/wangshan/pretrain/codegeex/interactive_mode2.gif' alt='' class='gif'/>
            </div>
            <div id="show3">
                <div>Select code, and press <span class='keycommand'>&nbsp;Ctrl+Alt+T&nbsp;</span> to activate the translation mode. Then, choose the language of the selected code. You will get the code translated into the same language as your current editor. Click on the use code button to insert the result. You can also configure in the settings whether to comment out the original code or to replace it.</div>
                <img src='https://lfs.aminer.cn/misc/wangshan/pretrain/codegeex/translation_cpp_to_python.gif' alt='' class='gif'/>           
            </div>
            <div id="show4">
                <div>Select codes to be used as input, then press <span class='keycommand'>&nbsp;Alt/Option+T&nbsp;</span> to trigger the prompt mode. It will show a list of pre-defined prompt templates and choose one to generate codes with your input. This mode is fully customizable, you can add your own templates in the extension settings Prompt Templates. </div>
                <img src='https://lfs.aminer.cn/misc/wangshan/pretrain/codegeex/explanation_python.gif' alt='' class='gif'/>
            </div>
        </div>
        <script>
        function switchTo(num){
            for(let i=1;i<=4;i++){
                if(i===num){
                    document.getElementById('show'+i).style.display = 'block';
                    document.getElementById('btn'+i).style.background = '#1F4692'
                }else{
                    
                    document.getElementById('show'+i).style.display = 'none';
                    document.getElementById('btn'+i).style.background = 'rgba(0,0,0,0.25)';
                }
            }
        }
        switchTo(1);
        </script>
    </div>`;
    await createWebView(context, content);
}

const keys = `
<table style='min-width: 600; border: 3px solid #333' width='100%'>
<tr>
    <th>Command</th>
    <th>MAC</th>
    <th>Windows</th>
</tr>
<tr>
    <td>Switch to Interactive Mode</td>
    <td>${controls.interactiveMode.mac}</td>
    <td>${controls.interactiveMode.win}</td>
</tr>
<tr>
    <td>Switch to Prompt Mode</td>
    <td>${controls.promptMode.mac}</td>
    <td>${controls.promptMode.win}</td>
</tr>
<tr>
    <td>Switch to Translation Mode</td>
    <td>${controls.translationMode.mac}</td>
    <td>${controls.translationMode.win}</td>
</tr>
<tr>
    <td>Next Suggestion</td>
    <td>${controls.nextSuggestion.mac}</td>
    <td>${controls.nextSuggestion.win}</td>
</tr>
<tr>
    <td>Previous Suggestion</td>
    <td>${controls.previousSuggestion.mac}</td>
    <td>${controls.previousSuggestion.win}</td>
</tr>
<tr>
    <td>Get New Suggestions</td>
    <td>${controls.newSuggestion.mac}</td>
    <td>${controls.newSuggestion.win}</td>
</tr>
</table>
`;
