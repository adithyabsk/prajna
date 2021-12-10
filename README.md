# Pranja

## Requirements

* Python: ^3.7.0
* Node: ^14.0.0

Install python requirements

## TODO

### Immediate

- [x] Read ZKP and zkSNARK paper
  * http://people.csail.mit.edu/silvio/Selected%20Scientific%20Papers/Proof%20Systems/The_Knowledge_Complexity_Of_Interactive_Proof_Systems.pdf
  * https://eprint.iacr.org/2013/879.pdf
- [x] Set up hardhat dev env
  * Read hardhat docs
- [x] Set up `circom` env to compile the zkSNARK circuits
- [x] Set up `snarkjs` with sha256 example with 448 bit strings
- [ ] Read the Poseidon and Pederson hash papers and understand their
differences from SHA256
  * Figure out if there is a JS implementation of either
- [ ] Get a unit test in circomlib using either Poseidon or Pederson that uses
a string input
  * Figure out if variable size string inputs are possible
- [ ] Run through the same steps below except for the new hash function, hope
that we are able to generate a smart contract that can actually be deployed to
the blockchain
- [ ] incentives
- [ ] front end to generate and deploy smart contracts
- [ ] way to browse puzzles
 * browse the blockchain
- [ ] way to answer puzzles

### Big picture

Rough sketch of what needs to happen

- [ ] MVP smart contract with a hardcoded secret
- [ ] A way to generate smart contracts with a hardcoded hashed secret
- [ ] A solidity approach to decrypting keccak256 hashed strings that provide
hints when the contract pot hits a certain value
  *


## Installation Guide

### Dependencies

What do the dependencies do?

Dev:

* Hardhat -- ethereum development environment
* Waffle -- TODO
* chai --BDD / TDD framework
* ethers -- interact with ethereum blockchain using js

### Compiling the Circuit

* Generate the circuit components
  * `cd circuits; circom main.circom --r1cs --wasm --sym`
    * `--r1cs`: output constraints in r1cs form
    * `--wasm`: Compiles the circuit to a wasm
    * `--sym`: Output witness in sym format
* Generate the witness file
  * `cd main_js; node generate_witness.js main.wasm ../hash_input.json ../witness.wtns`
  - [ ] TODO: Add this step to the Makefile
* We don't need to run the powers of tau ceremony manually and can use a prior
trusted setup. This is because the ceremony is kinda a pain to set up.
  - [ ] TODO: In the future, I should set this up myself
* We can just download a `.ptau` file from the `snarkjs` github that meets the
size of the constraint size of sha256 (448 bits --> 293,511 constraints)
  * [This file is huge (576 Mb)](https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_19.ptau)
* We can then use this file along with the `plonk` prover to prove our circuit
  * `snarkjs plonk setup main.r1cs powersOfTau28_hez_final_19.ptau main_final.zkey`
  * This generates `main_final.zkey`
  * This takes a long time (21 minutes on my machine)
  * This file is ungodly large (21 Gb)
    - [ ] TODO this gives me a clear reason to explore other hashing functions
  * This is sooooo much faster for pederson testing
    * nearly instant
* I was not able to run the zkey verification step because it seems the
verification only works with the `groth16` prover algorithm
* Generate the verification key
  * `snarkjs zkey export verificationkey main_final.zkey verification_key.json`
* Generate the proof
  * `snarkjs plonk prove main_final.zkey witness.wtns proof.json public.json`
  * This also takes an ungodly long time (20 minutes)
* Verify the proof
  * `snarkjs plonk verify verification_key.json public.json proof.json`
  * This takes less than 1 ms (super fast)
  * This is too large for the EVM according to EIP-170 the max size is 24576
  bytes
    * My contract on the other hand is 6.579 kB
    
* Export as smart contract
  * `snarkjs zkey export solidityverifier main_final.zkey verifier.sol`
  * `snarkjs zkey export soliditycalldata public.json proof.json`

### Open Questions

- What is the difference between the plonk and the groth16 provers?
- What is the drawback of using different hash functions such as Pederson,
Poseidon, SHA256
  - i.e. I know that the former two are faster in ZKP setting but are there any
  drawback for using such a smaller hash function?
- How exactly does the powers of tau ceremony work?
- What is the benefit of using hardhat over remix ide
  - Is there a better ide for Solidity development?
- non-malleable proof system --> make sure that proof cannot just be copied
  - simulation soundness argument
  - look into other non-interactive proof systems that are not SNARKs

### Q & A

- How to run a JS cli command installed in node_modules
  - `npx [cmd]`
  - This searches in bin for the cmd otherwise it downloads from the package
  into a tmp folder
- What is the max size of an Ethereum smart contract
  - 24.576 kB

### FAQ

- What does prajna mean?
  - It is a hindu term for knowledge or wisdom
