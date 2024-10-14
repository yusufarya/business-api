import { TypeAdjust, User } from "@prisma/client";
import { prismaClient } from "../app/database";
import { logger } from "../app/logging";
import { InventoryStockRequest, InventoryStockResponse, toInventoryStockResponse } from "../model/master/inventory-stock-model";
import { CreateStockAdjustmentDetailsRequest, StockAdjustmentDetailsResponse } from "../model/transaction/stockadjustmentdetail-model";
import { CreateTransactionHistoriesRequest, DeleteTransactionHistoriesRequest } from "../model/transaction/transaction-histories-model";
import { CreateWarehouseTransferRequest } from "../model/transaction/warehousetransfer-model";
import { CreateWarehouseTransferDetailsRequest, WarehouseTransferDetailsResponse } from "../model/transaction/warehousetransferdetail-model";
import { Helper } from "./helper";
import { ResponseError } from "../error/response-error";

export class TransactionHelper {
    
    // CHECK STOCK PRODUCT INVENTORY //
    static async check_stock_product(headerRequest: CreateWarehouseTransferRequest, dataDetailRequest: CreateWarehouseTransferDetailsRequest): Promise<number | null> {
        const product_id = dataDetailRequest.product_id;
        const branch_id = headerRequest.branch_id;
        const warehouse_id = headerRequest.wh_from;

        const resultStock = await prismaClient.inventoryStock.findFirst({
            where: {
                product_id: product_id,
                branch_id: branch_id,
                warehouse_id: warehouse_id,
            }
        });

        return resultStock?.stock || null;
    }

    // STOCK ADJUSTMENT TRANSACTION //
    static async stock_SA(type: string, dataTransaction: CreateStockAdjustmentDetailsRequest, qty_current_in_table: number | undefined = 0) {
        
        const existsProduct = await prismaClient.inventoryStock.findFirst({
            where: {
                product_id: dataTransaction.product_id,
                warehouse_id: dataTransaction.warehouse_id,
                branch_id: dataTransaction.branch_id
            }
        })

        if(!existsProduct) {
            const insertStockProduct = await prismaClient.inventoryStock.create({
                data: {
                    product_id: dataTransaction.product_id,
                    branch_id: dataTransaction.branch_id,
                    warehouse_id: dataTransaction.warehouse_id,
                    debit: dataTransaction.qty,
                    stock: dataTransaction.qty,
                }
            })
            logger.info("Insert Stock Product : ")
            logger.info(insertStockProduct)
        } else {
            
            let stockUpdate = 0
            let qty = dataTransaction.qty - qty_current_in_table
            let stockCurrent = existsProduct.stock
            let debitCurrent = existsProduct.debit
            let creditCurrent = existsProduct.credit
            const updateBy = {
                id: existsProduct.id,
                product_id: dataTransaction.product_id,
                warehouse_id: dataTransaction.warehouse_id,
                branch_id: dataTransaction.branch_id
            }
            if(type == 'in') {
                stockUpdate = qty+stockCurrent
                let UpdateStockProduct = await prismaClient.inventoryStock.update({
                    where: updateBy,
                    data: {
                        debit: debitCurrent+qty,
                        stock: stockUpdate,
                    }
                })
                
                logger.info("Update Stock Product (IN) : ")
                logger.info('debitUpdate : '+ debitCurrent+qty)
                logger.info('qty_current_in_table : ' + qty_current_in_table)
                logger.info('quantity : '+ qty)
                logger.info('stockUpdate : '+ stockUpdate)
                logger.info(UpdateStockProduct)
            } else if(type == 'out') {
                stockUpdate = stockCurrent-qty
                let UpdateStockProduct = await prismaClient.inventoryStock.update({
                    where: updateBy,
                    data: {
                        credit: creditCurrent+qty,
                        stock: stockUpdate,
                    }
                })
                logger.info("Update Stock Product (OUT) : ")
                logger.info('creditUpdate : '+ creditCurrent+qty)
                logger.info('qty_current_in_table : ' + qty_current_in_table)
                logger.info('quantity : '+ qty)
                logger.info('stockUpdate : '+ stockUpdate)
                logger.info(UpdateStockProduct)
            }
        }
    }

