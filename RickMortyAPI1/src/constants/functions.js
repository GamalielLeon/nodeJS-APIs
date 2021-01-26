const ApiQuery = require('../models/ApiQuery');
const Status = require('./Status');

/* Returns a message according to the 'validation' string */
const validationMessage = (validation, field, value = 'string') => {
    const messages = {
        required: `'${field}' field is required`,
        cast: `'${field}' field must be a ${value}`,
        positiveInteger: `'${field}' value is not valid`
    };
    return messages[validation];
};

/* Sets the info properties according to the queries made by the client (page, pageSize) */
const setApiQueryProperties = async(Model, queries) => {
    const pageSize = getLargestNumber(0, parseInt(Number(queries.pageSize), 10), 20);
    const page = getLargestNumber(0, parseInt(Number(queries.page), 10), 1);
    const info = ApiQuery.info;
    ApiQuery.info.count = await Model.find().countDocuments() || 0;
    ApiQuery.info.pageSize = getSmallestNumber(pageSize, info.count, 20);
    ApiQuery.info.pages = Math.ceil(info.count / info.pageSize) || info.pages;
    ApiQuery.info.page = getSmallestNumber(page, info.pages, 1);
};

/* Get a document (or documents) from the database, based on the 'ids' string. If succeeded, returns
   the document (or documents) found, otherwise return the appropriate status code and message */
const getDocumentFromDB = async(Model, ids) => {
    let body = {...Status[400] };
    let code;
    try {
        const id = ids.split(',');
        body = await Model.find({ id }, { _id: 0 });
        let description = `Some documents were not found. Documents not found: ${id.length - body.length}`;
        [code, body] = body.length ? [200, bodyToArrayOrJson(body)] : [404, {...Status[404], description }];
    } catch (error) { code = 400; }
    return { body, code };
};

/* Attempt to save a document on the database and returns it if succeeded or returns
   the appropriate status code and message error */
/* POST method is idempotent (unlike GET, PUT or DELETe) and, therefore, this function must be
   declare for each Schema (which means, each collection in the database) */
async function postEpisodeDocumentOnDB(Model, req) {
    let body = {...Status[500] };
    let code = 200;
    try {
        const url = `${req.baseUrl}/${req.body.id}`;
        const newEpisode = await (new Model({...req.body, url })).save();
        body = await Model.findOne({ id: newEpisode.id }, { _id: 0 });
    } catch (error) {
        code = 500;
        body.description = error.message;
    }
    return { body, code };
}

/* Attempt to delete a document (or documents) from the database. Return the not found and deleted
   elements, or return a 500 status code and the error description if failed */
async function deleteDocumentFromDB(Model, ids) {
    let body = {...Status[500] };
    try {
        const id = ids.split(',');
        let message = 'Some documents were not found.';
        const { n } = await Model.deleteMany({ id });
        body = {...Status[n !== id.length ? 404 : (message = 'OK.', 200)] };
        body.description = `${message} Documents deleted: ${n}. Documents not found: ${id.length - n}`;
    } catch (error) { body.description = error.message; }
    return { body, code: body.code };
}

module.exports = {
    validationMessage,
    setApiQueryProperties,
    getDocumentFromDB,
    postEpisodeDocumentOnDB,
    deleteDocumentFromDB
};

/* ********** Functions that are only used here ********** */

/* Return an object if the body contains one single document, otherwise return an array */
const bodyToArrayOrJson = body => body.length === 1 ? body[0] : body;
const getSmallestNumber = (number1, number2, byDefault) =>
    (number1 > number2 ? number2 : number1) || byDefault;
const getLargestNumber = (number1, number2, byDefault) =>
    (number1 > number2 ? number1 : number2) || byDefault;

/* ******************************************************* */