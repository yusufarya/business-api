import { NextFunction, Request, Response, response } from "express";
import { UnitService } from "../service/unit-service";
import { logger } from "../app/logging";
import { CreateUnitRequest, UpdateUnitRequest } from "../model/unit-model";
import { UnitRequest } from "../types/type-request";

export class UnitController {

    // get all data
    static async get(req: Request, res: Response, next: NextFunction) {
        logger.info(" ====== get all unit =====")
        try {
            const result = await UnitService.getAllData();
            res.status(200).json({
                data:result
            })
        } catch (error) {
            next(error)
        }
    }

    // create unit
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateUnitRequest = req.body as CreateUnitRequest;
            const response = await UnitService.store(request, req.body);
            res.status(200).json({
                data: process.env.SUCCESS_ADD_DATA
            })
        } catch (error) {
            next(error)
        }
    }

    // update unit
    static async update(req: UnitRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateUnitRequest = req.body as UpdateUnitRequest;
            const response = await UnitService.update(request, req.body);
            res.status(200).json({ 
                data: process.env.SUCCESS_UPDATE_DATA
            });
        } catch (error) {
            next(error);
        }
    }

    // get unit by id
    static async getById(req: UnitRequest, res: Response, next: NextFunction) {
        try {
            const response = await UnitService.getById(req.body);
            res.status(200).json({ data: response });
        } catch (error) {
            next(error);
        }
    }
    
    // get unit by id
    static async delete(req: UnitRequest, res: Response, next: NextFunction) {
        try {
            const response = await UnitService.delete(req.body);
            res.status(200).json({ data: process.env.SUCCESS_DELETE_DATA });
        } catch (error) {
            next(error);
        }
    }
}