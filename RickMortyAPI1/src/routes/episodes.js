const episodeController = require('../controllers/episodeController');
const { Router } = require('express');
const router = Router();

// Check if the method requested is valid for each endpoint.
router.all('/', episodeController.allRoutes);
router.all('/:id', episodeController.allRoutesById);
// GET requests.
router.get('/', episodeController.getEpisodeByQuery);
/* router.get(`/${basePath}/episodes`, (req, res) => {
    res.redirect(`/${basePath}/${episode}`, 307);
}); */
router.get('/:id', episodeController.getEpisodeById);
// POST requests.
router.post('/', episodeController.postEpisode);
// DELETE requests.
router.delete('/:id', episodeController.deleteEpisode);

module.exports = router;