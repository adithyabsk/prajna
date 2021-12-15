#!/usr/bin/env node

const https = require('https');
const path = require("path");
const fs = require('fs');
const {execSync} = require("child_process");
const commandExists = require('command-exists').sync;

let PTAU_DOWNLOAD_URL = "https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau"

async function downloadPowersOfTauFile() {
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

async function installCircom() {
    if (commandExists('circom')) {
        return 'already exists';
    } else {
        if (!commandExists('rustup')) {
            const setupRustCmd = "curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh"
            execSync(setupRustCmd, (error, stdout, stderr) => {
                console.log(clone_cmd);
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
        }
        const clone_cmd = "git clone https://github.com/iden3/circom.git"
        execSync(clone_cmd, (error, stdout, stderr) => {
            console.log(clone_cmd);
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
        const buildCmd = "cd circom && cargo build --release && cargo install --path circom";
        execSync(buildCmd, (error, stdout, stderr) => {
                console.log(buildCmd);
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
    }
}

downloadPowersOfTauFile().then(possiblePath => {
    if (possiblePath === "already exists") {
        console.log("Already download powers of tau file")
    } else {
        console.log(`Downloaded powers of tau file to path ${possiblePath}`)
    }
})
installCircom().then(status => {
    if (status === "already exists") {
        console.log("Already installed circom")
    } else {
        console.log("Downloaded the circom command")
    }
})
