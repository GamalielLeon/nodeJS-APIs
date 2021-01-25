module.exports = {
    validationMessage: (validation, field, value = 'string') => {
        const messages = {
            required: `'${field}' field is required`,
            cast: `'${field}' field must be a ${value}`,
            positiveInteger: `'${field}' value is not valid`
        };
        return messages[validation];
    }
};