import { BunRequest } from "bunrest/src/server/request";
import { BunResponse } from "bunrest/src/server/response";

import { bookmark as bookmarkTB } from "@db/database.ts";

// TODO: Add function to validate and clean user data
interface UsersBookmarksRequest extends BunRequest {
  params: {
    user_id: string;
    entity_id: string;
    entity_type: string;
  };
  body: {
    entity_id: string;
    entity_type: string;
    bookmark_name: string;
    is_bookmarked: string;
  };
}

export class UsersBookmarksController {
  public addBookmarkForUser(req: UsersBookmarksRequest, res: BunResponse) {
    const user_id = req.params?.user_id;
    let { entity_id, entity_type, bookmark_name } = req.body;

    if (!bookmark_name || !entity_type || !user_id || isNaN(user_id) || !entity_id || isNaN(entity_id) || bookmark_name.length > 25) {
      return res.status(400).json({ error: "Invalid user id or entity id or entity type or name" });
    }

    entity_type = cleanEntityType(entity_type);
    if (!isValidBookmarkEntityType(entity_type)) {
      return res.status(400).json({ error: "Invalid entity type" });
    }

    const bookmark = bookmarkTB.getBookmarkForUser(user_id, entity_id, entity_type);
    if (bookmark) {
      return res.status(409).json({ error: 'Bookmark already exists for this user and entity' });
    }

    const new_bookmark = bookmarkTB.addBookmarkForUser(user_id, bookmark_name, entity_id, entity_type);
    res.status(201).json({ message: "Bookmark added successfully", bookmark: new_bookmark });
  }

  public toggleBookmarkForUser(req: UsersBookmarksRequest, res: BunResponse) {
    const user_id = req.params?.user_id;
    let { entity_type } = req.body as { entity_type: string };
    const { entity_id, is_bookmarked } = req.body;

    if (typeof is_bookmarked !== 'boolean') {
      return res.status(400).json({ error: "Invalid is_bookmarked type" });
    }

    if (!entity_type || !user_id || isNaN(user_id) || !entity_id || isNaN(entity_id)) {
      return res.status(400).json({ error: "Invalid user id or entity id or entity type" });
    }

    entity_type = cleanEntityType(entity_type);
    if (!isValidBookmarkEntityType(entity_type)) {
      return res.status(400).json({ error: "Invalid entity type" });
    }

    let bookmark = bookmarkTB.getBookmarkForUser(user_id, entity_id, entity_type)
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const updated = bookmarkTB.toggleBookmarkForUser(user_id, entity_id, entity_type, is_bookmarked ? 1 : 0);
    if (!updated) {
      return res.status(400).json({ error: 'Failed to update bookmark' });
    }

    bookmark.is_bookmarked = is_bookmarked ? 1 : 0;
    res.status(200).json({ message: 'Bookmark updated successfully', bookmark: bookmark });
  }

  public getAllBookmarksForUserByEntity(req: UsersBookmarksRequest, res: BunResponse) {
    const user_id = req.params?.user_id;
    let entity_type = req.params?.entity_type;

    if (!entity_type || !user_id || isNaN(user_id)) {
      return res.status(400).json({ error: "Invalid user id or entity type" });
    }

    entity_type = cleanEntityType(entity_type);
    if (!isValidBookmarkEntityType(entity_type)) {
      return res.status(400).json({ error: "Invalid entity type" });
    }

    const bookmarks = bookmarkTB.getAllBookmarksByEntityTypeForUser(user_id, entity_type);

    res.status(200).json({ bookmarks: bookmarks });
  }

  public getBookmarkForUser(req: UsersBookmarksRequest, res: BunResponse) {
    const user_id = req.params?.user_id;
    const entity_id = req.params?.entity_id;
    let entity_type = req.params?.entity_type;

    if (!entity_type || !user_id || isNaN(user_id) || !entity_id || isNaN(entity_id)) {
      return res.status(400).json({ error: "Invalid user id or plant id or entity type" });
    }

    entity_type = cleanEntityType(entity_type);
    if (!isValidBookmarkEntityType(entity_type)) {
      return res.status(400).json({ error: "Invalid entity type" });
    }

    const bookmark = bookmarkTB.getBookmarkForUser(user_id, entity_id, entity_type);
    if (!bookmark) {
      return res.status(404).json({ error: "Bookmarked Not Found" });
    }

    res.status(200).json({ bookmark: bookmark });
  }
}

function isValidBookmarkEntityType(entity_type: string): boolean {
  const valid_types = ["plant"];

  return valid_types.includes(entity_type);
}

function cleanEntityType(entity_type: string) {
  let cleaned = entity_type.toLowerCase().trim();

  if (cleaned.endsWith("s")) {
    cleaned = entity_type.slice(0, -1);
  }

  return cleaned;
}
