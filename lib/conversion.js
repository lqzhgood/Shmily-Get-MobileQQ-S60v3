/**
 * @name: convert.js
 * @description: 将提取的 json 转化为 memoryWeb 项目可用的 json
 * @param {type}
 * @return {type}
 */
const _ = require('lodash');
const dayjs = require('dayjs');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const FACE_EMOJI = require('./face');

const FACE_0014 = require('./face-0014');

function qqToMsg(res) {
    const arr = res.map(v => {
        // 如果文件名含 from 就是就是从对方的账号中导出的  direction 需要颠倒
        // type.js 128,144 go 其他 come (也就是默认 come)
        let direction;
        const goDirectionFlag = config.isFromOtherAccount
            ? ![128, 144].includes(v.direction.code)
            : [128, 144].includes(v.direction.code);

        if (goDirectionFlag) {
            direction = 'go';
        } else {
            direction = 'come';
        }

        const send = {};
        const receive = {};

        if (direction === 'go') {
            send.sender = config.rightNum;
            send.senderName = config.rightName;

            receive.receiver = config.leftNum;
            receive.receiverName = config.leftName;
        }

        if (direction === 'come') {
            send.sender = config.leftNum;
            send.senderName = config.leftName;

            receive.receiver = config.rightNum;
            receive.receiverName = config.rightName;
        }

        const { html, type, fileParse } = coverEmoji(v);
        const msg = {
            source: 'MobileQQ',
            device: config.device,
            type,

            direction,

            ...send,
            ...receive,

            day: dayjs(v.time).format('YYYY-MM-DD'),
            time: dayjs(v.time).format('HH:mm:ss'),
            ms: dayjs(v.time).valueOf(),

            content: FACE_0014('content', v.msg),
            html: FACE_0014('html', html),

            msAccuracy: false,

            $MobileQQ: {
                os: 's60v3',
                raw: {
                    piece: JSON.stringify(v.piece), //原始数据
                },
                key: {
                    s60type: v.type,
                    s60direction: v.direction.code,
                },
                data: {
                    // fileParse,
                    // s60RealTime,
                },
            },
        };
        if (config.isFromOtherAccount) {
            _.set(msg, '_isDev.isFromOtherAccount', config.isFromOtherAccount);
        }

        if (fileParse) msg.$MobileQQ.data.fileParse = fileParse;

        return msg;
    });
    return arr;
}
const unknownFile = [];

const fileHaveDir = ['发送成功', '取消发送', '对方取消接收', '接收成功', '对方拒绝接收'];
const fileHaveDirReg = new RegExp(`^(${fileHaveDir.join('|')})`);

const fileNotHaveDir = ['传输中止', '取消接收', '对方取消发送', '对方取消了文件的传送或网络错误'];
const knownFile = [].concat(fileHaveDir, fileNotHaveDir);

/**
 * @name: coverEmoji
 * @description: html 显示 emoji， 处理接收的文件
 * @param {type}
 * @return {type}
 */
function coverEmoji(v) {
    let type = '消息';
    let html = v.msg;
    let fileParse;
    for (let i = 0; i < FACE_EMOJI.length; i++) {
        const face = FACE_EMOJI[i];
        html = html.replace(
            new RegExp(`\\[${face.alias}\\]`, 'gm'),
            `<img class="s60_qq_emoji" src="${config.faceWebPublicDir}/${encodeURIComponent(
                face.alias,
            )}.gif" alt="QQ经典-${face.alias}" title="QQ经典-${face.alias}" />`,
        );
        v.msg = v.msg.replace(new RegExp(`\\[${face.alias}\\]`, 'gm'), `[QQ经典-${face.alias}]`);
    }
    // \n \f --> <br/>
    html = html.replace(/(\n|\f)/gm, '<br/>');
    v.msg = v.msg.replace(/\f/gm, '\n');

    if ([144, 16].includes(v.direction.code)) {
        type = '文件';
        if (fileNotHaveDir.some(k => v.msg.startsWith(k))) {
            // 这些是不带文件及路径的
        } else {
            const fileName = v.msg
                .replace(fileHaveDirReg, '')
                .replace(/\\/g, '/')
                .replace(/:/g, '') // E:\QQDownload\Audio\QQ-145684632 -> E/QQDownload/Audio/QQ-145684632
                .trim();
            fileParse = path.parse(fileName);
            const { ext, base } = fileParse;

            let dir;
            if (/^{\w{8}-\w{4}-\w{4}-\w{4}-\w{12}}\d+./.test(fileName)) {
                dir = `${config.fileWebPublicDir}/E/QQDownload/FileRecv/${encodeURIComponent(fileName)}`;
            } else {
                dir = `${config.fileWebPublicDir}/${encodeURIComponent(fileName)}`;
            }

            fileParse.url = dir;
            if (['.jpg', '.png', '.gif', '.jpeg', '.webp'].includes(ext.toLowerCase())) {
                html += `<div><img src="${dir}" /></div>`;
            } else {
                html += `<div><a href="${dir}" download>${base}</a></div>`;
            }
        }

        // 未知类型的文件 msg.body
        if (!knownFile.some(k => v.msg.startsWith(k))) {
            unknownFile.push(v.msg);
            fs.writeFileSync('./dist/unknownFile.json', JSON.stringify(unknownFile.sort(), null, 4));
            console.log('', unknownFile);
        }
    }
    if (v.direction.code == 80) {
        type = '忙';
    }
    return { html, type, fileParse };
}

module.exports = {
    qqToMsg,
};
