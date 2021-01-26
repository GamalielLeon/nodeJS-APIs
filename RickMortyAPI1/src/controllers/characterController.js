const { characterMethods, characterByIdMethods } = require('../constants/methodsByRoute');
const { setApiQueryProperties, getDocumentFromDB } = require('../constants/functions');
const { ApiQuery, Character } = require('../models/index');
const Status = require('../constants/Status');

const allRoutes = (req, res, next) => characterMethods[req.method] ? next() : res.status(501).json(Status[501]);
const allRoutesById = (req, res, next) => characterByIdMethods[req.method] ? next() : res.status(501).json(Status[501]);
const getCharacterByQuery = async(req, res) => {
    await setApiQueryProperties(Character, req.query);
    const pageSelected = ApiQuery.info.page;
    const idEnd = ApiQuery.info.pageSize * pageSelected;
    const idStart = ApiQuery.info.pageSize * (pageSelected - 1) + 1;
    // ApiQuery.results = await Character.find({ $and: [{ id: { $gte: idStart } }, { id: { $lte: idEnd } }] }, { _id: 0 });
    ApiQuery.results = await Character.find({}, { _id: 0 }).where('id').gte(idStart).lte(idEnd);
    res.status(200).json(ApiQuery);
};
const getCharacterById = async(req, res) => {
    const { body, code } = await getDocumentFromDB(Character, req.params.id);
    res.status(code).json(body);
};

module.exports = {
    allRoutes,
    allRoutesById,
    getCharacterByQuery,
    getCharacterById
};