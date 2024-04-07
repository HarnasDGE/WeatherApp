import axios from "axios";
import { APIKEY_OPENWEATHERAPI, APIKEY_TOMTOM, CHANGE_MAIN_ROUTE, SET_ALTERNATIVE_ROUTES, SET_CONTROL_POINTS, SET_COORDS, SET_ROUTE, SET_ROUTE_TYPE, SET_WEATHER_ON_ROUTE } from "../constans/constans";
import { roundUpToFifteenMinutes } from "../components/methods/timeMethods";
import { fetchWeatherApi } from "openmeteo";

export const fetchRoute = (getStartPoint, getEndPoint) => {
    return async (dispatch, getState) => {
        await dispatch(fetchCoords(getStartPoint, getEndPoint));

        const state = getState();
        const {from, to} = state.roadState.coords;

        const startPoint = `${from.lat},${from.lon}`;
        const endPoint = `${to.lat},${to.lon}`;
    
        try {
            const response = await axios.get(`https://api.tomtom.com/routing/1/calculateRoute/${startPoint}:${endPoint}/json?maxAlternatives=2&key=${APIKEY_TOMTOM}`);
            const route = response.data;
            dispatch(setRoute(route));
            const newState = getState();
        } catch (error) {
            console.log(`Error Action [setRoute], ${error.message}`);
        }
    }
}

export const setRoute = (route) => ({
    type: SET_ROUTE,
    route
})

export const setRouteType = (routeType) => ({
    type: SET_ROUTE_TYPE,
    routeType
})

export const changeMainRoute = (index) => {
    return (dispatch, getState) => {
        const state = getState().roadState;
        console.log(`[changeMainRoute LOG] routes: `, state.route.routes);
        const routes = [...state.route.routes]; 
        const weatherOnRoute = [...state.weatherOnRoute];

        const [selectedRoute] = routes.splice(index,1);
        routes.unshift(selectedRoute);

        const [selectedWeather] = weatherOnRoute.splice(index,1);
        weatherOnRoute.unshift(selectedWeather);

        console.log(`[changeMainRoute LOG] new routes: `, {
            type: CHANGE_MAIN_ROUTE,
            route: routes,
            weatherOnRoute: weatherOnRoute
        });

        dispatch(setRoute({
            ...state.route,
            routes: routes
        }));
        dispatch(setWeather(weatherOnRoute));
    }
}



export const fetchCoords = (startPoint, endPoint) => {
    return async (dispatch) => {
        try {
            const responseFrom = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${startPoint}&limit=1&appid=${APIKEY_OPENWEATHERAPI}`)
            try {
                const responseTo = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${endPoint}&limit=1&appid=${APIKEY_OPENWEATHERAPI}`)
                const coords = {
                    from: {
                        name: responseFrom.name,
                        lat: responseFrom.data[0].lat,
                        lon: responseFrom.data[0].lon
                    },
                    to: {
                        name: responseTo.name,
                        lat: responseTo.data[0].lat,
                        lon: responseTo.data[0].lon
                    }
                  }
                  dispatch(setCoords(coords));
            } catch (error) {
                console.error(`Error Action [fetchCoordPlaces], ${error.message}`)
            }
        } catch (error) {
            console.error(`Error Action [fetchCoordPlaces], ${error.message}`)
        }
    }
}

export const setCoords = (coords) => ({
    type: SET_COORDS,
    coords
})

