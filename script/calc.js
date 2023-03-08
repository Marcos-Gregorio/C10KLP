var formMotor = document.getElementById('formMotor');
var resultDiv = document.getElementById('resultMotor');

var formCar = document.getElementById('formCar');
var resultCar = document.getElementById('resultCar');


formMotor.addEventListener('submit', function (event) {
  event.preventDefault();
  
  var origin ='Rua França Meireles';
  var destination = document.getElementById('destination').value;

  calcDistance(origin, destination, function (distance) {
    var shippingCost = distance * 2.5; // 1.5 reais por km
    resultDiv.innerHTML = 'Distância: ' + distance.toFixed(2) + ' km<br>Valor do frete: R$' + shippingCost.toFixed(2);
  });
});

formCar.addEventListener('submit', function (event) {
  event.preventDefault();
  
  var origin ='Rua França Meireles';
  var destination = document.getElementById('destinationCar').value;

  calcDistance(origin, destination, function (distance) {
    var shippingCost = distance * 3.5; // 1.5 reais por km
    resultCar.innerHTML = 'Distância: ' + distance.toFixed(2) + ' km<br>Valor do frete: R$' + shippingCost.toFixed(2);
  });
});

function calcDistance(origin, destination, callback) {
  var osrmBaseUrl = 'https://router.project-osrm.org';

  // Geocode the origin and destination addresses
  Promise.all([geocodeAddress(origin), geocodeAddress(destination)])
    .then(function (results) {
      var originLatLng = results[0];
      var destinationLatLng = results[1];

      // Build the URL to query the OSRM API for the driving route
      var url = osrmBaseUrl + '/route/v1/driving/' + originLatLng[1] + ',' + originLatLng[0] + ';' + destinationLatLng[1] + ',' + destinationLatLng[0] + '?overview=false&geometries=geojson';

      // Query the OSRM API for the driving route
      fetch(url)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          // Calculate the distance of the driving route
          var distance = data.routes[0].distance / 1000; // Convert meters to km
          callback(distance);
        })
        .catch(function (error) {
          console.log('Error calculating distance: ' + error);
        });
    })
    .catch(function (error) {
      console.log('Error geocoding addresses: ' + error);
    });
}

function geocodeAddress(address) {
  var url = 'https://nominatim.openstreetmap.org/search/' + encodeURIComponent(address) + '?format=json&limit=1';

  return fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length === 0) {
        throw new Error('Address not found');
      }
      return [data[0].lat, data[0].lon];
    });
}