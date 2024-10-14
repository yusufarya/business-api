import { Branch, Brand, Category, ConversionUnit, InventoryStock, POSCart, Product, StockAdjustment, StockAdjustmentDetails, TransactionHistories, Unit, User, Warehouse, WarehouseTransfer, WarehouseTransferDetails } from "@prisma/client";
import { Request } from "express";

export interface UserRequest extends Request {
  user?: User;
}
export interface ConversionUnitRequest extends Request {
  conversionUnit?: ConversionUnit;
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
export interface InventoryStockRequest extends Request {
  inventoryStock?: InventoryStock;
}
export interface StockAdjustmentRequest extends Request {
  stockAdjustment?: StockAdjustment;
}
export interface StockAdjustmentDetailRequest extends Request {
  stockAdjustmentDetail?: StockAdjustmentDetails;
}
export interface WarehouseTransferRequest extends Request {
  stockAdjustment?: WarehouseTransfer;
}
export interface WarehouseTransferDetailRequest extends Request {
  stockAdjustmentDetail?: WarehouseTransferDetails;
}
export interface TransactionHistoriesRequest extends Request {
  transactionHistories?: TransactionHistories;
}
export interface PosCartRequest extends Request {
  posCart?: POSCart
}