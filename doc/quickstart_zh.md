# CodeGeeX插件开发调试教程

欢迎使用CodeGeeX自动代码生成插件（VS Code版），您可以对插件进行自定义开发与调试，以下是一个简单的教程。

- **克隆源码**
  - ```git clone git@github.com:CodeGeeX/codegeex-vscode-extension.git```
  - ```cd codegeex-vscode-extension```

- **安装依赖** 
  - 通过```npm install```安装```package.json```中所需要的依赖。

- **修改配置文件**
  - 在```src/localconfig.ts```文件中配置您自己ApiKey及ApiSecret，需要在[天启API平台](https://tianqi.aminer.cn/)上进行申请。
  - 如需要数据统计功能，需要在herf填写相应地址；如不需要，可设置```enableStats=false```。

- **运行和调试**
  - 在VS Code左侧菜单栏中进入“运行和调试”模式（Run and Debug），点击```Run Extension```即可进行调试。
  - 如果对插件代码进行更改，可以通过```cmd+R```重新加载插件。

- **生成安装包**
  - 通过```npm install -g vsce```安装打包工具
  - 运行```vsce package```即可生成```.vsix```安装包。
  - VS Code插件中选择```Install from VSIX```即可安装。

如果您有任何建议或为CodeGeeX开发了有趣的新功能，欢迎提Issues和Pull Request。联系我们：[codegeex@aminer.cn](mailto:codegeex@aminer.cn)。