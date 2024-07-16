---
date:
  created: 2024-07-16
tags:
  - tools
  - video
  - convert
categories:
  - Tools
comments: true
---

# 使用 FFmpeg 合并视频

作为多平台适用的，集音视频录制、转换与推流等众多功能为一体的 [FFmpeg](https://ffmpeg.org)，在日常生活中也会满足一部分需求。本文主要讲讲使用这个极为强大的工具，将 B 站下载的视频转化为可观看形式的过程。<!-- more -->

如果想要了解其更多用法，可以查阅一下[文档](https://ffmpeg.org/ffmpeg.html)。

## 准备与需求

- Windows / Linux 桌面设备（这些是经过测试的，其他平台无法保证），你将在其上安装好 FFmpeg 并进行主要操作。
- FFmpeg，[在官网上下载](https://ffmpeg.org/download.html)
- 你要进行操作的视频（建议安置在安装 FFmpeg 的同一设备上）

对于 Linux 系统，大可使用系统的软件包管理器安装，包名称通常是 `ffmpeg`。

对于 Windows 系统，可以：

- 包管理器：`choco install ffmpeg-full / winget/scoop install ffmpeg`
- 手动下载官网的 `.7z` 或 `.zip` 文件，解压到方便的位置

如果用的是 Android，可以试试 Termux。

## 获取视频

比较友好的方法是使用哔哩哔哩*客户端*的**缓存**视频功能，可以自选要下载的视频质量。下载完成后，在以下地方获取：

- Windows 客户端：用户目录下的 `Videos\bilibili` 文件夹；
- Android 客户端：内部存储主目录的 `Android/data/tv.danmaku.bili/download` 文件夹；

!!! warning "注意"

    对于 Android 客户端用户，操作时请将视频目录**复制出来**到其他地方，data 目录可能有读写限制。

    笔者在 Android 12 与 HarmonyOS 4.2 系统、客户端 8.3.0 上进行了测试，其他版本可能有所不同。

目录下有若干名称为数字的文件夹，其中会有 `.m4s` 扩展名的文件，我们需要使用这些得到视频。

## FFmpeg 转换

FFmpeg 命令行的语法很简单，基本方法：

```sh
ffmpeg -i video1.m4s -i video2.m4s output.mp4
```

其中：

- `-i` 其后一次接一个参数，表示使用的文件；
- 最后的参数是输出的文件；

取决于视频长度与大小（以及设备性能），可能需要一段时间生成视频。命令执行完成后，就可以在所在目录找到输出的视频了。如果想要输出成其他的格式，也是可以改的。
