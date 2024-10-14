import { prismaClient } from "../../app/database";

export class InventoryStock {

    // Define the parameter type inside the class
    static async getStockProduct(params: { product_id: number; warehouse_id: number; branch_id: number }): Promise<number> {
        const existsProduct = await prismaClient.inventoryStock.findFirst({
            where: {
                product_id: params.product_id,
                warehouse_id: params.warehouse_id,
                branch_id: params.branch_id,
            },
        });

        return existsProduct?.stock || 0;
    }
}
