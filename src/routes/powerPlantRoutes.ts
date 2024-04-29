import { Router } from "express";
import { PowerPlantController } from "../controllers/powerPlant";

import { ReadFiles } from "../helpers/readExcelFile";

const router = Router();

// Creating object
const powerPlantController = new PowerPlantController();
const readFiles = new ReadFiles();

// // Route for the top N power plants by net generation
router.get("/plants", powerPlantController.getTopNPlants);

// Reading excel file
router.get("/read-excel", readFiles.readExcelFile);

export default router;
