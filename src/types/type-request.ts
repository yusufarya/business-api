import { Branch, Brand, Category, Product, StockAdjustment, StockAdjustmentDetails, Unit, User, Warehouse } from "@prisma/client";
import { Request } from "express";

export interface UserRequest extends Request {
  user?: User;
}
export interface UnitRequest extends Request {
  unit?: Unit;
}
export interface CategoryRequest extends Request {
  category?: Category;
}
export interface BrandRequest extends Request {
  brand?: Brand;
}
export interface BranchRequest extends Request {
  branch?: Branch;
}
export interface WarehouseRequest extends Request {
  warehouse?: Warehouse;
}
export interface ProductRequest extends Request {
  product?: Product;
}
export interface StockAdjustmentRequest extends Request {
  stockAdjustment?: StockAdjustment;
}
export interface StockAdjustmentDetailRequest extends Request {
  stockAdjustmentDetail?: StockAdjustmentDetails;
}
