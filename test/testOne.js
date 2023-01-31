const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const { msgType, directionType } = require('../lib/type');

const { begType, getTime, getDirection, getOffset } = require('../lib/utils');

const { getMsgBody_Position_Offset_length, getMsgBodyByReverse, getMsgBody_offset_to_end } = require('../lib/getBody');

const begArr = require('./type/a8_168_18');

const arr = [];
for (let i = 0; i < begArr.length; i++) {
    const b = begArr[i];
    console.log('b', b);
    readOne(b);
}

fs.writeFileSync('./t.json', JSON.stringify(arr, null, 4));
// readOneBody([
//     32, 0, 32, 0, 55, 0, 54, 0, 49, 0, 48, 0, 32, 0, 54, 0, 53, 0, 49, 0, 67, 0, 66, 0, 32, 0, 32, 0, 32, 0, 32, 0, 32,
//     0, 32, 0, 57, 0, 50, 0, 55, 0, 50, 0, 78, 0, 51, 0, 51, 0, 55, 0, 50, 0, 55, 0, 49, 0, 54, 0, 57, 0, 55, 0, 46, 0,
//     106, 0, 112, 0, 103, 0, 102, 0, 47, 0, 56, 0, 52, 0, 57, 0, 55, 0, 55, 0, 56, 0, 53, 0, 54, 0, 45, 0, 100, 0, 101,
//     0, 49, 0, 55, 0, 45, 0, 52, 0, 99, 0, 101, 0, 57, 0, 45, 0, 97, 0, 55, 0, 55, 0, 49, 0, 45, 0, 50, 0, 101, 0, 49, 0,
//     51, 0, 50, 0, 100, 0, 57, 0, 52, 0, 57, 0, 48, 0, 53, 0, 52, 0, 65, 0,
// ]);

function readOne(beg) {
    const piece = beg;

    console.log('type', begType(piece));
    console.log('time', getTime(piece));
    console.log('direction', getDirection(piece));

    const offset = getOffset(piece);
    console.log('offset', offset);

    const sx = getMsgBody_Position_Offset_length(piece, offset);
    const dx = getMsgBodyByReverse(piece);
    console.log('sx', sx);
    console.log('dx', dx);

    // 这个大概率是准的
    const oe = getMsgBody_offset_to_end(piece, offset);
    arr.push(oe);
    console.log('oe', oe);
}

function readOneBody(buff) {
    const bodyRead = iconv.decode(Buffer.from(buff, 'hex'), 'utf16le');
    console.log('bodyRead', bodyRead);
}

setTimeout(() => {}, 100000);
