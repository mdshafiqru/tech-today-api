const User = require('../../models/user');
const Post = require('../../models/post');
const Comment = require('../../models/comment');
const Reply = require('../../models/reply');




const likeUnlike = async (req, res) => {
    try {
        
        const postId = req.params.postId;

        const post = await Post.findOne({ _id: postId });

        if(!post){
            return  res.status(400).json({message: "Post not found!", success: false});
            
        }

        const alreadyLiked = post.likes.includes(req.userId);

        let isLiked = false;

        if(alreadyLiked){
            post.likes.remove(req.userId);
            isLiked = false;

        } else {
            post.likes.push(req.userId);
            isLiked = true;

        }

        await post.save();

        const likeCount = post.likes.length;

        return res.status(200).json({message: "like status", success: true, data: {isLiked, likeCount}});

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}

const createComment = async (req, res) => {
    const {text, postId} = req.body;

    try {

        const post = await Post.findOne({_id: postId});

        if(!post){
            return res.status(400).json({message: "Post not found!", success: false});
        }

        const user = await User.findOne({_id: req.userId});

        if(!user){
            return res.status(401).json({message: "User not found!", success: false});
           
        }

        const comment = await Comment.create({text, post: postId, user: req.userId});

        post.comments.push(comment._id);
        await post.save();

        user.comments.push(comment._id);
        await user.save();

        const commentCount = post.comments.length;

        const newComment = await Comment.findOne({_id: comment._id }).select('-post -updatedAt -__v').populate('user', 'name avatar _id').exec();

        newComment.replyCount = newComment.replies.length;
        newComment.replies = undefined;
        
        res.status(200).json({message: 'comment inserted', success: true, data: {comment: newComment, commentCount}});


    } catch (error) {
        res.status(500).json({message: error.message, success: false});
    }

}

const getComments = async (req, res) => {

    try {

        const post = await Post.findOne({_id: req.params.postId});

        if(!post){
            return res.status(400).json({message: "post not found", success: false });
        }

        const comments = await Comment.find({post: req.params.postId }).select('-post -updatedAt -__v').populate('user', 'name avatar _id role').exec();

        comments.forEach(comment => {
            comment.replyCount = comment.replies.length;
            comment.replies = undefined;
        });

        res.status(200).json(comments);
        
    } catch (error) {
        res.status(500).json({message: error.message, success: false });
    }

}

const deleteComment = async (req, res) => {
    try {

        const comment = await Comment.findOne({_id: req.params.commentId});

        if(!comment){
            return res.status(400).json({message: 'comment not found', success: false });
        }
        
       
        const user = await User.findOne({_id: req.userId});

        if(user.role === 'user'){
            if(comment.user != req.userId){
                return res.status(400).json({message: 'You dont have permission to delete this comment', success: false });
            }
        }

        const post = await Post.findOne({_id: comment.post});
        const commentUser = await User.findOne({_id: comment.user});

        if(commentUser && post){

            commentUser.comments.remove(comment._id);
            await commentUser.save();

            post.comments.remove(comment._id);
            await post.save();

            // delete replies
            const replies = await Reply.find({comment: comment._id});

            replies.forEach(async (reply) => {

                const replyUser = await User.findOne({_id: reply.user});

                replyUser.replies.remove(reply._id);
                await replyUser.save();
            
                await reply.deleteOne({_id: reply._id});

            });


            // delete comment
            await Comment.deleteOne({_id: comment._id});

            return res.status(200).json({message: 'comment deleted', success: true });

        } else {
           return res.status(400).json({message: 'failed to delete', success: false });
        }

           
        
    } catch (error) {
       return res.status(500).json({message: error.message, success: false });
    }
}

const createReply = async (req, res) => {
    const {text, commentId} = req.body;

    try {
        
        const comment = await Comment.findOne({_id: commentId});

        if(!comment){
            return res.status(400).json({message: "Comment not found!", success: false});
        }

        const user = await User.findOne({_id: req.userId});

        if(!user){
            return res.status(401).json({message: "User not found!", success: false});
        }

        const reply = await Reply.create({text, comment: commentId, user: req.userId});

        comment.replies.push(reply._id);
        await comment.save();

        user.replies.push(reply._id);
        await user.save();

        const replyCount = comment.replies.length;

        const newReply = await Reply.findOne({_id: reply._id }).select('-comment -updatedAt -__v').populate('user', 'name avatar _id').exec();

      
       return res.status(200).json({message: 'reply inserted', success: true, data: {reply: newReply, replyCount}});

    } catch (error) {
       return  res.status(500).json({message: error.message, success: false });
    }
}

const getReplies = async (req, res) => {

    try {

        const comment = await Comment.findOne({_id: req.params.commentId});

        if(!comment){
            return res.status(400).json({message: "comment not found", success: false });
        }

        const replies = await Reply.find({comment: req.params.commentId }).select('-comment -updatedAt -__v').populate('user', 'name avatar _id role').exec();

       return res.status(200).json(replies);
        
    } catch (error) {
        return res.status(500).json({message: error.message, success: false });
    }

}

const deleteReply = async (req, res) => {
    try {

        const reply = await Reply.findOne({_id: req.params.replyId});

        if(!reply){
            return res.status(400).json({message: 'reply not found', success: false });
        }

        const user = await User.findOne({_id: req.userId});

        if(user.role === 'user'){

            if(reply.user != req.userId){
                return res.status(400).json({message: 'You dont have permission to delete this reply', success: false });
            }
        }


        const replyUser = await User.findOne({_id: reply.user});
        const comment = await Comment.findOne({_id: reply.comment});

        if(replyUser && comment){

            replyUser.replies.remove(reply._id);
            await replyUser.save();

            comment.replies.remove(reply._id);
            await comment.save();

            await reply.deleteOne({_id: reply._id});

            return res.status(200).json({message: 'reply deleted', success: true });

        } else {
            return res.status(400).json({message: 'failed to delete', success: false });
        }
        
    } catch (error) {
        return res.status(500).json({message: error.message, success: false });
    }
}

module.exports = {
    likeUnlike,
    createComment,
    getComments,
    deleteComment,
    createReply,
    getReplies,
    deleteReply,
}