import React, {useState,useContext, useEffect} from 'react';
import BookingList from './components/Booking/BookingList/BookingList';
import AuthContext from '../context/auth-context'; 
import Spinner from './components/spinner/Spinner';
import BookingChart from './components/Booking/BookingsChart/BookingsChart'; 
import BookingControl from './components/Booking/BookingsControl/BookingsControl';



const BookingPage = () => {

const [isLoading, setIsLoading] = useState(false);
const [booking, setBooking] = useState([]);
const context = useContext(AuthContext); 
const [outputType, setOutputType] = useState('list');


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

useEffect(() => {
    fetchBookings();
}, [fetchBookings]);

const deleteBookingHandler = (bookingId) => {
    setIsLoading(true);
    const requestBody = {
        query: `
            mutation CancelBooking($id : ID!) {
              cancelBooking(bookingId : $id) {
                _id
                title
                
              }
            }
          `,
        variables: {
            id: bookingId
          }
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
        setBooking(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
        setIsLoading(false);
    })
    .catch(error => {
        console.error('Error:', error);
        setIsLoading(false);
    });
}

const changeOutputTypeHandler = newType => {
    setOutputType(newType);
};

    
        let content = <Spinner />
        if (!isLoading) {
            content = (
                <React.Fragment>
                    <BookingControl 
                        activeOutputType= {outputType}
                        onChange={changeOutputTypeHandler}
                    />
                    <div>
                    {(outputType === 'list') ? (
                    <BookingList 
                        bookings= {booking}
                        onDelete={deleteBookingHandler}
                    />
                    ) : (
                
                    <BookingChart bookings={booking}/>
                    )}
                    </div>
                </React.Fragment>
            )

        }
        return <React.Fragment>{content}</React.Fragment>
    
}

export default BookingPage;