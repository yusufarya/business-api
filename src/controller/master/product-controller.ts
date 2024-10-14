import { NextFunction, Request, Response, response } from "express";
import { ProductService } from "../../service/master/product-service";
import { logger } from "../../app/logging";
import { CreateProductRequest, UpdateProductRequest } from "../../model/master/product-model";
import { InventoryStockRequest, ProductRequest } from "../../types/type-request";


export class ProductController {

    // get all data
    static async get(req: Request, res: Response, next: NextFunction) {
        logger.info(" ====== get all product =====")
        try {
            const result = await ProductService.getAllData();
            res.status(200).json({
                data:result
            })
        } catch (error) {
            next(error)
        }
    }

    // create product
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const category_id: string | undefined = req.body.category_id as string;
            const unit_id: string | undefined = req.body.unit_id as string;
            const brand_id: string | undefined = req.body.brand_id as string;
            const min_stock: string | undefined = req.body.min_stock as string;
            const max_stock: string | undefined = req.body.max_stock as string;
            const purchase_price: string | undefined = req.body.purchase_price as string;
            const selling_price: string | undefined = req.body.selling_price as string;
            
            // Convert the ID to a number
            const categoryId: number | undefined = category_id ? parseInt(category_id) : undefined;
            const unitId: number | undefined = unit_id ? parseInt(unit_id) : undefined;
            const brandId: number | undefined = brand_id ? parseInt(brand_id) : undefined;
            const minStock: number | undefined = min_stock ? parseInt(min_stock) : undefined;
            const maxStock: number | undefined = max_stock ? parseInt(max_stock) : undefined;
            const purchasePrice: number | undefined = purchase_price ? parseInt(purchase_price) : undefined;
            const sellingPrice: number | undefined = selling_price ? parseInt(selling_price) : undefined;

            const requestBody = {
                ...req.body,
                category_id: categoryId,
                unit_id: unitId,
                brand_id: brandId,
                min_stock: minStock,
                max_stock: maxStock,
                purchase_price: purchasePrice,
                selling_price: sellingPrice,
            }

            const request: CreateProductRequest = requestBody as CreateProductRequest;
            const response = await ProductService.store(request, req.body);
            res.status(200).json({
                message: process.env.SUCCESS_ADD_DATA,
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    // update product
    static async update(req: ProductRequest, res: Response, next: NextFunction) {
        try {
            const id: string | undefined = req.body.id as string;
            const category_id: string | undefined = req.body.category_id as string;
            const unit_id: string | undefined = req.body.unit_id as string;
            const brand_id: string | undefined = req.body.brand_id as string;
            const min_stock: string | undefined = req.body.min_stock as string;
            const max_stock: string | undefined = req.body.max_stock as string;
            const purchase_price: string | undefined = req.body.purchase_price as string;
            const selling_price: string | undefined = req.body.selling_price as string;
            
            // Convert the ID to a number
            const idProduct: number | undefined = id ? parseInt(id) : undefined;
            const categoryId: number | undefined = category_id ? parseInt(category_id) : undefined;
            const unitId: number | undefined = unit_id ? parseInt(unit_id) : undefined;
            const brandId: number | undefined = brand_id ? parseInt(brand_id) : undefined;
            const minStock: number | undefined = min_stock ? parseInt(min_stock) : undefined;
            const maxStock: number | undefined = max_stock ? parseInt(max_stock) : undefined;
            const purchasePrice: number | undefined = purchase_price ? parseInt(purchase_price) : undefined;
            const sellingPrice: number | undefined = selling_price ? parseInt(selling_price) : undefined;

            const requestBody = {
                ...req.body,
                id: idProduct,
                category_id: categoryId,
                unit_id: unitId,
                brand_id: brandId,
                min_stock: minStock,
                max_stock: maxStock,
                purchase_price: purchasePrice,
                selling_price: sellingPrice,
            }

            const request: UpdateProductRequest = requestBody as UpdateProductRequest;
            const response = await ProductService.update(request, req.body);
            res.status(200).json({
                message: process.env.SUCCESS_UPDATE_DATA,
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    static async upload(req: Request, res: Response, next: NextFunction) {
        logger.info("===== Controller Upload image product =====")
        try {
            const response = await ProductService.upload(req);
            res.status(200).json({ 
                data: {message: 'Upload success', data : response}
            });
        } catch (error) {
            next(error);
        }
    }

    // get product by id
    static async getById(req: ProductRequest, res: Response, next: NextFunction) {
        try {
            // Extract the ID from query parameters
            const id: string | undefined = req.query.id as string;
            
            // Convert the ID to a number
            const numericId: number | undefined = id ? parseInt(id) : undefined;
            if (numericId !== undefined) {
                const response = await ProductService.getById({id: numericId});
                res.status(200).json({ data: response });
            } else {
                throw new Error('ID not provided');
            }
        } catch (error) {
            next(error);
        }
    }

    static async getStockProduct(req: InventoryStockRequest, res: Response, next: NextFunction) {
        try {
            // Extract the ID from query parameters
            const productId: string | undefined = req.query.product_id as string;
            const branchId: string | undefined = req.query.branch_id as string;
            const warehouseId: string | undefined = req.query.warehouse_id as string;
            
            // Convert the ID to a number
            const product_id: number | undefined = productId ? parseInt(productId) : undefined;
            const branch_id: number | undefined = branchId ? parseInt(branchId) : undefined;
            const warehouse_id: number | undefined = warehouseId ? parseInt(branchId) : undefined;

            const params = {
                product_id: product_id,
                branch_id: branch_id,
                warehouse_id: warehouse_id
            }
            
            if (product_id !== undefined && branch_id !== undefined && warehouse_id !== undefined) {
                const response = await ProductService.getStockProduct(params);
                res.status(200).json({ data: response });
            } else {
                throw new Error('ID not provided');
            }
        } catch (error) {
            next(error)
        }
    }
    
    // get product by id
    static async delete(req: ProductRequest, res: Response, next: NextFunction) {
        try {
            const response = await ProductService.delete(req.body);
            res.status(200).json({ data: process.env.SUCCESS_DELETE_DATA });
        } catch (error) {
            next(error);
        }
    }
}