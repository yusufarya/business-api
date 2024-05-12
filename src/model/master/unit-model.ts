import { Unit } from "@prisma/client";

enum StatusActive {
    Y = "Y",
    N = "N",
}

export type IsActive = "Y" | "N";

export type UnitResponse = {
    id: number,
    initial: string,
    name: string,
    description?: string | null,
    is_active: string,
    created_at?: Date | null,
    created_by?: string | null,
    updated_at?: Date | null,
    updated_by?: string | null
}

export type CreateUnitRequest = {
    initial: string,
    name: string,
    description?: string,
    is_active: StatusActive,
    created_at?: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string
}

export type UpdateUnitRequest = {
    id: number,
    initial_current?: string,
    initial?: string,
    name?: string,
    description?: string,
    is_active: IsActive,
    created_at?: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string
}

export type ByIdRequest = {
    id: number
}

export function toUnitResponse(unit: Unit): UnitResponse {
    return {
        id: unit.id,
        initial: unit.initial,
        name: unit.name,
        description: unit.description ?? null,
        is_active: unit.is_active,
        created_at: unit.created_at,
        created_by: unit.created_by ?? null,
        updated_at: unit.updated_at,
        updated_by: unit.updated_by ?? null
    };
}