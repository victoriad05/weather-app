const API_KEY = '';
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

curLocation.addEventListener('click', () => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert('We could not get your location')
    }
});

const success = (position) => {
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}&units=metric`;
    fetchData();
}

const error = (error) => {
    inputInfo.innerHTML= error.message;
    inputInfo.classList.add("error");
};


function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    fetchData();
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
        // console.log(info);
        // const icon = info.weather[0];
        // console.log(icon);

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

        if(id >= 200 && id <= 232 && icon === '11d'){
            weatherImg.src = "./images/thounderstorm_day.svg";
        }else if(id >= 200 && id <= 232 && icon === '11n'){
            weatherImg.src = "./images/thounderstorm_night.svg";
        } else if(id >= 300 && id <= 321 || id >= 520 && id <= 531){
            weatherImg.src = "./images/shower_rain.svg";
        } else if(id >= 500 && id <= 504 && icon === '10d'){
            weatherImg.src = "./images/rain_day.svg";
        } else if(id >= 500 && id <= 504 && icon === '10n'){
            weatherImg.src = "./images/rain_night.svg";
        } else if(id === 511 || id >= 600 && id <= 622) {
            weatherImg.src = "./images/snow.svg";
        } else if(id >= 700 && id <= 781) {
            weatherImg.src = "./images/mist.svg";
        }else if(id == 800 && icon === '01d'){
            weatherImg.src = "./images/clear_day.svg";
        } else if(  id == 800 && icon === '01n'){
            weatherImg.src = "./images/clear_night.svg";
        }else if(id === 801 && icon === '02d'){
            weatherImg.src = "./images/few_clouds_day.svg";
        }else if(id === 801 && icon === '02n'){
            weatherImg.src = "./images/few_clouds_night.svg";
        }else if(id === 802){
            weatherImg.src = "./images/scattered_clouds.svg";
        } else if(id >= 803 && id <= 804){
            weatherImg.src = "./images/broken_clouds.svg";
        }
    }
}

arrowBack.addEventListener('click', () => {
    container.classList.remove('active');
    inputField.value = '';
})

