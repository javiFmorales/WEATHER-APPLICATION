var searchBtn = document.querySelector(".btn");
var link = "http://api.openweathermap.org/data/2.5/weather "
var cityNameInput = document.querySelector("#cityNameInput");
var apiKey = "5f87c85e6b408716f553967965133088"
var cityName = document.querySelector("#cityName");
var icon = document.querySelector("#icon");
var date = document.querySelector("#date");
var temperature = document.querySelector("#temperature");
var humidity = document.querySelector("#humidity");
var windSpeed = document.querySelector("#wind-speed");
var uvIndex = document.querySelector("#uv-index");
var history = document.querySelector("#history");
var fiveDays = document.querySelector("#five-day");
var searchHistory = JSON.parse(localStorage.getItem('cities')) || [];
var forecast = document.querySelector(".forecast");
var previousSearches = document.querySelector(".previousSearches")
//previousSearches = searchHistory

//Need to convert temp to rahrenheit since the data since what im getting from API is coming back in kelvin 
//a function needs to be created to make convert the tremp into  fahrenheit
function kelvinFahrenheit(tempNum) {
    return Math.floor((tempNum - 273.15) * 1.8 + 32);
}
//button will be clicked and the data will render
searchBtn.addEventListener("click", function () {
    getApi(cityNameInput.value);

    function getApi(cityNameInput) {
        var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityNameInput + "&appid=" + apiKey;
        console.log(queryUrl)

        fetch(queryUrl)
            .then(function (response) {
                console.log(response)
                return response.json();
            })
            .then(function (data) {
                //will display current weather
                var currentDate = new Date(data.dt * 1000);
                console.log(currentDate.toLocaleDateString())

                console.log(data)
                cityName.innerHTML = ""
                cityName.append(data.name)
                var weatherIcon = data.weather[0].icon;
                console.log(icon)
                icon.setAttribute("src", "http://openweathermap.org/img/wn/" + weatherIcon + ".png");
                icon.setAttribute("alt", "weather icon")
                icon.innerHTML = ""
                date.innerHTML = currentDate.toLocaleDateString()
                temperature.innerHTML = "TEMPERATURE: " + kelvinFahrenheit(data.main.temp) + '°f';
                humidity.innerHTML = " HUMIDITY: " + (data.main.humidity) + "%";
                windSpeed.innerHTML = "WIND SPEED: " + (data.wind.speed) + " MPH";


                if (searchHistory.length >= 5) {
                    searchHistory.pop()
                }
                //loggin data onto local storage
                searchHistory.unshift(data.name)
                localStorage.setItem("cities", JSON.stringify(searchHistory))

                previousSearches.innerHTML = ""
                for (let i = 0; i < searchHistory.length; i++) {
                    var pTag = document.createElement('p')
                    pTag.textContent = searchHistory[i]
                    //pTag.textContent = searchHistory
                    previousSearches.append(pTag)
                    //console.log(searchHistory)
                }

                //uv index vars
                var lon = data.coord.lon
                console.log(lon)
                var lat = data.coord.lat
                console.log(lat)

                var uvQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lon=" + lon + "&lat=" + lat + "&appid=" + apiKey + "&units=imperial";
                console.log(uvQueryUrl)
                fetch(uvQueryUrl)
                    .then(function (res) {
                        return res.json()

                    }).then(function (uvData) {
                        console.log(uvData)

                        if (uvData.current.uvi < 4) {
                            uvIndex.setAttribute("class", "badge badge-success")
                        } else if (uvData.current.uvi < 8) {
                            uvIndex.setAttribute("class", "badge badge-warning")
                        } else {
                            uvIndex.setAttribute("class", "badge badge-danger")
                        }
                        uvIndex.innerHTML = "UV INDEX: " + (uvData.current.uvi)

                        console.log()
                        
                        //for loop to display five day forecast
                        forecast.innerHTML = ""
                        for (let i = 0; i < uvData.daily.length - 3; i++) {
                            var divEl = document.createElement("div");
                            divEl.setAttribute("class", "col-md-2 bg-primery text-black m-2 rounded")
                            let date2 = document.createElement('p')
                            let icon2 = document.createElement('img')
                            let temp = document.createElement('p')
                            let humidity = document.createElement('p')
                            var weatherIcon2 = uvData.daily[i].weather[0].icon;
                            var forecastDate = new Date(uvData.daily[i].dt * 1000);
                            date2.textContent = forecastDate.toLocaleDateString()
                            icon2.setAttribute("src", "http://openweathermap.org/img/wn/" + weatherIcon2 + ".png");
                            icon2.setAttribute("alt", "weather icon")
                            temp.textContent = 'TEMPERATURE ' + (uvData.daily[i].temp.day) + '°f';
                            humidity.textContent = 'HUMIDITY ' + (uvData.daily[i].humidity) + "%";
                            divEl.append(icon2, date2, temp, humidity,)
                            forecast.append(divEl)

                        }


                    });
            })

    }

});
for (let i = 0; i < searchHistory.length; i++) {
    var pTag = document.createElement('p')
    pTag.textContent = searchHistory[i]
    //pTag.textContent = searchHistory
    previousSearches.append(pTag)
    //console.log(searchHistory)
}
