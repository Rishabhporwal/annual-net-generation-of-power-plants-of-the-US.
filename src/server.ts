import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import powerPlantRoutes from "./routes/powerPlantRoutes";
import { cronJob } from "./helpers/cron";
import dotenv from "dotenv";

const app: Application = express();

dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

cronJob();
app.use("/power-plant", powerPlantRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
