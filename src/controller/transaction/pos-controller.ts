import { NextFunction, Request, Response, response } from "express";

import { logger } from "../../app/logging";

import { PosCartRequest } from "../../types/type-request";
import { ResponseError } from "../../error/response-error";
import { PosService } from "../../service/transaction/pos-service";
import { POSCartRequest } from "../../model/transaction/pos-model";

export class PosController {

    // get all data cart //
    static async get(req: Request, res: Response, next: NextFunction) {
        logger.info(" ====== get all stock adjustment =====")
        try {
            const result = await PosService.getAllData(req.body);
            res.status(200).json({
                data:result
            })
        } catch (error) {
            next(error)
        }
    }

    // update cart
    static async update(req: PosCartRequest, res: Response, next: NextFunction) {
        try {
            const id: string | undefined = req.body?.id as string;
            const product_id: string | undefined = req.body.product_id as string;
            const branch_id: string | undefined = req.body.branch_id as string;
            const warehouse_id: string | undefined = req.body.warehouse_id as string;
            const qty: string | undefined = req.body.qty as string;
            // Convert the ID to a number
            const productId: number | undefined = product_id ? parseInt(product_id) : undefined;
            const branchtId: number | undefined = product_id ? parseInt(branch_id) : undefined;
            const warehouseId: number | undefined = product_id ? parseInt(warehouse_id) : undefined;
            const quantity: number | undefined = product_id ? parseInt(qty) : undefined;

            let requestParams = null
            if(id) {
                const idCart: number | undefined = id ? parseInt(id) : undefined;
                if(productId === undefined) {
                    throw new ResponseError(404, 'Id Product Not Provide')
                } else if(branchtId === undefined) {
                    throw new ResponseError(404, 'Id Branch Not Provide')
                } else if(warehouseId === undefined) {
                    throw new ResponseError(404, 'Id Warehouse Not Provide')
                } else {
                    requestParams = {
                        id: idCart,
                        product_id: productId,
                        branch_id: branchtId,
                        warehouse_id: warehouseId,
                        qty : quantity,
                        unit: req.body.unit,
                        username: req.body.username,
                    }
                }
            } else {
                if(productId === undefined) {
                    throw new ResponseError(404, 'Id Product Not Provide')
                } else if(branchtId === undefined) {
                    throw new ResponseError(404, 'Id Branch Not Provide')
                } else if(warehouseId === undefined) {
                    throw new ResponseError(404, 'Id Warehouse Not Provide')
                } else {
                    requestParams = {
                        product_id: productId,
                        branch_id: branchtId,
                        warehouse_id: warehouseId,
                        qty : quantity,
                        unit: req.body.unit,
                        username: req.body.username,
                    }
                }
            }
            
            const response = await PosService.update(requestParams);
            res.status(200).json({
                message: process.env.SUCCESS_UPDATE_DATA,
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    // get cart by id
    static async getById(req: PosCartRequest, res: Response, next: NextFunction) {
        try {
            // Extract the ID from query parameters
            const id: string | undefined = req.query.id as string;
            
            // Convert the ID to a number
            const numericId: number | undefined = id ? parseInt(id) : undefined;
            if(numericId !== undefined) {
                const response = await PosService.getById({id: numericId});
                res.status(200).json({ data: response });
            } else {
                throw new Error('ID not provided');
            }
        } catch (error) {
            next(error);
        }
    }
    
    // delete cart product
    static async delete(req: PosCartRequest, res: Response, next: NextFunction) {
        try {
            const response = await PosService.delete(req.body);
            res.status(200).json({ data: process.env.SUCCESS_DELETE_DATA });
        } catch (error) {
            next(error);
        }
    }
}