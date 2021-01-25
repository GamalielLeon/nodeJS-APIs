module.exports = {
    characterMethods: {
        GET: true,
    },
    characterByIdMethods: {
        GET: true,
        POST: false,
        PUT: false,
        DELETE: false
    },
    episodeMethods: {
        GET: true,
        POST: true
    },
    episodeByIdMethods: {
        GET: true,
        POST: false,
        PUT: false,
        DELETE: true
    }
};