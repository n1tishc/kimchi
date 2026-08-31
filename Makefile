PYTHON ?= .venv/bin/python

.PHONY: backend-install backend-test backend-dev frontend-install frontend-check

backend-install:
	$(PYTHON) -m pip install -r be/requirements.txt

backend-test:
	$(PYTHON) -m unittest discover -s be/tests -t . -v

backend-dev:
	$(PYTHON) -m uvicorn be.server:app --host 127.0.0.1 --port 8000

frontend-install:
	npm --prefix fe ci

frontend-check:
	npm --prefix fe run lint
	npm --prefix fe run build
