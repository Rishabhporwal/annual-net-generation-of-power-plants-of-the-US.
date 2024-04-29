import cron from "node-cron";
import { ReadFiles } from "./readExcelFile";
import { redisClientInit } from "./redis";

export async function cronJob() {
  const redisClient = await redisClientInit();
  const readFiles = new ReadFiles();

  // Cron job to fetch data from file every minute and store in Redis
  cron.schedule("* * * * *", async () => {
    try {
      const redisKey = process.env.REDIS_KEY_NAME || "plantData";
      const excelData = readFiles.readExcelFile();
      redisClient.set(redisKey, JSON.stringify(excelData));
      console.log("Excel data cached successfully");
    } catch (error) {
      console.log("Error caching Excel data:", error);
    }
  });
}
