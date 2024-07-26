import React from "react";

import EventItem from "./EventItems/EventItem";
import './EventList.css';

const eventList = props => {
    
        const events = props.events.map(event => {
        return <EventItem key={event._id} eventId={event._id} title={event.title}  price={event.price} AuthUserId={props.AuthUserId} userId={event.creator._id}/>
    });
    
    return (
        <ul className="events-list">{events}</ul>
    )
};
export default eventList;