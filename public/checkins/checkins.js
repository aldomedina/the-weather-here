const mymap = L.map('map').setView([0,0], 2);
const attribution = '&copy; Colaboradores de <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap)

getData();
async function getData() {
    const response = await fetch('/api');
    const data = await response.json();    
    data.forEach(item => {
        const marker = L.marker([item.lat, item.lon]).addTo(mymap)
        const date = new Date(item.timestamp).toLocaleDateString()
        let txt = `In ${date}, the temperature at latitude: ${item.lat.toFixed(2)}º, longitude: ${item.lon.toFixed(2)}º) was ${item.weather.temperature}º C in a "${item.weather.summary.toLowerCase()}" day.`                                        
        if (item.aq.value < 0 ) {
            txt += ' There were no air quality readings at the time.';
        } else {
            txt += `Plus, the air quality was: ${item.aq.value} ${item.aq.unit} (measurement's parameter: ${item.aq.parameter}).`
        }
        marker.bindPopup(txt);
    })
    console.log(data)
}