import { NextFunction, Request, Response, response } from "express";
import { StockAdjustmentDetailService } from "../../service/transaction/stockadjustmentdetail-service";
import { logger } from "../../app/logging";
import { CreateStockAdjustmentDetailsRequest, UpdateStockAdjustmentDetailsRequest } from "../../model/transaction/stockadjustmentdetail-model";
import { StockAdjustmentDetailRequest } from "../../types/type-request";

export class StockAdjustmentDetailController {

    // get all data
    static async get(req: Request, res: Response, next: NextFunction) {
        logger.info(" ====== get all stock adjustment detail =====")
        try {
            const result = await StockAdjustmentDetailService.getAllData();
            res.status(200).json({
                data:result
            })
        } catch (error) {
            next(error)
        }
    }

    // create stock adjustment detail
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateStockAdjustmentDetailsRequest = req.body as CreateStockAdjustmentDetailsRequest;
            const response = await StockAdjustmentDetailService.store(request, req.body, req.body);
            res.status(200).json({
                data: process.env.SUCCESS_ADD_DATA
            })
        } catch (error) {
            next(error)
        }
    }

    // update stock adjustmentdetail
    static async update(req: StockAdjustmentDetailRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateStockAdjustmentDetailsRequest = req.body as UpdateStockAdjustmentDetailsRequest;
            const response = await StockAdjustmentDetailService.update(request, req.body, req.body);
            res.status(200).json({ 
                data: process.env.SUCCESS_UPDATE_DATA
            });
        } catch (error) {
            next(error);
        }
    }

    // // get stock adjustment detail by id
    // static async getById(req: StockAdjustmentDetailRequest, res: Response, next: NextFunction) {
    //     try {
    //         const response = await StockAdjustmentDetailService.getByNumber(req.body);
    //         res.status(200).json({ data: response });
    //     } catch (error) {
    //         next(error);
    //     }
    // }
    
    // get stock adjustment detail by id
    static async delete(req: StockAdjustmentDetailRequest, res: Response, next: NextFunction) {
        try {
            const response = await StockAdjustmentDetailService.delete(req.body, req.body);
            res.status(200).json({ data: process.env.SUCCESS_DELETE_DATA });
        } catch (error) {
            next(error);
        }
    }
}