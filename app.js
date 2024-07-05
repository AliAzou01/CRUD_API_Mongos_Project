

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

const event = eventId => {
    return Event.find({_id: {$in: eventId}})
    .then(events => {
        return events.map(event =>{
           return {...event._doc, _id: event.id, creator: user.bind(this, event.creator)};
        });
    })
    .catch(err => {
        throw err
    });
};

const user = userId => {
    return User.findById(userId)
    .then(user => {
        
        if (!user) { throw new Error(' No User exists!'); }

        return {...user._doc, _id : user.id, createdEvent: event.bind(this, user._doc.createdEvent)};})
        .catch(err => {
            throw err
        });
};

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
           _id: String!
           title: String!
           description: String!
           price: Float!
           date: String!
           creator: User!
        }

        type User {
            _id: String!
            email: String!
            password: String!
            createdEvent:[Event!]
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
            user(email: String!): User
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
            .then(events => {
                return events.map(event => {
                    return { 
                            ...event._doc,
                            _id: event.id,
                            creator: user.bind(this, event.creator)
                          };
                });
            }).catch(() => {
                throw err;
            });
        },
        user: (args) => {
            console.log('Fetching user with email:', args.email);
            return User.findOne({ email: args.email })
            .then(user => {
                if (!user) {
                    console.log('User not found!');
                    throw new Error('User not found!');
                }
                console.log('User found:', user);
                return { ...user._doc, _id: user._doc._id.toString() };
            })
            .catch(err => {
                console.error('Error fetching user:', err);
                throw err;
            });
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '6686b8355ae6e0041d6d749f'
            });
            let createdEvent;
            return event
            .save()
            .then(result => {
                createdEvent = {...result._doc, _id: result._doc._id.toString() };
                return User.findById('6686b8355ae6e0041d6d749f')
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
                return {...result._doc,passwod: null, _id: result._doc._id.toString() };
            })
            .catch(err => {
                throw err;
            });
        }
    },
    graphiql: true

}));

const user1 = encodeURIComponent(process.env.MONGO_USER);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const uri = `mongodb+srv://${user1}:${password}@cluster0.hhmlk30.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(uri)
    .then(() => {
        app.listen(3000, () => {
            console.log('GraphQL server is running on localhost:3000/graphql');
        });
    })
    .catch(err => console.log("Error:", err));
