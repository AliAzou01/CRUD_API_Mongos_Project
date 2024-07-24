import React from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import './MainNavigation.css';

const mainNaviagation = props => (
    <AuthContext.Consumer>
        {context => {
            return (

                <header className='main-navigation'>
                    <div className='main-navigation-logo'>
                        <h1> EasyEvent </h1>
                    </div>
                    <nav className='main-navigation-item'>
                        <ul>
                            {!context.token && (<li>
                                <NavLink to="/auth">Authentification</NavLink>
                            </li>)}
                            {context.token && (
                                <React.Fragment>
                                    <li>
                                        <NavLink to="/booking">Bookings</NavLink>
                                    </li>
                                    <li>
                                        <button onClick={context.logout}>Logout</button> 
                                    </li>
                                 </React.Fragment>
                            )}


                            <li>
                                <NavLink to="/events">Events</NavLink>
                            </li>

                        </ul>
                    </nav>
                </header>
            )
        }}
    </AuthContext.Consumer>

);
export default mainNaviagation;