---
date:
  created: 2023-06-01
tags:
  - Yanshee
  - AI
  - robotics
  - competition
  - coding
  - programming
categories:
  - Robotics
  - Yanshee
  - Coding
comments: true
---

# 关于我和 Yanshee 的那些事 - 程序技巧篇

这篇文章会讲述 Yanshee 赛事脚本的基本结构，以及优化运行时间与性能的小技巧。<!-- more -->

## 环境设置 {#Envset}

在使用 Yanshee 运行程序前，需要事先建立好开发环境。笔者使用的是下文所述的开发环境，以此为准。

### Yanshee 机器人 {#Yanshee}

机器人内部一般已经设置好运行程序所需环境（包括 Python2 / Python3、YanAPI、RestfulAPI 等等），所以无需过多设置。

1. 打开机器人电源；
2. 在胸前灯停止闪烁后即可开始；

这样基本就准备完毕了。如果想直接在机器人本体上开发，可以参考以下方案：

1. Yanshee Blockly：简单易学，集成了文字输出、设备控制、智能识别等多方面功能；
2. JupyterLab：适合编写各语言的程序，较为高级专业，内含集成终端；
3. 机器人内置的其他编辑器（例如 vim、nano、geany、thonny IDE 等等）；

你需要使用 HDMI 线或 VNC 来连接到机器人使用图形化开发环境，或使用 SSH 使用命令行。

!!! info "提示"

    建议预先准备一条 HDMI 线与键盘鼠标，以便机器人系统出现问题时进入恢复模式。

### 其他平台端设备 {#Other-Platform}

可以使用其他方式通过网络对机器人进行控制。具体方式如下：

| 方式 | 平台 / 条件 |
| :-: | :-- |
| Yanshee APP 控制 | Android / iOS 操作系统设备 + 网络 |
| VNC 远程控制 | 支持的操作系统设备 + 网络 |
| SSH 远程控制 | 支持的操作系统设备 + 网络 |

??? info "其他方法"

    也可以尝试用用 VS Code 之类的多平台支持编辑器，可扩展性强。（并且它可以通过安装 SSH 扩展实现连接）

---

一些小小的汇总：

| 方式 | 需网络 | 程序运行支持 | 紧急维护支持 | 动作编辑支持 |
| :-: | :-- | :-- | :-- | :-- |
| Yanshee APP | 是 | 仅 Blockly | 否 | 简单[^1] |
| Yanshee Studio | 是 | 否 | 否 | 高级[^1] |
| VNC 远程控制 | 是 | 是 | 否 | 否 |
| SSH 远程控制 | 是 | 是[^2] | 否 |

[^1]: Yanshee APP 仅支持舵机的回读编程以及一部分的舵机角度调节，Yanshee Studio 则支持分每个舵机的单独调节以及镜像，具体会在下一篇文章中提及。

[^2]: 对命令行输入输出的支持。如果涉及到图形界面，则需要对 X 服务器进行进一步配置，取决于使用的显示类型(TODO)。

#### IP 地址的获取与连接 {#Get-ip}

如果使用除 Yanshee APP 外的其他方式进行控制，都需要先获取机器人的 IP 地址。

1. 使用 Yanshee APP 先连接机器人；
2. 在`设置` -> `机器人信息`中找到机器人的 IP 地址；
3. 在对应工具中填入对应地址与相关信息，连接完成。

!!! info "注意"

    如果机器人换网了，IP 地址会更改，配置时请务必注意这一点。

## 程序结构 {#Structure}

可以将赛事流程的所有内容分解为几个部分：**物体与颜色识别、语音播报、动作执行**。

1. 物体与颜色识别主要用到 `cv2` 模块。在 Yanshee 机器人上还需要引入 `PiCamera` 模块，以实现与 CV2 联动采集并处理图像。
2. 语音播报主要使用 API 实现。**个人极其不建议使用预处理的音频。**虽然这可以省下一点时间，但发现在播放音频文件时声音会有模糊，极易引起误判。
3. 动作执行主要使用 API 读取 `/home/pi/Documents/motions/` 目录下的动作文件实现。

