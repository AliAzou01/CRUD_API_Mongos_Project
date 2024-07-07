const mongoose = require('mongoose');

const schema = mongoose.Schema;

const bookingSchema = new schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
       
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
{timestamps:true}
);

module.exports = mongoose.model('Booking', bookingSchema);