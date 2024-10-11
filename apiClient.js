const express = require('express');
const axios = require('axios');
const path = require('path');
const session = require('express-session');
const getToken = require('./auth');
require('dotenv').config();
var bodyParser = require('body-parser')


const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.env = process.env.NODE_ENV;
    res.locals.headerBgColor = process.env.HEADER_BG_COLOR; // Pass the header background color
    next();
});

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// const getToken = async () => {
//     try {
//         const response = await axios.post(process.env.ACCESS_TOKEN_URL, new URLSearchParams({
//             environment: process.env.ENVIRONMENT,
//             clientId: process.env.CLIENT_ID,
//             clientSecret: process.env.CLIENT_SECRET
//         }).toString(), {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });
//         return response.data.access_token;
//     } catch (error) {
//         console.error('Error fetching access token:', error);
//         throw error;
//     }
// };

app.get('/clients', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const offset = (page - 1);
        // Get the token dynamically
        const accessToken = await getToken();

        const response = await axios.get(`${process.env.OAUTH_SERVER_URL}/v1/oauthclients`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            params: {
                offset: offset,
                count: limit,
                totalRequired: true,
                sort: 'name:asc'
            }
        });
        const clients = response.data.content || [];
        const totalClients = response.data.totalElements || 0;
        const totalPages = Math.ceil(totalClients / limit);
        res.render('client-list', { clients, page, totalPages, limit });
    } catch (error) {
        console.error('Error fetching client list:', error);
        res.status(500).send('Error fetching client list');
    }
});

app.get('/clients/:id', async (req, res) => {
    const clientId = req.params.id;    
    try {
        // Get the token dynamically
        const accessToken = await getToken();
        const response = await axios.get(`${process.env.OAUTH_SERVER_URL}/v1/oauthclients/${clientId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const client = response.data;
        res.render('client-details', { client });
    } catch (error) {
        console.error('Error fetching client details:', error);
        res.status(500).send('Error fetching client details');
    }
});

app.patch('/clients/:id', async (req, res) => {
    const clientId = req.params.id;
    const clientData = req.body;
    
    try {
        // Get the token dynamically
        const accessToken = await getToken();
        const response = await axios.patch(`${process.env.OAUTH_SERVER_URL}/v1/oauthclients/${clientId}`, clientData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        res.status(200).json({ message: 'Client details updated successfully' });
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ message: 'Failed to update client details', error });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
