import { NextFunction, Request, Response } from "express";
import { ConversionUnitService } from "../../service/master/conversion-unit-service";
import { logger } from "../../app/logging";
import { CreateConversionUnitRequest, UpdateConversionUnitRequest } from "../../model/master/conversion-unit-model";
import { ConversionUnitRequest } from "../../types/type-request";

export class ConversionUnitController {

    // get all data
    static async get(req: Request, res: Response, next: NextFunction) {
        logger.info(" ====== get all unit =====")
        try {
            const result = await ConversionUnitService.getAllData();
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
            
            const productId: string | undefined = req.body.product_id as string;
            const qty: string | undefined = req.body.qty as string;
            const purchase_price: string | undefined = req.body.purchase_price as string;
            const selling_price: string | undefined = req.body.selling_price as string;
            
            const product_id: number | undefined = productId ? parseInt(productId) : undefined;
            const quantity: number | undefined = qty ? parseInt(qty) : undefined;
            const purchasePrice: number | undefined = purchase_price ? parseInt(purchase_price) : undefined;
            const sellingPrice: number | undefined = selling_price ? parseInt(selling_price) : undefined;

            const requestBody = {
                ...req.body,
                product_id: product_id,
                qty: quantity,
                purchase_price: purchasePrice,
                selling_price: sellingPrice,
            }

            const request: CreateConversionUnitRequest = requestBody as CreateConversionUnitRequest;
            const response = await ConversionUnitService.store(request, req.body);
            res.status(200).json({
                message: process.env.SUCCESS_ADD_DATA,
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    // update conversion unit
    static async update(req: ConversionUnitRequest, res: Response, next: NextFunction) {
        try {
            
            const productId: string | undefined = req.body.product_id as string;
            const qty: string | undefined = req.body.qty as string;
            const purchase_price: string | undefined = req.body.purchase_price as string;
            const selling_price: string | undefined = req.body.selling_price as string;
            
            const product_id: number | undefined = productId ? parseInt(productId) : undefined;
            const quantity: number | undefined = qty ? parseInt(qty) : undefined;
            const purchasePrice: number | undefined = purchase_price ? parseInt(purchase_price) : undefined;
            const sellingPrice: number | undefined = selling_price ? parseInt(selling_price) : undefined;

            const requestBody = {
                ...req.body,
                product_id: product_id,
                qty: quantity,
                purchase_price: purchasePrice,
                selling_price: sellingPrice,
            }

            const request: UpdateConversionUnitRequest = requestBody as UpdateConversionUnitRequest;
            const response = await ConversionUnitService.update(request, req.body);
            res.status(200).json({
                message: process.env.SUCCESS_UPDATE_DATA,
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    // get unit by id
    static async getById(req: ConversionUnitRequest, res: Response, next: NextFunction) {
        logger.info("==========controller getById =============")
        
        try {
            // Extract the ID from query parameters
            const id: string | undefined = req.query.id as string;
            
            // Convert the ID to a number
            const numericId: number | undefined = id ? parseInt(id) : undefined;

            if (numericId !== undefined) {
                // Call ConversionUnitService.getById with the numeric ID
                const response = await ConversionUnitService.getById({ id: numericId });
                // Send the response back to the client
                res.status(200).json({ data: response });
            } else {
                throw new Error('ID not provided');
            }

        } catch (error) {
            next(error);
        }
    }
    
    // get unit by product
    static async getByProduct(req: ConversionUnitRequest, res: Response, next: NextFunction) {
        logger.info("========== controller getByProduct =============")
        
        try {
            // Extract the ID from query parameters
            const id: string | undefined = req.query.product_id as string;
            
            // Convert the ID to a number
            const numericId: number | undefined = id ? parseInt(id) : undefined;

            if (numericId !== undefined) {
                // Call ConversionUnitService.getById with the numeric ID
                const response = await ConversionUnitService.getByProduct({ product_id: numericId });
                // Send the response back to the client
                res.status(200).json({ data: response });
            } else {
                throw new Error('ID not provided');
            }

        } catch (error) {
            next(error);
        }
    }
    
    // get unit by id
    static async delete(req: ConversionUnitRequest, res: Response, next: NextFunction) {
        try {
            const response = await ConversionUnitService.delete(req.body);
            res.status(200).json({ data: process.env.SUCCESS_DELETE_DATA });
        } catch (error) {
            next(error);
        }
    }
}