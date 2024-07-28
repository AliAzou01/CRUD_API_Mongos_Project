const User = require('../../models/user');
const Event = require('../../models/event');
const { DateToString} = require('../../helpers/date');

const DataLoader = require('dataloader');



const eventLoader = new DataLoader((eventIds) => {
    return events(eventIds);
})

const userLoader = new DataLoader((userIds) => {
    return User.find({_id: {$in: userIds}})
});


const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return transformEvents(event);
        });
    } catch (err) {
        throw err;
    }
};

const singleEvent = async eventId => {
    try {
        const event = await eventLoader.load(eventId.toString());
        return event;
    }catch (err) { throw err; }
}

const user = async userId => {
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


const transformEvents = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: DateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
}; 


const transformBookings = booking => {
    return{
        ...booking._doc,
        _id:booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt : DateToString(booking._doc.createdAt),
        updatedAt: DateToString(booking._doc.updatedAt),          
    };
};

exports.transformEvents = transformEvents;
exports.transformBookings = transformBookings;
