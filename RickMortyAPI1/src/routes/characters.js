const characterController = require('../controllers/characterController');
const { Router } = require('express');
const router = Router();

// Check if the method requested is valid for each endpoint.
router.all('/', characterController.allRoutes);
router.all('/:id', characterController.allRoutesById);
// GET requests.
router.get('/', characterController.getCharacterByQuery);
router.get('/:id', characterController.getCharacterById);

module.exports = router;