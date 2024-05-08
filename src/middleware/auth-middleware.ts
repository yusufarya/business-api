import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../app/database";
import { UserRequest } from "../types/type-request";

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction ) => {
    const getToken = req.get("Authorization");

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
        errors: "Unautorize",
    }).end();
};
