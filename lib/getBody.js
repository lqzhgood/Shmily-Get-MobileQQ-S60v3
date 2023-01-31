const iconv = require('iconv-lite');

const { msgType, directionType } = require('./type');
const FACE = require('./face.js');
const {
    LENGTH_BEG_FLAG,
    LENGTH_TIME,
    LENGTH_FILL,
    LENGTH_DIRECTION,
    POSITION_BEG_FLAG,
    POSITION_TIME,
    POSITION_FILL,
    POSITION_DIRECTION,
    POSITION_MSG_BODY,
} = require('./const');

const { begType } = require('./utils');

function getMsgBody_Position_Offset_length(beg, offset) {
    const bf = beg.slice(POSITION_MSG_BODY + offset, POSITION_MSG_BODY + offset + beg[1]);
    let msg_hm = decode(bf);
    msg_hm = alias(msg_hm);
    return msg_hm;
}

function getMsgBodyByReverse(beg) {
    const bf = beg.slice(beg.length - LENGTH_BEG_FLAG - beg[1], beg.length - LENGTH_BEG_FLAG);
    let msg_hm = decode(bf);
    msg_hm = alias(msg_hm);
    return msg_hm;
}

// 这个大概率是准的
function getMsgBody_offset_to_end(beg, offset) {
    const bf = beg.slice(POSITION_MSG_BODY + offset, beg.length - LENGTH_BEG_FLAG);
    let msg_hm = decode(bf);
    msg_hm = alias(msg_hm);
    return msg_hm;
}

function decode(bf) {
    const msg = Buffer.from(bf, 'hex');
    let msg_hm = iconv.decode(msg, 'utf16le');
    return msg_hm;
}

function alias(msg_hm) {
    FACE.forEach(v => {
        msg_hm = msg_hm.split(v.utf16).join(`[${v.alias}]`);
    });
    return msg_hm;
}

module.exports = {
    getMsgBody_Position_Offset_length,
    getMsgBodyByReverse,
    getMsgBody_offset_to_end, // <-- 这个是准的
};
