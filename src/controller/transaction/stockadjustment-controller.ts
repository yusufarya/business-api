import { NextFunction, Request, Response, response } from "express";
import { StockAdjustmentService } from "../../service/transaction/stockadjustment-service";
import { logger } from "../../app/logging";
import { CreateStockAdjustmentRequest, UpdateStockAdjustmentRequest } from "../../model/transaction/stockadjustment-model";
import { StockAdjustmentRequest } from "../../types/type-request";
import { ResponseError } from "../../error/response-error";

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
            const branch_id: string | undefined = req.body.branch_id as string;
            
            // Convert the ID to a number
            const branchId: number | undefined = branch_id ? parseInt(branch_id) : undefined;
            logger.info('=============== CREATE ================')
            logger.info(branch_id)
            const requestTRSA = {
                ...req.body,
                branch_id: branchId
            }
            if(branch_id != undefined) {
                const request: CreateStockAdjustmentRequest = requestTRSA as CreateStockAdjustmentRequest;
                const response = await StockAdjustmentService.store(request, req.body);
                
                res.status(200).json({
                    message: process.env.SUCCESS_ADD_DATA,
                    data: response
                })
            } else {
                throw new ResponseError(400, 'Branch id is invalid')
            }
        } catch (error) {
            next(error)
        }
    }

    // update stock adjustment
    static async update(req: StockAdjustmentRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateStockAdjustmentRequest = req.body as UpdateStockAdjustmentRequest;
            const branch_id: number | undefined = request.branch_id as number;
            const requestTRSA = {
                ...request,
                branch_id: branch_id
            }
            const response = await StockAdjustmentService.update(requestTRSA, req.body);
            res.status(200).json({
                message: process.env.SUCCESS_UPDATE_DATA,
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    // get stock adjustment by id
    static async getByNumber(req: StockAdjustmentRequest, res: Response, next: NextFunction) {
        try {
            // Extract the ID from query parameters
            const number: string | undefined = req.query.number as string;
            
            const response = await StockAdjustmentService.getByNumber({number: number});
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