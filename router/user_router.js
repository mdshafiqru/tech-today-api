

// internal imports
// middleware imports
const user = require('../middlewares/user/user');
const avatarUpload = require('../middlewares/common/avatar_upload');
const postImageUpload = require('../middlewares/common/post_image_upload');

// validators middlware inports
const authValidator = require('../middlewares/validators/auth_validator');
const postValidator = require('../middlewares/validators/post_validator');
const commentValidator = require('../middlewares/validators/comment_validator');

//controllers inports
const authController = require('../controllers/common/auth_controller');
const postController = require('../controllers/common/post_controller');
const commentController = require('../controllers/common/comment_controller');
const categoryController = require('../controllers/common/category_controller');
const testController = require('../controllers/common/test_controller');

module.exports = (express) => {
    const router = express.Router();

    // auth
    router.post('/login', authValidator.login, authController.login);
    router.post('/register', authValidator.register, authController.register);
    router.post('/check-reset-pass', authValidator.checkResetPass, authController.checkResetPass);
    router.put('/reset-pass', authValidator.resetPass, authController.resetPass);

    router.get('/', user, authController.user);
    router.put('/update-pass', user, authValidator.updatePass, authController.updatePass);
    router.put('/update-profile', user, authValidator.updateProfile, authController.updateProfile);
    router.post('/update-profile-photo', user, avatarUpload, authController.updateProfilePhoto);
    
    // posts
    router.post('/post-create', user, postImageUpload, postValidator.createPost, postController.createPost);
    router.post('/post-edit', user, postImageUpload, postValidator.editPost, postController.editPost);
    router.get('/post-all', user, postController.getPosts);
    router.get('/get-posts-by-category/:categoryId', user, postController.getPostsByCategory);
    router.get('/posts-by-author/:authorId', user, postController.getPostsByAuthor);
    router.get('/my-posts', user, postController.myPosts);
    router.get('/search-posts/:query', user, postController.searchPosts);
    router.get('/deleted-posts', user, postController.getDeletedPosts);
    router.delete('/delete-post/:postId', user, postController.deletePost);
    router.get('/restore-post/:postId', user, postController.restorePost);
    router.delete('/delete-post-permanent/:postId', user, postController.deletePostPermanent);

    // saved posts
    router.get('/save-post/:postId', user, postController.addSavePost);
    router.get('/get-saved-posts', user, postController.getSavedPosts);
    router.delete('/remove-saved-post/:postId', user, postController.removeSavedPost);
    
    // comments
    router.get('/like-unlike/:postId', user, commentController.likeUnlike);
    router.post('/create-comment', user, commentValidator.createComment, commentController.createComment);
    router.get('/get-comments/:postId', user, commentController.getComments);
    router.delete('/delete-comment/:commentId', user, commentController.deleteComment);

    // reply
    router.post('/create-reply', user, commentValidator.createReply, commentController.createReply);
    router.get('/get-replies/:commentId', user, commentController.getReplies);
    router.delete('/delete-reply/:replyId', user, commentController.deleteReply);

    // categories
    router.get('/category-all', user, categoryController.getCategories);
    router.get('/create-test-transactions', user, testController.createTestTransactions);
    router.get('/create-single-transaction', user, testController.createSingleTransaction);
    // router.get('/create-wallets', user, testController.createWallets);
    router.get('/create-users', user, testController.createUsers);
    router.post('/send-balance-to-wallet', user, testController.sendBalanceToWallet);
    router.post('/get-latest-transactions', user, testController.getLatestTransactions);
    router.post('/get-trx-summary', user, testController.getTrxSummary);
    router.get('/check-skip/skip=:skip', user, testController.checkSkip);

    
    // author





    return router;
}




