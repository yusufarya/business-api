import { TransactionHistories } from "@prisma/client";

export type TransactionHistoriesResponse = {
    number: string | null,
    sequence: number,
    date: Date;
    product_id: number,
    branch_id: number,
    warehouse_id: number,
    qty: number,
    price: number,
    price_discount: number,
    percent_discount: number,
    created_at?: Date | null,
    created_by?: string | null,
    updated_at?: Date | null,
    updated_by?: string | null
}

export type CreateTransactionHistoriesRequest = {
    number: string,
    sequence: number,
    date: Date;
    qty: number,
    product_id: number,
    branch_id: number,
    warehouse_id: number,
    price: number | 0,
    price_discount: number | 0,
    percent_discount: number | 0,
    created_at?: Date | null,
    created_by?: string | null,
    updated_at?: Date | null,
    updated_by?: string | null
}

export type DeleteTransactionHistoriesRequest = {
    number: string,
    sequence: number,
    product_id: number,
    branch_id: number,
    warehouse_id: number,
}

export type UpdateTransactionHistoriesRequest = {
    id: number,
    number: string,
    sequence?: number,
    date?: Date;
    qty_current?: number,
    product_id?: number,
    branch_id?: number,
    warehouse_id?: number,
    qty?: number,
    price?: number,
    price_discount?: number,
    percent_discount?: number,
    created_at?: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string
}

export type ByIdRequest = {
    id: number
}

export function toTransactionHistoriesResponse(stockAdjustmentdetail: TransactionHistories): TransactionHistoriesResponse {
    return {
        number: stockAdjustmentdetail.number ?? null,
        sequence: stockAdjustmentdetail.sequence,
        date: stockAdjustmentdetail.date,
        product_id: stockAdjustmentdetail.product_id,
        branch_id: stockAdjustmentdetail.branch_id,
        warehouse_id: stockAdjustmentdetail.warehouse_id,
        qty: stockAdjustmentdetail.qty,
        price: stockAdjustmentdetail.price,
        price_discount: stockAdjustmentdetail.price_discount,
        percent_discount: stockAdjustmentdetail.percent_discount,
        created_at: stockAdjustmentdetail.created_at,
        created_by: stockAdjustmentdetail.created_by ?? null,
        updated_at: stockAdjustmentdetail.updated_at,
        updated_by: stockAdjustmentdetail.updated_by ?? null
    };
}