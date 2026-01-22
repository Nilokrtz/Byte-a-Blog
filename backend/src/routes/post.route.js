import { Router } from "express";
import { createController, findAllController,topPostController,findByIdController, searchByTitleController, byUserController } from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const route = Router();

route.post("/", authMiddleware, createController);
route.get("/", authMiddleware, findAllController);
route.get("/top", topPostController);
route.get("/search", searchByTitleController);
route.get("/byUser", authMiddleware, byUserController);


route.get("/:id", authMiddleware, findByIdController);

export default route;