import server from "bunrest";

import { PlantsController } from "@controllers/plants";

const plantHandler = new PlantsController();
const app = server();
const router = app.router();

router.get("/", plantHandler.getAllPlants);
router.get("/search", plantHandler.searchPlant);
router.get("/:plant_id", plantHandler.getPlantById);

export { router as plant_routes };
