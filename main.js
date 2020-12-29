window.addEventListener('load', () => {

    let long; // longitude
    let lat; // latitude

    let lastUpdate = localStorage.getItem("last-update") || 0;
    let diff = Date.now() - lastUpdate;
    console.log(diff);
    if (!lastUpdate || (Date.now() - lastUpdate > 10 * 60 * 1000)) { // every 10 minutes
        console.log("fetching ..");
        fetchData();
    } else {
        console.log("using stored ..");
        parseData(JSON.parse(localStorage.getItem("data")));
    }
});

function fetchData() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            console.log(long);
            console.log(lat);

            let api = `https://weatherbit-v1-mashape.p.rapidapi.com/current?lon=${long}&lat=${lat}&lang=de`;
            fetch(api, {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-key": "489c31bdf5mshea8b225d9f3d689p1e450ejsn35a13be8388d",
                        "x-rapidapi-host": "weatherbit-v1-mashape.p.rapidapi.com"
                    }
                })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    localStorage.setItem("data", JSON.stringify(data));
                    localStorage.setItem("last-update", JSON.stringify(Date.now()));
                    parseData(data);

                })
                .catch(err => {
                    console.error(err);
                });


        })
    }
}

function parseData(data) {
    let locationTimezoneField = document.querySelector('.locationTimezone');
    let temperatureDegreeField = document.querySelector('.temperature-degree');
    let locationCityField = document.querySelector('.locationCity');
    let weatherDescriptionField = document.querySelector('.weather-description')
    let icon = document.querySelector('.icon');

    const { timezone, temp, city_name, weather } = data.data[0];
    //                    console.log(data);
    //                    console.log(timezone);
    //                    console.log(temp);

    locationTimezoneField.textContent = timezone;
    temperatureDegreeField.textContent = temp;
    locationCityField.textContent = city_name;
    weatherDescriptionField.textContent = weather.description;
    weatherIcon = weather.icon;
    icon.setAttribute("src", `https://www.weatherbit.io/static/img/icons/${weatherIcon}.png`);
}