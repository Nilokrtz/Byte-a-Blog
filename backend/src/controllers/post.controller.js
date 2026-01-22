import { createService, findAllService, countPosts, topPostService, findByIdService} from "../services/post.service.js";

const createController = async (req, res) => {
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

const findAllController = async (req, res) => {
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

const topPostController = async (req, res) => {
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

const findByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await findByIdService(id);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    res.send({
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
}

export { createController, findAllController, topPostController, findByIdController};
