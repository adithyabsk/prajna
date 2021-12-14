import subprocess
import tempfile
from pathlib import Path
from typing import Tuple

from django.db import models, transaction
from django.core.files.base import ContentFile
from django import forms

from .puzzle import generate_circuit

INPUT_TEMPLATE = "{{\"in\": {}}}"
FILE_PARENT = Path(__file__).parent


class Puzzle(models.Model):
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=2000)
    solution = models.IntegerField()

    # circuit characteristics
    sol = models.FileField(max_length=30)
    zkey = models.FileField(max_length=30)

    # witness generation
    wasm = models.FileField(max_length=30)

    @classmethod
    def create_save(cls, name, description, solution):
        with transaction.atomic():
            puzzle = cls(name=name, description=description, solution=solution)
            with tempfile.TemporaryDirectory() as tmp_dir:
                generate_circuit(Path(tmp_dir), solution)

                sol_path = Path(tmp_dir) / "main.sol"
                with open(sol_path, 'r') as sol_file:
                    puzzle.sol = ContentFile(sol_file.read(), name=f"{puzzle.name}.sol")

                zkey_path = Path(tmp_dir) / "main.zkey"
                with open(zkey_path, 'rb') as zkey_file:
                    puzzle.zkey = ContentFile(zkey_file.read(), name=f"{puzzle.name}.zkey")

                wasm_path = Path(tmp_dir) / "main_js/main.wasm"
                with open(wasm_path, 'rb') as wasm_file:
                    puzzle.wasm = ContentFile(wasm_file.read(), name=f"{puzzle.name}.wasm")

            puzzle.save()
            return puzzle

    def get_call_data(self, solution) -> Tuple[str, str]:
        with tempfile.TemporaryDirectory() as tmp_dir:
            tmp_path = Path(tmp_dir)

            # Get witness file
            # TODO: this entire part of the app should be able to be run on the
            #       frontend so it does not need to touch a "trusted" backend
            #       server.
            hash_input_json = INPUT_TEMPLATE.format(solution)
            hash_input_path = tmp_path / "hash_input.json"
            with open(hash_input_path, 'w') as input_file:
                input_file.write(hash_input_json)
            genwit_path = FILE_PARENT / "assets/generate_witness.js"
            genwit_proc = subprocess.run(
                ('node', str(genwit_path), f"{self.wasm.path}",
                 str(hash_input_path), "main.wtns"), cwd=tmp_dir)
            if not genwit_proc.returncode == 0:
                raise ValueError(f"Error generating witness for puzzle {self.name}")

            # generate proof
            subprocess.check_output(
                ("npx", "snarkjs", "plonk", "prove", f"{self.zkey.path}",
                 "main.wtns", "main_proof.json", "main_public.json"),
                cwd=tmp_dir
            )

            # Get calldata
            calldata_str = subprocess.check_output(
                ("npx", "snarkjs", "zkesc", "main_public.json",
                 "main_proof.json"),
                cwd=tmp_dir
            )
            calldata: Tuple[str, str] = calldata_str.decode('utf-8').strip().split(',', 1)

            return tuple(calldata)

    def __str__(self):
        return f"{self.name}"


class BootstrapForm(forms.Form):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'form-control'


class PuzzleSubmitForm(BootstrapForm):
    name = forms.CharField(max_length=30, label="Puzzle Name")
    description = forms.CharField(max_length=2000, widget=forms.Textarea, label="Puzzle Description", required=False)
    solution = forms.IntegerField(label="Puzzle Solution")


class PuzzleChoiceForm(BootstrapForm):
    choice = forms.ModelChoiceField(queryset=Puzzle.objects.all())
    solution = forms.IntegerField(label="Puzzle Solution")
