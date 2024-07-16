const Event = require('../../models/event');
const User = require('../../models/user');
const { DateToString} = require('../../helpers/date');
const {transformEvents} = require('./merge');




module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvents(event);
                
            });
        } catch (err) {
            throw err;
        }
    },
    
    createEvent: async (args, req)=> {
        console.log('*++++++++',req.isAuth);
        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: DateToString(args.eventInput.date),
            creator: req.userId
        });
        try {
            const result = await event.save();
            const createdEvent = transformEvents(event);

            const creator = await User.findById(req.userId);
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