    // DELETE STOCK ADJUSTMENT TRANSACTION //
    static async delete_stock_SA(type: string, dataTransaction: StockAdjustmentDetailsResponse) {
        const existsProduct = await prismaClient.inventoryStock.findFirst({
            where: {
                product_id: dataTransaction.product_id,
                warehouse_id: dataTransaction.warehouse_id,
                branch_id: dataTransaction.branch_id
            }
        })

        if(existsProduct) {
            let stockUpdate = 0
            let debitUpdate = 0
            let creditUpdate = 0
            let qty = dataTransaction.qty
            let debitCurrent = existsProduct.debit
            let creditCurrent = existsProduct.credit
            let stockCurrent = existsProduct.stock
            if(type == 'in') {
                stockUpdate = stockCurrent-qty
                debitUpdate = debitCurrent-qty
                let DeleteStockProduct = await prismaClient.inventoryStock.update({
                    where: {
                        id: existsProduct.id,
                        product_id: dataTransaction.product_id,
                        warehouse_id: dataTransaction.warehouse_id,
                        branch_id: dataTransaction.branch_id
                    },
                    data: {
                        debit: debitUpdate,
                        stock: stockUpdate,
                    }
                })
                logger.info("Delete Stock Product (IN) : ")
                logger.info(DeleteStockProduct)

            } else if(type == 'out') {
                stockUpdate = stockCurrent+qty
                creditUpdate = creditCurrent+qty
                let DeleteStockProduct = await prismaClient.inventoryStock.update({
                    where: {
                        id: existsProduct.id,
                        product_id: dataTransaction.product_id,
                        warehouse_id: dataTransaction.warehouse_id,
                        branch_id: dataTransaction.branch_id
                    },
                    data: {
                        credit: creditUpdate,
                        stock: stockUpdate,
                    }
                })

                logger.info("Delete Stock Product (OUT) : ")
                logger.info(DeleteStockProduct)
            }

        }
    }
    
