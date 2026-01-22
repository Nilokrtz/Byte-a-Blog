import Post from "../models/Post.js";

export const createService = (body) => Post.create(body);

export const findAllService = (limit, offset) => Post.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user", "-password");

export const countPosts = () => Post.countDocuments();

export const topPostService = () => Post.findOne().sort({ _id: -1 }).populate("user");

export const findByIdService = (id) => Post.findById(id).populate("user");

export const searchByTitleService = (title) => Post.find({
  title: { $regex: `${title || ""}`, $options: "i" }
 }).sort({ _id: -1 }).populate("user");

export const byUserService = (id) => Post.find({ user: id }).sort({ _id: -1 }).populate("user");

export const updatePostService = (id, title, content, image) => Post.findOneAndUpdate(
  { _id: id },
  { title, content, image },
  { rawResult: true }
);