const db = require("./index");

db.exec(`
  CREATE TABLE IF NOT EXISTS doujins (
    id          INTEGER PRIMARY KEY,
    name        TEXT    NOT NULL,
    filepath     TEXT    NOT NULL UNIQUE,
    tags        TEXT    NOT NULL DEFAULT '',
    date_added  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    date_created TEXT   NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    pagecount   INTEGER NOT NULL,
    size        INTEGER NOT NULL
  )
`);

console.log("Migrations complete");
