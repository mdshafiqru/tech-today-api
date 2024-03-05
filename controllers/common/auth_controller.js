
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {unlink} = require('fs');

const User = require('../../models/user');
const path = require('path');
const fs = require('fs');




const login = async (req, res) => {
    let {email, password} = req.body;
    
    try {
        const user = await User.findOne({ email, role: 'user' }).select('_id name email password phone avatar shortBio isDeleted createdAt');
    
        if(!user){
            return res.status(400).json({message:"No user found with this email", success: false});
        }
        else {
            let passwordValid = bcrypt.compareSync(password, user.password);

            if(passwordValid){

                let token = jwt.sign({userId: user.id, role: 'user'}, process.env.JWT_SECRET, {expiresIn : '7d'});

                user.password = undefined;
                return res.status(200).json({user, token});

            } else {
                return res.status(400).json({message:"Wrong Password", success: false});
            }
        }
    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}

const adminLogin = async (req, res) => {
    let {email, password} = req.body;
    
    try {
        const user = await User.findOne({ email, role: 'admin' }).select('_id name email password phone avatar shortBio isDeleted createdAt');
    
        if(!user){
            return res.status(400).json({message:"No user found with this email", success: false});
        }
        else {
            let passwordValid = bcrypt.compareSync(password, user.password);

            if(passwordValid){

                let token = jwt.sign({userId: user._id, role: 'admin' }, process.env.JWT_SECRET, {expiresIn : '7d'});

                user.password = undefined;
                return res.status(200).json({user, token});

            } else {
                return res.status(400).json({message:"Wrong Password", success: false});
            }
        }
    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}

const register = async (req, res) => {
    let {name, email, password} = req.body;

    try {
        const existingUser = await User.findOne({ email: email, role: 'user' });

        if(existingUser){
            return res.status(400).json({message: "User already exists with this email, try to login", success: false});
        } else {

            const salt = bcrypt.genSaltSync(10);
            let hashedPass = bcrypt.hashSync(password, salt);

            let user = await User.create({name, email, password: hashedPass});

            let token = jwt.sign({userId: user._id, role: 'user'}, process.env.JWT_SECRET, {expiresIn : '7d'});

            user.password = undefined;
            user.posts = undefined;
            user.likes = undefined;
            user.comments = undefined;
            user.replies = undefined;
            user.isDeleted = undefined;
            user.role = undefined;
            user.savedPosts = undefined;
            user.updatedAt = undefined;
            user.__v = undefined;

            return res.status(200).json({user, token});

        }

    } catch (error) {
        
        return res.status(500).json({message: error.message, success: false});
    }
}

const user = async (req, res) => {
    
    try {
        const user = await User.findOne({ _id: req.userId }).select('_id name phone email avatar shortBio createdAt postsCount posts').exec();

        if(user){

            user.postsCount = user.posts.length;
            user.posts = undefined;
            
            return res.status(200).json({user});
        }
        else {
            return res.status(401).json({message: "User not found", success: false});
        }

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}

const admin = async (req, res) => {
    
    try {
        const user = await User.findOne({ _id: req.userId }).select('name email avatar shortBio -_id').exec();

        if(user){
            return res.status(200).json(user);
        }
        else {
            return res.status(401).json({message: "Admin not found", success: false});
        }

    } catch (error) {
        return  res.status(500).json({message: error.message, success: false});
    }
}


const checkResetPass = async (req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email, role: 'user' });

        if(user){
            return res.status(200).json({message: 'User found', success: true});
        } else {
            return  res.status(400).json({message: "User not found with this email", success: false});
        }
        
    } catch (error) {
        return  res.status(500).json({message: error.message, success: false});
    }
}

