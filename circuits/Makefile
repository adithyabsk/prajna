TARGET_NAME = main
CIRCOM_OPTIONS = --wasm

CIRCOM_OUTPUTS = $(addprefix $(TARGET)_js/, generate_witness.js $(TARGET).wasm witness_calculator.js)

.PHONY:
	all
	help
	contract
	inputs
	compile
	zkey
	solidity
	witness
	vkey
	generate_proof
	calldata
	verify
	clean

## ----------------------------------------------------------------------
## This Makefile is used to build the prover and verifier steps for a
## circom circuit. Use the commands to the left of the colon to run
## through the proving and verifying steps.
## ----------------------------------------------------------------------

all: contract

help:	## Show the help
	@sed -ne '/@sed/!s/## //p' $(MAKEFILE_LIST)


# Create the calldata for the above solidity smart contract from the
# hash_input.json file.
contract: compile zkey solidity  ## Generate a smart contract that proves the target circuit

# Create the calldata for the above solidity smart contract from the
# hash_input.json file.
inputs: witness generate_proof calldata  ## Generate the calldata for the smart contract

# Compile the circuit
compile : $(TARGET_NAME).circom
	circom $(TARGET_NAME).circom $(CIRCOM_OPTIONS)

# Generate the zkey for the solution
$(TARGET_NAME).zkey : $(TARGET_NAME).r1cs powersOfTau28_hez_final_12.ptau
	npx snarkjs plonk setup $(TARGET_NAME).r1cs powersOfTau28_hez_final_12.ptau \
$(TARGET_NAME).zkey
# alias for the zkey step
zkey : $(TARGET_NAME).zkey

# Generate the smart contract that will verify proofs
$(TARGET_NAME).sol : $(TARGET_NAME).zkey
	npx snarkjs zkey export solidityverifier $(TARGET_NAME).zkey $(TARGET_NAME).sol
solidity : $(TARGET_NAME).sol

# Generate the witness for the solution
$(TARGET_NAME).wtns : $(TARGET_NAME)_js/generate_witness.js $(TARGET_NAME)_js/main.wasm hash_input.json
	node $(TARGET_NAME)_js/generate_witness.js $(TARGET_NAME)_js/main.wasm \
hash_input.json $(TARGET_NAME).wtns
witness : $(TARGET_NAME).wtns

# Export the zkey to a json verification key
$(TARGET_NAME)_vkey.json : $(TARGET_NAME).zkey
	npx snarkjs zkey export verificationkey $(TARGET_NAME).zkey $(TARGET_NAME)_vkey.json
vkey : $(TARGET_NAME)_vkey.json

# Generate the proof and the public output (JSON files)
generate_proof : $(TARGET_NAME).zkey $(TARGET_NAME).wtns
	npx snarkjs plonk prove $(TARGET_NAME).zkey $(TARGET_NAME).wtns \
$(TARGET_NAME)_proof.json $(TARGET_NAME)_public.json

# Generate the solidity call data information. The first line the bytecode of
# the proof. The second line is the public signals. We use sed to turn the first
# comma into a newline. Note the extra dollar sign is to escape it in the
# Makefile
$(TARGET_NAME)_calldata.dat : $(TARGET_NAME)_public.json $(TARGET_NAME)_proof.json
	npx snarkjs zkey export soliditycalldata $(TARGET_NAME)_public.json \
$(TARGET_NAME)_proof.json | sed $$'s/,/\\\n/' > \
$(TARGET_NAME)_calldata.dat
calldata : $(TARGET_NAME)_calldata.dat

# CLI proof verification
verify: $(TARGET_NAME)_vkey.json $(TARGET_NAME)_public.json $(TARGET_NAME)_proof.json
	npx snarkjs plonk verify $(TARGET_NAME)_vkey.json $(TARGET_NAME)_public.json \
$(TARGET_NAME)_proof.json

# Clean up all the generated files
clean:
	rm -rf $(TARGET_NAME)_js $(TARGET_NAME).r1cs $(TARGET_NAME).sym \
$(TARGET_NAME).wtns $(TARGET_NAME).zkey $(TARGET_NAME).sol \
$(TARGET_NAME)_vkey.json $(TARGET_NAME)_proof.json $(TARGET_NAME)_public.json \
$(TARGET_NAME)_calldata.dat
