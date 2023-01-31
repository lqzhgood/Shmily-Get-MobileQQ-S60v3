const fs = require('fs');
const path = require('path');
const { msgType, directionType } = require('../lib/type');

const { getMsgBody_Position_Offset_length, getMsgBodyByReverse, getMsgBody_offset_to_end } = require('../lib/getBody');

const testDir = fs.readdirSync(path.join(__dirname, './type'));

for (let i = 0; i < testDir.length; i++) {
    const fileName = testDir[i];
    const typeHex = fileName.split('_')[0];
    const msgAttr = msgType[`hex_${typeHex}`];
    if (msgAttr) {
        const testMsgArr = require(path.join(__dirname, './type', fileName));
        for (let j = 0; j < testMsgArr.length; j++) {
            const testMsg = testMsgArr[j];
            const MsgBodyBySequential = getMsgBody_Position_Offset_length(testMsg, msgAttr.bodyOffset);
            const MsgBodyByReverse = getMsgBodyByReverse(testMsg);
            const MsgBodyByOffsetToEnd = getMsgBody_offset_to_end(testMsg, msgAttr.bodyOffset);
            if (MsgBodyBySequential !== MsgBodyByReverse && MsgBodyBySequential !== MsgBodyByOffsetToEnd) {
                console.group(`${typeHex} ${j} error`);
                console.log('MsgBodyBySequential\t', MsgBodyBySequential);
                console.log('MsgBodyByReverse\t', MsgBodyByReverse);
                console.log('MsgBodyByOffsetToEnd\t', MsgBodyByOffsetToEnd);
                console.groupEnd(`${typeHex} ${j} error`);
            }
        }
        console.log(`${typeHex}  ok`);
    } else {
        console.error('Type Not Found in [msgType]', fileName);
        break;
    }
}

setTimeout(() => {}, 100000);
