import { NextFunction, Request, Response, response } from "express";
import { CategoryService } from "../../service/master/category-service";
import { logger } from "../../app/logging";
import { CreateCategoryRequest, UpdateCategoryRequest } from "../../model/master/category-model";
import { CategoryRequest } from "../../types/type-request";

export class CategoryController {

    // get all data
    static async get(req: Request, res: Response, next: NextFunction) {
        logger.info(" ====== get all category =====")
        try {
            const result = await CategoryService.getAllData();
            res.status(200).json({
                data:result
            })
        } catch (error) {
            next(error)
        }
    }

    // create category
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateCategoryRequest = req.body as CreateCategoryRequest;
            const response = await CategoryService.store(request, req.body);
            res.status(200).json({
                message: process.env.SUCCESS_ADD_DATA,
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    // update category
    static async update(req: CategoryRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateCategoryRequest = req.body as UpdateCategoryRequest;
            const response = await CategoryService.update(request, req.body);
            res.status(200).json({
                message: process.env.SUCCESS_UPDATE_DATA,
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    static async upload(req: Request, res: Response, next: NextFunction) {
        logger.info("===== Controller Upload image category =====")
        try {
            const response = await CategoryService.upload(req);
            res.status(200).json({ 
                data: {message: 'Upload success', data : response}
            });
        } catch (error) {
            next(error);
        }
    }

    // get category by id
    static async getById(req: CategoryRequest, res: Response, next: NextFunction) {
        try {
            // Extract the ID from query parameters
            const id: string | undefined = req.query.id as string;
            
            // Convert the ID to a number
            const numericId: number | undefined = id ? parseInt(id) : undefined;

            if (numericId !== undefined) {
                // Call BrandService.getById with the numeric ID
                const response = await CategoryService.getById({ id: numericId });
                // Send the response back to the client
                res.status(200).json({ data: response });
            } else {
                throw new Error('ID not provided');
            }
        } catch (error) {
            next(error);
        }
    }
    
    // get category by id
    static async delete(req: CategoryRequest, res: Response, next: NextFunction) {
        try {
            const response = await CategoryService.delete(req.body);
            res.status(200).json({ data: process.env.SUCCESS_DELETE_DATA });
        } catch (error) {
            next(error);
        }
    }
}