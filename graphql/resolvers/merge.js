const User = require('../../models/user');
const Event = require('../../models/event');
const { DateToString } = require('../../helpers/date');
const DataLoader = require('dataloader');

// Loader pour les événements
const eventLoader = new DataLoader(async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        const eventMap = new Map(events.map(event => [event._id.toString(), event]));

        // Tri des événements selon l'ordre des IDs reçus
        return eventIds.map(id => eventMap.get(id.toString()));
    } catch (err) {
        throw err;
    }
});

// Loader pour les utilisateurs
const userLoader = new DataLoader(async (userIds) => {
    try {
        const users = await User.find({ _id: { $in: userIds } });
        const userMap = new Map(users.map(user => [user._id.toString(), user]));
        return userIds.map(id => userMap.get(id.toString()));
    } catch (err) {
        throw err;
    }
});

// Chargement d'un événement unique
const singleEvent = async (eventId) => {
    try {
        return await eventLoader.load(eventId.toString());
    } catch (err) {
        throw err;
    }
};

// Chargement d'un utilisateur unique
const user = async (userId) => {
    try {
        const user = await userLoader.load(userId.toString());
        if (!user) {
            throw new Error('No User exists!');
        }
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
        };
    } catch (err) {
        throw err;
    }
};

// Transformation des événements
const transformEvents = (event) => {
    return {
        ...event._doc,
        _id: event.id,
        date: DateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
};

// Transformation des réservations
const transformBookings = (booking) => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: DateToString(booking._doc.createdAt),
        updatedAt: DateToString(booking._doc.updatedAt),
    };
};

exports.transformEvents = transformEvents;
exports.transformBookings = transformBookings;
