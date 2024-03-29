const weatherCodes = [
    {
      code: 0,
      dayIcon: "https://openweathermap.org/img/wn/01d@2x.png",
      nightIcon: "https://openweathermap.org/img/wn/01n@2x.png",
      description: "Clear sky"
    },
    {
      code: 1,
      dayIcon: "https://openweathermap.org/img/wn/02d@2x.png",
      nightIcon: "https://openweathermap.org/img/wn/02n@2x.png",
      description: "Mainly clear"
    },
    {
      code: 2,
      dayIcon: "https://openweathermap.org/img/wn/02d@2x.png",
      nightIcon: "https://openweathermap.org/img/wn/02n@2x.png",
      description: "Partly cloudy"
    },
    {
      code: 3,
      dayIcon: "https://openweathermap.org/img/wn/02d@2x.png",
      nightIcon: "https://openweathermap.org/img/wn/02n@2x.png",
      description: "Overcast"
    },
    {
      code: 45,
      dayIcon: "https://openweathermap.org/img/wn/50d@2x.png",
      nightIcon: "https://openweathermap.org/img/wn/50n@2x.png",
      description: "Fog"
    },
    {
      code: 48,
      dayIcon: "https://openweathermap.org/img/wn/50d@2x.png",
      nightIcon: "https://openweathermap.org/img/wn/50n@2x.png",
      description: "Depositing rime fog"
    },
    {
      code: 51,
      dayIcon: "https://openweathermap.org/img/wn/09d@2x.png",
      nightIcon: "https://openweathermap.org/img/wn/09n@2x.png",
      description: "Light drizzle"
    },
    {
      code: 53,
      dayIcon: "https://openweathermap.org/img/wn/09d@2x.png",
      nightIcon: "https://openweathermap.org/img/wn/09n@2x.png",
      description: "Moderate drizzle"
    },
    {
      code: 55,
      dayIcon: "https://openweathermap.org/img/wn/09d@2x.png",
      nightIcon: "https://openweathermap.org/img/wn/09n@2x.png",
      description: "Dense drizzle"
    },
    {
      code: 56,
      dayIcon: "https://openweathermap.org/img/wn/13d@2x.png",
      nightIcon: "https://openweathermap.org/img/wn/13n@2x.png",
      description: "Light freezing drizzle"
    },
    {
      code: 57,
      dayIcon: "https://openweathermap.org/img/wn/13d@2x.png",
      nightIcon: "https://openweathermap.org/img/wn/13n@2x.png",
      description: "Dense freezing drizzle"
    },
    {
      code: 61,
      dayIcon: "https://openweathermap.org/img/wn/10d@2x.png",
      nightIcon: "https://openweathermap.org/img/wn/10n@2x.png",
      description: "Slight rain"
    },
    {
      code: 63,
      dayIcon: "https://openweathermap.org/img/wn/10d@2x.png",
      nightIcon: "https://openweathermap.org/img/wn/10n@2x.png",
      description: "Moderate rain"
    },
    {
      code: 65,
      dayIcon: "https://openweathermap.org/img/wn/10d@2x.png",
      nightIcon: "https://openweathermap.org/img/wn/10n@2x.png",
      description: "Heavy rain"
    },
    {
      code: 66,
      dayIcon: "https://openweathermap.org/img/wn/13d@2x.png",
      nightIcon: "https://openweathermap.org/img/wn/13n@2x.png",
      description: "Light freezing rain"
    },
    {
      code: 67,
      dayIcon: "https://openweathermap.org/img/wn/13d@2x.png",
      nightIcon: "https://openweathermap.org/img/wn/13n@2x.png",
      description: "Heavy freezing rain"
    },
    {
      code: 71,
      dayIcon: "https://openweathermap.org/img/wn/13d@2x.png",
      nightIcon: "https://openweathermap.org/img/wn/13n@2x.png",
      description: "Slight snow fall"
    },
    {
      code: 73,
      dayIcon: "https://openweathermap.org/img/wn/13d@2x.png",
      nightIcon: "https://openweathermap.org/img/wn/13n@2x.png",
      description: "Moderate snow fall"
    },
    {
        code: 75,
        dayIcon: "https://openweathermap.org/img/wn/13d@2x.png",
        nightIcon: "https://openweathermap.org/img/wn/13n@2x.png",
        description: "Heavy Intensity snow fall"
    },
    {
        code: 77,
        dayIcon: "https://openweathermap.org/img/wn/13d@2x.png",
        nightIcon: "https://openweathermap.org/img/wn/13n@2x.png",
        description: "Snow grains"
    },
    {
        code: 80,
        dayIcon: "https://openweathermap.org/img/wn/10d@2x.png",
        nightIcon: "https://openweathermap.org/img/wn/10n@2x.png",
        description: "Slight rain shower"
    },
    {
        code: 81,
        dayIcon: "https://openweathermap.org/img/wn/10d@2x.png",
        nightIcon: "https://openweathermap.org/img/wn/10n@2x.png",
        description: "Moderate rain shower"
    },
    {
        code: 82,
        dayIcon: "https://openweathermap.org/img/wn/10d@2x.png",
        nightIcon: "https://openweathermap.org/img/wn/10n@2x.png",
        description: "Violent rain shower"
    },
    {
        code: 85,
        dayIcon: "https://openweathermap.org/img/wn/13d@2x.png",
        nightIcon: "https://openweathermap.org/img/wn/13n@2x.png",
        description: "Slight snow shower"
    },
    {
        code: 86,
        dayIcon: "https://openweathermap.org/img/wn/13d@2x.png",
        nightIcon: "https://openweathermap.org/img/wn/13n@2x.png",
        description: "Heavy snow shower"
    },
    {
        code: 95,
        dayIcon: "https://openweathermap.org/img/wn/11d@2x.png",
        nightIcon: "https://openweathermap.org/img/wn/11n@2x.png",
        description: "Thunderstorm"
    },
    {
        code: 96,
        dayIcon: "https://openweathermap.org/img/wn/11d@2x.png",
        nightIcon: "https://openweathermap.org/img/wn/11n@2x.png",
        description: "Slight thunderstorm"
    },
    {
        code: 99,
        dayIcon: "https://openweathermap.org/img/wn/11d@2x.png",
        nightIcon: "https://openweathermap.org/img/wn/11n@2x.png",
        description: "Heavy hail thunderstorm"
    },
]
export const getIconLink = (codeWeather, isDay) => {
    let findCode = weatherCodes.find(el => el.code === codeWeather);
    if(!findCode) {
      findCode = {
        code: 100,
        dayIcon: "https://openweathermap.org/img/wn/50n@2x.png",
        nightIcon: "https://openweathermap.org/img/wn/50n@2x.png",
        description: "Ohne Icon"
      }
    }
    return isDay ? findCode.dayIcon : findCode.nightIcon;
}

export const getIconLinkWithHour = (codeWeather, hour) => {
  let findCode = weatherCodes.find(el => el.code === codeWeather);
  if(!findCode) {
    findCode = {
      code: 100,
      dayIcon: "https://openweathermap.org/img/wn/50n@2x.png",
      nightIcon: "https://openweathermap.org/img/wn/50n@2x.png",
      description: "Ohne Icon"
    }
  }

  const isDate = hour instanceof Date;
  let hourOfDay = isDate ? hour.getHours() : 12; 

  return hourOfDay > 7 && hourOfDay < 20 ? findCode.dayIcon : findCode.nightIcon;
}