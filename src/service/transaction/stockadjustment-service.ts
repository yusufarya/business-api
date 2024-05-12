import env from "dotenv";
import { StockAdjustment, User } from "@prisma/client";
import { CreateStockAdjustmentRequest, StockAdjustmentResponse, UpdateStockAdjustmentRequest, toStockAdjustmentResponse } from "../../model/transaction/stockadjustment-model";
import { prismaClient } from "../../app/database";
import { Validation } from "../../validation/master/validation";
import { StockAdjustmentValidation } from "../../validation/transaction/stockadjustment-validation";
import { logger } from "../../app/logging";
import { ResponseError } from "../../error/response-error";
import { Helper } from "../../utils/helper";
import { ByNumberRequest } from "../../model/transaction/stockadjustment-model";
import { number } from "zod";
import { TransactionHelper } from "../../utils/transaction-helper";

env.config();

const DATA_NOT_FOUND = process.env.DATA_NOT_FOUND;

export class StockAdjustmentService {
    
    static async getAllData(): Promise<StockAdjustment[]> {
        const result = await prismaClient.stockAdjustment.findMany({
            include: {
                branch: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return result
    }

    static async store(request: CreateStockAdjustmentRequest, user: User): Promise<StockAdjustmentResponse> {
        
        interface MaxNumberResult {
            number_tr: string | null; // Assuming number_tr can be null
        }
        
        const get_no_transaction = Helper.generateNoTransaction()

        const queryResult = await prismaClient.$queryRaw<MaxNumberResult[]>`SELECT max(number) as number_tr FROM stockAdjustment LIMIT 1`
        logger.info("===================== CHECK DATA SA =====================")
        if (queryResult.length > 0 && queryResult[0].number_tr !== null) {
            var number_tr = queryResult[0].number_tr
            const lastThreeDigits = parseInt(number_tr.slice(-4), 10); // Extract and parse the last three digits
            const incrementedDigits = (lastThreeDigits + 1).toString().padStart(3, '0'); // Increment and pad to three digits
            var noTransaction = `SA${get_no_transaction}${incrementedDigits}`
        } else {
            var noTransaction = `SA${get_no_transaction}0001`
        }
        
        logger.info("===== Store Stockadjustment Data =====")

        logger.info("NUMBER TRANSACTION = "+ noTransaction)
        
        const stockadjustmentRequest = Validation.validate(StockAdjustmentValidation.STORE, request)
        
        const SA_PARAMS = {
            ...stockadjustmentRequest, // Copy other fields from the original request
            number: noTransaction,
            created_at : Helper.dateTimeLocal(new Date()),
            created_by : user.username
        };
        logger.info(SA_PARAMS)

        stockadjustmentRequest.created_at = Helper.dateTimeLocal(new Date());
        stockadjustmentRequest.created_by = user.username;
        
        const result = await prismaClient.stockAdjustment.create({ 
            data: SA_PARAMS
        });

        return toStockAdjustmentResponse(result)
    }

    static async update(request: UpdateStockAdjustmentRequest, user: User): Promise<StockAdjustmentResponse> {
        
        const updateRequest = Validation.validate(StockAdjustmentValidation.UPDATE, request)
        
        logger.info("===== Update stockadjustment data =====")
        logger.info(updateRequest)
        if(updateRequest.number) {
            const existdata = await prismaClient.stockAdjustment.count({
                where:{
                    number: updateRequest.number
                }
            })
    
            if(existdata == 0) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }
        }

        interface CountQtyResult {
            total_qty: string; // Assuming total_qty can be null
        }
        let total_quantity: number;

        const queryResult = await prismaClient.$queryRaw<CountQtyResult[]>`SELECT sum(qty) as total_qty FROM stockAdjustmentDetail LIMIT 1`
        if (queryResult.length > 0) {
            total_quantity = parseFloat(queryResult[0].total_qty)
        } else {
            total_quantity = 0
        }
        logger.info("TOTAL QUANTITY = " + total_quantity)

        const stockadjustment = {
            ...updateRequest, // Copy other fields from the original request
            total_qty: total_quantity,
            updated_at : Helper.dateTimeLocal(new Date()),
            updated_by : user.username,
        };
        logger.info('==== param stockadjustment update ====')
        logger.info(stockadjustment)
        const result = await prismaClient.stockAdjustment.update({ 
            where: {
                number: updateRequest.number
            },
            data: stockadjustment
        });

        return toStockAdjustmentResponse(result)
    }

    static async getByNumber(request: ByNumberRequest): Promise<StockAdjustmentResponse | null> {
        logger.info("===== Get stockadjustment by number =====")
        if(request.number) {
            const existdata = await prismaClient.stockAdjustment.findUnique({
                where:{
                    number: request.number
                },
                include : {
                    stockAdjustmentDetail: {
                        include: {
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

    static async delete(request: ByNumberRequest): Promise<StockAdjustmentResponse | null> {
        logger.info("===== Delete stockadjustment by number =====")
        logger.info(request.number)
        if(request.number) {

            const checkThisStockAdjustmentUsed = await prismaClient.stockAdjustmentDetails.findFirst({
                where:{
                    number: request.number
                }
            })
            
            if(checkThisStockAdjustmentUsed) {
                throw new ResponseError(400, "Can't delete data, please delete detail data first");
            }

            const existdata = await prismaClient.stockAdjustment.count({
                where:{
                    number: request.number
                }
            })

            if(existdata == 0) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }

            const result = await prismaClient.stockAdjustment.delete({
                where:{
                    number: request.number
                }
            })

            return result
    
        } else {
            throw new ResponseError(404, DATA_NOT_FOUND!);
        }
    }
}