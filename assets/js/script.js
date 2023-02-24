
// Get all elements from the page and store them into variables

function initPage() {
    
    const inputEl = document.getElementById("city-input");
    
    const searchEl = document.getElementById("search-button");
    
    const clearEl = document.getElementById("clear-history");
    
    const nameEl = document.getElementById("city-name");
   
    const currentPicEl = document.getElementById("current-pic");
   
    const currentTempEl = document.getElementById("temperature");
    
    const currentHumidityEl = document.getElementById("humidity");4
    
    const currentWindEl = document.getElementById("wind-speed");
    
    const currentUVEl = document.getElementById("UV-index");
    
    const historyEl = document.getElementById("history");
    
   // Get search history from local storage, if any, and log it to console
       let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
   
        console.log(searchHistory);
    
    // Set OpenWeatherMap API Key
       const APIKey = "2b16664acc8874a358a67da8156a6d5a";

    // Retrieve weather information for the given city from the OpenWeatherMap API
    function getWeather(cityName) {
        
        // Construct query URL for current weather data
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        
        // Send GET request to OpenWeatherMap API with the constructed query URL
        axios.get(queryURL).then(function(response){
           
         console.log(response);

     // Get the current date and display it on the page   
    const currentDate = new Date(response.data.dt*1000);
           
         console.log(currentDate);
           
    const day = currentDate.getDate();
    
    const month = currentDate.getMonth() + 1;
            
    const year = currentDate.getFullYear();
            
    nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
    
    // Get the weather icon and display it on the page
    let weatherPic = response.data.weather[0].icon;
           
    currentPicEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            
    currentPicEl.setAttribute("alt",response.data.weather[0].description);
           
    // Get the temperature and display it on the page
    currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
    
    // Get the humidity and display it on the page
    currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
    
    // Get the wind speed and display it on the page
    currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
       
        let lat = response.data.coord.lat;
        
        let lon = response.data.coord.lon;
        
        let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
        
        axios.get(UVQueryURL).then(function(response){
          
            let UVIndex = document.createElement("span");
            
            UVIndex.setAttribute("class","badge badge-danger");
           
            UVIndex.innerHTML = response.data[0].value;
           
            currentUVEl.innerHTML = "UV Index: ";
            
            currentUVEl.append(UVIndex);
        });
        
        // Get the forecast data and display it on the page
        let cityID = response.data.id;
        
        let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
       
        axios.get(forecastQueryURL)
        .then(function(response){

            console.log(response);
            const forecastEls = document.querySelectorAll(".forecast");
            for (i=0; i<forecastEls.length; i++) {
               
                forecastEls[i].innerHTML = "";
               
                const forecastIndex = i*8 + 4;
               
                const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
               
                const forecastDay = forecastDate.getDate();
                
                const forecastMonth = forecastDate.getMonth() + 1;
                
                const forecastYear = forecastDate.getFullYear();
                
                const forecastDateEl = document.createElement("p");
                
                forecastDateEl.setAttribute("class","mt-3 mb-0 forecast-date");
                
                forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
               
                forecastEls[i].append(forecastDateEl);
                
                const forecastWeatherEl = document.createElement("img");
                
                forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                
                forecastWeatherEl.setAttribute("alt",response.data.list[forecastIndex].weather[0].description);
                
                forecastEls[i].append(forecastWeatherEl);
                
                const forecastTempEl = document.createElement("p");
                
                forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                
                forecastEls[i].append(forecastTempEl);
                
                const forecastHumidityEl = document.createElement("p");
                
                forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
               
                forecastEls[i].append(forecastHumidityEl);
                }
            })
        });  
    }
   // Add event listener to the search button
    searchEl.addEventListener("click",function() {
        
        const searchTerm = inputEl.value;
        
        getWeather(searchTerm);
        
        searchHistory.push(searchTerm);
       
        // Store the updated search history in local storage
        localStorage.setItem("search",JSON.stringify(searchHistory));
       
        // Render the updated search history on the page
        renderSearchHistory();
    })
    
    // Add event listener to the clear history button
    clearEl.addEventListener("click",function() {
      
        // Clear the search history
        searchHistory = [];
       
        renderSearchHistory();
    })
    
    // Function to convert temperature from Kelvin to Fahrenheit
    function k2f(K) {
       
        return Math.floor((K - 273.15) *1.8 +32);
    }

    function renderSearchHistory() {
       
        // Clear the search history display
        historyEl.innerHTML = "";
        
        // Loop through the search history array and add each item to the display
        for (let i=0; i<searchHistory.length; i++) {
           
            const historyItem = document.createElement("input");
            
           
            historyItem.setAttribute("type","text");
           
            historyItem.setAttribute("readonly",true);
           
            historyItem.setAttribute("class", "form-control d-block bg-white");
           
            historyItem.setAttribute("value", searchHistory[i]);
           
            // Add event listener to the search history item to get the weather information for that city
            historyItem.addEventListener("click",function() {
               
                getWeather(historyItem.value);
            })
            
            // Append the search history item to the display
            historyEl.append(historyItem);
        }
    }

    renderSearchHistory();
    
    // Get the weather information of the last searched city and display it on the page
    if (searchHistory.length > 0) {
       
        getWeather(searchHistory[searchHistory.length - 1]);
    }




}
initPage();
