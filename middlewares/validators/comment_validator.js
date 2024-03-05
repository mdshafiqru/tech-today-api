const {body} = require('express-validator');

const validationHandler = require('../common/validation_handler');


const createComment = [
    body('text')
        .trim()
        .isLength({min: 1})
        .withMessage("comment can not be empty."),
    body('postId')
        .trim()
        .isLength({min: 1})
        .withMessage("postId is required."),
    
    validationHandler,
];

const createReply = [
    body('text')
        .trim()
        .isLength({min: 1})
        .withMessage("comment can not be empty."),
    body('commentId')
        .trim()
        .isLength({min: 1})
        .withMessage("commentId is required"),
    
    validationHandler,
];


module.exports = {
    createReply,
    createComment,
}