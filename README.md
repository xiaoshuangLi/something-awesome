# devtool
基于 webpack 的简单脚手架，使用react，react-router管理路由。

使用步骤:

```bash
 npm install
 npm run build
 npm run dev
```
## css => /css 公用scss
- base.scss 基本的样式
- func.scss 公用的scss代码

## img => /img 公用的图片
```scss
$img: '~img/ed.jpeg'; // scss中直接引用
```
- img_inline.svg 引用svg，返回react组件使用
— img_b.jpeg 返回data:base:64 图片编码

## js => /js 
- /common  公用的js方法
- /component 公用组件
- /container 页面

- /container/global 页面配置文件夹
- /container/global/routes.js 配置页面路径
- /container/global/reducers.js 配置redux

- /container/home/route.js 每个页面下路径配置
- /container/home/reducer.js 每个页面下reducer配置
