const { buildSchema } = require('graphql');


module.exports = buildSchema(`
    type Booking {
        _id: ID!
        event: Event!
        user :User!
        createdAt: String!
        updatedAt: String!
    }
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
        createdEvents:[Event!]
    }
    type AuthData {
        userId: String!
        token: String!
        tokenExpiration: Int!
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
        booking:[Booking!]!
        login(email:String!, password:String):AuthData!
    }
    type RootMutation {
        createEvent(eventInput: EventInput!): Event
        createUser(userInput: UserInput!): User
        bookEvent(eventId: ID!): Booking!
        cancelBooking(bookingId: ID!): Event!
    }
    schema {
        query: RootQuery,
        mutation: RootMutation
    }
`)