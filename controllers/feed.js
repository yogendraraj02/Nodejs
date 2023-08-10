const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  Post.find().then(posts=>{
    res.status(200).json({message : 'Fetched posts succesfully',posts : posts})
  }).catch((error)=>{
    if(!error.statusCode){
      error.statusCode = 500;
    }
    next(error);
  })
  
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed! Entered data is incorrect!");
    error.statusCode = 422;
    throw error;
  }
  if(!req.file){
    const error = new Error("File is missing");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  const image = req.file.path;
  const post = new Post({
    title: title,
    content: content,
    imageUrl : image,
    creator: { name: "Yogi" },
  });
  post.save().then((result)=>{
    res.status(201).json({
      message: "Post created successfully!",
      post: result,
    });
  }).catch((error)=>{
    if(!error.statusCode){
      error.statusCode = 500;
    }
    next(error);
  })
  
};


exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId).then(post=>{
    if(!post){
      const error = new Error("Could not find the post.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({message : 'Post fetched',post : post})
  }).catch((error)=>{
    if(!error.statusCode){
      error.statusCode = 500;
    }
    next(error);
  })
  
};
