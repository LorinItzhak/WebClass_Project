
const express= require('express');
const router = express.Router();
const post_ = require('../controllers/post_controller');

router.post('/',post_.AddANewPost);
router.get('/',post_.getAllPost);
router.get('/:id',post_.getPostById);
router.put('/:id', post_.updateAPost);


module.exports= router;