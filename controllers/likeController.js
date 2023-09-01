const Post = require("../models/postModel");
const Like= require("../models/likeModel");

//business logic
exports.likePost= async (req,res) =>{
    try{
        const {post,user} = req.body;
        const like= new Like({
            post,user,
        })
        const savedLike= await like.save();

        const updatedPost = await Post.findByIdAndUpdate(post,{$push:{likes: savedLike._id}}, {new: true})
        .populate("likes")
        .exec();

        res.json({
            post:updatedPost,
        })
    }
    catch(error){
            return res.status(500).json({
                error: "Error While  liking the post",
            });
    }
}
//unliking the post

exports.unlikePost = async (req,res)=>{
    try{
        const{post,like} = req.body;
        //find and delete like collection me se
        const deletedLike = await Like.findOneAndDelete({post:post, _id:like});

        //update the post collection
        const updatedPost = await Post.findByIdAndUpdate(post,{$pull:{likes:deletedLike._id}},{new:true});
        req.json({
            post: updatedPost,
        })
    }
    catch(error) {
        return res.status(500).json({
            error: "Error While unliking the post",
        });    
    }
}