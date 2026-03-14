const express = require('express');
const router = express.Router();
const courseController = require('../controllers/AccountController');
//newsController.index


router.get('/', courseController.show);
router.get('/:id', courseController.showId);
router.post('/', courseController.create);
router.put('/:id', courseController.editAll);
router.patch('/:id', courseController.editOne);
router.delete('/:id', courseController.delete);


module.exports = router;