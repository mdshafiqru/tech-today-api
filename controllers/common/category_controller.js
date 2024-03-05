const Category = require("../../models/category");
const Post = require("../../models/post");

const createCategory = async (req, res) => {
    try {

        const { name } = req.body;

        const existingCategory = await Category.findOne({ name });

        if(existingCategory) {
            return res.status(400).json({message: 'Category already exists with this name', success: false});
        }
        else {
            await Category.create({ name });
            return res.status(200).json({message: 'Category created successfully!', success: true});
        }

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}

const getCategories = async (req, res) => {
    try {
        
        const categories = await Category.find({name: { $ne: 'Uncategorized' }, isActive: true}).select('_id name postCount').sort({name: 'asc'});

        for (let i = 0; i < categories.length; i++) {
            const cat = categories[i];

            const posts = await Post.find({category: cat._id});
            cat.postCount = posts.length;
        }

        return res.status(200).json(categories);

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}

const editCategory = async (req, res) => {
    try {
        //categoryId

        const cat = await Category.findOne({_id: req.params.categoryId});

        if(cat){

            const { name, isActive } = req.body;

            cat.name = name;
            cat.isActive = isActive
            await cat.save();

            return res.status(200).json({message: 'Category Updated successfully1', success: true});

        } else {
            return res.status(400).json({message: 'Category not found', success: false});
        }

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}

const deleteCategory = async (req, res) => {
    try {
        
        const category = await Category.findOne({_id: req.params.categoryId});
        const unCategorized = await Category.findOne({name: 'Uncategorized'});

        if(category && unCategorized){

            const posts = await Post.find({category: category._id});

            for (let i = 0; i < posts.length; i++) {
                const post = posts[i];

                post.category = unCategorized._id;
                await post.save();
            }

            await Category.deleteOne({_id: category._id});

            return res.status(200).json({message: 'Category deleted successfully1', success: true});

        } else {
            return res.status(400).json({message: 'Category not found', success: false});
        }

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}



module.exports = {
    createCategory,
    getCategories,
    editCategory,
    deleteCategory,
}