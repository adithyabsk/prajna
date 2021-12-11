# Pranja

## Requirements

* Python: ^3.7.0
* Node: ^14.0.0

Install python requirements

## Installation Guide

### Dependencies

What do the dependencies do?

Dev:

* Hardhat -- ethereum development environment
* Waffle -- TODO
* chai --BDD / TDD framework
* ethers -- interact with ethereum blockchain using js

### Compiling the Circuit

All the steps are encoded in `circuits/Makefile`. The following are the most
important commands

```shell
make contract
make inputs
```

This generates the verifier smart contract `main.sol` and its call data which is
in the file `calldata.dat`. The calldata is derived from the `hash_input.json`
file and the contents of this file can be changed.

To verify the proof through the CLI, run the following after running the above.

```shell
make verify
```

The manual order for compiling a circuit is as follows:
```shell
# Circuit compilation and smart contract generation
make compile
make zkey
make solidity
# Generate verification key, proof witness, proof statement, and call data
make vkey
make witness
make generate_proof
make calldata
# CLI proof verification
make verify
```

### Q & A

- How to run a JS cli command installed in node_modules
  - `npx [cmd]`
  - This searches in bin for the cmd otherwise it downloads from the package
  into a tmp folder
- What is the max size of an Ethereum smart contract
  - 24.576 kB

### FAQ

- What does prajna mean?
  - It is a sanskrit term for knowledge or wisdom

## Future Work

- [ ] Set this project's own power's of tau pot file
- [ ] Figure out how to make the zkey file smaller (it's still 14MB)
  * The size for SHA256 was 21GB
