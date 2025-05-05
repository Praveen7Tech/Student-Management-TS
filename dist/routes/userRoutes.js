"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const auth_1 = __importDefault(require("../middlewares/auth"));
let router = (0, express_1.Router)();
router.get("/", auth_1.default.userAuth, userController_1.default.home);
router.post("/logout", userController_1.default.logout);
router.get("/login", userController_1.default.getLogin);
router.post("/login", auth_1.default.userAuth, userController_1.default.login);
router.get('/signUp', auth_1.default.userAuth, userController_1.default.getSignUp);
router.post('/signup', auth_1.default.userAuth, userController_1.default.signup);
router.get('/edit/:id', auth_1.default.userAuth, userController_1.default.getEdit);
router.post('/edit/:id', auth_1.default.userAuth, userController_1.default.edit);
exports.default = router;
