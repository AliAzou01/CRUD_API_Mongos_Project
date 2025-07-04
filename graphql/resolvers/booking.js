
const Booking = require('../../models/booking');
const Event = require('../../models/event');
const {transformEvents,transformBookings} = require('./merge');








module.exports = {
   
    booking: async (args,req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const bookings = await Booking.find({user: req.userId});
            return bookings.map(booking => {
                return transformBookings(booking)
            });
        }
        catch (err) {throw err;};
    },
    
    bookEvent: async (args,req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking(
            {user:req.userId,
            event: fetchedEvent}
    );
    const result = await booking.save();
    return transformBookings(result)
    },
    cancelBooking : async (args,req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try
        {
            const booking = await Booking.findById(args.bookingId).populate('event');
        const event = transformEvents(booking.event);
        await Booking.deleteOne({ _id: args.bookingId });
        return event;
        }
        catch (err) {
            throw err;
        }

    }


};
