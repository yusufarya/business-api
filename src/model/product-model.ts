import { Product } from "@prisma/client";

export type ProductResponse = {
    id: number,
    category_id: number,
    unit_id: number,
    brand_id: number,
    barcode: string | null,
    name: string,
    min_stock: number | 0,
    max_stock: number | 0,
    purchase_price: number | 0,
    selling_price: number | 0,
    description?: string | null,
    created_at?: Date | null,
    created_by?: string | null,
    updated_at?: Date | null,
    updated_by?: string | null
}

export type CreateProductRequest = {
    category_id: number,
    unit_id: number,
    brand_id: number,
    name: string,
    barcode: string,
    min_stock: number,
    max_stock: number,
    purchase_price: number,
    selling_price: number,
    description?: string,
    created_at?: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string
}

export type UpdateProductRequest = {
    id: number,
    category_id?: number,
    unit_id?: number,
    brand_id?: number,
    name?: string,
    min_stock?: number,
    max_stock?: number,
    purchase_price?: number,
    selling_price?: number,
    barcode?: string,
    description?: string,
    created_at?: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string
}

export type ByIdRequest = {
    id: number
}

export function toProductResponse(product: Product): ProductResponse {
    return {
        id: product.id,
        name: product.name,
        category_id: product.category_id,
        unit_id: product.unit_id,
        brand_id: product.brand_id,
        barcode: product.barcode,
        min_stock: product.min_stock,
        max_stock: product.max_stock,
        purchase_price: product.purchase_price,
        selling_price: product.selling_price,
        description: product.description ?? null,
        created_at: product.created_at,
        created_by: product.created_by ?? null,
        updated_at: product.updated_at,
        updated_by: product.updated_by ?? null
    };
}