import { BunRequest } from "bunrest/src/server/request";
import { BunResponse } from "bunrest/src/server/response";

import { plant as plantTB } from "@db/database.ts";

// TODO: Add function to validate and clean user data
interface PlantsRequest extends BunRequest {
  params: {
    plant_id: string;
  };
  query: {
    query: string;
  };
}

export class PlantsController {
  public getAllPlants(req: PlantsRequest, res: BunResponse) {
    const plants = plantTB.getAll();

    res.status(200).json(plants);
  }

  public searchPlant(req: PlantsRequest, res: BunResponse) {
    const query = req.query?.query;
    if (!query) {
      return res.status(400).json({ error: "Bad request" });
    }

    const plant = plantTB.searchPlant(query);

    res.status(200).json(plant);
  }

  public getPlantById(req: PlantsRequest, res: BunResponse) {
    const plant = plantTB.getPlantById(req.params?.plant_id);

    res.status(200).json(plant);
  }
}
