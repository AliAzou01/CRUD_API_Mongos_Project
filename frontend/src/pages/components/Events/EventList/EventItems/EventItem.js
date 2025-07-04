import React from "react";
import './EventItem.css';

const eventItem = props => (
    <li key={props.eventId} className="events-list-item">
        <div>
            <h1>{props.title}</h1>  
            <h2>{props.price} -- { new Date(props.date).toLocaleDateString()}</h2>
        </div> 
        <div>
            { (props.AuthUserId === props.userId) ? 
            (<p>Your the owner of this event.</p>

            ) : (
            <button className="btn" onClick={props.viewDetails.bind(this, props.eventId)}>View Details</button>
            )  }
            
        </div>   
    </li>
);

export default eventItem;