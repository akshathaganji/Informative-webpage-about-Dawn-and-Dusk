function showtime() {
    const location = document.getElementById('locationInput').value;
    const geocodeUrl = `https://geocode.maps.co/search?q=${location}`;
    fetch(geocodeUrl)
      .then(response => response.json())
      .then(data => {
        const latitude = data[0].lat;
        const longitude = data[0].lon;
  
        const todayUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=today`;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${tomorrow.toISOString().split('T')[0]}`;
  
        fetch(todayUrl)
          .then(response => response.json())
          .then(data => {
            displayData(data, '');
          })
          .catch(error => {
            displayError('Error fetching data for today:', error);
          });
  
        fetch(tomorrowUrl)
          .then(response => response.json())
          .then(data => {
            displayData(data, '1');
          })
          .catch(error => {
            displayError('Error fetching data for tomorrow:', error);
          });
      })
      .catch(error => {
        displayError('Error with geocoding API:', error);
      });
  }
  function displayData(data, suffix) {
    document.querySelector(`#sunrise${suffix}`).textContent = data.results.sunrise;
    document.querySelector(`#sunset${suffix}`).textContent = data.results.sunset;
    document.querySelector(`#dawn${suffix}`).textContent = data.results.dawn;
    document.querySelector(`#dusk${suffix}`).textContent = data.results.dusk;
    document.querySelector(`#day_length${suffix}`).textContent = data.results.day_length;
    document.querySelector(`#solar_noon${suffix}`).textContent = data.results.solar_noon;
    document.querySelector(`#timezone${suffix}`).textContent = data.results.timezone;
    document.querySelector(`#raw-output${suffix}`).textContent = JSON.stringify(data);
  
    // Hide error message if data is displayed successfully
    document.getElementById('error-message').textContent = '';
  }
  function displayError(message, error) {
    const errorMessage = `${message} ${error}`;
    console.error(errorMessage);
  document.getElementById('error-message').textContent = errorMessage;
  document.querySelectorAll('.data span').forEach(span => {
      span.textContent = '';
    });
  }
  