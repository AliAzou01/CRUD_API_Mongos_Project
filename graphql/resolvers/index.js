const Event = require('../../models/event');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            };
        });
    } catch (err) {
        throw err;
    }
};

const user = async userId => {
    try {
        const user = await User.findById(userId).populate('createdEvents');
        if (!user) {
            throw new Error('No User exists!');
        }
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    } catch (err) {
        throw err;
    }
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
                    date: new Date(event._doc.date).toISOString()
                };
            });
        } catch (err) {
            throw err;
        }
    },
    user: async args => {
        try {
            const user = await User.findOne({ email: args.email }).populate('createdEvents');
            if (!user) {
                throw new Error('User not found!');
            }
            return { ...user._doc, _id: user._doc._id.toString() };
        } catch (err) {
            throw err;
        }
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date).toISOString(),
            creator: '6686b8355ae6e0041d6d749f'
        });
        try {
            const result = await event.save();
            const createdEvent = {
                ...result._doc,
                _id: result._doc._id.toString(),
                date: new Date(result._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            };

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
    },
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error('User exists!');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword,
                createdEvents: []
            });
            const result = await user.save();
            return { ...result._doc, password: null, _id: result._doc._id.toString() };
        } catch (err) {
            throw err;
        }
    }
};
