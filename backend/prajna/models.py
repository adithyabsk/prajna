import tempfile
from pathlib import Path

from django.db import models, transaction
from django.core.files.base import ContentFile
from django import forms

from .puzzle import generate_circuit


class Puzzle(models.Model):
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=2000)
    solution = models.IntegerField()

    # circuit characteristics
    sol = models.FileField(max_length=30)
    vkey = models.FileField(max_length=30)

    # witness generation
    genwit = models.FileField(max_length=30)
    wasm = models.FileField(max_length=30)
    witcalc = models.FileField(max_length=30)

    @classmethod
    def create_save(cls, name, description, solution):
        with transaction.atomic():
            puzzle = cls(name=name, description=description, solution=solution)
            with tempfile.TemporaryDirectory() as tmp_dir:
                generate_circuit(Path(tmp_dir), solution)

                sol_path = Path(tmp_dir) / "main.sol"
                with open(sol_path, 'r') as sol_file:
                    puzzle.sol = ContentFile(sol_file.read(), name=f"{puzzle.name}.sol")

                vkey_path = Path(tmp_dir) / "main_vkey.json"
                with open(vkey_path, 'r') as vkey_file:
                    puzzle.vkey = ContentFile(vkey_file.read(), name=f"{puzzle.name}_vkey.json")

                genwit_path = Path(tmp_dir) / "main_js/generate_witness.js"
                with open(genwit_path, 'r') as getwit_file:
                    puzzle.genwit = ContentFile(getwit_file.read(), name=f"{puzzle.name}_genwit.js")

                wasm_path = Path(tmp_dir) / "main_js/main.wasm"
                with open(wasm_path, 'rb') as wasm_file:
                    puzzle.wasm = ContentFile(wasm_file.read(), name=f"{puzzle.name}.wasm")

                genwit_path = Path(tmp_dir) / "main_js/witness_calculator.js"
                with open(genwit_path, 'r') as witcalc_file:
                    puzzle.witcalc = ContentFile(witcalc_file.read(), name=f"{puzzle.name}_witcalc.js")

            puzzle.save()
            return puzzle

    def __str__(self):
        return f"name={self.name}"


class PuzzleForm(forms.Form):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'form-control'

    name = forms.CharField(max_length=30, label="Puzzle Name")
    description = forms.CharField(max_length=2000, widget=forms.Textarea, label="Puzzle Description", required=False)
    solution = forms.IntegerField(label="Puzzle Solution")
