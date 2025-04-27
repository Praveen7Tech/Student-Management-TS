import { Router } from "express";
import userController from "../controllers/userController";
import auth from "../middlewares/auth"

let router = Router();

router.get("/",auth.userAuth,userController.home);
router.post("/logout",userController.logout)
router.get("/login",userController.getLogin);
router.post("/login",userController.login);
router.get('/signUp',userController.getSignUp)
router.post('/signup',userController.signup);
router.get('/edit/:id',auth.userAuth,userController.getEdit);
router.post('/edit/:id',auth.userAuth,userController.edit)

export default router;