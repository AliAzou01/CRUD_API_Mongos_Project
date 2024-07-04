const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

const app = express();

const events = [];

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
           _id: String!
           title: String!
           description: String!
           price: Float!
           date: String!
        }

        type User {
            _id: String!
            email: String!
            password: String!
        }
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        input UserInput {
            email: String!
            password: String!
        }
        

        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput!): Event
            createUser(userInput: UserInput!): User
        }
        schema {
            query: RootQuery,
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
            .then(() => {
                return events.map(event => {
                    return { ...event._doc, _id: result._doc._id.toString() };
                });
            }).catch(() => {
                throw err;
            });
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '6686989449fad979478b263e'
            });
            let createdEvent;
            return event
            .save()
            .then(result => {
                createdEvent = {...result._doc, _id: result._doc._id.toString() };
                return User.findById('6686989449fad979478b263e')
            })
            .then(user =>{
                if(!user){
                    throw new Error('User not found!');
                }
                user.createdEvents.push(event);
                user.save()
            })
            .then(() => {
                return createdEvent;
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
        },
        createUser: (args) => {
           return User.findOne({ email: args.userInput.email })
            .then(user => {
                if (user) {
                    throw new Error('User exists!');
                }
                return bcrypt.hash(args.userInput.password, 12)
            })
            
            .then(hashedPasword => {
            const user = new User({
                email: args.userInput.email,
                password: hashedPasword
            });
            return user.save();
            })
            .then(result => {
                return {...result._doc,passwod: null, _id: result._id };
            })
            .catch(err => {
                throw err;
            });
        }
    },
    graphiql: true

}));

const user = encodeURIComponent(process.env.MONGO_USER);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const dbName = encodeURIComponent(process.env.MONGO_DB);
const uri = `mongodb+srv://${user}:${password}@cluster0.hhmlk30.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(3000, () => {
            console.log('GraphQL server is running on localhost:3000/graphql');
        });
    })
    .catch(err => console.log(err));