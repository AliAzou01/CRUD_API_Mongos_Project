import React, { useRef, useState } from 'react';
import './Auth.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const emailEl = useRef();
  const passwordEl = useRef();

  const switchedHandler = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = emailEl.current.value;
    const password = passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `
      };
    }

    try {
      const response = await fetch('http://localhost:8000/graphql', { // Assurez-vous que cette URL est correcte
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate');
      }

      const data = await response.json();
      console.log('Authentication successful', data);

      if (data.data.login) {
        localStorage.setItem('token', data.data.login.token);
        // Redirigez l'utilisateur ou mettez à jour l'état du composant
        // Par exemple, utilisez `history.push('/dashboard')` si vous utilisez `react-router`
      } else if (data.data.createUser) {
        console.log('User created successfully', data.data.createUser);
      }

    } catch (error) {
      console.error('Error:', error);
      // Affichez un message d'erreur à l'utilisateur
    }
  };

  return (
    <form className="mt-sm-4 auth-form" onSubmit={handleSubmit}>
      {/* Email */}
      <div className="mb-3 input-group-lg form-control">
        <input type="email" className="form-control darkModeInputSignIn" ref={emailEl} placeholder="Enter email" />
      </div>
      {/* New password */}
      <div className="mb-3 position-relative">
        {/* Password */}
        <div className="input-group input-group-lg form-control">
          <input type="password" id="password" ref={passwordEl} placeholder="Enter password" />
        </div>
      </div>
      
      {/* Button */}
      <div className="d-grid form-actions">
        <button type="submit" className="btn btn-lg btn-primary">{isLogin ? "Login" : "Sign Up"}</button>
        <button type="button" onClick={switchedHandler}>Switch to {isLogin ? "Sign Up" : "Login"}</button>
      </div>
      {/* Copyright */}
      <p className="mb-0 mt-3">
        ©2023 <a target="_blank" rel="noopener noreferrer" href="https://www.webestica.com/">Webestica.</a> All rights reserved
      </p>
    </form>
  );
};

export default AuthPage;
