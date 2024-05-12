import { NextFunction, Request, Response, response } from "express";
import { WarehouseService } from "../../service/master/warehouse-service";
import { logger } from "../../app/logging";
import { CreateWarehouseRequest, UpdateWarehouseRequest } from "../../model/master/warehouse-model";
import { WarehouseRequest } from "../../types/type-request";

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
            console.log("================== CREATE WH ==================")
            
            const id: string | undefined = req.body.branch_id as string;
                
            // Convert the ID to a number
            const numericId: number | undefined = id ? parseInt(id) : undefined;
            if(numericId !== undefined) {
                const fixRequest : CreateWarehouseRequest = {
                    ...request,
                    branch_id: numericId
                }
                console.log(fixRequest)
                const response = await WarehouseService.store(fixRequest, req.body);
                res.status(200).json({
                    data: process.env.SUCCESS_ADD_DATA
                })
            } else {
                throw new Error('ID not provided');
            }
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
            // Extract the ID from query parameters
            const id: string | undefined = req.query.id as string;
            
            // Convert the ID to a number
            const numericId: number | undefined = id ? parseInt(id) : undefined;

            if(numericId != undefined) {
                const response = await WarehouseService.getById({id: numericId});
                res.status(200).json({ data: response });
            } else {
                throw new Error('ID not provided');
            }
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