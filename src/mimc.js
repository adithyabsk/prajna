#!/usr/bin/env node

const { buildMimcSponge } = require("circomlibjs");

async function getMiMCHashOutput(n) {
    const mimcSponge = await buildMimcSponge();
    const F = mimcSponge.F;
    const out2 = mimcSponge.multiHash([n], 0, 3);
    for (let i=0; i<out2.length; i++) out2[i] = F.toObject(out2[i]);

    return out2;
}

const args = process.argv.slice(2);
const number = parseInt(args[0]);
if (number === undefined || isNaN(number) ){
    console.log("Usage: mimc.js <number>");
    process.exit(1);
}
getMiMCHashOutput(number).then(data => {
  console.log(data.map(x => x.toString()))
})