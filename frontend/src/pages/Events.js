import React, { useState, useRef, useContext, useEffect } from 'react';
import './Events.css';
import Modal from './components/Modal/Modal';
import Backdrop from './components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';  
import EventList from './components/Events/EventList/EventList.js';

const EventPage = () => {
    const [creating, setCreating] = useState(false);
    const [events, setEvents] = useState([]);
    const context = useContext(AuthContext);  // Utilisez le contexte ici
    const titleRef = useRef();
    const priceRef = useRef();
    const dateRef = useRef();
    const descriptionRef = useRef();

    const createEventHandler = () => {
        setCreating(true);
    };

    const cancelEventHandler = () => {
        setCreating(false);
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
                    creator {
                      _id
                      email
                    }
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
            fetchEvents();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const fetchEvents = () => {
        const requestBody = {
            query: `
                query {
                  events {
                    _id
                    title
                    description
                    date
                    price
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
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    useEffect(() => {
        fetchEvents();
    }, []);


    return (
        <React.Fragment>
            {creating && <Backdrop />}
            {creating && <Modal title="Add Event" canCancel canConfirm onCancel={cancelEventHandler} onConfirm={confirmEventHandler}>
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
            {context.token && <div className="events-control">
                <p>Share your own Events!</p>
                <button className="btn" onClick={createEventHandler}>Create Event</button>
            </div>}
            <EventList events={events}/>
        </React.Fragment>
    );
};

export default EventPage;
