import env from "dotenv";
import { User } from "@prisma/client";
import { CreateStockAdjustmentDetailsRequest, StockAdjustmentDetailsResponse, UpdateStockAdjustmentDetailsRequest, toStockAdjustmentDetailsResponse } from "../../model/transaction/stockadjustmentdetail-model";
import { Validation } from "../../validation/master/validation";
import { StockAdjustmentDetailValidation } from "../../validation/transaction/stockadjustmentdetail-validation";
import { prismaClient } from "../../app/database";
import { ResponseError } from "../../error/response-error";
import { Helper } from "../../utils/helper";
import { TransactionHelper } from "../../utils/transaction-helper";
import { CreateStockAdjustmentRequest } from "../../model/transaction/stockadjustment-model";
import { logger } from "../../app/logging";
import { ByIdRequest } from "../../model/master/unit-model";

env.config();

const DATA_NOT_FOUND = process.env.DATA_NOT_FOUND;

export class StockAdjustmentDetailService {

    static async getAllData(): Promise<StockAdjustmentDetailsResponse[]> {
        const result = await prismaClient.stockAdjustmentDetails.findMany({
            include: {
                product: {
                    select: {
                        name: true
                    }
                },
                branch: {
                    select: {
                        name: true
                    }
                },
                warehouse: {
                    select: {
                        name: true
                    }
                },
            }
        })

        return result
    }

    static async store(request: CreateStockAdjustmentDetailsRequest, user: User, headerRequest : CreateStockAdjustmentRequest): Promise<StockAdjustmentDetailsResponse> {
        const dataDetailRequest = Validation.validate(StockAdjustmentDetailValidation.STORE, request)

        const checkTransHeader = await prismaClient.stockAdjustment.count({
            where: {
                number : dataDetailRequest.number
            }
        })
        
        interface MaxNumberResult {
            incrementSeq: number | null; // Assuming number_tr can be null
        }

        const queryResult = await prismaClient.$queryRaw<MaxNumberResult[]>`SELECT max(sequence) as incrementSeq FROM stockAdjustmentDetail LIMIT 1`
        logger.info("===================== CHECK DATA SA =====================")
        if (queryResult.length > 0 && queryResult[0].incrementSeq !== null) {
            var incrementSeq = queryResult[0].incrementSeq+1
        } else {
            var incrementSeq = 1
        }

        if(checkTransHeader == 0) {
            throw new ResponseError(404, DATA_NOT_FOUND!)
        }

        const SA_DETAIL_PARAMS = {
            ...dataDetailRequest,
            sequence: incrementSeq,
            created_at : Helper.dateTimeLocal(new Date()),
            created_by : user.username
        }

        const result = await prismaClient.stockAdjustmentDetails.create({ 
            data: SA_DETAIL_PARAMS
        });

        TransactionHelper.stock_SA(headerRequest.type, result)
        
        return toStockAdjustmentDetailsResponse(result)
    }
    
    static async update(request: UpdateStockAdjustmentDetailsRequest, user: User, headerRequest : CreateStockAdjustmentRequest): Promise<StockAdjustmentDetailsResponse> {
        const dataDetailRequest = Validation.validate(StockAdjustmentDetailValidation.UPDATE, request)

        const checkTransHeader = await prismaClient.stockAdjustment.count({
            where: {
                number : dataDetailRequest.number
            }
        })

        if(checkTransHeader == 0) {
            throw new ResponseError(404, DATA_NOT_FOUND!)
        }

        const SA_DETAIL_PARAMS = {
            ...dataDetailRequest,
            updated_at : Helper.dateTimeLocal(new Date()),
            updated_by : user.username
        }

        const result = await prismaClient.stockAdjustmentDetails.update({
            where: {
                id: SA_DETAIL_PARAMS.id,
                number: SA_DETAIL_PARAMS.number
            },
            data: SA_DETAIL_PARAMS
        });

        TransactionHelper.stock_SA(headerRequest.type, result)
        
        return toStockAdjustmentDetailsResponse(result)
    }

    static async delete(request: ByIdRequest, headerRequest : CreateStockAdjustmentRequest): Promise<StockAdjustmentDetailsResponse> {
        logger.info("===== Delete stockAdjustmentDetails by id =====")
        logger.info(request.id)
        if(request.id) {

            const existdata = await prismaClient.stockAdjustmentDetails.count({
                where:{
                    id: request.id
                }
            })

            if(existdata == 0) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }

            const result = await prismaClient.stockAdjustmentDetails.delete({
                where:{
                    id: request.id
                }
            })
            TransactionHelper.delete_stock_SA(headerRequest.type, result)
            return result
    
        } else {
            throw new ResponseError(404, DATA_NOT_FOUND!);
        }
    }
}