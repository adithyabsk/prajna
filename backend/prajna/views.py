from django.shortcuts import render
from .puzzle import get_solidity_verifier

from django import forms


class PuzzleForm(forms.Form):
    number = forms.IntegerField()


def landing_page(request):
    return render(request, "prajna/landing.html")


def create_puzzle(request):
    data = {
        "solidity_code": None,
        "form": PuzzleForm()
    }
    if request.method == "GET":
        return render(request, "prajna/create-puzzle.html", data)
    elif request.method == "POST":
        form = PuzzleForm(request.POST)
        data["form"] = form
        if not form.is_valid():
            return render(request, "prajna/create-puzzle.html", data)
        try:
            # TODO: Add zkey export. The file is kinda big in the MB range so it
            #       really slows down the page load. We should provide the zkey
            #       as a download link.
            sol_data, _ = get_solidity_verifier(form.cleaned_data["number"])
            data["solidity_code"] = sol_data
            # data["zkey"] = zkey_data
        except:  # noqa: E722
            data["solidity_code"] = "Failed to generate solidity code."
            # data["zkey"] = ""

        return render(request, "prajna/create-puzzle.html", data)
