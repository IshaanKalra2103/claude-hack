from __future__ import annotations

import sqlite3
from pathlib import Path

from server.config import settings


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(settings.database_path)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    db_path = Path(settings.database_path)
    db_path.parent.mkdir(parents=True, exist_ok=True)
    schema = (Path(__file__).resolve().parent / "schema.sql").read_text()
    with get_connection() as conn:
        conn.executescript(schema)
        conn.commit()
