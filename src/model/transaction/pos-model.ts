import { POSCart } from "@prisma/client";

export type POSCartResponse = {
    id: number,
    product_id?: number | null,
    branch_id?: number | null,
    warehouse_id?: number | null,
    unit?: string | null,
    qty?: number | null,
    username?: string | null,
};

export type POSCartRequest = {
    id?: number,
    product_id: number,
    branch_id: number,
    warehouse_id: number,
    unit?: string,
    qty?: number,
    username?: string,
};

export type ByIdRequestCart = {
  id: number;
};

export function toPOSCartResponse(posCart: POSCart): POSCartResponse {
  return {
    id: posCart.id,
    product_id: posCart.product_id,
    branch_id: posCart.branch_id,
    warehouse_id: posCart.warehouse_id,
    unit: posCart.unit,
    qty: posCart.qty,
    username: posCart.username,
  };
}
