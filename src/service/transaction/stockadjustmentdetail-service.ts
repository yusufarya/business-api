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
                        id:true,
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
        logger.info("===== Store stock adjustment =====")
        
        try {
            const dataDetailRequest = Validation.validate(StockAdjustmentDetailValidation.STORE, request)
    
            const checkTransHeader = await prismaClient.stockAdjustment.count({
                where: {
                    number : dataDetailRequest.number
                }
            })
            
            interface MaxNumberResult {
                incrementSeq: number | null; // Assuming number_tr can be null
            }
    
            const queryResult = await prismaClient.$queryRaw<MaxNumberResult[]>`SELECT max(sequence) as incrementSeq FROM stock_adjustment_detail LIMIT 1`
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
    
            SA_DETAIL_PARAMS.date = Helper.dateTimeLocal(new Date()),
            SA_DETAIL_PARAMS.created_at = Helper.dateTimeLocal(new Date()),
            SA_DETAIL_PARAMS.created_by = user.username,
            SA_DETAIL_PARAMS.updated_at = Helper.dateTimeLocal(new Date()),
            SA_DETAIL_PARAMS.updated_by = user.username
    
            await TransactionHelper.stock_SA(headerRequest.type, SA_DETAIL_PARAMS)
            await TransactionHelper.tr_histories_SA(headerRequest.type, SA_DETAIL_PARAMS)
            return toStockAdjustmentDetailsResponse(result)
        } catch (error) {
            logger.info('Error Proses Store Stock Adjustment Detail .')
            logger.error(error)
            throw new ResponseError(500, 'Terjadi kesalahan saat memposes')
        }
        
    }

    static async getById(request: ByIdRequest): Promise<StockAdjustmentDetailsResponse | null> {
        logger.info("===== Get stock adjustment detail by id =====")
        logger.info(request.id)
        if(request.id) {
            const existdata = await prismaClient.stockAdjustmentDetails.findUnique({
                where:{
                    id: request.id
                },
                include : {
                    product: {
                        select: {
                            name: true,
                            unit: {
                                select: {
                                    initial: true
                                }
                            }
                        },
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
    
    static async update(request: UpdateStockAdjustmentDetailsRequest, user: User, headerRequest : CreateStockAdjustmentRequest): Promise<StockAdjustmentDetailsResponse> {
        logger.info("===== Update stock adjustment =====")
        try {
            logger.info(request)
            logger.info(headerRequest)
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

            const currentData = await prismaClient.stockAdjustmentDetails.findFirst({
                where: {
                    id: SA_DETAIL_PARAMS.id,
                    number: SA_DETAIL_PARAMS.number
                }
            })

            const result = await prismaClient.stockAdjustmentDetails.update({
                where: {
                    id: SA_DETAIL_PARAMS.id,
                    number: SA_DETAIL_PARAMS.number
                },
                data: SA_DETAIL_PARAMS
            });

            if(!result) {
                throw new ResponseError(404, DATA_NOT_FOUND!)
            }
            
            const SA_DETAIL_PARAMS_UPDATE = {
                ...result,
                created_at : Helper.dateTimeLocal(new Date()),
                created_by : user.username,
                updated_at : Helper.dateTimeLocal(new Date()),
                updated_by : user.username
            }

            await TransactionHelper.stock_SA(headerRequest.type, SA_DETAIL_PARAMS_UPDATE, currentData?.qty)
            await TransactionHelper.tr_histories_SA(headerRequest.type, SA_DETAIL_PARAMS_UPDATE)
            
            return toStockAdjustmentDetailsResponse(result)
        } catch (error) {
            logger.info('Error Proses Update Stock Adjustment Detail .')
            logger.error(error)
            throw new ResponseError(500, 'Terjadi kesalahan saat memposes')
        }
        
    }

    static async delete(request: ByIdRequest, headerRequest : CreateStockAdjustmentRequest): Promise<StockAdjustmentDetailsResponse> {
        logger.info("===== Delete stockAdjustmentDetails by id =====")
        logger.info(request.id)
        logger.info('type :' + headerRequest.type)
        if(request.id) {

            const currentData = await prismaClient.stockAdjustmentDetails.findFirst({
                where:{
                    id: request.id
                }
            })

            if(!currentData) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }

            const result = await prismaClient.stockAdjustmentDetails.delete({
                where:{
                    id: request.id
                }
            })
            
            TransactionHelper.delete_stock_SA(headerRequest.type, currentData)
            TransactionHelper.delete_tr_histories(currentData)

            if(result) {
                logger.info('Delete stock adjusment if successfully')
            } else {
                logger.info('Delete stock adjusment if failed')
            }
            return result
    
        } else {
            throw new ResponseError(404, DATA_NOT_FOUND!);
        }
    }
}