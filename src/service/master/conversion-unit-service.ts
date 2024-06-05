import env from "dotenv";
import { ConversionUnit, User } from "@prisma/client";

import { prismaClient } from "../../app/database";
import { Validation } from "../../validation/master/validation";
import { ConversionUnitValidation } from "../../validation/master/conversion-unit-validation";
import { logger } from "../../app/logging";
import { ResponseError } from "../../error/response-error";
import { Helper } from "../../utils/helper";
import { ByIdRequest, ByProductRequest, ConversionUnitResponse, CreateConversionUnitRequest, UpdateConversionUnitRequest, toConversionUnitResponse } from "../../model/master/conversion-unit-model";

env.config();

const DATA_NOT_FOUND = process.env.DATA_NOT_FOUND;
const DATA_ALREADY_EXISTS = process.env.DATA_ALREADY_EXISTS;

export class ConversionUnitService {
    static async getAllData(): Promise<ConversionUnit[]> {
        const result = await prismaClient.conversionUnit.findMany({
            // where: {
            //     is_active : "Y"
            // }
        })

        return result
    }

    static async store(request: CreateConversionUnitRequest, user: User): Promise<ConversionUnitResponse> {
        
        const conversionUnitRequest = Validation.validate(ConversionUnitValidation.STORE, request)

        logger.info("===== Store conversion unit data =====")

        // Fetch the highest sequence for the given product_id
        const conversionExists = await prismaClient.conversionUnit.findFirst({
            where: { 
                product_id: conversionUnitRequest.product_id
            },
            orderBy: { sequence: 'desc' },
            select: {
                sequence: true,
                conversion_unit: true
            }
        });

        const newSequence = (conversionExists?.sequence ?? 0) + 1;
        const unit = conversionExists!.conversion_unit;
        
        conversionUnitRequest.unit = unit;
        conversionUnitRequest.sequence = newSequence;
        conversionUnitRequest.created_at = Helper.dateTimeLocal(new Date());
        conversionUnitRequest.created_by = user.username;

        // const getProductConversion = await prismaClient.conversionUnit.findFirst({
        //     where: {
        //         conversion_unit : conversionUnitRequest.unit
        //     }
        // })

        // if(getProductConversion) {
        //     throw new ResponseError(404, "Failed, " + DATA_ALREADY_EXISTS!)
        // }
        
        const result = await prismaClient.conversionUnit.create({ 
            data: conversionUnitRequest 
        });

        if(result) {
            const getResponse = toConversionUnitResponse(result)
            logger.info(" ================ ============================ ================ ")
            logger.info(" ================ getResponse convetsion units ================ ")
            logger.info(getResponse)
            
            try {
                const GetConversionUnits = await prismaClient.conversionUnit.findFirst({
                    where: {
                        conversion_unit: getResponse.unit
                    }
                })
                if(!GetConversionUnits) {
                    logger.error("conversion units not found")
                    throw new ResponseError(400, 'Failed to updating data, conversion units not found.')
                }
                const conversionUnits = await prismaClient.conversionUnit.update({
                    where: {
                        id: GetConversionUnits.id
                    },
                    data: {
                        conversion_qty: getResponse.qty
                    }
                })
            } catch (error) {
                logger.error("error update data conversion units")
                logger.error(error)
                throw new ResponseError(400, 'Failed to updating data conversion units')
            }

            return getResponse
        } else {
            throw new ResponseError(400, 'An error occurred while inserting data Convertion unit')
        }
    }

    static async update(request: UpdateConversionUnitRequest, user: User): Promise<ConversionUnitResponse> {
        
        const updateRequest = Validation.validate(ConversionUnitValidation.UPDATE, request)
        
        logger.info("===== Update conversion unit data =====")
        logger.info(updateRequest)
        if(updateRequest.id) {
            const existdata = await prismaClient.conversionUnit.count({
                where:{
                    id: updateRequest.id
                }
            })
    
            if(existdata == 0) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }
        }

        const conversionUnit = {
            ...updateRequest, // Copy other fields from the original request
            updated_at : Helper.dateTimeLocal(new Date()),
            updated_by : user.username,
        };
        logger.info('==== Param Conversion Unit update ====')
        logger.info(conversionUnit)
        const result = await prismaClient.conversionUnit.update({ 
            where: {
                id: updateRequest.id
            },
            data: conversionUnit
        });

        return toConversionUnitResponse(result)
    }

    static async getById(request: ByIdRequest): Promise<ConversionUnitResponse | null> {
        logger.info("===== Get conversion unit by id =====")
        logger.info(request.id)
        if(request.id) {
            const existdata = await prismaClient.conversionUnit.findFirst({
                where:{
                    id: request.id
                },
                include: {
                    product: {
                        select: {
                            name: true
                        }
                    }
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

    static async getByProduct(request: ByProductRequest): Promise<ConversionUnit[] | null> {
        logger.info("===== Get conversion unit by product_id =====")
        logger.info(request.product_id)
        if(request.product_id) {
            const existdata = await prismaClient.conversionUnit.findMany({
                where:{
                    product_id: request.product_id
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

    static async delete(request: ByIdRequest): Promise<ConversionUnitResponse | null> {
        logger.info("===== Delete unit by id =====")
        if(request.id) {

            const existdata = await prismaClient.conversionUnit.count({
                where:{
                    id: request.id
                }
            })

            if(existdata == 0) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }

            const checkThisUnitUsed = await prismaClient.product.findFirst({
                where:{
                    unit_id: request.id
                }
            })
            
            if(checkThisUnitUsed) {
                throw new ResponseError(400, "This unit used on product '" + checkThisUnitUsed.name + "'");
            }
            
            const result = await prismaClient.conversionUnit.delete({
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