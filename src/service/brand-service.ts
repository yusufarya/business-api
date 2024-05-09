import env from "dotenv";
import { Brand, User } from "@prisma/client";
import { CreateBrandRequest, ByIdRequest, BrandResponse, UpdateBrandRequest, toBrandResponse } from "../model/brand-model";
import { prismaClient } from "../app/database";
import { Validation } from "../validation/validation";
import { BrandValidation } from "../validation/brand-validation";
import { logger } from "../app/logging";
import { ResponseError } from "../error/response-error";
import { Helper } from "../utils/helper";

env.config();

const DATA_NOT_FOUND = process.env.DATA_NOT_FOUND;

export class BrandService {
    static async getAllData(): Promise<Brand[]> {
        const result = await prismaClient.brand.findMany()

        return result
    }

    static async store(request: CreateBrandRequest, user: User): Promise<BrandResponse> {
        
        const brandRequest = Validation.validate(BrandValidation.STORE, request)

        logger.info("===== Store brand data =====")
        
        const existName = await prismaClient.brand.count({
            where:{
                name: brandRequest.name
            }
        })

        if(existName > 0) {
            throw new ResponseError(400, "Brand name already exists");
        }

        brandRequest.created_at = Helper.dateTimeLocal(new Date());
        brandRequest.created_by = user.username;
        
        const result = await prismaClient.brand.create({ 
            data: brandRequest 
        });

        return toBrandResponse(result)
    }

    static async update(request: UpdateBrandRequest, user: User): Promise<BrandResponse> {
        
        const updateRequest = Validation.validate(BrandValidation.UPDATE, request)
        
        logger.info("===== Update brand data =====")
        logger.info(updateRequest)
        if(updateRequest.id) {
            const existdata = await prismaClient.brand.count({
                where:{
                    id: updateRequest.id
                }
            })
    
            if(existdata == 0) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }
        }
        
        if(updateRequest.name) {
            const existName = await prismaClient.brand.count({
                where:{
                    name: updateRequest.name
                }
            })
    
            if(existName > 0) {
                throw new ResponseError(400, "Name already exists");
            }
        }

        const brand = {
            ...updateRequest, // Copy other fields from the original request
            updated_at : Helper.dateTimeLocal(new Date()),
            updated_by : user.username,
        };
        logger.info('==== param brand update ====')
        logger.info(brand)
        const result = await prismaClient.brand.update({ 
            where: {
                id: updateRequest.id
            },
            data: brand
        });

        return toBrandResponse(result)
    }

    static async getById(request: ByIdRequest): Promise<BrandResponse | null> {
        logger.info("===== Get brand by id =====")
        if(request.id) {
            const existdata = await prismaClient.brand.findFirst({
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

    static async delete(request: ByIdRequest): Promise<BrandResponse | null> {
        logger.info("===== Delete brand by id =====")
        if(request.id) {
            const existdata = await prismaClient.brand.count({
                where:{
                    id: request.id
                }
            })

            if(existdata == 0) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }

            const result = await prismaClient.brand.delete({
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