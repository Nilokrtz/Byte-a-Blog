import { createService, findAllService, countPosts, topPostService, findByIdService, searchByTitleService, byUserService, updatePostService, deletePostService, likeNewsService, deleteLikeNewsService, addCommentService, deleteCommentService} from "../services/post.service.js";

export const createController = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    console.log(req);

    if (!title || !content || !image) {
      res.status(400).send("Submit all required fields");
    }

    await createService({
      title,
      content,
      image,
      user: req.userId,
    });

    res.status(201).send({ message: "Post created successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const findAllController = async (req, res) => {
  try {
    let {limit, offset} = req.query;
    limit = Number(limit);
    offset = Number(offset);

    if (!limit) limit = 5;
    if (!offset) offset = 0;

    const posts = await findAllService(limit, offset);
    const total = await countPosts();
    const currentUrl = req.baseUrl;

    const next = offset + limit;
    const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl = previous !== null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null;

    if (posts.length === 0) {
      return res.status(404).send({ message: "There are no posts" });
    }

    res.send({
      nextUrl,
      previousUrl,
      limit,
      offset,
      total,
      
      results: posts.map((postItem) => ({
        id: postItem._id,
        title: postItem.title,
        content: postItem.content,
        image: postItem.image,
        likes: postItem.likes,
        comments: postItem.comments,
        name: postItem.user.name,
        username: postItem.user.username,
        userAvatar: postItem.user.avatar
      }))
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const topPostController = async (req, res) => {
  try {

  const top = await topPostService();

  if(!top){
    return res.status(400).send({ message: "There is no registered post" });
  }

  res.send({
    topPost: {
      id: top._id,
      title: top.title,
      content: top.content,
      image: top.image,
      likes: top.likes,
      comments: top.comments,
      name: top.user.name,
      username: top.user.username,
      userAvatar: top.user.avatar
    }
  })

  } catch (error) {
    res.status(500).send({ message: error.message });
  }

};

export const findByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await findByIdService(id);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    return res.send({
      id: post._id,
      title: post.title,
      content: post.content,
      image: post.image,
      likes: post.likes,
      comments: post.comments,
      name: post.user.name,
      username: post.user.username,
      userAvatar: post.user.avatar
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const searchByTitleController = async (req, res) => {
  try {
    const { title } = req.query;

    const posts = await searchByTitleService(title);

    if (posts.length === 0) {
      return res.status(400).send({ message: "No posts found with this title" });
    }

    return res.send({
      results: posts.map((post) => ({
        id: post._id,
        title: post.title,
        content: post.content,
        image: post.image,
        likes: post.likes,
        comments: post.comments,
        name: post.user.name,
        username: post.user.username,
        userAvatar: post.user.avatar
      }))
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const byUserController = async (req, res) => {
  try {
    const userId = req.userId;

    const posts = await byUserService(userId);

    return res.send({
      results: posts.map((post) => ({
        id: post._id,
        title: post.title,
        content: post.content,
        image: post.image,
        likes: post.likes,
        comments: post.comments,
        name: post.user.name,
        username: post.user.username,
        userAvatar: post.user.avatar
      }))
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const updatePostController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image } = req.body;

    if (!title && !content && !image) {
      return res.status(400).send({ message: "Submit at least one field to update the post" });
    }

    const post = await findByIdService(id);

    if(post.user._id.toString() !== req.userId){
      return res.status(400).send({ message: "You don't have permission to update this post" });
    }

    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    await updatePostService(id, title, content, image);

    return res.send({ message: "Post updated successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await findByIdService(id);

    if(post.user._id.toString() !== req.userId){
      return res.status(400).send({ message: "You didn't delete this post" });
    }
    await deletePostService(id);

    return res.send({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const likeNewsController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const newsLiked = await likeNewsService(id, userId);

    if(!newsLiked){
      await deleteLikeNewsService(id, userId);
      return  res.status(200).send({ message: "Like removed successfully" });
    }

    console.log(newsLiked);

    res.status(200).send({ message: "News liked successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const addCommentController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { comment } = req.body;

    if(!comment){
      return res.status(400).send({ message: "Submit the comment to add it to the post" });
    }
    
    await addCommentService(id, comment, userId);

    res.send({ message: "Comment added successfully" });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const deleteCommentController = async (req, res) => {
   try {
    const { idPost, idComment } = req.params;
    const userId = req.userId;
    
    const deletedComment = await deleteCommentService(idPost, idComment, userId);

    const commentFinder = deletedComment.comments.find((comment) => comment.idComment === idComment);

    if(commentFinder.userId !== userId){
      return res.status(400).send({ message: "You don't have permission to delete this comment" });
    }

    res.send({ message: "Comment deleted successfully" });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};