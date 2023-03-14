const container = document.querySelector('.container');
const startBtn = document.querySelector('.start_btn')
const weatherInput =  document.querySelector('.input-weather');
const inputInfo = document.querySelector('.input_info');
const inputField = weatherInput.querySelector('input');
const curLocation  = weatherInput.querySelector('button');
const weatherImg = document.querySelector('.weather_img');
const arrowBack =  document.querySelector('button i');
const weatherCont = container.querySelector('.weather');

let api;

startBtn.addEventListener('click', () =>{
    container.classList.add('act');
})

inputField.addEventListener('keydown', e => {
    if(e.key === 'Enter' && inputField.value != ''){
        requestApi(inputField.value);
    }
});

function loadApiKey() {
       return fetch('config.json')
      .then(res => res.json())
      .then(result => {
        const apiKey = result.api_key;
        return apiKey;
      })
      .catch(error => {
        console.error('Error loading config.json', error);
      });
  }

curLocation.addEventListener('click', () => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert('We could not get your location')
    }
});

const success = (position,) => {
    const {latitude, longitude} = position.coords;
    loadApiKey().then(apiKey => {
        api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}&units=metric`;
        fetchData();
    })
}

const error = (error) => {
    inputInfo.innerHTML= error.message;
    inputInfo.classList.add("error");
};


function requestApi(city,) {
    loadApiKey().then(apiKey => {
        api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        fetchData();
    })
}   

function fetchData() {
    inputInfo.innerHTML = 'Getting weather details...';
    inputInfo.classList.add('pending')
    fetch(api).then(res => res.json()).then(result => details(result));
}

function details(info){
    if(info.cod === '404'){
        inputInfo.innerHTML = `${inputField.value} isn't valid name of the city`;
        inputInfo.classList.replace('pending','error');
    } else {
        inputInfo.classList.remove('pending','error');
        container.classList.add('active');

        const city = info.name;
        const country = info.sys.country;
        const {description, id, icon} = info.weather[0];
        const {temp, feels_like, humidity, pressure} = info.main;
        const speed = info.wind.speed;
     
        const regionName = new Intl.DisplayNames(
            ['en'], {type: 'region'}
        );
    
        weatherCont.querySelector(".temperature span").innerText = Math.floor(temp);
        weatherCont.querySelector(".descr").innerText = description;
        weatherCont.querySelector(".location span").innerText = `${city}, ${regionName.of(country)}`;
        weatherCont.querySelector(".humidity span").innerText = humidity;
        weatherCont.querySelector(".feels span").innerText = Math.floor(feels_like);
        weatherCont.querySelector(".pressure span").innerText = pressure;
        weatherCont.querySelector(".wind span").innerText = Math.floor(speed * 3.6);

        const images = {
            "01d" : "./images/clear_day.svg",
            "01n" : "./images/clear_night.svg",
            "02d" : "./images/few_clouds_day.svg",
            "02n" : "./images/few_clouds_night.svg",
            "03d" : "./images/scattered_clouds.svg",
            "04d" : "./images/broken_clouds.svg",
            "09d" : "./images/shower_rain.svg",
            "10d" : "./images/rain_day.svg",
            "10n" : "./images/rain_night.svg",
            "11d" : "./images/thunderstorm_day.svg",
            "11n" : "./images/thunderstorm_night.svg",
            "13d" : "./images/snow.svg",
            "50d" : "./images/mist.svg",
        };

        weatherImg.src = images[icon];
    }
}

arrowBack.addEventListener('click', () => {
    container.classList.remove('active');
    inputField.value = '';
})