// reset password for Not Logged in users
const resetPass = async (req, res) => {
    try {
        const {email, newPass} = req.body;

        const user = await User.findOne({ email, role: 'user' });

        if(user){

            const salt = bcrypt.genSaltSync(10);
            let hashedPass = bcrypt.hashSync(newPass, salt);

            user.password = hashedPass;

            await user.save();

            return  res.status(200).json({message: 'Password Updated Successfully! Login now.', success: true});

        } else {
            return  res.status(400).json({message: "User not found with this email", success: false});
        }
        
    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}

// update password for Logged in users

const updatePass = async (req, res) => {
    
    try {
        
        const {currentPass, newPass} = req.body;

        const user = await User.findOne({ _id: req.userId });

        if(user){
            
            let passwordValid = bcrypt.compareSync(currentPass, user.password);

            if(passwordValid){

                const salt = bcrypt.genSaltSync(10);
                let hashedPass = bcrypt.hashSync(newPass, salt);

                user.password = hashedPass;
                await user.save();

                return res.status(200).json({message: 'Password Updated Successfully!', success: true});

            } else {
                return res.status(400).json({message:"Current password not matched.", success: false});
            }

        }
        else {
            return res.status(401).json({message: "User not found", success: false});
        }

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}
const updateAdminPass = async (req, res) => {
    
    try {
        
        const {currentPass, newPass} = req.body;

        const admin = await User.findOne({ _id: req.userId });

        if(admin){
            
            let passwordValid = bcrypt.compareSync(currentPass, admin.password);

            if(passwordValid){

                const salt = bcrypt.genSaltSync(10);
                let hashedPass = bcrypt.hashSync(newPass, salt);

                admin.password = hashedPass;
                await admin.save();

                return res.status(200).json({message: 'Password Updated Successfully!', success: true});

            } else {
                return res.status(400).json({message:"Current password not matched.", success: false});
            }

        }
        else {
            return res.status(401).json({message: "Admin not found", success: false});
        }

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}

const updateProfile = async (req, res) => {
    
    try {
        
        const {name, phone, shortBio} = req.body;

        const user = await User.findOne({ _id: req.userId });

        if(user){

            user.name = name;
            user.phone = phone;
            user.shortBio = shortBio;
            await user.save();

            return res.status(200).json({message: 'Profile Updated Successfully!', success: true});
        }
        else {
            return res.status(401).json({message: "User not found", success: false});
        }

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}
const updateAdminProfile = async (req, res) => {
    
    try {
        
        const {name, phone, shortBio} = req.body;

        const admin = await User.findOne({ _id: req.userId });

        if(admin){

            admin.name = name;
            admin.phone = phone;
            admin.shortBio = shortBio;
            await admin.save();

            return res.status(200).json({message: 'Profile Updated Successfully!', success: true, data: admin});

        }
        else {
            return res.status(401).json({message: "Admin not found", success: false});
        }

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}

const updateProfilePhoto = async (req, res) => {
    const uploadedFile = req.files[0];

    if(!uploadedFile){
        return res.status(400).json({message: "File not uploaded", success: false});
        
    }

    try {
        const user = await User.findOne({ _id: req.userId });

        if(user){

            const existFilePath = `public/${user.avatar}`;

            if(fs.existsSync(existFilePath)){
                unlink(
                    existFilePath,
                    (err) =>  {
                        if(err){
                            console.log(err.message)
                        }
                    }
                );
            }

            const filePath = `uploads/avatars/${uploadedFile.filename}`;

            user.avatar = filePath
            await user.save();

            return res.status(200).json({message: "Profile Photo Updated", success: true, avatar: filePath});
        }
        else {
            return res.status(401).json({message: "User not found", success: false});
        }

    } catch (error) {

        if(req.files.length > 0){
            const {filename} = req.files[0];

            const filePath = `public/uploads/avatars/${filename}`;

            if(fs.existsSync(filePath)){
                unlink(
                    filePath,
                    (err) =>  {
                        if(err){
                            console.log(err.message)
                        }
                    }
                );
            }

        }
        
        return res.status(500).json({message: error.message, success: false});
    }
}


const updateAdminProfilePhoto = async (req, res) => {
    const uploadedFile = req.files[0];

    if(!uploadedFile){
        return res.status(400).json({message: "File not uploaded", success: false});
        return;
    }

    try {
        const admin = await User.findOne({ _id: req.userId });

        if(admin){

            const existFilePath = `public/${admin.avatar}`;

            if(fs.existsSync(existFilePath)){
                unlink(
                    existFilePath,
                    (err) =>  {
                        if(err){
                            console.log(err.message)
                        }
                    }
                );
            }

            const filePath = `uploads/avatars/${uploadedFile.filename}`;

            admin.avatar = filePath
            await admin.save();

            return res.status(200).json({message: "File uploaded", success: true, avatar: filePath});
        }
        else {
            return res.status(401).json({message: "Admin not found", success: false});
        }

    } catch (error) {

        if(req.files.length > 0){
            const {filename} = req.files[0];

            const filePath = `public/uploads/avatars/${filename}`;

            if(fs.existsSync(filePath)){
                unlink(
                    filePath,
                    (err) =>  {
                        if(err){
                            console.log(err.message)
                        }
                    }
                );
            }

        }
        
        return  res.status(500).json({message: error.message, success: false});
    }
}


module.exports = {
    user,
    admin,
    login,
    adminLogin,
    register,
    checkResetPass,
    resetPass,
    updatePass,
    updateProfile,
    updateAdminPass,
    updateAdminProfile,
    updateProfilePhoto,
    updateAdminProfilePhoto,
}