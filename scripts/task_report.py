"""
task_report.py
--------------
Generates a daily summary report from the SQLite task database.

Usage:
    python task_report.py                  # print to console
    python task_report.py --export         # also save report.txt
    python task_report.py --db path/to/db  # custom db path
"""

import sqlite3
import argparse
from datetime import date, datetime
from pathlib import Path
from collections import Counter


# ─── Config ────────────────────────────────────────────────────────────────
DEFAULT_DB = Path(__file__).parent.parent / "backend" / "taskmanager.db"


# ─── DB Helpers ────────────────────────────────────────────────────────────

def connect(db_path: str) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


def fetch_all_tasks(conn: sqlite3.Connection) -> list[dict]:
    cursor = conn.execute("SELECT * FROM tasks ORDER BY deadline ASC")
    return [dict(row) for row in cursor.fetchall()]


# ─── Analytics ─────────────────────────────────────────────────────────────

def compute_stats(tasks: list[dict]) -> dict:
    today = date.today().isoformat()
    stats = {
        "total":       len(tasks),
        "pending":     sum(1 for t in tasks if t["status"] == "PENDING"),
        "in_progress": sum(1 for t in tasks if t["status"] == "IN_PROGRESS"),
        "completed":   sum(1 for t in tasks if t["status"] == "COMPLETED"),
        "overdue":     sum(1 for t in tasks if t["status"] == "OVERDUE"),
        "due_today":   sum(1 for t in tasks if t["deadline"] == today),
        "high_priority": sum(1 for t in tasks if t["priority"] == "HIGH" and t["status"] != "COMPLETED"),
    }
    if stats["total"] > 0:
        stats["completion_rate"] = round(stats["completed"] / stats["total"] * 100, 1)
    else:
        stats["completion_rate"] = 0.0
    return stats


def group_by_subject(tasks: list[dict]) -> dict:
    result = {}
    for t in tasks:
        subj = t["subject"]
        result.setdefault(subj, []).append(t)
    return dict(sorted(result.items()))


def get_upcoming(tasks: list[dict], days: int = 7) -> list[dict]:
    today = date.today()
    upcoming = []
    for t in tasks:
        if t["status"] in ("COMPLETED", "OVERDUE"):
            continue
        try:
            deadline = date.fromisoformat(t["deadline"])
            delta = (deadline - today).days
            if 0 <= delta <= days:
                t = dict(t, days_left=delta)
                upcoming.append(t)
        except ValueError:
            pass
    return sorted(upcoming, key=lambda x: x["days_left"])


# ─── Report Renderer ────────────────────────────────────────────────────────

def render_report(tasks: list[dict]) -> str:
    stats   = compute_stats(tasks)
    by_subj = group_by_subject(tasks)
    upcoming = get_upcoming(tasks)

    sep  = "=" * 60
    sep2 = "-" * 60
    lines = []

    lines += [
        sep,
        "  📚  STUDENT TASK MANAGER — DAILY REPORT",
        f"  Generated: {datetime.now().strftime('%A, %d %B %Y  %H:%M')}",
        sep,
        "",
    ]

    # ── Overview ──
    lines += [
        "OVERVIEW",
        sep2,
        f"  Total Tasks    : {stats['total']}",
        f"  Pending        : {stats['pending']}",
        f"  In Progress    : {stats['in_progress']}",
        f"  Completed      : {stats['completed']}  ({stats['completion_rate']}%)",
        f"  Overdue        : {stats['overdue']}",
        f"  Due Today      : {stats['due_today']}",
        f"  High Priority  : {stats['high_priority']} (not completed)",
        "",
    ]

    # ── Due This Week ──
    lines += ["DUE IN THE NEXT 7 DAYS", sep2]
    if upcoming:
        for t in upcoming:
            dl = "TODAY" if t["days_left"] == 0 else f"in {t['days_left']} day(s)"
            lines.append(
                f"  [{t['priority']:6}]  {t['title']:<35} — {t['subject']}  ({dl})"
            )
    else:
        lines.append("  No upcoming deadlines in the next 7 days.")
    lines.append("")

    # ── Overdue ──
    overdue = [t for t in tasks if t["status"] == "OVERDUE"]
    lines += ["OVERDUE TASKS", sep2]
    if overdue:
        for t in overdue:
            lines.append(f"  ⚠️  [{t['priority']:6}]  {t['title']:<35}  Deadline: {t['deadline']}")
    else:
        lines.append("  🎉  No overdue tasks!")
    lines.append("")

    # ── By Subject ──
    lines += ["TASKS BY SUBJECT", sep2]
    for subj, stasks in by_subj.items():
        done  = sum(1 for t in stasks if t["status"] == "COMPLETED")
        total = len(stasks)
        bar_len = 20
        filled = int(done / total * bar_len) if total else 0
        bar = "█" * filled + "░" * (bar_len - filled)
        lines.append(f"  {subj:<25} [{bar}]  {done}/{total}")
    lines.append("")

    lines += [sep, "  End of Report", sep]
    return "\n".join(lines)


# ─── Main ───────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Generate task summary report")
    parser.add_argument("--db",     default=str(DEFAULT_DB), help="Path to SQLite database")
    parser.add_argument("--export", action="store_true",     help="Export report to report.txt")
    args = parser.parse_args()

    db_path = Path(args.db)
    if not db_path.exists():
        print(f"[ERROR] Database not found at: {db_path}")
        print("Make sure the Spring Boot backend has been started at least once to create the DB.")
        return

    conn   = connect(str(db_path))
    tasks  = fetch_all_tasks(conn)
    conn.close()

    report = render_report(tasks)
    print(report)

    if args.export:
        out = Path(__file__).parent / "report.txt"
        out.write_text(report, encoding="utf-8")
        print(f"\n[INFO] Report saved to: {out}")


if __name__ == "__main__":
    main()
