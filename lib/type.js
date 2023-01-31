const msgType = {
    hex_a8: { code: 168, alias: '消息a8', bodyOffset: 0 },
    hex_a9: { code: 169, alias: '系统消息', bodyOffset: 0 }, // 长度和beg[1]不相等
    hex_aa: { code: 170, alias: '消息aa', bodyOffset: 0 }, // 长度和beg[1]不相等
    hex_ab: { code: 171, alias: '消息ab', bodyOffset: 0 }, // 长度和beg[1]不相等
    hex_b0: { code: 176, alias: '消息b0', bodyOffset: 4 }, // 长度和beg[1]不相等
    hex_b1: { code: 177, alias: '系统消息b1', bodyOffset: 4 }, // 长度和beg[1]不相等
};

// [16,144]
// "发送成功E:\\1.txt",
// "取消发送  E:\\Images\\SuperScreenshots\\SuperScreenshot0047.jpg",
//  "取消接收",
// "对方取消发送  ",
// "对方取消接收  E:\\QQDownload\\Image\\QQ100516154544.jpg",
// 接收成功  QQ - 136817982.amr",
// "对方取消了文件的传送或网络错误，传输中止(4)  ",
const directionType = {
    // 右侧 go
    hex_80: { code: 128, alias: '自己发', offset: 0 },
    hex_90: { code: 144, alias: '自己发送文件', offset: 2 },

    // 左侧 come
    hex_00: { code: 0, alias: '对方发', offset: 0 },
    hex_10: { code: 16, alias: '对方发文件', offset: 2 },

    hex_50: { code: 80, alias: '对方自动应答/忙', offset: 0 },

    hex_5a: { code: 90, alias: '加群', offset: 0 },
    hex_2a: { code: 42, alias: '好友申请', offset: 0 },
    hex_18: { code: 24, alias: '好友申请', offset: 0 },
    hex_62: { code: 98, alias: '好友申请', offset: 0 },
    hex_30: { code: 48, alias: '系统消息', offset: 0 },

    // 未知类型
    // body长度都是2(第二位是0) 估计是一些动作 如抖一抖啥的
    // 但是我已经忘了 s60v3上有不有抖一抖的功能了 我印象中记得是有的
    hex_08: { code: 8, alias: 'unknown', offset: 0 },
    hex_12: { code: 18, alias: '对方发的图片文件(已知的都是图片格式 a8_168_18.js)', offset: 2 },
};

module.exports = {
    msgType,
    directionType,
};
