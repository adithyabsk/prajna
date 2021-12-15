from collections import namedtuple

from django.shortcuts import render

from .models import Puzzle, PuzzleSubmitForm, PuzzleChoiceForm

CallData = namedtuple('CallData', ('proof', 'pubSignals'))

def landing_page(request):
    return render(request, "prajna/landing.html")


def create_puzzle(request):
    data = {
        "solidity_code": None,
        "form": PuzzleSubmitForm(),
    }
    if request.method == "GET":
        return render(request, "prajna/create-puzzle.html", data)
    elif request.method == "POST":
        form = PuzzleSubmitForm(request.POST)
        data["form"] = form
        # TODO: this just truncates the form, we need to return info to the user
        #       if the name is greater than 30 chars, for example (so it will
        #       always be valid) this is because we use custom html for the form
        #       to integrate with bootstrap.
        if not form.is_valid():
            return render(request, "prajna/create-puzzle.html", data)
        # try:
            # TODO: Add zkey export. The file is kinda big in the MB range so it
            #       really slows down the page load. We should provide the zkey
            #       as a download link.
        puzzle = Puzzle.create_save(
            form.cleaned_data["name"],
            form.cleaned_data["description"],
            form.cleaned_data["solution"]
        )
        with puzzle.sol.open('r') as sol_file:
            data["solidity_code"] = sol_file.read()
            # data["zkey"] = zkey_data
        # except:  # noqa: E722
        #     data["solidity_code"] = "Failed to generate solidity code."
        #     # data["zkey"] = ""

        return render(request, "prajna/create-puzzle.html", data)


def solve_puzzle(request):
    data = {
        "form": PuzzleChoiceForm(),
        "call_data": CallData("", ""),
    }
    if request.method == "GET":
        return render(request, "prajna/solve-puzzle.html", data)
    elif request.method == "POST":
        form = PuzzleChoiceForm(request.POST)
        data["form"] = form
        if not form.is_valid():
            return render(request, "prajna/create-puzzle.html", data)
        puzzle = form.cleaned_data["choice"]
        try:
            call_data = puzzle.get_call_data(form.cleaned_data["solution"])
        except ValueError:
            form.add_error(
                None,
                "Unable to generate witness: solution is not valid."
            )
            return render(request, "prajna/solve-puzzle.html", data)

        data["call_data"] = CallData(*call_data)

        return render(request, "prajna/solve-puzzle.html", data)
