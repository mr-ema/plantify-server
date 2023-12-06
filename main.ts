import server from "bunrest";

import * as db from "@db/database.ts";
import { user_routes } from "@routes/users.ts";
import { plant_routes } from "@routes/plants.ts";

// TODO: Add security and data integrity validations
// TODO: Correct messages and code status

const app = server();
db.init();

const CORS_HEADERS = new Headers({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, PUT",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
});

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    res.headers(CORS_HEADERS);
    res.status(200).send("OPTIONS /");
  }

  next?.();
});

app.use('/api/v1/users', user_routes);
app.use('/api/v1/plants', plant_routes);

app.listen(Bun.env?.PORT || 8000, () =>
  console.log(`Example server listening on port ${Bun.env?.PORT || 8000}!`),
);
