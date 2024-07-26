import React, {useState,useContext, useEffect} from 'react';

import AuthContext from '../context/auth-context'; 



const BookingPage = () => {

const [isLoading, setIsLoading] = useState(false);
const [booking, setBooking] = useState([]);
const context = useContext(AuthContext); 

useEffect(() =>{
    fetchBookings();
})

const fetchBookings = () => {
    setIsLoading(true);
    const requestBody = {
        query: `
            query {
              booking {
                _id
                createdAt
                event {
                    _id 
                    title
                    date
                }
              }
            }
          `
    };

    fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + context.token
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        return response.json();
    })
    .then(resData => {
        const booking = resData.data.booking;
        setBooking(booking);
        setIsLoading(false);
    })
    .catch(error => {
        console.error('Error:', error);
        setIsLoading(false);
    });
}

    return (
        <ul>
            {booking.map(booking => (
                <li key={booking._id}>
                    <h2>{booking.event.title}</h2>
                    <p>Date: {new Date(booking.event.date).toLocaleDateString()}</p>
                    <p>Booked on: {new Date(booking.createdAt).toLocaleString()}</p>
                </li>
            ))}
        </ul>
    );
};

export default BookingPage;