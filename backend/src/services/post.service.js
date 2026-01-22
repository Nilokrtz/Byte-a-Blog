import Post from "../models/Post.js";

export const createService = (body) => Post.create(body);

export const findAllService = (limit, offset) => Post.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user", "-password");

export const countPosts = () => Post.countDocuments();

export const topPostService = () => Post.findOne().sort({ _id: -1 }).populate("user");

export const findByIdService = (id) => Post.findById(id).populate("user");