    // WAREHOUSE TRANSFER TRANSACTION //
    static async stock_WH(tr_header: CreateWarehouseTransferRequest, dataTransaction: WarehouseTransferDetailsResponse, qty_current_in_table: number | undefined = 0) {
        logger.info('tr_header : ')
        logger.info(tr_header)
        const existsProduct_ware_from = await prismaClient.inventoryStock.findFirst({
            where: {
                product_id: dataTransaction.product_id,
                warehouse_id: tr_header.wh_from,
                branch_id: dataTransaction.branch_id
            }
        })
        
        const existsProduct_ware_to = await prismaClient.inventoryStock.findFirst({
            where: {
                product_id: dataTransaction.product_id,
                warehouse_id: tr_header.wh_to,
                branch_id: dataTransaction.branch_id
            }
        })
        logger.info("existsProduct_ware_to : ")
        logger.info(existsProduct_ware_to)
        // destination warehouse
        if(existsProduct_ware_to == null && existsProduct_ware_from != null) {
            const insertStockProduct = await prismaClient.inventoryStock.create({
                data: {
                    product_id: dataTransaction.product_id,
                    branch_id: dataTransaction.branch_id,
                    warehouse_id: tr_header.wh_to,
                    debit: dataTransaction.qty,
                    stock: dataTransaction.qty,
                }
            })
            logger.info("Insert Stock Product (WH IN) : ")
            logger.info(insertStockProduct)

            let stockUpdate = 0
            let qty = existsProduct_ware_from.stock - dataTransaction.qty 
            // let stockCurrent = existsProduct_ware_from.stock
            const updateBy = {
                id: existsProduct_ware_from.id,
                product_id: dataTransaction.product_id,
                warehouse_id: tr_header.wh_from,
                branch_id: dataTransaction.branch_id
            }
            if(tr_header.wh_from) {
                stockUpdate = qty
                let UpdateStockProduct = await prismaClient.inventoryStock.update({
                    where: updateBy,
                    data: {
                        credit: dataTransaction.qty,
                        stock: stockUpdate,
                    }
                })
                
                logger.info("Update Stock Product (WH OUT) : ")
                logger.info(UpdateStockProduct)
            }
            
        } else if(existsProduct_ware_to != null && existsProduct_ware_from != null) {
            
            let stockUpdate = 0
            let qty = dataTransaction.qty - qty_current_in_table
            if(tr_header.wh_from) {
                const updateBy = {
                    id: existsProduct_ware_from.id,
                    product_id: dataTransaction.product_id,
                    branch_id: dataTransaction.branch_id
                }
                let stockCurrent = existsProduct_ware_from.stock
                stockUpdate = stockCurrent-qty
                let creditUpdate = existsProduct_ware_from.credit+qty
                let UpdateStockProduct = await prismaClient.inventoryStock.update({
                    where: updateBy,
                    data: {
                        credit: creditUpdate,
                        stock: stockUpdate,
                    }
                })
                
                logger.info("Update Stock Product (IN) : ")
                logger.info('Credit update : '+ creditUpdate)
                logger.info('qty_current_in_table : ' + qty_current_in_table)
                logger.info('quantity : '+ qty)
                logger.info('stockUpdate : '+ stockUpdate)
                logger.info(UpdateStockProduct)
            }
            if(tr_header.wh_to) {
                const updateBy = {
                    id: existsProduct_ware_to.id,
                    product_id: dataTransaction.product_id,
                    branch_id: dataTransaction.branch_id
                }
                let stockCurrent = existsProduct_ware_to.stock
                stockUpdate = stockCurrent+qty
                let debitUpdate = existsProduct_ware_to.debit+qty
                let UpdateStockProduct = await prismaClient.inventoryStock.update({
                    where: updateBy,
                    data: {
                        debit: debitUpdate,
                        stock: stockUpdate,
                    }
                })
                logger.info("Update Stock Product (OUT) : ")
                logger.info('qty_current_in_table : ' + qty_current_in_table)
                logger.info('Debit update : '+ debitUpdate)
                logger.info('quantity : '+ qty)
                logger.info('stockUpdate : '+ stockUpdate)
                logger.info(UpdateStockProduct)
            }
        }
    }

    // DELETE WAREHOUSE TRANSFER TRANSACTION //
    static async delete_stock_WH(tr_header: CreateWarehouseTransferRequest, dataTransaction: WarehouseTransferDetailsResponse) {
        
        const existsProduct_ware_from = await prismaClient.inventoryStock.findFirst({
            where: {
                product_id: dataTransaction.product_id,
                warehouse_id: tr_header.wh_from,
                branch_id: dataTransaction.branch_id
            }
        })
        
        const existsProduct_ware_to = await prismaClient.inventoryStock.findFirst({
            where: {
                product_id: dataTransaction.product_id,
                warehouse_id: tr_header.wh_to,
                branch_id: dataTransaction.branch_id
            }
        })
        logger.info("existsProduct_ware_to : ")
        logger.info(existsProduct_ware_to)

        let stockUpdate = 0
        let debitUpdate = 0
        let creditUpdate = 0
        let qty = dataTransaction.qty
        if(existsProduct_ware_from) {
            let debitCurrent = existsProduct_ware_from.debit
            let creditCurrent = existsProduct_ware_from.credit
            let stockCurrent = existsProduct_ware_from.stock
            if(tr_header.wh_from) {
                stockUpdate = stockCurrent+qty
                creditUpdate = creditCurrent-qty
                let UpdateStockProduct = await prismaClient.inventoryStock.update({
                    where: {
                        id: existsProduct_ware_from.id,
                        product_id: dataTransaction.product_id,
                        branch_id: dataTransaction.branch_id,
                        warehouse_id: tr_header.wh_from
                    },
                    data: {
                        credit: creditUpdate,
                        stock: stockUpdate,
                    }
                })
                logger.info("Update Stock Product From (Warehouse) : ")
                logger.info(UpdateStockProduct)

            }
        }
        
        if(existsProduct_ware_to) {
            let debitCurrent = existsProduct_ware_to.debit
            let creditCurrent = existsProduct_ware_to.credit
            let stockCurrent = existsProduct_ware_to.stock

            if(tr_header.wh_to) {
                stockUpdate = stockCurrent-qty
                debitUpdate = debitCurrent-qty
                let UpdateStockProduct = await prismaClient.inventoryStock.update({
                    where: {
                        id: existsProduct_ware_to.id,
                        product_id: dataTransaction.product_id,
                        branch_id: dataTransaction.branch_id,
                        warehouse_id: tr_header.wh_to
                    },
                    data: {
                        debit: debitUpdate,
                        stock: stockUpdate,
                    }
                })
    
                logger.info("Update Stock Product To (Warehouse) : ")
                logger.info(UpdateStockProduct)
            }
        }
    }

