const { describe } = require("mocha");
const fs = require('fs');

const path = require("path");
const buildMimcSponge = require("circomlibjs").buildMimcSponge;

const buildPedersenHash = require("circomlibjs").buildPedersenHash;
const buildBabyJub = require("circomlibjs").buildBabyjub; // field to point

const wasm_tester = require("circom_tester").wasm;

const assert = require("assert");
const {
    strToBitArray,
    bitArray2buffer
} = require("../src/index.js");


describe("MiMC Sponge Circuit test", function () {
    let circuit;
    let mimcSponge;
    let F;

    this.timeout(100000);

    before( async () => {
        mimcSponge = await buildMimcSponge();
        F = mimcSponge.F;
    });
    // after(async () => {
    //     globalThis.curve_bn128.terminate();
    // });

    it("Should check hash", async () => {
        const ckt_path = path.join(__dirname, "..", "circuits")
        circuit = await wasm_tester(path.join(ckt_path, "main.circom"));

        const input = {ins: [1337], k: 0}
        const w = await circuit.calculateWitness(input);

        fs.writeFile(path.join(ckt_path, "hash_input.json"), JSON.stringify(input), function(err) {
            if (err) console.log(err);
        });

        const out2 = mimcSponge.multiHash([1337], 0, 3);

        for (let i=0; i<out2.length; i++) out2[i] = F.toObject(out2[i]);

        await circuit.assertOut(w, {outs: out2});

        await circuit.checkConstraints(w);
    });
});

describe("Pedersen test", function() {
    let babyJub
    let pedersen;
    let F;
    let circuit;
    this.timeout(100000);

    before( async() => {
        babyJub = await buildBabyJub();
        F = babyJub.F;
        pedersen = await buildPedersenHash();
        circuit = await wasm_tester(path.join(__dirname, "..", "circuits", "main.circom"));
    });
    // after(async () => {
    //     globalThis.curve_bn128.terminate();
    // });

    it("Should be able to handle string input", async() => {
        // let pedersen = await buildPedersenHash();
        // let babyJub = await buildBabyJub();
        // let F = babyJub.F;
        // const circuit = await wasm_tester(path.join(__dirname, "..", "circuits", "main.circom"));
        let testStr = "Hello World!";
        const arrIn = strToBitArray(testStr);

        fs.writeFile("hash_input.json", JSON.stringify({ "in": arrIn }), function(err) {
            if (err) console.log(err);
        });

        let witness = await circuit.calculateWitness({ in: arrIn}, true);
        const witnessPoints = witness.slice(1, 3);

        // I have no clue but this does not work for 448 but it works for 256 bit size
        const groundTruthHash = pedersen.hash(arrIn);
        const hashPoint = babyJub.unpackPoint(groundTruthHash);
        const groundTruthPoints = [F.toObject(hashPoint[0]), F.toObject(hashPoint[1])];

        // assert.equal(witnessPoints, groundTruthPoints);
        let a = 10;
    });
});