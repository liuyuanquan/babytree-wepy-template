# 宝树号微信小程序

## 开发规范

- 页面组织，页面开发，禁止把样式，模板都写在一个文件中，不便于代码阅读

- 目录介绍

**反模式**

```
  <style lang='less'>
    .test {
      color: #fff;
    }
  </style>

  <template lang='wxml'>
    <view class='test'>test</view>
  </template>
  
  <script>
    // some code...
  </script>
```

**推荐模式**

将 less 样式和 wxml 模板独立出来，通过对应标签应进去

index.less
```
  .test {
    color: #fff;
  }
```

index.wxml
```
  <view class='test'>test</view>
```

index.wpy
```
  <style lang='less' src='index.less' />
  <template src='index.wxml'>

  <script>
    // some code ...
  </script>
```

- 页面中所有的请求独立出来，放到 `services` 与页面相同的目录中，而且对请求后的数据的处理过程要在这里进行，保证 .wpy 页面纯粹的业务逻辑，同时能保证每个文件中的代码量都足够小，且职能足够单一。

- 公共的工具类放在 `utils` 目录中

- 每个接口，都必须在 `mock` 文件夹中提供对应接口的 mock 数据

- 项目的配置位于 `config/app.yaml`

- 目录介绍

```
├── README.md                项目描述
├── config                   项目配置
│   └── app.yaml
├── dist                     打包后的源码目录
├── mock                     本地mock
│   └──  mock.json
├── package-lock.json
├── package.json
├── project.config.json
├── scripts                  构建脚本
│   ├── build.js
│   └── mockServer.js
├── src                      开发目录
│   ├── app.wpy
│   ├── components           组件目录
│   ├── config               配置目录(编译生成，请勿修改)
│   ├── images
│   ├── mixins
│   ├── pages
│   ├── services             页面数据请求层存放目录
│   ├── stat                 页面埋点存放目录
│   └── utils                工具函数目录
└── wepy.config.js           构建脚本入口
```

# 项目启动

```
  cd wx-babytree-topline
  npm i
  npm start
```

## 切换至 test 环境

```
  npm run build:test
```

## 切换至预发环境

```
  npm run build:pre
```

## 发布至生产环境

```
  npm run build:prod
```
