---
tags:
  - osu!danser
  - guide
comments: true
---

# osu!danser 入门指南 - 1

osu!danser 是一款由 @Wieku 开发的 osu!standard 可视化程序。截至发布日期，它已经支持 Windows 和 Linux 操作系统，并且支持图形界面的操作。**目前 osu!danser 仅有英文版本。**

软件自带默认配置，开箱即用。当然，如果在此基础上基于个人喜好对其进行一些细微调整，就可将其用作个人展示、谱面观赏的优质工具。

本文所描述的各种功能及界面截图仅供参考，如果有出入，可能是因为版本不同。本文参考的是 `0.9.1` 版本。

## 获取 {#Get}

在 Github 上可以下载 osu!danser 的最新版本。具体链接：[danser-go](https://github.com/Wieku/danser-go/releases)。网页最上面的位置是最新版本（标有绿色标签 `Latest`），可以根据个人的操作系统下载对应版本。

网站下载的是 zip 格式的压缩文件，需要将其解压到单独的文件夹中才能正常使用。

## 使用 {#Usage}

截至发布日期，最新版本提供了两种使用 osu!danser 的方式：图形界面 (danser.exe) 和命令行 (danser-cli.exe)。

出于易用性考虑，本文主要介绍使用图形界面的方法，命令行配置可以参照[此文章](https://www.bilibili.com/read/cv12700695)。

直接双击运行 `danser.exe` 即可。启动时会弹出一个主窗口和一个命令行窗口（主要用于显示日志），关闭任一窗口均可退出程序。

![osu!danser 主界面](img/danser-main.png)

### 模式选择 {#Modes}

osu!danser 提供了下列几种模式：

| 模式 | 介绍 |
| :-- | :-- |
| `Cursor dance / mandala / tag` | **沉浸式**观看自动游玩过程，可设置光标镜像与 tag |
| `Cursor dance with UI` | 观看自动游玩过程，但显示 HUD |
| `Watch a replay` | 播放保存到本地的回放 |
| `Watch a knockout` | 一次选中多个回放，显示一次游玩中多个玩家（包括 Auto）的光标轨迹、按键、准确度及等级（类似于多人同屏） |
| `Play osu!standard` | 玩玩 osu! 标准模式 |


各种模式的细节都可以在设置中调整，会在下文具体介绍。

### 谱面选择 {#Beatmap-Selection}

使用 Cursor dance 和 Play osu!standard 模式时可以直接选择谱面。如果安装了 osu!， osu!danser 会在 `C:\Users\<当前用户名>\AppData\Local\osu!\Songs` 搜索谱面。

点击按钮后会弹出一个简易谱面选择页面。可以在列表中选择谱面，也可以打字搜索。可以按标题、艺术家、制图者、导入日期、难度升序或降序排序（使用 `Sort by:` 右侧的按钮），目前还不支持按条件筛选。点击 `Random` 随机选择谱面。

每组图的标题右侧有两个按钮，分别用来在浏览器中显示谱面详细信息、播放预览。鼠标悬停在难度名上会显示各难度的背景图片和详细信息。

![谱面选择](img/map-selection.png)

![难度详细信息](img/map-detail.png)

!!! info "数据库更新提示"

    如果`Songs` 文件夹有改动，会提示你更新数据库，直接更新即可。
    ![数据库更新提示](img/confirm-db.png)

### 一般设置 {#Setting}

可以通过主界面的按钮调节各种设置。各种按钮用途如下。

| 按钮 | 介绍 |
| :-- | :-- |
| `Speed/Pitch` | 调节播放速度和音调，类似于 osu!lazer 中模组的自定义设置，二者调节范围均为 `0.10-3.00` 倍 |
| `Time/Offset` | 调节播放的起止时间，以及音频延迟，也可以选择跳过谱面开头。最新版本中新加入了难度图显示 ![界面显示](img/button-to.png) |
| `Mods` | 选择模组，大致与 osu! 中相同 |
| `Adjust difficulty` | 调节谱面的 AR 和 CS 值，类似于 osu!lazer 中的 DA 模组 |
| `Mirrors/Tags` | **仅限 `Cursor dance / mandala / tag` 模式。**`Mirrored cursors` 设置镜像显示的光标数，`Tag cursors` 设置共同完成谱面的光标数 |

下面是对比图。

![正常游玩](img/cp-normal.png)
![设置 Mirror Cursors = 3](img/cp-mirror.png)
![设置 Tag Cursors = 3](img/cp-tag.png)

### 操作选择 {#Exec}

主界面底部有操作选项的设置：

| 选项 | 介绍 |
| :-- | :-- |
| `Watch` | 直接在窗口中观看 |
| `Record` | 将对应模式导出为视频，适合分享与上传投稿 |
| `Screenshot` | 获取过程中某一特定时间点截图，时间点可以在 `Configure` 中设置 (`Screenshot at`) |

对于录制和截图，可以手动设置输出文件名 (`Output name`)，也可留空，此时导出的文件名为 `danser_<年月日>_<时分秒>`。

## 配置 {#Configure}

可以通过配置来改变 osu!danser 的行为，使其更加贴合自己的喜好，或者用于展示目的。

### 启动器配置 {#Launcher}

![启动器配置](img/setting-launcher.png)

比较重要的选项：

| 选项 | 介绍 |
| :-- | :-- |
| `Load latest replay on startup` | 在每次启动时，自动选择上次的模式与谱面/回放设置 |
| `Show JSON paths in config editor` | 鼠标悬停在选项文本上时，会显示配置文件中对应的键，方便手动设置[^1] |
| `Show exported videos/images in explorer` | 当选择录制或截图时，导出文件完成后会在资源管理器中显示导出的文件 |
| `Preview selected maps` | 选中谱面后会播放一段时间的预览音频，音量可在下方调节 |

### 详细设置 - 基本 {#Basic-Setting}

osu!danser 使用 json 文件来保存不同配置，可以在软件目录中找到。如果想创建新配置，可以打开 `Config:` 下拉菜单，选择 `Create new...`，以便切换。右击配置名可以进行复制、重命名、删除操作。单击 `Edit` 进入详细设置页面。

![配置管理](img/config.gif)

!!! warning "注意"

    建议不要轻易改动 `EXPERIMENTAL` 下的选项。带有 `(!)` 的选项，鼠标移到文字上方会显示提示。

#### 文件路径 (General) {#General}

![路径配置](img/file-storage.png)

如果遇到没有谱面或皮肤的问题，大多是由于路径设置不当。可以找到图示中的三个路径选项，如果不对，可以点击 `Browse` 进行修改，也可以直接输入。

#### 环境设置 {#Env}

osu!danser 提供了与 osu! 相似的设置项，可以对照 osu! 中的设置在其中更改。

默认情况下 osu!danser 不会使用皮肤中的光标和谱面中的 Combo 颜色，需要手动勾选 `Use skin cursor` 和 `Use beatmap colors`。除此之外，默认配置应该已经满足日常使用的基本需求。

---

## 备注

[^1]: 具体表示方法可见 `setting` 文件夹下的 `.json` 文件
