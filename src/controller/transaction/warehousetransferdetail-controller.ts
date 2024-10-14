import { NextFunction, Request, Response, response } from "express";
import { WarehouseTransferDetailService } from "../../service/transaction/warehousetransferdetail-service";
import { logger } from "../../app/logging";
import { CreateWarehouseTransferDetailsRequest, UpdateWarehouseTransferDetailsRequest } from "../../model/transaction/warehousetransferdetail-model";
import { WarehouseTransferDetailRequest } from "../../types/type-request";

export class WarehouseTransferDetailController {

    // get all data
    static async get(req: Request, res: Response, next: NextFunction) {
        logger.info(" ====== get all stock adjustment detail =====")
        try {
            const result = await WarehouseTransferDetailService.getAllData();
            res.status(200).json({
                data:result
            })
        } catch (error) {
            next(error)
        }
    }

    // create stock adjustment detail
    static async create(req: WarehouseTransferDetailRequest, res: Response, next: NextFunction) {
        try {

            const productId: string | undefined = req.body.product_id as string;
            const branchId: string | undefined = req.body.branch_id as string;
            const qty: string | undefined = req.body.qty as string;
            
            // Convert the string to a number
            const qty_new: number | undefined = qty ? parseInt(qty) : undefined;
            const product_id: number | undefined = productId ? parseInt(productId) : undefined;
            const branch_id: number | undefined = branchId ? parseInt(branchId) : undefined;

            const requestBody = {
                ...req.body,
                qty: qty_new,
                product_id: product_id,
                branch_id: branch_id,
            }

            const request: CreateWarehouseTransferDetailsRequest = requestBody as CreateWarehouseTransferDetailsRequest;
            const response = await WarehouseTransferDetailService.store(request, req.body);
            res.status(200).json({
                message: process.env.SUCCESS_ADD_DATA,
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    // update stock adjustmentdetail
    static async update(req: WarehouseTransferDetailRequest, res: Response, next: NextFunction) {
        try {
            const qty: string | undefined = req.body.qty as string;
            
            // Convert the ID to a number
            const qty_new: number | undefined = qty ? parseInt(qty) : undefined;

            const requestBody = {
                ...req.body,
                qty: qty_new,
            }

            const request: UpdateWarehouseTransferDetailsRequest = requestBody as UpdateWarehouseTransferDetailsRequest;
            const response = await WarehouseTransferDetailService.update(request, req.body);
            res.status(200).json({ 
                message: process.env.SUCCESS_UPDATE_DATA,
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    // get stock adjustment detail by id
    static async getById(req: WarehouseTransferDetailRequest, res: Response, next: NextFunction) {
        try {
            // Extract the ID from query parameters
            const id: string | undefined = req.query.id as string;
            
            // Convert the ID to a number
            const numericId: number | undefined = id ? parseInt(id) : undefined;
            if(numericId != undefined) {
                const response = await WarehouseTransferDetailService.getById({id: numericId});
                res.status(200).json({ data: response });
            } else {
                throw new Error('ID not provided');
            }
        } catch (error) {
            next(error);
        }
    }
    
    // get stock adjustment detail by id
    static async delete(req: WarehouseTransferDetailRequest, res: Response, next: NextFunction) {
        try {
            const response = await WarehouseTransferDetailService.delete(req.body);
            res.status(200).json({ data: process.env.SUCCESS_DELETE_DATA });
        } catch (error) {
            next(error);
        }
    }
}