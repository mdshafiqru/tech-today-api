module.exports = (express) => {
    const router = express.Router();

    // internal imports
    // middlwares imports
    const admin = require('../middlewares/admin/admin');
    const avatarUpload = require('../middlewares/common/avatar_upload');
    const postImageUpload = require('../middlewares/common/post_image_upload');

    // validator middleware imports
    const authValidator = require('../middlewares/validators/auth_validator');
    const categoryValidator = require('../middlewares/validators/category_validator');
    const postValidator = require('../middlewares/validators/post_validator');
    const commentValidator = require('../middlewares/validators/comment_validator');

    // controllers imports
    const authController = require('../controllers/common/auth_controller');
    const userController = require('../controllers/admin/user_controller');
    const categoryController = require('../controllers/common/category_controller');
    const postController = require('../controllers/common/post_controller');
    const commentController = require('../controllers/common/comment_controller');

    router.post('/login', authValidator.login, authController.adminLogin);
    // router.post('/register', authValidator.register , authController.register);

    router.get('/', admin, authController.admin);
    router.put('/update-pass', admin, authValidator.updatePass, authController.updateAdminPass);
    router.put('/update-profile', admin, authValidator.updateProfile, authController.updateAdminProfile);
    router.put('/update-profile-photo', admin, avatarUpload, authController.updateAdminProfilePhoto);

    // manage users
    router.get('/users-active', admin, userController.activeUsers);
    router.get('/users-blocked', admin, userController.blockedUsers);
    router.post('/block-a-user', admin, authValidator.blockUser, userController.blockUser);
    router.get('/unblock-a-user/:userId', admin, userController.unblockUser);


    router.post('/category-create', admin, categoryValidator.createCategory, categoryController.createCategory);
    router.get('/category-all', admin, categoryController.getCategories);
    router.put('/category-edit/:categoryId', admin, categoryValidator.editCategory, categoryController.editCategory);
    router.delete('/category-delete/:categoryId', admin, categoryController.deleteCategory);

    // posts
    router.get('/posts-by-author/:authorId', admin, postController.getPostsByAuthor);
    router.post('/post-create', admin, postImageUpload, postValidator.createPost, postController.createPost);
    router.post('/post-edit', admin, postImageUpload, postValidator.editPost, postController.editPost);
    router.get('/post-all', admin, postController.getPosts);
    router.get('/get-posts-by-category/:categoryId', admin, postController.getPostsByCategory);
    router.get('/my-posts', admin, postController.myPosts);
    router.get('/search-posts/:query', admin, postController.searchPosts);
    router.delete('/delete-post/:postId', admin, postController.deletePost);
    router.delete('/delete-post-permanent/:postId', admin, postController.deletePostPermanent);

    // comments
    router.get('/like-unlike/:postId', admin, commentController.likeUnlike);
    router.post('/create-comment', admin, commentValidator.createComment, commentController.createComment);
    router.get('/get-comments/:postId', admin, commentController.getComments);
    router.delete('/delete-comment/:commentId', admin, commentController.deleteComment);

    // reply
    router.post('/create-reply', admin, commentValidator.createReply, commentController.createReply);
    router.get('/get-replies/:commentId', admin, commentController.getReplies);
    router.delete('/delete-reply/:replyId', admin, commentController.deleteReply);
    

    
    return router;
}
