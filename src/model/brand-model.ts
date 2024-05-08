import { Brand } from "@prisma/client";

export type BrandResponse = {
    id: number,
    name: string,
    description?: string | null,
    created_at?: Date | null,
    created_by?: string | null,
    updated_at?: Date | null,
    updated_by?: string | null
}

export type CreateBrandRequest = {
    name: string,
    description?: string,
    created_at?: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string
}

export type UpdateBrandRequest = {
    id: number,
    name?: string,
    description?: string,
    created_at?: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string
}

export type ByIdRequest = {
    id: number
}

export function toBrandResponse(brand: Brand): BrandResponse {
    return {
        id: brand.id,
        name: brand.name,
        description: brand.description ?? null,
        created_at: brand.created_at,
        created_by: brand.created_by ?? null,
        updated_at: brand.updated_at,
        updated_by: brand.updated_by ?? null
    };
}