    // TRANSACTION HISTORIES TRANSFER //
    static async tr_histories_SA(type: TypeAdjust, dataRequestTrxSA: CreateStockAdjustmentDetailsRequest) {
        logger.info("Params Transaction Histories : ")
        logger.info(dataRequestTrxSA)
        
        const existsProductInTrx = await prismaClient.transactionHistories.findFirst({
            where: {
                number: dataRequestTrxSA.number,
                sequence: dataRequestTrxSA.sequence,
                product_id: dataRequestTrxSA.product_id,
                warehouse_id: dataRequestTrxSA.warehouse_id,
                branch_id: dataRequestTrxSA.branch_id
            }
        })

        if(!existsProductInTrx) {
            const insertTrxHistoriesProduct = await prismaClient.transactionHistories.create({
                data: {
                    number: dataRequestTrxSA.number,
                    sequence: dataRequestTrxSA.sequence,
                    date: dataRequestTrxSA.date,
                    product_id: dataRequestTrxSA.product_id,
                    branch_id: dataRequestTrxSA.branch_id,
                    warehouse_id: dataRequestTrxSA.warehouse_id,
                    type: type,
                    qty: dataRequestTrxSA.qty,
                    created_at : dataRequestTrxSA.created_at,
                    created_by : dataRequestTrxSA.created_by
                }
            })
            logger.info("Insert Transaction Histories For Stock Adjusment : ")
            logger.info(insertTrxHistoriesProduct)
        } else {
            const updateTrxHistoriesProduct = await prismaClient.transactionHistories.update({
                where: {
                    id: existsProductInTrx.id,
                    number: dataRequestTrxSA.number,
                    sequence: dataRequestTrxSA.sequence,
                    product_id: dataRequestTrxSA.product_id,
                    warehouse_id: dataRequestTrxSA.warehouse_id,
                    branch_id: dataRequestTrxSA.branch_id
                },
                data: {
                    type:type,
                    qty: dataRequestTrxSA.qty,
                    updated_at : dataRequestTrxSA.updated_at,
                    updated_by : dataRequestTrxSA.updated_by
                }
            })
            logger.info("Update Transaction Histories For Stock Adjusment : ")
            logger.info(updateTrxHistoriesProduct)
        }
    }

