import React from "react";
import './EventItem.css';

const eventItem = props => (
    <li key={props.eventId} className="events-list-item">
        <div>
            <h1>{props.title}</h1>  
            <h2>{props.price}</h2>
        </div> 
        <div>
            { (props.AuthUserId === props.userId) ? <p>Your the owner of this event.</p>: <button className="btn">View Details</button>  }
            
        </div>   
    </li>
);

export default eventItem;