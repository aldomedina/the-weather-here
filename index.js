// Remember: every time a package its installed, mostlikely would need to be called with require.
// API used
// - https://docs.openaq.org/
// - https://darksky.net
// Depencies:
// - dotenv: module that loads environment variables

const express = require('express')
const Datastore = require('nedb')
const fetch = require('node-fetch')
require('dotenv').config();

console.log(process.env)

const app = express()
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Starting server at port: ${port}`))
app.use(express.static('public'))
app.use(express.json({limit: '1mb'})); 

const db = new Datastore('database.db')
db.loadDatabase()

app.post('/api', (request, response) => {    
    const data = request.body    
    const timestamp = Date.now();
    data.timestamp = timestamp;    
    db.insert(data)  
    response.json(data)
});

app.get('/api', (request, response) => {
    db.find({}, (err, data) => {
        if(err) {
            response.end()
            console.log(err)
        }
        response.json(data)
    })
})

// Proxy-Server
app.get('/weather/:latlon', async (request, response) => {
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0]
    const lon = latlon[1]

    const api_key = process.env.API_KEY;
    const weather_url = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}/?units=si`
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();
    
    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();

    const data = {
        weather: weather_data,
        aq: aq_data
    }

    response.json(data);
});




