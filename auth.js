const axios = require('axios');
require('dotenv').config();

let cachedToken = null;
let tokenExpiryTime = null;

const getToken = async () => {
    if (cachedToken && tokenExpiryTime && tokenExpiryTime > new Date().getTime()) {
        return cachedToken; // Use cached token if not expired
    }

    const params = {
        grant_type: 'client_credentials',
        scope: 'oauth-client-manager:clients:read'
      };
    
      // Basic authentication credentials
      const clientId = 'JvYKTPnpkacEPLbsRCTZbKcsPDN3AdWA';
      const clientSecret = 'deprecated_135';
    

    try {
        // const response = await axios.post(process.env.ACCESS_TOKEN_URL, new URLSearchParams({
        //     clientId: process.env.CLIENT_ID,
        //     clientSecret: process.env.CLIENT_SECRET
        // }).toString(), {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });

        const response = await axios.post(process.env.ACCESS_TOKEN_URL, null, {
            headers: {
              'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: params
          });

        // Save the new token and its expiry time
        cachedToken = response.data.access_token;
        tokenExpiryTime = new Date().getTime() + response.data.expires_in * 1000; // Calculate expiry time

        return cachedToken;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
};

module.exports = getToken;
