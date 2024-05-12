import { StockAdjustment } from "@prisma/client"

export type typeAdjust = "in" | "out";

export type StockAdjustmentResponse = {
    number: string,
    date: Date;
    type: typeAdjust,
    total_qty: number,
    branch_id: number,
    description?: string | null,
    created_at?: Date | null,
    created_by?: string | null,
    updated_at?: Date | null,
    updated_by?: string | null
}

export type CreateStockAdjustmentRequest = {
    number: string,
    date: Date;
    type: typeAdjust,
    total_qty: number,
    branch_id: number,
    description?: string,
    created_at?: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string
}

export type UpdateStockAdjustmentRequest = {
    number: string,
    date?: Date;
    type?: typeAdjust,
    total_qty?: number,
    branch_id?: number,
    description?: string,
    created_at?: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string
}

export type ByNumberRequest = {
    number: string
}

export function toStockAdjustmentResponse(stockAdjustment: StockAdjustment): StockAdjustmentResponse {
    return {
        number: stockAdjustment.number,
        date: stockAdjustment.date,
        type: stockAdjustment.type,
        total_qty: stockAdjustment.total_qty,
        branch_id: stockAdjustment.branch_id,
        description: stockAdjustment.description ?? null,
        created_at: stockAdjustment.created_at,
        created_by: stockAdjustment.created_by ?? null,
        updated_at: stockAdjustment.updated_at,
        updated_by: stockAdjustment.updated_by ?? null
    };
}