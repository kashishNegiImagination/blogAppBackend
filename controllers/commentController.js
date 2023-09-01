const Post = require("../models/postModel");
const Comment= require("../models/commentModel");

//business logic
exports.createComment= async (req,res) =>{
    try{
        //fetch data from req body
        const {post,user,body} = req.body;

        //create a comment object
        const comment= new Comment({
            post,user,body
        })

        //save the new comment into the database //now chote wala comment jo bnaya hai obj
        const savedComment= await comment.save();

        //find the post by Id , and add the new comment to it's new comment array
        const updatedPost = await Post.findByIdAndUpdate(post,{$push:{comments: savedComment._id}}, {new: true})
        .populate("comments") //populate the comment array with comment documents
        .exec();

        res.json({
            post:updatedPost,
        })
    }
    catch(error){
            return res.status(500).json({
                error: "Error While Creating Comment",
            });
    }
}