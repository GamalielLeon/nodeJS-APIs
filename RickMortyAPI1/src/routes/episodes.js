const { episodeMethods, episodeByIdMethods } = require('../constants/methodsByRoute');
const { ApiQuery, Episode } = require('../models/index');
const { basePath, episode } = require('./pathNames');
const Status = require('../constants/Status');
const { Router } = require('express');
const router = Router();

// Check if the method requested is valid for each endpoint.
router.all(`/${basePath}/${episode}/`, (req, res, next) => {
    _ = episodeMethods[req.method] ? next() : res.status(501).json(Status[501]);
});
router.all(`/${basePath}/${episode}/:id`, (req, res, next) => {
    _ = episodeByIdMethods[req.method] ? next() : res.status(501).json(Status[501]);
});
// GET requests.
router.get(`/${basePath}/${episode}`, async(req, res) => {
    await setApiQueryProperties(req.query);
    const pageSelected = ApiQuery.info.page;
    const idEnd = ApiQuery.info.pageSize * pageSelected;
    const idStart = ApiQuery.info.pageSize * (pageSelected - 1) + 1;
    ApiQuery.results = await Episode.find({}, { _id: 0 }).where('id').gte(idStart).lte(idEnd);
    res.status(200).json(ApiQuery);
});
router.get(`/${basePath}/episodes`, (req, res) => {
    res.redirect(`/${basePath}/${episode}`, 307);
});
router.get(`/${basePath}/${episode}/:id`, async(req, res) => {
    const { body, code } = await checkIfCharacterExists(req.params.id);
    res.status(code).json(body);
});
// POST requests.
router.post(`/${basePath}/${episode}`, async(req, res) => {
    const { body, code } = await validateBodyRequest(req.body);
    res.status(code).json(body);
});
// DELETE requests.
router.delete(`/${basePath}/${episode}/:id`, async(req, res) => {
    const { body, code } = await deleteDocument(req.params.id);
    res.status(code).json(body);
});

// Check if the body contains one single episode or many of them.
const bodyToArrayOrJson = body => body.length === 1 ? body[0] : body;
// Check if a document or documents were deleted from the database.
async function deleteDocument(ids) {
    let body = {...Status[500] };
    try {
        const id = ids.split(',');
        let message = 'Some documents were not found.';
        const { n } = await Episode.deleteMany({ id });
        body = {...Status[n !== id.length ? 404 : (message = 'OK.', 200)] };
        body.description = `${message} Documents deleted: ${n}. Documents not found: ${id.length - n}`;
    } catch (error) { body.description = error.message; }
    return { body, code: body.code };
}
// Validate if the body request is correct.
async function validateBodyRequest(reqBody) {
    let body = {...Status[500] };
    let code = 200;
    try {
        const url = `/${basePath}/${episode}/${reqBody.id}`;
        const newEpisode = await (new Episode({...reqBody, url })).save();
        body = await Episode.findOne({ id: newEpisode.id }, { _id: 0 });
    } catch (error) {
        code = 500;
        body.description = error.message;
    }
    return { body, code };
}
// Check if the episode exists on the database.
async function checkIfCharacterExists(ids) {
    let body = {...Status[400] };
    let code;
    try {
        const id = ids.split(',');
        body = await Episode.find({ id }, { _id: 0 });
        let description = `Some documents were not found. Documents not found: ${id.length - body.length}`;
        [code, body] = body.length ? [200, bodyToArrayOrJson(body)] : [404, {...Status[404], description }];
    } catch (error) { code = 400; }
    return { body, code };
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