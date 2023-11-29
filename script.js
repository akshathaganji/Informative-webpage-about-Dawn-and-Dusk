function fetchlocation() {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        const url = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                document.querySelector('#timezone2').textContent = data.results.timezone;
                displayData(data, '');
                fetchTomorrowData(latitude, longitude);
            })
            .catch(error => alert('No access by your browser'));
    });
}

function showtime() {
    const location = document.getElementById('locationInput').value;
    if (location.trim() === '') {
        alert('Please enter a valid location');
        return;
    }

    const loc = `https://geocode.maps.co/search?q=${location}`;
    fetch(loc)
        .then(response => response.json())
        .then(data => {
            const latitude = data[0].lat;
            const longitude = data[0].lon;
            const place = data[0].display_name;
            document.getElementById('place').textContent = "More closest location you searched for =  " + place;

            fetchSunriseSunsetData(latitude, longitude);
            fetchTomorrowData(latitude, longitude);
        })
        .catch(error => alert('Not a valid location'));
}

function displayData(data, suffix) {
    document.querySelector(`#sunrise${suffix}`).textContent = data.results.sunrise;
    document.querySelector(`#sunset${suffix}`).textContent = data.results.sunset;
    document.querySelector(`#dawn${suffix}`).textContent = data.results.dawn;
    document.querySelector(`#dusk${suffix}`).textContent = data.results.dusk;
    document.querySelector(`#day_length${suffix}`).textContent = data.results.day_length;
    document.querySelector(`#solar_noon${suffix}`).textContent = data.results.solar_noon;
    document.querySelector(`#timezone${suffix}`).textContent = data.results.timezone;
}

function fetchSunriseSunsetData(latitude, longitude) {
    const todayUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=today`;

    fetch(todayUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            displayData(data, '');
        })
        .catch(error => {
            displayError('Error fetching data for today:', error);
        });
}

function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

function fetchTomorrowData(latitude, longitude) {
    const tomorrowUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${getTomorrowDate()}`;

    fetch(tomorrowUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch data for tomorrow: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            displayData(data, '1');
        })
        .catch(error => {
            displayError('Error fetching data for tomorrow:', error);
        });
}
