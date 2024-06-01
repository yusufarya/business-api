import express from "express";
import cors from "cors"; // Import cors package
import { publicRouter } from "../routes/public-api";
import { apiRouter } from "../routes/api";
import { logger } from "./logging";
import { errorMiddleware } from "../middleware/error-middleware";
import path from 'path';
// Initialize the scheduler
import '../scheduler/removeTokenScheduler';
export const web = express();

// Use the cors middleware to enable CORS
web.use(cors());

web.use(express.json());

// Static file serving
web.use('/src/public', express.static(path.join(__dirname, '../../src/public')));

// Use the routers
web.use(publicRouter);
web.use(apiRouter);

// Error handling middleware
web.use(errorMiddleware);
