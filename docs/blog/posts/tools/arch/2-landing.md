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

# 安装 Arch 之基本配置

正常启动到 LiveCD 后，就可以进行基本的配置过程了。<!-- more -->主要分为以下几步：

1. 确定网络配置 + 连接网络
2. 存储分区 + 挂载
3. 基本软件包部署
4. 参数配置 + 引导安装

## 网络配置

MateBook 使用的是纯无线网卡，因此需要手动连接无线网络。参考打印出来的欢迎信息：

```md
...
For Wi-Fi, authenticate to the wireless network using the `iwctl` utility.
For mobile broadband (WWAN) modems, connect with thee `mmcli` utility.
Ethernet, WLAN and WWAN interfaces using DHCP should work automatically.
...
```

在连接之前，要先检查网卡的启用状态（是否被内核禁用），使用：

```md
# rfkill
---
ID TYPE      DEVICE      SOFT      HARD
 0 bluetooth hci0   unblocked unblocked
 1 wlan      phy0   unblocked unblocked
```

如果 `wlan` 类设备处于 `blocked` 状态，请：

- HARD blocked：打开设备上无线网络的开关或按钮；
- SOFT blocked：`rfkill unblock wifi`；

此后直接输入 `iwctl`，进入 iwd 控制台。

```sh
[iwd]#
```

输入 `device list`，查看无线网卡对应的编号与状态：

```md
[iwd]# device list
---
Devices \*
Name    Address     Powered     Adapter Mode
wlan0   ??          on          phy0    Station
```

输入 `station wlan0 scan`，使用对应网卡扫描网络，通常无输出结果，此后执行 `station wlan0 get-networks`：

```md
[iwd]# station wlan0 get-networks
---
Available networks \*
Network name    Security    Signal
Example1        psk         ****
```

输入 `statioin wlan0 connect Example1`，其中 `Example1` 是待连接网络名称。可能会提示输入密码 `Passphrase`，则按提示输入。

如果连接正常，则输入密码后，对应网络左侧会出现右箭头，如下：

```md
     Network name    Security    Signal
  >  Example1        psk         ****
```

此时可输入 `exit` 退出控制台，继续下一步操作：使用 `ping <网址>`测试连接性。若隔一段时间有稳定的输出，则可按下 `Ctrl` + `C` 退出。

## 分区与挂载

接下来要为设备分区，为 Arch 的安装做准备。

!!! warning "请确定好操作分区"
    请务必在操作前再三确认：分区是否正确，对象是否正确，有无意外操作！

先使用 `lsblk` 列出所有存储设备：

![lsblk 命令输出](img/lsblk.jpg)

在这里，请记下 `nvme0n1`，这是我们之后要分区的磁盘位置。

对于分区工具，我比较喜欢使用 `cfdisk`：

```sh
cfdisk /dev/nvme0n1
```

之后就是我们比较熟悉的图形化界面了。以下的分区过程因人而异，具体原则请参考 Archlinux Wiki 中相关的部分。决定好之后，记得选中 `write` 写入更改后退出。然后再使用 `mkfs` 系相关工具处理各种分区，`mkswap` 与 `swapon` 准备并启用交换分区。

同样地，将分区按照顺序依次挂载起来，然后运行 `genfstab -U >> /mnt/etc/fstab`。请在此之后检查一下文件是否正确。

!!! info "原理"
    `genfstab` 工具顾名思义，用于基于挂载情况生成 `fstab` 系统文件，用于新系统在启动时按需挂载设备。

    `-U` 开关让程序将分区的 UUID 而非块设备路径写入 `fstab`，因为 UUID 是唯一的，而后者会受到各种因素影响。

    `>>` 用于向文件附加内容，如果要覆盖请换成 `>`。

## 软件部署与换根

使用 `pacstrap` 向新环境安装一些基础软件包并初始化 `pacman` 管理器。

```sh
pacstrap -K /mnt base base-devel linux linux-firmware intel-ucode vim nano mc man-db grub efibootmgr iwd NetworkManager
```

对于安装的软件包：

- `base`：必需的基本命令；
- `base-devel`：经常是安装 AUR 软件包时需要的依赖组件；
- `linux` `linux-firmware`：启动必需的内核及其固件；
- `intel-ucode`：英特尔的微码更新，如果不是可以不装；
- `vim` `nano` `mc`：你喜欢的文本编辑器、文件浏览器；
- `man-db`：连同 `texinfo`，便于浏览程序自带文档；
- `grub` `efibootmgr`：必需的引导管理程序；
- `iwd` `NetworkManager`：网络管理工具，便于从新系统直接启动时联网；

这些软件包并非一定要安装，除了“必需”的以外，其他的可以酌情安装。

对于图形界面等等相关的软件包，我选择在后面安装，分步进行，可以避免一些依赖与配置问题。

!!! info "原理"
    `pacstrap` 是由 `pacman` 与 `bootstrap` 演化而来，作用与两者类似，负责初始化新环境。

    `-K` 开关用于将安装目标视作新环境，从头开始配置 `pacman` 所需的软件包源、密钥等等。

    `/mnt` 为部署目录，之后的所有参数均为要安装的软件包（组）。

安装完成后，即可进行换根：`arch-chroot /mnt`。

!!! info "为何不使用 `chroot`？"
    根据官方的 `arch-chroot` manpage，它有一些附加功能，包括但不限于：挂载 `/dev` `/proc` 等必要 API 文件系统，传递 `resolv.conf` 文件等等；

    当然你完全可以使用 `chroot`，但是需要进行一些额外的工作，这些在 Gentoo 的安装流程中有所提及。

在换根后，你就可以为所欲为（不是）了。

依次输入以下命令：

```sh
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
# 手动设置本地时区为 Asia/Shanghai
hwclock --systohc
# 硬件时钟设置，System clock to Harkware Clock，系统时间写入硬件
```

- 编辑 `/etc/locale.gen`，取消以下地区注释：
  - `en_GB.UTF-8 UTF-8`：默认位置配置；
  - `zh_CN.UTF-8 UTF-8`：备用配置，我们需要简体中文的桌面
- 运行 `locale-gen`；
- 创建 `/etc/locale.conf`，定义 `LANG=en_US.UTF-8`；
- 创建 `/etc/hostname`，定义主机：`<hostname>`，就一行，是你设置的主机名
- 运行 `passwd`，设置 root 账户密码，你需要此密码在重启后登录；

## 引导安装

在 UEFI 系统上，我们使用 GRUB 进行引导。

```sh
grub-install --efi-directory=/boot --bootloader-id=GRUB
```

`bootloader-id` 不定义也可以，默认值是 `arch`。

安装引导器后，需要生成配置文件：

```sh
grub-mkconfig -o /boot/grub/grub.cfg
# 将配置文件输出到指定目录
```

!!! warning "如果你调整了分区..."
    只要你改动了磁盘上的系统分区、启动分区，都需要重新生成 `fstab` 文件，因为此时分区的 UUID 已经改变。

## 休息一下，坐和放宽

到此为止，基本的配置过程已经结束。让我们卸载所有分区，并重新启动：

```sh
umount -R /mnt
# 递归 (Recursive) 卸载目录下的所有分区
reboot
```

重启时记得拔掉外部设备，让你的设备自己尝试一次独立启动。
