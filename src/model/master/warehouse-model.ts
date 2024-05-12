import { Warehouse } from "@prisma/client";

export type WarehouseResponse = {
    id: number,
    branch_id: number,
    name: string,
    phone: string,
    address?: string | null,
    description?: string | null,
    created_at?: Date | null,
    created_by?: string | null,
    updated_at?: Date | null,
    updated_by?: string | null
}

export type CreateWarehouseRequest = {
    branch_id: number,
    name: string,
    phone: string,
    address?: string,
    description?: string,
    created_at?: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string
}

export type UpdateWarehouseRequest = {
    id: number,
    branch_id?: number,
    name?: string,
    phone?: string,
    address?: string,
    description?: string,
    created_at?: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string
}

export type ByIdRequest = {
    id: number
}

export function toWarehouseResponse(warehouse: Warehouse): WarehouseResponse {
    return {
        id: warehouse.id,
        branch_id: warehouse.branch_id,
        name: warehouse.name,
        phone: warehouse.phone,
        address: warehouse.address ?? null,
        description: warehouse.description ?? null,
        created_at: warehouse.created_at,
        created_by: warehouse.created_by ?? null,
        updated_at: warehouse.updated_at,
        updated_by: warehouse.updated_by ?? null
    };
}