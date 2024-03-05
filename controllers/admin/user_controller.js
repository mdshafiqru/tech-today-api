const User = require("../../models/user");

const activeUsers = async (req, res) => {
    try {

        const users = await User.find({isBlocked: false, role: 'user'}).select('_id name email phone avatar shortBio posts createdAt').exec();

        users.forEach(user => {
            user.postsCount = user.posts.length;
            user.posts = undefined;
        });

        return res.status(200).json(users);
        
    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}

const blockedUsers = async (req, res) => {
    try {

        const users = await User.find({isBlocked: true, role: 'user'}).select('_id name email phone avatar shortBio posts createdAt blockedAt blockedReason').exec();

        users.forEach(user => {
            user.postsCount = user.posts.length;
            user.posts = undefined;
        });

        return res.status(200).json(users);
        
    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}

const blockUser = async (req, res) => {
    try {
        
        const {userId, blockedReason} = req.body;

        const user = await User.findOne({_id: userId, isBlocked: false});

        if(user){

            user.isBlocked = true;
            user.blockedReason = blockedReason;
            user.blockedAt = Date.now();
            await user.save();

            return res.status(200).json({message: 'User has been blocked successfully!', success: true});

        } else {
            return res.status(400).json({message: 'User not found or this user is already blocked', success: false});
        }

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}

const unblockUser = async (req, res) => {
    try {

        const user = await User.findOne({_id: req.params.userId, isBlocked: true});

        if(user){

            user.isBlocked = false;
            await user.save();
            return res.status(200).json({message: 'User has been un blocked successfully!', success: true});

        } else {
            return res.status(400).json({message: 'User not found or this user is already un blocked', success: false});
        }
        
    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}


module.exports = {
    activeUsers,
    blockedUsers,
    blockUser,
    unblockUser,
}