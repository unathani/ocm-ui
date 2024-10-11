// pages/login.js
import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      // Make a POST request to get the auth token
      const response = await axios.post('https://logon.devqa.ebsco.zone/api/dispatcher/oauth/token', {
        client_id: 'jGXcyR2LTtS0vCbQQvBPDH4P4hOtBGd2',
        client_secret: 'kBxSZLoBHrtMucW6nLZplGkyGCV8XD7vMVAANXpZEvkFZli9-YL1nK6tOoZ43bzx',
        grant_type: 'client_credentials',
      });

      const token = response.data.access_token;

      // Call onLogin to store the token globally
      onLogin(token);

    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid client ID or client secret. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin} style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
        <label>
          Client ID:
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          />
        </label>
        <label>
          Client Secret:
          <input
            type="password"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            required
          />
        </label>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
