const path = require('path');
const fs = require('fs-extra');
const amrToMp3 = require('amrToMp3');
const _ = require('lodash');

const msgArr = require('./msg-qq_s60');

const _msgArr = _.cloneDeep(msgArr);

fs.emptyDirSync('./input/data/qq-s60');
fs.emptyDirSync('./dist/');
fs.emptyDirSync('./dist-amr/');

fs.copySync('E:/Shmily/Tool/Show/public/data/qq-s60', './input/data/qq-s60');

(async () => {
    for (let j = 0; j < msgArr.length; j++) {
        const v = msgArr[j];

        if (!v.$MobileQQ.fileParse) continue;

        const f = decodeURI(v.$MobileQQ.fileParse.url);
        const ext = v.$MobileQQ.fileParse.ext.toLowerCase();

        const i = path.join(__dirname, './input/', f);

        if (!fs.existsSync(i)) {
            continue;
        }

        if (ext != '.amr') {
            const o = path.join(__dirname, './dist/', f);
            fs.moveSync(i, o);
        } else {
            const { dir } = path.parse(f);
            const o = path.join(__dirname, './dist/', dir);
            fs.mkdirpSync(o);
            await amrToMp3(i, o);
            const _f = f.replace(/amr$/i, 'mp3');
            const { ext: ext_n, base: base_n } = path.parse(_f);
            v.$MobileQQ.fileParse.ext = ext_n;
            v.$MobileQQ.fileParse.base = base_n;
            v.$MobileQQ.fileParse.url = encodeURI(_f);
            fs.moveSync(i, path.join(__dirname, './dist-amr/', f));
        }
    }
    console.log(_.isEqual(msgArr, _msgArr));

    fs.writeFileSync('./dist/msg-qq_s60.json', JSON.stringify(msgArr, null, 4));
})();
