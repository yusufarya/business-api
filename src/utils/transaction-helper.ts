import { prismaClient } from "../app/database";
import { logger } from "../app/logging";
import { StockAdjustmentDetailsResponse } from "../model/transaction/stockadjustmentdetail-model";

export class TransactionHelper {
    static async stock_SA(type: string, dataTransaction: StockAdjustmentDetailsResponse) {
        
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
                    stock: dataTransaction.qty,
                }
            })
            logger.info("Insert Stock Product : ")
            logger.info(insertStockProduct)
        } else {
            
            let stockUpdate = 0
            if(type == 'in') {
                let qty = dataTransaction.qty
                let stockCurrent = existsProduct.stock
                stockUpdate = qty+stockCurrent
            } else if(type == 'out') {
                let qty = dataTransaction.qty
                let stockCurrent = existsProduct.stock
                stockUpdate = stockCurrent-qty
            }

            const UpdateStockProduct = await prismaClient.inventoryStock.update({
                where: {
                    id: existsProduct.id,
                    product_id: dataTransaction.product_id,
                    warehouse_id: dataTransaction.warehouse_id,
                    branch_id: dataTransaction.branch_id
                },
                data: {
                    stock: stockUpdate,
                }
            })
            logger.info("Update Stock Product : ")
            logger.info(UpdateStockProduct)
        }
    }

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
            if(type == 'in') {
                let qty = dataTransaction.qty
                let stockCurrent = existsProduct.stock
                stockUpdate = qty-stockCurrent
            } else if(type == 'out') {
                let qty = dataTransaction.qty
                let stockCurrent = existsProduct.stock
                stockUpdate = stockCurrent+qty
            }

            const DeleteStockProduct = await prismaClient.inventoryStock.update({
                where: {
                    id: existsProduct.id,
                    product_id: dataTransaction.product_id,
                    warehouse_id: dataTransaction.warehouse_id,
                    branch_id: dataTransaction.branch_id
                },
                data: {
                    stock: stockUpdate,
                }
            })
            logger.info("Delete Stock Product : ")
            logger.info(DeleteStockProduct)
        }
    }
}