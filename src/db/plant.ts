import { Database } from "bun:sqlite";
import { Plant } from "@models/plant";

export class PlantTB {
  private _db: Database;

  constructor(database: Database) {
    this._db = database;
  }

  public getAll(): Plant[] | null[] {
    const stmt = this._db.query("SELECT * FROM plant");

    const result = stmt.all() as Plant[] | null[];
    stmt.finalize();

    return result;
  }

  public getPlantById(id: string): Plant | null {
    const stmt = this._db.prepare("SELECT * FROM plant WHERE id = ?;");

    const result = stmt.get(id) as Plant | null;
    stmt.finalize();

    return result;
  }

  public searchPlant(pattern: string): Plant[] | null[] {
    const stmt = this._db.query(`SELECT * FROM plant WHERE name LIKE '%${pattern}%';`);

    const result = stmt.all() as Plant[] | null[];
    stmt.finalize();

    return result;
  }

  public getAllBookmarkedPlantsForUser(user_id: string): Plant[] | null {
    const stmt = this._db.prepare(`
      SELECT plant.* FROM bookmark
      INNER JOIN plant ON plant.id = bookmark.entity_id
      WHERE bookmark.user_id = ? AND bookmark.is_bookmarked = 1;
    `);

    const result = stmt.all(user_id) as Plant[] | null;
    stmt.finalize();

    return result;
  }

  public getBookmarkedPlantForUser(user_id: string, plant_id: string): Plant | null {
    const stmt = this._db.prepare(`
      SELECT plant.*
      FROM bookmark
      INNER JOIN plant ON plant.id = bookmark.entity_id
      WHERE bookmark.user_id = ? AND bookmark.entity_id = ?;
    `);

    const result = stmt.get(user_id, plant_id) as Plant | null;
    stmt.finalize();

    return result;
  }
}
