import { Request, Response } from "express";
import { IPlantData } from "../interfaces/IPlantData";

import { redisClientInit } from "../helpers/redis";
const redisKey = process.env.REDIS_KEY_NAME || "plantData";

export class PowerPlantController {
  // Function to get top N plants with state filter
  public async getTopNPlants(
    req: Request,
    res: Response
  ): Promise<IPlantData[] | undefined> {
    try {
      const redisClient = await redisClientInit();
      const totalRecords: number = Number(req.query.records) || 10;
      const state: string | null = (req.query.state as string) || null;

      if (isNaN(totalRecords) || totalRecords <= 0) {
        res.status(400).json({ error: "Invalid number specified." });
        return;
      }

      // Getting data from redis
      let cachedPlantData: string | null = await redisClient.get(redisKey);

      if (!cachedPlantData) {
        throw new Error("Plant data not found");
      }

      let parsedPlantData = JSON.parse(cachedPlantData);

      // Filtering State Data
      if (state) {
        parsedPlantData = parsedPlantData.filter(
          (item: Record<string, string | number>) => item.state === state
        );
      }

      // Returning response by slicing records by given limit of record
      res.status(200).json({
        data: parsedPlantData?.slice(0, totalRecords),
        totalCount: parsedPlantData.length,
      });
    } catch (error: any) {
      res.status(500).json({
        error:
          error?.message || "Failed to retrieve top N plants with filters.",
      });
    }
  }
}
