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
    static async create(req: StockAdjustmentDetailRequest, res: Response, next: NextFunction) {
        try {
            
            const productId: string | undefined = req.body.product_id as string;
            const warehouseId: string | undefined = req.body.warehouse_id as string;
            const branchId: string | undefined = req.body.branch_id as string;
            const qty: string | undefined = req.body.qty as string;
            
            // Convert the ID to a number
            const qty_new: number | undefined = qty ? parseInt(qty) : undefined;
            const product_id: number | undefined = qty ? parseInt(productId) : undefined;
            const warehouse_id: number | undefined = qty ? parseInt(warehouseId) : undefined;
            const branch_id: number | undefined = qty ? parseInt(branchId) : undefined;

            const requestBody = {
                ...req.body,
                qty: qty_new,
                product_id: product_id,
                warehouse_id: warehouse_id,
                branch_id: branch_id,
            }
            const request: CreateStockAdjustmentDetailsRequest = requestBody as CreateStockAdjustmentDetailsRequest;
            const response = await StockAdjustmentDetailService.store(request, req.body, req.body);
            res.status(200).json({
                message: process.env.SUCCESS_ADD_DATA,
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    // update stock adjustmentdetail
    static async update(req: StockAdjustmentDetailRequest, res: Response, next: NextFunction) {
        try {
            const qty: string | undefined = req.body.qty as string;
            
            // Convert the ID to a number
            const qty_new: number | undefined = qty ? parseInt(qty) : undefined;

            const requestBody = {
                ...req.body,
                qty: qty_new,
            }

            const request: UpdateStockAdjustmentDetailsRequest = requestBody as UpdateStockAdjustmentDetailsRequest;
            const response = await StockAdjustmentDetailService.update(request, req.body, req.body);
            res.status(200).json({ 
                message: process.env.SUCCESS_UPDATE_DATA,
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    // get stock adjustment detail by id
    static async getById(req: StockAdjustmentDetailRequest, res: Response, next: NextFunction) {
        try {
            // Extract the ID from query parameters
            const id: string | undefined = req.query.id as string;
            
            // Convert the ID to a number
            const numericId: number | undefined = id ? parseInt(id) : undefined;
            if(numericId != undefined) {
                const response = await StockAdjustmentDetailService.getById({id: numericId});
                res.status(200).json({ data: response });
            } else {
                throw new Error('ID not provided');
            }
        } catch (error) {
            next(error);
        }
    }
    
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