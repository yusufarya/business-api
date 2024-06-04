import { ConversionUnit } from "@prisma/client";

export type IsActive = "Y" | "N";

export type ConversionUnitResponse = {
    id: number,
    product_id: number,
    unit: string,
    conversion_unit: string,
    qty: number,
    conversion_qty: number,
    purchase_price: number,
    selling_price: number,
    created_at?: Date | null,
    created_by?: string | null,
    updated_at?: Date | null,
    updated_by?: string | null
}

export type CreateConversionUnitRequest = {
    product_id: number,
    unit: string,
    conversion_unit: string,
    qty: number,
    conversion_qty: number,
    purchase_price: number,
    created_at?: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string
}

export type UpdateConversionUnitRequest = {
    id: number,
    product_id: number,
    unit: string,
    conversion_unit: string,
    qty: number,
    conversion_qty: number,
    purchase_price: number,
    created_at?: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string
}

export type ByIdRequest = {
    id: number
}

export type ByProductRequest = {
    product_id: number
}

export function toConversionUnitResponse(conversionUnit: ConversionUnit): ConversionUnitResponse {
    return {
        id: conversionUnit.id,
        product_id: conversionUnit.product_id,
        unit: conversionUnit.unit,
        conversion_unit: conversionUnit.conversion_unit,
        qty: conversionUnit.qty,
        conversion_qty: conversionUnit.conversion_qty,
        purchase_price: conversionUnit.purchase_price,
        selling_price: conversionUnit.selling_price,
        created_at: conversionUnit.created_at,
        created_by: conversionUnit.created_by ?? null,
        updated_at: conversionUnit.updated_at,
        updated_by: conversionUnit.updated_by ?? null
    };
}