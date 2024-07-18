import { Router } from "express";

const router: Router = Router();

import * as controller from "../controllers/task.controller";

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.post("/create", controller.create);

router.patch("/edit/:id", controller.edit);

router.delete("/delete/:id", controller.deleteTask); //! Ở đây hơi khác tí là nếu mà ghi mỗi delete ko thì nó lỗi vì thằng typescript sợ trùng với cái hàm delete trong js nên là để khác delete là được

export const taskRoutes: Router = router;
