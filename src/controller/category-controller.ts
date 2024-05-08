import { NextFunction, Request, Response, response } from "express";
import { CategoryService } from "../service/category-service";
import { logger } from "../app/logging";
import { CreateCategoryRequest, UpdateCategoryRequest } from "../model/category-model";
import { CategoryRequest } from "../types/type-request";

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
                data: process.env.SUCCESS_ADD_DATA
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
                data: process.env.SUCCESS_UPDATE_DATA
            });
        } catch (error) {
            next(error);
        }
    }

    // get category by id
    static async getById(req: CategoryRequest, res: Response, next: NextFunction) {
        try {
            const response = await CategoryService.getById(req.body);
            res.status(200).json({ data: response });
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