## 优化技巧 {#Technique}

### 环境级 {#Env}

影响 Yanshee 运行程序的两大因素：**资源占用与网络**。

#### 资源占用 {#Performance}

这里的“资源”其实指对 CPU、内存等的占用，其与后台程序与服务相关。

1. 可以尝试换个轻量点的运行环境，比如：从终端或远程 SSH 运行程序。像上文提到的 VS Code 就很吃内存。
2. 以运行方式而非调试方式执行脚本。
3. 尽量关闭正在运行的程序，例如 Chromium。
4. 禁用一些不必要的服务。具体方法如下：
    1. 运行 `systemctl list`，这会列出系统中已经加载的所有服务。
    2. 用方向键滚动页面，看看`描述 (Description)`，记下一些无关紧要的服务（`*.service` 文件）。
    3. 按 `q` 退出。
    4. 运行 `sudo systemctl stop <service>`，其中 `<service>` 指要停止的服务名。
    5. 如果想禁用服务在开机时加载，可以运行 `sudo systemctl disable <service>`。
    6. 如果想恢复服务的加载/启动，可以运行 `sudo systemctl start/enable <service>`。
5. **高级** 修改 API 文件。 Yanshee 机器人自带的 YanAPI 与 RestfulAPI 功能都是全的。如果你**确定**自己的程序用不到一些功能，可以这样做：

```sh
cd /usr/share/lib/arm<...>/python3
# 此处输入路径时可以按 Tab 键自动补全
cp YanAPI.py /path/to/your/script/<name>.py
# 直接复制 API 文件。不要删除源文件，机器人自身会使用！
# 若是 RestfulAPI，则在 python2.7/dist-packages 目录下复制 RestfulAPI.py 文件
```

然后打开复制好的 API 文件，做你想要的更改。

!!! warning "警告"

    更改前务必看清调用的函数，避免误删内容！

完成后，如果想导入修改后的 API 模块，可以：

```python
import ModuleName
# 上面是修改后的 API 文件名
```

这样有利于减少内存占用。

#### 网络 {#Network}

赛事程序执行期间发出了大量对远程地址的请求，可通过改善网络状况提高响应速度，比如换连接人数少的路由器等等。如果使用其他设备远程控制，可以考虑装一个质量好的网卡。

### 程序级 {#Program}

赛事程序负责对摄像头等软硬件资源的调用，在某种程度上决定了程序执行的效率。可以从下列方面入手：

#### 资源调用方式 {#Res}

1. 可以减少对同一资源的不必要重复调用。举一个例子：

```python
def show1():
    kl = <image>
    cv2.imshow('Yanshee Camera', kl)
    dosth()
def show2():
    s = <image>
    cv2.imshow('Another', s)
    doanother()
show1()
dosthanother()
show2()
```

这里使用 `cv2.imshow()` 显示了两个窗口，其实可以共用一个名字来实现只显示一个窗口。（cv2 画面的更新会占用可观的 CPU 资源）
2. 如果想要实现两个功能，而它们的实现框架相似，则可以写到一个函数中以减少占用。比如：

```python
def func1(arg: int):
    print("This is {}".format(arg))
    return arg
def func2(arg: int):
    print("Look up for {}".format(arg))
    return arg + 2
```

可以这样优化：

```python
def func(arg: int, typ: int):
    s = ["This is {}", "Look up for {}"]
    print(s[typ].format(arg))
    if typ == 1: return arg
    else: return arg + 2
```

#### 延时技巧 {#Time}

```python
import time
time.sleep(ms)
```

使用很简单，但效果取决于延时长短。这里就涉及到了对程序的理解问题。如果一个过程对资源占用很大，可以考虑让其 sleep 一小会儿来减轻给机器人施加的压力。如果一个过程并非实时性强，也可以适当加入延时。

## 结尾 {#End}

以上纯属个人感悟，如有不妥敬请指正，谢谢！
