# /demo

Final verification and live demo on `main` branch.

## Usage
```
/demo
```

## Steps
1. `git checkout main && git pull origin main`
2. `uv run pytest -xvs` — full suite, must be all green
3. `uv run mypy . --strict` — must be clean
4. `uv run ruff check .` — must be clean
5. Run the primary use case end-to-end (use examples from README.md)
6. Print: feature list, test count, any open issues

## Output format
```
DEMO RESULTS
============
Branch: main @ <commit hash>
Tests: X passed, 0 failed
Mypy: clean
Ruff: clean

Features shipped:
  ✅ Feature 1: <name>
  ✅ Feature 2: <name>
  ...

Live demo:
  $ <command>
  <output>
```
