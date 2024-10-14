import { WarehouseTransfer } from "@prisma/client"

export type typeAdjust = "in" | "out";

export type WarehouseTransferResponse = {
    number: string,
    date: Date;
    wh_from: number,
    wh_to: number,
    total_qty: number,
    branch_id: number,
    description?: string | null,
    created_at?: Date | null,
    created_by?: string | null,
    updated_at?: Date | null,
    updated_by?: string | null
}

export type CreateWarehouseTransferRequest = {
    number: string,
    date: Date;
    wh_from: number,
    wh_to: number,
    total_qty: number,
    branch_id: number,
    description?: string,
    created_at?: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string
}

export type UpdateWarehouseTransferRequest = {
    number: string,
    date?: Date;
    wh_from?: number,
    wh_to?: number,
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

export function toWarehouseTransferResponse(whTransfer: WarehouseTransfer): WarehouseTransferResponse {
    return {
        number: whTransfer.number,
        date: whTransfer.date,
        wh_from: whTransfer.wh_from,
        wh_to: whTransfer.wh_to,
        total_qty: whTransfer.total_qty,
        branch_id: whTransfer.branch_id,
        description: whTransfer.description ?? null,
        created_at: whTransfer.created_at,
        created_by: whTransfer.created_by ?? null,
        updated_at: whTransfer.updated_at,
        updated_by: whTransfer.updated_by ?? null
    };
}