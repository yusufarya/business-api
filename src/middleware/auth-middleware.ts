import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../app/database";
import { UserRequest } from "../types/type-request";
import { logger } from "../app/logging";

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction ) => {
    const getToken = req.get("Authorization");
    logger.info('========== USER TOKEN ==========')
    logger.info(getToken)
    if (getToken) {
        const user = await prismaClient.user.findFirst({
            where: {
                token: getToken,
            },
        });

        if (user) {
            req.user = user;
            next();
            return;
        }
    }

    res.status(401).json({
        errors: "Unauthorize",
    }).end();
};
