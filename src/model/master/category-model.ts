import { Category } from "@prisma/client";
import { Request } from "express";

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
    name_current: string,
    description?: string,
    created_at?: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string
}

export interface UploadImageRequest extends Request {
    file?: Express.Multer.File;
    body: {
        old_image?: string;
    };
}

export type ByIdRequest = {
    id: number
}

export function toCategoryResponse(category: Category): CategoryResponse {
    return {
        id: category.id,
        name: category.name,
        description: category.description ?? null,
        created_at: category.created_at,
        created_by: category.created_by ?? null,
        updated_at: category.updated_at,
        updated_by: category.updated_by ?? null
    };
}