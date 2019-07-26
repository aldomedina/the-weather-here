if ('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(async position => {
        let lat, lon, aq, weather;
        try {
            // get lat / lon with navigator.geolocation 
            lat = position.coords.latitude;
            lon = position.coords.longitude;                                  
    
            // Get weather and air quality data from server. The server is been use as a server proxy for an external API, so this fetch (the client-side) is fetching the information gathered from the server's fetch thats feteching from the aq and weather's APi.
            const api_url = `weather/${lat},${lon}`    
            const response = await fetch(api_url);
            const json = await response.json()     
            
            // Select the data and do UI stuffs
            weather = json.weather.currently;
            aq = json.aq.results[0].measurements[0];            
            document.getElementById('container').innerText = `Currently, the temperature in your location (${lat.toFixed(2)}º, ${lon.toFixed(2)}º) is ${weather.temperature}º C in a "${weather.summary.toLowerCase()}" day. The air quality is: ${aq.value} ${aq.unit} (measurement's parameter: ${aq.parameter}).`
            
        } catch(error) {
            console.error(error)
            document.getElementById('container').innerText = `Currently, the temperature in your location (${lat.toFixed(2)}º, ${lon.toFixed(2)}º) is ${weather.temperature}º C in a "${weather.summary.toLowerCase()}" day. There are no air quality readings for your current location.`
            aq = {
                value: -1
            }
        }        
        
        // Sending back with POST-fetch the data that will be store in the database.
        const data = { lat, lon, weather, aq }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        const db_response = await fetch('/api', options);
        const db_json = await db_response.json();    
        console.log(db_json)     
    });
} else {
    console.log('geolocation not available');
}