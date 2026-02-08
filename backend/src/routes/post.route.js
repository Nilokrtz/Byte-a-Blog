import { Router } from "express";
import { createController, findAllController,topPostController,findByIdController, searchByTitleController, byUserController,updatePostController, deletePostController, likeNewsController, addCommentController, deleteCommentController } from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const route = Router();

route.post("/", authMiddleware, createController);
route.get("/", authMiddleware, findAllController);
route.get("/top", topPostController);
route.get("/search", searchByTitleController);
route.get("/byUser", authMiddleware, byUserController);
route.patch("/:id", authMiddleware, updatePostController);
route.delete("/:id", authMiddleware, deletePostController);
route.patch("/like/:id", authMiddleware, likeNewsController);
route.patch("/comment/:id", authMiddleware, addCommentController);
route.patch("/comment/:idPost/:idComment", authMiddleware, deleteCommentController);

route.get("/:id", authMiddleware, findByIdController);

export default route;