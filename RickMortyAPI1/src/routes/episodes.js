const { ApiQuery, Episode, Status } = require('../models/index');
const { basePath, episode } = require('./pathNames');
const { Router } = require('express');
const router = Router();

// Check if the method requested is valid for each endpoint.
router.all(`/${basePath}/${episode}/`, (req, res, next) => {
    _ = req.method === 'GET' ? next() : res.status(501).json(Status[501]);
});
router.all(`/${basePath}/${episode}/:id`, (req, res, next) => {
    _ = req.method === 'GET' ? next() : res.status(501).json(Status[501]);
});
// Endpoints with GET request.
router.get(`/${basePath}/${episode}`, async(req, res) => {
    await setApiQueryProperties(req.query);
    const pageSelected = ApiQuery.info.page;
    const idEnd = ApiQuery.info.pageSize * pageSelected;
    const idStart = ApiQuery.info.pageSize * (pageSelected - 1) + 1;
    ApiQuery.results = await Episode.find({ $and: [{ id: { $gte: idStart } }, { id: { $lte: idEnd } }] }, { _id: 0 });
    res.status(200).json(ApiQuery);
});
router.get(`/${basePath}/${episode}/:id`, async(req, res) => {
    const body = await checkIfCharacterExists(req.params.id);
    const bodyResponse = body ? body.length ? bodyToArrayOrJson(body) : Status[404] : Status[400];
    res.status(bodyResponse.code || 200).json(bodyResponse);
});

//Check if the body contains one single episode or many of them.
const bodyToArrayOrJson = (body) => body.length === 1 ? body[0] : body;
// Check if the character exists on the database, otherwise return null.
async function checkIfCharacterExists(id) {
    let body = null;
    try { body = await Episode.find({ id: id.split(',').map(param => +param) }, { _id: 0 }); } //
    catch (error) {}
    return body;
}
// Set the general info depending on the params sent by the client.
async function setApiQueryProperties(queries) {
    const pageSize = getLargestNumber(0, parseInt(Number(queries.pageSize), 10), 10);
    const page = getLargestNumber(0, parseInt(Number(queries.page), 10), 1);
    const info = ApiQuery.info;
    ApiQuery.info.count = await Episode.find().countDocuments() || 0;
    ApiQuery.info.pageSize = getSmallestNumber(pageSize, info.count, 10);
    ApiQuery.info.pages = Math.ceil(info.count / info.pageSize) || info.pages;
    ApiQuery.info.page = getSmallestNumber(page, info.pages, 1);
}
const getSmallestNumber = (number1, number2, byDefault) =>
    (number1 > number2 ? number2 : number1) || byDefault;
const getLargestNumber = (number1, number2, byDefault) =>
    (number1 > number2 ? number1 : number2) || byDefault;

module.exports = router;