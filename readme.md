# 简单开发Electron框架
为了做一个代码片段管理器，顺便学习electron，简单搭建开发环境，表现如下。

1. 无框架
2. 多页面开发，在 ``src/pages/`` 目录下新建文件夹，文件夹名称对应页面名称
3. webpack基本配置
4. 热加载electron应用

尚未完善点：

1. htmlWebpackPlugin无法监听html文件的变化，event钩子钩不上所以用 ``webpackDevServer`` 的 ``contentBase`` 来监听变化，导致HMR基本无效，重新刷新整个页面
2. 目前未配置打包发布electron应用，只支持dev

> - clone
> - npm install
> - npm run dev