import { Category } from "@prisma/client";

export type CategoryResponse = {
    id: number,
    name: string,
    description?: string | null,
    created_at?: Date | null,
    created_by?: string | null,
    updated_at?: Date | null,
    updated_by?: string | null
}

export type CreateCategoryRequest = {
    name: string,
    description?: string,
    created_at?: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string
}

export type UpdateCategoryRequest = {
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

export function toCategoryResponse(unit: Category): CategoryResponse {
    return {
        id: unit.id,
        name: unit.name,
        description: unit.description ?? null,
        created_at: unit.created_at,
        created_by: unit.created_by ?? null,
        updated_at: unit.updated_at,
        updated_by: unit.updated_by ?? null
    };
}