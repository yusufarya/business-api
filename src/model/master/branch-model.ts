import { Branch } from "@prisma/client";

export type BranchResponse = {
    id: number,
    name: string,
    phone: string,
    address?: string | null,
    description?: string | null,
    created_at?: Date | null,
    created_by?: string | null,
    updated_at?: Date | null,
    updated_by?: string | null
}

export type CreateBranchRequest = {
    name: string,
    phone: string,
    address?: string,
    description?: string,
    created_at?: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string
}

export type UpdateBranchRequest = {
    id: number,
    name?: string,
    name_current: string,
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

export function toBranchResponse(brand: Branch): BranchResponse {
    return {
        id: brand.id,
        name: brand.name,
        phone: brand.phone,
        address: brand.address ?? null,
        description: brand.description ?? null,
        created_at: brand.created_at,
        created_by: brand.created_by ?? null,
        updated_at: brand.updated_at,
        updated_by: brand.updated_by ?? null
    };
}