import { NextFunction, Request, Response, response } from "express";
import { BranchService } from "../../service/master/branch-service";
import { logger } from "../../app/logging";
import { CreateBranchRequest, UpdateBranchRequest } from "../../model/master/branch-model";
import { BranchRequest } from "../../types/type-request";

export class BranchController {

    // get all data
    static async get(req: Request, res: Response, next: NextFunction) {
        logger.info(" ====== get all branch =====")
        try {
            const result = await BranchService.getAllData();
            res.status(200).json({
                data:result
            })
        } catch (error) {
            next(error)
        }
    }

    // create branch
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateBranchRequest = req.body as CreateBranchRequest;
            const response = await BranchService.store(request, req.body);
            res.status(200).json({
                message: process.env.SUCCESS_ADD_DATA,
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    // update branch
    static async update(req: BranchRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateBranchRequest = req.body as UpdateBranchRequest;
            const response = await BranchService.update(request, req.body);
            res.status(200).json({ 
                message: process.env.SUCCESS_UPDATE_DATA,
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    // get branch by id
    static async getById(req: BranchRequest, res: Response, next: NextFunction) {
        try {
            // Extract the ID from query parameters
            const id: string | undefined = req.query.id as string;
            
            // Convert the ID to a number
            const numericId: number | undefined = id ? parseInt(id) : undefined;

            if (numericId !== undefined) {
                // Call BrandService.getById with the numeric ID
                const response = await BranchService.getById({ id: numericId });
                // Send the response back to the client
                res.status(200).json({ data: response });
            } else {
                throw new Error('ID not provided');
            }
        } catch (error) {
            next(error);
        }
    }
    
    // get branch by id
    static async delete(req: BranchRequest, res: Response, next: NextFunction) {
        try {
            const response = await BranchService.delete(req.body);
            res.status(200).json({ data: process.env.SUCCESS_DELETE_DATA });
        } catch (error) {
            next(error);
        }
    }
}