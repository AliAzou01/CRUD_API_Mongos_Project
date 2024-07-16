
const authResolver = require('./auth');
const enventResolver = require('./event');
const bookingResolver= require('./booking');

const rootResolver ={
    ...authResolver,
    ...enventResolver,
    ...bookingResolver,
}
module.exports = rootResolver;