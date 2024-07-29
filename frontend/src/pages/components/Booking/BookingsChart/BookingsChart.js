import React from 'react';

const BOOKING_BUCKETS = {
    cheap: {
        min:0,
        max:100
    },
    Normal: {
        min:101,
        max:200
    },
    Expensive: {
        min:201,
        max:500000
    }    
}

const bookingChart = props => {
    const output = {};
    
    for (const bucket in BOOKING_BUCKETS) {
        const filteredBookingCount = props.bookings.reduce((prev, current) => {
            if (current.event.price >= BOOKING_BUCKETS[bucket].min &&
                current.event.price <= BOOKING_BUCKETS[bucket].max) {
                return prev + 1;
            }
            return prev;
        }, 0);
        output[bucket] = filteredBookingCount;
    }
    console.log(output);
    return <p>The Chart !</p>
};

export default bookingChart;