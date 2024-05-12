import { NextFunction, Request, Response, response } from "express";
import { ProductService } from "../../service/master/product-service";
import { logger } from "../../app/logging";
import { CreateProductRequest, UpdateProductRequest } from "../../model/master/product-model";
import { ProductRequest } from "../../types/type-request";

export class ProductController {

    // get all data
    static async get(req: Request, res: Response, next: NextFunction) {
        logger.info(" ====== get all product =====")
        try {
            const result = await ProductService.getAllData();
            res.status(200).json({
                data:result
            })
        } catch (error) {
            next(error)
        }
    }

    // create product
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateProductRequest = req.body as CreateProductRequest;
            const response = await ProductService.store(request, req.body);
            res.status(200).json({
                data: process.env.SUCCESS_ADD_DATA
            })
        } catch (error) {
            next(error)
        }
    }

    // update product
    static async update(req: ProductRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateProductRequest = req.body as UpdateProductRequest;
            const response = await ProductService.update(request, req.body);
            res.status(200).json({ 
                data: process.env.SUCCESS_UPDATE_DATA
            });
        } catch (error) {
            next(error);
        }
    }

    // get product by id
    static async getById(req: ProductRequest, res: Response, next: NextFunction) {
        try {
            const response = await ProductService.getById(req.body);
            res.status(200).json({ data: response });
        } catch (error) {
            next(error);
        }
    }
    
    // get product by id
    static async delete(req: ProductRequest, res: Response, next: NextFunction) {
        try {
            const response = await ProductService.delete(req.body);
            res.status(200).json({ data: process.env.SUCCESS_DELETE_DATA });
        } catch (error) {
            next(error);
        }
    }
}