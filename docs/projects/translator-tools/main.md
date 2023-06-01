# Translator Tools

项目地址：[Github](https://github.com/CloneWith/translator-tools)

## 初衷

主要还是因为 2023 年初对 osu-wiki 的中文翻译工作中的一些琐事。

我比较喜欢高效率、创意性的工作，极其反对并讨厌重复性任务，因此对仓库里一些又长又臭的文章很反感。比如臭名昭著的 `Skinning` 及其子文章内容。节选一段内容附其下：

```md
- `Combo1:`
  - Question: What colour is used for the last combo?
  - Value: *RGB*
  - Default: 255,192,0
  - Notes:
    - This is used if beatmap skin is disabled or uses default colours.
    - This appears last.
- `Combo2:`
  - Question: What colour is used for the first combo?
  - Value: *RGB*
  - Default: 0,202,0
  - Notes:
    - This is used if beatmap skin is disabled or uses default colours.
    - This appears first.

...

- `Combo8:`
  - Question: What colour is used for the seventh combo?
  - Value: *RGB*
  - Default: *(empty)*
  - Notes:
    - This is used if beatmap skin is disabled or uses default colours.
    - This appears seventh, if defined.
- `InputOverlayText:`
  - Question: What colour should the numbers on the input keys be tinted in?
  - Value: *RGB*
  - Default: `0,0,0`
  - Notes:
    - This is for [osu!](/wiki/Game_mode/osu!) and [osu!catch](/wiki/Game_mode/osu!catch) only..
    - This tints the numbers shown on the input overlay.
......
```

想必读者也应该看不下去了吧。其实我认为写得多并不是一件坏事，但也给翻译人员带来了一些不小的麻烦。就是说，许多句子结构相似，如果直接使用编辑器自带的替换工具，可以这样实现：

```md
- What colour should be used for the first combo? The default is *empty*.
|-------------------------------|~~~~~~~~~~~~~~~|------------------------|
- What colour should be used for the last combo? The default is *empty*.
```

分析句式不难发现，前面设问的内容都是相同的，只是主语不一样。每一段的第二句也是一样的。因此第一步：

```md
- 替换：`What colour should be used for ` -> `应该使用什么颜色？`
- 替换：`The default is *empty*.` -> `默认值是*空*。`
- 应该使用什么颜色？the first combo? 默认值是*空*。
- 应该使用什么颜色？the last combo? 默认值是*空*。
```

好吧，难点来了。最令我焦躁的是，调换语序，需要手动完成大量重复性的调整操作，以及一些翻译：

```md
- 手动编辑：
- the first combo应该使用什么颜色？默认值是*空*。
- the last combo应该使用什么颜色？默认值是*空*。
```

对于一个喜欢用鼠标拖放编辑文本的人来说，我是不太喜欢拖来拖去这种感觉的，况且对每段这样的句式，都要进行相同的操作（相信对使用 vim 这样 CLI 编辑器的人来说也不是什么舒服的体验罢）？于是我便追求解脱。

这样，就产生了我对翻译流程简化，一些基本的幻想：要是有这样一个工具该多好！

我便用起最熟悉的 Python 语言，编了一个 `replace.py` 脚本。

细心的读者也许会发现，里面也有对其他一些模块的引用（比如？`cli` `assets` `locale` 之类），那主要是许多想法碰撞在一块的产物，具体内容以后会在别的文章里提到。

## 设计

### 替换功能

首先，一个优秀的脚本，应该满足不同情况的需求。我就捋了一下：

- 简单模式：适合日常情况下**完全相同内容**的替换。许多编辑器自带此功能。
- 高级模式：适合上文提到的情况，减轻工作量。
- 模板模式：如果上面两个模式的规则用到多次，可以考虑做成所谓的“模板”，方便多次调用。

这三种模式，大概满足了我对理想中的翻译工具基本的幻想。

### 主函数与子函数

之后，我也考虑到了脚本的可拓展性。

假如我之后茅塞顿开，想要开发其他与翻译工具相关的功能。既然它们都共用一个框架，不如放在一个大仓库里，编一个 main 脚本实现调用，岂不是要方便得多？于是我就建立起了现在仓库里程序的基本结构。

### 本地化

假如某一天这个仓库出了名（如果有一天），来自世界各地的人都想使用此工具，但有些人不会英语（只会本地语言，事实上这样的情况还很多见），该怎么办？就需要一个较为完备（基本）的本地化体系，至少从信息字串和说明文档方面实现多语言。

参照这篇文章：[【Python】Python3之i18n](https://developer.aliyun.com/article/702246)，我使用 Python 内的 `gettext` 模块以及一些辅助工具，初步实现了英语、汉语间的本地化。

## 感慨

后来发现，我在开发这个小工具的心路历程，其实就是未来研发大型项目时的基本思路。一些具体的细节，同文件夹内的其他文章会有解释。
