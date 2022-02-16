const authResolver = require('./auth');
const applicationResolver = require('./application');

const rootResolver = {
    ...authResolver,
    ...applicationResolver
};

module.exports = rootResolver;