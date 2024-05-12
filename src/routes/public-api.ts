import env from "dotenv";
import express from "express";
import { UserControler } from "../controller/master/user-controller";
import { logger } from "../app/logging";
env.config();
logger.info("=========================== PUBLIC ROUTER ===========================");
export const publicRouter = express.Router();
publicRouter.post(process.env.REGISTER_USER_PATH!, UserControler.register);
publicRouter.post(process.env.LOGIN_USER_PATH!, UserControler.login);

