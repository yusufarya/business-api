import express from "express"
import { authMiddleware } from "../middleware/auth-middleware"
import { UserControler } from "../controller/master/user-controller"
import { UnitController } from "../controller/master/unit-controller"
import { CategoryController } from "../controller/master/category-controller"
import { BrandController } from "../controller/master/brand-controller"
import { BranchController } from "../controller/master/branch-controller"
import { WarehouseController } from "../controller/master/warehouse-controller"
import { ProductController } from "../controller/master/product-controller"
import { StockAdjustmentController } from "../controller/transaction/stockadjustment-controller"
import { StockAdjustmentDetailController } from "../controller/transaction/stockadjustmentdetail-controller"
import { UploadImage } from "../middleware/upload-image"
import { ConversionUnitController } from "../controller/master/conversion-unit-controller"


export const apiRouter = express.Router()

apiRouter.use(authMiddleware)

// API USERS ROUTE //
apiRouter.get(process.env.GET_USER_CURRENT_PATH!, UserControler.get);
apiRouter.patch(process.env.UPDATE_USER_CURRENT_PATH!, UserControler.update);
apiRouter.delete(process.env.LOGOUT_USER_PATH!, UserControler.logout);

// API MASTER CATEGORIES ROUTE //
apiRouter.get(process.env.GET_ALL_CATEGORY_PATH!, CategoryController.get);
apiRouter.post(process.env.CREATE_CATEGORY_PATH!, CategoryController.create);
apiRouter.patch(process.env.UPDATE_CATEGORY_PATH!, CategoryController.update);
apiRouter.get(process.env.GET_CATEGORY_PATH!, CategoryController.getById);
apiRouter.delete(process.env.DELETE_CATEGORY_PATH!, CategoryController.delete);

// API MASTER UNITS ROUTE //
apiRouter.get(process.env.GET_ALL_UNIT_PATH!, UnitController.get);
apiRouter.post(process.env.CREATE_UNIT_PATH!, UnitController.create);
apiRouter.patch(process.env.UPDATE_UNIT_PATH!, UnitController.update);
apiRouter.get(process.env.GET_UNIT_PATH!, UnitController.getById);
apiRouter.delete(process.env.DELETE_UNIT_PATH!, UnitController.delete);

// API MASTER CONVERSION UNITS ROUTE //
apiRouter.get(process.env.GET_ALL_CONVERSION_UNIT_PATH!, ConversionUnitController.get);
apiRouter.post(process.env.CREATE_CONVERSION_UNIT_PATH!, ConversionUnitController.create);
apiRouter.patch(process.env.UPDATE_CONVERSION_UNIT_PATH!, ConversionUnitController.update);
apiRouter.get(process.env.GET_CONVERSION_UNIT_PATH!, ConversionUnitController.getById);
apiRouter.get(process.env.GET_BY_PRODUCT_CONVERSION_UNIT_PATH!, ConversionUnitController.getByProduct);
apiRouter.delete(process.env.DELETE_CONVERSION_UNIT_PATH!, ConversionUnitController.delete);

// API MASTER BRANDS ROUTE //
apiRouter.get(process.env.GET_ALL_BRAND_PATH!, BrandController.get);
apiRouter.post(process.env.CREATE_BRAND_PATH!, BrandController.create);
apiRouter.patch(process.env.UPDATE_BRAND_PATH!, BrandController.update);
apiRouter.get(process.env.GET_BRAND_PATH!, BrandController.getById);
apiRouter.delete(process.env.DELETE_BRAND_PATH!, BrandController.delete);

apiRouter.get(process.env.GET_ALL_PRODUCT_PATH!, ProductController.get);
apiRouter.post(process.env.CREATE_PRODUCT_PATH!, ProductController.create);
apiRouter.post(process.env.UPLOAD_IMG_PRODUCT_PATH!, UploadImage.uploadSingleProduct(), ProductController.upload);
apiRouter.patch(process.env.UPDATE_PRODUCT_PATH!, ProductController.update);
apiRouter.get(process.env.GET_PRODUCT_PATH!, ProductController.getById);
apiRouter.delete(process.env.DELETE_PRODUCT_PATH!, ProductController.delete);

// API MASTER BRANCH ROUTE //
apiRouter.get(process.env.GET_ALL_BRANCH_PATH!, BranchController.get);
apiRouter.post(process.env.CREATE_BRANCH_PATH!, BranchController.create);
apiRouter.patch(process.env.UPDATE_BRANCH_PATH!, BranchController.update);
apiRouter.get(process.env.GET_BRANCH_PATH!, BranchController.getById);
apiRouter.delete(process.env.DELETE_BRANCH_PATH!, BranchController.delete);

// API MASTER WAREHOUSES ROUTE //
apiRouter.get(process.env.GET_ALL_WAREHOUSE_PATH!, WarehouseController.get);
apiRouter.post(process.env.CREATE_WAREHOUSE_PATH!, WarehouseController.create);
apiRouter.patch(process.env.UPDATE_WAREHOUSE_PATH!, WarehouseController.update);
apiRouter.get(process.env.GET_WAREHOUSE_PATH!, WarehouseController.getById);
apiRouter.delete(process.env.DELETE_WAREHOUSE_PATH!, WarehouseController.delete);

// API TRANSACTION STOCK ADJUSTMENT ROUTE //
apiRouter.get(process.env.GET_ALL_STOCKADJUSTMENT_PATH!, StockAdjustmentController.get);
apiRouter.post(process.env.CREATE_STOCKADJUSTMENT_PATH!, StockAdjustmentController.create);
apiRouter.patch(process.env.UPDATE_STOCKADJUSTMENT_PATH!, StockAdjustmentController.update);
apiRouter.get(process.env.GET_STOCKADJUSTMENT_PATH!, StockAdjustmentController.getByNumber);
apiRouter.delete(process.env.DELETE_STOCKADJUSTMENT_PATH!, StockAdjustmentController.delete);

// API TRANSACTION STOCK ADJUSTMENT DETAIL ROUTE //
apiRouter.get(process.env.GET_ALL_STOCKADJUSTMENTDETAIL_PATH!, StockAdjustmentDetailController.get);
apiRouter.post(process.env.CREATE_STOCKADJUSTMENTDETAIL_PATH!, StockAdjustmentDetailController.create);
apiRouter.patch(process.env.UPDATE_STOCKADJUSTMENTDETAIL_PATH!, StockAdjustmentDetailController.update);
apiRouter.get(process.env.GET_STOCKADJUSTMENTDETAIL_PATH!, StockAdjustmentDetailController.getById);
apiRouter.delete(process.env.DELETE_STOCKADJUSTMENTDETAIL_PATH!, StockAdjustmentDetailController.delete);