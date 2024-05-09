import { NextFunction, Request, Response, response } from "express";
import { WarehouseService } from "../service/warehouse-service";
import { logger } from "../app/logging";
import { CreateWarehouseRequest, UpdateWarehouseRequest } from "../model/warehouse-model";
import { WarehouseRequest } from "../types/type-request";

export class WarehouseController {

    // get all data
    static async get(req: Request, res: Response, next: NextFunction) {
        logger.info(" ====== get all warehouse =====")
        try {
            const result = await WarehouseService.getAllData();
            res.status(200).json({
                data:result
            })
        } catch (error) {
            next(error)
        }
    }

    // create warehouse
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateWarehouseRequest = req.body as CreateWarehouseRequest;
            const response = await WarehouseService.store(request, req.body);
            res.status(200).json({
                data: process.env.SUCCESS_ADD_DATA
            })
        } catch (error) {
            next(error)
        }
    }

    // update warehouse
    static async update(req: WarehouseRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateWarehouseRequest = req.body as UpdateWarehouseRequest;
            const response = await WarehouseService.update(request, req.body);
            res.status(200).json({ 
                data: process.env.SUCCESS_UPDATE_DATA
            });
        } catch (error) {
            next(error);
        }
    }

    // get warehouse by id
    static async getById(req: WarehouseRequest, res: Response, next: NextFunction) {
        try {
            const response = await WarehouseService.getById(req.body);
            res.status(200).json({ data: response });
        } catch (error) {
            next(error);
        }
    }
    
    // get warehouse by id
    static async delete(req: WarehouseRequest, res: Response, next: NextFunction) {
        try {
            const response = await WarehouseService.delete(req.body);
            res.status(200).json({ data: process.env.SUCCESS_DELETE_DATA });
        } catch (error) {
            next(error);
        }
    }
}