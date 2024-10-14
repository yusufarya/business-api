import { NextFunction, Request, Response, response } from "express";
import { WarehouseTransferService } from "../../service/transaction/warehousetransfer-service";
import { logger } from "../../app/logging";
import { CreateWarehouseTransferRequest, UpdateWarehouseTransferRequest } from "../../model/transaction/warehousetransfer-model";
import { WarehouseTransferRequest } from "../../types/type-request";
import { ResponseError } from "../../error/response-error";

export class WarehouseTransferController {

    // get all data
    static async get(req: Request, res: Response, next: NextFunction) {
        logger.info(" ====== get all warehouse transfer =====")
        try {
            const result = await WarehouseTransferService.getAllData();
            res.status(200).json({
                data:result
            })
        } catch (error) {
            next(error)
        }
    }

    // create warehouse transfer
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info('=============== CREATE WH TR ================')
            const branch_id: string | undefined = req.body.branch_id as string;
            const ware_from: string | undefined = req.body.wh_from as string;
            const ware_to: string | undefined = req.body.wh_to as string;
            
            // Convert the ID to a number
            const branchId: number | undefined = branch_id ? parseInt(branch_id) : undefined;
            const wareFrom: number | undefined = branch_id ? parseInt(ware_from) : undefined;
            const wareTo: number | undefined = branch_id ? parseInt(ware_to) : undefined;
            const requestTRWH = {
                ...req.body,
                branch_id: branchId,
                wh_from: wareFrom,
                wh_to: wareTo
            }

            logger.info(requestTRWH)

            if(branch_id != undefined) {
                const request: CreateWarehouseTransferRequest = requestTRWH as CreateWarehouseTransferRequest;
                const response = await WarehouseTransferService.store(request, req.body);
                
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

    // update warehouse transfer
    static async update(req: WarehouseTransferRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateWarehouseTransferRequest = req.body as UpdateWarehouseTransferRequest;
            const branch_id: number | undefined = request.branch_id as number;
            const requestTRWH = {
                ...request,
                branch_id: branch_id
            }
            const response = await WarehouseTransferService.update(requestTRWH, req.body);
            res.status(200).json({
                message: process.env.SUCCESS_UPDATE_DATA,
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    // get warehouse transfer by id
    static async getByNumber(req: WarehouseTransferRequest, res: Response, next: NextFunction) {
        try {
            // Extract the ID from query parameters
            const number: string | undefined = req.query.number as string;
            
            const response = await WarehouseTransferService.getByNumber({number: number});
            res.status(200).json({ data: response });
        } catch (error) {
            next(error);
        }
    }
    
    // get warehouse transfer by id
    static async delete(req: WarehouseTransferRequest, res: Response, next: NextFunction) {
        try {
            const response = await WarehouseTransferService.delete(req.body);
            res.status(200).json({ data: process.env.SUCCESS_DELETE_DATA });
        } catch (error) {
            next(error);
        }
    }
}