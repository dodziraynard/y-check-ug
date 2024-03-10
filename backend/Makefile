# # Makefile for running Django fixture creation and tests

# Target for creating fixtures
DJANGO_APP = dashboard.Section dashboard.QuestionGroup dashboard.Question dashboard.Option dashboard.PreviousResponseRequirement dashboard.FlagLabel dashboard.FlagColor dashboard.FlagCondition
mkft:
	ssh ycheck@167.71.140.136 "docker exec -t ycheck_web python manage.py dumpdata $(DJANGO_APP) > ~/initial_data.json"

# Download live fixtures
dft:
	@echo "Downloading fixtures"
	scp ycheck@167.71.140.136:~/initial_data.json ./dashboard/fixtures/initial_data.json


# Target for running Django tests
run_tests:
	@echo "Running Django tests..."
	python -m coverage run manage.py test
	@echo "Django tests completed."

make cov:
	python -m coverage report

# Target to run both fixture creation and tests
test: run_tests
uft: mkft dft
all: mkft dft run_tests

# Default target
.DEFAULT_GOAL := test
