TARGET_NAME = main
CIRCOM_OPTIONS = --r1cs --wasm --sym

TARGET = $(TARGET_NAME).circom
CIRCOM_OUTPUTS = $(addprefix $(TARGET)_js/, generate_witness.js $(TARGET).wasm witness_calculator.js)

.PHONY:
	clean
	all
	compile

all: compile

compile : # $(TARGET).circom
	circom $(TARGET) $(CIRCOM_OPTIONS)

clean:
	rm -rf $(TARGET_NAME)_js $(TARGET_NAME).r1cs $(TARGET_NAME).sym *.wtns