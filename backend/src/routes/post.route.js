import { Router } from "express";
import { createController, findAllController,topPostController,findByIdController } from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const route = Router();

route.post("/", authMiddleware, createController);
route.get("/", authMiddleware, findAllController);
route.get("/top", topPostController);
route.get("/:id", findByIdController);

export default route;