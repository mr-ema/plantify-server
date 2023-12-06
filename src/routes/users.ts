import server from "bunrest";

import { UsersBookmarksController } from "@controllers/users_bookmarks.ts";

const userHandler = new UsersBookmarksController();
const app = server();
const router = app.router();

router.post("/:user_id/bookmarks", userHandler.addBookmarkForUser);
router.put("/:user_id/bookmarks", userHandler.toggleBookmarkForUser);
router.get("/:user_id/bookmarks/:entity_type", userHandler.getAllBookmarksForUserByEntity);
router.get("/:user_id/bookmarks/:entity_type/:entity_id", userHandler.getBookmarkForUser);

export { router as user_routes };