    // WAREHOUSE TRANSFER TRANSACTION HISTORIES //
    static async tr_histories_WH(tr_header: CreateWarehouseTransferRequest, dataRequestTrxWH: WarehouseTransferDetailsResponse) {
        logger.info('tr_header : ')
        logger.info(tr_header)
        const exists_trx_ware_from = await prismaClient.transactionHistories.findFirst({
            where: {
                number: dataRequestTrxWH.number,
                sequence: dataRequestTrxWH.sequence,
                product_id: dataRequestTrxWH.product_id,
                warehouse_id: tr_header.wh_from,
                branch_id: dataRequestTrxWH.branch_id
            }
        })
        logger.info("Exists trx ware from : ")
        logger.info(exists_trx_ware_from)
        
        if(exists_trx_ware_from == null) {
            const insertWHTransactionOut = await prismaClient.transactionHistories.create({
                data: {
                    number: dataRequestTrxWH.number,
                    sequence: dataRequestTrxWH.sequence,
                    date: dataRequestTrxWH.date,
                    product_id: dataRequestTrxWH.product_id,
                    branch_id: dataRequestTrxWH.branch_id,
                    warehouse_id: tr_header.wh_from,
                    qty: dataRequestTrxWH.qty,
                    created_at : dataRequestTrxWH.created_at,
                    created_by : dataRequestTrxWH.created_by,
                    type: 'out'
                }
            })
            logger.info("Insert Transaction Histories WH Transfer (OUT) : ")
            logger.info(insertWHTransactionOut)

        } else {
            
            let qty = dataRequestTrxWH.qty
            const updateBy = {
                id: exists_trx_ware_from.id,
                product_id: dataRequestTrxWH.product_id,
                branch_id: dataRequestTrxWH.branch_id,
                warehouse_id: tr_header.wh_from
            }

            let UpdateWHTransactionOut = await prismaClient.transactionHistories.update({
                where: updateBy,
                data: {
                    qty: qty,
                    updated_at : dataRequestTrxWH.updated_at,
                    updated_by : dataRequestTrxWH.updated_by,
                    type: 'out'
                }
            })
            
            logger.info("Update Tansaction Histories WH transfer (OUT) : ")
            logger.info('Qty update : '+ qty)
            logger.info(UpdateWHTransactionOut)
        }

        const exists_trx_ware_to = await prismaClient.transactionHistories.findFirst({
            where: {
                number: dataRequestTrxWH.number,
                sequence: dataRequestTrxWH.sequence,
                product_id: dataRequestTrxWH.product_id,
                warehouse_id: tr_header.wh_to,
                branch_id: dataRequestTrxWH.branch_id
            }
        })
        logger.info("exists_trx_ware_to : ")
        logger.info(exists_trx_ware_to)
        
        if(exists_trx_ware_to == null) {
            const insertWHTransactionIn = await prismaClient.transactionHistories.create({
                data: {
                    number: dataRequestTrxWH.number,
                    sequence: dataRequestTrxWH.sequence,
                    date: dataRequestTrxWH.date,
                    product_id: dataRequestTrxWH.product_id,
                    branch_id: dataRequestTrxWH.branch_id,
                    warehouse_id: tr_header.wh_to,
                    qty: dataRequestTrxWH.qty,
                    created_at : dataRequestTrxWH.created_at,
                    created_by : dataRequestTrxWH.created_by,
                    type: 'in'
                }
            })
            logger.info("Insert Transaction Histories WH Transfer (IN) : ")
            logger.info(insertWHTransactionIn)
            
        } else {
            
            let qty = dataRequestTrxWH.qty
            const updateBy = {
                id: exists_trx_ware_to.id,
                product_id: dataRequestTrxWH.product_id,
                branch_id: dataRequestTrxWH.branch_id,
                warehouse_id: tr_header.wh_to
            }

            let UpdateWHTransactionIn = await prismaClient.transactionHistories.update({
                where: updateBy,
                data: {
                    qty: qty,
                    updated_at : dataRequestTrxWH.updated_at,
                    updated_by : dataRequestTrxWH.updated_by,
                    type: 'in'
                }
            })
            
            logger.info("Update Tansaction Histories WH transfer (IN) : ")
            logger.info('Qty update : '+ qty)
            logger.info(UpdateWHTransactionIn)
        }
    }

    // DELETE TRANSACTION HISTORIES TRANSFER SA //
    static async delete_tr_histories(dataRequestTrxWH: DeleteTransactionHistoriesRequest) {
        
        const existsProductInTrx = await prismaClient.transactionHistories.findFirst({
            where: {
                number: dataRequestTrxWH.number,
                sequence: dataRequestTrxWH.sequence,
                product_id: dataRequestTrxWH.product_id,
                warehouse_id: dataRequestTrxWH.warehouse_id,
                branch_id: dataRequestTrxWH.branch_id
            }
        })

        if(!existsProductInTrx) {
            throw new ResponseError(404, process.env.DATA_NOT_FOUND!)
        }

        const result = await prismaClient.transactionHistories.delete({
            where: {
                id: existsProductInTrx.id
            }
        })

        if(result) {
            logger.info('Delete transaction histories success')
        } else {
            logger.info('Delete transaction histories failed')
        }
    }
}