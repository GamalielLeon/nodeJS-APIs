module.exports = {
    200: {
        message: 'OK',
        description: 'OK',
        code: 200
    },
    400: {
        message: 'Bad Request',
        description: 'The request syntax is invalid',
        code: 400
    },
    404: {
        message: 'Not Found',
        description: 'The resource was not found or does not exist',
        code: 404
    },
    500: {
        message: 'Internal Server Error',
        description: 'The server could not handle the request',
        code: 500
    },
    501: {
        message: 'Not Implemented',
        description: 'The method requested is not implemented for this resource',
        code: 501
    }
};