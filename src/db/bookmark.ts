import { Database } from "bun:sqlite";
import { Bookmark } from "@models/bookmark";

export class BookmarkTB {
  private _db: Database;

  constructor(database: Database) {
    this._db = database;
  }

  public addBookmarkForUser(user_id: string, name: string, entity_id: string, entity_type: string): Bookmark | null {
    const stmt = this._db.prepare(`
      INSERT INTO bookmark (user_id, name, entity_id, entity_type)
      VALUES (?, ?, ?, ?);
    `);

    stmt.run(user_id, name, entity_id, entity_type);
    stmt.finalize();

    const result = this.getBookmarkForUser(user_id, entity_id, entity_type);
    return result;
  }

  public removeBookmarkForUser(user_id: string, entity_id: number | string, entity_type: string): void {
    this._db.run('DELETE FROM bookmark WHERE user_id = ? AND entity_id = ? AND entity_type = ?;', [user_id, entity_id, entity_type]);
  }

  public toggleBookmarkForUser(user_id: string, entity_id: string, entity_type: string, is_bookmarked: number): boolean {
    const stmt = this._db.prepare(`
      UPDATE bookmark
      SET is_bookmarked = ?
      WHERE
        user_id = ?
        AND entity_id = ?
        AND entity_type = ?;
    `);

    stmt.run(is_bookmarked, user_id, entity_id, entity_type);
    stmt.finalize();

    const bookmark = this.getBookmarkForUser(user_id, entity_id, entity_type);
    if (bookmark && bookmark?.is_bookmarked == is_bookmarked) {
      return true;
    }

    return false;
  }

  public getBookmarkForUser(user_id: string, entity_id: string, entity_type: string): Bookmark | null {
    const stmt = this._db.prepare(`
      SELECT *
      FROM bookmark
      WHERE
        user_id = ?
        AND entity_id = ?
        AND entity_type = ?;
    `);

    const result = stmt.get(user_id, entity_id, entity_type) as Bookmark | null;
    stmt.finalize();

    return result;
  }

  public getAllBookmarksByEntityTypeForUser(user_id: string, entity_type: string): Bookmark[] {
    const stmt = this._db.prepare(`
      SELECT *
      FROM bookmark
      WHERE
        user_id = ?
        AND entity_type = ?
        AND is_bookmarked = 1;
    `);

    const result = stmt.all(user_id, entity_type) as Bookmark[];
    stmt.finalize();

    return result;
  }
}
