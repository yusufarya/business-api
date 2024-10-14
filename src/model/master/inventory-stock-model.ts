import { InventoryStock } from "@prisma/client";

export type InventoryStockResponse = {
    id: number
    product_id: number,
    branch_id: number,
    warehouse_id: number,
    debit: number,
    credit: number,
    stock: number,
}

export type InventoryStockRequest = {
    id: number
    product_id: number,
    branch_id: number,
    warehouse_id: number,
    debit: number,
    credit: number,
    stock: number,
}

export type getStockRequest = {
    id: number
}

export function toInventoryStockResponse(inventoryStock: InventoryStock) {
    return {
        id: inventoryStock.id,
        product_id : inventoryStock.product_id,
        branch_id : inventoryStock.branch_id,
        warehouse_id : inventoryStock.warehouse_id,
        debit : inventoryStock.debit,
        credit : inventoryStock.credit,
        stock : inventoryStock.stock,
    }
}