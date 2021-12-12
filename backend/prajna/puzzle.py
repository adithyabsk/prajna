"""Manage the creation and verification of a puzzle"""

from typing import List, Tuple
from pathlib import Path
import shutil
import tempfile
import subprocess
from ast import literal_eval

FILE_PATH = Path(__file__).parent.resolve()
CKT_PATH = (FILE_PATH / "../../circuits/").resolve()
MIMC_SCRIPT_PATH = (FILE_PATH / "../../src/mimc.js").resolve()
POWERS_OF_TAU_FNAME = "powersOfTau28_hez_final_19.ptau"
CIRCUIT_TEMPLATE = """
pragma circom 2.0.0;

include "{}";

template Main() {{
    signal input in;

    component sponge = MiMCSponge(1, 220, 3);

    sponge.ins[0] <== in;
    sponge.k <== 0;

    sponge.outs[0] === {};
    sponge.outs[1] === {};
    sponge.outs[2] === {};
}}

component main = Main();
"""


def get_hash_values(solution: int) -> List[int]:
    output = subprocess.run([str(MIMC_SCRIPT_PATH), str(solution)], check=True, capture_output=True)
    hash_values = literal_eval(output.stdout.decode())
    return list(map(int, hash_values))


def generate_circuit(tmp_dir: Path, solution: int):
    pedersen_template_path = CKT_PATH / "circuit_lib/mimcsponge.circom"
    makefile_path = CKT_PATH / "Makefile"
    circuit_path = tmp_dir / "main.circom"
    ptau_path = CKT_PATH / POWERS_OF_TAU_FNAME

    # Get the three hash values
    hash_values = get_hash_values(solution)

    # Make the circuit
    ckt = CIRCUIT_TEMPLATE.format(
        pedersen_template_path,
        *hash_values
    )
    with open(circuit_path, "w") as f:
        f.write(ckt)

    # Copy the makefile and the powers of tau file to the temp directory
    shutil.copy(makefile_path, tmp_dir)
    shutil.copy(ptau_path, tmp_dir)

    # make the circuit
    subprocess.run(['make', 'compile'], cwd=tmp_dir)
    subprocess.run(['make', 'zkey'], cwd=tmp_dir)
    subprocess.run(['make', 'solidity'], cwd=tmp_dir)
    subprocess.run(['make', 'vkey'], cwd=tmp_dir)
