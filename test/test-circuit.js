const { describe } = require("mocha");
const fs = require('fs');
const path = require("path");
const { buildMimcSponge } = require("circomlibjs");
const { wasm : wasm_tester } = require("circom_tester");
// const assert = require("assert");
// const {
//     strToBitArray,
//     bitArray2buffer
// } = require("../src/index.js");


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
        let a = 10;
    });
});
