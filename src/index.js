function buffer2bitArray(b) {
    const res = [];
    for (let i=0; i<b.length; i++) {
        for (let j=0; j<8; j++) {
            res.push((b[i] >> (7-j) &1));
        }
    }
    return res;
}

function bitArray2buffer(a) {
    const len = Math.floor((a.length -1 )/8)+1;
    const b = new Buffer.alloc(len);

    for (let i=0; i<a.length; i++) {
        const p = Math.floor(i/8);
        b[p] = b[p] | (Number(a[i]) << ( 7 - (i%8)  ));
    }
    return b;
}

function padStringToLength(s, length, pad="a") {
    if (s.length <= length) {
        return s.padEnd(length, pad);
    } else {
        return s.slice(length);
    }
}

const MAX_STR_LENGTH = 32; // 56;

function strToBitArray(s) {
    let testStr = "Hello World!";
    let paddedStr = padStringToLength(testStr, MAX_STR_LENGTH);
    const b = Buffer.from(paddedStr, "ascii");
    return buffer2bitArray(b);
}



module.exports =  {buffer2bitArray, bitArray2buffer, strToBitArray};
