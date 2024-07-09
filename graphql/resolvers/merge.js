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
        const event = await Event.findById({ _id: eventId });
        return transformEvents(event);
    }catch (err) { throw err; }
}

const user = async userId => {
    try {
        const user = await User.findById(userId);
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

exports.user = user;
exports.singleEvent = singleEvent;
exports.events = events;