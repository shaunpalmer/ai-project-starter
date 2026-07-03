#!/usr/bin/env python3
"""
Planning gate checker for ai-project-starter.

This script intentionally uses simple marker checks.
It does not use fuzzy AI validation.

It fails when required planning files are missing, empty, or still unresolved.
"""

from __future__ import annotations

from pathlib import Path
import re
import sys


ROOT = Path(__file__).resolve().parents[1]

REQUIRED_FILES = [
    "PROJECT-INTAKE.md",
    "AGENTS.md",
    "HARNESS-LOOP.md",
    "00-PLANNING/DECISIONS-TO-MAKE.md",
    "ARCHITECTURE.md",
    "TECH-SPEC.md",
    "TASKS.md",
    "AI-NOTES.md",
]

OPTIONAL_CONTEXT_FILES = [
    "DATABASE.md",
    "DATA-FLOW.md",
]

PLACEHOLDER_PATTERNS = [
    r"\bTODO\b",
    r"\bTBD\b",
    r"\bFILL\s+THIS\b",
    r"\bPLACEHOLDER\b",
    r"\bUNRESOLVED\b",
    r"_Describe",
    r"_One paragraph",
    r"___________",
]


def read_file(path: Path) -> str:
    """Return file content as text."""
    return path.read_text(encoding="utf-8", errors="replace")


def fail(message: str, failures: list[str]) -> None:
    """Add a failure message."""
    failures.append(f"- {message}")


def file_has_real_content(content: str, min_non_empty_lines: int = 5) -> bool:
    """Check whether a file has enough non-empty lines to be useful."""
    lines = [line.strip() for line in content.splitlines() if line.strip()]
    return len(lines) >= min_non_empty_lines


def contains_bad_placeholder(content: str) -> list[str]:
    """Return placeholder markers found in content."""
    found: list[str] = []

    for pattern in PLACEHOLDER_PATTERNS:
        if re.search(pattern, content, flags=re.IGNORECASE):
            found.append(pattern)

    return found


def check_required_files(failures: list[str]) -> None:
    """Check that required planning files exist and have content."""
    missing_files = []

    for relative_path in REQUIRED_FILES:
        path = ROOT / relative_path

        if not path.exists():
            fail(f"Missing required file: `{relative_path}`", failures)
            missing_files.append(relative_path)
            continue

        content = read_file(path)

        if not file_has_real_content(content):
            fail(f"`{relative_path}` appears empty or too thin.", failures)
            continue

        # Check for placeholder patterns in files that exist and have content
        placeholders = contains_bad_placeholder(content)
        if placeholders:
            fail(
                f"`{relative_path}` still contains placeholder markers: {', '.join(placeholders)}",
                failures,
            )

    # Early exit: don't check gates if core files are missing
    if missing_files:
        return


def check_project_intake(failures: list[str]) -> None:
    """Check PROJECT-INTAKE.md has a completion marker."""
    path = ROOT / "PROJECT-INTAKE.md"

    if not path.exists():
        return

    content = read_file(path)

    if "COMPLETED: true" not in content:
        fail("`PROJECT-INTAKE.md` must include `COMPLETED: true` before coding.", failures)


def check_decision_gates(failures: list[str]) -> None:
    """Check DECISIONS-TO-MAKE.md has resolved gate markers."""
    path = ROOT / "00-PLANNING/DECISIONS-TO-MAKE.md"

    if not path.exists():
        return

    content = read_file(path)

    unresolved_markers = [
        "STATUS: UNRESOLVED",
        "STATUS: NEEDS_SHAUN",
        "STATUS: NEEDS_SENIOR_DEVELOPER",
        "NEEDS SHAUN",
        "NEEDS SENIOR DEVELOPER",
    ]

    for marker in unresolved_markers:
        if marker in content:
            fail(f"`DECISIONS-TO-MAKE.md` still contains blocker marker: `{marker}`", failures)

    resolved_count = content.count("STATUS: RESOLVED")

    if resolved_count < 5:
        fail(
            "`DECISIONS-TO-MAKE.md` should contain at least 5 resolved gates: "
            "Project type, Architecture shape, Stack choice, Database choice, Data flow (or alternatives).",
            failures,
        )


def check_tech_spec(failures: list[str]) -> None:
    """Check TECH-SPEC.md has basic stack markers."""
    path = ROOT / "TECH-SPEC.md"

    if not path.exists():
        return

    content = read_file(path)

    required_markers = [
        "Runtime:",
        "Language:",
        "Database:",
        "Dependencies:",
    ]

    for marker in required_markers:
        if marker not in content:
            fail(f"`TECH-SPEC.md` should include `{marker}` in Machine-Readable Stack Markers.", failures)


def check_architecture(failures: list[str]) -> None:
    """Check ARCHITECTURE.md has structure markers."""
    path = ROOT / "ARCHITECTURE.md"

    if not path.exists():
        return

    content = read_file(path)

    required_markers = [
        "System Overview",
        "Architecture Style",
        "Directory Structure",
    ]

    for marker in required_markers:
        if marker not in content:
            fail(f"`ARCHITECTURE.md` should include `{marker}`.", failures)


def check_task_slice(failures: list[str]) -> None:
    """Check TASKS.md names the first useful build slice."""
    path = ROOT / "TASKS.md"

    if not path.exists():
        return

    content = read_file(path)

    if "FIRST BUILD SLICE:" not in content:
        fail("`TASKS.md` must include `FIRST BUILD SLICE:` before coding.", failures)


def check_context_files(failures: list[str]) -> None:
    """Warn if context files are needed but missing."""
    arch_path = ROOT / "ARCHITECTURE.md"

    if not arch_path.exists():
        return

    arch_content = read_file(arch_path)

    if "database" in arch_content.lower() and not (ROOT / "DATABASE.md").exists():
        fail("`ARCHITECTURE.md` mentions database but `DATABASE.md` is missing.", failures)

    if "data flow" in arch_content.lower() and not (ROOT / "DATA-FLOW.md").exists():
        fail("`ARCHITECTURE.md` mentions data movement but `DATA-FLOW.md` is missing.", failures)


def main() -> int:
    """Run planning checks."""
    failures: list[str] = []

    check_required_files(failures)

    # Skip remaining checks if core files are missing
    if failures:
        print("Planning check failed.\n")
        print("Fix these items before coding or merging:\n")
        print("\n".join(failures))
        return 1

    check_project_intake(failures)
    check_decision_gates(failures)
    check_tech_spec(failures)
    check_architecture(failures)
    check_task_slice(failures)
    check_context_files(failures)

    if failures:
        print("Planning check failed.\n")
        print("Fix these items before coding or merging:\n")
        print("\n".join(failures))
        return 1

    print("Planning check passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
