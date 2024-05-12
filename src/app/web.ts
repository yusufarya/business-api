import express from "express";
import cors from "cors"; // Import cors package
import { publicRouter } from "../routes/public-api";
import { apiRouter } from "../routes/api";
import { logger } from "./logging";
import { errorMiddleware } from "../middleware/error-middleware";

export const web = express();

// Use the cors middleware to enable CORS
web.use(cors());

web.use(express.json());
web.use(publicRouter);
web.use(apiRouter);
web.use(errorMiddleware);
