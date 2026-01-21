import Post from "../models/Post.js";

const createService = (body) => Post.create(body);

const findAllService = (limit, offset) => Post.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user", "-password");

const countPosts = () => Post.countDocuments();

export {
  createService,
  findAllService,
  countPosts
};