import { NextFunction, Request, Response, response } from "express";
import { StockAdjustmentService } from "../../service/transaction/stockadjustment-service";
import { logger } from "../../app/logging";
import { CreateStockAdjustmentRequest, UpdateStockAdjustmentRequest } from "../../model/transaction/stockadjustment-model";
import { StockAdjustmentRequest } from "../../types/type-request";

export class StockAdjustmentController {

    // get all data
    static async get(req: Request, res: Response, next: NextFunction) {
        logger.info(" ====== get all stock adjustment =====")
        try {
            const result = await StockAdjustmentService.getAllData();
            res.status(200).json({
                data:result
            })
        } catch (error) {
            next(error)
        }
    }

    // create stock adjustment
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateStockAdjustmentRequest = req.body as CreateStockAdjustmentRequest;
            const response = await StockAdjustmentService.store(request, req.body);
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    // update stock adjustment
    static async update(req: StockAdjustmentRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateStockAdjustmentRequest = req.body as UpdateStockAdjustmentRequest;
            const response = await StockAdjustmentService.update(request, req.body);
            res.status(200).json({ 
                data: process.env.SUCCESS_UPDATE_DATA
            });
        } catch (error) {
            next(error);
        }
    }

    // get stock adjustment by id
    static async getByNumber(req: StockAdjustmentRequest, res: Response, next: NextFunction) {
        try {
            const response = await StockAdjustmentService.getByNumber(req.body);
            res.status(200).json({ data: response });
        } catch (error) {
            next(error);
        }
    }
    
    // get stock adjustment by id
    static async delete(req: StockAdjustmentRequest, res: Response, next: NextFunction) {
        try {
            const response = await StockAdjustmentService.delete(req.body);
            res.status(200).json({ data: process.env.SUCCESS_DELETE_DATA });
        } catch (error) {
            next(error);
        }
    }
}