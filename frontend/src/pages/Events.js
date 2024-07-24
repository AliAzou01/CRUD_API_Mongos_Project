import React, {useState} from 'react';
import './Events.css';
import Modal from './components/Modal/Modal';
import Backdrop from './components/Backdrop/Backdrop';



const EventPage = () => {

    const [creating, setCreating] = useState(false);

    const createEventHandler = () => {
        setCreating(true);
    };

    const cancelEventHandler = () => {
        setCreating(false);
    };
    const confirmEventHandler = () => {
        setCreating(false);
    };

    return (
        <React.Fragment>
        {creating && <Backdrop />}
        {creating && <Modal title="Add Event" canCancel canConfirm onCancel={cancelEventHandler} onConfirm={confirmEventHandler}>
            <p>Modal content</p>
        </Modal>}
        <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={createEventHandler}>Create Event</button>
        </div>
        </React.Fragment>
    )
};

export default EventPage;