import { WarehouseTransferDetails } from "@prisma/client"

export type WarehouseTransferDetailsResponse = {
    number: string,
    sequence: number,
    date: Date;
    qty: number,
    product_id: number,
    branch_id: number,
    created_at?: Date | null,
    created_by?: string | null,
    updated_at?: Date | null,
    updated_by?: string | null
}

export type CreateWarehouseTransferDetailsRequest = {
    number: string,
    sequence: number,
    date: Date;
    qty: number,
    product_id: number,
    branch_id: number,
    created_at?: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string
}

export type UpdateWarehouseTransferDetailsRequest = {
    id: number,
    number: string,
    sequence?: number,
    date?: Date;
    qty?: number,
    qty_current?: number,
    product_id?: number,
    branch_id?: number,
    created_at?: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string
}

export type ByIdRequest = {
    id: number
}

export function toWarehouseTransferDetailsResponse(stockAdjustmentdetail: WarehouseTransferDetails): WarehouseTransferDetailsResponse {
    return {
        number: stockAdjustmentdetail.number,
        sequence: stockAdjustmentdetail.sequence,
        date: stockAdjustmentdetail.date,
        qty: stockAdjustmentdetail.qty,
        product_id: stockAdjustmentdetail.product_id,
        branch_id: stockAdjustmentdetail.branch_id,
        created_at: stockAdjustmentdetail.created_at,
        created_by: stockAdjustmentdetail.created_by ?? null,
        updated_at: stockAdjustmentdetail.updated_at,
        updated_by: stockAdjustmentdetail.updated_by ?? null
    };
}