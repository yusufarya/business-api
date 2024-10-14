import env from "dotenv";
import { WarehouseTransfer, User } from "@prisma/client";
import { CreateWarehouseTransferRequest, WarehouseTransferResponse, UpdateWarehouseTransferRequest, toWarehouseTransferResponse } from "../../model/transaction/warehousetransfer-model";
import { prismaClient } from "../../app/database";
import { Validation } from "../../validation/master/validation";
import { WarehouseTransferValidation } from "../../validation/transaction/warehousetransfer-validation";
import { logger } from "../../app/logging";
import { ResponseError } from "../../error/response-error";
import { Helper } from "../../utils/helper";
import { ByNumberRequest } from "../../model/transaction/warehousetransfer-model";
import { number } from "zod";

env.config();

const DATA_NOT_FOUND = process.env.DATA_NOT_FOUND;

export class WarehouseTransferService {
    
    static async getAllData(): Promise<WarehouseTransfer[]> {
        const result = await prismaClient.warehouseTransfer.findMany({
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

    static async store(request: CreateWarehouseTransferRequest, user: User): Promise<WarehouseTransferResponse> {
        
        interface MaxNumberResult {
            number_tr: string | null; // Assuming number_tr can be null
        }
        
        const get_no_transaction = Helper.generateNoTransaction()

        const queryResult = await prismaClient.$queryRaw<MaxNumberResult[]>`SELECT max(number) as number_tr FROM warehouse_transfer LIMIT 1`
        logger.info("===================== CHECK DATA WH =====================")
        if (queryResult.length > 0 && queryResult[0].number_tr !== null) {
            var number_tr = queryResult[0].number_tr
            const lastThreeDigits = parseInt(number_tr.slice(-4), 10); // Extract and parse the last three digits
            const incrementedDigits = (lastThreeDigits + 1).toString().padStart(4, '0'); // Increment and pad to three digits
            var noTransaction = `WH${get_no_transaction}${incrementedDigits}`
        } else {
            var noTransaction = `WH${get_no_transaction}0001`
        }
        
        logger.info("===== Store warehouse transfer Data =====")

        logger.info("NUMBER TRANSACTION = "+ noTransaction)
        logger.info(request)
        const warehousetransferRequest = Validation.validate(WarehouseTransferValidation.STORE, request)
        
        const SA_PARAMS = {
            ...warehousetransferRequest, // Copy other fields from the original request
            number: noTransaction,
            created_at : Helper.dateTimeLocal(new Date()),
            created_by : user.username
        };
        logger.info(SA_PARAMS)

        warehousetransferRequest.created_at = Helper.dateTimeLocal(new Date());
        warehousetransferRequest.created_by = user.username;
        
        const result = await prismaClient.warehouseTransfer.create({ 
            data: SA_PARAMS
        });

        return toWarehouseTransferResponse(result)
    }

    static async update(request: UpdateWarehouseTransferRequest, user: User): Promise<WarehouseTransferResponse> {
        
        const updateRequest = Validation.validate(WarehouseTransferValidation.UPDATE, request)
        
        logger.info("===== Update warehousetransfer data =====")
        logger.info(updateRequest)
        if(updateRequest.number) {
            const existdata = await prismaClient.warehouseTransfer.count({
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

        const queryResult = await prismaClient.$queryRaw<CountQtyResult[]>`SELECT IFNULL(SUM(qty), 0) as total_qty FROM warehouse_transfer_detail WHERE number = ${updateRequest.number} group by number`
        if (queryResult.length > 0) {
            total_quantity = parseFloat(queryResult[0].total_qty)
        } else {
            total_quantity = 0
        }
        logger.info("TOTAL QUANTITY = " + total_quantity)

        const warehousetransfer = {
            ...updateRequest, // Copy other fields from the original request
            total_qty: total_quantity,
            updated_at : Helper.dateTimeLocal(new Date()),
            updated_by : user.username,
        };
        logger.info('==== param warehousetransfer update ====')
        logger.info(warehousetransfer)
        const result = await prismaClient.warehouseTransfer.update({ 
            where: {
                number: updateRequest.number
            },
            data: warehousetransfer
        });

        return toWarehouseTransferResponse(result)
    }

    static async getByNumber(request: ByNumberRequest): Promise<WarehouseTransferResponse | null> {
        logger.info("===== Get warehousetransfer by number =====")
        logger.info(request.number)
        if(request.number) {
            const existdata = await prismaClient.warehouseTransfer.findUnique({
                where:{
                    number: request.number
                },
                include : {
                    warehouseTransferDetails: {
                        include: {
                            product: {
                                select: {
                                    id: true,
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

    static async delete(request: ByNumberRequest): Promise<WarehouseTransferResponse | null> {
        logger.info("===== Delete warehouse transfer by number =====")
        logger.info(request.number)
        if(request.number) {

            const checkThisWarehouseTransferUsed = await prismaClient.warehouseTransferDetails.findFirst({
                where:{
                    number: request.number
                }
            })
            
            if(checkThisWarehouseTransferUsed) {
                throw new ResponseError(400, "Can't delete data, please delete detail data first");
            }

            const existdata = await prismaClient.warehouseTransfer.count({
                where:{
                    number: request.number
                }
            })

            if(existdata == 0) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }

            const result = await prismaClient.warehouseTransfer.delete({
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