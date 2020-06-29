const urlAPI = "https://api.openweathermap.org/data/2.5/forecast?";
const apiKey = "dee95c5e85271312989787cc5576e747";
const city = $("#inputLocation");

let citySearch = "";

const urlUV = "https://api.openweathermap.org/data/2.5/onecall?"

let history = [];

history = JSON.parse(localStorage.getItem("history"));

if (!history) {
    history = [];
}

showHistory();


$("#search-city").on("submit", function() {
    let inputValue = city.val();
    citySearch = inputValue;
    // location.reload();
    const searchWrapper = $("<div class='city'>")
    const p = $("<p>");

    p.text(inputValue);

    searchWrapper.append(p);

    $(".search-history").append(searchWrapper);
    searchAPI();
});
$(".city").on("click", function() {
    let historyBtn = $(this).text();
    citySearch = historyBtn;

    console.log(city);
    // location.reload();
    searchAPI();
    $(".forcast").empty();
})

function showHistory() {
    if (!history) {

    } else {
        $(".search-history").empty();
        for (let i = 0; i < history.length; i++) {
            console.log(history);

            const searchWrapper = $("<div class='city'>")
            const p = $("<p>");

            p.text(history[i]);

            searchWrapper.append(p);

            $(".search-history").append(searchWrapper);

        }

    }

}


function searchAPI() {
    event.preventDefault();


    const location = citySearch;
    console.log(location);


    const searchURL = urlAPI + "q=" + location + "&appid=" + apiKey + "&units=metric";

    $.ajax({
        url: searchURL,
        method: "GET"
    }).then(function(responseMain) {
        console.log(responseMain);

        let nameCity = responseMain.city.name;
        let latitude = responseMain.city.coord.lat;
        let longitude = responseMain.city.coord.lon;
        let currentDay = "";
        let currentTemp = "";
        let currentHum = "";
        let currentWind = "";
        let currentUV = "";



        const searchUV = urlUV + "lat=" + latitude + "&lon=" + longitude + "&exclude=hourly,minutelyy&units=metric&appid=" + apiKey;

        $.ajax({
            url: searchUV,
            method: "GET"

        }).then(function(response) {
            // console.log(response);

            $(".show-name").empty();
            $(".show-temp").empty();
            $(".show-hum").empty();
            $(".show-wind").empty();
            $(".show-uv").empty();


            currentDay = moment(response.current.dt * 1000).format('L');
            // console.log(currentDay);
            currentTemp = response.current.temp;
            currentHum = response.current.humidity;
            currentWind = response.current.wind_speed;
            currentUV = response.current.uvi;

            // console.log(currentDay);

            $(".show-name").text(nameCity + " (" + currentDay + ")")
            $(".show-temp").append("temperature: " + currentTemp + "&#8451;");
            $(".show-hum").text("Humidity: " + currentHum + "%");
            $(".show-wind").text("Wind Speed: " + currentWind + "km/h");
            $(".show-uv").append("UV index: <span>" + currentUV + "<span>")

            let dailyForcastAll = response.daily

            let cont = 6;

            let dailyForcast = dailyForcastAll.slice(1, cont);

            console.log(dailyForcast);
            $(".forcast").empty();

            Object.keys(dailyForcast).forEach(function(key) {

                // console.log(key, dailyForcast[key]);


                let date = dailyForcast[key].dt;
                date = moment(date * 1000).format('L');

                let temp = dailyForcast[key].temp.day;
                let humidity = dailyForcast[key].humidity;

                const forcastCard = $("<div class='col'>");
                const forcastDate = $("<h5>");
                const forcastTemp = $("<p>");
                const forcastHumidity = $("<p>");

                forcastDate.text(date);
                forcastTemp.append("temp: " + temp + "&#8451;");
                forcastHumidity.text("Humidity: " + humidity + "%");

                forcastCard.append(forcastDate, forcastTemp, forcastHumidity);
                $(".forcast").append(forcastCard);

            })

        })



        history.indexOf(nameCity) === -1 ? history.push(nameCity) : console.log("item already on array");
        localStorage.setItem("history", JSON.stringify(history));






    })
}