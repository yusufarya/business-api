import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";
import { logger } from "../app/logging";

export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction ) => {
  logger.info("=========================== Middleware ===========================");
  if (error instanceof ZodError) {
    logger.info(" =========================== Zod Error 400 ===========================");
    res.status(400).json({
      // errors: `Validation Error : ${JSON.stringify(error)}`,
      error
    });
  } else if (error instanceof ResponseError) {
    logger.info("=========================== Response Error " +error.status +"===========================");
    res.status(error.status).json({
      errors: error.message,
    });
  } else {
    logger.info("=========================== Error 500 ===========================");
    res.status(500).json({
      errors: error.message,
    });
  }
  logger.error(req.body);
};
