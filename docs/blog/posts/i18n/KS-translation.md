---
date:
  created: 2024-06-22
tags:
  - script
  - renpy
  - i18n
  - game
categories:
  - i18n
comments: true
---

# 关于 Katawa Shoujo 重制版翻译

本文主要讲述我在迁移 Katawa Shoujo 翻译到重制版框架时的过程与一些问题。<!-- more -->

## 序章：背景

Katawa Shoujo 作为一款脍炙人口的 GalGame 游戏，在贴吧与各大游戏论坛中也悄然活跃许久（说是*悄然*，主要是因为里面的部分内容在国内一些平台受限了）。然而，作为原作团队的 Four Leaf Studios 近几年却杳无音信，游戏本身也没有过多的更新，受到外界的关注也极其有限。

随后，另一个游戏制作团队站了出来：**Fleeting Heart Studios**（简称 *FHS*），他们负责将游戏的框架重新翻新整理，同时重建已有的论坛与博客，旨在“实现对可访问性与质量上的优化，在那时是做不到的[^about]”。可以说，他们的目标是**让 KS 再次伟大**（*Make Katawa Shoujo Great Again*, **MKSGA**）。大家可以在 [Codeberg](https://codeberg.org/fhs) 上找到他们。

在我关注到这个项目时，他们已经完成了 KS 的俄语、法语、西班牙语、荷兰语翻译；因为我也在资源站找到了 KS 的原汉化版，就尝试了一下迁移翻译。

## 第一章：问题分析

就翻译文件的结构与处理方式而言，旧版 Ren'py 与新版 Ren'py 8 完全不同：

- 旧版本框架中，原脚本与翻译脚本是独立的，意味着可以单独运行。
- 新版本框架中，翻译脚本基于原脚本使用 SDK 生成，使用一批 `old` `new` 标签标识原文与译文。

框架上的更改，以及原游戏的脚本文件经过了编译处理，为迁移工作带来一些麻烦。我们需要：

- 获取原游戏，反编译脚本
- 从脚本文件中提取字符串，建立对应关系
- 从重置版中提取翻译模板，应用翻译

## 第二章：初步准备

翻译迁移对设备的系统与性能并没有过高的要求，但至少：

- Python **2**（具体原因见下）
- Ren'py 8 SDK：在[官网](https://renpy.org/latest.html)下载
- 顺手的代码编辑器（建议图形编辑器）
- Git（如果你想要向项目做出贡献）
- 稳定干净的网络（以便访问 GitHub 与 Codeberg）
- 进阶的逻辑思维
- 编写脚本的能力（否则会花很长时间！）
- 耐心与决心

如果你之前安装过 Python 3，在安装 Python 2 时请不要将 Python 2 目录添加到 PATH，否则在日后使用会遇到比较大的麻烦。无论如何，也请记住 Python 2 可执行文件的所在目录，以便之后在命令行执行。

### 获取依赖项

首先，从任意来源下载 KS **原版**。解压之后，你应该能在 `game` 目录下找到一批 `.rpyc` 文件。

请复制出以下文件：

- `script-a*-*.rpyc`
- `script-a*-*_ZHS.rpyc`
- `ui_strings.rpyc`
- `ui_strings_ZHS.rpyc`

这些是你需要反编译的目标文件。

使用终端执行以下命令（其他等效的方式也可以）：

```sh
# 拉取 Codeberg 上的 KS:RE 仓库
git clone https://codeberg.org/fhs/katawa-shoujo-re-engineered.git
# 拉取 unrpyc 仓库
git clone https://github.com/CensoredUsername/unrpyc.git
# 如果拉取速度过慢或失败，可尝试使用 SSH 协议拉取
```

此后，将 KS 原版游戏目录下的 `renpy` 文件夹直接复制到刚刚拉取的 `unrpyc` 目录下，这是 unrpyc 工具工作需要的依赖。

### 反编译

有人可能会问了：为啥不直接使用 Release 给的 `bytecode.rpyb` `un.rpy` `un.rpyc` 呢？

其实这几种方法我都试过了，但是都没有用，会报告各种奇怪的错误，如语法错误、模块无对应属性等等，不如直接使用仓库源码。

!!! warning "注意"
    此教程仅针对 KS:RE 讲述。其他游戏的兼容性可能不同，但多数会比较简单，直接使用 Release 里的文件，按步骤操作即可。

值得注意的是，unrpyc 的最新版本代码是面向 Python 3 与 Ren'py 较新版本设计的，无法直接运行。需要手动切换到适合的版本：

```sh
git checkout v1.1.5
```

项目中每个比较稳定的发行版都有一个对应的标签，检出时直接输入对应的标签名即可。我处理时使用的便是 `v1.1.5` 版本。

在此之后，尝试使用 Python 2 运行脚本：

```sh
cd path/to/unrpyc/repo
path/to/python2 unrpyc.py --help
```

如果报错，请检查环境配置，然后尝试检出到其他标签再次测试。当一切正常，会输出帮助信息：

```sh
usage: unrpyc.py [-h] [-c] [-d] [-p PROCESSES] [-t TRANSLATION_FILE]
                 [-T WRITE_TRANSLATION_FILE] [-l LANGUAGE] [--sl1-as-python]
                 [--comparable] [--no-pyexpr] [--tag-outside-block]
                 [--init-offset] [--try-harder]
                 file [file ...]
```

对每个目标文件执行：

```sh
path/to/python2 unrpyc.py path/to/rpyc/file
# 其实这里可以写一个脚本的
```

完成后会得到一批 `.rpy` 文件，这些正是我们需要的。

## 第三章：提取与应用

所幸 KS:RE 仓库为我们精心准备了一些脚本，简化了我们写脚本与手动操作的过程。这些脚本在 `tl_script` 目录下。

先使用 `extract.py` 从 `.rpy` 提取字符串，将文件作为参数输入，会得到前缀为 `new-` 的文本文件，里面是所有提取出的字符串。

接下来请仔细检查一遍提取出的字符串，中英逐行对照，检查有无不对应的情况，减少后面处理错误导致的麻烦。

然后，使用 `concat.py` 脚本，基于中英双语的提取文本生成 `.json` 文件，以便下一步应用翻译。

这时，请打开你的 Ren'py SDK 图形界面，操作如下：

- 转到`设置 -> 一般 -> 项目目录`，将其设置为 KS:RE 仓库所在上一层目录；
- 返回项目列表，应该能看到项目 `katawa-shoujo-re-engineered`，选中它；
- 点击`生成翻译`，语言输入 `zh` 或者其他你认为恰当的；
- 遵照默认设置，点击`提取字串翻译`，稍等片刻；
- 最后在界面所示的目录中，会得到一批空的翻译模板文件。

!!! info "小提示"
    在对翻译文件做出批量操作前，建议大家先行备份，以免造成不必要的损失与情绪打击。

最后，应用翻译到翻译文件。其实不太建议使用仓库自带的脚本，我试过，没啥用（

这里贴出我在翻译时，自己使用的脚本。

```python
# concat.py, by @CloneWith and others
import os
import sys
import json

# Convert the original and translated files into one .json file
# 注意：原文件与翻译文件脚本的前面部分必须完全相同；运行时仅需输入原文件的文件名（不带扩展名后缀）
og = open(sys.argv[1] + ".rpy", "r", encoding="utf8").readlines()
tl = open(sys.argv[1] + "_zh_hans.rpy", "r", encoding="utf8").readlines()
# 这里我用的是 *_zh_hans 后缀，可根据情况修改
# Line numbers must match to proceed
try:
    assert len(og) == len(tl)
    # TODO: 字符串结构检测
except AssertionError:
    print(
        "[!] Sorry, the two files don't *exactly* match. Please check the line numbers first."
    )
    exit(1)

out = {}

for i in range(len(og)):
    ogsc = og[i].strip().replace("“", "\'").replace("”", "\'")
    out[ogsc] = tl[i].strip()

json.dump(
    out,
    open(f"{os.path.splitext(sys.argv[1])[0]}.json", "w", encoding="utf8"),
    ensure_ascii=False,
    indent="\t",
)
```

```python
# apply.py, by @CloneWith and others
import re
import sys
import json

# 符合要求的行
exp = re.compile(r"\A([a-zA-Z0-9_]* )?\"(.+)\"(.*)\Z")
# 识别注释，我们要从其中找出原文
exp_com = re.compile(r"\A\#( [a-zA-Z0-9_]* )\"(.*)\Z")
# 上面提到的 json 文件
dataset = json.load(open(sys.argv[1], "r", encoding="utf8"))
# 写入翻译
tl = open(sys.argv[2], "r", encoding="utf8").readlines()

WARNS = 0

# FIXME: 两个月前写的，现在有点看屎山的感觉了...

for i in range(len(tl)):
    t = tl[i].strip()
    pre = "    "
    MODE = 1
    if t.startswith("new \"") or t.find("\"\"") != -1:
        # Skip NEW for now and empty strings
        continue
    if t.endswith(" nointeract"):
        t = t[:-11]
    if t.startswith("# \"") or exp_com.match(t) is not None:
        t = t[2:]
        MODE = 0
    elif t.startswith("old \""):
        t = t[4:]
        MODE = 2
    elif exp.match(t) is None:
        if t.startswith("translate") or t.startswith("#") or t.startswith("nvl"):
            continue
        if len(t.strip()) == 0: continue
    else:
        continue

    new = dataset.get(t)

    if new is None:
        print("Missing translation on line {}:".format(i) + tl[i])
        WARNS += 1
        continue

    if MODE == 1:
        tl[i] = tl[i].replace(t, new)
    elif MODE == 0:
        tl[i+1] = pre + new + "\n"
    elif MODE == 2:
        tl[i+1] = tl[i].replace(t, new).replace("old", "new")

open("tl-" + sys.argv[2], "w", encoding="utf8").write("".join(tl))
print("[i] Auto application complete.")
if WARNS != 0:
    print("[!] {} warnings found.".format(WARNS))
```

## 第四章：界面设计

对于 KS:RE 的中文界面，我选用的是 *cjkFont 全濑体*，比较可爱，也比较契合其他界面文字。

添加新语言、嵌入新字体时，请：

- 在 `game/screens.rpy` 中添加语言对应选项，便于用户切换到新语言；
- 在 `game/styles.rpy` 中修改字体设置，使用字体组引用新字体。
- 将你的字体文件复制到游戏仓库的 `game/font` 文件夹，以便游戏读取。

使用字体组的实现方法一例：

```rpy
style default:
    font "font/playtime.ttf"
    # 0x4e00 0xffff 对应引用范围，前者优先
    font FontGroup().add("font/cjkFonts-allseto.ttf", 0x4e00, 0xffff).add("font/playtime.ttf", 0x0000, 0xffff)
    # font "font/playtime.ttf"
    size 36 + mobile_ts_add * (renpy.android or renpy.ios)
```

最后，希望这篇文章对大家翻译 Ren'py 视觉小说游戏有所帮助！

[^about]: 翻译自 FHS 官网，[来源](https://www.fhs.sh/about)
