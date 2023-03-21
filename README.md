<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba7e0f58d09a440794628f5594b393ec~tplv-k3u1fbpfcp-zoom-crop-mark:1512:1512:1512:851.awebp?"/>

这是一个基于[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) 的API开发的 高颜值 多端 第三方音乐项目。

<p align="center">
<a style="display: block;" href="https://static-mp-d22f2f25-96ec-4381-920f-a0d8df227b60.next.bspapp.com/LVMusic">PC: LVMusic</a>
<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd7046051dcc4722ab3d342031b0e21f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?"/>
</p>

## ☀️ 亮点
- ✅ 拥有 Apple Music 的颜值，玻璃拟态风格
- ✅ 简约大气、无广告
- ✅ 轻量 打包后体积一共 316kb，运行在 Chrome 后 memory 大概 7M 左右，加载的数据多了会大一些
- ✅ KeepAlive 实现组件缓存
- ✅ 异步加载组件 按需加载
- ✅ 多端适配（wx 小程序、PC）
- ✅ 网易云扫码登录（PC 很方便；小程序需要截图再扫码，没有找到对接微信登录的接口🙁）
- ✅ 暗黑模式适配
- ✅ 按照显示宽高请求图片，不让浏览器去缩放，提升性能

## 👨🏿‍💻 技术选型
- 技术栈没得说了，拥抱 Vite、Vue3
- 没有多端经验，那就用 uni 吧，我倒是要看看是不是像吹得那么牛逼
- 全局状态管理没的说 pinia
- 路由就不需要了，毕竟小项目嘛，逻辑不太复杂，页面也不多，就不用 VueRouter 了，整个动态组件就 OK
- i18n 也不需要了，项目简单，用 pinia 也能玩
- css 扩展——sass, 抽离 css 变量，维护更方便
- UI 组件库就不用了，uni 内置组价够用，别的就自己封装吧
- 图标 iconfont 找了一套字体图标
- 图片素材也是 iconfont 找的
- logo 来自 [标小智](https://www.logosc.cn/), 输入关键字会生成很多可选的 logo，然后需要付费下载，付费是不存在的！直接给水印去掉，再利用 Chrome 的 screenshot 拿到图片（清晰度不好，再找个网址修复下，哈哈）
- UI 方面，我直接抄了 Apple Music 和 网易云音乐 的作业😄

## 📜 开源许可
本项目仅供个人学习研究使用，禁止用于商业及非法用途，由使用者造成的所有违法违规后果与本项目及本人无关。

基于 MIT license 许可进行开源。

## 🎆 界面展示
### 推荐页
#### PC
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31162ef24fe846b09336ddc2e211283b~tplv-k3u1fbpfcp-watermark.image?)
#### wx小程序
<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2d3118bfa1c4f6f9d9af83db98f60af~tplv-k3u1fbpfcp-watermark.image?" alt="" width="50%" /></p>

### 我的
#### PC
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2374937bb2d415e9dd7f33e9ce4c4ef~tplv-k3u1fbpfcp-watermark.image?)
#### wx小程序
<p align=center>
<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa44bfa1f82647fe81c9ccd05dd8ef8d~tplv-k3u1fbpfcp-watermark.image?" alt="" width="50%" />
</p>

### 歌单页
#### PC
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6f419fe8b2743cabcc45058a7f1f066~tplv-k3u1fbpfcp-watermark.image?)
#### wx小程序
<p align=center>
<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/deeead38a3f14ea88295fb06f635fcb2~tplv-k3u1fbpfcp-watermark.image?" alt="" width="50%" />
</p>

### 歌曲列表
#### PC
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/897ad7c077a94c2e96be6b6d24fb4cb9~tplv-k3u1fbpfcp-watermark.image?)
#### wx小程序
<p align=center>
<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56774c8874b14d1fa60c1f02f5c6ecad~tplv-k3u1fbpfcp-watermark.image?" alt="" width="50%" />
</p>

### 播放器界面
#### PC
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/857a22ef69374c1b994c61ba87660870~tplv-k3u1fbpfcp-watermark.image?)

#### wx小程序
<p align=center><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce265f7d45634f8eb7968a827d3381d9~tplv-k3u1fbpfcp-watermark.image?" alt="" width="50%" /></p>

## 封装组价梳理
在项目中，我封装了很多基础组件 和 业务组件。

### 基础组件
| 组件 | 组件用处 |
| --- | --- |
|  NoData | 无数据组件 |
|  NoLogin | 未登录组件 |
|  Message | 提示消息 |
|  Loading | 数据加载中组件（h5是指令，小程序不支持指令） |
|  LazyLoader | 图片懒加载组件 |
|  PageFrame | 页面容器组件，向下滚动标题吸顶，滑到底部加载更多数据 |
|  Process | 进度条组件 |

### 业务组件
| 组件 | 组件用处 |
| --- | --- |
|  SongListItem | 歌曲条目组件 |
|  SongSheet | 歌曲组件 |
|  Category | 歌单列表 |
|  Search | 搜索组件，防抖处理 |
|  Player | 播放器组件 |
|  MySpace | 我的 |
|  Recommend | 推荐页 |
|  ...... | ...... |

## 二次开发、学习
### 前端
```
git clone https://github.com/lv-z-l/LVMusic.git

//启动
yarn dev:h5
```
接口请参考：[NeteaseCloudMusicApi](https://binaryify.github.io/NeteaseCloudMusicApi/)
启动后再 .env.development 中更改对应的代理地址即可。

## 部署相关
- 前端使用 [unicloud](https://unicloud.dcloud.net.cn/)托管
- 接口使用 [腾讯云服务](https://cloud.tencent.com/)部署，三个月额度内免费（NeteaseCloudMusicApi文档写的十分详细）