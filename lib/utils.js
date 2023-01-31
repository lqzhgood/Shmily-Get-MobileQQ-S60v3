const iconv = require('iconv-lite');
const _ = require('lodash');
const FACE = require('./face.js');
const fs = require('fs');

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
const { msgType, directionType } = require('./type');

/**
 * @name:
 * @description: 这个还是有点风险的,万一 body 里面的某个字和 头部两个字节一致....
 *               不过中文是 4Exx 9Fxx 之间 标志位[a8-b1]大概率不会咯
 * @param {*} begs
 * @return {*}
 */
function getBegByLoose(begs) {
    const p = _.takeWhile(begs, (v, i, arr) => {
        // 2 个开始标记 4个时间 6个零 1个方向
        if (i <= 2 + 4 + 6 + 1) return true;
        return !_.isEqual(_.take(arr, 2), arr.slice(i - 2, i));
    });
    const piece = begs.splice(0, p.length);
    checkBeg(piece);
    return piece;
}

function checkBeg(beg) {
    const start = beg.slice(0, 2);
    const end = beg.slice(-2);
    const typeHex = beg[0].toString(16).padStart(2, '0');

    if (!(`hex_${typeHex}` in msgType)) {
        fs.writeFileSync('./test/unknownType.js', JSON.stringify(beg));
        throw new Error(`unknown Type ${typeHex}`);
    }
    if (!_.isEqual(start, end)) {
        fs.writeFileSync('./test/unknownType.js', JSON.stringify(beg));
        throw new Error('begs start end not equal');
    }
}

function begType(beg) {
    let type = beg[POSITION_BEG_FLAG].toString(16);
    return msgType[`hex_${type}`] ? msgType[`hex_${type}`].alias : '-' + type;
}

function getOffset(beg) {
    const typeHex = beg[0].toString(16).padStart(2, '0');
    const typeOffset = msgType[`hex_${typeHex}`].bodyOffset;
    let directionOffset;
    try {
        directionOffset = getDirection(beg).offset;
    } catch (error) {
        throw new Error('unknown direction Type');
    }
    return typeOffset + directionOffset;
}

function getTime(beg) {
    const time = beg
        .slice(POSITION_TIME, LENGTH_BEG_FLAG + LENGTH_TIME)
        .map(d => d.toString(16).padStart(2, '0'))
        .join('');
    return parseInt(time, 16) * 1000;
}

// const arr = [];
function getDirection(beg) {
    const typeHex = beg[0].toString(16).padStart(2, '0');
    const typeOffset = msgType[`hex_${typeHex}`].bodyOffset;
    const flag = beg[POSITION_DIRECTION + typeOffset].toString(16).padStart(2, '0');
    // console.log('POSITION_DIRECTION + typeOffset', POSITION_DIRECTION + typeOffset);
    // if (`hex_${flag}` === 'hex_08') {
    //     if (!arr.includes(beg.join(','))) {
    //         arr.push(beg.join(','));
    //         fs.writeFileSync('./tt.json', JSON.stringify(arr, null, 4));
    //     }
    //     console.log('beg', beg.join(','));
    // }
    return directionType[`hex_${flag}`];
}

module.exports = {
    getBegByLoose,
    begType,
    getTime,
    getOffset,
    getDirection,
};
