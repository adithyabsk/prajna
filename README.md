# Pranja

## Requirements

* Python: ^3.7.0
* Node: ^16.0.0

Install python requirements

## Installation Guide

## Developer Deps

- [ ] TODO: write up reproducible dev env setup

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

Note: The `hash_input.json` file is generated from a unit test in
`test/test-circuit.js`.

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

### FAQ

- What does prajna mean?
  - It is a sanskrit term for knowledge or wisdom

## Future Work

- [ ] There was a bug with the gulp.js task to copy the minified version of
bootstrap, jquery, and popper to the `_vendor` folder
  - It works when we use the CDN versions of the libraries. This likely means
  that there either is an issue with the version that I am copying over or the
  minified gulp copies are somehow wrong.
- [ ] Add syntax highlighting to the solidity snippet in create-puzzle page.
- [ ] Use this project's own power's of tau pot file
- [ ] Figure out how to make the zkey file smaller (it's still 14MB)
  * The size for SHA256 was 21GB
- [ ] Add zkey export functionality
- [ ] Automate the process of publishing puzzle smart contracts
- [ ] Move to a Next.js setup where we can persist state between pages and use
React packages. (for wallet connect)