const databaseName = 'rickMortyDB';
module.exports = {
    database: {
        name: databaseName,
        localURI: `mongodb://localhost/${databaseName}`
    }
};