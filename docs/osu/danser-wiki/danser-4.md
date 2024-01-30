---
tags:
  - osu!danser
  - guide
comments: true
---

# osu!danser 入门指南 - 4

此文章将讲解 Knockout 中的机制与设置，以及其他的东西。

## Knockout 模式 {#knockout}

Knockout 模式可以同时加载**同一难度**的多次回放，以达到如下目的：

- 多人同屏游玩展示（突破时空限制）
- 比较个人练习情况
- 模拟比赛或回顾比赛（比如下载全球前 50 玩家游玩谱面的回放）
- 整活

### 操作 {#inst}

1. 准备好同一难度的回放文件（模组任意）。
2. 在 osu!danser 的 `Watch knockout` 模式下选择所有回放文件。
3. 点击 `Manage`，会显示回放相关信息。可以勾选要显示的回放。
4. 准备完毕，现在可以开始了。

### 设置 {#setting}

Knockout 模式本身有多种变体：

- `Combo Break`: 断连即淘汰。
- `Max Combo`: 具体的效果不确定。
- `Replay Showcase`: 所有玩家的回放展示，在玩家未得到 300 分时显示气泡。
- `Vs Mode`: 对决模式，具体的效果不确定。
- `SS or Quit`: 类似于 Perfect 模组下的游玩，非 SS 即淘汰。

相关的设置项如下：

| 设置 | 介绍 |
| :-- | :-- |
| `Hide mods` | 隐藏对应模组，用大写双字母缩写表示，目前还有问题 |
| `Minimum alive players` | 仅在剩余玩家大于此数目时才进行淘汰 |
| `Revive players at end` | 在游玩结束时复活玩家 |
| `Live sort` | 排行榜实时更新 |
| `Sort by` | 排行依据 |
| `Hide overlay on breaks` | 休息时段隐藏排行榜 |
| `Min / Max cursor size` | 控制光标大小区间 |
| `Add danser` | 添加 Danser |

## 游玩区域设置 {#playfield}

这部分作为对前几节中界面设置的补充列在这里。

| 设置 | 介绍 |
| :-- | :-- |
| `Draw objects / cursors` | 显示物件或光标，可以实现只看光标或只看物件 |
| `Playfield scale / shift` | 移动或缩放游玩区域 |
| `Scale / Move storyboard with playfield` | 随游玩区域移动故事板 |
| `Lead in / fade out time / hold` | 调整谱面正式开始前的等待时间 |
| `Seizure warning` | 内置的光敏癫痫警告，可以调整显示时间，最先显示 |

### 背景设置 {#bkg}

| 设置 | 介绍 |
| :-- | :-- |
| `Load storyboards / videos` | 加载故事板与视频 |
| `Dim` | 调节谱面开始前、游玩中、休息时段期间的背景亮度。数值越高越亮 |
| `Parallax` | 让背景（包括视频与故事板）随光标移动而偏移 |
| `Blur` | 模糊背景 |
| `Triangle` | 在背景前显示向上跃动的三角形 |
| `Logo` | 控制 osu!danser 图标的显示 |
| `Draw spectrum analyzer` | 在 osu!danser 图标上显示频谱 |
| `Bloom` | 为游玩区域元素添加微小发光效果 |
