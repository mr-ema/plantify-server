import { Database } from "bun:sqlite";
import { BookmarkTB } from "./bookmark";
import { PlantTB } from "./plant";

// TODO: Add security validations
// TODO: Implement migration system
// TODO: Add tests

const db = new Database("plantify.sqlite", { create: true });
export const bookmark = new BookmarkTB(db);
export const plant = new PlantTB(db);

export function init() {
  db.run(`
    CREATE TABLE IF NOT EXISTS plant (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      img_url       VARCHAR NOT NULL,
      name          VARCHAR NOT NULL,
      description   TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS user (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      email         VARCHAR NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS bookmark (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          VARCHAR NOT NULL,
      user_id       INTEGER NOT NULL,
      entity_id     INTEGER NOT NULL,
      entity_type   TEXT NOT NULL,
      is_bookmarked INTEGER DEFAULT 1 NOT NULL,

      FOREIGN KEY(user_id) REFERENCES user(id)
    );
  `);


  // Move it to a separated file for testing purposes in the future
  if (Bun.env.ENVIROMENT == "develoment" && allTablesEmpty()) {
    const { MOCK_PLANTS } = require("@mock-data/plant.ts");
    const { MOCK_USERS } = require("@mock-data/users.ts");

    for (const plant of MOCK_PLANTS) {
      db.run(
        'INSERT INTO plant (img_url, name, description) VALUES (?, ?, ?)',
        [plant.img_url, plant.name, plant.description]
      );
    }

    for (const user of MOCK_USERS) {
      db.run(
        'INSERT INTO user (email) VALUES (?)',
        [user.email]
      );
    }
  }
}

function allTablesEmpty(): boolean {
  const stmt = db.query(`
    SELECT
      (SELECT COUNT(*) FROM user) +
      (SELECT COUNT(*) FROM plant) as total
  `);
  const result = stmt.get() as { total: number };
  stmt.finalize();

  return (result.total == 0 ? true : false);
}

