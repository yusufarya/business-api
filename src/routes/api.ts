import express from "express"
import { authMiddleware } from "../middleware/auth-middleware"
import { UserControler } from "../controller/user-controller"
import { UnitController } from "../controller/unit-controller"
export const apiRouter = express.Router()

apiRouter.use(authMiddleware)

// API USER ROUTE //
apiRouter.get(process.env.GET_USER_CURRENT_PATH!, UserControler.get);
apiRouter.patch(process.env.UPDATE_USER_CURRENT_PATH!, UserControler.update);
apiRouter.delete(process.env.LOGOUT_USER_PATH!, UserControler.logout);

// API UNIT ROUTE //
apiRouter.get(process.env.GET_ALL_UNIT_PATH!, UnitController.get);
apiRouter.post(process.env.CREATE_UNIT_PATH!, UnitController.create);
apiRouter.patch(process.env.UPDATE_UNIT_PATH!, UnitController.update);
apiRouter.get(process.env.GET_UNIT_PATH!, UnitController.getById);
apiRouter.delete(process.env.DELETE_UNIT_PATH!, UnitController.delete);