const { episodeMethods, episodeByIdMethods } = require('../constants/methodsByRoute');
const { ApiQuery, Episode } = require('../models/index');
const Status = require('../constants/Status');
const {
    setApiQueryProperties,
    getDocumentFromDB,
    postEpisodeDocumentOnDB,
    deleteDocumentFromDB
} = require('../constants/functions');

const allRoutes = (req, res, next) => episodeMethods[req.method] ? next() : res.status(501).json(Status[501]);
const allRoutesById = (req, res, next) => episodeByIdMethods[req.method] ? next() : res.status(501).json(Status[501]);
const getEpisodeByQuery = async(req, res) => {
    await setApiQueryProperties(Episode, req.query);
    const pageSelected = ApiQuery.info.page;
    const idEnd = ApiQuery.info.pageSize * pageSelected;
    const idStart = ApiQuery.info.pageSize * (pageSelected - 1) + 1;
    ApiQuery.results = await Episode.find({}, { _id: 0 }).where('id').gte(idStart).lte(idEnd);
    res.status(200).json(ApiQuery);
};
const getEpisodeById = async(req, res) => {
    const { body, code } = await getDocumentFromDB(Episode, req.params.id);
    res.status(code).json(body);
};
const postEpisode = async(req, res) => {
    const { body, code } = await postEpisodeDocumentOnDB(Episode, req);
    res.status(code).json(body);
};
const deleteEpisode = async(req, res) => {
    const { body, code } = await deleteDocumentFromDB(Episode, req.params.id);
    res.status(code).json(body);
};

module.exports = {
    allRoutes,
    allRoutesById,
    getEpisodeByQuery,
    getEpisodeById,
    postEpisode,
    deleteEpisode
};