export const fetchWeatherInformation = () => {
    return async (dispatch, getState) => {
        const weatherOnRoutes = [];
        const state = getState().roadState;
        if (!state.route || !state.route.routes || state.route.routes.length === 0) {
            console.error(`[FETCH WEATHER INFORMATION FAILED] Route informations are empty`);
            return;
        }
        for(let i = 0; i < state.route.routes.length; i++) {
            const routeCoords = state.route.routes[i].legs[0].points;
            const startCoords = `${routeCoords[0].latitude},${routeCoords[0].longitude}`;
            const interval = Math.floor(routeCoords.length / state.controlPoints + 1);
            const selectedCoords = routeCoords.filter((_, index) => index % interval === 0 || index === routeCoords.length - 1);

            const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

            const weatherDetails = await Promise.all(selectedCoords.map(async (coord, index) => {
                await delay(index * 1000);
                const pointCoords = `${coord.latitude},${coord.longitude}`;
                const responseTomTom = await axios.get(`https://api.tomtom.com/routing/1/calculateRoute/${startCoords}:${pointCoords}/json?key=${APIKEY_TOMTOM}`);
                const lengthInMeters = responseTomTom.data.routes[0].summary.lengthInMeters;
                const travelTimeInSeconds = responseTomTom.data.routes[0].summary.travelTimeInSeconds;
                const timeToGetThisPoint = responseTomTom.data.routes[0].summary.arrivalTime.substring(0, 16);
                const dayForecast = timeToGetThisPoint.substring(0,10);
                const roundedTime = roundUpToFifteenMinutes(timeToGetThisPoint);
                const params = {
                    "latitude": coord.latitude,
                    "longitude": coord.longitude,
                    "minutely_15": ["temperature_2m", "weather_code", "is_day"],
                    "start_date": dayForecast,
                    "end_date": dayForecast
                };
                const url = "https://api.open-meteo.com/v1/forecast";
                const openMeteoResponses = await fetchWeatherApi(url, params);
                const range = (start, stop, step) =>
                    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
                const response = openMeteoResponses[0];
                const utcOffsetSeconds = response.utcOffsetSeconds();
                const minutely15 = response.minutely15();
                const weatherData = {
                    minutely15: {
                        time: range(Number(minutely15.time()), Number(minutely15.timeEnd()), minutely15.interval()).map(
                            (t) => new Date((t + utcOffsetSeconds) * 1000)
                        ),
                        temperature2m: minutely15.variables(0).valuesArray(),
                        weatherCode: minutely15.variables(1).valuesArray(),
                        isDay: minutely15.variables(2).valuesArray(),
                    },
                };

                const roundedDateTime = new Date(roundedTime);
                const timeIndex = weatherData.minutely15.time.findIndex(t => {
                    const rounded = roundUpToFifteenMinutes(t.toISOString().substring(0, 16));
                    const roundedDate = new Date(rounded);
                    return roundedDate.getTime() === roundedDateTime.getTime();
                });
                let weather = [];
                if(timeIndex !== -1) {
                    weather = {
                        time: roundedDateTime,
                        temperature_2m: weatherData.minutely15.temperature2m[timeIndex],
                        weather_code: weatherData.minutely15.weatherCode[timeIndex],
                        isDay: weatherData.minutely15.isDay[timeIndex]
                    }
                }

                const openWeatherMapResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${coord.latitude}&lon=${coord.longitude}&limit=1&appid=${APIKEY_OPENWEATHERAPI}`);
                const locationName = openWeatherMapResponse.data[0]?.name || "Place on the road";

                const actualWeather = {
                    name: locationName,
                    lengthInMeters: lengthInMeters,
                    travelTimeInSeconds: travelTimeInSeconds,
                    temperature: `${Math.round(weather.temperature_2m * 10) / 10}°C`,
                    code: weather.weather_code,
                    isDay: weather.isDay,
                    lat: coord.latitude,
                    lon: coord.longitude,
                };

                return actualWeather
            }))
            weatherOnRoutes.push(weatherDetails);
        }
        dispatch(setWeather(weatherOnRoutes));
    }
}

export const setWeather = (weatherOnRoute) => ({
    type: SET_WEATHER_ON_ROUTE,
    weatherOnRoute
})

export const setControlPoints = (controlPoints) => ({
    type: SET_CONTROL_POINTS,
    controlPoints
})

export const fetchAllDataAboutRoute = (getStartPoint, getEndPoint) => {
    return async (dispatch) => {
        await dispatch(fetchRoute(getStartPoint, getEndPoint));
        await dispatch(fetchWeatherInformation());
    }
}

export const setAlternativeRoutes = (alternativeRoutes) => ({
    type: SET_ALTERNATIVE_ROUTES,
    alternativeRoutes
})