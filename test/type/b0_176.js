// !!! 禁止格式化
/* eslint-disable */

// prettier-ignore
module.exports = [
    [
        176,
        10, // <---- 消息长度
        82, 85, 120, 165,
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, // <---- 未知字段  msgBody 需要偏移4个字符
        128,  // <---- 方向位置
        163, 144, 49, 92, 13, 78, 112, 78, 134, 78, // <-- length == [1]
        176, 10,
    ],
    [
        176,
        8,
        81, 224, 166, 94,
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, // <---- 未知字段  msgBody 需要偏移4个字符
        0,
        84, 0, 94, 0, 84, 0, 32, 0, // <-- length == [1]
        176, 8,
    ],
    [
        176,
        20,
        82, 124, 247, 79,
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, // <---- 未知字段  msgBody 需要偏移4个字符
        0,
        96, 79, 200, 83, 13, 78, 106, 150, 17, 98, 11, 119, 84, 0, 94, 0, 84, 0, 32, 0, // <-- length == [1]
        176, 20,
    ],
    [
        176,
        6,
        81, 224, 190, 218,
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
        128,
        50, 0, 116, 94, 39, 84,
        176, 6,
    ],
    [
        176,
        22,
        81, 224, 191, 4,
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
        0,
        32, 0, 96, 79, 48, 82, 149, 94, 129, 137, 187, 83, 26, 89, 69, 78, 27, 86, 2, 48, 32, 0,
        176, 22
    ]
];
