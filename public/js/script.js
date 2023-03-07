// Iegūst atsauces uz HTML elementiem, kurus vēlāk izmantosim datu ievadīšanai
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");

// Masīvi, kas satur dienu un mēnešu nosaukumus, kas tiks izmantoti datuma un laika attēlošanai
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// API atslēga, kas tiks izmantota, lai piekļūtu OpenWeatherMap API datiem

const API_KEY = "49cc8c821cd2aff9af04c9f98c36eb74";

// setInterval funkcija, kas atjauno laika datus ik pēc 1 sekundes

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();

  // Ievada laika datus HTML elementā

  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) 
    ;

// Ievada datuma datus HTML elementā

  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

// Iegūst laikapstākļu datus no OpenWeatherMap API, izmantojot geolokāciju, un parāda tos HTML lapā

getWeatherData();
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
}

  // Izvelkam nepieciešamos laika apstākļu datus no saņemtā datu objekta

function showWeatherData(data) {
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

  // Ievietojam laika joslas nosaukumu un koordinātas attiecīgiem HTML elementiem

  timezone.innerHTML = data.timezone;
  countryEl.innerHTML = data.lat + "N " + data.lon + "E";

  // Izveidojam HTML, lai parādītu saullēktu un saulrietu laikus

  currentWeatherItemsEl.innerHTML = `

    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format("HH:mm")}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format("HH:mm")}</div>
    </div>
    
    
    `;

  // Izveidojam HTML, lai parādītu laika prognozes citiem dienām

  // Ja diena ir šodien, tad parādām detaļas par pašreizējiem laika apstākļiem


  let otherDayForcast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${
              day.weather[0].icon
            }@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("dddd")}</div>
                <div class="temp">Night : ${day.temp.night}&#176;C</div>
                <div class="temp">Day : ${day.temp.day}&#176;C</div>
            </div>
            
            `;   // Ja diena nav šodien, tad parādām saīsinātu informāciju par laika apstākļiem

    } else {
      otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("ddd")}</div>
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night : ${day.temp.night}&#176;C</div>
                <div class="temp">Day : ${day.temp.day}&#176;C</div>
            </div>
            
            `;
    }
  });
// Ievietojam laika prognozes HTML elementā
  weatherForecastEl.innerHTML = otherDayForcast;
}
