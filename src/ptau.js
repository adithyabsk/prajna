#!/usr/bin/env node

const https = require('https');
const path = require("path");
const fs = require('fs')

let PTAU_DOWNLOAD_URL = "https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau"

async function downloadPowersOfTauFile(n) {
    ptau_path = path.join(__dirname, "../circuits/powersOfTau28_hez_final_12.ptau")
    if (fs.existsSync(ptau_path)) {
        return "already exists";
    } else {
        const file = fs.createWriteStream(ptau_path);
        const request = https.get(PTAU_DOWNLOAD_URL, (response) => {
          response.pipe(file);
        });
        return ptau_path;
    }
}

downloadPowersOfTauFile().then(possiblePath => {
    if(possiblePath === "already exists") {
        console.log("Already download powers of tau file.")
    } else {
        console.log(`Downloaded powers of tau file to path ${possiblePath}`)
    }
})
