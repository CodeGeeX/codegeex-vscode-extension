// Get access to the VS Code API from within the webview context
const vscode = acquireVsCodeApi();

// Just like a regular webpage we need to wait for the webview
// DOM to load before we can reference any of the HTML elements
// or toolkit components
window.addEventListener("load", main);

// Main function that gets executed once the webview DOM loads
function main() {
  const interactiveButton = document.getElementById('interactive-button');
  interactiveButton.addEventListener('click',()=>{
    vscode.postMessage({
      command:'code.interactive'
    })
  })
  setVSCodeMessageListener();
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
      case "code.interactive":
        const dataCodegeex = JSON.parse(event.data.resultCodegeex) ;
        const dataCodex = JSON.parse(event.data.resultCodex);
        let data=[];
        for(let i = 0;i<dataCodegeex.length;i++){
            data.push([dataCodegeex[i],'codegeex'])
        }
        for(let i = 0;i<dataCodex.length;i++){
            data.push([dataCodex[i],'codex'])
        }
        data.sort(function(a,b){
            return b[0].length-a[0].length
        })
        
        const resultDiv = document.getElementById('results-area');
        const len = resultDiv.getElementsByTagName('div').length;
        for(let i = 0;i<len;i++){
            resultDiv.removeChild(resultDiv.childNodes[0]);
        }
        const time = new Date().getTime();
        for(let i = 0;i<data.length;i++){
            let div = document.createElement('div');
            let textarea = document.createElement('textarea');
            textarea.innerHTML=data[i][0];
            textarea.id=`result-${time}-${i}`
            div.appendChild(textarea);
            let table = document.createElement('table');
            let tr = document.createElement('tr');
            let th1 = document.createElement('th');
            let title = document.createElement('span')
            title.innerHTML = `Generate by ${data[i][1]}`
            title.style.color='white'
            th1.appendChild(title);
            th1.style.width='60%'
            tr.appendChild(th1)
            let th2 = document.createElement('th')            
            let buttonInsert = document.createElement('button');
            let imgInsert = document.createElement('img');
            imgInsert.src = 'https://lfs.aminer.cn/misc/wangshan/pretrain/codegeex/insert.svg'
            imgInsert.alt=''
            //buttonInsert.innerHTML='Insert'
            buttonInsert.appendChild(imgInsert);
            let p1 = document.createElement('p');
            p1.value='Insert';
            buttonInsert.append('Insert')
            //buttonInsert.appendChild(p1);
            buttonInsert.id = `button-${time}-result${i}`
            buttonInsert.addEventListener('click',()=>{
                vscode.postMessage({
                    command:'code.interactive.insert',
                    code:data[i][0]
                })
            })
            th2.appendChild(buttonInsert)
            tr.appendChild(th2)
            //div.appendChild(buttonInsert)
            let th3 = document.createElement('th');
            let copyButton = document.createElement('button');
            let imgCopy = document.createElement('img');
            imgCopy.src = 'https://lfs.aminer.cn/misc/wangshan/pretrain/codegeex/copy.svg'
            imgCopy.alt=''
            copyButton.appendChild(imgCopy);
            copyButton.append('Copy')
            copyButton.id = `button-${time}-result${i}`
            copyButton.addEventListener('click',()=>{
                textarea.select()
                document.execCommand('copy');
            })
            //div.appendChild(copyButton)
            th3.appendChild(copyButton);
            tr.appendChild(th3)
            table.appendChild(tr)
            div.appendChild(table)
            resultDiv.appendChild(div);
        }
        break;
    }
  });
}

function displayData(data) {
 const summary = document.getElementById("summary");
 summary.value = data//.replaceAll('\n','<br/>').replaceAll(' ','&ensp;')
  //summary.textContent = data
}