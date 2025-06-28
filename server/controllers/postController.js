const db=require('../database/index');
const User=db.User;
const Post=db.Post;
const Community=db.Community;

//Post views

//Post actions


//create post
const Posting_post= async(req,res)=>{
    const user_id= req.user.id;
    const community_id=req.params.id_community;

    const this_user=await User.findByPk(user_id);
    const this_community=await Community.findByPk(community_id);
    console.log("testing ida :",this_community.id);
    const {content}=req.body;
    if(!this_user){
        return res.status(404).json({ message: "User not found." });
    }
    else if(!this_community){
        return res.status(404).json({ message: "Community not found." });
    }
    else{
      
            if (!content) {
                return res.status(400).json({ message: "Post content is required." });
              }
            try{
              console.log(this_community)
                const this_post=await Post.create({
                content:content,
                UserId:user_id,
                CommunityId: this_community.id,
            });
            console.log("testing id :",this_community.id);
                res.status(201).json({
                  message: "Posted successfully",
                  post: {
                    id:this_post.id,
                    content:this_post.content,
                    createdAt:this_post.createdAt,
                    updatedAt:this_post.updatedAt,
                    UserId:this_post.UserId,
                    CommunityId:this_community.id,
                  },
                });
              } catch (error) {
                console.error("Error during posting:", error);
                res.status(500).json({ message: "Server error." });
              }
        
    }
}
//update Post
const UpdatingPost=async(req,res)=>{
    const post_id=req.params.id_post;
    const this_post=await Post.findByPk(post_id);
    const {content}=req.body;
    if(!this_post){
        return res.status(404).json({ message: "Post not found." });
    }
    else{
        if(this_post)
        {
               try{
                    this_post.content = content;
                    const post_post=await this_post.save();

                    res.status(200).json({
                    message: "Post updated successfully",
                        post: {
                            id:post_post.id,
                            content:post_post.content,
                            createdAt:post_post.createdAt,
                            updatedAt:post_post.updatedAt,
                            UserId:post_post.UserId,
                            CommunityId:post_post.CommunityId,
        
                        }
                    });
                } catch (error) {
                    console.error("Error updating Post:", error);
                    res.status(500).json({ message: "Server error." });
                }
            
        }
    }
}
// get Post

const GetPost= async(req,res)=>{
    const post_id=req.params.id_post;
    //console.log(`Post of ${post_id}`);
    const this_post=await Post.findByPk(post_id);
    if(!this_post){
         return res.status(404).json({ message: "Post not found." });
    }
    else{
       return res.status(200).json({
                    message: "Post:",
                        post: {
                        id:this_post.id,
                        content:this_post.content,
                        createdAt:this_post.createdAt,
                        updatedAt:this_post.updatedAt,
                        UserId:this_post.UserId,
                        CommunityId:this_post.CommunityId,
                    
                        }
        });
    }

} 
    
//get all posts

const AllPosts= async(req,res)=>{
    const this_posts=await Post.findAll();
    //console.log("errr posts all =>");
    //res.send("all posts");
console.log("`/////////////////////`",this_posts);

    if(!this_posts){
         return res.status(404).json({ message: "Posts not found." });
    }
    else{
       return res.status(200).json({
                    message: "Posts:",    
                   this_posts
        });
    }

}

//delete Post
const DeletePost= async(req,res)=>{
    const post_id=req.params.id_post;
    const this_post=await Post.findByPk(post_id);
    if(!this_post){
         return res.status(404).json({ message: "Post not found." });
    }
    else{
            try{
                 this_post.destroy();
                 res.status(200).json({message: "Post Deleted"});
            }
            catch (error) {
                console.error("Error updating Post:", error);
                res.status(500).json({ message: "Server error." });
            }
        
    }

}
    

module.exports={
    Posting_post,
    UpdatingPost,
    GetPost,
    AllPosts,
    DeletePost
}