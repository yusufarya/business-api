import env from "dotenv";
import { User } from "@prisma/client";
import { CreateWarehouseTransferDetailsRequest, WarehouseTransferDetailsResponse, UpdateWarehouseTransferDetailsRequest, toWarehouseTransferDetailsResponse } from "../../model/transaction/warehousetransferdetail-model";
import { Validation } from "../../validation/master/validation";
import { WarehouseTransferDetailValidation } from "../../validation/transaction/warehousetransferdetail-validation";
import { prismaClient } from "../../app/database";
import { ResponseError } from "../../error/response-error";
import { Helper } from "../../utils/helper";
import { TransactionHelper } from "../../utils/transaction-helper";
import { CreateWarehouseTransferRequest } from "../../model/transaction/warehousetransfer-model";
import { logger } from "../../app/logging";
import { ByIdRequest } from "../../model/master/unit-model";
import { InventoryStock } from "../inventory/inventory-stock-service";

env.config();

const DATA_NOT_FOUND = process.env.DATA_NOT_FOUND;
const STOCK_NOT_EXISTS = process.env.STOCK_NOT_EXISTS;

export class WarehouseTransferDetailService {

    static async getAllData(): Promise<WarehouseTransferDetailsResponse[]> {
        const result = await prismaClient.warehouseTransferDetails.findMany({
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
                }
            }
        })

        return result
    }

    static async store(request: CreateWarehouseTransferDetailsRequest, user: User): Promise<WarehouseTransferDetailsResponse> {
        logger.info("===== Store warehouse transfer detail =====")
        const dataDetailRequest = Validation.validate(WarehouseTransferDetailValidation.STORE, request)

        const checkTransHeader = await prismaClient.warehouseTransfer.findFirst({
            where: {
                number : dataDetailRequest.number
            }
        })
        
        interface MaxNumberResult {
            incrementSeq: number | null; // Assuming number_tr can be null
        }

        const queryResult = await prismaClient.$queryRaw<MaxNumberResult[]>`SELECT max(sequence) as incrementSeq FROM warehouse_transfer_detail LIMIT 1`
        logger.info("===================== CHECK DATA WH DETAIL =====================")
        if (queryResult.length > 0 && queryResult[0].incrementSeq !== null) {
            var incrementSeq = queryResult[0].incrementSeq+1
        } else {
            var incrementSeq = 1
        }

        if(!checkTransHeader) {
            throw new ResponseError(404, DATA_NOT_FOUND!)
        }

        logger.info("get data header ")
        logger.info(checkTransHeader)
        const headerRequest: CreateWarehouseTransferRequest = checkTransHeader as CreateWarehouseTransferRequest;
        
        const checkStockExists = await TransactionHelper.check_stock_product(headerRequest, dataDetailRequest)
        
        if (checkStockExists === null || checkStockExists === 0) {
            throw new ResponseError(404, STOCK_NOT_EXISTS!)
        } else if(checkStockExists > 0) {
            const notMinusStock = checkStockExists - dataDetailRequest.qty
            if(notMinusStock < 0) {
                throw new ResponseError(404, `${checkStockExists} left in stock`)
            }
        }

        const WH_DETAIL_PARAMS = {
            ...dataDetailRequest,
            sequence: incrementSeq,
            created_at : Helper.dateTimeLocal(new Date()),
            created_by : user.username
        }

        const result = await prismaClient.warehouseTransferDetails.create({ 
            data: WH_DETAIL_PARAMS
        });
        
        const WH_DETAIL_PARAMS_UPDATE = {
            ...result,
            created_at : Helper.dateTimeLocal(new Date()),
            created_by : user.username
        }

        TransactionHelper.stock_WH(headerRequest, result)
        TransactionHelper.tr_histories_WH(headerRequest, WH_DETAIL_PARAMS_UPDATE)
        
        return toWarehouseTransferDetailsResponse(result)
    }

    static async getById(request: ByIdRequest): Promise<WarehouseTransferDetailsResponse | null> {
        logger.info("===== Get warehouse transfer detail by id =====")
        logger.info(request.id)
        if(request.id) {
            const existdata = await prismaClient.warehouseTransferDetails.findUnique({
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
    
    static async update(request: UpdateWarehouseTransferDetailsRequest, user: User): Promise<WarehouseTransferDetailsResponse> {
        logger.info("===== Update warehouse transfer detail =====")
        logger.info(request)
        const dataDetailRequest = Validation.validate(WarehouseTransferDetailValidation.UPDATE, request)

        const checkTransHeader = await prismaClient.warehouseTransfer.findFirst({
            where: {
                number : dataDetailRequest.number
            }
        })

        if(!checkTransHeader) {
            throw new ResponseError(404, DATA_NOT_FOUND!)
        }
        logger.info("get data header ")
        logger.info(checkTransHeader)
        const headerRequest: CreateWarehouseTransferRequest = checkTransHeader as CreateWarehouseTransferRequest;

        const WH_DETAIL_PARAMS = {
            ...dataDetailRequest,
            updated_at : Helper.dateTimeLocal(new Date()),
            updated_by : user.username
        }

        const currentData = await prismaClient.warehouseTransferDetails.findFirst({
            where: {
                id: WH_DETAIL_PARAMS.id,
                number: WH_DETAIL_PARAMS.number
            }
        })

        const params = {
            product_id : dataDetailRequest.product_id || 0,
            warehouse_id : headerRequest.wh_from || 0,
            branch_id : headerRequest.branch_id || 0
        }
        logger.info('params : ')
        logger.info(params)
        let qtyRequest = dataDetailRequest.qty || 0
        let qty_current_edit = currentData?.qty || 0

        const stock = await InventoryStock.getStockProduct(params);
        var calculateStock = stock - (qtyRequest - qty_current_edit)
        
        logger.info('stock : ' + stock)
        logger.info('qtyRequest : ' + qtyRequest)
        logger.info('qty_current_edit : ' + qty_current_edit)
        logger.info('calculateStock : ' + calculateStock)
        
        if (calculateStock === null || calculateStock < 0) {
            throw new ResponseError(404, STOCK_NOT_EXISTS!);
        }

        const result = await prismaClient.warehouseTransferDetails.update({
            where: {
                id: WH_DETAIL_PARAMS.id,
                number: WH_DETAIL_PARAMS.number
            },
            data: WH_DETAIL_PARAMS
        });
            
        const WH_DETAIL_PARAMS_UPDATE = {
            ...result,
            updated_at : Helper.dateTimeLocal(new Date()),
            updated_by : user.username
        }

        TransactionHelper.stock_WH(headerRequest, result, currentData?.qty)
        TransactionHelper.tr_histories_WH(headerRequest, WH_DETAIL_PARAMS_UPDATE)
        
        return toWarehouseTransferDetailsResponse(result)
    }

    static async delete(request: ByIdRequest): Promise<WarehouseTransferDetailsResponse> {
        logger.info("===== Delete warehouse Transfer Details by id =====")
        logger.info(request.id)
        if(request.id) {

            const currentData = await prismaClient.warehouseTransferDetails.findFirst({
                where:{
                    id: request.id
                }
            })

            if(!currentData) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }

            const checkTransHeader = await prismaClient.warehouseTransfer.findFirst({
                where: {
                    number : currentData.number
                }
            })

            const headerRequest: CreateWarehouseTransferRequest = checkTransHeader as CreateWarehouseTransferRequest;
            logger.info('Warehouse header data :', headerRequest)

            const result = await prismaClient.warehouseTransferDetails.delete({
                where:{
                    id: request.id
                }
            })

            const paramsDeleteWareIn = {
                ...result,
                warehouse_id: headerRequest.wh_from
            }
            const paramsDeleteWareTo = {
                ...result,
                warehouse_id: headerRequest.wh_to
            }

            TransactionHelper.delete_stock_WH(headerRequest, currentData)
            TransactionHelper.delete_tr_histories(paramsDeleteWareIn)
            TransactionHelper.delete_tr_histories(paramsDeleteWareTo)
            return result
    
        } else {
            throw new ResponseError(404, DATA_NOT_FOUND!);
        }
    }
}