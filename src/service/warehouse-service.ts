import env from "dotenv";
import { Warehouse, User } from "@prisma/client";
import { CreateWarehouseRequest, ByIdRequest, WarehouseResponse, UpdateWarehouseRequest, toWarehouseResponse } from "../model/warehouse-model";
import { prismaClient } from "../app/database";
import { Validation } from "../validation/validation";
import { WarehouseValidation } from "../validation/warehouse-validation";
import { logger } from "../app/logging";
import { ResponseError } from "../error/response-error";
import { Helper } from "../utils/helper";

env.config();

const DATA_NOT_FOUND = process.env.DATA_NOT_FOUND;

export class WarehouseService {
    static async getAllData(): Promise<Warehouse[]> {
        const result = await prismaClient.warehouse.findMany({
            include: {
                branch: true
            }
        })

        return result
    }

    static async store(request: CreateWarehouseRequest, user: User): Promise<WarehouseResponse> {
        
        const warehouseRequest = Validation.validate(WarehouseValidation.STORE, request)

        logger.info("===== Store warehouse data =====")
        
        // const existName = await prismaClient.warehouse.count({
        //     where:{
        //         name: warehouseRequest.name
        //     }
        // })

        // if(existName > 0) {
        //     throw new ResponseError(400, "Warehouse name already exists");
        // }

        warehouseRequest.created_at = Helper.dateTimeLocal(new Date());
        warehouseRequest.created_by = user.username;
        
        const result = await prismaClient.warehouse.create({ 
            data: warehouseRequest
        });

        return toWarehouseResponse(result)
    }

    static async update(request: UpdateWarehouseRequest, user: User): Promise<WarehouseResponse> {
        
        const updateRequest = Validation.validate(WarehouseValidation.UPDATE, request)
        
        logger.info("===== Update warehouse data =====")
        logger.info(updateRequest)
        if(updateRequest.id) {
            const existdata = await prismaClient.warehouse.count({
                where:{
                    id: updateRequest.id
                }
            })
    
            if(existdata == 0) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }
        } else {
            throw new ResponseError(404, DATA_NOT_FOUND!);
        }
        
        // if(updateRequest.name) {
        //     const existName = await prismaClient.warehouse.count({
        //         where:{
        //             name: updateRequest.name
        //         }
        //     })
    
        //     if(existName > 0) {
        //         throw new ResponseError(400, "Name already exists");
        //     }
        // }

        const warehouse = {
            ...updateRequest, // Copy other fields from the original request
            updated_at : Helper.dateTimeLocal(new Date()),
            updated_by : user.username,
        };
        logger.info('==== param warehouse update ====')
        logger.info(warehouse)
        const result = await prismaClient.warehouse.update({ 
            where: {
                id: updateRequest.id
            },
            data: warehouse
        });

        return toWarehouseResponse(result)
    }

    static async getById(request: ByIdRequest): Promise<WarehouseResponse | null> {
        logger.info("===== Get warehouse by id =====")
        if(request.id) {
            const existdata = await prismaClient.warehouse.findFirst({
                where:{
                    id: request.id
                }
            })

            if(existdata == null) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }

            return existdata
    
        } else {
            throw new ResponseError(404, DATA_NOT_FOUND!);
        }
    }

    static async delete(request: ByIdRequest): Promise<WarehouseResponse | null> {
        logger.info("===== Delete warehouse by id =====")
        logger.info(request.id)
        if(request.id) {

            const existdata = await prismaClient.warehouse.count({
                where:{
                    id: request.id
                }
            })

            if(existdata == 0) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }

            const result = await prismaClient.warehouse.delete({
                where:{
                    id: request.id
                }
            })

            return result
    
        } else {
            throw new ResponseError(404, DATA_NOT_FOUND!);
        }
    }
}