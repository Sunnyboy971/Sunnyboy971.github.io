---
date:
  created: 2024-06-17
tags:
  - linux
  - system
  - tools
categories:
  - Tools
comments: true
---

# 安装 Arch 之更进一步

到此，我们已经完成对系统的基本配置，并已经独立进入了系统。接下来我们仍需继续配置，让系统适合我们使用。<!-- more -->简要来讲，我们需要：

- 独立的账户，并实施权限管理
- 让设备组件（如音响、摄像头）正常工作
- 设置好适合自己的（图形）界面
- 日志与消息记录
- 为满足其他各种需求，而安装的软件包

## 用户与权限

我们需要创建属于自己的**普通**用户，以保证系统安全，免受意外的 `rm -rf` 所害。要添加用户、配置分组：

```sh
useradd -m username
# 创建名为 username 的普通用户，主目录位于 /home/username，同时有属于自己的 username 用户组
passwd username
# 为用户设置密码
usermod -l username newname
# 更改用户名到 newname
usermod -aG tgroup username
# 将 username 添加到 tgroup 组，同时保留已有组 (-a)
userdel -r username
# 删除 username，同时删除相关信息 (-r)
```

详情参见[Archlinux Wiki 用户与用户组](https://wiki.archlinuxcn.org/wiki/%E7%94%A8%E6%88%B7%E5%92%8C%E7%94%A8%E6%88%B7%E7%BB%84)。

同时可安装 `sudo` 包，实现简易提权访问。使用 `EDITOR=nano visudo` 编辑 `sudoers` 文件，参照其内容进行配置。

## 桌面环境

我使用的是 KDE 桌面环境，可以安装如下软件包：

```sh
pacman -S sddm plasma-meta kde-applications
# 安装 SDDM、Plasma 桌面环境与 KDE 应用。使用空格分隔的数字列表选择多项
systemctl enable sddm
# 启用显示管理器服务，保证在开机时运行
```

可以考虑安装 `flatpak`，Linux 系统的应用商店：

```sh
pacman -S flatpak
# 轻松安装更多应用的方式
wget https://mirror.sjtu.edu.cn/flathub/flathub.gpg
sudo flatpak remote-modify --gpg-import=flathub.gpg flathub
sudo flatpak remote-modify flathub --url=https://mirror.sjtu.edu.cn/flathub
# 为提高速度，使用上交大的 Flathub 镜像源
```

同时你也需要安装一些中文环境需要的字体，以及等宽字体：

```sh
pacman -S noto-fonts ttf-cascadia-code noto-fonts-cjk
# adobe-source-han-sans-otc-fonts 思源黑体也很不错
```

字体列表可以参考 [Archlinux Wiki 字体](https://wiki.archlinuxcn.org/wiki/%E5%AD%97%E4%BD%93)。

## 更多设置

这也许就是这个系列的所有内容，但取决于个人喜好，可能还会想做些其他的事情；没问题，Arch Linux 会给你充足的发挥空间！

最后，祝使用 Arch Linux 愉快！
