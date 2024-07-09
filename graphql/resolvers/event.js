const Event = require('../../models/event');
const { DateToString} = require('../../helpers/date');
const {user} = require('./merge');

const transformEvents = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: DateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
}; 



module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    creator: user.bind(this, event.creator),
                    date: DateToString(event._doc.date)
                };
            });
        } catch (err) {
            throw err;
        }
    },
    
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: DateToString(args.eventInput.date),
            creator: '6686b8355ae6e0041d6d749f'
        });
        try {
            const result = await event.save();
            const createdEvent = transformEvents(event);

            const creator = await User.findById('6686b8355ae6e0041d6d749f');
            if (!creator) {
                throw new Error('User not found!');
            }
            creator.createdEvents.push(event);
            await creator.save();

            return createdEvent;
        } catch (err) {
            throw err;
        }
    }


};
