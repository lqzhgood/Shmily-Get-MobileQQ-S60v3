const dayjs = require('dayjs');
const fs = require('fs');

const name = '2_4_1';
const arr = require(`./${name}.json`);

let count = 0;

for (let i = 1; i < arr.length; i++) {
    const last_msg = arr[i - 1];
    const curr_msg = arr[i];

    if (curr_msg.ms < last_msg.ms) {
        count++;
        if (!curr_msg.$MobileQQ.s60RealTime) {
            curr_msg.$MobileQQ.s60RealTime = `${curr_msg.day} ${curr_msg.time}`;
        }

        curr_msg.ms = last_msg.ms + 1;
        curr_msg.day = dayjs(curr_msg.ms).format('YYYY-MM-DD');
        curr_msg.time = dayjs(curr_msg.ms).format('HH:mm:ss');
    }
}

fs.writeFileSync(`./${name}_fixTime.json`, JSON.stringify(arr, null, 4));

console.log('count', count);
