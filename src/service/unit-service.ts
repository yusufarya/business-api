import env from "dotenv";
import { Unit, User } from "@prisma/client";
import { CreateUnitRequest, ByIdRequest, UnitResponse, UpdateUnitRequest, toUnitResponse } from "../model/unit-model";
import { prismaClient } from "../app/database";
import { Validation } from "../validation/validation";
import { UnitValidation } from "../validation/unit-validation";
import { logger } from "../app/logging";
import { ResponseError } from "../error/response-error";
import { Helper } from "../utils/helper";

env.config();

const DATA_NOT_FOUND = process.env.DATA_NOT_FOUND;

export class UnitService {
    static async getAllData(): Promise<Unit[]> {
        const result = await prismaClient.unit.findMany({
            where: {
                is_active : "Y"
            }
        })

        return result
    }

    static async store(request: CreateUnitRequest, user: User): Promise<UnitResponse> {
        
        const unitRequest = Validation.validate(UnitValidation.STORE, request)

        logger.info("===== Store unit data =====")
        
        const existInitial = await prismaClient.unit.count({
            where:{
                initial: unitRequest.initial
            }
        })

        if(existInitial > 0) {
            throw new ResponseError(400, "Initial already exists");
        }
        
        unitRequest.created_at = Helper.dateTimeLocal(new Date());
        unitRequest.created_by = user.username;
        
        const result = await prismaClient.unit.create({ 
            data: unitRequest 
        });

        return toUnitResponse(result)
    }

    static async update(request: UpdateUnitRequest, user: User): Promise<UnitResponse> {
        
        const updateRequest = Validation.validate(UnitValidation.UPDATE, request)
        
        logger.info("===== Update unit data =====")
        logger.info(updateRequest)
        if(updateRequest.id) {
            const existdata = await prismaClient.unit.count({
                where:{
                    id: updateRequest.id
                }
            })
    
            if(existdata == 0) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }
        }
        
        if(updateRequest.initial) {
            const existInitial = await prismaClient.unit.count({
                where:{
                    initial: updateRequest.initial
                }
            })
    
            if(existInitial > 0) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }
        }

        const unit = {
            ...updateRequest, // Copy other fields from the original request
            updated_at : Helper.dateTimeLocal(new Date()),
            updated_by : user.username,
        };
        logger.info('==== param unit update ====')
        logger.info(unit)
        const result = await prismaClient.unit.update({ 
            where: {
                id: updateRequest.id
            },
            data: unit
        });

        return toUnitResponse(result)
    }

    static async getById(request: ByIdRequest): Promise<UnitResponse | null> {
        logger.info("===== Get unit by id =====")
        if(request.id) {
            const existdata = await prismaClient.unit.findFirst({
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

    static async delete(request: ByIdRequest): Promise<UnitResponse | null> {
        logger.info("===== Delete unit by id =====")
        if(request.id) {
            const existdata = await prismaClient.unit.delete({
                where:{
                    id: request.id
                }
            })

            return existdata
    
        } else {
            throw new ResponseError(404, DATA_NOT_FOUND!);
        }
    }
}