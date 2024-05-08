import { NextFunction, Request, Response, response } from "express";
import { BrandService } from "../service/brand-service";
import { logger } from "../app/logging";
import { CreateBrandRequest, UpdateBrandRequest } from "../model/brand-model";
import { BrandRequest } from "../types/type-request";

export class BrandController {

    // get all data
    static async get(req: Request, res: Response, next: NextFunction) {
        logger.info(" ====== get all brand =====")
        try {
            const result = await BrandService.getAllData();
            res.status(200).json({
                data:result
            })
        } catch (error) {
            next(error)
        }
    }

    // create brand
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateBrandRequest = req.body as CreateBrandRequest;
            const response = await BrandService.store(request, req.body);
            res.status(200).json({
                data: process.env.SUCCESS_ADD_DATA
            })
        } catch (error) {
            next(error)
        }
    }

    // update brand
    static async update(req: BrandRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateBrandRequest = req.body as UpdateBrandRequest;
            const response = await BrandService.update(request, req.body);
            res.status(200).json({ 
                data: process.env.SUCCESS_UPDATE_DATA
            });
        } catch (error) {
            next(error);
        }
    }

    // get brand by id
    static async getById(req: BrandRequest, res: Response, next: NextFunction) {
        try {
            const response = await BrandService.getById(req.body);
            res.status(200).json({ data: response });
        } catch (error) {
            next(error);
        }
    }
    
    // get brand by id
    static async delete(req: BrandRequest, res: Response, next: NextFunction) {
        try {
            const response = await BrandService.delete(req.body);
            res.status(200).json({ data: process.env.SUCCESS_DELETE_DATA });
        } catch (error) {
            next(error);
        }
    }
}