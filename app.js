

const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const graphqlSchema = require ('./graphql/schema');
const graphqlResolvers = require ('./graphql/resolvers');
const isAuth = require('./middleware/is-auth');


const app = express();

const events = [];

app.use(bodyParser.json());

app.use(isAuth);


app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true

}));

const user1 = encodeURIComponent(process.env.MONGO_USER);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const uri = `mongodb+srv://${user1}:${password}@cluster0.hhmlk30.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(uri)
    .then(() => {
        app.listen(3001, () => {
            console.log('GraphQL server is running on localhost:3000/graphql');
        });
    })
    .catch(err => console.log("Error:", err));
