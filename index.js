const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

const { getBegByLoose, begType, getTime, getDirection, getOffset } = require('./lib/utils');
const { getMsgBody_offset_to_end } = require('./lib/getBody');
const { qqToMsg } = require('./lib/conversion');

const INPUT_DIR = './input/';
const DIST_DIR = './dist/';

if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR);
}

const msgInfoFiles = fs.readdirSync(INPUT_DIR).filter(v => v.toLowerCase().endsWith('.info'));

const { isFromOtherAccount } = require('./config');

for (let i = 0; i < msgInfoFiles.length; i++) {
    console.log('isFromOtherAccount', isFromOtherAccount);
    const f = msgInfoFiles[i];
    coverMsgInfo(f);
}

function coverMsgInfo(fileName) {
    const msg_buffer = fs.readFileSync(path.join(INPUT_DIR, fileName));
    const msg_arr = Array.from(msg_buffer);

    const resArr = [];
    while (msg_arr.length > 0) {
        let piece, offset, msg;
        try {
            piece = getBegByLoose(msg_arr);
            offset = getOffset(piece);
            msg = {
                type: begType(piece),
                time: getTime(piece),
                msg: getMsgBody_offset_to_end(piece, offset),
                direction: getDirection(piece),
                piece,
            };
            if (msg.direction.alias === 'unknown') {
                msg.msg = '[未知类型消息 未知发送方向]\n' + msg.msg;
                console.warn(`未知类型消息 未知发送方向, msg`);
            }
            resArr.push(msg);
        } catch (error) {
            fs.writeFileSync('./test/unknownType.js', JSON.stringify(piece));
            fs.writeFileSync('./test/remaining.js', JSON.stringify(msg_arr));

            throw new Error(error);
        }
    }

    const msgArr = qqToMsg(resArr);

    const msg_sort = sortFixTime(msgArr);

    console.log('msg.length', msg_sort.length);

    // fs.writeFileSync("./dist/msg.info.json", JSON.stringify(msg_sort, null, 4));
    fs.writeFileSync(path.join(DIST_DIR, `${fileName}.json`), JSON.stringify(msg_sort, null, 4));
}

/**
 * @name:
 * @description: 估计由于是采用的本地时间，所以导致按时间排序后会顺序会错乱
 *               因此如果下一条时间比上一条时间早
 *               那么下一条时间在上一条时间 +1ms
 *              由于是不精确时间(只精确到s 没精确到ms)
 * @param {*}
 * @return {*}
 */
function sortFixTime(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (i === 0) continue;
        const last_msg = arr[i - 1];
        const curr_msg = arr[i];
        if (curr_msg.ms < last_msg.ms) {
            curr_msg.$MobileQQ.s60RealTime = `${curr_msg.day} ${curr_msg.time}`;

            curr_msg.ms = last_msg.ms + 1;
            curr_msg.day = dayjs(curr_msg.ms).format('YYYY-MM-DD');
            curr_msg.time = dayjs(curr_msg.ms).format('HH:mm:ss');
        }
    }
    return arr;
}
