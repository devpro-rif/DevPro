const express = require("express")
const { Posting_post, UpdatingPost, GetPost, AllPosts, DeletePost } = require("../controllers/postController")
const auth = require("../middleware/authMiddleware")
const routerPost = express.Router()

//Post views

//Post Actions

//get post route
 routerPost.get("/posting/:id_post",GetPost);
//get all posts

routerPost.get("/posts_all/all",AllPosts);

//create post route
routerPost.post("/posting/comunity/:id_community",auth,Posting_post);
//update post route
routerPost.put("/post_update/:id_post",auth,UpdatingPost);
//delete post
routerPost.delete("/posting/delete/:id_post",DeletePost);

module.exports=routerPost;