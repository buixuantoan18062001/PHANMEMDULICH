const express = require('express');
const router = express.Router();
const diadiemController = require('../controllers/diadiemController');
//newsController.index


router.get('/', diadiemController.show);
router.get('/:id', diadiemController.showId);
router.post('/', diadiemController.create);
router.put('/:id', diadiemController.editAll);
router.patch('/:id', diadiemController.editOne);
router.delete('/:id', diadiemController.delete);


module.exports = router;