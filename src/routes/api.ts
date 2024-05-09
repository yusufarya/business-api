import express from "express"
import { authMiddleware } from "../middleware/auth-middleware"
import { UserControler } from "../controller/user-controller"
import { UnitController } from "../controller/unit-controller"
import { CategoryController } from "../controller/category-controller"
import { BrandController } from "../controller/brand-controller"
import { BranchController } from "../controller/branch-controller"
export const apiRouter = express.Router()

apiRouter.use(authMiddleware)

// API USERS ROUTE //
apiRouter.get(process.env.GET_USER_CURRENT_PATH!, UserControler.get);
apiRouter.patch(process.env.UPDATE_USER_CURRENT_PATH!, UserControler.update);
apiRouter.delete(process.env.LOGOUT_USER_PATH!, UserControler.logout);

// API CATEGORIES ROUTE //
apiRouter.get(process.env.GET_ALL_CATEGORY_PATH!, CategoryController.get);
apiRouter.post(process.env.CREATE_CATEGORY_PATH!, CategoryController.create);
apiRouter.patch(process.env.UPDATE_CATEGORY_PATH!, CategoryController.update);
apiRouter.get(process.env.GET_CATEGORY_PATH!, CategoryController.getById);
apiRouter.delete(process.env.DELETE_CATEGORY_PATH!, CategoryController.delete);

// API UNITS ROUTE //
apiRouter.get(process.env.GET_ALL_UNIT_PATH!, UnitController.get);
apiRouter.post(process.env.CREATE_UNIT_PATH!, UnitController.create);
apiRouter.patch(process.env.UPDATE_UNIT_PATH!, UnitController.update);
apiRouter.get(process.env.GET_UNIT_PATH!, UnitController.getById);
apiRouter.delete(process.env.DELETE_UNIT_PATH!, UnitController.delete);

// API BRANDS ROUTE //
apiRouter.get(process.env.GET_ALL_BRAND_PATH!, BrandController.get);
apiRouter.post(process.env.CREATE_BRAND_PATH!, BrandController.create);
apiRouter.patch(process.env.UPDATE_BRAND_PATH!, BrandController.update);
apiRouter.get(process.env.GET_BRAND_PATH!, BrandController.getById);
apiRouter.delete(process.env.DELETE_BRAND_PATH!, BrandController.delete);

// API BRANCH ROUTE //
apiRouter.get(process.env.GET_ALL_BRANCH_PATH!, BranchController.get);
apiRouter.post(process.env.CREATE_BRANCH_PATH!, BranchController.create);
apiRouter.patch(process.env.UPDATE_BRANCH_PATH!, BranchController.update);
apiRouter.get(process.env.GET_BRANCH_PATH!, BranchController.getById);
apiRouter.delete(process.env.DELETE_BRANCH_PATH!, BranchController.delete);