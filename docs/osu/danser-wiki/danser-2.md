---
tags:
  - osu!danser
  - guide
comments: true
---

# osu!danser 入门指南 - 2

此文章将详细讲解 osu!danser 中的一些配置细节，重点在游玩界面的自定义上。

## osu!danser 中的坐标系 {#Coordinate}

!!! info "阅读提示"

    这里讲述的内容涉及一些数学知识，已经了解的读者可以跳过。

大多数元素位置上的确定与对齐方式都与程序内定的一个坐标系有关。由于其普遍性与统一性，作者就先花一些时间，在这里先行解释。

在 osu!danser 中，以窗口左上角为原点建立坐标系，水平向右对应 X 轴正方向，竖直向下对应 Y 轴正方向。坐标系的数值以 osu! pixel 为单位（这一点有待证实）。由于屏幕分辨率与窗口大小不一定相同（可以理解为全屏窗口是由常规窗口等比例放大而成），所有的坐标值以窗口大小为准。

由此，不难按照上述原则，设置下面一些参数：

| 参数 | 解释 |
| :-- | :-- |
| `Position` | 在坐标系上的*绝对*位置 |
| `Offset` | 多用于 osu! 中原有元素，指示以元素几何中心为原点，建立坐标系上的*相对*位置 |
| `Align` | 默认使用元素的 9 个点（顶部/中间/底部，左侧/中间/右侧），标明此点的坐标用于元素位置的确定 |
| `Size` | 长度 x 宽度 |

## 公共属性 {#Shared}

这里会列出元素中较为常见的设定参数。

| 参数 | 介绍 |
| :-- | :-- |
| `Show` | 控制元素的显示与隐藏 |
| `Opacity` | 控制元素透明度，`100%` 对应完全可见，`0%` 则完全不可见 |
| `Scale` | 控制元素（相对于原大小）的缩放倍数，在原点位置保持不变的情况下进行等比例缩放 |
| `Decimal` | 对于数值，控制显示的小数位数，如 `0` 表示显示整数 |
| `Static` | 移除动态元素的动画效果，以及计数器的数字滚动效果 |
| `Color` | 控制元素颜色 |

设置界面有一个值得注意的控件：颜色选择。

![颜色选择控件示例](img/color-choice.gif)

对于每种颜色设置，会在右侧显示其 RGB 值及一个色块。

- 双击 RGB 对应按钮可直接输入颜色值。
- 在 RGB 按钮上按住鼠标左键左右滑动可快速调节。
- 光标悬停在色块上会显示 16 进制颜色值及 RGB 值。
- 点击色块会弹出调色板。
  - 调色板显示 RGB 与 HSV 值，以及 16 进制颜色值，操作方法同上。
  - 点击 `Current` 下方颜色应用更改，`Original` 则会还原到之前的设置。

## 游玩界面元素 (`Gameplay`) {#Gameplay}

!!! warning "注意"

    下文所述的界面元素自定义设置，只有在 `Cursor dance with UI` 以及 `Watch a replay` 模式下才有效。

为了玩家方便，osu!danser 在 osu! 原有界面元素的基础上，添加了一些新元素，同时对上述所有元素尽可能地添加了个性化设置，以便自定义 UI 的需要。

下文介绍各种元素时，会记录下其单独的可设置属性。

![游玩界面展示](img/ui-example.png)

### 偏差计 {#ErrorMeter}

这类元素记录玩家每次打击在时间与空间上的偏差（以及不稳定率）。

| 参数 | 介绍 |
| :-- | :-- |
| `Show unstable rate` | 在量计下方显示不稳定率 (UR) |
| `Show positional misses` | 在量计上显示 miss 物件对应位置（用红色表示） |

#### 打击偏差计 (`Hit error meter`) {#HitError}

osu! 中的经典偏差计。

| 参数 | 介绍 |
| :-- | :-- |
| `Scale with speed` | 色块长度与速度系数成反比例缩放 |

这个设置的原理由下面的代码得出：

```go
errorPos := error * 0.8
if settings.Gameplay.HitErrorMeter.ScaleWithSpeed {
  errorPos /= meter.diff.Speed
}
```

#### 瞄准偏差计 (`Aim error meter`) {#AimError}

显示每次打击区域在圆圈上的位置。

| 参数 | 介绍 |
| :-- | :-- |
| `Angle normalized` | 在偏差计上显示坐标轴 |

### 计数器 {#Counter}

显示从开始游玩谱面起的一些统计数据。

#### PP 显示 (`PP counter`) {PPCounter}

显示目前的 PP 值。

| 参数 | 介绍 |
| :-- | :-- |
| `Show in results` | 在结果中（视频与界面中，谱面结束后最后若干秒）显示获得的总 PP 值 |
| `Show PP breakdown` | 将总 PP 值分解为瞄准、点击、准确度三个部分分别显示 |

#### 打击结果统计 (`Hit counter`) {#HitCounter}

显示目前打击判定结果，支持显示 300、 100、 50、 miss、断滑条数目。

| 参数 | 介绍 |
| :-- | :-- |
| `Spacing` | 各数目间间距 |
| `Vertical` | 自上而下显示数值 |
| `Show perfect hits` | 显示 300 数目 |
| `Show slider breaks` | 显示断滑条数目 |

### 难度图谱 (`Strain graph`) {#StrainGraph}

显示一个曲线，大致体现整张谱面的物件密度变化情况。

`Outline` 选项启用后，会将图像最上方加粗，与坐标轴围成的部分加深。

### 游玩区域边界 (`Boundaries`) {#Boundaries}

在游玩区域四周绘制边框。

## 剩下的东西

系列文章的内容之前有在 B 站专栏上发表过一部分，有兴趣的读者可以移步前往，传送门：

1. [获取与基本使用](https://www.bilibili.com/read/cv23096754)
2. [基本配置](https://www.bilibili.com/read/cv23105271)
3. [进阶配置 - 元素](https://www.bilibili.com/read/cv23185996/)
