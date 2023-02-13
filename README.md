# 说明

请先阅读 https://github.com/lqzhgood/Shmily

此工具是从 Nokia Symbian S60 中提取的聊天记录转换为 `Shmily-Msg` 格式的工具。原理参考 `./Doc` 下文章。 <br/>

# 注意

估计由于是采用的本地时间，所以导致按时间排序后会顺序会错乱 <br/>
时间精确到 s <br/>
config 里面 `isFromOtherAccount` 用来颠倒 direction ， 用于是否来自于对方手机的信息处理 <br/>

# 使用

0. 安装 node 环境 [http://lqzhgood.github.io/Shmily/guide/setup-runtime/nodejs.html]
1. 将 `msg.info` 放入 `input` 文件夹
2. 手机资源文件 `C:\QQDownload`(手机内存) `E:\QQDownload`(TF 卡) 放入 `\assets\data\qq-s60\file\` 文件夹
3. 修改 `config.js`
4. 执行 `npm run build`
5. `dist` 文件夹获取 数据文件
6. `assets\data` 获取 资源文件
7. 通过 [Shmily-Get-QQ-PC_utils](https://github.com/lqzhgood/Shmily-Get-QQ-PC_utils) 修复一些问题

# 原理

根据 msg.info 结构分析。 <br/>

<table border="1" cellspacing="0" cellpadding="10" width="100%">
    <thead>
        <tr>
            <th rowspan="2">-</th>
            <th colspan="2" rowspan="1"  style="text-align:center">BegFlag</th>
            <th rowspan="2">Time</th>
            <th rowspan="2">Fill</th>
            <th rowspan="2">(bodyOffset)</th>
            <th rowspan="2">Direction</th>
            <th colspan="2" rowspan="1" style="text-align:center">body</th>
            <th rowspan="2">EndFlag</th>
        </tr>
        <tr>
            <th>消息类型</th>
            <th>body长度</th>
            <th>(directionOffset)</th>
            <th>MsgBody</th>
        </tr>
    </thead>
    <tbody>
       <tr>
            <td>长度</td>
            <td>1</td>
            <td>1</td>
            <td>4</td>
            <td>6</td>
            <td>不定</td>
            <td>1</td>
            <td>不定</td>
            <td>不定</td>
            <td>2</td>
        <tr>
        <tr>
            <td>说明</td>
            <td>消息类型</td>
            <td>body长度</td>
            <td>聊天时间</td>
            <td>无意义填充 6 个 0</td>
            <td>偏移量 作用未知</td>
            <td>消息发出还是接收</td>
            <td>作用未知,已知文件类型长度为 2</td>
            <td>真实消息体</td>
            <td>结束标志，内容同 BegFlag</td>
        <tr>
    </tbody>
</table>

<br/>
以上是大致情况，根据不同类型会有区别，长度可以参考 `./lib/const.js`<br/>
<br/>

#### BegFlag (A8 XX)

BegFlag[0] 表示数据类型（A8）, BegFlag[1]（XX） 表示 msgBody 字节数（但不一定）。 <br/>
`./lib/type.js` --> msgType <br/>
code 代表 A8 十进制数， alias 别称， bodyOffset 此类型 MsgBody 长度。（经验值）<br/>
<br/>

#### DirectionType

code 代表 Direction 十进制数 alias 别称，offset 代表此类型 偏移量（经验值） <br/>

# 解析方法

MsgBody 的解析方法位于 `./lib/getBody.js` <br/>
根据以上原理，MsgBody 可以根据三种方式来解析:

#### 从头开始解析，根据 BegFlag 拿长度 getMsgBody_Position_Offset_length

获取 `POSITION_MSG_BODY` 到 `POSITION_MSG_BODY` + offset + BegFlag[1] 之间的值，也就是根据 BegFlag[1] 显示的长度 + offset 获取消息。如果 BegFlag 数值或 offset 错误，那么拿到的 msgBody 是不全的。<br/>
_起始字符一定是正确的_<br/>

#### 从后开始解析 getMsgBodyByReverse

根据 BegFlag[1] 长度从后面拿值，截取起点是 beg.length - LENGTH*BEG_FLAG - beg[1]。 终点是 beg.length - LENGTH_BEG_FLAG <br/>
就是说拿到 MsgBody 的终点，减去 BegFlag[1] 得到起点， 这样排除了 offset 的影响，但是也绝对依赖 BegFlag[1] 的正确。<br/>
*终点字符一定是正确的\_<br/>

#### 前后一起解析 getMsgBody_offset_to_end <-- 这个是准的

起点是 POSITION_MSG_BODY + offset，终点是 beg.length - LENGTH_BEG_FLAG。<br/>
通过 offset 确定起点，终点取长度 - LENGTH_BEG_FLAG。不再依靠 BegFlag[1]。最终发现这个是准确的

## offset

`offset` 为经验值，通过截取多个同类型 BegFlag[0]，通过三种方法解析文本，一点点调整`offset` 获取到正确的字符。所以 `offset` 直接决定 MsgBody 的准确性。<br/>

```
为得到绝对准确的 MsgBody，只能手动获取 `offset` 。所以本工具采用白名单机制，遇到未知类型则报错。但本人样本量较少，因此估计还有不少类型没有 `offset`，欢迎补充。
```

# Tool

### amrHandle

可以转换语音`.amr`到`.mp3` 并修改 msg.json

## 参考文件

#读取 qq 聊天记录文件(诺基亚塞班 S60v3 平台)\_sharksir 的专栏-CSDN 博客.mhtml# <br/>
`https://blog.csdn.net/sharksir/article/details/7435133`

#基于 Symbian S60 平台的手机取证技术研究.pdf# <br/>
`http://jcjs.ijournal.cn/ch/reader/create_pdf.aspx?file_no=20120505&flag=1&journal_id=jcjs&year_id=2012`

[热门]手机 QQ2008*2009_2010_iPhone 聊天记录提取工具(WM_S60_iOS)\_t9s8d19nzl 炒*新浪博客.mhtml
<br/>
`http://blog.sina.com.cn/s/blog_7c95110c0100wtna.html`

#手机 QQ2009、手机 QQ2010 聊天记录结构分析与提取导出 – Chon · 翀.mhtml#
`https://chon.io/blog/moblie-qq2009-qq2010-chatlog-structure/`

#ＮＯＫＩＡ-Ｓ６０第三版目录路径与分析（完整版）\_AppFish Studio 的专栏-CSDN 博客.mhtml#
`https://blog.csdn.net/hyugahinat/article/details/5510219`
