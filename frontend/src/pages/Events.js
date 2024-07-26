import React, { useState, useRef, useContext, useEffect } from 'react';
import './Events.css';
import Modal from './components/Modal/Modal';
import Backdrop from './components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';  
import EventList from './components/Events/EventList/EventList.js';
import Spinner from './components/spinner/Spinner.js';

const EventPage = () => {
    const [creating, setCreating] = useState(false);
    const [events, setEvents] = useState([]);
    const context = useContext(AuthContext); 
    const titleRef = useRef();
    const priceRef = useRef();
    const dateRef = useRef();
    const descriptionRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const createEventHandler = () => {
        setCreating(true);
    };



    const cancelEventHandler = () => {
        setCreating(false);
        setSelectedEvent(null);
    };



    const bookEventHandler= () => {
        if (!context.token) {
            setSelectedEvent(null);
            return;
        }
        const requestBody = {
            query: `
                mutation {
                  bookEvent(eventId:"${selectedEvent._id}") {
                    _id
                    createdAt 
                    updatedAt
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
            console.log(resData);
            setSelectedEvent(null);
        })
        .catch(error => {
            console.error('Error:', error);
            
        });
    };

    const confirmEventHandler = () => {
        const title = titleRef.current.value;
        const price = +priceRef.current.value;
        const date = dateRef.current.value;
        const description = descriptionRef.current.value;
    
        if (title.trim().length === 0 || date.trim().length === 0 || description.trim().length === 0) {
            return;
        }
    
        console.log({
            title,
            price,
            date,
            description
        });
    
        setCreating(false);
    
        const requestBody = {
            query: `
                mutation {
                  createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
                    _id
                    title
                    description
                    date
                    price
                  }
                }
              `
        };
    
        const token = context.token;
    
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(requestBody),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to authenticate');
            }
            return response.json();
        })
        .then(data => {
            setEvents(prevEvents => {
                const updatedEvents = [...prevEvents.events];
                updatedEvents.push({
                    _id: data.data.createEvent._id,
                    title: data.data.createEvent.title,
                    description: data.data.createEvent.description,
                    date: data.data.createEvent.date,
                    price: data.data.createEvent.price,
                    creator: {
                        _id: context.userId
                    }
                });
                return {events: updatedEvents}
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const fetchEvents = () => {
        setIsLoading(true);
        const requestBody = {
            query: `
                query {
                  events {
                    _id
                    title
                    description
                    date
                    price
                    creator {
                      _id
                      email
                    }
                  }
                }
              `
        };
    
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            const events = resData.data.events;
            setEvents(events);
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error:', error);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const viewDetailsHandler = eventId => {
        setSelectedEvent(events.find(e => e._id === eventId));
        return {selectedEvent: selectedEvent};
    }


    return (
        <React.Fragment>
            {(creating || selectedEvent) && <Backdrop />}
            {creating && <Modal title="Add Event" canCancel canConfirm onCancel={cancelEventHandler} onConfirm={confirmEventHandler} confirmText="Confirm" >
                <form>
                    <div className="form-control">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" ref={titleRef} />
                    </div>
                    <div className="form-control">
                        <label htmlFor="price">Price</label>
                        <input type="number" id="price" ref={priceRef} />
                    </div>

                    <div className="form-control">
                        <label htmlFor="date">Date</label>
                        <input type="date" id="date" ref={dateRef} />
                    </div>

                    <div className="form-control">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" rows="4" ref={descriptionRef} />
                    </div>
                </form>
            </Modal>}
            {selectedEvent && (
                <Modal title="Add Event" canCancel canConfirm onCancel={cancelEventHandler} onConfirm={bookEventHandler} confirmText={context.token ? "Book" : "Confirm" }>
                <h1>{selectedEvent.title}</h1>
                
                <h2>£{selectedEvent.price} -- { new Date(selectedEvent.date).toLocaleDateString()}</h2>
                
                <p>{selectedEvent.description}</p>
            </Modal>)}
            {context.token && <div className="events-control">
                <p>Share your own Events!</p>
                <button className="btn" onClick={createEventHandler}>Create Event</button>
            </div>}
            { isLoading ? (<Spinner />) : (<EventList events={events} AuthUserId={context.userId} EventViewDetails={viewDetailsHandler}/> )}
            
        </React.Fragment>
    );
};

export default EventPage;
